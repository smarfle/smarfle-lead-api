// Verify a Smarfle webhook (Node). `rawBody` must be the exact bytes Smarfle sent, before any JSON parsing.
import crypto from "node:crypto";

export function isValidSmarfleWebhook(rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signatureHeader || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
