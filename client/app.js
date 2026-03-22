import { generateKeyPair, exportPublicKey, encryptMessage } from "./crypto.js";

const API = "http://localhost:3000";
const TOKEN = "user1"; // simulate Krynet auth

let keyPair;

async function init() {
  keyPair = await generateKeyPair();
  const publicKey = await exportPublicKey(keyPair.publicKey);

  await fetch(`${API}/keys/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": TOKEN
    },
    body: JSON.stringify({
      publicKey,
      encryptedPrivateKey: "placeholder"
    })
  });

  console.log("Keys initialized");
}

async function send() {
  const to = document.getElementById("to").value;
  const msg = document.getElementById("msg").value;

  const res = await fetch(`${API}/keys/${to}`, {
    headers: { "Authorization": TOKEN }
  });

  const { publicKey } = await res.json();

  const encrypted = await encryptMessage(publicKey, msg);

  await fetch(`${API}/mail/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": TOKEN
    },
    body: JSON.stringify({
      to,
      payload: encrypted
    })
  });

  alert("Sent");
}

async function loadInbox() {
  const res = await fetch(`${API}/mail/inbox`, {
    headers: { "Authorization": TOKEN }
  });

  const data = await res.json();
  document.getElementById("inbox").textContent =
    JSON.stringify(data, null, 2);
}

window.init = init;
window.send = send;
window.loadInbox = loadInbox;
