import time
import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def generate_text(size_kb):
    # Roughly generate text of a certain size
    base_text = "My dog is happy. He likes to play. "
    repetitions = (size_kb * 1024) // len(base_text)
    return base_text * repetitions

def benchmark(size_kb):
    print(f"Generating {size_kb}KB of text...")
    text = generate_text(size_kb)
    actual_size = len(text)
    print(f"Actual size: {actual_size} characters (approx {actual_size / 1024:.2f} KB)")
    
    start_time = time.time()
    try:
        # Use TestClient
        response = client.post("/resolve", json={"text": text})
        end_time = time.time()
        
        if response.status_code == 200:
            duration = end_time - start_time
            print(f"Success! Duration: {duration:.2f} seconds")
            return duration
        else:
            print(f"Failed with status {response.status_code}")
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"Request failed: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sizes = [int(sys.argv[1])]
    else:
        sizes = [1, 10, 50] # KB
    
    print("Running benchmarks...")
    print("-" * 30)
    
    for size in sizes:
        print(f"\nBenchmarking {size} KB...")
        duration = benchmark(size)
        if duration:
            print(f"Rate: {size / duration:.2f} KB/s")
