<script setup>
import { computed } from 'vue';

const props = defineProps({
    photo: Object
});

// Determine which image URL to use - processed or original
const imageUrl = computed(() => {
    if (!props.photo) return null;
    // If processed URL exists, use it, otherwise use the data URL
    const url = props.photo.processedUrl || props.photo.dataUrl;
    return url;
});

const isProcessing = computed(() => {
    return props.photo && props.photo.processing;
});

const hasError = computed(() => {
    return props.photo && props.photo.error;
});

</script>

<template>
    <div class="result-container">
        <!-- Key attribute forces rerender when imageUrl changes -->
        <img v-if="imageUrl" :src="imageUrl" :key="imageUrl" alt="Photo" class="result-image">
        <div v-else class="placeholder"></div>

        <!-- Processing overlay -->
        <div v-if="isProcessing"  class="processing-overlay">
            <div class="processing-gradient"></div>
        </div>

        <!-- Error message -->
        <div v-if="hasError" class="error-overlay">
            <div class="error-text">Failed to process</div>
        </div>
    </div>
</template>

<style scoped>
.result-container {
    width: 100%;
    position: relative;
    height: 100%;
}

.result-image,
.placeholder {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    border-radius: 4px;
}

.result-image {
    border: 2px solid var(--purple);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    box-sizing: border-box;
}

.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
}

.processing-overlay,
.error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
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
    border-radius: 4px;
}

.error-text {
    color: white;
    font-size: 16px;
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
}

.error-text {
    color: #ff6b6b;
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
