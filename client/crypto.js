// Generate key pair
export async function generateKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    true,
    ["deriveKey"]
  );
}

// Export public key
export async function exportPublicKey(key) {
  return btoa(String.fromCharCode(...new Uint8Array(
    await crypto.subtle.exportKey("raw", key)
  )));
}

// Encrypt message
export async function encryptMessage(publicKey, message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: Array.from(iv)
  };
}
