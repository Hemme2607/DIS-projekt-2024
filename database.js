const database = require("better-sqlite3");
const path = require("path");

// Opretter en forbindelse til databasen
const db = new database(path.join(__dirname, "database.db"));

// Opretter en tabel til brugere og stempler
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

    db.exec(`CREATE TABLE IF NOT EXISTS stamps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    product_category TEXT NOT NULL,
    stamp_count INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);
    console.log("Database created");
  } catch (error) {
    console.log("Error creating database");
  }
}

// laver databasen
createDatabase();

module.exports = db;
