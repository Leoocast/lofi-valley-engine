import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enCrops from "./locales/en/crops.json"
import enIntro from "./locales/en/intro.json"
import enLaboratory from "./locales/en/laboratory.json"
import enMenu from "./locales/en/menu.json"
import esCrops from "./locales/es/crops.json"
import esIntro from "./locales/es/intro.json"
import esLaboratory from "./locales/es/laboratory.json"
import esMenu from "./locales/es/menu.json"

const resources = {
  en: {
    crops: enCrops,
    intro: enIntro,
    laboratory: enLaboratory,
    menu: enMenu,
  },
  es: {
    crops: esCrops,
    intro: esIntro,
    laboratory: esLaboratory,
    menu: esMenu,
  },
}

const savedLanguage = localStorage.getItem("lofi-valley-language") || "en"

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
})

export default i18n
