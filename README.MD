# Photobooth Project

This project is a multi-component application designed to provide a photobooth experience with background removal, image storage, and a mosaic display. Below is an overview of the components:

## Project Structure

- **[`/frontend`](frontend/)**: The main frontend application for the photobooth.
- **[`/api-rembg`](api-rembg/)**: The backend API for background removal using `rembg`.
- **[`/api-storage`](api-storage/)**: The backend API for managing image storage using MongoDB.
- **[`/frontend-mosaique`](frontend-mosaique/)**: The frontend application for displaying a mosaic of images.

---

## Components Overview

### 1. Frontend
The main user-facing application where users can interact with the photobooth. Built with Vue.js and Vite.

### 2. API-REMBG
A FastAPI-based backend for removing backgrounds from images using the rembg library.

### 3. API-Storage
A backend API for managing image storage using MongoDB.

### 4. Frontend-Mosaique
A Vue.js-based frontend for displaying a mosaic of images stored in the database.

## Environment Variables
Each component requires specific environment variables. Refer to the .env.example files in each directory for configuration details.