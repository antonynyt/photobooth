<script setup>
import { ref, onUnmounted, onMounted } from 'vue';
import TheShutterButton from './TheShutterButton.vue';

const video = ref(null);
const stream = ref(null);
const cameraActive = ref(false);
const countdownActive = ref(false);
const countdownValue = ref(3);

const emit = defineEmits(['photo-captured']);
const shotsleft = ref(3);

async function startCamera() {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
        });
        video.value.srcObject = stream.value;
        cameraActive.value = true;
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please make sure it's connected and you've given permission.");
    }
}

function takePhoto() {
    if (!stream.value) return;

    // Start countdown
    countdownActive.value = true;
    countdownValue.value = 3;

    const countdownInterval = setInterval(() => {
        countdownValue.value--;

        if (countdownValue.value <= 0) {
            shotsleft.value--;
            clearInterval(countdownInterval);
            countdownActive.value = false;

            // Take photo
            const canvas = document.createElement('canvas');
            canvas.width = video.value.videoWidth;
            canvas.height = video.value.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video.value, 0, 0, canvas.width, canvas.height);

            // Convert to blob and emit
            canvas.toBlob((blob) => {
                emit('photo-captured', {
                    blob,
                    dataUrl: canvas.toDataURL('image/jpeg'),
                    width: canvas.width,
                    height: canvas.height,
                    processed: false
                });
            }, 'image/jpeg');
        }
    }, 1000);
}

onMounted(() => {
    // Start camera when component is mounted
    startCamera();
});

onUnmounted(() => {
    // Stop camera when component is unmounted
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
    }
});
</script>

<template>
    <div v-if="countdownActive" class="countdown">
        <div>{{ countdownValue }}</div>
    </div>
    <div class="camera-container">
        <video ref="video" autoplay playsinline></video>
        <div class="shutter-container">
            <div class="shots-left">
                <p>{{ shotsleft }} shots left</p>
            </div>
            <TheShutterButton @click="takePhoto" :disabled="!cameraActive || countdownActive || shotsleft <= 0"/>
        </div>
    </div>
</template>

<style scoped>
video {
    width: 100vw;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}

.camera-container {
    position: relative;
    height: 100svh;
    margin: 0;
    overflow: hidden;
}

.shutter-container {
    position: absolute;
    bottom: 20px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    left: 0;
    right: 0;
}

.shots-left {
    background-color: #fff;
    color: #000;
    display: flex;
    padding: 10px 25px;
    border-radius: 5px 5px 0 0;
    border: 1px solid #000;
    border-bottom: none;
}

.countdown {
    position: absolute;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    pointer-events: none;
    font-family: "Monument", sans-serif;
}

.countdown div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 200px;
    color: var(--purple);
    font-size: 50px;
    font-weight: bold;
}
</style>
