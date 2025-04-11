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
    background-color: var(--yellow);
    color: #000;
    padding: 1rem;
    width: 40vw;
    max-width: 300px;
    min-width: 100px;
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
    border-radius: 5px;
    margin-bottom: 0.5rem;
    border: 1px solid #000;
    text-align: center;
    position: absolute;
    top: 2rem;
    right: 1rem;
}

@media only screen and (min-device-width: 768px) and (min-width: 768px) {
    .shots-left {
        padding: 10px 25px;
        border-radius: 5px 5px 0 0;
        border-bottom: none;
        margin-bottom: 0;
        position: static;
    }
}
</style>