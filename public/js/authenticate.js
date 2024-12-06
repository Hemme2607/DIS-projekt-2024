document.addEventListener("DOMContentLoaded", async () => {
  const verifyKnap = document.getElementById("verifyButton");
  const verifyKodeInput = document.getElementById("authCodeInput");

  //Modtager bekræftelseskoden og sender den til serveren
  verifyKnap.addEventListener("click", async () => {
    //Trim fjerner whitespace
    //bruger code for serveren forventer et objekt med nanvnet code
    const code = verifyKodeInput.value.trim();

    if (!code) {
      alert("Insert a confirmation code");
      return;
    }

    try {
      //sender bekræftelseskoden til serveren for validation
      const tjekAuthticationResponse = await fetch("/checkAuthCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!tjekAuthticationResponse.ok) {
        const data = await tjekAuthticationResponse.json();
        console.error("Error:", data.error || "Wrong confirmation code");
        throw new Error(data.error || "Wrong confirmation code");
      }

      // Hvis brugerdata er til stede, sendes brugeren til forsiden
      alert("The confirmation code is correct");
      window.location.href = "/forside.html";
    } catch (error) {
      console.error("Error:", error);
      alert("Der skete en fejl");
    }
  });
});
