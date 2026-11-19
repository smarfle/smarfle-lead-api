---
title: "Smarfle Lead API examples"
description: "Send leads from your website, ads or forms into Smarfle with curl, Node, Python, PHP, Zapier or a form builder."
permalink: /
---

# Smarfle Lead API examples

Working examples for sending leads from your website, ads or forms into [Smarfle](https://www.smarfle.com), the software for home and field service businesses. Each lead becomes a client with the status Lead, with the request shown at the top of the client page and an alert to the office.

The full reference lives at [smarfle.com/docs/api](https://www.smarfle.com/docs/api). This repo adds copy-and-run examples.

**New: the REST API v1.** Read and write customers, jobs, invoices and services and subscribe to webhooks: see [REST API v1 examples](rest-api.md).

## Get your API key

In Smarfle, open **Company Settings**, then the **Integrations** tab, find **API key** and press **Generate API Key**. Keys start with `rk_`. Keep the key private and generate a new one if it ever leaks.

## Two ways to send a lead

| Endpoint | Key | Body | Best for |
|---|---|---|---|
| `POST https://www.smarfle.com/api/webhook/leads` | `x-api-key` header | JSON with the fields below | Your own code, Zapier, Make |
| `POST https://www.smarfle.com/api/webhook/leads/{api_key}` | In the URL | JSON, form data or URL-encoded, field names matched automatically | Form builders that only take a URL (Contact Form 7, Elementor, WPForms, Gravity Forms) |

The second endpoint recognizes common field names, such as `name`, `your-name`, `fname`, `email`, `your-email`, `phone`, `tel`, `message`, `city` and `zip`, including Elementor's nested `fields` object.

## Fields (header endpoint)

| Field | Type | Notes |
|---|---|---|
| `first_name` | string, required | up to 200 characters |
| `last_name` | string, required | up to 200 characters |
| `email` | string | must be a valid email |
| `phone` | string | US number |
| `address_street`, `address_unit`, `address_city`, `address_state`, `address_zip` | string | address parts |
| `address` | string | a one-line address, split into parts when the parts are not sent |
| `company_name` | string | |
| `message` | string | what the customer asked for, up to 5,000 characters |
| `notes` | string | internal notes |
| `source_page`, `page_title` | string | where the form was filled in |
| `custom_fields` | object | `{ "Field name": value }`, saved to the business's custom field of the same name, up to 30 |
| `details` | object | `{ "Label": value }`, extra lines shown in the request, up to 20 |
| `utm_source`, `utm_medium`, `utm_campaign` | string | first-touch attribution |
| `branch_id` | uuid | send leads to one office of a business with several |
| `sms_consent` | boolean | defaults to `false`; send `true` only when your own form collected consent to text |
| `sms_consent_source` | string | how and where that consent was collected |

## Responses

| Status | Meaning |
|---|---|
| 200 | `{ "success": true, "client_id": "..." }` |
| 400 | Validation failed, the plan's client limit is reached, or `branch_id` belongs to another business |
| 401 | Missing or wrong API key |
| 409 | A client with this email already exists. The request is still saved on that client (`client_id`, `request_saved: true`) |
| 429 | More than 20 requests a minute from one address. Wait and retry |

## Examples

- [curl](examples/curl.sh)
- [JavaScript (Node 18 or newer, no packages)](examples/node.mjs)
- [Python (standard library only)](examples/python.py)
- [PHP (WordPress friendly)](examples/php.php)
- [Zapier](examples/zapier.md)
- [Form builders that only take a URL](examples/form-builders.md)

## Text messages and consent

Leads arrive with `sms_consent: false` unless you send `true`. Smarfle will not text a lead without consent, so only send `true` when your form showed a clear consent line and the customer agreed, and describe it in `sms_consent_source`.

## Cost

Each lead you send counts as one API call on your Smarfle plan ($0.003 per call). Plans start at $19 a month with a 14-day free trial.

## Links

- [Smarfle](https://www.smarfle.com) and [the API reference](https://www.smarfle.com/docs/api)
- [Free field service templates](https://smarfle.github.io/field-service-templates/)
- [Smarfle on LinkedIn](https://www.linkedin.com/company/smarfle)

## License

MIT
