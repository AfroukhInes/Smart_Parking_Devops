const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ IN MEMORY DATA ------------------

let bills = [];
let totalMoney = 0;

const PRICE_PER_HOUR = 100;
const ADVANCE = 50;

// ------------------ CALCUL BILL ------------------

app.post("/pay", async (req, res) => {
  try {
    const { userId, entryTime, exitTime } = req.body;

    if (!userId || !entryTime || !exitTime)
      return res.status(400).json({ error: "champs manquants" });

    // duration hours rounded up
    const hours =
      Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)) || 1;

    let price = hours * PRICE_PER_HOUR;

    // ---------- ask auth service for user profile ----------
    const profileRes = await fetch("http://localhost:4001/me-from-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const user = await profileRes.json();

    let discount = 0;

    // 🎁 reduction every 5 reservations
    if (user.points && user.points % 5 === 0) {
      discount = 50;
    }

    // apply advance already paid
    let total = price - ADVANCE - discount;
    if (total < 0) total = 0;

    const bill = {
      id: Date.now(),
      userId,
      price,
      advance: ADVANCE,
      discount,
      total,
      hours,
      createdAt: Date.now()
    };

    bills.push(bill);
    totalMoney += total;

    // ---------- notify user ----------
    await fetch("http://localhost:4003/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        type: "billing",
        text: `💰 Facture: ${hours}h • total payé ${total} DA (réduction ${discount} DA)`
      })
    });

    res.json(bill);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "erreur serveur" });
  }
});

// ------------------ ADMIN DASHBOARD ------------------

app.get("/admin", (req, res) => {
  res.json({
    totalMoney,
    bills
  });
});

app.listen(4004, () => {
  console.log("💵 Billing service running on 4004");
});
