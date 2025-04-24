import requests

def test_read_main():
    response = requests.get("http://localhost:8000/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World - Beket - V5!"}

def test_item_flow():
    create_response = requests.post("http://localhost:8000/items/", params={"name": "test-item"})
    assert create_response.status_code == 200
    item_id = create_response.json()["id"]

    list_response = requests.get("http://localhost:8000/items/")
    assert list_response.status_code == 200
    assert any(item["id"] == item_id for item in list_response.json()["items"])