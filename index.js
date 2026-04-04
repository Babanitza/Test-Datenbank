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
// POST: Bestellung speichern
// ------------------------------------------------------
app.post("/api/bestellungen", async (req, res) => {
  const {
    vorname, nachname, klasse, e_mail, telefonnummer, strasse, ort,
    artikel_1, logo_1, logo_platzierung_1, groesse_1, anzahl_1, einzelpreis_1, kosten_1,
    artikel_2, logo_2, logo_platzierung_2, groesse_2, anzahl_2, einzelpreis_2, kosten_2,
    artikel_3, logo_3, logo_platzierung_3, groesse_3, anzahl_3, einzelpreis_3, kosten_3,
    gesamtkosten, rechnung_verschickt, bezahlt_am, erledigt
  } = req.body;

  if (!vorname || !nachname || !klasse) {
    return res.status(400).json({ error: "Fehlende Felder: Vorname, Nachname, Klasse erforderlich" });
  }

  try {
    await pool.query(
      `INSERT INTO Bestellungen (
        vorname, nachname, klasse, e_mail, telefonnummer, strasse, ort,
        artikel_1, logo_1, logo_platzierung_1, groesse_1, anzahl_1, einzelpreis_1, kosten_1,
        artikel_2, logo_2, logo_platzierung_2, groesse_2, anzahl_2, einzelpreis_2, kosten_2,
        artikel_3, logo_3, logo_platzierung_3, groesse_3, anzahl_3, einzelpreis_3, kosten_3,
        gesamtkosten, rechnung_verschickt, bezahlt_am, erledigt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vorname, nachname, klasse, e_mail, telefonnummer, strasse, ort,
        artikel_1, logo_1, logo_platzierung_1, groesse_1, anzahl_1, einzelpreis_1, kosten_1,
        artikel_2, logo_2, logo_platzierung_2, groesse_2, anzahl_2, einzelpreis_2, kosten_2,
        artikel_3, logo_3, logo_platzierung_3, groesse_3, anzahl_3, einzelpreis_3, kosten_3,
        gesamtkosten, rechnung_verschickt, bezahlt_am, erledigt
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// ------------------------------------------------------
// GET: Alle Bestellungen laden
// ------------------------------------------------------
app.get("/api/bestellungen", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Bestellungen ORDER BY id DESC"
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
