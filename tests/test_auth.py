import requests

BASE = "http://localhost:8000"

def test_login_and_profile():
    signup_payload = {
        "username": "testuser_auth",
        "email":    "auth@example.com",
        "password": "secretpass"
    }
    requests.post(f"{BASE}/signup/", json=signup_payload)

    r_bad = requests.post(
        f"{BASE}/token",
        data={"username": signup_payload["username"], "password": "wrongpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert r_bad.status_code == 401

    r_ok = requests.post(
        f"{BASE}/token",
        data={"username": signup_payload["username"], "password": signup_payload["password"]},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert r_ok.status_code == 200
    body = r_ok.json()
    assert "access_token" in body and body["token_type"] == "bearer"
    token = body["access_token"]

    r_profile = requests.get(
        f"{BASE}/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert r_profile.status_code == 200
    assert r_profile.json()["username"] == signup_payload["username"]
