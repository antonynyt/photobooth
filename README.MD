# Photobooth Project

This project is a multi-component application designed to provide a photobooth experience with background removal, image storage, and a mosaic display.

## Project Structure

- **[`/frontend`](frontend/)**: The main frontend application for the photobooth.
- **[`/api-rembg`](api-rembg/)**: The python API for background removal using `rembg`.
- **[`/api-storage`](api-storage/)**: The express API for managing image storage using MongoDB.
- **[`/mosaic`](mosaic/)**: The frontend application for displaying a mosaic of images.

---

# Requirements

- Node.js 18.x or higher
- Python 3.8 or higher
- MongoDB 5.x or higher
- Docker (optional, for containerized deployment)

# Installation

## Quick setup

```bash
# Clone the repository
git clone https://github.com/antonynyt/photobooth.git
cd photobooth

# Before running the setup script insure that you have a Mongodb running
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest

# Install all dependencies and run setup
npm run setup:all

# Then create and fill the .env files accordingly
```

The setup script will:

1. Install dependencies for all components
2. Generate an API key and bcrypt hash
3. Create a booth ID in MongoDB
4. Give you the API key for the backend to setup the .env files

**!!You need to update the .env files with the required configuration!!**

Now you need to run the rembg-api to remove the background. The instructions are in the [`/api-rembg/readme.md`](api-rembg/README.md) file.

or you can build and run the docker container:

```bash
# Change directory
cd ./api-rembg

# Build image
docker build -t photobooth-api

# Run the container
docker run -e REMBG_MODEL=silueta -e ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8888 --name rembg-api -p 8001:8000 -d photobooth-api 
```

For the photobooth frontend you can use the instructions in the [`/frontend/readme.md`](frontend/README.md) file.

## Environment Variables
Each component requires specific environment variables. Refer to the `.env.example` files in each directory for configuration details.

### API Storage (.env)

```bash
# api-storage/.env
BOOTHID = "[GENERATED_BOOTH_ID]"  # Provided by setup script
KEY = "[GENERATED_API_KEY]"       # Provided by setup script
DATABASE_URL = "[MONGODB_URI]"    # MongoDB connection string
```

### API REMBG (.env)

```bash
# api-rembg/.env
REMBG_MODEL=silueta               # Model for background removal default: silueta
ALLOWED_ORIGINS=[FRONTEND_URLS]   # Comma-separated URLs that can access the API
MAX_FILE_SIZE=10485760            # Maximum file size in bytes (10MB)
```

### Frontend (.env)
```bash
# frontend/.env
VITE_REMBG_API_URL="http://localhost:8000/replace-background"  # REMBG API endpoint
VITE_STORAGE_API_URL="http://localhost:3000"                   # Storage API endpoint
BOOTH_ID="[GENERATED_BOOTH_ID]"  # Provided by setup script
STORAGE_API_KEY="[HASHED_API_KEY]"                          # Bcrypt hash from setup

# email configuration
MAILGUN_API_KEY=""
MAILGUN_DOMAIN="example.com"
MAILGUN_SENDER="postmaster@example.com"
```

### Mosaic (.env)
```bash
# mosaic/.env
VITE_STORAGE_API_URL="http://localhost:3000"  # Storage API endpoint
```

## Important Notes
1. The setup script generates values for:
- API key (raw key for backend)
- Bcrypt hash of the API key (for frontend)
- Booth ID (if creating a new one)

2. Make sure your MongoDB is running before starting the services

3. The API endpoints must be accessible from the frontend - check for CORS issues if connections fail