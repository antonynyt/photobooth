<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedLanguage = ref('en');

const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
    { code: 'it', name: 'IT' }
];

function selectLanguage(lang) {
    selectedLanguage.value = lang;
    continueToOptin();
}

function continueToOptin() {
    // You could store the selected language in localStorage or pass as route parameter
    localStorage.setItem('userLanguage', selectedLanguage.value);
    router.push('/camera');
}
</script>

<template>
    <div class="welcome-container">
        <header>
            <img src="../assets/whynotyou.svg" alt="Logo" class="logo">
            <p>Lead your passion, shape the game.</p>
        </header>
        <div class="polaroid-container">
            <img src="../assets/polaroid-example.jpg" alt="">
        </div>
        <div class="language-selection">
            <p>Please select your language to start</p>
            <div class="language-options">
                <div v-for="lang in languages" :key="lang.code" class="language-option"
                    :class="{ selected: selectedLanguage === lang.code }" @click="selectLanguage(lang.code)">
                    {{ lang.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    box-sizing: border-box;
    height: 100svh;
    color: #fff;
}

.polaroid-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.polaroid-container img {
    transform: rotate(-2deg);
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: 1rem 0;
}

header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    font-weight: 700;
}

header img {
    width: 100%;
    max-width: 500px;
}

header p {
    font-size: clamp(0.4rem, 3vw, 17px);
}

.language-selection {
    text-align: center;
}

.language-options {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
    max-width: 300px;
    color: #000;
}

.language-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    aspect-ratio: 1;
    font-family: 'Monument', sans-serif;
    width: 2rem;
    height: 2rem;
}

.language-option.selected {
    color: var(--purple);
    font-weight: bold;
}

.continue-button {
    background-color: black;
    color: white;
    padding: 1rem 2rem;
    margin-top: 2rem;
}
</style>
