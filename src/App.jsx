import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding'; // Repurposed as Login Screen
import Dashboard from './components/Dashboard';
import TrainingMode from './components/TrainingMode';
import EndSplash from './components/EndSplash';
import { seedMockDataForTestUser } from './data/workoutData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import * as workoutStore from './services/workoutStore';

export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

function AppContent() {
    const { t } = useLanguage();
    const [isAppReady, setIsAppReady] = useState(false);
    const [appState, setAppState] = useState('login'); // Starts on the Login welcome screen

    // User management state scoped to active user
    const [activeUser, setActiveUser] = useState(() => workoutStore.getActiveUser());
    const [selectedDay, setSelectedDay] = useState(() => workoutStore.getSelectedDay());
    
    const [activeTab, setActiveTab] = useState('routine'); 

    // Training state
    const [currentExIndex, setCurrentExIndex] = useState(0);

    // Timer Background State (Delta Logic avoiding iOS Webkit throttling)
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Sports Science Wellness & Autoregulation State
    const [showWellnessCheck, setShowWellnessCheck] = useState(false);
    const [sleepState, setSleepState] = useState('normal'); // 'excellent' | 'normal' | 'poor'
    const [cnsState, setCnsState] = useState('fresh'); // 'fresh' | 'tired' | 'exhausted'
    const [sorenessState, setSorenessState] = useState('recovered'); // 'recovered' | 'sore' | 'very_sore'
    
    const [autoRegulationFactor, setAutoRegulationFactor] = useState(1.0);
    const [wellnessAssessment, setWellnessAssessment] = useState(null);

    // Save active user and day changes to local storage
    const handleSetActiveUser = (user) => {
        setActiveUser(user);
        workoutStore.setActiveUser(user);
    };

    const handleSetSelectedDay = (day) => {
        setSelectedDay(day);
        workoutStore.setSelectedDay(day);
    };

    // Automated 3-month seeding helper for the Test User
    const triggerSeeding = () => {
        // Always regenerate fresh biologically realistic mock logs for the
        // Test User; other profiles' histories are left untouched.
        workoutStore.replaceLogsForUser('test', seedMockDataForTestUser());
    };

    // Delta Time stopwatch logic
    useEffect(() => {
        let interval;
        if (isTimerRunning && sessionStartTime) {
            interval = setInterval(() => {
                const diffSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
                setTimer(diffSeconds);
            }, 1000);
        } else if (!isTimerRunning && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, sessionStartTime, timer]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const triggerStartTraining = () => {
        if (navigator.vibrate) navigator.vibrate(30);
        // Reset check states
        setSleepState('normal');
        setCnsState('fresh');
        setSorenessState('recovered');
        setShowWellnessCheck(true);
    };

    const confirmWellnessAndStart = () => {
        // Calculate sports-science auto-regulation factor
        const sleepFactor = sleepState === 'excellent' ? 1.0 : sleepState === 'normal' ? 0.95 : 0.85;
        const cnsFactor = cnsState === 'fresh' ? 1.0 : cnsState === 'tired' ? 0.90 : 0.75;
        const sorenessFactor = sorenessState === 'recovered' ? 1.0 : sorenessState === 'sore' ? 0.95 : 0.85;

        // Take limiting factor principal
        const factor = Math.min(sleepFactor, cnsFactor, sorenessFactor);
        
        setAutoRegulationFactor(factor);
        setWellnessAssessment({
            sleep: sleepState,
            cns: cnsState,
            soreness: sorenessState
        });
        
        setShowWellnessCheck(false);
        
        if (navigator.vibrate) navigator.vibrate([40, 20]);
        
        setAppState('training');
        setCurrentExIndex(0);
        setTimer(0);
        setSessionStartTime(Date.now());
        setIsTimerRunning(true);
    };

    const endSession = () => {
        setIsTimerRunning(false);
        setSessionStartTime(null);
        setAppState('endsplash');
    };

    const finishToDashboard = () => {
        setAppState('dashboard');
        setTimer(0);
        setActiveTab('analytics'); // Redirects to Analytics to see the new completed score immediately!
    };

    const earlyExit = () => {
        setIsTimerRunning(false);
        setSessionStartTime(null);
        setAppState('dashboard');
        setTimer(0);
    };

    return (
        <div className="bg-[#050505] min-h-screen selection:bg-ios-blue/30 w-full md:py-8 md:px-4 flex items-center justify-center relative overflow-hidden">
            {/* Soft Ambient Background Glows on desktop */}
            <div className="absolute top-10 left-10 w-[40%] h-[40%] bg-ios-blue/5 blur-[120px] rounded-full hidden md:block pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-[40%] h-[40%] bg-ios-pink/5 blur-[120px] rounded-full hidden md:block pointer-events-none"></div>

            <div className="w-full min-h-screen md:min-h-0 md:h-[88vh] md:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-ios-bg md:rounded-[36px] md:shadow-2xl md:border md:border-white/10 md:overflow-hidden relative flex flex-col">
                <AnimatePresence mode="wait">
                {!isAppReady ? (
                    <SplashScreen key="splash" setAppReady={setIsAppReady} />
                ) : (
                    <motion.div 
                        key="app-content"
                        className="w-full min-h-screen md:min-h-0 md:h-full relative flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {appState === 'login' && (
                                <motion.div 
                                    key="login"
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Onboarding 
                                        setAppState={setAppState} 
                                        setActiveUser={handleSetActiveUser} 
                                        triggerSeeding={triggerSeeding}
                                    />
                                </motion.div>
                            )}

                            {appState === 'dashboard' && (
                                <motion.div 
                                    key="dashboard"
                                    className="absolute inset-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Dashboard
                                        setAppState={setAppState}
                                        startTraining={triggerStartTraining}
                                        activeUser={activeUser}
                                        selectedDay={selectedDay}
                                        setSelectedDay={handleSetSelectedDay}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                    />
                                </motion.div>
                            )}

                            {appState === 'training' && (
                                <TrainingMode
                                    key="training"
                                    activeUser={activeUser}
                                    selectedDay={selectedDay}
                                    timer={timer}
                                    currentExIndex={currentExIndex}
                                    setCurrentExIndex={setCurrentExIndex}
                                    endSession={endSession}
                                    earlyExit={earlyExit}
                                    formatTime={formatTime}
                                    autoRegulationFactor={autoRegulationFactor}
                                    wellnessAssessment={wellnessAssessment}
                                />
                            )}

                            {appState === 'endsplash' && (
                                <EndSplash key="endsplash" onComplete={finishToDashboard} />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* -------------------- DYNAMIC SPORTS-SCIENCE WELLNESS & AUTOREGULATION OVERLAY -------------------- */}
            <AnimatePresence>
                {showWellnessCheck && (
                    <motion.div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-md z-[200] flex flex-col justify-end safe-area-pb"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-[#1C1C1E] rounded-t-[28px] border-t border-white/10 p-6 max-w-lg mx-auto w-full space-y-6 shadow-2xl relative"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        >
                            {/* Header */}
                            <div className="text-center space-y-1 relative">
                                <h3 className="text-[20px] font-extrabold text-white">{t('wellness_title')}</h3>
                                <p className="text-[13px] text-gray-400 font-medium">{t('wellness_subtitle')}</p>
                                <button 
                                    onClick={() => setShowWellnessCheck(false)}
                                    className="absolute right-0 top-0 text-gray-400 active:text-white"
                                >
                                    <span className="text-sm font-semibold text-ios-pink">{t('cancel')}</span>
                                </button>
                            </div>

                            {/* 1. Sleep Selectors */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-1 block">{t('sleep_quality')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'excellent', label: t('sleep_excellent'), desc: t('sleep_excellent_desc') },
                                        { key: 'normal', label: t('sleep_normal'), desc: t('sleep_normal_desc') },
                                        { key: 'poor', label: t('sleep_poor'), desc: t('sleep_poor_desc') }
                                    ].map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setSleepState(opt.key)}
                                            className={`p-3 rounded-2xl flex flex-col items-center justify-center border text-center transition-all ${
                                                sleepState === opt.key 
                                                    ? 'bg-ios-blue/20 border-ios-blue text-white shadow-lg shadow-ios-blue/10' 
                                                    : 'bg-[#2C2C2E]/40 border-transparent text-gray-400'
                                            }`}
                                        >
                                            <span className="text-[13px] font-bold block">{opt.label}</span>
                                            <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. CNS Fatigue Selector */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-1 block">{t('cns_fatigue')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'fresh', label: t('cns_fresh'), desc: t('cns_fresh_desc') },
                                        { key: 'tired', label: t('cns_tired'), desc: t('cns_tired_desc') },
                                        { key: 'exhausted', label: t('cns_exhausted'), desc: t('cns_exhausted_desc') }
                                    ].map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setCnsState(opt.key)}
                                            className={`p-3 rounded-2xl flex flex-col items-center justify-center border text-center transition-all ${
                                                cnsState === opt.key 
                                                    ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10' 
                                                    : 'bg-[#2C2C2E]/40 border-transparent text-gray-400'
                                            }`}
                                        >
                                            <span className="text-[13px] font-bold block">{opt.label}</span>
                                            <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Muscle DOMS Soreness Selector */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-1 block">{t('muscle_doms')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'recovered', label: t('muscle_recovered'), desc: t('muscle_recovered_desc') },
                                        { key: 'sore', label: t('muscle_sore'), desc: t('muscle_sore_desc') },
                                        { key: 'very_sore', label: t('muscle_very_sore'), desc: t('muscle_very_sore_desc') }
                                    ].map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setSorenessState(opt.key)}
                                            className={`p-3 rounded-2xl flex flex-col items-center justify-center border text-center transition-all ${
                                                sorenessState === opt.key 
                                                    ? 'bg-ios-pink/20 border-ios-pink text-white shadow-lg shadow-ios-pink/10' 
                                                    : 'bg-[#2C2C2E]/40 border-transparent text-gray-400'
                                            }`}
                                        >
                                            <span className="text-[13px] font-bold block">{opt.label}</span>
                                            <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Autoregulation estimate warning inside check */}
                            {Math.min(
                                sleepState === 'excellent' ? 1.0 : sleepState === 'normal' ? 0.95 : 0.85,
                                cnsState === 'fresh' ? 1.0 : cnsState === 'tired' ? 0.90 : 0.75,
                                sorenessState === 'recovered' ? 1.0 : sorenessState === 'sore' ? 0.95 : 0.85
                            ) < 1.0 && (
                                <div className="bg-ios-pink/10 border border-ios-pink/25 rounded-2xl p-3 text-[12px] text-ios-pink leading-normal flex items-start gap-2">
                                    <span>⚠️</span>
                                    <span>
                                        <strong>{t('autoreg_active')}</strong> {t('autoreg_warning')}
                                    </span>
                                </div>
                            )}

                            {/* Start button */}
                            <button
                                onClick={confirmWellnessAndStart}
                                className="w-full py-4 bg-ios-blue text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg shadow-ios-blue/20"
                            >
                                {t('confirm_and_train')}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}
