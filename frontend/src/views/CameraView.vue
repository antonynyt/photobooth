<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import { Home } from '@iconoir/vue';
import PhotoMini from '../components/PhotoMini.vue';
import { photos } from '../stores/imageStore';
import { useCamera } from '../composables/useCamera';
import { usePhotoProcessing } from '../composables/usePhotoProcessing';
import TheShutterButton from '../components/TheShutterButton.vue';
import TheCountdown from '../components/TheCountdown.vue';

const router = useRouter();

const { video, cameraActive, cameraError, startCamera, stopCamera, captureFrame } = useCamera();
const { processPhoto } = usePhotoProcessing();

const countdownActive = ref(false);
const countdownValue = ref(3);
const shotsLeft = computed(() => 3 - photos.value.length);


onMounted(async () => {
    await startCamera(video.value);
    if (shotsLeft.value <= 0) {
        router.push('/results');
    }
});

function getBackgroundForPhotoIndex(index) {
    const backgroundNumber = index + 1;
    return `/backgrounds/background-${backgroundNumber}.jpg`;
}

function takePhoto() {
    if (!cameraActive.value || countdownActive.value || shotsLeft.value <= 0) return;
    
    // Start the photo sequence
    takePhotoSequence();
}

async function takePhotoSequence() {
   
    while (shotsLeft.value > 0) {
        countdownActive.value = true;
        countdownValue.value = 3;

        await new Promise(resolve => {
            const countdownInterval = setInterval(() => {
                countdownValue.value--;

                if (countdownValue.value <= 0) {
                    clearInterval(countdownInterval);
                    resolve();
                }
            }, 1000);
        });

        const frame = captureFrame(video.value);
        if (frame) {
            const blob = await frame.toBlob();
            const photoData = {
                blob,
                dataUrl: frame.dataUrl,
                width: frame.width,
                height: frame.height,
                processed: false,
                timestamp: Date.now(),
                processing: true,
                backgroundFile: getBackgroundForPhotoIndex(photos.value.length)
            };

            handlePhotoCaptured(photoData);
        }
    }
    countdownActive.value = false;
}

async function handlePhotoCaptured(photoData) {
    photos.value.push(photoData);

    const processedPhoto = await processPhoto(photoData, import.meta.env.VITE_REMBG_API_URL);

    const index = photos.value.findIndex(p => p.timestamp === photoData.timestamp);
    if (index !== -1) {
        photos.value[index] = processedPhoto;
    }
    if (photos.value.length >= 3) {
        router.push('/results');
    }
}

function goHome() {
    router.push('/');
}

onUnmounted(() => {
    stopCamera();
});
</script>

<template>
    <div class="camera-view">
        <div class="camera-container">
            <div v-if="cameraError" class="camera-error">
                <p>Camera error: {{ cameraError }}</p>
            </div>
            <video ref="video" autoplay playsinline></video>
            <TheCountdown v-if="countdownActive" :value="countdownValue" />
        </div>

        <nav>
            <Button class="home-button" @click="goHome">
                <Home width="30" height="30" />
            </Button>

            <div class="shutter-container">
                <TheShutterButton @click="takePhoto" :shots-left="shotsLeft" :disabled="!cameraActive || countdownActive || shotsLeft <= 0" />
            </div>

            <div class="photos-preview">
                <div v-for="(photo, index) in photos" :key="index" class="preview-container">
                    <PhotoMini :photo="photo" />
                    <div class="photo-counter">{{ index + 1 }}</div>
                </div>
            </div>
        </nav>
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

video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}

.camera-container {
    height: 100svh;
    margin: 0;
    overflow: hidden;
}

.camera-error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    z-index: 100;
}

.camera-error button {
    background: white;
    color: black;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
}

nav {

    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: end;
    z-index: 1;
    padding: 2rem 1rem;
    width: 100%;
    box-sizing: border-box;
}

.shutter-container {
    flex-grow: 1;
}

.photos-preview {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
}

.preview-container {
    position: relative;
    max-width: 100px;
}

button.home-button {
    background: #fff;
    aspect-ratio: 1;
    outline: 1px solid #ddd;
    position: absolute;
    top: 2rem;
    left: 1em;
}

.photo-counter {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5em 1em;
    border-radius: 15px;
    aspect-ratio: 1;
    font-size: 14px;
}

@media only screen and (min-device-width: 768px) and (min-width: 768px) {
    nav {
        padding: 2rem;
        flex-direction: row;
    }

    button.home-button {
        position: static;
    }

    .shutter-container {
        flex-grow: 0;
        position: absolute;
        bottom: 1rem;
        left: 0;
        right: 0;
        z-index: -1;
    }
}
</style>