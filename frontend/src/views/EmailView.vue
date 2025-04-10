<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import TheHeader from '../components/TheHeader.vue';

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

</script>

<template>
    <div class="email-container">
        <TheHeader/>
        <div v-if="!submitSuccess" class="email-form">
            <div class="form-header">
                <h1>{{ $t('form.title') }}</h1>
                <p>{{ $t('form.subtitle') }}</p>
            </div>

            <div class="form-group">
                <input type="email" v-model="email" placeholder="zina@email.com" :disabled="isSubmitting" />
                <p v-if="errorMessage" class="error-message">{{ $('form.error') }}</p>
            </div>

            <div class="form-actions">
                <Button @click="handleSubmit" :disabled="isSubmitting" class="submit-button">{{ $t('form.getPictures')}}</Button>
                <a href="/">{{ $t('form.skip') }}</a>
            </div>
        </div>

        <div v-else class="success-message">
            <p>Your photos have been sent to {{ email }}!</p>
        </div>
    </div>
</template>

<style scoped>
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

.form-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
}

.form-header h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-family: "Monument", sans-serif;
}

input {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border: 0;
    border-radius: 5px;
    box-sizing: border-box;

    font-family: 'Manrope';
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
    font-family: 'Monument', sans-serif;
    background-color: var(--purple);
    color: white;
    padding: 1.5rem;
    flex-grow: 1;
    width: 100%;
}

</style>
