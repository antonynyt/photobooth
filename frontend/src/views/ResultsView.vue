<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PhotoMini from '../components/PhotoMini.vue';
import Button from '../components/Button.vue';
import ThePolaroid from '../components/ThePolaroid.vue';
import { toPng } from 'html-to-image';

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
    
    // Create canvas with much higher DPI for print quality
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 4; // Significantly higher resolution (4x)
    
    // Set fixed dimensions for better control
    const width = polaroidElement.offsetWidth;
    const height = polaroidElement.offsetHeight;
    
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Configure rendering for best quality
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Use html-to-image with quality options
    const options = {
        quality: 1.0,
        pixelRatio: scale,
        cacheBust: true,
        skipFonts: false // Include fonts for better text rendering
    };
    
    toPng(polaroidElement, options)
        .then((dataUrl) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                // Clear the canvas before drawing to prevent artifacts
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to highest quality JPEG
                const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
                
                // Create download link
                const link = document.createElement('a');
                link.href = jpegUrl;
                link.download = 'photolab_prints.jpg';
                document.body.appendChild(link); // Needed for Firefox
                link.click();
                document.body.removeChild(link);
                
                // Optional: Show success message
                console.log('Image successfully generated at high resolution');
            };
            img.src = dataUrl;
        })
        .catch(error => {
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
