<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import ThePolaroid from '../components/ThePolaroid.vue';
import { toJpeg } from 'html-to-image';
import { PrintingPage, Repeat } from '@iconoir/vue';
import { photos } from '../stores/photos';
import TheCheckbox from '../components/TheCheckbox.vue';

const router = useRouter();
const printDisabled = ref(true);

function handleOptin(event) {
    const optinCheckbox = event.target;
    printDisabled.value = !optinCheckbox.checked;
}

function handlePrint() {

    const polaroidElement = document.querySelector('#polaroid');
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
                pixelRatio: 3, // Higher resolution for better quality
                cacheBust: true,
                skipFonts: false
            };

            return toJpeg(polaroidElement, options);
        })
        .then(dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'photo.jpg';
            link.click();
            //add animation class
            polaroidElement.classList.add('animated');
            setTimeout(() => {
                polaroidElement.classList.remove('animated');
                router.push('/email');
            }, 500);
        })
        .catch(error => {
            console.error('Error generating image:', error);
        });
}

function startOver() {
    photos.value = [];
    router.push('/camera');
}
</script>

<template>
    <div class="results-container">
        <div class="polaroid-container">
            <ThePolaroid :photos="photos" />
        </div>

        <div class="optin">
            <TheCheckbox @change="handleOptin" id="optin" name="optin" />
            <label for="optin">{{ $t('optin') }}</label>
        </div>

        <div class="action-buttons">
            <Button @click="startOver" class="start-over-button">
                <Repeat width="30" height="30" />
            </Button>

            <Button @click="handlePrint" :disabled="printDisabled" class="print-button">
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

.optin {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    gap: 0.5rem;
    line-height: 120%;
    max-width: 500px;
}

.animated {
    animation: print 0.5s ease-in forwards;
}

@keyframes print {
    0% {
        transform: translateY(0) scale(1);
    }
    100% {
        transform: translateY(-100vh) scale(0.5);
    }
}


</style>
