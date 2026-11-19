// Smarfle REST API v1 example (Node 18+). Run: SMARFLE_KEY=smk_... node rest-api-node.mjs
const BASE = "https://www.smarfle.com/api/v1";
const headers = { Authorization: `Bearer ${process.env.SMARFLE_KEY}`, "Content-Type": "application/json" };

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${json.error?.code}: ${json.error?.message}`);
  return json;
}

// Page through every customer (reads are free).
let cursor = null;
const customers = [];
do {
  const page = await api("GET", `/customers?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
  customers.push(...page.data);
  cursor = page.has_more ? page.next_cursor : null;
} while (cursor);
console.log(`${customers.length} customers`);

// Add a job request for the newest customer (needs a read and write key).
if (customers[0]) {
  const job = await api("POST", "/jobs", { customer_id: customers[0].id, title: "Follow-up visit", preferred_date: "2026-12-02" });
  console.log(`Job request ${job.id} is ${job.status}`);
}
