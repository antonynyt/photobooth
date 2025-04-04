<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';

const router = useRouter();
const email = ref('');
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const errorMessage = ref('');

async function handleSubmit() {
    if (!email.value || !email.value.includes('@')) {
        errorMessage.value = 'Please enter a valid email address';
        return;
    }

    try {
        isSubmitting.value = true;
        errorMessage.value = '';

        // Here you would implement the API call to send the email
        // This is just a placeholder for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Successful submission
        submitSuccess.value = true;

        // Automatically redirect to home after success message
        setTimeout(() => {
            router.push('/');
        }, 3000);

    } catch (error) {
        console.error('Error sending email:', error);
        errorMessage.value = 'Failed to send email. Please try again.';
    } finally {
        isSubmitting.value = false;
    }
}

function goBack() {
    router.push('/results');
}
</script>

<template>
    <div class="email-container">
        <h1>Send Photos to Your Email</h1>

        <div v-if="!submitSuccess" class="email-form">
            <p>Enter your email address to receive your photos:</p>

            <div class="form-group">
                <input type="email" v-model="email" placeholder="your@email.com" :disabled="isSubmitting" />
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </div>

            <div class="form-actions">
                <Button @click="handleSubmit" :disabled="isSubmitting" class="submit-button">
                    {{ isSubmitting ? 'Sending...' : 'Send Photos' }}
                </Button>

                <Button @click="goBack" :disabled="isSubmitting" class="back-button">
                    Back
                </Button>
            </div>
        </div>

        <div v-else class="success-message">
            <p>Your photos have been sent to {{ email }}!</p>
            <p>You will be redirected to the home page shortly...</p>
        </div>
    </div>
</template>

<style scoped>
.email-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    height: 80vh;
}

h1 {
    font-size: var(--big-text);
    margin-bottom: 2rem;
}

.email-form {
    width: 100%;
    max-width: 500px;
}

.form-group {
    margin-bottom: 1.5rem;
}

input {
    width: 100%;
    padding: 1rem;
    font-size: 1.2rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-top: 0.5rem;
}

input:focus {
    outline: none;
    border-color: var(--purple);
}

.error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
}

.submit-button {
    background-color: var(--purple);
    color: white;
    padding: 1rem 2rem;
}

.back-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 1rem 2rem;
}

.success-message {
    text-align: center;
    padding: 2rem;
    background-color: #e6f7e6;
    border-radius: 8px;
    line-height: 1.6;
}
</style>
