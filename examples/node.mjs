// Send one lead to Smarfle from Node 18 or newer (built-in fetch, no packages).
//   SMARFLE_API_KEY=rk_your_key_here node node.mjs
const key = process.env.SMARFLE_API_KEY;
if (!key) throw new Error("Set SMARFLE_API_KEY first");

const lead = {
  first_name: "Morgan",
  last_name: "Ellis",
  email: "morgan@example.com",
  phone: "(202) 555-0101",
  address: "125 Sample Lane, Orlando, FL 32801",
  message: "Need a quote for a deep clean before we move out on the 30th.",
  source_page: "https://example.com/move-out-cleaning",
  custom_fields: { "Home size": "3 bedrooms" },
  sms_consent: false,
};

const res = await fetch("https://www.smarfle.com/api/webhook/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": key },
  body: JSON.stringify(lead),
});
const body = await res.json().catch(() => ({}));

if (res.ok) console.log("Lead created, client id:", body.client_id);
else if (res.status === 409) console.log("Client already existed, request saved on:", body.client_id);
else if (res.status === 429) console.log("Too many requests, wait a minute and retry");
else console.error("Failed:", res.status, body.error);
