document.addEventListener("DOMContentLoaded", async () => {
  //Starter med at hente brugerens data
  try {
    const response = await fetch("/getUserData", {
      method: "GET",
      credentials: "include",
    });
    //Hvis responsen ikke er ok, kastes en fejl
    if (!response.ok) {
      throw new Error("Du er ikke logget ind");
    }
    //Gemmer brugerens data i en variabel
    const user = await response.json();

    //Opdatere brugeren navn
    document.getElementById("navn").textContent = user.user.navn;

    //Henter stempler fra databasen ud fra ID
    const stemplerResponse = await fetch(`/api/stamps/${user.user.id}`, {
      method: "GET",
      credentials: "include",
    });
    //Hvis responsen ikke er ok, kastes en fejl
    if (!stemplerResponse.ok) {
      throw new Error("Kunne ikke hente stempler");
    }

    //Den modtagne data fra databasen bliver gemt i en variabel
    const stempler = await stemplerResponse.json();

    //For hver stempel, opdateres antallet af stempler i HTML
    stempler.forEach((stempel) => {
      const div = document.getElementById(
        `stempel-container-${stempel.product_category}`
      );
      //Hvis div eksisterer, opdateres indholdet
      if (div) {
        div.innerHTML = `
          <h3>${stempel.product_category}</h3>
          <p>Stamps: ${stempel.stamp_count} / 10</p>
        `;
      }
    });
  } catch (error) {
    console.error("Fejl:", error.message);
    //Hvis brugeren ikke er logget ind, sendes brugeren til login siden
    alert("Du er ikke logget ind");
    window.location.href = "/login.html";
  }

  //Muligør logud knapq
  document.getElementById("logout").addEventListener("click", async () => {
    try {
      //Sender en POST request til serveren for at logge brugeren ud
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      //Hvis responsen ikke er ok, kastes en fejl
      if (!response.ok) {
        throw new Error("Kunne ikke logge ud");
      }
      //Brugeren sendes til login siden, hvis log ud er succesfuld
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Fejl ved log ud:", error.message);
      alert("Der opstod en fejl under log ud.");
    }
  });
});
