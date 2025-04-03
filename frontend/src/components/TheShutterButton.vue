<script setup>
import { CameraSolid } from '@iconoir/vue';
import Button from './Button.vue';
</script>

<template>
    <Button>
        <CameraSolid width="30" height="30" />
    </Button>
</template>

<style scoped>
    button {
        background-color: #000;
        color: #fff;
        padding: 25px 100px;
        border-radius: 200px;
        border: 1px solid #fff;
    }

    button:disabled {
        background-color: #ccc;
        color: #666;
        border: 1px solid #fff;
    }
</style>