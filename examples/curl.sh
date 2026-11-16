#!/usr/bin/env bash
# Send one lead to Smarfle with curl. Set SMARFLE_API_KEY first:
#   export SMARFLE_API_KEY=rk_your_key_here
#   bash curl.sh
curl -sS -X POST "https://www.smarfle.com/api/webhook/leads" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${SMARFLE_API_KEY:?Set SMARFLE_API_KEY first}" \
  -d '{
    "first_name": "Morgan",
    "last_name": "Ellis",
    "email": "morgan@example.com",
    "phone": "(202) 555-0101",
    "address": "125 Sample Lane, Orlando, FL 32801",
    "message": "Quarterly pest control for a 3-bedroom house, please call after 5 PM.",
    "source_page": "https://example.com/pest-control",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring-pest",
    "details": { "Preferred time": "Evenings" },
    "sms_consent": false
  }'
echo
