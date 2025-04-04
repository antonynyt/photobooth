<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CameraCapture from '../components/CameraCapture.vue';
import Button from '../components/Button.vue';
import { Home } from '@iconoir/vue';
import PhotoMini from '../components/PhotoMini.vue';

const router = useRouter();
const capturedPhotos = ref([]);
const backgroundFile = ref('/backgrounds/background-1.jpeg');

async function handlePhotoCaptured(photoData) {
    photoData.processing = true;
    capturedPhotos.value.push(photoData);
    await processPhoto(capturedPhotos.value[capturedPhotos.value.length - 1]);

    // Once we have 3 photos, move to results
    if (capturedPhotos.value.length >= 3) {
        // Store photos in localStorage or state management solution
        localStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos.value));
        router.push('/results');
    }
}

async function processPhoto(photo) {
    if (photo.processed) return;

    try {
        // Create FormData to send files to API
        const formData = new FormData();
        formData.append('subject', photo.blob, 'webcam.jpg');

        // Create a blob from the background file URL
        const backgroundResponse = await fetch(backgroundFile.value);
        const backgroundBlob = await backgroundResponse.blob();
        formData.append('new_background', backgroundBlob);

        // Send to API
        const response = await fetch('http://127.0.0.1:8000/replace-background', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get result as blob and update the photo
        const resultBlob = await response.blob();

        // Create a new object reference to trigger reactivity
        const updatedPhoto = { ...photo };
        updatedPhoto.processedUrl = URL.createObjectURL(resultBlob);
        updatedPhoto.processed = true;
        updatedPhoto.processing = false;

        // Find and replace the photo in the array
        const index = capturedPhotos.value.indexOf(photo);
        if (index !== -1) {
            capturedPhotos.value[index] = updatedPhoto;
            console.log('Photo processed successfully. New URL:', updatedPhoto.processedUrl);
        }
    } catch (error) {
        console.error("Error processing image:", error);
        // Reactive update with error state
        const index = capturedPhotos.value.indexOf(photo);
        if (index !== -1) {
            capturedPhotos.value[index] = {
                ...photo,
                error: true,
                processing: false
            };
        }
    }
}

</script>

<template>
    <div class="camera-view">
        <CameraCapture @photo-captured="handlePhotoCaptured" />

        <Button class="home-button" @click="router.push('/')">
            <Home width="30" height="30" />
        </Button>
        <div class="photos-preview">
            <div v-for="(photo, index) in capturedPhotos" :key="index" class="preview-container">
                <PhotoMini :photo="photo" />
                <div class="photo-counter">{{ index + 1 }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.camera-view {
    width: 100%;
    height: 100vh;
}


.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.photos-preview {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.preview-container {
    position: relative;
    max-width: 100px;
}

button.home-button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding: 15px 20px;
    aspect-ratio: 1;
    border: 1px solid #000;
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

.results-container {
    margin-top: 20px;
}

.photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    margin: 20px 0;
}

.reset-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 4px;
}

</style>