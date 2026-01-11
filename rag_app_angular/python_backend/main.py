import os
import argparse
import uvicorn
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure local model storage
# This ensures models are saved inside the project directory instead of ~/.cache
base_dir = Path(__file__).parent.absolute()
models_dir = os.path.join(base_dir, "models")
os.makedirs(models_dir, exist_ok=True)

# Set environment variables for Transformers and HuggingFace
# MUST be set before importing fastcoref/transformers
os.environ["TRANSFORMERS_CACHE"] = models_dir
os.environ["HF_HOME"] = models_dir
os.environ["TORCH_HOME"] = models_dir

# Check if model already exists locally to enable offline mode
# The model name is 'biu-nlp/f-coref' which transforms to 'models--biu-nlp--f-coref' in cache
model_path = os.path.join(models_dir, "models--biu-nlp--f-coref")
if os.path.exists(model_path):
    print(f"Local model found at {model_path}. Enabling offline mode to skip HTTPS calls.")
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    os.environ["HF_HUB_OFFLINE"] = "1"
else:
    print(f"Local model not found at {model_path}. Will download on first run.")

from fastcoref import FCoref

# Initialize the model (this will download the model to the local models_dir on first run)
try:
    print(f"Loading coref model into {models_dir} (this may take a minute)...")
    model = FCoref(device='cpu') 
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class ResolveResponse(BaseModel):
    resolved_text: str

@app.post("/resolve", response_model=ResolveResponse)
async def resolve_coreference(request: TextRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    try:
        # fastcoref returns a list of resolved texts (one per input)
        preds = model.predict(texts=[request.text])
        if hasattr(preds[0], 'get_clusters'):
             clusters = preds[0].get_clusters(as_strings=False)
             # clusters is a list of clusters. Each cluster is a list of (start, end) tuples? 
             # Or (start, end) char offsets?
             # Let's verify by printing

             
             # Setup for replacement
             original_text = preds[0].text
             resolved_text = list(original_text)
             
             # Flatten clusters to a list of (start, end, replacement_text)
             replacements = []
             for cluster in clusters:
                 # cluster is list of (start, end)
                 # Assumption: first mention is the "head"
                 head_start, head_end = cluster[0]
                 head_str = original_text[head_start:head_end]
                 
                 for i in range(1, len(cluster)):
                     mention_start, mention_end = cluster[i]
                     replacements.append((mention_start, mention_end, head_str))
             
             # Sort by start index descending
             replacements.sort(key=lambda x: x[0], reverse=True)
             
             # Apply replacements
             for start, end, repl in replacements:
                 resolved_text[start:end] = list(repl)
                 
             return ResolveResponse(resolved_text="".join(resolved_text))
        else:
             return ResolveResponse(resolved_text=str(preds[0]))
    except Exception as e:
        print(f"Error processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Co-reference Resolution API")
    parser.add_argument("--port", type=int, default=8000, help="Port to run the server on")
    args = parser.parse_args()

    uvicorn.run(app, host="0.0.0.0", port=args.port)
