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

    //Hvis login fejler, kommer der en fejl
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Fejl ved login");
    }

    //Step 2: Nu sendes bekræftelses koden til brugeren via SMS
    const authResponse = await fetch("/authenticateUser", {
      method: "POST",
      credentials: "include",
    });

    //Hvis SMS'en ikke sendes korrekt, kastes en fejl
    if (!authResponse.ok) {
      const data = await authResponse.json();
      throw new Error(
        data.error || "Fejl ved autentificering, beskeden blev ikke sendt"
      );
    }

    // Step 3: Omdiriger til authCode.html for at indtaste bekræftelseskoden
    alert("Bekræftelseskode er sendt til din telefon.");
    window.location.href = "/authenticate.html"; // Send brugeren til authCode.html
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
});
