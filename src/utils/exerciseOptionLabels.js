// Maps an exercise id to the i18n keys for its primary (free-weight) and
// alternative (machine) option tab labels in TrainingMode. Kept as raw keys
// rather than translated strings so this stays a pure, testable lookup —
// the caller resolves them through t().
const OPTION_LABEL_KEYS = {
    'D1-WU': { primary: 'opt_cinta_eliptica', alternative: 'opt_bicicleta_bandas' },
    'D2-WU': { primary: 'opt_cinta_eliptica', alternative: 'opt_bicicleta_bandas' },
    'D3-WU': { primary: 'opt_cinta_eliptica', alternative: 'opt_bicicleta_bandas' },

    'D1-1': { primary: 'opt_sentadilla_copa', alternative: 'opt_prensa_piernas' },
    'D1-2': { primary: 'opt_trx_remo', alternative: 'opt_remo_maquina' },
    'D1-3': { primary: 'opt_split_squat', alternative: 'opt_prensa_unilateral' },
    'D1-4': { primary: 'opt_press_hombro', alternative: 'opt_prensa_hombro' },
    'D1-5': { primary: 'opt_curl_fitball', alternative: 'opt_leg_curl' },
    'D1-6': { primary: 'opt_mancuerna_nuca', alternative: 'opt_triceps_polea' },
    'D1-8': { primary: 'opt_supermans', alternative: 'opt_extension_lumbar' },

    'D2-1': { primary: 'opt_press_banca', alternative: 'opt_prensa_pecho' },
    'D2-2': { primary: 'opt_zancada_libre', alternative: 'opt_sentadilla_multipower' },
    'D2-3': { primary: 'opt_pajaros_mancuerna', alternative: 'opt_pec_deck_invertido' },
    'D2-4': { primary: 'opt_hip_thrust', alternative: 'opt_hip_thrust_maquina' },
    'D2-5': { primary: 'opt_cosaca', alternative: 'opt_maquina_aductora' },
    'D2-6': { primary: 'opt_lateral_mancuernas', alternative: 'opt_lateral_polea' },
    'D2-7': { primary: 'opt_rotacion_banda', alternative: 'opt_rotacion_polea' },

    'D3-1': { primary: 'opt_peso_muerto', alternative: 'opt_hiperextension_45' },
    'D3-2': { primary: 'opt_dominadas', alternative: 'opt_jalon_pecho' },
    'D3-3': { primary: 'opt_subida_cajon', alternative: 'opt_zancadas_multipower' },
    'D3-4': { primary: 'opt_press_inclinado', alternative: 'opt_prensa_inclinada' },
    'D3-5': { primary: 'opt_curtsy_lunge', alternative: 'opt_patada_gluteo' },
    'D3-6': { primary: 'opt_curl_mancuernas', alternative: 'opt_maquina_biceps' },
    'D3-8': { primary: 'opt_tuck_ups', alternative: 'opt_crunch_abdominal' },
};

const DEFAULT_KEYS = { primary: 'opt_freeweight', alternative: 'opt_machine_cable' };

export function getOptionLabelKeys(exerciseId) {
    return OPTION_LABEL_KEYS[exerciseId] || DEFAULT_KEYS;
}
