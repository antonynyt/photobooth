<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import ThePolaroid from '../components/ThePolaroid.vue';
import { toJpeg } from 'html-to-image';
import { PrintingPage, Repeat } from '@iconoir/vue';

const router = useRouter();
const photos = ref([]);

onMounted(() => {
    // Get photos from localStorage
    const storedPhotos = localStorage.getItem('capturedPhotos');
    if (storedPhotos) {
        photos.value = JSON.parse(storedPhotos);
    }
});

function handlePrint() {
    const polaroidElement = document.querySelector('#polaroid');

    // Wait for all images to load first
    const images = Array.from(polaroidElement.querySelectorAll('img'));

    // Pre-load and sanitize all images
    Promise.all(images.map(img => {
        // Skip if already a data URL (safe)
        if (img.src.startsWith('data:')) return Promise.resolve();

        // Create a clean, CORS-free version of each image
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const imgObj = new Image();
            imgObj.crossOrigin = 'anonymous';

            imgObj.onload = () => {
                // Draw to canvas and replace original src with data URL
                canvas.width = imgObj.width;
                canvas.height = imgObj.height;
                ctx.drawImage(imgObj, 0, 0);

                try {
                    // Replace the original image src with a safe data URL
                    img.src = canvas.toDataURL('image/jpeg');
                    resolve();
                } catch (e) {
                    console.warn("Couldn't convert image:", e);
                    resolve(); // Continue anyway
                }
            };

            imgObj.onerror = () => {
                console.warn("Couldn't load image:", img.src);
                resolve(); // Continue anyway
            };

            // Start loading with crossOrigin set
            imgObj.src = img.src;
        });
    }))
        .then(() => {
            // Now generate the image with all image sources sanitized
            const options = {
                quality: 1.0,
                pixelRatio: 2, // Higher resolution for better quality
                cacheBust: true,
                skipFonts: false
            };

            return toJpeg(polaroidElement, options);
        })
        .then(dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'photolab_prints.jpg';
            link.click();
            router.push('/email');
        })
        .catch(error => {
            console.error('Error generating image:', error);
        });
}

function startOver() {
    localStorage.removeItem('capturedPhotos');
    router.push('/camera');
}
</script>

<template>
    <div class="results-container">
        <div class="polaroid-container">
            <ThePolaroid :photos="photos" />
        </div>

        <div class="action-buttons">
            <Button @click="startOver" class="start-over-button">
                <Repeat width="30" height="30" />
            </Button>

            <Button @click="handlePrint" class="print-button">
                <PrintingPage width="30" height="30" />
            </Button>

        </div>
    </div>
</template>

<style scoped>
.results-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
    height: 100svh;
}

.polaroid-container {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    transform: rotate(-2deg);
}

.polaroid-container > div {
    box-shadow: -2px 3px 9px 0px rgba(0, 0, 0, 0.25);
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
    width: 100%;
    max-width: 500px;
}

.print-button {
    background-color: var(--purple);
    color: white;
    padding: 1rem 2rem;
    flex-grow: 1;
}

.start-over-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 1000px;
    aspect-ratio: 1;
}

.start-over-button svg {
    transform: scale(-1, -1);
}
</style>
