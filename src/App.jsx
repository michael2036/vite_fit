import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TrainingMode from './components/TrainingMode';
import TimerAlert from './components/TimerAlert';

export default function App() {
    // App State: 'onboarding' | 'dashboard' | 'training'
    const [appState, setAppState] = useState('onboarding');

    // Dashboard State
    const [activeProfile, setActiveProfile] = useState('both');
    const [selectedDay, setSelectedDay] = useState('A');
    const [activeTab, setActiveTab] = useState('routine'); // 'routine' | 'tips'

    // Training State
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);

    // Timer State - PWA robust (can add localStorage sync here later if needed)
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sugarAlertShown, setSugarAlertShown] = useState(false);

    // Timer Effect
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else if (!isTimerRunning && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    // Alert Logic Check
    useEffect(() => {
        if (timer >= 3600 && !sugarAlertShown) { // Robust flag-driven bounds limit
            setSugarAlertShown(true);
        }
    }, [timer, sugarAlertShown]);

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
        setCompletedExercises([]);
        setSugarAlertShown(false);
        setIsTimerRunning(true);
    };

    const endSession = () => {
        setIsTimerRunning(false);
        setAppState('dashboard');
        setTimer(0);
        setCompletedExercises([]);
        setSugarAlertShown(false);
    };

    const toggleCurrentExercise = () => {
        // Need to import workoutPlan to check ids, but we can pass it or just use an index check
        // We'll pass completed logic to children, but handle state here
    };

    // Derived view render
    return (
        <div className="bg-ios-bg min-h-screen selection:bg-ios-blue/30 w-full overflow-hidden">
            {/* Global Alert Layer */}
            <TimerAlert sugarAlertShown={sugarAlertShown} setSugarAlertShown={setSugarAlertShown} />
            
            {/* Debug fast-forward timer button for testing PRD rules */}
            {appState === 'training' && (
                <button 
                    onClick={() => setTimer(3595)} 
                    className="fixed top-12 left-0 w-8 h-8 opacity-0 z-[200]" 
                    title="Test 60m Alert"
                />
            )}

            {appState === 'onboarding' && (
                <Onboarding 
                    setAppState={setAppState} 
                    setActiveProfile={setActiveProfile} 
                />
            )}

            {appState === 'dashboard' && (
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
            )}

            {appState === 'training' && (
                <TrainingMode 
                    setAppState={setAppState}
                    activeProfile={activeProfile}
                    selectedDay={selectedDay}
                    timer={timer}
                    currentExIndex={currentExIndex}
                    setCurrentExIndex={setCurrentExIndex}
                    completedExercises={completedExercises}
                    toggleCurrentExercise={(exId) => {
                        // Pass toggle logic up safely
                        if (completedExercises.includes(exId)) {
                            setCompletedExercises(completedExercises.filter(id => id !== exId));
                        } else {
                            setCompletedExercises([...completedExercises, exId]);
                        }
                    }}
                    endSession={endSession}
                    formatTime={formatTime}
                />
            )}
        </div>
    );
}
