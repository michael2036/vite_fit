import { useState, useMemo } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { workoutPlan } from '../data/workoutData';
import { useLanguage } from '../context/LanguageContext';
import * as workoutStore from '../services/workoutStore';
import { triggerHaptic } from '../utils/haptics';
import RoutineTab from './dashboard/RoutineTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import TipsTab from './dashboard/TipsTab';
import SettingsModal from './dashboard/SettingsModal';

const TABS = ['routine', 'analytics', 'tips'];

export default function Dashboard({
    setAppState, startTraining, activeUser, selectedDay, setSelectedDay, activeTab, setActiveTab
}) {
    const { language, t } = useLanguage();

    const [selectedExId, setSelectedExId] = useState('D1-1');
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Color theme based on activeUser
    const userTheme = useMemo(() => {
        if (activeUser === 'michael') return { primary: 'text-ios-blue', bg: 'bg-ios-blue', border: 'border-ios-blue/20', glow: 'shadow-ios-blue/10' };
        if (activeUser === 'lina') return { primary: 'text-ios-pink', bg: 'bg-ios-pink', border: 'border-ios-pink/20', glow: 'shadow-ios-pink/10' };
        return { primary: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' };
    }, [activeUser]);
    const userColorHex = activeUser === 'lina' ? '#FF2D55' : activeUser === 'michael' ? '#007AFF' : '#A78BFA';

    const userNames = {
        michael: 'Michael',
        lina: 'Lina',
        test: t('profile_test_title')
    };

    // Load logs for the active user from localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps -- activeTab is a deliberate cache-buster: re-read localStorage when the user switches to Analytics in case a workout was just logged
    const logs = useMemo(() => workoutStore.getLogsForUser(activeUser), [activeUser, activeTab]);

    // Retrieve last workout score & tonnage metrics
    const summaryMetrics = useMemo(() => {
        if (logs.length === 0) return { lastScore: 0, lastTonnage: 0, totalWorkouts: 0, trend: 'N/A' };
        const lastSession = logs[0];

        let lastTonnage = lastSession.tonnage || 0;
        if (lastTonnage === 0 && lastSession.exercises) {
            lastSession.exercises.forEach(ex => {
                ex.sets?.forEach(s => {
                    if (s.completed) lastTonnage += (s.weight || 0) * (s.reps || 0);
                });
            });
        }

        let trend = 'Neutral';
        if (logs.length > 1) {
            const prevSession = logs[1];
            if (lastSession.score > prevSession.score) trend = 'up';
            else if (lastSession.score < prevSession.score) trend = 'down';
        }

        return {
            lastScore: lastSession.score || 0,
            lastTonnage,
            totalWorkouts: logs.length,
            trend
        };
    }, [logs]);

    // Dynamic sports science calculations based on session history
    const scientificMetrics = useMemo(() => {
        if (logs.length === 0) {
            return { overloadStreak: 0, glut4Index: 0, cnsRecovery: 100 };
        }

        let overloadStreak = 0;
        const sortedLogs = [...logs].reverse(); // chronological
        const runningTonnagePerDay = { D1: 0, D2: 0, D3: 0 };

        sortedLogs.forEach(session => {
            const day = session.day;
            let currentTonnage = session.tonnage || 0;
            if (currentTonnage === 0 && session.exercises) {
                session.exercises.forEach(ex => {
                    ex.sets?.forEach(s => {
                        if (s.completed) currentTonnage += (s.weight || 0) * (s.reps || 0);
                    });
                });
            }

            const prevTonnage = runningTonnagePerDay[day];
            if (prevTonnage > 0 && currentTonnage > prevTonnage) {
                overloadStreak++;
            } else if (prevTonnage > 0 && currentTonnage < prevTonnage) {
                overloadStreak = 0; // reset on drop
            }
            runningTonnagePerDay[day] = currentTonnage;
        });

        // GLUT4 Translocation Activation % (Glycogen clearance stimulated by skeletal muscle contraction)
        const lastSession = logs[0];
        let lastTonnage = lastSession.tonnage || 0;
        if (lastTonnage === 0 && lastSession.exercises) {
            lastSession.exercises.forEach(ex => {
                ex.sets?.forEach(s => {
                    if (s.completed) lastTonnage += (s.weight || 0) * (s.reps || 0);
                });
            });
        }
        const glut4Index = Math.min(100, Math.round((lastTonnage / 7500) * 100)); // intermediate session target: 7500kg total tonnage

        // Central Nervous System (CNS) Fatigue Recovery Estimate %
        let cnsRecovery = 95;
        if (lastSession.duration > 0) {
            const durationMins = lastSession.duration / 60;
            const durationPenalty = Math.max(0, durationMins - 55) * 0.7; // penalty for exceeding 55m active duration
            const scorePenalty = Math.max(0, 95 - (lastSession.score || 95)) * 0.4;
            cnsRecovery = Math.max(45, Math.round(100 - durationPenalty - scorePenalty));
        }

        return { overloadStreak, glut4Index, cnsRecovery };
    }, [logs]);

    // Flat list of all exercises for the exercise selector dropdown
    const allExercisesList = useMemo(() => {
        const list = [];
        Object.keys(workoutPlan).forEach(day => {
            workoutPlan[day].forEach(ex => {
                list.push({ id: ex.id, name: ex.name, category: ex.category });
            });
        });
        return list;
    }, []);

    // Filtered historical logs for the selected exercise (for line/bar charts)
    const exerciseHistoryData = useMemo(() => {
        const history = [];
        [...logs].reverse().forEach(session => { // chronological order (oldest first) so charts draw left-to-right
            const exLog = session.exercises?.find(e => e.exerciseId === selectedExId);
            if (exLog && exLog.sets && exLog.sets.some(s => s.completed)) {
                let maxWeight = 0;
                let volume = 0;
                exLog.sets.forEach(s => {
                    if (s.completed) {
                        if (s.weight > maxWeight) maxWeight = s.weight;
                        volume += (s.weight || 0) * (s.reps || 0);
                    }
                });

                history.push({
                    date: new Date(session.date).toLocaleDateString(
                        language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : 'en-US',
                        { month: 'short', day: 'numeric' }
                    ),
                    maxWeight,
                    volume,
                    score: session.score || 0
                });
            }
        });
        return history;
    }, [logs, selectedExId, language]);

    // Overall scoring trend data (last 15 sessions, chronological)
    const scoreTrendData = useMemo(() => {
        return [...logs]
            .slice(0, 15)
            .reverse()
            .map(session => ({
                date: new Date(session.date).toLocaleDateString(
                    language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : 'en-US',
                    { month: 'short', day: 'numeric' }
                ),
                score: session.score || 0
            }));
    }, [logs, language]);

    const maxWeightValues = exerciseHistoryData.map(d => d.maxWeight);
    const maxWeightDomain = { min: Math.min(...maxWeightValues, 0), max: Math.max(...maxWeightValues, 10) };
    const maxWeightRange = maxWeightDomain.max - maxWeightDomain.min || 1;
    const maxWeightGridTicks = [0, 0.5, 1.0].map(r => maxWeightDomain.min + r * maxWeightRange);

    const volumeValues = exerciseHistoryData.map(d => d.volume);
    const volumeDomain = { min: 0, max: Math.max(...volumeValues, 100) };
    const volumeGridTicks = [0, 0.5, 1.0].map(r => r * volumeDomain.max);

    const handleLogout = () => {
        triggerHaptic(30);
        setAppState('login');
    };

    const tabLabels = { routine: t('tab_routine'), analytics: t('tab_stats'), tips: t('tab_tips') };

    return (
        <div className="absolute inset-0 bg-ios-bg text-white font-sans flex flex-col overflow-hidden">

            {/* iOS Styled Header */}
            <header className="px-4 pb-2 shrink-0 z-40 bg-ios-bg/95 backdrop-blur-xl border-b border-white/10 safe-area-pt pt-2 flex items-end justify-between">
                <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full flex justify-between items-end h-12">
                    <div className="flex flex-col items-start justify-end">
                        <h1 className="text-[32px] leading-none font-extrabold tracking-tight">{t('hello')}, {userNames[activeUser]}</h1>
                    </div>

                    <div className="flex items-center gap-3.5 pb-1">
                        <button
                            onClick={() => { triggerHaptic(25); setIsSettingsOpen(true); }}
                            className="text-gray-400 active:text-white hover:text-white transition-colors p-1"
                            title={t('tab_settings')}
                        >
                            <Settings size={22} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-ios-pink font-semibold flex items-center gap-1 active:opacity-75 text-[15px]"
                        >
                            <LogOut size={16} /> {t('logout')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="px-4 pt-4 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full flex-1 overflow-y-auto pb-32 no-scrollbar relative">

                {/* iOS Tab Selector Segmented Control */}
                <div className="mb-6">
                    <nav className="bg-[#1C1C1E] p-1 rounded-xl flex text-sm shadow-inner max-w-md mx-auto" role="tablist">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { triggerHaptic(20); setActiveTab(tab); }}
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all outline-none ${
                                    activeTab === tab ? 'bg-[#3A3A3C] text-white shadow-md' : 'text-gray-400'
                                }`}
                            >
                                {tabLabels[tab]}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'routine' && (
                    <RoutineTab
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                        userTheme={userTheme}
                        startTraining={startTraining}
                    />
                )}

                {activeTab === 'analytics' && (
                    <AnalyticsTab
                        activeUser={activeUser}
                        userTheme={userTheme}
                        userColorHex={userColorHex}
                        logs={logs}
                        summaryMetrics={summaryMetrics}
                        scientificMetrics={scientificMetrics}
                        selectedExId={selectedExId}
                        setSelectedExId={setSelectedExId}
                        allExercisesList={allExercisesList}
                        exerciseHistoryData={exerciseHistoryData}
                        scoreTrendData={scoreTrendData}
                        maxWeightDomain={maxWeightDomain}
                        maxWeightGridTicks={maxWeightGridTicks}
                        volumeDomain={volumeDomain}
                        volumeGridTicks={volumeGridTicks}
                        expandedLogId={expandedLogId}
                        setExpandedLogId={setExpandedLogId}
                    />
                )}

                {activeTab === 'tips' && <TipsTab userTheme={userTheme} />}
            </main>

            {isSettingsOpen && (
                <SettingsModal
                    onClose={() => setIsSettingsOpen(false)}
                    activeUser={activeUser}
                    logs={logs}
                />
            )}
        </div>
    );
}
