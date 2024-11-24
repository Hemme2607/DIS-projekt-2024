const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

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
    if (!email.value.includes("@") || !email.value.includes(".")) {
      alert("Email skal indeholde '@' og '.'");
      return;
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
      return res.status(401).send("Invalid email or password");
    }
    //Sammenligner det indtastede password med det hashede password i databasen
    const passwordMatch = await bcrypt.compare(password, user.password);
    //Hvis passwordet ikke matcher, fremkommer der en fejlbesked.
    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }

    res.status(200).json({ id: user.id, navn: user.navn, email: user.email });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});
