<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import TheHeader from '../components/TheHeader.vue';
import { generatedImage } from '../stores/imageStore';

const router = useRouter();
const email = ref('');
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const errorMessage = ref('');

async function handleSubmit(e) {
    e.preventDefault();

    if (!email.value || !email.value.includes('@')) {
        errorMessage.value = 'Please enter a valid email address';
        return;
    }

    if (!generatedImage.value) {
        errorMessage.value = 'No image available to send';
        return;
    }

    try {
        isSubmitting.value = true;
        errorMessage.value = '';

        // Convert data URL to Blob
        const response = await fetch(generatedImage.value);
        const blob = await response.blob();

        // Create form data to submit
        const formData = new FormData();
        formData.append('email', email.value);
        formData.append('name', 'Photobooth User');
        formData.append('message', 'Here is my photobooth picture!');
        formData.append('image', blob, 'photobooth.jpg');

        // Send to Netlify Function
        const result = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            body: formData
        });

        const data = await result.json();

        if (!result.ok) {
            throw new Error(data.error || 'Failed to send email');
        }

        // Success
        submitSuccess.value = true;

        // Automatically redirect to home after success message
        setTimeout(() => {
            router.push('/');
        }, 3000);

    } catch (error) {
        console.error('Error sending email:', error);
        errorMessage.value = error.message || 'Failed to send email. Please try again.';
    } finally {
        isSubmitting.value = false;
    }
}

</script>

<template>
    <div class="email-container">
        <TheHeader />
        <div v-if="!submitSuccess" class="email-form">
            <div class="form-header">
                <h1>{{ $t('form.title') }}</h1>
                <p>{{ $t('form.subtitle') }}</p>
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <input type="email" v-model="email" placeholder="zina@email.com" :disabled="isSubmitting" />
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                </div>
                <div class="form-actions">
                    <Button type="submit" :disabled="isSubmitting" class="submit-button">
                        <span v-if="isSubmitting">Sending...</span>
                        <span v-else>{{ $t('form.getPictures') }}</span>
                    </Button>
                    <a href="/">{{ $t('form.skip') }}</a>
                </div>
            </form>
        </div>

        <div v-else class="success-container">
            <div class="success-message">
                <h1>{{ $t('form.success.title') }}</h1>
                <p class="success-subtitle">{{ $t('form.success.subtitle') }}</p>
                <p>{{ $t('form.success.message') }}</p>
                <p class="slogan">#whynotyou</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

.submit-button, h1, p.slogan {
    font-family: 'Monument', sans-serif;
    font-weight: 700;
}

.email-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    box-sizing: border-box;
    height: 100svh;
    color: #fff;
}

.email-form {
    width: 100%;
    max-width: 500px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.success-container {
    width: 100%;
    max-width: 500px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap:1rem;
}

.success-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 4rem;
    background-color: var(--purple);
    border-radius: 5px;
    position: relative;
}

.success-message::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: -1;
    border-radius: 5px;
    transform: rotate(-10deg);
}

.success-message h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    line-height: 120%;
}


.success-message p {
    font-size: 1rem;
    line-height: 120%;
}

p.success-subtitle {
    font-size: 1.2rem;
    line-height: 120%;
    margin-bottom: 1.5rem;
}

p.slogan {
    font-size: 1rem;
    line-height: 120%;
    margin-top: 1rem;
}

.form-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
}

.form-header h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

input {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border: 0;
    border-radius: 5px;
    box-sizing: border-box;

    font-family: 'Manrope', sans-serif;
    background-color: #fff;
}

input:focus {
    outline: none;
    outline: 2px solid var(--purple);
}


.form-actions {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.form-actions a {
    color: #fff;
    font-weight: 400;
}

.error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: var(--purple);
    color: white;
    padding: 1.5rem;
    flex-grow: 1;
    width: 100%;
    font-weight: 400;
}

</style>
