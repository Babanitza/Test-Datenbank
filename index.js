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

// 👉 STATIC FILES SERVEN
app.use(express.static(path.join(__dirname, "public")));

// MySQL Pool
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST: Eintrag speichern
app.post("/api/eintrag", async (req, res) => {
  const { text } = req.body;

  try {
    await pool.query(
      "INSERT INTO eintraege (text, datum) VALUES (?, NOW())",
      [text]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// GET: Alle Einträge laden
app.get("/api/eintrag", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM eintraege ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden" });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server läuft auf Port", PORT));
