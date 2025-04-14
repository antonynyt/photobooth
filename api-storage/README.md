https://cloudinary.com/demo/generative-background-replace

# Install
Create venv:
0. python3 -m venv venv
1. source api/venv/bin/activate
2. pip install requirements.txt
3. uvicorn app:app --reload

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