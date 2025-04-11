<script setup>
import { CameraSolid } from '@iconoir/vue';
import Button from './Button.vue';

defineProps({
    shotsLeft: {
        type: Number,
        required: true,
        default: 3
    }
});

</script>

<template>
    <div class="shutter-container">
        <div class="shots-left">
            <p>{{ shotsLeft }} {{ $t('shot.left') }}</p>
        </div>
        <Button v-bind=$attrs>
            <CameraSolid width="30" height="30" />
        </Button>
    </div>
</template>

<style scoped>
.shutter-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

button {
    background-color: #000;
    color: #fff;
    padding: 1rem;
    width: 40vw;
    max-width: 300px;
    border-radius: 200px;
    border: 1px solid #fff;
}

button:disabled {
    background-color: #ccc;
    color: #666;
    border: 1px solid #fff;
}

.shots-left {
    background-color: #fff;
    color: #000;
    display: flex;
    padding: 10px 25px;
    border-radius: 5px 5px 0 0;
    border: 1px solid #000;
    border-bottom: none;
}
</style>