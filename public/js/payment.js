document.addEventListener("DOMContentLoaded", () => {
    const cartProducts = document.getElementById("cartProducts"); // Refererer til elementet med id'et cartProducts

    // 1. Hent produkter fra sessionStorage
    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

    // 2. Hvis kurven er tom, vis en besked
    if (cartItems.length === 0) {
        cartProducts.textContent = "Din kurv er tom.";
        return;
    }

    // 3. Grupper produkter efter navn og beregn antal og totalpriser
    const productCount = {};
    cartItems.forEach((item) => {
        if (productCount[item.name]) {
            productCount[item.name].count += 1;
            productCount[item.name].totalPrice += parseFloat(item.price);
        } else {
            productCount[item.name] = {
                count: 1,
                totalPrice: parseFloat(item.price),
                pricePerItem: parseFloat(item.price),
            };
        }
    });

    // 4. Dynamisk tilføj produkter til cartProducts
    let totalSum = 0;

    Object.keys(productCount).forEach((productName) => {
        const product = productCount[productName];

        // Opret en div for produktet
        const productContainer = document.createElement("div");
        productContainer.style.display = "flex";
        productContainer.style.justifyContent = "space-between";
        productContainer.style.alignItems = "center";
        productContainer.style.marginBottom = "10px";

        // Opret teksten for produktet
        const productElement = document.createElement("span");
        productElement.textContent = `${productName} - ${product.count} stk. (Pris: ${product.totalPrice} kr.)`;

        // Opret en slet-knap
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Slet";
        deleteButton.style.border = "none";
        deleteButton.style.background = "transparent";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.color = "red";
        deleteButton.style.fontSize = "18px";

        // Event listener til at slette produktet
        deleteButton.addEventListener("click", () => {
            // Opdater sessionStorage ved at fjerne alle forekomster af dette produkt
            const updatedCartItems = cartItems.filter((item) => item.name !== productName);
            sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

            // Opdater siden
            location.reload(); // Genindlæs siden for at vise de opdaterede produkter
        });

        // Tilføj elementerne til produkt-containeren
        productContainer.appendChild(productElement);
        productContainer.appendChild(deleteButton);

        // Tilføj produkt-containeren til DOM'en
        cartProducts.appendChild(productContainer);

        // Beregn totalpris
        totalSum += product.totalPrice;
    });

    // 5. Tilføj den samlede pris
    const totalPriceElement = document.createElement("p");
    totalPriceElement.innerHTML = `<strong>Samlet pris:</strong> ${totalSum} kr.`;
    cartProducts.appendChild(totalPriceElement);
});
