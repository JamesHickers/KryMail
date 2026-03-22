import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
app.use(bodyParser.json({ limit: "5mb" }));

// In-memory storage (replace with DB later)
const users = new Map(); // user_id -> { publicKey, encryptedPrivateKey }
const mail = []; // stored encrypted messages

// --- Mock Krynet Auth Middleware ---
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("No auth");

  // Simulate Krynet verification
  req.user = { id: token }; // token = user_id for now
  next();
}

// --- Key Registration ---
app.post("/keys/init", auth, (req, res) => {
  const { publicKey, encryptedPrivateKey } = req.body;

  users.set(req.user.id, { publicKey, encryptedPrivateKey });

  res.send({ ok: true });
});

// --- Get Public Key ---
app.get("/keys/:id", auth, (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).send("No user");

  res.send({ publicKey: user.publicKey });
});

// --- Send Mail ---
app.post("/mail/send", auth, (req, res) => {
  const msg = {
    id: crypto.randomUUID(),
    to: req.body.to,
    from: req.user.id,
    payload: req.body.payload,
    timestamp: Date.now()
  };

  mail.push(msg);
  res.send({ ok: true });
});

// --- Inbox ---
app.get("/mail/inbox", auth, (req, res) => {
  const inbox = mail.filter(m => m.to === req.user.id);
  res.send(inbox);
});

app.listen(3000, () => console.log("Server running on 3000"));
