document.addEventListener("DOMContentLoaded", async () => {
  try {
    //Henter brugerens data
    const response = await fetch("/getUserData");

    //Hvis responsen ikke er ok, kastes en fejl
    if (!response.ok) {
      throw new Error("Error getting user data");
    }

    //Gemmer brugerens data i en variabel
    const user = await response.json();

    //Opdatere brugerens data
    document.getElementById("profilNavn").innerHTML = user.user.navn;
    document.getElementById("profilEmail").innerHTML = user.user.email;
    document.getElementById("profilTelefon").innerHTML = user.user.telefon;
    document.getElementById("profileDob").innerHTML = user.user.fDato;

    //Muliggør logud knap
    document.getElementById("logout").addEventListener("click", async () => {
      try {
        const response = await fetch("/logout", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Kunne ikke logge ud");
        }
        window.location.href = "/login.html";
      } catch (error) {
        console.error("Fejl ved log ud:", error.message);
        alert("Der opstod en fejl under log ud.");
      }
    });
  } catch (error) {
    alert("You are not logged in");
    window.location.href = "/login.html";
  }
});
