import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { workoutPlan } from '../data/workoutData';
import { calculateWorkoutScore } from '../utils/scoreCalculator';
import { motion, useAnimation } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import * as workoutStore from '../services/workoutStore';
import { triggerHaptic } from '../utils/haptics';
import ExercisePanel from './training/ExercisePanel';
import SetLogger from './training/SetLogger';
import ExitConfirmDialog from './training/ExitConfirmDialog';

export default function TrainingMode({
    activeUser, selectedDay, timer, currentExIndex, setCurrentExIndex,
    endSession, earlyExit, formatTime, autoRegulationFactor = 1.0, wellnessAssessment = null
}) {
    const { t } = useLanguage();
    const routine = workoutPlan[selectedDay];
    const currentEx = routine[currentExIndex];
    const dayNames = { 'D1': t('day_1_title'), 'D2': t('day_2_title'), 'D3': t('day_3_title') };
    const progress = Math.round(((currentExIndex + 1) / routine.length) * 100);

    const [selectedOptions, setSelectedOptions] = useState({});
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const activeOption = selectedOptions[currentEx.id] || 'primary';

    // Active Exercise Timing
    const exerciseActiveStartRef = useRef(Date.now());
    const [exerciseDurations, setExerciseDurations] = useState({});

    // Transition rest tracking: Measures the time elapsed between exercises
    const lastExExitTimeRef = useRef(Date.now());
    const [exerciseFirstSetLogged, setExerciseFirstSetLogged] = useState({});
    const [totalRestDurations, setTotalRestDurations] = useState({});

    // Dynamic sets logging state
    // Format: { [exId]: [{ setNum: 1, weight: W, reps: R, completed: false }] }
    const [exerciseLogs, setExerciseLogs] = useState({});

    // Read user's history once on load to populate suggestions
    const userHistoryRef = useRef([]);

    useEffect(() => {
        userHistoryRef.current = workoutStore.getLogsForUser(activeUser);
    }, [activeUser]);

    // Helper: Find previous session log for this exercise
    const getPreviousLog = (exId) => {
        const history = userHistoryRef.current;
        for (const log of history) {
            const exLog = log.exercises?.find(e => e.exerciseId === exId);
            if (exLog && exLog.sets && exLog.sets.some(s => s.completed)) {
                return exLog;
            }
        }
        return null;
    };

    // Initialize/Load sets for the current exercise
    useEffect(() => {
        // Save current exercise start time
        exerciseActiveStartRef.current = Date.now();

        // Check if logs are already initialized for this exercise in state
        if (!exerciseLogs[currentEx.id]) {
            const prevLog = getPreviousLog(currentEx.id);
            const targetSetsNum = currentEx.sets.includes('-')
                ? parseInt(currentEx.sets.split('-')[1])
                : parseInt(currentEx.sets);

            const initialSets = [];

            if (prevLog && prevLog.sets && prevLog.sets.length > 0) {
                // If previous log exists, match set count and suggest weights/reps (Smart Inputs)
                prevLog.sets.forEach((prevSet) => {
                    // Apply Autoregulatory Weight Scaling: Scale previous weight down by factor, rounded to nearest 0.5kg
                    const suggestedWeight = Math.round((prevSet.weight * autoRegulationFactor) * 2) / 2;
                    initialSets.push({
                        setNum: prevSet.setNum,
                        weight: suggestedWeight,
                        reps: prevSet.reps,
                        alFallo: prevSet.alFallo !== undefined ? prevSet.alFallo : false,
                        completed: false, // starts fresh
                        isPreviousSuggested: true
                    });
                });
            } else {
                // If no previous log, initialize defaults
                const defaultReps = currentEx.reps.includes('-')
                    ? parseInt(currentEx.reps.split('-')[1])
                    : parseInt(currentEx.reps) || 10;

                for (let i = 1; i <= targetSetsNum; i++) {
                    initialSets.push({
                        setNum: i,
                        weight: 0,
                        reps: defaultReps,
                        alFallo: false, // default no fallo
                        completed: false,
                        isPreviousSuggested: false
                    });
                }
            }

            setExerciseLogs(prev => ({
                ...prev,
                [currentEx.id]: initialSets
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- must run only on exercise navigation; including exerciseLogs here would reset exerciseActiveStartRef on every set edit
    }, [currentExIndex, currentEx.id]);

    const activeSets = exerciseLogs[currentEx.id] || [];
    const prevLogForCurrentEx = getPreviousLog(currentEx.id);

    const controls = useAnimation();

    useEffect(() => {
        controls.start({ x: 0, y: 0, transition: { duration: 0.35, ease: 'easeOut' } });
    }, [controls]);

    const handleExit = async () => {
        triggerHaptic(20);
        await controls.start({ y: '100%', transition: { duration: 0.3, ease: 'easeIn' } });
        earlyExit();
    };

    // Save exercise active duration before sliding
    const saveActiveExerciseDuration = () => {
        const timeSpent = Math.floor((Date.now() - exerciseActiveStartRef.current) / 1000);
        setExerciseDurations(prev => ({
            ...prev,
            [currentEx.id]: (prev[currentEx.id] || 0) + timeSpent
        }));
    };

    const handleNext = () => {
        saveActiveExerciseDuration();
        triggerHaptic();
        lastExExitTimeRef.current = Date.now(); // Record transition exit time
        setCurrentExIndex(Math.min(routine.length - 1, currentExIndex + 1));
    };

    const handlePrev = () => {
        saveActiveExerciseDuration();
        triggerHaptic();
        lastExExitTimeRef.current = Date.now(); // Record transition exit time
        setCurrentExIndex(Math.max(0, currentExIndex - 1));
    };

    // Set Logging Action Helpers
    const updateSetField = (idx, field, value) => {
        setExerciseLogs(prev => {
            const sets = [...prev[currentEx.id]];
            sets[idx] = { ...sets[idx], [field]: value };
            return { ...prev, [currentEx.id]: sets };
        });
    };

    const addSet = () => {
        triggerHaptic(20);
        setExerciseLogs(prev => {
            const sets = prev[currentEx.id] ? [...prev[currentEx.id]] : [];
            const nextNum = sets.length + 1;
            const lastSet = sets[sets.length - 1];
            sets.push({
                setNum: nextNum,
                weight: lastSet ? lastSet.weight : 0,
                reps: lastSet ? lastSet.reps : 10,
                alFallo: lastSet && lastSet.alFallo !== undefined ? lastSet.alFallo : false,
                completed: false,
                isPreviousSuggested: false
            });
            return { ...prev, [currentEx.id]: sets };
        });
    };

    const removeSet = () => {
        triggerHaptic(20);
        setExerciseLogs(prev => {
            const sets = prev[currentEx.id] ? [...prev[currentEx.id]] : [];
            if (sets.length > 1) {
                sets.pop();
            }
            return { ...prev, [currentEx.id]: sets };
        });
    };

    // Toggle set complete checkbox & calculate transition rest time
    const handleSetToggle = (idx) => {
        const targetSet = activeSets[idx];
        const newCompleted = !targetSet.completed;

        updateSetField(idx, 'completed', newCompleted);
        triggerHaptic(newCompleted ? [40, 30] : 20);

        // Transition rest duration: on first completed set, calculate the elapsed rest time between exercises!
        if (newCompleted && !exerciseFirstSetLogged[currentEx.id]) {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - lastExExitTimeRef.current) / 1000));

            setTotalRestDurations(tr => ({ ...tr, [currentEx.id]: elapsedSeconds }));
            setExerciseFirstSetLogged(prev => ({ ...prev, [currentEx.id]: true }));
        }
    };

    const handleFinish = () => {
        saveActiveExerciseDuration();
        triggerHaptic([30, 50, 30]);

        const finalExercises = routine.map(ex => {
            const sets = exerciseLogs[ex.id] || [];
            return {
                exerciseId: ex.id,
                exerciseName: ex.name,
                category: ex.category,
                selectedOption: selectedOptions[ex.id] || 'primary',
                sets: sets.map(s => ({
                    setNum: s.setNum,
                    weight: Number(s.weight) || 0,
                    reps: Number(s.reps) || 0,
                    alFallo: !!s.alFallo,
                    completed: s.completed
                })),
                duration: exerciseDurations[ex.id] || 0,
                restDuration: totalRestDurations[ex.id] || 0
            };
        });

        const finalSession = {
            id: `session-${Date.now()}`,
            user: activeUser,
            day: selectedDay,
            dayName: dayNames[selectedDay],
            date: new Date().toISOString(),
            duration: timer,
            exercises: finalExercises
        };

        const result = calculateWorkoutScore(finalSession, userHistoryRef.current);
        finalSession.score = result.score;
        finalSession.tonnage = result.currentTonnage;

        workoutStore.saveSession(finalSession);
        endSession();
    };

    return (
        <motion.div
            initial={{ y: '100%', x: 0 }}
            animate={controls}
            exit={{ y: '100%', transition: { duration: 0.3 } }}
            className="absolute inset-0 bg-ios-bg z-50 text-white font-sans flex flex-col safe-area-pt overflow-hidden"
        >
            {/* Top Navigation */}
            <header className="px-4 py-2 flex justify-between items-center bg-ios-bg/90 backdrop-blur-md shrink-0">
                <button
                    onClick={() => { triggerHaptic(20); setShowExitConfirm(true); }}
                    className="text-ios-blue flex items-center gap-1 active:opacity-70 text-[17px] font-medium"
                    aria-label="End Session and return to Home"
                >
                    <ChevronLeft size={24} className="-ml-2" />
                    {t('cancel')}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[12px] font-semibold tracking-wider text-gray-400 uppercase">{dayNames[selectedDay]}</span>
                    <span className="font-mono text-[17px] font-bold text-white mt-0.5">
                        {formatTime(timer)}
                    </span>
                </div>
                <div className="w-16"></div>
            </header>

            <div className="w-full bg-[#1C1C1E] h-1 shrink-0">
                <div className="bg-ios-blue h-1 transition-all duration-300 rounded-r-full" style={{ width: `${progress}%` }}></div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 mt-4 relative max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <ExercisePanel
                        currentEx={currentEx}
                        currentExIndex={currentExIndex}
                        routineLength={routine.length}
                        activeUser={activeUser}
                        activeOption={activeOption}
                        onSelectOption={(option) => setSelectedOptions(prev => ({ ...prev, [currentEx.id]: option }))}
                    />
                    <SetLogger
                        currentEx={currentEx}
                        activeSets={activeSets}
                        prevLog={prevLogForCurrentEx}
                        autoRegulationFactor={autoRegulationFactor}
                        wellnessAssessment={wellnessAssessment}
                        updateSetField={updateSetField}
                        handleSetToggle={handleSetToggle}
                        addSet={addSet}
                        removeSet={removeSet}
                    />
                </div>
            </main>

            {/* Bottom Nav Bar - iOS Sticky ToolBar */}
            <footer className="shrink-0 bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-8 safe-area-pb z-40 relative">
                <div className="max-w-lg mx-auto flex justify-between items-center gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentExIndex === 0}
                        className="p-3 bg-[#2C2C2E] rounded-full disabled:opacity-30 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-white outline-none shrink-0"
                        aria-label="Previous Exercise"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {currentExIndex === routine.length - 1 ? (
                        <button
                            onClick={handleFinish}
                            className="flex-1 py-3.5 bg-ios-green text-white rounded-[20px] font-bold text-[17px] active:scale-[0.98] transition-transform text-center shadow-lg shadow-ios-green/20"
                        >
                            {t('train_finish')}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex-1 py-3.5 bg-ios-blue text-white rounded-[20px] font-bold text-[17px] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-ios-blue/20"
                        >
                            {t('train_next')}
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={currentExIndex === routine.length - 1}
                        className="p-3 bg-[#2C2C2E] rounded-full disabled:opacity-30 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-white outline-none shrink-0"
                        aria-label="Next Exercise"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </footer>

            {showExitConfirm && (
                <ExitConfirmDialog
                    onContinue={() => setShowExitConfirm(false)}
                    onExit={async () => { setShowExitConfirm(false); await handleExit(); }}
                />
            )}
        </motion.div>
    );
}
