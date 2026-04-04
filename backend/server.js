import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Verbindung zur Railway-MySQL
const db = await mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Tabelle erstellen (falls nicht vorhanden)
await db.execute(`
  CREATE TABLE IF NOT EXISTS eintraege (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255),
    datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// API: Eintrag speichern
app.post("/api/eintrag", async (req, res) => {
  const { text } = req.body;
  await db.execute("INSERT INTO eintraege (text) VALUES (?)", [text]);
  res.json({ ok: true });
});

// API: Alle Einträge abrufen
app.get("/api/eintrag", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM eintraege ORDER BY id DESC");
  res.json(rows);
});

app.listen(3000, () => console.log("Backend läuft auf Port 3000"));
