import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TrainingMode from './components/TrainingMode';
import TimerAlert from './components/TimerAlert';
import EndSplash from './components/EndSplash';

export default function App() {
    const [isAppReady, setIsAppReady] = useState(false);
    const [appState, setAppState] = useState('dashboard');

    // Dashboard State
    const [activeProfile, setActiveProfile] = useState('both');
    const [selectedDay, setSelectedDay] = useState('D1');
    const [activeTab, setActiveTab] = useState('routine'); 

    // Training State
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);

    // Timer Background State (Delta Logic avoiding Interval Freezes)
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [sugarAlertShown, setSugarAlertShown] = useState(false);

    // Request Notifications on App Load
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Delta Time Logic
    useEffect(() => {
        let interval;
        if (isTimerRunning && sessionStartTime) {
            interval = setInterval(() => {
                const diffSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
                setTimer(diffSeconds);
                
                // Trigger background/foreground notification precisely at 60 minutes
                if (diffSeconds >= 3600 && !sugarAlertShown) {
                    setSugarAlertShown(true);
                    triggerSystemNotification();
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
                }
            }, 1000);
        } else if (!isTimerRunning && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, sessionStartTime, sugarAlertShown, timer]);

    const triggerSystemNotification = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new window.Notification("Alerta CoupleFit", {
                body: "¡60 minutos alcanzados! Es hora de revisar los niveles de glucosa e hidratarse.",
                icon: "/pwa-192x192.png",
                vibrate: [200, 100, 200]
            });
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startTraining = () => {
        setAppState('training');
        setCurrentExIndex(0);
        setTimer(0);
        setSessionStartTime(Date.now());
        setCompletedExercises([]);
        setSugarAlertShown(false);
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
        setCompletedExercises([]);
        setSugarAlertShown(false);
    };

    const earlyExit = () => {
        setIsTimerRunning(false);
        setSessionStartTime(null);
        setAppState('dashboard');
        setTimer(0);
        setCompletedExercises([]);
        setSugarAlertShown(false);
    };

    return (
        <div className="bg-ios-bg min-h-screen selection:bg-ios-blue/30 w-full overflow-hidden relative">
            <TimerAlert sugarAlertShown={sugarAlertShown} setSugarAlertShown={setSugarAlertShown} />
            
            {/* Debug fast-forward timer button */}
            {appState === 'training' && (
                <button 
                    onClick={() => setSessionStartTime(Date.now() - 3595000)} 
                    className="fixed top-12 left-0 w-8 h-8 opacity-0 z-[200]" 
                    title="Test 60m Alert"
                />
            )}

            <AnimatePresence mode="wait">
                {!isAppReady ? (
                    <SplashScreen key="splash" setAppReady={setIsAppReady} />
                ) : (
                    <motion.div 
                        key="app-content"
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {appState === 'onboarding' && (
                                <motion.div 
                                    key="onboarding"
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Onboarding setAppState={setAppState} setActiveProfile={setActiveProfile} />
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
                                        appState={appState}
                                        setAppState={setAppState}
                                        startTraining={startTraining}
                                        activeProfile={activeProfile} 
                                        setActiveProfile={setActiveProfile}
                                        selectedDay={selectedDay}
                                        setSelectedDay={setSelectedDay}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                    />
                                </motion.div>
                            )}

                            {appState === 'training' && (
                                <TrainingMode 
                                    key="training"
                                    setAppState={setAppState}
                                    activeProfile={activeProfile}
                                    selectedDay={selectedDay}
                                    timer={timer}
                                    currentExIndex={currentExIndex}
                                    setCurrentExIndex={setCurrentExIndex}
                                    completedExercises={completedExercises}
                                    toggleCurrentExercise={(exId) => {
                                        if (completedExercises.includes(exId)) {
                                            setCompletedExercises(completedExercises.filter(id => id !== exId));
                                        } else {
                                            setCompletedExercises([...completedExercises, exId]);
                                        }
                                        // HAPTIC FEEDBACK (F)
                                        if (navigator.vibrate) navigator.vibrate(50);
                                    }}
                                    endSession={endSession}
                                    earlyExit={earlyExit}
                                    formatTime={formatTime}
                                />
                            )}

                            {appState === 'endsplash' && (
                                <EndSplash key="endsplash" onComplete={finishToDashboard} />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
