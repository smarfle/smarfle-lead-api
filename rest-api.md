---
title: "Smarfle REST API v1 examples"
description: "Read and write Smarfle customers, jobs, invoices and services, and subscribe to webhooks, with curl, Node and Python."
permalink: /rest-api/
---

# Smarfle REST API v1

Read and write your [Smarfle](https://www.smarfle.com) customers, jobs, invoices and services, and get webhooks when something changes. The full reference is at [smarfle.com/docs/api](https://www.smarfle.com/docs/api) and the OpenAPI 3.1 file is at [www.smarfle.com/api/v1/openapi.json](https://www.smarfle.com/api/v1/openapi.json) (imports into Postman, Insomnia and most integration tools).

## Get an API key

In Smarfle, open **Company Settings**, then **Integrations**, then **API keys**, and press **Create API key**. Pick **Read only** or **Read and write**. Keys start with `smk_` and are shown once. Each key only sees your own business.

Send it on every call:

```
Authorization: Bearer smk_your_key
```

## Endpoints

Base address: `https://www.smarfle.com/api/v1`

| Method | Path | What it does |
|---|---|---|
| GET | `/me` | The business and key behind the key (test a connection) |
| GET | `/customers` | Customers, newest first (`email`, `phone`, `status`, `q`, `created_since`, `updated_since`) |
| POST | `/customers` | Add a customer (write key) |
| GET / PATCH | `/customers/{id}` | Read or change one customer |
| GET | `/jobs` | Jobs (`status`, `customer_id`, `scheduled_from`, `scheduled_to`) |
| POST | `/jobs` | Add a job request; the office schedules it in Smarfle |
| GET | `/jobs/{id}` | One job |
| GET | `/invoices`, `/invoices/{id}` | Invoices, one invoice with line items |
| GET | `/services` | Services and prices |
| GET / POST | `/webhooks` | List or create webhook subscriptions |
| DELETE | `/webhooks/{id}` | Unsubscribe |

Lists come as `{ "data": [...], "has_more": true, "next_cursor": "..." }`. Pass `?cursor=<next_cursor>` for the next page and `limit` (1 to 100) for the page size.

Reads and webhooks are free. Each call that adds or changes a record costs $0.003 from the business's Smarfle wallet. Limits: 120 calls a minute per key.

## curl

```bash
# Who am I?
curl https://www.smarfle.com/api/v1/me -H "Authorization: Bearer $SMARFLE_KEY"

# Customers changed since November 1
curl "https://www.smarfle.com/api/v1/customers?updated_since=2026-11-01T00:00:00Z" \
  -H "Authorization: Bearer $SMARFLE_KEY"

# Add a customer, then a job request for them
curl -X POST https://www.smarfle.com/api/v1/customers \
  -H "Authorization: Bearer $SMARFLE_KEY" -H "Content-Type: application/json" \
  -d '{"first_name":"Jane","last_name":"Doe","email":"jane@example.com","phone":"407-555-0100"}'
```

## Node and Python

- [examples/rest-api-node.mjs](examples/rest-api-node.mjs): page through every customer, then add a job request.
- [examples/rest-api-python.py](examples/rest-api-python.py): the same with `requests`.
- [examples/verify-webhook.mjs](examples/verify-webhook.mjs): check a webhook's signature.

## Webhooks

Subscribe with `POST /webhooks` and a public `https` address:

```json
{ "url": "https://example.com/smarfle", "events": ["client.created", "invoice.paid"] }
```

The answer includes a `secret` once. Every delivery is a POST whose `X-Webhook-Signature` header is the hex HMAC-SHA256 of the raw body with that secret. Events: `client.created`, `client.updated`, `work_order.created`, `work_order.status_changed`, `invoice.created`, `invoice.sent`, `invoice.paid`, `estimate.created`, `estimate.sent`, `estimate.accepted`, `estimate.rejected`, `estimate.converted`.

## Errors

Every error is `{ "error": { "code": "...", "message": "..." } }`: `400 invalid_request`, `401 unauthorized`, `402 plan_required`, `403 forbidden` (read-only key), `404 not_found`, `409 conflict` (a customer with this email exists; `existing_id` is that customer), `429 rate_limited`.

[Back to the lead API examples](./)
