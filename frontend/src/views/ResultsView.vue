<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import ThePolaroid from '../components/ThePolaroid.vue';
import { toJpeg } from 'html-to-image';

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
    const options = {
        quality: 1.0,
        pixelRatio: 2, // Very high resolution
        width: polaroidElement.width,
        height: polaroidElement.height,
        cacheBust: true,
        skipFonts: false
    };
    
    toJpeg(polaroidElement, options)
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'photolab_prints.jpg';
            link.click();
        })
        .catch((error) => {
            console.error('Error generating image:', error);
        });
}

function startOver() {
    localStorage.removeItem('capturedPhotos');
    router.push('/');
}
</script>

<template>
    <div class="results-container">
        <div class="photos-grid">
            <ThePolaroid :photos="photos" />
        </div>

        <div class="action-buttons">
            <Button @click="handlePrint" class="print-button">
                Print Photos
            </Button>

            <Button @click="startOver" class="start-over-button">
                Start Over
            </Button>
        </div>
    </div>
</template>

<style scoped>
.results-container {
    padding: 2rem;
}

h1 {
    font-size: var(--big-text);
    margin-bottom: 2rem;
}

.photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.grid-item {
    aspect-ratio: 3/4;
    overflow: hidden;
    border-radius: 8px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
}

.print-button {
    background-color: var(--purple);
    color: white;
    padding: 1rem 2rem;
}

.start-over-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 1rem 2rem;
}
</style>
