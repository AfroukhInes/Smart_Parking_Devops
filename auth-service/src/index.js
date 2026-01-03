const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- IN MEMORY DATA ----------------

let users = [];
let sessions = [];

// ---------------- HELPERS ----------------

function createId() {
  return crypto.randomBytes(8).toString("hex");
}

function createToken() {
  return crypto.randomBytes(16).toString("hex");
}

// ---------------- REGISTER ----------------

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Champs manquants" });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: "Utilisateur existe déjà" });

  const user = {
    id: createId(),
    name,
    email,
    password, // en vrai on hacherait, mais ici mémoire simple
    reservations: [],
    messages: [],
    points: 0,
    reductionsUsed: 0
  };

  users.push(user);

  res.json({ message: "compte créé" });
});

// ---------------- LOGIN ----------------
app.post("/me-from-id", (req, res) => {
  const { userId } = req.body;

  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: "not found" });

  const { password, ...safe } = user;
  res.json(safe);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(400).json({ error: "email ou mot de passe incorrect" });

  const token = createToken();

  sessions.push({
    token,
    userId: user.id
  });

  res.json({ token, userId: user.id });
});

// -------------- AUTH MIDDLEWARE ----------------

function auth(req, res, next) {
  const token = req.headers.authorization;

  const session = sessions.find(s => s.token === token);
  if (!session) return res.status(401).json({ error: "non autorisé" });

  req.user = users.find(u => u.id === session.userId);
  next();
}

// ---------------- PROFILE ----------------

app.get("/me", auth, (req, res) => {
  const { password, ...safe } = req.user;
  res.json(safe);
});

// ---------------- ADD RESERVATION HISTORY (called by reservation service) ----------------

app.post("/add-reservation", (req, res) => {
  const { userId, reservation } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  user.reservations.push(reservation);

  // points fidélité
  user.points += 1;

  // réduction automatique tous les 5
  if (user.points % 5 === 0) {
    user.messages.push({
      id: createId(),
      text: "🎉 Vous avez gagné une réduction de 50 DA sur votre prochaine réservation",
      type: "promo",
      date: Date.now()
    });
  }

  res.json({ ok: true });
});

// ---------------- MESSAGES ----------------

app.get("/messages", auth, (req, res) => {
  res.json(req.user.messages);
});

// appelé par notification service
app.post("/send-message", (req, res) => {
  const { userId, text, type } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  user.messages.push({
    id: createId(),
    text,
    type,
    date: Date.now()
  });

  res.json({ ok: true });
});

app.listen(4001, () => {
  console.log("🔐 Auth service running on 4001");
});
