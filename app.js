const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");
const path = require("path");
const twilio = require("twilio");

const app = express();
const PORT = 3000;

// Twilio information til SMS
const accountSid = "AC0f6185bce4bd85dc1bb350b4127f1d89";
const authToken = "92471af628b52fcae3a3eb5bb9eec8f9";
const client = twilio(accountSid, authToken);

// Aktivér CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Sætter welcome.html som default side
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "welcome.html"));
});

// Laver dynamisk routing til alle html filer
app.get("/:page.html", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, "public", "html", `${page}.html`);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("Page not found");
    }
  });
});

// Start serveren
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//Laver et endpoint til at oprette en bruger
app.post("/users", async (req, res) => {
  try {
    const { navn, email, password, telefon, fDato } = req.body;

    //Valider at email skal indeholde et "@" "."
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).send({ error: "Email must contain '@' and '.'" });
    }

    //Valider at telefonnummeret skal være 8 cifre
    if (telefon.length !== 8) {
      return res.status(400).send({ error: "Phone number must be 8 digits" });
    }

    //Valider at email ikke allerede er i brug
    const emailCheck = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);
    if (emailCheck) {
      return res.status(400).send("Email already in use");
    }

    //Hasher passwordet
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (navn, email, password, telefon, fDato) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(navn, email, hashedPassword, telefon, fDato);

    res
      .status(201)
      .json({ id: result.lastInsertRowid, navn, email, telefon, fDato });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      //Sikrer at hvis email eller telefonnummeret allerede er i brug, så får brugeren en fejlbesked
      return res.status(400).send("Email or phone number already in use");
    } else {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
});

//Laver et endpoint der gør det muligt for brugeren at logge ind
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //Sammenligner det indtastede password med det hashede password i databasen
    const passwordMatch = await bcrypt.compare(password, user.password);
    //Hvis passwordet ikke matcher, fremkommer der en fejlbesked.
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //Returnerer brugerens id, navn og email
    res.status(200).json({
      id: user.id,
      navn: user.navn,
      email: user.email,
      telefon: user.telefon,
      fDato: user.fDato,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//Opretter et tomt objekt til at gemme den genererede kode, som senerer skal sammenlignes med den indtastede kode
let authenticateMessage = {};

//Laver et endpoint til at sende en SMS med henblik på at autentificere brugeren
app.post("/authenticateUser", async (req, res) => {
  try {
    const { email } = req.body;
    //henter nu brugerens telefonnummer ud fra email
    const stmt = db.prepare("SELECT telefon FROM users WHERE email = ?");
    const user = stmt.get(email);

    if (!user) {
      return res.status(404).json({ error: "Brugeren findes ikke" });
    }
    //Genererer en tilfældig 5-cifret kode
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    authenticateMessage[email] = randomCode;
    //Sender SMS til brugerens telefonnummer
    await client.messages.create({
      from: "+1 850 972 2311",
      to: `+45${user.telefon}`,
      body: `Din bekræftelsekode er: ${randomCode}`,
    });
    res.status(200).json({ message: "SMS sendt" });
  } catch (error) {
    console.log("Der er sket en fejl:", error);
    res.status(500).send({ error: "Kunne ikke sende beskeden" });
  }
});

//Laver et endpoint til at tjekke om den indtastede kode matcher den genererede kode
app.post("/checkAuthCode", async (req, res) => {
  try {
    const { email, code } = req.body;
    const authenticateCode = authenticateMessage[email];
    //Bruger parseInt for at sikre at koden er et tal
    if (parseInt(code) === authenticateCode) {
      //Sletter koden fra objektet, så den ikke kan bruges igen.
      delete authenticateMessage[email];
      res.status(200).json({ message: "Koden matcher" });
    } else {
      res.status(400).json({ error: "Koden matcher ikke" });
    }
  } catch (error) {
    console.log("Der er sket en fejl:", error);
    res.status(500).send({ error: "Kunne ikke tjekke koden" });
  }
});

// Laver endpoint for at hente oplysninger fra databasen omkring "Products"
app.get("/api/products", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM Products"); // Forbereder forespørgslen
    const products = stmt.all(); // Henter alle rækker fra Products-tabellen
    res.json(products); // Returnerer resultaterne som JSON
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Fejl ved hentning af produkter" });
  }
});

// Endpoint: Håndter POST-anmodning til "/api/orders"
app.post("/api/orders", (req, res) => {
  try {
    const { userID, products } = req.body;

    // Valider, at nødvendige data er til stede
    if (!userID || !products || !products.length) {
      return res.status(400).json({ error: "Manglende data i ordren." });
    }

    // Konverter products til JSON-struktur
    const productsJSON = JSON.stringify(products);

    // Indsæt data i Orders-tabellen
    const query = `
      INSERT INTO Orders (userID, products) 
      VALUES (?, ?)
    `;
    const stmt = db.prepare(query);
    const result = stmt.run(userID, productsJSON);

    // Send succes-svar med det nye orderID
    res.status(201).json({
      orderID: result.lastInsertRowid,
      message: "Ordren er blevet gemt!",
    });
  } catch (error) {
    console.error("Fejl ved indsættelse i databasen:", error);
    res.status(500).json({ error: "Kunne ikke gemme ordren." });
  }
});

// API-endpoint for at hente butikker
app.get("/api/Stores", (req, res) => {
  try {
    const stmt = db.prepare(
      "SELECT name, address, lat, lng, hours FROM Stores"
    );
    const rows = stmt.all(); // Hent alle rækker fra tabellen
    res.json(rows); // Returnér dataen som JSON
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//Opretter et endpoint som skal stå for at hente alle stempler fra databasen
