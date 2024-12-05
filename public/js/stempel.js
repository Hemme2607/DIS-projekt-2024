document.addEventListener("DOMContentLoaded", async () => {
  //Henter brugerens data fra session storage
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    alert("Du er ikke logget ind");
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("navn").textContent = user.navn;

  //Henter stempler fra databasen ud fra ID
  try {
    const response = await fetch(`/api/stamps/${user.id}`);
    const stempler = await response.json();

    stempler.forEach((stempel) => {
      const div = document.getElementById(
        `stempel-container-${stempel.product_category}`
      );
      if (div) {
        div.innerHTML = `
          <h3>${stempel.product_category}</h3>
          <p>Stamps: ${stempel.stamp_count} / 10</p>
        `;
      }
    });
  } catch {
    console.log("Kunne ikke hente stempler");
  }

  //Henter log ud knap fra html
  document.getElementById("logout").addEventListener("click", () => {
    //Fjerner brugerens data fra session storage og sender brugeren til login siden
    sessionStorage.removeItem("user");
    window.location.href = "/login.html";
  });
});
