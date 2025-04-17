<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
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

    continueToCamera();
}

function continueToCamera() {
    router.push('/camera');
}
</script>

<template>
    <div class="welcome-container" @click="continueToCamera">
        <div aria-hidden="true" class="bg"></div>
        <header>
            <h1> Be part of a wall of portraits to support the cause WHYNOTYOU.</h1>
            <h2>A thousand faces, one cause:<wbr> empowering women in coaching.</h2>
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

.bg {
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    width: 200%;
    height: 100%;
    background-color: var(--purple);
    transform: rotate(-10deg);
    z-index: -1;
}

header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

h1 {
    font-family: 'Monument', sans-serif;
    font-weight: 700;
    font-size: clamp(1.1rem, 2.5vw, 2rem);
    max-width: 600px;
    margin: 0;
    text-align: center;
    color: var(--yellow);
    text-transform: uppercase;
    line-height: 120%;
}

h2 {
    font-weight: 600;
    font-size: 1.25rem;
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    margin: 0;
    text-align: center;
    max-width: 300px;
    color: #fff;
    line-height: 120%;
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
    height: 45vh;
    box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.3);
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
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
}

.language-options {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
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
    font-size: 1rem;
    font-weight: 400;
    width: 2rem;
    height: 2rem;
    outline: 1px solid #ddd;
}

.language-option.selected {
    color: var(--orange);
}

.continue-button {
    background-color: black;
    color: white;
    padding: 1rem 2rem;
    margin-top: 2rem;
}
</style>
