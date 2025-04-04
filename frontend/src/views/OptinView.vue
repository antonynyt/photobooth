<script setup>
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';

const router = useRouter();

function handleResponse(accepted) {
    localStorage.setItem('userOptin', accepted ? 'yes' : 'no');
    router.push('/camera');
}
</script>

<template>
    <div class="optin-container">
        <h1>Consent Request</h1>
        <p class="optin-question">
            Do you agree to let us use your photos for promotional purposes?
        </p>

        <div class="optin-buttons">
            <Button @click="handleResponse(true)" class="yes-button">
                Yes, I agree
            </Button>

            <Button @click="handleResponse(false)" class="no-button">
                No, thank you
            </Button>
        </div>
    </div>
</template>

<style scoped>
.optin-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    height: 80vh;
}

h1 {
    font-size: var(--big-text);
    margin-bottom: 2rem;
}

.optin-question {
    font-size: var(--small-text);
    margin-bottom: 3rem;
    max-width: 600px;
    line-height: 1.5;
}

.optin-buttons {
    display: flex;
    gap: 2rem;
}

.yes-button {
    background-color: var(--purple);
    color: white;
    padding: 1rem 2rem;
}

.no-button {
    background-color: #f5f5f5;
    color: black;
    border: 1px solid #ddd;
    padding: 1rem 2rem;
}
</style>
