document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Hent produktdata fra API'et
      const response = await fetch("/api/products");
      const products = await response.json();
  
      // Filtrér produkter efter kategorier
      const juices = products.filter((product) => product.Category === "Juice");
      const sandwiches = products.filter(
        (product) => product.Category === "Sandwich"
      );
      const coffee = products.filter((product) => product.Category === "Coffee");
  
      // Opdater Juice sektionen
      juices.forEach((juice, index) => {
        const juiceNameElement = document.getElementById(`juiceName${index + 1}`);
        const juicePriceElement = document.getElementById(`juicePrice${index + 1}`);
  
        if (juiceNameElement) juiceNameElement.textContent = juice.Name;
        if (juicePriceElement) juicePriceElement.textContent = `Price: ${juice.Price} kr.`;
      });
  
      // Opdater Sandwich sektionen
      sandwiches.forEach((sandwich, index) => {
        const sandwichNameElement = document.getElementById(`sandwichName${index + 1}`);
        const sandwichPriceElement = document.getElementById(`sandwichPrice${index + 1}`);
  
        if (sandwichNameElement) sandwichNameElement.textContent = sandwich.Name;
        if (sandwichPriceElement)
          sandwichPriceElement.textContent = `Price: ${sandwich.Price} kr.`;
      });
  
      // Opdater kaffe sektionen
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
  });