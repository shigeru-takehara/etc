# RAG Assistant (Angular Edition)

A powerful, local-first Retrieval-Augmented Generation (RAG) assistant built with Angular 19 and a Python-based co-reference resolution engine.

## 🚀 Quick Start

To launch both the Angular frontend and the Python backend manager:

```powershell
node start-app.js
```

The application will be available at `http://localhost:4200`.

## ✨ Key Features

- **Local & Cloud Support**: Seamlessly switch between local LLMs (Ollama, LM Studio) and Cloud APIs (OpenAI).
- **Persistent Configuration**: Your settings, workspaces, and document indexes are automatically saved and restored on reload.
- **Advanced RAG Features**:
  - **Smart Split**: Intelligently chunks large PDFs to maintain high context relevance.
  - **Smart Search**: Uses AI query re-writing to optimize search retrieval.
  - **Co-reference Resolution**: A persistent Python backend resolves ambiguous nouns (e.g., "it", "they") for superior accuracy.
  - **Dynamic Thresholding**: Real-time control over "Search Precision" and "Result Count".
- **Local AI Privacy**: Co-reference models are stored locally in the project directory (`python_backend/models`).
- **Memory Efficient**: Implements segment-based processing to keep memory usage under 2GB.

## 🛠️ Prerequisites

### System Requirements
- **Node.js**: v20+ 
- **Python**: v3.10+
- **Angular CLI**: `npm install -g @angular/cli`

### Python Backend Setup
```powershell
pip install -r python_backend/requirements.txt
```

### LLM Requirements
- **Local**: Ollama or LM Studio running on `http://localhost:11434` or `http://localhost:1234`.
- **Cloud**: A valid OpenAI-compatible API Key.

## 📁 Project Structure

- `src/`: Angular frontend source code.
- `python_backend/`: FastAPI server for co-reference resolution.
- `start-app.js`: Unified launcher and backend manager.
- `src/assets/backend-config.json`: Auto-generated configuration for service discovery.

## ⚙️ Configuration Labels

- **Smart Split**: Prevents "lost in the middle" issues by segmenting large files.
- **Smart Search**: Re-writes casual questions into keyword-rich search queries.
- **Result Count (Top-K)**: Number of document fragments sent to the LLM.
- **Search Precision**: The similarity threshold required for a document to be considered "relevant".

---

Generated for **Advanced Agentic Coding** training.
