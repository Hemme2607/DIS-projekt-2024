document.addEventListener("DOMContentLoaded", () => {
    const cartProducts = document.getElementById("cartProducts"); // Refererer til elementet med id'et cartProducts
    const payButton = document.getElementById("payButton"); // Knappen "Betal nu"

    // 1. Hent produkter fra sessionStorage
    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    const user = JSON.parse(sessionStorage.getItem("user")); // Hent user-data fra sessionStorage

    // 2. Hvis kurven er tom, vis en besked og deaktiver "Betal nu"-knappen
    if (cartItems.length === 0) {
        cartProducts.textContent = "Din kurv er tom.";
        payButton.disabled = true; // Deaktiver knappen, hvis kurven er tom
        payButton.style.backgroundColor = "gray"; // Giv knappen en grå farve for at vise, den ikke kan bruges
        return;
    }

    // 3. Dynamisk tilføj produkter til cartProducts
    let totalSum = 0;

    cartItems.forEach((item) => {
        // Opret en div for produktet
        const productContainer = document.createElement("div");
        productContainer.style.display = "flex";
        productContainer.style.justifyContent = "space-between";
        productContainer.style.alignItems = "center";
        productContainer.style.marginBottom = "10px";

        // Opret teksten for produktet
        const productElement = document.createElement("span");
        productElement.textContent = `${item.name} - ${item.category} (Pris: ${item.price} kr.)`;

        // Tilføj produkt-containeren til DOM'en
        productContainer.appendChild(productElement);
        cartProducts.appendChild(productContainer);

        // Beregn totalpris
        totalSum += parseFloat(item.price);
    });

    // 4. Tilføj den samlede pris nederst
    const totalPriceElement = document.createElement("p");
    totalPriceElement.innerHTML = `<strong>Samlet pris:</strong> ${totalSum} kr.`;
    cartProducts.appendChild(totalPriceElement);

    // 5. Håndter klik på "Betal nu"-knappen
    payButton.addEventListener("click", async () => {
        // Tjek om brugerdata og produkter findes
        if (!user || cartItems.length === 0) {
            alert("Ingen brugerdata eller produkter fundet!");
            return;
        }

        // Forbered data til at sende til backend
        const orderData = {
            userID: user.id,
            products: cartItems // Send hele kurven inkl. category
        };

        try {
            // Send data til backend med en POST-anmodning
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert("Ordren er blevet gemt!");
                sessionStorage.removeItem("cartItems"); // Tøm kurven
                location.reload(); // Genindlæs siden for at vise en opdateret kurv
            } else {
                alert("Der opstod en fejl ved gemning af ordren.");
            }
        } catch (error) {
            console.error("Fejl ved kommunikation med serveren:", error);
            alert("Kunne ikke gemme ordren.");
        }
    });
});
