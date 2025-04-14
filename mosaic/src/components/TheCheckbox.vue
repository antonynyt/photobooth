<script setup></script>

<template>
    <input type="checkbox" class="checkbox" id="checkbox" v-model="checked" @change="handleChange">
</template>

<style scoped>
    input.checkbox {
    height: 36px;
    width: 36px;
    background: center/90%;
    background-color: #fff;
    appearance: none;
    outline: none;
    box-sizing: border-box;
    border-radius: 5px;
    flex-shrink: 0;
    cursor: pointer;
    transition-property: transform, background-size, background-color, box-shadow;
    transition-duration: .2s;
    transition-timing-function: ease-in-out;
    align-items: center;
    border: 1px solid #111;
}

.checkbox:checked{
    background: no-repeat center/51% url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='11' viewBox='0 0 15 11' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.2071 0.292893C14.5976 0.683417 14.5976 1.31658 14.2071 1.70711L5.70711 10.2071C5.31658 10.5976 4.68342 10.5976 4.29289 10.2071L0.292893 6.20711C-0.0976314 5.81658 -0.0976314 5.18342 0.292893 4.79289C0.683417 4.40237 1.31658 4.40237 1.70711 4.79289L5 8.08579L12.7929 0.292893C13.1834 -0.0976316 13.8166 -0.0976316 14.2071 0.292893Z' fill='%23F2F0F4'/%3E%3C/svg%3E") var(--purple);
    border: 1px solid var(--purple);
}
</style>