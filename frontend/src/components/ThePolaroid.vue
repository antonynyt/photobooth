<script setup>
import { computed } from 'vue';
import SideTagLine from './SideTagLine.vue';
import TheLogo from './TheLogo.vue';

const props = defineProps({
    photos: Object
});

const defaultPhotos = [
    {
        url: 'https://unsplash.it/400/300?image=1'
    },
    {
        url: 'https://unsplash.it/400/300?image=1'
    },
    {
        url: 'https://unsplash.it/400/300?image=1'
    }
];

const photos = computed(() => {
    if (!props.photos) return defaultPhotos;

    return props.photos.map((photo, index) => {
        return {
            url: photo.processedUrl || photo.dataUrl,
            id: index
        };
    });
});

</script>

<template>
    <div class="photo-container" id="polaroid">
        <SideTagLine />
        <SideTagLine class="right" />
        <div class="photos-grid">
            <div v-for="(photo, index) in photos" :key="index" class="grid-item">
                <img :src="photo.url" :key="photo.url" alt="Photo" class="result-image">
            </div>
            <div class="logo-container">
                <TheLogo class="logo-image" />
                <img src="../assets/qr-code.svg" alt="QR Code" class="qr-image">
            </div>
        </div>
        <div class="slogan">
            <h2>Lead your passion, shape the game.</h2>
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
</style>