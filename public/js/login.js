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
    alert("Fyld alle felter ud");
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
      if (!response.ok) throw new Error("Fejl ved login");
      return response.json();
    })
    .then((loginData) => {
      console.log(loginData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
