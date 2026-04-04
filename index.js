import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let db;

async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT
    });

    console.log("Mit MySQL verbunden!");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS eintraege (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255),
        datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  } catch (err) {
    console.error("MySQL-Verbindung fehlgeschlagen:", err);
  }
}

await connectDB();

// API: Eintrag speichern
app.post("/api/eintrag", async (req, res) => {
  if (!db) return res.status(500).json({ error: "DB nicht verbunden" });

  const { text } = req.body;
  await db.execute("INSERT INTO eintraege (text) VALUES (?)", [text]);
  res.json({ ok: true });
});

// API: Alle Einträge abrufen
app.get("/api/eintrag", async (req, res) => {
  if (!db) return res.status(500).json({ error: "DB nicht verbunden" });

  const [rows] = await db.execute("SELECT * FROM eintraege ORDER BY id DESC");
  res.json(rows);
});

// WICHTIG: Railway-Port verwenden
app.listen(process.env.PORT || 3000, () =>
  console.log("Backend läuft auf Port", process.env.PORT || 3000)
);
