// Exercise categories are authored in Spanish inside workoutData.js (see
// REQUIREMENTS.md's data model). This maps each one to its i18n key so the
// UI can show it in the active locale. Previously this 24-entry map and its
// lookup helper were copy-pasted verbatim in both Dashboard.jsx and
// TrainingMode.jsx — a category added to workoutData.js only needed updating
// here once now.
export const categoryKeyMap = {
    'Preparación Fisiológica': 'cat_prep',
    'Patrón Sentadilla (Tren Inferior)': 'cat_squat',
    'Tracción Horizontal (Espalda)': 'cat_horiz_pull',
    'Fuerza Unilateral (Estabilidad)': 'cat_unilateral_strength',
    'Empuje Vertical (Hombros)': 'cat_vert_push',
    'Aislamiento Posterior (Isquios)': 'cat_isolation_posterior',
    'Aislamiento Superior (Tríceps)': 'cat_isolation_upper',
    'Estabilidad Core / Anti-Rotación': 'cat_core_stability',
    'Cadena Posterior / Correctivo': 'cat_posterior_corrective',
    'Empuje Horizontal (Pecho)': 'cat_horiz_push',
    'Fuerza Unilateral (Tren Inferior)': 'cat_unilateral_strength',
    'Tracción Posterior / Postural': 'cat_posterior_corrective',
    'Cadena Posterior / Glúteos': 'cat_posterior_glutes',
    'Fuerza Lateral (Tren Inferior)': 'cat_lateral_strength',
    'Aislamiento Hombros (Lateral)': 'cat_shoulder_isolation',
    'Core / Rotación': 'cat_core_rotation',
    'Fuerza Isométrica Core': 'cat_core_isometric',
    'Patrón Bisagra (Cadena Posterior)': 'cat_hinge',
    'Tracción Vertical (Espalda)': 'cat_vert_pull',
    'Empuje Inclinado (Pecho/Hombros)': 'cat_inclined_push',
    'Fuerza Unilateral Cruzada (Glúteos)': 'cat_unilateral_cross',
    'Aislamiento Superior (Bíceps)': 'cat_biceps_isolation',
    'Core / Anti-Rotación Estática': 'cat_core_static',
    'Resistencia Core Dinámica': 'cat_core_dynamic'
};

/**
 * Translates a raw workoutData.js category string via `t`. Falls back to the
 * raw category (Spanish) if there's no mapping or no translation for it.
 */
export function getCategoryTranslation(category, t) {
    const key = categoryKeyMap[category];
    if (!key) return category;
    const translated = t(key);
    return translated !== key ? translated : category;
}
