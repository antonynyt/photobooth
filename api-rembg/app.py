from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import new_session, remove
from PIL import Image
import io
import os
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Environment configurations with defaults
REMBG_MODEL = os.getenv("REMBG_MODEL", "silueta")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
print(f"Configured CORS origins: {ALLOWED_ORIGINS}")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB default
ALLOWED_EXTENSIONS = {"jpg"}

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

def validate_image(file: UploadFile):
    # Check file extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension {ext} not allowed. Use {', '.join(ALLOWED_EXTENSIONS)}")
    
    # Check file size (done during read operation)
    return True

@app.post("/replace-background")
@limiter.limit("5/minute")
async def replace_background(
    request: Request,
    subject: UploadFile = File(...),
    new_background: UploadFile = File(...),
):
    try:
        # Validate files
        validate_image(subject)
        validate_image(new_background)
        
        # Read images with size limit
        subject_data = await subject.read(MAX_FILE_SIZE + 1)
        if len(subject_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"Subject file too large (max {MAX_FILE_SIZE // (1024*1024)}MB)")
            
        bg_data = await new_background.read(MAX_FILE_SIZE + 1)
        if len(bg_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"Background file too large (max {MAX_FILE_SIZE // (1024*1024)}MB)")
        
        # Process images
        subject_image = Image.open(io.BytesIO(subject_data))
        bg_image = Image.open(io.BytesIO(bg_data))
        
        session = new_session(REMBG_MODEL)
        subject_nobg = remove(subject_image, session=session)
        
        bg_image = bg_image.resize(subject_nobg.size)
        final_image = Image.alpha_composite(bg_image.convert("RGBA"), subject_nobg)
        
        # Return the result
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
        # Log the error but don't expose details
        print(f"Error processing images: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing images")