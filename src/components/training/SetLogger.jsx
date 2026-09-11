import { Check, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function AutoregulationBanner({ autoRegulationFactor, wellnessAssessment }) {
    const { language, t } = useLanguage();
    if (autoRegulationFactor >= 1.0) return null;

    const sleepStr = wellnessAssessment?.sleep === 'poor' ? t('sleep_poor') : wellnessAssessment?.sleep === 'normal' ? t('sleep_normal') : t('sleep_excellent');
    const cnsStr = wellnessAssessment?.cns === 'exhausted' ? t('cns_exhausted') : wellnessAssessment?.cns === 'tired' ? t('cns_tired') : t('cns_fresh');
    const soreStr = wellnessAssessment?.soreness === 'very_sore' ? t('muscle_very_sore') : wellnessAssessment?.soreness === 'sore' ? t('muscle_sore') : t('muscle_recovered');
    const pct = Math.round((1 - autoRegulationFactor) * 100);

    const autoregText = language === 'en'
        ? `Due to your recovery today (${sleepStr}, ${cnsStr}, and ${soreStr}), it is suggested to reduce your previous loads by ${pct}%. The smart suggestions below have already been recalculated.`
        : language === 'de'
            ? `Aufgrund deiner heutigen Erholung (${sleepStr}, ${cnsStr} und ${soreStr}) wird empfohlen, deine vorherigen Lasten um ${pct}% zu reduzieren. Die intelligenten Vorschläge unten wurden bereits neu berechnet.`
            : `Debido a tu descanso de hoy (${sleepStr}, ${cnsStr}, y ${soreStr}), se sugiere reducir tus cargas anteriores un ${pct}%. Las sugerencias inteligentes abajo ya han sido recalculadas.`;

    return (
        <div className="max-w-lg md:max-w-none mx-auto md:mx-0 bg-purple-500/10 border border-purple-500/25 rounded-[20px] p-4 mb-4 text-[13px] leading-normal flex items-start gap-3 shadow-lg shadow-purple-500/5 animate-in fade-in slide-in-from-bottom duration-300">
            <span className="text-[18px] select-none">📉</span>
            <div>
                <span className="font-extrabold text-purple-400 block mb-0.5">{t('autoreg_active') || 'Autorregulación Activa'} ({Math.round(autoRegulationFactor * 100)}%)</span>
                <span className="text-gray-300">{autoregText}</span>
            </div>
        </div>
    );
}

/** Right column of TrainingMode: autoregulation banner and the sets/reps logging table. */
export default function SetLogger({
    currentEx, activeSets, prevLog, autoRegulationFactor, wellnessAssessment,
    updateSetField, handleSetToggle, addSet, removeSet,
}) {
    const { language, t } = useLanguage();
    const isTimeBased = currentEx.measurementType === 'time';

    const formatTimeVal = (sec) => (sec >= 60 ? `${Math.floor(sec / 60)}m` : `${sec}s`);

    return (
        <div className="space-y-4 w-full">
            <AutoregulationBanner autoRegulationFactor={autoRegulationFactor} wellnessAssessment={wellnessAssessment} />

            <div className="max-w-lg md:max-w-none mx-auto md:mx-0 bg-ios-card rounded-[22px] overflow-hidden p-4 shadow-xl border border-white/5 mb-6">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span className="text-[15px] font-bold text-white flex items-center gap-1.5">
                        {t('train_history_log') || 'Historial y Registro'}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={addSet} className="px-2.5 py-1 bg-[#2C2C2E] text-white rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform">
                            <Plus size={14} /> {t('train_set')}
                        </button>
                        <button onClick={removeSet} className="px-2.5 py-1 bg-[#2C2C2E] text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform">
                            <Minus size={14} /> {t('train_set')}
                        </button>
                    </div>
                </div>

                {isTimeBased ? (
                    <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-gray-500 uppercase pb-2 px-1">
                        <div className="col-span-1 text-center">{language === 'es' ? 'Ser' : 'Set'}</div>
                        <div className="col-span-2 text-center">{language === 'es' ? 'Prev' : language === 'de' ? 'Vorh' : 'Prev'}</div>
                        <div className="col-span-5 text-center">{t('train_time_duration')}</div>
                        <div className="col-span-2 text-center">{t('train_failure')}</div>
                        <div className="col-span-2 text-center">{language === 'de' ? 'Prot' : 'Log'}</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-gray-500 uppercase pb-2 px-1">
                        <div className="col-span-1 text-center">{language === 'es' ? 'Ser' : 'Set'}</div>
                        <div className="col-span-2 text-center">{language === 'es' ? 'Prev' : language === 'de' ? 'Vorh' : 'Prev'}</div>
                        <div className="col-span-3 text-center">{t('train_weight_kg')}</div>
                        <div className="col-span-2 text-center">{t('train_reps')}</div>
                        <div className="col-span-2 text-center">{t('train_failure')}</div>
                        <div className="col-span-2 text-center">{language === 'de' ? 'Prot' : 'Log'}</div>
                    </div>
                )}

                <div className="space-y-2">
                    {activeSets.map((set, idx) => {
                        const prevSet = prevLog?.sets?.[idx];
                        const prevSuggestionText = prevSet
                            ? (isTimeBased ? formatTimeVal(prevSet.reps) : `${prevSet.weight}k × ${prevSet.reps}`)
                            : '—';

                        return (
                            <div
                                key={idx}
                                className={`grid grid-cols-12 gap-1 items-center py-2 px-1 rounded-xl transition-colors ${
                                    set.completed ? 'bg-ios-green/10 border border-ios-green/20' : 'bg-[#2C2C2E]/40 border border-transparent'
                                }`}
                            >
                                <div className="col-span-1 text-center">
                                    <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center mx-auto ${
                                        set.completed ? 'bg-ios-green text-white' : 'bg-[#2C2C2E] text-gray-300'
                                    }`}>
                                        {set.setNum}
                                    </span>
                                </div>

                                <div className="col-span-2 text-center text-[10px] font-bold text-gray-400 tracking-tight leading-none select-none">
                                    {prevSuggestionText}
                                </div>

                                {isTimeBased ? (
                                    <div className="col-span-5 flex items-center justify-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                const step = currentEx.id.includes('WU') ? 60 : 5;
                                                updateSetField(idx, 'reps', Math.max(0, (Number(set.reps) || 0) - step));
                                                updateSetField(idx, 'weight', 0);
                                            }}
                                            disabled={set.completed}
                                            className="px-1.5 py-0.5 bg-[#2C2C2E] rounded text-[10px] font-bold text-gray-400 active:scale-90 disabled:opacity-30 select-none shrink-0"
                                        >
                                            -{currentEx.id.includes('WU') ? '1m' : '5s'}
                                        </button>
                                        <input
                                            type="number"
                                            value={set.reps === 0 ? '' : set.reps}
                                            placeholder={prevSet ? prevSet.reps : (currentEx.id.includes('WU') ? "600" : "30")}
                                            disabled={set.completed}
                                            onChange={(e) => {
                                                updateSetField(idx, 'reps', parseInt(e.target.value) || 0);
                                                updateSetField(idx, 'weight', 0);
                                            }}
                                            className="w-14 h-7 bg-[#2C2C2E] text-center text-[13px] font-bold rounded-md border-0 focus:ring-1 focus:ring-ios-blue text-white p-0 disabled:opacity-60 font-mono"
                                        />
                                        <span className="text-[10px] font-bold text-gray-500 select-none">s</span>
                                        <button
                                            onClick={() => {
                                                const step = currentEx.id.includes('WU') ? 60 : 5;
                                                updateSetField(idx, 'reps', (Number(set.reps) || 0) + step);
                                                updateSetField(idx, 'weight', 0);
                                            }}
                                            disabled={set.completed}
                                            className="px-1.5 py-0.5 bg-[#2C2C2E] rounded text-[10px] font-bold text-gray-400 active:scale-90 disabled:opacity-30 select-none shrink-0"
                                        >
                                            +{currentEx.id.includes('WU') ? '1m' : '5s'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="col-span-3 flex items-center justify-center gap-0.5">
                                            <button
                                                onClick={() => updateSetField(idx, 'weight', Math.max(0, (Number(set.weight) || 0) - 2.5))}
                                                disabled={set.completed}
                                                className="w-4 h-4 bg-[#2C2C2E] rounded flex items-center justify-center text-[10px] font-bold text-gray-400 active:scale-90 disabled:opacity-30"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={set.weight === 0 ? '' : set.weight}
                                                placeholder={prevSet ? prevSet.weight : "0"}
                                                disabled={set.completed}
                                                onChange={(e) => updateSetField(idx, 'weight', parseFloat(e.target.value) || 0)}
                                                className="w-10 h-7 bg-[#2C2C2E] text-center text-[13px] font-bold rounded-md border-0 focus:ring-1 focus:ring-ios-blue text-white p-0 disabled:opacity-60 font-mono"
                                            />
                                            <button
                                                onClick={() => updateSetField(idx, 'weight', (Number(set.weight) || 0) + 2.5)}
                                                disabled={set.completed}
                                                className="w-4 h-4 bg-[#2C2C2E] rounded flex items-center justify-center text-[10px] font-bold text-gray-400 active:scale-90 disabled:opacity-30"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="col-span-2 flex items-center justify-center gap-0.5">
                                            <input
                                                type="number"
                                                value={set.reps === 0 ? '' : set.reps}
                                                placeholder={prevSet ? prevSet.reps : "10"}
                                                disabled={set.completed}
                                                onChange={(e) => updateSetField(idx, 'reps', parseInt(e.target.value) || 0)}
                                                className="w-8 h-7 bg-[#2C2C2E] text-center text-[13px] font-bold rounded-md border-0 focus:ring-1 focus:ring-ios-blue text-white p-0 disabled:opacity-60 font-mono"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="col-span-2 flex items-center justify-center px-0.5">
                                    <button
                                        onClick={() => updateSetField(idx, 'alFallo', !set.alFallo)}
                                        disabled={set.completed}
                                        className={`w-6 h-6 rounded border transition-all active:scale-90 flex items-center justify-center ${
                                            set.alFallo
                                                ? 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-500/30'
                                                : 'border-white/20 text-transparent bg-[#1C1C1E]'
                                        }`}
                                        title={t('train_to_failure')}
                                    >
                                        <span className="text-[10px] font-extrabold select-none leading-none">F</span>
                                    </button>
                                </div>

                                <div className="col-span-2 text-center">
                                    <button
                                        onClick={() => handleSetToggle(idx)}
                                        className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center border transition-all active:scale-90 ${
                                            set.completed
                                                ? 'bg-ios-green border-ios-green text-white shadow-sm shadow-ios-green/30'
                                                : 'border-white/20 text-transparent bg-[#1C1C1E]'
                                        }`}
                                    >
                                        <Check size={14} strokeWidth={3.5} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
