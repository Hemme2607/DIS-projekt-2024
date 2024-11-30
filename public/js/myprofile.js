//Henter brugeren fra session storage
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  //Hvis brugeren ikke er logget ind, sendes brugeren til login siden
  alert("Du er ikke logget ind");
  window.location.href = "/login.html";
} else {
  document.getElementById("profilNavn").innerHTML = user.navn;
  document.getElementById("profilEmail").innerHTML = user.email;
  document.getElementById("profilTelefon").innerHTML = user.telefon;
  document.getElementById("profileDob").innerHTML = user.fDato;
  document.getElementById("navn").textContent = user.navn;
}

//tillader også at logge ud
const logudKnap = document.getElementById("logout");
logudKnap.addEventListener("click", () => {
  sessionStorage.clear();
  alert("Du er nu logget ud");
  window.location.href = "/login.html";
});
