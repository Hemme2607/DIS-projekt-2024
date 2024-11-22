const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

// Aktivér CORS
app.use(cors());

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

//Connecter til min SQlite database
