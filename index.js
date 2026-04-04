import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

// MySQL Pool
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test der Verbindung
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL connected successfully");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err);
  }
})();

// Beispielroute
app.get("/", async (req, res) => {
  res.send("Backend läuft und ist mit MySQL verbunden!");
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
