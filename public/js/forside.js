document.addEventListener("DOMContentLoaded", async () => {
  try {
    //Henter brugerdata fra serveren
    const response = await fetch("/getUserData", {
      method: "GET",
      credentials: "include", // Sender cookies med
    });

    if (!response.ok) {
      throw new Error("Du er ikke logget ind");
    }

    //Henter brugerens data og opdaterer siden og opdaterer navn
    const user = await response.json();
    document.getElementById("navn").textContent = user.user.navn;

    //cookie popup
    const cookiePopup = document.getElementById("cookie-popup");
    const acceptCookie = document.getElementById("accept-cookie");
    const rejectCookie = document.getElementById("reject-cookie");

    //Her tjekker vi om brugeren har accepteret cookies i forvejen
    if (!document.cookie.includes("cookiesAccepted=true")) {
      cookiePopup.classList.remove("hidden");
    }

    //Hvis brugeren trykker på accepter cookies
    acceptCookie.addEventListener("click", () => {
      document.cookie =
        "cookiesAccepted=true; path=/; max-age=" + 60 * 60 * 24 * 30; // 30 dage
      cookiePopup.classList.add("hidden");
    });

    //Hvis brugeren trykker på afvis cookies
    rejectCookie.addEventListener("click", () => {
      alert("Du skal acceptere cookies for at kunne bruge siden");
    });

    //Muliggør logud knap
    const logudKnap = document.getElementById("logout");
    logudKnap.addEventListener("click", async () => {
      const logoutResponse = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      if (logoutResponse.ok) {
        document.cookie = "token=; Max-Age=0; path=/";
        alert("Du er nu logget ud");
        window.location.href = "/login.html";
      } else {
        alert("Der skete en fejl, prøv igen");
      }
    });
  } catch (error) {
    console.error("Error in forside.js:", error.message);
    alert("Du er ikke logget ind. Fejl" + error.message);
    window.location.href = "/login.html";
  }
});
