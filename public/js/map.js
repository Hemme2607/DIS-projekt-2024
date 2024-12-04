// Initialiser kortet med startposition tæt på København
const map = L.map("map").setView([55.6761, 12.5683], 12); // Zoomniveau ændret til 12 for tættere visning

// Tilføj OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Funktion til at opdatere indholdet i ordreboksen
function updateOrderBox(storeName = null) {
  const orderBox = document.getElementById("order-box");
  if (storeName) {
    orderBox.innerHTML = `
      <h3>${storeName}</h3>
      <button onclick="goToPayment()">Go to payment</button>
    `;
  } else {
    orderBox.innerHTML = `
      <h3>SELECT A STORE</h3>
    `;
  }
}

// Funktion til at navigere til payment.html
function goToPayment() {
  window.location.href = "payment.html";
}

// Hent butikker fra backend og vis dem på kortet og i venstre boks
fetch("/api/Stores")
  .then((response) => response.json())
  .then((stores) => {
    const storeList = document.getElementById("store-list"); // Boksen til venstre

    stores.forEach((store) => {
      // Tilføj markør for hver butik på kortet
      L.marker([store.lat, store.lng])
        .addTo(map)
        .bindPopup(
          `<b>${store.name}</b><br>${store.address}<br>Åbningstider: ${store.hours}`
        );

      // Dynamisk opret HTML for hver butik i venstre boks
      const storeItem = document.createElement("div");
      storeItem.classList.add("store"); // Brug korrekt CSS-klasse

      storeItem.innerHTML = `
        <h3>${store.name}</h3>
        <p>${store.address}</p>
        <p><strong>Åbningstider:</strong> ${store.hours}</p>
        <button class="order-btn">Order Now</button>
      `;

      // Klik på butik fremhæver dens markør
      storeItem.addEventListener("click", () => {
        map.setView([store.lat, store.lng], 14); // Zoom ind på butikken
      });

      // Tilføj event listener til knappen "Order Now"
      const orderButton = storeItem.querySelector(".order-btn");
      orderButton.addEventListener("click", () => {
        updateOrderBox(store.name);
      });

      storeList.appendChild(storeItem);
    });
  })
  .catch((error) => {
    console.error("Error fetching stores:", error);
  });

// Initialiser ordreboksen
updateOrderBox();
