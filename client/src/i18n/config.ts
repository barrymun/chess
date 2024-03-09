import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "assets/_locales/en/messages.json";

// eslint-disable-next-line import/no-named-as-default-member
i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
