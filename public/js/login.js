//Henter alle elementer fra HTML
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const loginKnap = document.getElementById("login");

// Logger brugeren ind
loginKnap.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  //Sikrer at email og password er udfyldt
  if (!email || !password) {
    alert("Fyld email og password feltererne ud");
    return;
  }
  try {
    //Step 1: her laver vi login anmodningen
    const loginData = {
      email,
      password,
    };
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Fejl ved login");
    }
    //Gemmer brugerens data i en variabel, så vi kan gemme i session storage
    const userData = await response.json();

    //Step 2: Nu sendes bekræftelses koden til brugeren via SMS
    const authResponse = await fetch("/authenticateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!authResponse.ok) {
      const data = await authResponse.json();
      throw new Error(
        data.error || "Fejl ved autentificering, beskeden blev ikke sendt"
      );
    }
    alert("Beskræftelseskode er sendt til din telefon");

    //Step 3: Brugeren indtaster bekræftelseskoden, og vi tjekker om den er korrekt
    const authCode = prompt("Indtast din bekræftelseskode");
    const checkAuthCodeResponse = await fetch("/checkAuthCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code: authCode }),
    });

    if (!checkAuthCodeResponse.ok) {
      const data = await checkAuthCodeResponse.json();
      throw new Error(data.error || "Fejl ved autentificering, forkert kode");
    }
    //Gemmer brugerens i session storage
    sessionStorage.setItem("user", JSON.stringify(userData));

    alert("Login succesfuld");
    window.location.href = "/forside.html";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
});
