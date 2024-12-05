//Henter brugeren fra session storage
const user = JSON.parse(sessionStorage.getItem("user"));
document.getElementById("navn").textContent = user.navn;

// Globale arrays til produktkategorier
let juices = [];
let sandwiches = [];
let coffee = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // **1. Hent produktdata og opdater sektionerne**
    const response = await fetch("/api/products");
    const products = await response.json();

    // Filtrer produkter baseret på kategori
    juices = products.filter((product) => product.Category === "Juice");
    sandwiches = products.filter((product) => product.Category === "Sandwich");
    coffee = products.filter((product) => product.Category === "Coffee");

    // Opdater Juice-sektionen
    juices.forEach((juice, index) => {
      const juiceNameElement = document.getElementById(`juiceName${index + 1}`);
      const juicePriceElement = document.getElementById(
        `juicePrice${index + 1}`
      );

      if (juiceNameElement) juiceNameElement.textContent = juice.Name;
      if (juicePriceElement)
        juicePriceElement.textContent = `Price: ${juice.Price} kr.`;
    });

    // Opdater Sandwich-sektionen
    sandwiches.forEach((sandwich, index) => {
      const sandwichNameElement = document.getElementById(
        `sandwichName${index + 1}`
      );
      const sandwichPriceElement = document.getElementById(
        `sandwichPrice${index + 1}`
      );

      if (sandwichNameElement) sandwichNameElement.textContent = sandwich.Name;
      if (sandwichPriceElement)
        sandwichPriceElement.textContent = `Price: ${sandwich.Price} kr.`;
    });

    // Opdater Kaffe-sektionen
    coffee.forEach((coffeeItem, index) => {
      const coffeeNameElement = document.getElementById(
        `coffeeName${index + 1}`
      );
      const coffeePriceElement = document.getElementById(
        `coffeePrice${index + 1}`
      );

      if (coffeeNameElement) coffeeNameElement.textContent = coffeeItem.Name;
      if (coffeePriceElement)
        coffeePriceElement.textContent = `Price: ${coffeeItem.Price} kr.`;
    });
  } catch (error) {
    console.error("Kunne ikke hente produkter:", error);
  }

  // **2. Håndtering af kurven og sessionStorage**
  const cartDropdown = document.getElementById("cartDropdown");
  const cartButton = document.querySelector(".cart");
  let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || []; // Hent fra sessionStorage

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
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems)); // Opdater sessionStorage
        updateCart(); // Opdater visningen
      });

      cartItem.appendChild(itemText);
      cartItem.appendChild(removeButton);
      cartDropdown.appendChild(cartItem);
    });

    // Beregn og vis samlet pris
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );

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
      window.location.href = "/map.html";
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

  // **3. Lyt efter ændringer i sessionStorage**
  window.addEventListener("storage", () => {
    cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    updateCart(); // Opdater dropdown, når sessionStorage ændres
  });

  // **4. Funktion: Tilføj produkter til kurven**
  function addToCart(productId, productName, productPrice, productCategory) {
    cartItems.push({
      productId: productId,
      name: productName,
      price: productPrice,
      category: productCategory,
    });
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems)); // Gem i sessionStorage
    console.log("Opdateret cartItems:", cartItems); // Debugging
    updateCart();
  }

  // Event: Tilføj produkter til kurven ved klik
  document.querySelectorAll(".add-to-order").forEach((button, index) => {
    button.addEventListener("click", () => {
      let productId, productName, productPrice;

      if (index < juices.length) {
        const juice = juices[index];
        productId = juice.Product_Id; // Brug korrekt nøgle
        productName = juice.Name;
        productPrice = juice.Price;
        productCategory = juice.Category;
      } else if (index < juices.length + sandwiches.length) {
        const sandwich = sandwiches[index - juices.length];
        productId = sandwich.Product_Id; // Brug korrekt nøgle
        productName = sandwich.Name;
        productPrice = sandwich.Price;
        productCategory = sandwich.Category;
      } else {
        const coffeeItem = coffee[index - juices.length - sandwiches.length];
        productId = coffeeItem.Product_Id; // Brug korrekt nøgle
        productName = coffeeItem.Name;
        productPrice = coffeeItem.Price;
        productCategory = coffeeItem.Category;
      }

      // Tilføj produkt til kurven med ID
      addToCart(productId, productName, productPrice, productCategory);
    });
  });
  //tillader også at logge ud
  const logudKnap = document.getElementById("logout");
  logudKnap.addEventListener("click", () => {
    sessionStorage.clear();
    alert("Du er nu logget ud");
    window.location.href = "/login.html";
  });
});
