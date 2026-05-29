import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            const savedLanguage = localStorage.getItem('vitefit_language');
            if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en' || savedLanguage === 'de')) {
                return savedLanguage;
            }
            
            // Detect from browser settings
            const browserLocale = navigator.language || navigator.userLanguage || '';
            const localeCode = browserLocale.substring(0, 2).toLowerCase();
            if (localeCode === 'de') return 'de';
            if (localeCode === 'en') return 'en';
            return 'es'; // default fallback is Spanish
        } catch (e) {
            return 'es';
        }
    });

    const changeLanguage = (locale) => {
        if (locale === 'es' || locale === 'en' || locale === 'de') {
            setLanguage(locale);
            try {
                localStorage.setItem('vitefit_language', locale);
                console.log(`CoupleFit Language changed dynamically to: ${locale}`);
            } catch (e) {
                console.warn("localStorage setItem vitefit_language failed", e);
            }
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

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
