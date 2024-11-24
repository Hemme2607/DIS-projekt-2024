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

  //Laver et objekt med email og password
  const loginData = {
    email,
    password,
  };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    //Hvis responsen ikke er ok, vises der en fejl.
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Fejl ved login");
        });
      }
      return response.json();
    })
    .then((userData) => {
      //Gemmer brugerens data i session storage
      sessionStorage.setItem("user", JSON.stringify(userData));
      alert("Du er nu logget ind");
      window.location.href = "/stempel.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
});
