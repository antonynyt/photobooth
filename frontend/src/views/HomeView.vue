<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ThePolaroid from '../components/ThePolaroid.vue';

const router = useRouter();
const selectedLanguage = ref('en');

const languages = [
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'de', name: 'DE' }
];

function selectLanguage(lang) {
    selectedLanguage.value = lang;
    continueToOptin();
}

function continueToOptin() {
    // You could store the selected language in localStorage or pass as route parameter
    localStorage.setItem('userLanguage', selectedLanguage.value);
    router.push('/optin');
}
</script>

<template>
    <div class="welcome-container">
        <ThePolaroid/>
        <p>Please select your language</p>
        <div class="language-options">
            <div v-for="lang in languages" :key="lang.code" class="language-option"
                :class="{ selected: selectedLanguage === lang.code }" @click="selectLanguage(lang.code)">
                {{ lang.name }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    height: 80vh;
}

h1 {
    font-size: var(--big-text);
    margin-bottom: 1rem;
}

.language-options {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    width: 100%;
    max-width: 300px;
}

.language-option {
    padding: 1rem;
    border: 2px solid var(--purple);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.language-option.selected {
    background-color: var(--purple);
    color: white;
    font-weight: bold;
}

.continue-button {
    background-color: black;
    color: white;
    padding: 1rem 2rem;
    margin-top: 2rem;
}
</style>
