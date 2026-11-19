# Smarfle REST API v1 example. Run: SMARFLE_KEY=smk_... python3 rest-api-python.py  (pip install requests)
import os
import requests

BASE = "https://www.smarfle.com/api/v1"
session = requests.Session()
session.headers.update({"Authorization": f"Bearer {os.environ['SMARFLE_KEY']}"})


def api(method, path, **kwargs):
    res = session.request(method, BASE + path, timeout=30, **kwargs)
    body = res.json()
    if not res.ok:
        raise RuntimeError(f"{res.status_code} {body['error']['code']}: {body['error']['message']}")
    return body


# Page through every customer (reads are free).
customers, cursor = [], None
while True:
    params = {"limit": 100, **({"cursor": cursor} if cursor else {})}
    page = api("GET", "/customers", params=params)
    customers += page["data"]
    if not page["has_more"]:
        break
    cursor = page["next_cursor"]
print(f"{len(customers)} customers")

# Add a customer (needs a read and write key). A duplicate email answers 409 with existing_id.
new = api("POST", "/customers", json={"first_name": "Jane", "last_name": "Doe", "email": "jane.doe@example.com"})
print("Added", new["id"])
