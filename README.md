### Place the Server File inside a python .venv (environment file)

```python -m venv .venv
source .venv/bin/activate  # Mac/Linux
.venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### inside the requirement.txt place this code
```
fastapi
uvicorn
torch
diffusers
onnxruntime
ollama
transformers
```
