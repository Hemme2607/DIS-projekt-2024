document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    alert("Du er ikke logget ind");
    window.location.href = "/login.html";
  } else {
    document.getElementById("navn").textContent = user.navn;
  }
  //Henter log ud knap fra html
  document.getElementById("logout").addEventListener("click", () => {
    //Fjerner brugerens data fra session storage og sender brugeren til login siden
    sessionStorage.removeItem("user");
    window.location.href = "/login.html";
  });
});
