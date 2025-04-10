https://cloudinary.com/demo/generative-background-replace

# Install
Create venv:
1. cd api
1. python3 -m venv venv
2. `source api/venv/bin/activate` or Windows: `.\venv\Scripts\activate.bat`
3. pip install -r requirements.txt
4. uvicorn app:app --reload

## docker

1. cd api
2. docker build -t photobooth-api .
3. docker run --name photobooth-api -p 8001:8000 -d photobooth-api

## Test API
`curl -X POST -F "subject=@user.jpg" -F "new_background=@background.jpeg" http://127.0.0.1:8000/replace-background --output result.png`

## troubleshoot
in venv:
1. pip install onnxruntime
2. pip install --force-reinstall rembg

# Models

use a model: `model_name = "birefnet-general-lite"`

All models are downloaded and saved in the user home folder in the .u2net directory.
- https://github.com/danielgatis/rembg

## tests
- birefnet-portrait -> amazing results but too long
- birefnet-general-lite -> good result, take too long
- u2net_human_seg -> bad with hairs