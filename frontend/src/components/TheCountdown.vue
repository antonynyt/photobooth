<script setup>
defineProps({
    value: {
        type: Number,
        required: true,
        default: 3
    }
});
</script>

<template>
    <div class="countdown">
        <p>{{ value }}</p>
    </div>
</template>

<style scoped>
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
    font-weight: 700;
}

.countdown p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 200px;
    color: var(--purple);
    font-size: 50px;
}
</style>