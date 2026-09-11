import { Play } from 'lucide-react';
import { workoutPlan } from '../../data/workoutData';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryTranslation as translateCategory } from '../../utils/categories';
import { triggerHaptic } from '../../utils/haptics';

export default function RoutineTab({ selectedDay, setSelectedDay, userTheme, startTraining }) {
    const { t } = useLanguage();
    const getCategoryTranslation = (category) => translateCategory(category, t);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
            {/* Day Selector Column */}
            <div className="lg:col-span-4 space-y-4 w-full">
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5" role="radiogroup" aria-label="Rutinas">
                    {['D1', 'D2', 'D3'].map((day) => {
                        const dayTitles = {
                            'D1': t('day_1_title'),
                            'D2': t('day_2_title'),
                            'D3': t('day_3_title')
                        };
                        const daySubtitles = {
                            'D1': t('day_1_subtitle'),
                            'D2': t('day_2_subtitle'),
                            'D3': t('day_3_subtitle')
                        };
                        const isSelected = selectedDay === day;

                        return (
                            <button
                                key={day}
                                onClick={() => { triggerHaptic(25); setSelectedDay(day); }}
                                role="radio"
                                aria-checked={isSelected}
                                className={`p-3.5 rounded-[20px] flex flex-col items-start transition-all relative overflow-hidden border w-full ${
                                    isSelected
                                        ? `bg-ios-card/90 ${userTheme.border} ${userTheme.glow} shadow-xl ring-1 ring-opacity-30`
                                        : 'bg-ios-card/45 border-transparent opacity-65'
                                }`}
                            >
                                {isSelected && (
                                    <div className={`absolute top-0 left-0 w-full h-[3px] ${userTheme.bg}`}></div>
                                )}
                                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? userTheme.primary : 'text-gray-500'}`}>
                                    {day === 'D1' ? t('day_1') : day === 'D2' ? t('day_2') : t('day_3')}
                                </span>
                                <span className="text-[15px] font-bold text-white mt-1 text-left leading-tight">{dayTitles[day]}</span>
                                <span className="text-[11px] text-gray-400 text-left mt-0.5 leading-snug">{daySubtitles[day]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Exercises List Block */}
            <div className="lg:col-span-8 space-y-6 w-full">
                <div className="bg-ios-card/70 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/5 shadow-xl">
                    <div className="p-4 bg-[#2C2C2E]/40 border-b border-white/10 flex items-center justify-between">
                        <span className="text-sm font-extrabold uppercase tracking-widest text-gray-400">
                            {t('stats_ex_details')}
                        </span>
                        <span className="text-xs bg-[#2C2C2E] px-2 py-0.5 rounded-full font-bold text-gray-300">
                            {workoutPlan[selectedDay]?.length || 0} {t('total')}
                        </span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {workoutPlan[selectedDay]?.map((ex, i) => (
                            <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-[#2C2C2E] text-gray-300 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-white leading-tight">{t(ex.id + '_name')}</h4>
                                        <p className="text-[12px] text-gray-400 mt-0.5">{getCategoryTranslation(ex.category)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[13px] font-bold text-gray-300 block">{ex.sets} sets</span>
                                    <span className="text-[11px] text-gray-500">{ex.reps} reps</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Space placeholder */}
            <div className="h-6 lg:hidden"></div>

            {/* Sticky Bottom Training Launch Trigger */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-ios-bg/90 backdrop-blur-xl border-t border-white/10 safe-area-pb z-40">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
                    <button
                        onClick={startTraining}
                        className={`w-full py-4 ${userTheme.bg} text-white rounded-[22px] font-bold text-[17px] active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-lg ${userTheme.glow}`}
                    >
                        <Play size={20} fill="currentColor" /> {t('start_training')}
                    </button>
                </div>
            </div>
        </div>
    );
}
