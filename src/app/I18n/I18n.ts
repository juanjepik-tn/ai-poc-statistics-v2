import i18n from "i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// import { ELocale, Countries, ICountries } from "./i18n.types";

// const country = process.env.COUNTRY as keyof ICountries;

// Buscando as nossas traduções da pasta locales (nome e local da pasta é você quem decide)
import translations from "./locales";

const i18nConfig = {
  resources: translations,
  fallbackLng: "es-AR", // idioma por defecto
  defaultNS: "translations",
};

// alert(language)
i18n
  .use(initReactI18next) // Usa o pacote do i18n específico para React
  .init({
    ...i18nConfig,
    lng: i18nConfig.fallbackLng, // Usa o idioma obtido de getStoreInfo ou o fallback
  });
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
};
export const getAllDictionaries = () => {
  return translations;
};

export default i18n;

// i18n
//   .use(initReactI18next)
//   .use(Backend)
//   .init({
//     lng: Countries[`${country ?? "pt-BR"}`],
//     ns: "translations",
//     defaultNS: "translations",
//     load: "currentOnly",
//     fallbackLng: ELocale.BRAZIL,
//     supportedLngs: Object.values(ELocale),
//     backend: {
//       loadPath: `/locales/{{lng}}/{{ns}}.json?v=${pkg.version}`,
//       requestOptions: {
//         cache: "no-cache",
//       },
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// i18n.services.pluralResolver.addRule(ELocale.BRAZIL, {
//   numbers: [1, 2],
//   plurals: (n: number) => {
//     return Number(n !== 1);
//   },
// });
