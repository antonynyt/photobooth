from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import new_session, remove
from PIL import Image, ImageFilter
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
    
    model_name = "birefnet-general-lite"
    session = new_session(model_name)
    # Remove background from subject
    subject_nobg = remove(subject_image, session=session)
    
    # Create stroke around subject
    # Extract alpha channel (the mask)
    alpha_mask = subject_nobg.split()[3]
    
    # Apply dilation to create the stroke effect
    stroke_width = 15  # Adjust for thicker/thinner stroke
    dilated_mask = alpha_mask.filter(ImageFilter.MaxFilter(stroke_width))
    
    # Create a new image with the stroke color
    stroke_color = (255, 70, 5, 255)  # Black stroke
    stroke_image = Image.new("RGBA", subject_nobg.size, stroke_color)
    stroke_image.putalpha(dilated_mask)
    
    # Composite: background → stroke → subject
    bg_image = bg_image.resize(subject_nobg.size)
    bg_with_stroke = Image.alpha_composite(bg_image.convert("RGBA"), stroke_image)
    final_image = Image.alpha_composite(bg_with_stroke, subject_nobg)
    
    # Return the result
    img_byte_arr = io.BytesIO()
    final_image.save(img_byte_arr, format="PNG")
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")