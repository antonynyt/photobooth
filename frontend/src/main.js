import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const i18n = createI18n({
    legacy: false,
    locale: navigator.language.split("-")[0], // auto-detect language
    fallbackLocale: "en",
    messages: {
        en,
        fr,
    },
});

createApp(App).use(router).use(i18n).mount("#app");
