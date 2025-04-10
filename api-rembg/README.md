# Development

## Installation for Development
To set up the development environment:

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     .\venv\Scripts\activate.bat
     ```
4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the development server:
   ```bash
   uvicorn app:app --reload
   ```

## Testing the API
To test the API, use the following `curl` command:

```bash
curl -X POST -F "subject=@user.jpg" -F "new_background=@background.jpeg" http://127.0.0.1:8000/replace-background --output result.png
```

## Troubleshooting
If you encounter issues in the virtual environment, try the following:

1. Install `onnxruntime`:
   ```bash
   pip install onnxruntime
   ```
2. Reinstall `rembg`:
   ```bash
   pip install --force-reinstall rembg
   ```

## Models
To specify a model, set the `REMBG_MODEL` environment variable in the `.env` file. For example:
```env
REMBG_MODEL=silueta
```

All models are downloaded and saved in the `.u2net` directory in the user's home folder. Refer to the [rembg repository](https://github.com/danielgatis/rembg) for more details.

### Available Models:
- **birefnet-portrait**: Produces amazing results but is slow.
- **birefnet-general-lite**: Provides good results but takes too long.
- **u2net_human_seg**: Struggles with hair segmentation.

## Environment Variables
Each component requires specific environment variables. Refer to the `.env.example` files in each directory for configuration details.

# Production

## Docker Setup
To build and run the application using Docker:

1. In the `api` directory Build the Docker image:
   ```bash
   docker build -t photobooth-api .
   ```
2. Run the Docker container change the env variables:
   ```bash
   docker run -e REMBG_MODEL=silueta -e ALLOWED_ORIGINS=http://localhost:5173 --name photobooth-api -p 8001:8000 -d photobooth-api
   ```