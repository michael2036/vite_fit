import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding'; // Repurposed as Login Screen
import Dashboard from './components/Dashboard';
import TrainingMode from './components/TrainingMode';
import EndSplash from './components/EndSplash';
import { seedMockDataForTestUser } from './data/workoutData';

export default function App() {
    const [isAppReady, setIsAppReady] = useState(false);
    const [appState, setAppState] = useState('login'); // Starts on the Login welcome screen

    // User management state scoped to active user
    const [activeUser, setActiveUser] = useState(() => {
        try {
            return localStorage.getItem('vitefit_active_user') || 'michael';
        } catch (e) {
            return 'michael';
        }
    });

    const [selectedDay, setSelectedDay] = useState(() => {
        try {
            return localStorage.getItem('vitefit_selected_day') || 'D1';
        } catch (e) {
            return 'D1';
        }
    });
    
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
        try {
            localStorage.setItem('vitefit_active_user', user);
        } catch (e) {
            console.warn("localStorage setItem activeUser denied", e);
        }
    };

    // Clean up Michael and Lina's legacy logs on start to ensure clean slate
    useEffect(() => {
        try {
            const rawLogs = localStorage.getItem('vitefit_workout_logs');
            if (rawLogs) {
                const allLogs = JSON.parse(rawLogs);
                const filtered = allLogs.filter(log => log.user !== 'michael' && log.user !== 'lina');
                localStorage.setItem('vitefit_workout_logs', JSON.stringify(filtered));
                console.log("Cleaned up legacy logs for michael and lina.");
            }
        } catch (e) {
            console.warn("localStorage cleanup of michael/lina logs failed:", e);
        }
    }, []);

    const handleSetSelectedDay = (day) => {
        setSelectedDay(day);
        try {
            localStorage.setItem('vitefit_selected_day', day);
        } catch (e) {
            console.warn("localStorage setItem selectedDay denied", e);
        }
    };

    // Automated 3-month seeding helper for the Test User
    const triggerSeeding = () => {
        try {
            let logs = [];
            try {
                const rawLogs = localStorage.getItem('vitefit_workout_logs');
                logs = rawLogs ? JSON.parse(rawLogs) : [];
            } catch (e) {
                logs = [];
            }
            
            // Check if test user has logs already
            const hasTestLogs = logs.some(log => log.user === 'test');
            if (!hasTestLogs) {
                const seeded = seedMockDataForTestUser();
                // Merge with other users' histories to prevent wiping Michael or Lina's logs
                const combined = [...seeded, ...logs.filter(log => log.user !== 'test')];
                try {
                    localStorage.setItem('vitefit_workout_logs', JSON.stringify(combined));
                } catch (e) {
                    console.warn("localStorage setItem logs denied", e);
                }
                console.log("Seeded 3 months of progressive workouts for Test User successfully!");
            }
        } catch (e) {
            console.error("Seeding operation failed", e);
        }
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
        <div className="bg-ios-bg min-h-screen selection:bg-ios-blue/30 w-full overflow-hidden relative">
            <AnimatePresence mode="wait">
                {!isAppReady ? (
                    <SplashScreen key="splash" setAppReady={setIsAppReady} />
                ) : (
                    <motion.div 
                        key="app-content"
                        className="w-full min-h-screen relative flex flex-col"
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
                                        setActiveUser={handleSetActiveUser}
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
                                    setAppState={setAppState}
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
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex flex-col justify-end safe-area-pb"
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
                                <h3 className="text-[20px] font-extrabold text-white">Chequeo de Bienestar</h3>
                                <p className="text-[13px] text-gray-400 font-medium">Autorregulación fisiológica diaria antes de cargar peso</p>
                                <button 
                                    onClick={() => setShowWellnessCheck(false)}
                                    className="absolute right-0 top-0 text-gray-400 active:text-white"
                                >
                                    <span className="text-sm font-semibold text-ios-pink">Cancelar</span>
                                </button>
                            </div>

                            {/* 1. Sleep Selectors */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-1 block">Calidad de Sueño</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'excellent', label: 'Excelente', desc: '7-8h profundo' },
                                        { key: 'normal', label: 'Regular', desc: 'Sueño leve' },
                                        { key: 'poor', label: 'Insuficiente', desc: '<6h / cansado' }
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
                                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-1 block">Fatiga del SNC / Estrés (Michael BJJ Check)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'fresh', label: 'Fresco / Listo', desc: 'Energía alta' },
                                        { key: 'tired', label: 'Fatiga Leve', desc: 'Entreno previo' },
                                        { key: 'exhausted', label: 'Agotado', desc: 'Sparring duro' }
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
                                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-1 block">Dolor Muscular (DOMS)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'recovered', label: 'Recuperado', desc: 'Sin molestias' },
                                        { key: 'sore', label: 'Agujetas', desc: 'Tensión leve' },
                                        { key: 'very_sore', label: 'Muy Dolorido', desc: 'Fibras rotas' }
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
                                        <strong>Autorregulación Activa:</strong> Sufrirás una reducción sugerida del 10% al 25% en tus cargas sugeridas (Smart Inputs) hoy para proteger la resíntesis de PCr y prevenir sobreentrenamiento del SNC.
                                    </span>
                                </div>
                            )}

                            {/* Start button */}
                            <button
                                onClick={confirmWellnessAndStart}
                                className="w-full py-4 bg-ios-blue text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg shadow-ios-blue/20"
                            >
                                Confirmar y Entrenar Ahora
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
