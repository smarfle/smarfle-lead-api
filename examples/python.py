"""Send one lead to Smarfle with the Python standard library.

    SMARFLE_API_KEY=rk_your_key_here python3 python.py
"""
import json
import os
import urllib.error
import urllib.request

key = os.environ.get("SMARFLE_API_KEY")
if not key:
    raise SystemExit("Set SMARFLE_API_KEY first")

lead = {
    "first_name": "Morgan",
    "last_name": "Ellis",
    "email": "morgan@example.com",
    "phone": "(202) 555-0101",
    "address_street": "125 Sample Lane",
    "address_city": "Orlando",
    "address_state": "FL",
    "address_zip": "32801",
    "message": "AC is blowing warm air, can someone come tomorrow?",
    "utm_source": "facebook",
    "sms_consent": False,
}

req = urllib.request.Request(
    "https://www.smarfle.com/api/webhook/leads",
    data=json.dumps(lead).encode(),
    headers={"Content-Type": "application/json", "x-api-key": key},
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=15) as res:
        print("Lead created:", json.load(res).get("client_id"))
except urllib.error.HTTPError as e:
    body = json.loads(e.read() or b"{}")
    if e.code == 409:
        print("Client already existed, request saved on:", body.get("client_id"))
    elif e.code == 429:
        print("Too many requests, wait a minute and retry")
    else:
        print("Failed:", e.code, body.get("error"))
