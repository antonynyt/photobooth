<script setup>
</script>

<template>
    <button>
        <slot />
    </button>
</template>

<style scoped>
button {
    border: 0;
    padding: 10px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: inset 0 9px 6px -7px rgba(255, 255, 255, 0.3), inset 0px -4px 6px -6px rgba(0, 0, 0, 0.8);
}

button:active {
    box-shadow: none;
}

button {
    color: inherit;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
}
</style>