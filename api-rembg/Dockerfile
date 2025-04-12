FROM python:3.13-slim

WORKDIR /app

# Install system dependencies required for Pillow and other packages
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Expose the port the app will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app:app", "--workers", "2", "--host", "0.0.0.0", "--port", "8000"]
