# Send leads from Zapier

Use this when a lead lands somewhere Zapier can read, such as Facebook Lead Ads, a Google Sheet, Typeform or Jotform.

1. Pick your trigger app and test it so Zapier has a sample lead.
2. Add the action **Webhooks by Zapier**, event **POST**.
3. URL `https://www.smarfle.com/api/webhook/leads`
4. Payload Type `json`
5. Data, one row per field. Map `first_name`, `last_name`, `email`, `phone` and `message` from your trigger. Add `utm_source` with a fixed value such as `facebook` so you can tell where leads came from.
6. Headers, add `x-api-key` with your key from Company Settings, Integrations, API key.
7. Test the step. A new lead appears in Smarfle and the response shows `"success": true`.

If your trigger gives a single full name, send it as `first_name` and put the last word in `last_name`, or use the URL endpoint in [form-builders.md](form-builders.md), which splits names by itself.
