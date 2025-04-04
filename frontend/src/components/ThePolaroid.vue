<script setup>
import { computed } from 'vue';

const props = defineProps({
    photos: Object
});

const defaultPhotos = [
    {
        url: 'https://example.com/default1.jpg'
    },
    {
        url: 'https://example.com/default2.jpg'
    },
    {
        url: 'https://example.com/default3.jpg'
    }
];

const photos = computed(() => {
    if (!props.photos) return defaultPhotos;

    return props.photos.map(photo => {
        return {
            url: photo.processedUrl || photo.dataUrl
        };
    });


});

</script>

<template>
    <div class="photo-container" id="polaroid">
        <div class="photos-grid">
            <div v-for="(photo, index) in photos" :key="index" class="grid-item">
                <img :src="photo.url" :key="photo.url" alt="Photo" class="result-image">
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
    padding: 40px;
    max-width: 500px;
}

.photos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.grid-item {
    aspect-ratio: 3/4;
    overflow: hidden;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.slogan {
    text-align: center;
    margin-top: 40px;
    color: #fff;
}
    


</style>