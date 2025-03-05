from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import ollama
import torch
from diffusers import StableDiffusionPipeline
import base64
from io import BytesIO
import onnxruntime as ort
# from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI()

session = ort.InferenceSession("stable-diffusion-v1-4.onnx", providers=["CPUExecutionProvider"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)



device = "cuda" if torch.cuda.is_available() else "cpu"
sd_pipeline = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5").to(device)

@app.post("/chat")
async def chat(payload: dict):
    try:
        user_message = payload.get("message", "").lower()
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")

        text_response = ollama.chat(model="llama2", messages=[{"role": "user", "content": user_message}])
        text_content = text_response.get("message", {}).get("content", "")

        generate_image = any(word in user_message for word in ["image", "show", "visual", "illustration", "diagram"])

        if generate_image:
            
            image_prompt = f"An infographic explaining {user_message}"
            image = sd_pipeline(image_prompt).images[0]  # Generate image

            buffered = BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            print("Generated Base64 Image:", img_str[:100])  # Print only first 100 chars for debugging
            


            return {
            "response": text_content,
            "image": img_str  # Send Base64 image
            
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

# ---------------------------------------------------------------------------------------------------------------
# model_name = "meta-llama/Llama-2-7b-hf" 
# model = AutoModelForCausalLM.from_pretrained(model_name)
# tokenizer = AutoTokenizer.from_pretrained(model_name)

# @app.post("/chat")
# async def chat(payload: dict):
#     try:
#         user_message = payload.get("message", "")
#         if not user_message:
#             raise HTTPException(status_code=400, detail="Message is required")

#         prompt = f'User: {user_message}\nAssistant:'
#         inputs = tokenizer(prompt, return_tensors="pt")
#         outputs = model.generate(**inputs, max_length=500, pad_token_id=tokenizer.eos_token_id)
        

#         result = tokenizer.decode(outputs[0], skip_special_tokens=True)
#         assistant_reply = result.split("Assistant:")[1].strip() if "Assistant:" in result else result.strip()
        
#         return {"response": assistant_reply}   
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------------------------------------------------------------------------------------

# @app.post("/chat")
# async def chat(payload: dict):
#     try:
#         user_message = payload.get("message", "")
#         if not user_message:
#             raise HTTPException(status_code=400, detail="Message is required")

#         response = ollama.chat(model="llama2", messages=[{"role": "user", "content": user_message}])
#         if "image" in response:
#                  return {"image": response["image"]}  # Return image data
        
#         return {"response": response["message"]["content"]}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# ------------------------------------------------------------------------------------------------------------------