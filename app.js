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
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (navn, email, password, telefon, fDato) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(navn, email, hashedPassword, telefon, fDato);

    res
      .status(201)
      .json({ id: result.lastInsertRowid, navn, email, telefon, fDato });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});
