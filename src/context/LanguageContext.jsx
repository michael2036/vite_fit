import { createContext, useState, useContext } from 'react';
import { translations } from '../data/translations';
import * as workoutStore from '../services/workoutStore';

const LanguageContext = createContext();
const SUPPORTED_LOCALES = ['es', 'en', 'de'];

function detectInitialLanguage() {
    const saved = workoutStore.getLanguage();
    if (SUPPORTED_LOCALES.includes(saved)) return saved;

    try {
        const browserLocale = navigator.language || navigator.userLanguage || '';
        const localeCode = browserLocale.substring(0, 2).toLowerCase();
        if (SUPPORTED_LOCALES.includes(localeCode)) return localeCode;
    } catch (e) {
        // navigator unavailable — fall through to default
    }
    return 'es'; // default fallback is Spanish
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(detectInitialLanguage);

    const changeLanguage = (locale) => {
        if (SUPPORTED_LOCALES.includes(locale)) {
            setLanguage(locale);
            workoutStore.setLanguage(locale);
        }
    };

    // Helper to fetch deeply nested keys in translations catalog (e.g. t('welcome_title'))
    const t = (key) => {
        try {
            const dictionary = translations[language] || translations['es'];
            const value = dictionary[key];
            if (value !== undefined) {
                return value;
            }
            // Fallback to Spanish dictionary
            const fallbackValue = translations['es'][key];
            if (fallbackValue !== undefined) {
                return fallbackValue;
            }
            return key; // return key as fallback if not found anywhere
        } catch (e) {
            return key;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs beside its provider
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
