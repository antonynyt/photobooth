<template>
    <a href="/">
        <header>
            <img src="../assets/whynotyou.svg" alt="Logo" class="logo">
            <p>Lead your passion, shape the game.</p>
        </header>
    </a>
</template>

<style scoped>
    a {
        text-decoration: none;
    }
    a:hover {
        text-decoration: none;
    }
    a:active {
        text-decoration: none;
    }
    a:focus {
        text-decoration: none;
    }
    a:focus-visible {
        text-decoration: none;
    }

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