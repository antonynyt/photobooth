<script setup>
import { useRouter } from 'vue-router';
import CameraCapture from '../components/CameraCapture.vue';
import Button from '../components/Button.vue';
import { Home } from '@iconoir/vue';
import PhotoMini from '../components/PhotoMini.vue';
import { photos } from '../stores/photos';

const router = useRouter();

function getBackgroundForPhotoIndex(index) {
    const backgroundNumber = index + 1;
    return `/backgrounds/background-${backgroundNumber}.jpg`;
}

async function handlePhotoCaptured(photoData) {
    photoData.processing = true;
    photoData.backgroundFile = getBackgroundForPhotoIndex(photos.value.length);
    photos.value.push(photoData);
    await processPhoto(photos.value[photos.value.length - 1]);

    if (photos.value.length >= 3) {
        router.push('/results');
    }
}

async function processPhoto(photo) {
    if (photo.processed) return;

    try {
        // Create FormData to send files to API
        const formData = new FormData();
        
        // Create a blob from the background file URL
        const backgroundResponse = await fetch(photo.backgroundFile);
        const backgroundBlob = await backgroundResponse.blob();
        formData.append('subject', photo.blob, 'webcam.jpg');
        formData.append('new_background', backgroundBlob, 'background.jpg');

        // Send to API
        const response = await fetch(import.meta.env.VITE_REMBG_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get result as blob and update the photo
        const resultBlob = await response.blob();
        
        // Convert blob to data URL instead of creating a blob URL
        const dataUrl = await blobToDataURL(resultBlob);

        // Create a new object reference to trigger reactivity
        const updatedPhoto = { ...photo };
        updatedPhoto.processedUrl = dataUrl;
        updatedPhoto.processed = true;
        updatedPhoto.processing = false;

        // Find and replace the photo in the array
        const index = photos.value.indexOf(photo);
        if (index !== -1) {
            photos.value[index] = updatedPhoto;
            console.log('Photo processed successfully');
        }
    } catch (error) {
        console.error("Error processing image:", error);
        // Reactive update with error state
        const index = photos.value.indexOf(photo);
        if (index !== -1) {
            photos.value[index] = {
                ...photo,
                error: true,
                processing: false
            };
        }
    }
}

// Helper function to convert Blob to Data URL
function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

</script>

<template>
    <div class="camera-view">
        <CameraCapture @photo-captured="handlePhotoCaptured" />

        <Button class="home-button" @click="router.push('/')">
            <Home width="30" height="30" />
        </Button>
        <div class="photos-preview">
            <div v-for="(photo, index) in photos" :key="index" class="preview-container">
                <PhotoMini :photo="photo" />
                <div class="photo-counter">{{ index + 1 }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.camera-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100svh;
}

.photos-preview {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    position: absolute;
    bottom: 2rem;
    right: 2rem;
}

.preview-container {
    position: relative;
    max-width: 100px;
}

button.home-button {
    background: #fff;
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    aspect-ratio: 1;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
}

.photo-counter {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    aspect-ratio: 1;
    font-size: 14px;
}

</style>