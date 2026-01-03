const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ IN MEMORY STORE ------------------

let inbox = {}; // { userId: [ messages ] }

function id() {
  return crypto.randomBytes(6).toString("hex");
}

// ------------------ ADD MESSAGE ------------------

app.post("/notify", (req, res) => {
  const { userId, text, type } = req.body;

  if (!userId || !text)
    return res.status(400).json({ error: "champ manquant" });

  if (!inbox[userId]) inbox[userId] = [];

  const message = {
    id: id(),
    text,
    type: type || "info",
    date: Date.now(),
    read: false
  };

  inbox[userId].push(message);

  res.json({ ok: true, message });
});

// ------------------ GET USER MESSAGES ------------------

app.get("/messages/:userId", (req, res) => {
  const { userId } = req.params;

  res.json(inbox[userId] || []);
});

// ------------------ MARK AS READ ------------------

app.post("/messages/read", (req, res) => {
  const { userId, messageId } = req.body;

  if (!inbox[userId]) return res.json({ ok: true });

  inbox[userId] = inbox[userId].map(m =>
    m.id === messageId ? { ...m, read: true } : m
  );

  res.json({ ok: true });
});

// ------------------ DELETE MESSAGE ------------------

app.post("/messages/delete", (req, res) => {
  const { userId, messageId } = req.body;

  if (!inbox[userId]) return res.json({ ok: true });

  inbox[userId] = inbox[userId].filter(m => m.id !== messageId);

  res.json({ ok: true });
});

// ------------------ BROADCAST TO ALL USERS ------------------

app.post("/broadcast", (req, res) => {
  const { text } = req.body;

  Object.keys(inbox).forEach(userId => {
    inbox[userId].push({
      id: id(),
      text,
      type: "broadcast",
      date: Date.now(),
      read: false
    });
  });

  res.json({ ok: true });
});

// ------------------ AUTOREMINDER ENGINE ------------------

let reminders = [];

// schedule reminder
app.post("/schedule-reminder", (req, res) => {
  const { userId, text, at } = req.body;

  reminders.push({
    id: id(),
    userId,
    text,
    at
  });

  res.json({ ok: true });
});

// check every minute
setInterval(() => {
  const now = Date.now();

  reminders.forEach(r => {
    if (now >= r.at) {
      if (!inbox[r.userId]) inbox[r.userId] = [];
      inbox[r.userId].push({
        id: id(),
        text: r.text,
        type: "reminder",
        date: Date.now(),
        read: false
      });
      r.sent = true;
    }
  });

  reminders = reminders.filter(r => !r.sent);
}, 60000);

app.listen(4003, () => {
  console.log("📨 Notification service running on 4003");
});
