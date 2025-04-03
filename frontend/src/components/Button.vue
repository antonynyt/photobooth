<script setup>
</script>

<template>
    <button>
        <slot />
    </button>
</template>

<style scoped>
button {
    border: none;
    padding: 10px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 5px;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>