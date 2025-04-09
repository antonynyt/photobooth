<template>
    <header>
        <img src="../assets/whynotyou.svg" alt="Logo" class="logo">
        <p>Lead your passion, shape the game.</p>
    </header>
</template>

<style scoped>
    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        text-transform: uppercase;
        font-weight: 700;
        color: #fff;
    }

    header img {
        width: 100%;
        max-width: 500px;
    }

    header p {
        font-size: clamp(0.4rem, 3vw, 17px);
    }
</style>