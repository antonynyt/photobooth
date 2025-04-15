from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import new_session, remove
from PIL import Image, ImageFile
import io
import os
import asyncio
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Allow PIL to load truncated images (for security checks)
ImageFile.LOAD_TRUNCATED_IMAGES = False

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Load environment variables from .env file
load_dotenv()

# Environment configurations with defaults
REMBG_MODEL = os.getenv("REMBG_MODEL", "silueta")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB default
ALLOWED_EXTENSIONS = {"jpg", "jpeg"}
MAX_IMAGE_WIDTH = int(os.getenv("MAX_IMAGE_WIDTH", 5000))
MAX_IMAGE_HEIGHT = int(os.getenv("MAX_IMAGE_HEIGHT", 5000))

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

def validate_image(file: UploadFile, content: bytes):
    # Validate file extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension {ext} not allowed. Use {', '.join(ALLOWED_EXTENSIONS)}")
    
    # Validate magic number for JPEG
    if not content.startswith(b'\xff\xd8'):
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG is allowed.")
    return True

def process_images(subject_image: Image.Image, bg_image: Image.Image, model_name: str):
    session = new_session(model_name)
    subject_nobg = remove(subject_image, session=session)
    
    # Resize background to match subject size
    bg_image = bg_image.resize(subject_nobg.size)
    
    # Composite images
    final_image = Image.alpha_composite(
        bg_image.convert("RGBA"),
        subject_nobg
    )
    return final_image

@app.post("/replace-background")
@limiter.limit("5/minute")
async def replace_background(
    request: Request,
    subject: UploadFile = File(...),
    new_background: UploadFile = File(...),
):
    try:
        # Read and validate both files first
        subject_data = await subject.read(MAX_FILE_SIZE + 1)
        if len(subject_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Subject file too large")
        
        bg_data = await new_background.read(MAX_FILE_SIZE + 1)
        if len(bg_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Background file too large")

        validate_image(subject, subject_data)
        validate_image(new_background, bg_data)

        # Open images and validate content
        subject_image = Image.open(io.BytesIO(subject_data))
        bg_image = Image.open(io.BytesIO(bg_data))

        # Verify image formats
        if subject_image.format != "JPEG":
            raise HTTPException(status_code=400, detail="Subject must be a valid JPEG image")
        if bg_image.format != "JPEG":
            raise HTTPException(status_code=400, detail="Background must be a valid JPEG image")

        # Validate image dimensions
        if (subject_image.width > MAX_IMAGE_WIDTH or 
            subject_image.height > MAX_IMAGE_HEIGHT):
            raise HTTPException(status_code=400, detail="Subject image dimensions exceed maximum allowed")
        
        if (bg_image.width > MAX_IMAGE_WIDTH or 
            bg_image.height > MAX_IMAGE_HEIGHT):
            raise HTTPException(status_code=400, detail="Background image dimensions exceed maximum allowed")

        # Process images in thread pool executor
        final_image = await asyncio.to_thread(
            process_images,
            subject_image,
            bg_image,
            REMBG_MODEL
        )

        # Save and return result
        img_byte_arr = io.BytesIO()
        final_image.save(img_byte_arr, format="PNG")
        
        return Response(
            content=img_byte_arr.getvalue(), 
            media_type="image/png",
            headers={
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "no-store"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing images: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing images")