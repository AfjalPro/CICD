import requests

BASE = "http://localhost:8000"

def test_post_crud_lifecycle():
    u = {
        "username": "testuser_post",
        "email":    "post@example.com",
        "password": "postpass"
    }
    requests.post(f"{BASE}/signup/", json=u)

    login = requests.post(
        f"{BASE}/token",
        data={"username": u["username"], "password": u["password"]},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    ).json()
    token = login["access_token"]
    auth = {"Authorization": f"Bearer {token}"}

    r_unauth = requests.post(f"{BASE}/posts/", json={"title":"T","content":"C"})
    assert r_unauth.status_code == 401

    # create a post
    r_create = requests.post(
        f"{BASE}/posts/",
        json={"title": "My Title", "content": "My content"},
        headers=auth
    )
    assert r_create.status_code == 200
    post = r_create.json()
    post_id = post["id"]
    assert post["title"] == "My Title"

    r_all = requests.get(f"{BASE}/posts/")
    assert r_all.status_code == 200
    assert any(p["id"] == post_id for p in r_all.json())

    r_my = requests.get(f"{BASE}/posts/me", headers=auth)
    assert r_my.status_code == 200
    assert any(p["id"] == post_id for p in r_my.json())

    r_upd = requests.put(
        f"{BASE}/posts/{post_id}",
        json={"title": "Updated", "content": "Updated content"},
        headers=auth
    )
    assert r_upd.status_code == 200
    assert r_upd.json()["title"] == "Updated"

    r_del = requests.delete(f"{BASE}/posts/{post_id}", headers=auth)
    assert r_del.status_code == 200
    assert r_del.json()["detail"] == "Deleted"

    r_not = requests.get(f"{BASE}/posts/{post_id}")
    assert r_not.status_code == 404
