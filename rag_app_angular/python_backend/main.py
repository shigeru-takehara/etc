import argparse
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastcoref import FCoref

# Initialize the model (this will download the model on first run)
# Using 'fqasrey/fcoref-distilbert-base-uncased' as it is smaller and faster
try:
    model = FCoref(device='cpu') # Use CPU for compatibility, or 'cuda' if available
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

app = FastAPI()

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
