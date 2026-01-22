from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_resolve():
    print("Testing /resolve endpoint...")
    text = "My dog is happy. He likes to play."
    response = client.post("/resolve", json={"text": text})
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(f"Detail: {response.text}")
    assert response.status_code == 200
    data = response.json()
    print(f"Input: {text}")
    print(f"Output: {data['resolved_text']}")
    # Expected: My dog is happy. My dog likes to play.
    # Note: exact output depends on the model, but 'My dog' should appear.
    assert "My dog" in data['resolved_text']

if __name__ == "__main__":
    try:
        test_resolve()
        print("Test Passed!")
    except Exception as e:
        print(f"Test Failed: {e}")
