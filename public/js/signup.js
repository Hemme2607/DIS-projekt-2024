//Henter alle elementer fra HTML
const opretProfil = document.getElementById("makeProfile");
const navn = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const telefon = document.getElementById("phone");
const fDato = document.getElementById("dob");

// Opretter en ny bruger ud fra de indtastede oplysninger
opretProfil.addEventListener("click", async () => {
  const nyoprettetBruger = {
    navn: navn.value,
    email: email.value,
    password: password.value,
    telefon: telefon.value,
    fDato: fDato.value,
  };

  //Valider at email skal indeholde et "@" "."
  if (!email.value.includes("@") || !email.value.includes(".")) {
    alert("Email skal indeholde '@' og '.'");
    return;
  }

  console.log(nyoprettetBruger);
  fetch("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nyoprettetBruger),
  })
    .then((response) => response.json())
    .then((nyoprettetBruger) => {
      console.log(nyoprettetBruger);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
