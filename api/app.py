from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/replace-background")
async def replace_background(
    subject: UploadFile = File(...),
    new_background: UploadFile = File(...),
):
    # Read images
    subject_image = Image.open(io.BytesIO(await subject.read()))
    bg_image = Image.open(io.BytesIO(await new_background.read()))
    
    # Remove background from subject
    subject_nobg = remove(subject_image)
    
    # Composite subject onto new background
    bg_image = bg_image.resize(subject_nobg.size)
    final_image = Image.alpha_composite(bg_image.convert("RGBA"), subject_nobg)
    
    # Return the result
    img_byte_arr = io.BytesIO()
    final_image.save(img_byte_arr, format="PNG")
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")