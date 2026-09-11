import { Activity, Award, Calendar, ChevronDown, ChevronUp, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryTranslation as translateCategory } from '../../utils/categories';
import { isTimeExercise } from '../../utils/exercises';
import { triggerHaptic } from '../../utils/haptics';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';

export default function AnalyticsTab({
    activeUser, userTheme, userColorHex, logs,
    summaryMetrics, scientificMetrics,
    selectedExId, setSelectedExId, allExercisesList,
    exerciseHistoryData, scoreTrendData,
    maxWeightDomain, maxWeightGridTicks, volumeDomain, volumeGridTicks,
    expandedLogId, setExpandedLogId,
}) {
    const { language, t } = useLanguage();
    const getCategoryTranslation = (category) => translateCategory(category, t);

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-16">

            {/* Consolidated KPI Summary Card */}
            <div className="bg-gradient-to-tr from-ios-card to-[#2C2C2E]/60 rounded-[24px] p-5 border border-white/10 shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">{t('stats_performance')}</span>
                    <div className="flex items-center gap-1.5">
                        <Award className={userTheme.primary} size={22} />
                        <h3 className="text-3xl font-extrabold tracking-tight">
                            {summaryMetrics.lastScore} <span className="text-sm font-semibold text-gray-500">/100</span>
                        </h3>
                    </div>
                    <span className="text-[12px] text-gray-400 block mt-0.5">{t('last_score_recorded')}</span>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">{t('stats_total_volume')}</span>
                    <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="text-ios-green" size={16} />
                        <span className="text-xl font-bold text-white">{summaryMetrics.lastTonnage} kg</span>
                    </div>
                    <span className="text-[12px] text-gray-400 block mt-0.5">{summaryMetrics.totalWorkouts} {t('workouts')}</span>
                </div>
            </div>

            {/* Split grid on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
                {/* Left Column: Charts */}
                <div className="space-y-6 w-full">
                    <LineChart
                        data={scoreTrendData.map(d => ({ date: d.date, value: d.score }))}
                        color={userColorHex}
                        gradientId="scoreTrendGlow"
                        domain={{ min: 50, max: 100 }}
                        gridTicks={[50, 75, 100]}
                        formatGridLabel={(v) => `${v}`}
                        title={t('stats_score_trend')}
                        headerRight={<span className="text-[12px] bg-ios-green/10 text-ios-green px-2 py-0.5 rounded-full font-bold">{t('last_15_days')}</span>}
                    />

                    {/* Exercise Selection Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="analytics-exercise-select" className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1 block">
                            {t('analyze_specific_exercise')}
                        </label>
                        <div className="relative">
                            <select
                                id="analytics-exercise-select"
                                value={selectedExId}
                                onChange={(e) => { triggerHaptic(20); setSelectedExId(e.target.value); }}
                                className="w-full p-4 pr-10 bg-ios-card rounded-2xl border border-white/5 text-[15px] font-bold appearance-none text-white focus:outline-none focus:ring-1 focus:ring-ios-blue shadow-lg"
                            >
                                {allExercisesList.map(ex => (
                                    <option key={ex.id} value={ex.id}>
                                        {ex.id} • {t(ex.id + '_name')} ({getCategoryTranslation(ex.category)})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <LineChart
                        data={exerciseHistoryData.map(d => ({ date: d.date, value: d.maxWeight }))}
                        color={userColorHex}
                        gradientId="maxWeightGlow"
                        domain={maxWeightDomain}
                        gridTicks={maxWeightGridTicks}
                        formatGridLabel={(v) => `${Math.round(v * 10) / 10}kg`}
                        formatPointLabel={(v) => `${v}k`}
                        showPointLabels
                        title={t('stats_max_weight')}
                        emptyState={
                            <div className="h-44 flex flex-col items-center justify-center text-gray-500 bg-[#2C2C2E]/30 rounded-2xl border border-white/5">
                                <Dumbbell size={32} className="opacity-30 mb-2" />
                                <span className="text-xs">{t('no_logs_exercise')}</span>
                            </div>
                        }
                    />
                    <BarChart
                        data={exerciseHistoryData.map(d => ({ date: d.date, value: d.volume }))}
                        color={userColorHex}
                        domain={volumeDomain}
                        gridTicks={volumeGridTicks}
                        formatGridLabel={(v) => `${Math.round(v)}`}
                        title={t('stats_session_volume')}
                    />
                </div>

                {/* Right Column: Physiology and Logs */}
                <div className="space-y-6 w-full">
                    <div className="bg-ios-card rounded-[24px] p-5 border border-white/5 shadow-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                            <Activity className={userTheme.primary} size={20} />
                            <h4 className="text-[15px] font-bold text-white uppercase tracking-wider">
                                {t('advanced_physiology_metrics')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[#2C2C2E]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-between items-center h-[120px] hover:bg-[#2C2C2E]/60 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center mb-1">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[20px] font-black text-white">{scientificMetrics.overloadStreak}</span>
                                    <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-widest block">{t('streak')}</span>
                                </div>
                                <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">{t('loads_exceeded')}</span>
                            </div>

                            <div className="bg-[#2C2C2E]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-between items-center h-[120px] hover:bg-[#2C2C2E]/60 transition-colors">
                                <div className={`w-8 h-8 rounded-lg ${activeUser === 'lina' ? 'bg-ios-pink/15 text-ios-pink' : 'bg-ios-blue/15 text-ios-blue'} flex items-center justify-center mb-1`}>
                                    <Activity size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[20px] font-black text-white">{scientificMetrics.glut4Index}%</span>
                                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block leading-none mt-0.5">{t('recruitment')}</span>
                                </div>
                                <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">{t('glut4_pathways')}</span>
                            </div>

                            <div className="bg-[#2C2C2E]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-between items-center h-[120px] hover:bg-[#2C2C2E]/60 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center mb-1">
                                    <Award size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[20px] font-black text-white">{scientificMetrics.cnsRecovery}%</span>
                                    <span className="text-[9px] font-extrabold text-purple-400 uppercase tracking-widest block">{t('cns_state')}</span>
                                </div>
                                <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">{t('nervous_reserve')}</span>
                            </div>
                        </div>

                        <div className="bg-[#2C2C2E]/30 rounded-xl p-3 border border-white/5 text-left text-[12px] leading-relaxed text-gray-400 flex flex-col gap-1">
                            <span className={`text-[10px] font-extrabold ${userTheme.primary} uppercase tracking-wider block`}>
                                {t('sports_science_diagnosis')}
                            </span>
                            {activeUser === 'test' && <span>{t('commentary_test')}</span>}
                            {activeUser === 'michael' && <span>{t('commentary_michael')}</span>}
                            {activeUser === 'lina' && <span>{t('commentary_lina')}</span>}
                        </div>
                    </div>

                    {/* Interactive expandable workout logs */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1 text-gray-400">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('stats_history')}</span>
                        </div>

                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-ios-card/30 rounded-2xl border border-white/5">
                                {t('no_workouts_logged')}
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {logs.map((session) => {
                                    const isExpanded = expandedLogId === session.id;
                                    const dateLabel = new Date(session.date).toLocaleDateString(
                                        language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : 'en-US',
                                        { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }
                                    );

                                    return (
                                        <div key={session.id} className="bg-ios-card/85 rounded-[22px] border border-white/5 overflow-hidden transition-all duration-200">
                                            <button
                                                onClick={() => { triggerHaptic(20); setExpandedLogId(isExpanded ? null : session.id); }}
                                                className="w-full p-4 flex items-center justify-between text-left active:bg-white/5"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            session.day === 'D1' ? 'bg-ios-blue' : session.day === 'D2' ? 'bg-ios-pink' : 'bg-purple-400'
                                                        }`}></span>
                                                        <span className="text-[16px] font-extrabold text-white">
                                                            {session.day === 'D1' ? t('day_1') : session.day === 'D2' ? t('day_2') : t('day_3')} — {language === 'es' ? session.dayName : session.day === 'D1' ? t('day_1_title') : session.day === 'D2' ? t('day_2_title') : t('day_3_title')}
                                                        </span>
                                                    </div>
                                                    <span className="text-[12px] text-gray-400 block font-medium capitalize">{dateLabel}</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <span className="text-xs font-extrabold text-ios-green block">Score: {session.score}</span>
                                                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 justify-end">
                                                            <Clock size={11} /> {Math.round(session.duration / 60)} min
                                                        </span>
                                                    </div>
                                                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-[#2C2C2E]/25 divide-y divide-white/5">
                                                    {session.exercises?.filter(ex => ex.sets && ex.sets.some(s => s.completed)).map((ex, exIdx) => (
                                                        <div key={exIdx} className="py-3 first:pt-1 last:pb-1">
                                                            <div className="flex items-baseline justify-between mb-1.5">
                                                                <h5 className="text-[14px] font-bold text-white flex items-center gap-1.5">
                                                                    {t(ex.exerciseId + '_name')}
                                                                    {ex.selectedOption === 'alternative' && (
                                                                        <span className="text-[9px] bg-ios-pink/20 text-ios-pink font-extrabold px-1.5 py-0.5 rounded-full select-none uppercase tracking-wide">{t('stats_machine')}</span>
                                                                    )}
                                                                </h5>
                                                                <span className="text-[11px] text-gray-400">{getCategoryTranslation(ex.category)}</span>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                {ex.sets?.filter(s => s.completed).map((s, sIdx) => {
                                                                    const isTime = isTimeExercise(ex.exerciseId);
                                                                    const formattedTime = s.reps >= 60 ? `${Math.floor(s.reps / 60)}m ${s.reps % 60}s` : `${s.reps}s`;
                                                                    return (
                                                                        <div key={sIdx} className="px-2.5 py-1 bg-[#2C2C2E]/60 border border-white/5 rounded-lg flex items-center gap-1.5">
                                                                            <span className="text-[10px] text-gray-500 font-extrabold">S{s.setNum}</span>
                                                                            {isTime ? (
                                                                                <span className="text-xs font-bold text-gray-200">{formattedTime}</span>
                                                                            ) : (
                                                                                <>
                                                                                    <span className="text-xs font-bold text-gray-200">{s.weight}kg</span>
                                                                                    <span className="text-[10px] text-gray-500 font-bold">×</span>
                                                                                    <span className="text-xs font-bold text-gray-200">{s.reps}r</span>
                                                                                </>
                                                                            )}
                                                                            {s.alFallo && (
                                                                                <span className="text-[9px] bg-red-500/20 text-red-400 font-bold px-1.5 rounded select-none uppercase tracking-wider">{t('train_failure')}</span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {(ex.duration > 0 || ex.restDuration > 0) && (
                                                                <div className="flex gap-4 mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                                    {ex.duration > 0 && (
                                                                        <span>{t('stats_duration')}: {Math.floor(ex.duration / 60)}m {ex.duration % 60}s</span>
                                                                    )}
                                                                    {ex.restDuration > 0 && (
                                                                        <span className="text-ios-blue">{t('stats_rest')}: {Math.floor(ex.restDuration / 60)}m {ex.restDuration % 60}s</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
