import requests

BASE = "http://localhost:8000"

def test_health_check():
    r = requests.get(f"{BASE}/")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}