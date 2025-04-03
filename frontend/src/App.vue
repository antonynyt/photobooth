<script setup>
import { ref, computed } from 'vue';
import TheHeader from './components/TheHeader.vue';
import CameraCapture from './components/CameraCapture.vue';
import PhotoResult from './components/PhotoMini.vue';
import Button from './components/Button.vue';
import { Home } from '@iconoir/vue';

const capturedPhotos = ref([]);
const backgroundFile = ref('/backgrounds/background-1.jpeg');
const showResults = computed(() => capturedPhotos.value.length >= 3);

async function handlePhotoCaptured(photoData) {
    photoData.processing = true;
    capturedPhotos.value.push(photoData);
    await processPhoto(capturedPhotos.value[capturedPhotos.value.length - 1]);
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

// Reset the process and start over
function resetPhotos() {
    capturedPhotos.value = [];
}
</script>

<template>
    <div class="app-container">
        <!-- <TheHeader /> -->

        <!-- Capture Mode -->
        <div v-if="!showResults" class="container">
            <CameraCapture @photo-captured="handlePhotoCaptured" />

            <Button class="home-button" @click="resetPhotos">
                <Home width="30" height="30" />
            </Button>
            <div class="photos-preview">
                <div v-for="(photo, index) in capturedPhotos" :key="index" class="preview-container">
                    <PhotoResult :photo="photo" />
                    <div class="photo-counter">{{ index + 1 }}</div>
                </div>
            </div>
        </div>

        <!-- Results Mode -->
        <div v-else class="results-container">
            <div class="photos-grid">
                <div v-for="(photo, index) in capturedPhotos" :key="index" class="grid-item">
                    <PhotoResult :photo="photo" />
                </div>
            </div>
            <button @click="resetPhotos" class="reset-button">Take New Photos</button>
        </div>
    </div>
</template>

<style>
.app-container {
    margin: 0 auto;
    text-align: center;
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
    max-width: 150px;
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
