const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ IN MEMORY DATA ------------------

let spots = [
  { id: 1, section: "A", number: 1, floor: 0, free: true },
  { id: 2, section: "A", number: 2, floor: 0, free: true },
  { id: 3, section: "B", number: 3, floor: 1, free: true },
  { id: 4, section: "C", number: 1, floor: 1, free: true }
];

let reservations = [];

// ------------------ HELPERS ------------------

function createCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// ------------------ LICENSE PLATE VALIDATION ------------------

// Algérie format courant:
// 12345 - 123 - 16
const dzPlate = /^[0-9]{5}-[0-9]{3}-[0-9]{2}$/;

// formes étrangères — plus générales
const internationalPlate = /^[A-Z0-9\- ]{4,12}$/;

function validatePlate(carNumber) {
  return dzPlate.test(carNumber) || internationalPlate.test(carNumber);
}

// ------------------ FREE SPOTS ------------------

app.get("/spots/free", (req, res) => {
  res.json(spots.filter(s => s.free));
});

// ------------------ RESERVE ------------------

app.post("/reserve", async (req, res) => {
  try {
    const { userId, name, carNumber, spotId } = req.body;

    if (!userId) return res.status(400).json({ error: "auth manquante" });

    if (!validatePlate(carNumber)) {
      return res.status(400).json({
        error: "Matricule invalide (DZ ex: 12345-123-16)"
      });
    }

    const spot = spots.find(s => s.id == spotId);
    if (!spot) return res.status(404).json({ error: "place introuvable" });
    if (!spot.free) return res.status(400).json({ error: "place occupée" });

    spot.free = false;

    const code = createCode();

    const reservation = {
      code,
      userId,
      name,
      carNumber,
      spot,
      createdAt: Date.now(),
      entryTime: null,
      exitTime: null,
      cancelled: false
    };

    reservations.push(reservation);

    // ---------- send message to AUTH SERVICE ----------
    await fetch("http://localhost:4001/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        text: `Votre code d'entrée parking est : ${code}`,
        type: "reservation"
      })
    });

    // ---------- add to user reservation history ----------
    await fetch("http://localhost:4001/add-reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        reservation
      })
    });

    res.json({
      message: "reservation effectuée",
      code
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "erreur serveur" });
  }
});

// ------------------ ENTRY ------------------

app.post("/entry/:code", (req, res) => {
  const r = reservations.find(x => x.code === req.params.code);

  if (!r) return res.status(404).json({ error: "inconnu" });

  r.entryTime = Date.now();

  res.json({ message: "entrée enregistrée" });
});

// ------------------ EXIT ------------------

app.post("/exit/:code", (req, res) => {
  const r = reservations.find(x => x.code === req.params.code);

  if (!r) return res.status(404).json({ error: "inconnu" });

  r.exitTime = Date.now();

  const realSpot = spots.find(s => s.id === r.spot.id);
  if (realSpot) realSpot.free = true;

  res.json({ message: "sortie enregistrée" });
});

// ------------------ AUTO CANCEL ------------------

setInterval(() => {
  const now = Date.now();

  reservations.forEach(r => {
    if (r.entryTime) return;

    const diff = now - r.createdAt;

    // 1 heure
    if (diff > 60 * 60 * 1000) {
      r.cancelled = true;

      const realSpot = spots.find(s => s.id === r.spot.id);
      if (realSpot) realSpot.free = true;
    }
  });

  reservations = reservations.filter(r => !r.cancelled);
}, 60000);

app.listen(4002, () => {
  console.log("🅿️ Reservation service running on 4002");
});
