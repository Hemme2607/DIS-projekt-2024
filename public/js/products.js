document.addEventListener("DOMContentLoaded", async () => {
    try {
        // **1. Hent produktdata og opdater sektionerne**
        const response = await fetch("/api/products");
        const products = await response.json();

        const juices = products.filter((product) => product.Category === "Juice");
        const sandwiches = products.filter((product) => product.Category === "Sandwich");
        const coffee = products.filter((product) => product.Category === "Coffee");

        // Opdater Juice-sektionen
        juices.forEach((juice, index) => {
            const juiceNameElement = document.getElementById(`juiceName${index + 1}`);
            const juicePriceElement = document.getElementById(`juicePrice${index + 1}`);

            if (juiceNameElement) juiceNameElement.textContent = juice.Name;
            if (juicePriceElement) juicePriceElement.textContent = `Price: ${juice.Price} kr.`;
        });

        // Opdater Sandwich-sektionen
        sandwiches.forEach((sandwich, index) => {
            const sandwichNameElement = document.getElementById(`sandwichName${index + 1}`);
            const sandwichPriceElement = document.getElementById(`sandwichPrice${index + 1}`);

            if (sandwichNameElement) sandwichNameElement.textContent = sandwich.Name;
            if (sandwichPriceElement)
                sandwichPriceElement.textContent = `Price: ${sandwich.Price} kr.`;
        });

        // Opdater Kaffe-sektionen
        coffee.forEach((coffeeItem, index) => {
            const coffeeNameElement = document.getElementById(`coffeeName${index + 1}`);
            const coffeePriceElement = document.getElementById(`coffeePrice${index + 1}`);

            if (coffeeNameElement) coffeeNameElement.textContent = coffeeItem.Name;
            if (coffeePriceElement)
                coffeePriceElement.textContent = `Price: ${coffeeItem.Price} kr.`;
        });
    } catch (error) {
        console.error("Kunne ikke hente produkter:", error);
    }

    // **2. Håndtering af kurven og localStorage**
    const cartDropdown = document.getElementById("cartDropdown");
    const cartButton = document.querySelector(".cart");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; // Hent fra localStorage

    // Funktion: Opdater dropdown-menuen
    function updateCart() {
        cartDropdown.innerHTML = ""; // Ryd dropdown-indholdet

        if (cartItems.length === 0) {
            cartDropdown.innerHTML = "<p>Din kurv er tom.</p>";
            return;
        }

        // Tilføj produkter til dropdown
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.style.display = "flex";
            cartItem.style.justifyContent = "space-between";

            const itemText = document.createElement("span");
            itemText.textContent = `${item.name} - ${item.price} kr.`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Slet";
            removeButton.style.border = "none";
            removeButton.style.background = "transparent";
            removeButton.style.cursor = "pointer";
            removeButton.style.color = "red";

            // Fjern produkt fra kurven
            removeButton.addEventListener("click", () => {
                cartItems.splice(index, 1); // Fjern produkt
                localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Opdater localStorage
                updateCart(); // Opdater visningen
            });

            cartItem.appendChild(itemText);
            cartItem.appendChild(removeButton);
            cartDropdown.appendChild(cartItem);
        });

        // Beregn og vis samlet pris
        const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

        const cartTotal = document.createElement("div");
        cartTotal.style.marginTop = "10px";
        cartTotal.innerHTML = `
            <p><strong>Samlet pris:</strong> ${totalPrice} kr.</p>
        `;

        // Tilføj knap til betaling
        const checkoutButton = document.createElement("button");
        checkoutButton.textContent = "Gå til betaling";
        checkoutButton.style.marginTop = "10px";
        checkoutButton.style.padding = "10px";
        checkoutButton.style.border = "none";
        checkoutButton.style.borderRadius = "5px";
        checkoutButton.style.backgroundColor = "#ff88aa";
        checkoutButton.style.color = "white";
        checkoutButton.style.fontWeight = "bold";
        checkoutButton.style.cursor = "pointer";

        checkoutButton.addEventListener("click", () => {
            window.location.href = "/payment.html"; // Naviger til betalingssiden
        });

        cartTotal.appendChild(checkoutButton);
        cartDropdown.appendChild(cartTotal);
    }

    // Event: Vis og skjul dropdown-menuen
    cartButton.addEventListener("mouseover", () => {
        cartDropdown.style.display = "block";
    });

    cartButton.addEventListener("mouseout", (event) => {
        const relatedTarget = event.relatedTarget;
        if (!cartDropdown.contains(relatedTarget) && relatedTarget !== cartButton) {
            cartDropdown.style.display = "none";
        }
    });

    cartDropdown.addEventListener("mouseover", () => {
        cartDropdown.style.display = "block";
    });

    cartDropdown.addEventListener("mouseout", (event) => {
        const relatedTarget = event.relatedTarget;
        if (!cartButton.contains(relatedTarget) && relatedTarget !== cartDropdown) {
            cartDropdown.style.display = "none";
        }
    });

    // Opdater dropdown ved indlæsning
    updateCart();

    // **3. Lyt efter ændringer i localStorage**
    window.addEventListener("storage", () => {
        cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        updateCart(); // Opdater dropdown, når localStorage ændres
    });

    // **4. Funktion: Tilføj produkter til kurven**
    function addToCart(productName, productPrice) {
        cartItems.push({ name: productName, price: productPrice }); // Tilføj til array
        localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Gem i localStorage
        updateCart();
    }

    // Event: Tilføj produkter til kurven ved klik
    document.querySelectorAll(".add-to-order").forEach((button, index) => {
        button.addEventListener("click", () => {
            let productName, productPrice;

            if (index < 3) {
                // Juices
                productName = document.getElementById(`juiceName${index + 1}`).textContent;
                productPrice = document
                    .getElementById(`juicePrice${index + 1}`)
                    .textContent.replace("Price: ", "")
                    .replace(" kr.", "");
            } else if (index < 6) {
                // Sandwiches
                productName = document.getElementById(`sandwichName${index - 2}`).textContent;
                productPrice = document
                    .getElementById(`sandwichPrice${index - 2}`)
                    .textContent.replace("Price: ", "")
                    .replace(" kr.", "");
            } else {
                // Coffee
                productName = document.getElementById(`coffeeName${index - 5}`).textContent;
                productPrice = document
                    .getElementById(`coffeePrice${index - 5}`)
                    .textContent.replace("Price: ", "")
                    .replace(" kr.", "");
            }

            addToCart(productName, productPrice);
        });
    });
});
