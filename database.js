const database = require("better-sqlite3");
const path = require("path");

// Opretter en forbindelse til databasen
const db = new database(path.join(__dirname, "database.db"));

// Opretter en tabel til brugere
function createDatabase() {
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    navn TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    telefon TEXT NOT NULL UNIQUE,
    fDato TEXT NOT NULL
  )`);
    console.log("Database created");
  } catch (error) {
    console.log("Error creating database");
  }
}

// laver databasen
createDatabase();

module.exports = db;
