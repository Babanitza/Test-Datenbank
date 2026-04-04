import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// MySQL Pool
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ------------------------------------------------------
// POST: Problem speichern
// ------------------------------------------------------
app.post("/api/probleme", async (req, res) => {
  const { name, klasse, problem, pause, vertrauensschueler } = req.body;

  if (!name || !klasse || !problem || !pause) {
    return res.status(400).json({ error: "Fehlende Felder" });
  }

  try {
    await pool.query(
      "INSERT INTO Probleme (name, klasse, problem, pause, vertrauensschueler) VALUES (?, ?, ?, ?, ?)",
      [name, klasse, problem, pause, vertrauensschueler]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// ------------------------------------------------------
// GET: Alle Probleme laden
// ------------------------------------------------------
app.get("/api/probleme", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Probleme ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    res.status(500).json({ error: "Fehler beim Laden" });
  }
});

// ------------------------------------------------------
// Server starten
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server läuft auf Port", PORT));
