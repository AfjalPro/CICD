import requests

BASE = "http://localhost:8000"

def test_signup_and_duplicate():
    user = {
        "username": "testuser_signup",
        "email":    "signup@example.com",
        "password": "mypassword"
    }

    r1 = requests.post(f"{BASE}/signup/", json=user)
    assert r1.status_code == 200
    data = r1.json()
    assert data["username"] == user["username"]
    assert data["email"] == user["email"]

    r2 = requests.post(f"{BASE}/signup/", json=user)
    assert r2.status_code == 400
