<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import TheHeader from '../components/TheHeader.vue';
import Button from '../components/Button.vue';

const { locale } = useI18n();
const router = useRouter();
const selectedLanguage = ref(locale.value);

const languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
    { code: 'it', name: 'IT' }
];

function selectLanguage(lang) {
    selectedLanguage.value = lang;
    locale.value = lang;

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
            <h1>#whynotyou</h1>
            <h2>TAKE YOUR SHOT</h2>
        </header>
        <div class="welcome-message">
            <div class="polaroid-container">
                <img src="../assets/polaroid-example.jpg" alt="">
                <img src="../assets/polaroid-example.jpg" alt="">
                <img src="../assets/polaroid-example.jpg" alt="">
            </div>
        </div>
        <div class="language-selection">
            <p>{{ $t('langSelection') }}</p>
            <div class="language-options">
                <Button v-for="lang in languages" :key="lang.code" class="language-option"
                    :class="{ selected: selectedLanguage === lang.code }" @click="selectLanguage(lang.code)">
                    {{ lang.name }}
                </Button>
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
    padding: 2rem 1rem;
    box-sizing: border-box;
    height: 100svh;
    color: #fff;
}

@media only screen and (min-device-width: 768px) and (min-width: 768px) {
    .welcome-container {
        padding: 2rem;
    }
}

header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    font-family: 'Monument', sans-serif;
    font-weight: 700;
    font-size: 2.5rem;
    font-size: clamp(2rem, 3.5vw, 3rem);
    margin: 0;
    text-align: center;
    color: #fff;
    text-transform: uppercase;
}

h2 {
    font-family: 'Monument', sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    font-size: clamp(1rem, 2vw, 1.2rem);
    margin: 0;
    text-align: center;
    margin-top: -1rem;
    width: fit-content;
    padding: 1.5rem 4rem;
    color: var(--yellow);
    position: relative;
}

h2::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--purple);
    z-index: -1;
    transform: rotate(2deg);
}

.welcome-message {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.polaroid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.polaroid-container img {
    position: absolute;
    transform: rotate(-2deg);
    height: 50vh;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.3);
    margin: 1rem 0;
    transition: all 0.3s ease;
}

.polaroid-container img:nth-child(3):hover {
    transform: rotate(0deg) scale(1.05);
}

.polaroid-container img:nth-child(2):hover {
    transform: rotate(0deg) scale(1.05);
}

.polaroid-container img:nth-child(1) {
    transform: rotate(5deg);
}

.polaroid-container img:nth-child(2) {
    transform: rotate(2deg);
}

.polaroid-container img:nth-child(3) {
    transform: rotate(-5deg);
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
    padding: 2rem;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    aspect-ratio: 1;
    font-family: 'Monument', sans-serif;
    font-weight: 400;
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
