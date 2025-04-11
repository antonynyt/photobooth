<script setup>
import { computed } from 'vue';
import SideTagLine from './SideTagLine.vue';
import TheLogo from './TheLogo.vue';

const props = defineProps({
    photos: {
        type: Array,
        required: true
    }
});

// This computed property will automatically update when props.photos changes
const processedPhotos = computed(() => {
    return props.photos.map((photo, index) => {
        return {
            url: photo.processedUrl || photo.dataUrl,
            id: index,
            processing: photo.processing || false
        };
    });
});
</script>

<template>
    <div class="photo-container" id="polaroid">
        <SideTagLine />
        <SideTagLine class="right" />
        <div class="photos-grid">
            <div v-for="(photo, index) in processedPhotos" :key="photo.id" class="grid-item">
                <img :src="photo.url" :alt="'Photo ' + (index + 1)" class="result-image">
                <div v-if="photo.processing" class="processing-overlay">
                    <div class="processing-gradient"></div>
                </div>
            </div>
            <div class="logo-container">
                <TheLogo class="logo-image" />
                <img src="../assets/qr-code.svg" alt="QR Code" class="qr-image">
            </div>
        </div>
        <div class="slogan">
            <h2>{{ $t("slogan") }}</h2>
        </div>
    </div>
</template>

<style scoped>
.photo-container {
    background-color: var(--purple);
    padding: clamp(15px, 5vw, 35px);
    width: clamp(100%, 450px, 450px);
    max-width: 450px;
    font-size: clamp(0.4rem, 3vw, 17px);
    box-sizing: border-box;
    position: relative;
    text-transform: uppercase;
}

.photos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.grid-item {
    aspect-ratio: 3/4;
    overflow: hidden;
    border-radius: 2px;
    position: relative;
}

.logo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.logo-image {
    width: 70%;
    height: auto;
    margin-bottom: 15%;
    background-color: transparent;
}

img.qr-image {
    width: 40%;
    height: auto;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.slogan {
    text-align: center;
    margin-top: clamp(15px, 5vw, 30px);
    color: #fff;
}


.processing-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
}

.processing-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
                     rgba(255, 255, 255, 0) 0%,
                     rgba(255, 255, 255, 0.4) 40%,
                     rgba(255, 255, 255, 0.5) 50%,
                     rgba(255, 255, 255, 0.4) 60%,
                     rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: processing 3s linear infinite;
    pointer-events: none;
    border-radius: 2px;
}

@keyframes processing {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
</style>