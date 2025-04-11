<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import ThePolaroid from '../components/ThePolaroid.vue';
import { toJpeg } from 'html-to-image';
import { PrintingPage, Repeat } from '@iconoir/vue';
import TheCheckbox from '../components/TheCheckbox.vue';
import { generatedImage, photos } from '../stores/imageStore';

const router = useRouter();
const printDisabled = ref(true);

function handleOptin(event) {
    const optinCheckbox = event.target;
    printDisabled.value = !optinCheckbox.checked;
}

function handlePrint() {
    const polaroidElement = document.querySelector('#polaroid');
    const images = Array.from(polaroidElement.querySelectorAll('img'));

    Promise.all(images.map(img => {
        if (img.src.startsWith('data:')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const imgObj = new Image();
            imgObj.crossOrigin = 'anonymous';

            imgObj.onload = () => {
                canvas.width = imgObj.width;
                canvas.height = imgObj.height;
                ctx.drawImage(imgObj, 0, 0);

                try {
                    img.src = canvas.toDataURL('image/jpeg');
                    resolve();
                } catch (e) {
                    console.warn("Couldn't convert image:", e);
                    resolve();
                }
            };

            imgObj.onerror = () => {
                console.warn("Couldn't load image:", img.src);
                resolve();
            };

            imgObj.src = img.src;
        });
    }))
        .then(() => {
            const options = {
                quality: 1.0,
                pixelRatio: 3,
                cacheBust: true,
                skipFonts: true
            };

            return toJpeg(polaroidElement, options);
        })
        .then(dataUrl => {
            // Store the generated image in the shared store
            generatedImage.value = dataUrl;
            
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'photo.jpg';
            
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 100);

            polaroidElement.classList.add('animated');
            setTimeout(() => {
                try {
                    router.push('/email');
                } catch (e) {
                    console.warn("Router navigation failed, using fallback", e);
                    window.location.href = '/email';
                }
            }, 800);
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
        <header>
            <h1>{{ $t("result.title") }}</h1>
        </header>
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
    padding: 2rem 1rem;
    box-sizing: border-box;
    height: 100svh;
}

@media only screen and (min-device-width: 768px) and (min-width: 768px) {
    .results-container {
        padding: 2rem;
    }
}

header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    font-family: 'Monument', sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    font-size: clamp(1.5rem, 2vw, 1.5rem);
    margin: 0;
    padding: 1rem 2rem;
    text-align: center;
    width: fit-content;
    color: var(--yellow);
    position: relative;
    text-transform: uppercase;
}

h1::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--purple);
    z-index: -1;
    border-radius: 5px;
    transform: rotate(1deg);
}

.polaroid-container {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
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

@media (prefers-reduced-motion: reduce) {
    .animated {
        animation: none;
    }
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
