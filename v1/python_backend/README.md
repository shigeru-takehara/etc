# Python Co-reference Resolution Backend

This directory contains the FastAPI backend for performing co-reference resolution using `fastcoref`.

## Setup

1.  Install Python 3.8+.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running

You can run the backend manually:

```bash
python main.py --port 8000
```

## API

### POST /resolve

Resolves co-references in the provided text.

**Request Body:**
```json
{
  "text": "My dog is happy. He likes to play."
}
```

**Response:**
```json
{
  "resolved_text": "My dog is happy. My dog likes to play."
}
```
