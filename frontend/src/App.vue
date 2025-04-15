<script setup>
// uncomment the following lines to enable inactivity timeout
// for our POC application it is not needed since it's web based

// import { onMounted, onBeforeUnmount } from 'vue';

// const INACTIVITY_TIMEOUT = 60000
// let inactivityTimer = null;

// const resetInactivityTimer = () => {
//     clearTimeout(inactivityTimer);
//     inactivityTimer = setTimeout(() => {
//         window.location.href = '/';
//     }, INACTIVITY_TIMEOUT);
// };

// // Add event listeners for user activity
// onMounted(() => {
//     resetInactivityTimer();

//     // Reset timer on various user interactions
//     window.addEventListener('click', resetInactivityTimer);
//     window.addEventListener('keypress', resetInactivityTimer);
//     window.addEventListener('touchstart', resetInactivityTimer);
//     window.addEventListener('mousemove', resetInactivityTimer);
// });

// onBeforeUnmount(() => {
//     clearTimeout(inactivityTimer);
//     window.removeEventListener('click', resetInactivityTimer);
//     window.removeEventListener('keypress', resetInactivityTimer);
//     window.removeEventListener('touchstart', resetInactivityTimer);
//     window.removeEventListener('mousemove', resetInactivityTimer);
// });
</script>

<template>
    <router-view />
</template>
