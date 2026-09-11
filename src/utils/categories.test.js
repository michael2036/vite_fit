import { describe, it, expect } from 'vitest';
import { getCategoryTranslation, categoryKeyMap } from './categories';

describe('getCategoryTranslation', () => {
    const fakeT = (key) => (key === 'cat_squat' ? 'Squat Pattern' : key);

    it('translates a known category via its mapped i18n key', () => {
        expect(getCategoryTranslation('Patrón Sentadilla (Tren Inferior)', fakeT)).toBe('Squat Pattern');
    });

    it('falls back to the raw category when there is no mapping', () => {
        expect(getCategoryTranslation('Unmapped Category', fakeT)).toBe('Unmapped Category');
    });

    it('falls back to the raw category when the translation is missing for a mapped key', () => {
        // fakeT returns the key itself for anything it doesn't know, which is
        // exactly how the real LanguageContext.t() signals a missing entry.
        expect(getCategoryTranslation('Core / Rotación', fakeT)).toBe('Core / Rotación');
    });

    it('every mapped key is a non-empty string', () => {
        Object.values(categoryKeyMap).forEach((key) => {
            expect(typeof key).toBe('string');
            expect(key.length).toBeGreaterThan(0);
        });
    });
});
