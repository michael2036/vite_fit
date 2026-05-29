import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Plus, Minus, RotateCcw } from 'lucide-react';
import { workoutPlan } from '../data/workoutData';
import { calculateWorkoutScore } from '../utils/scoreCalculator';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
        ? `https://www.youtube.com/embed/${match[2]}` 
        : null;
};

export default function TrainingMode({ 
    setAppState, activeUser, selectedDay, timer, currentExIndex, setCurrentExIndex, 
    endSession, earlyExit, formatTime, autoRegulationFactor = 1.0, wellnessAssessment = null
}) {
    const routine = workoutPlan[selectedDay];
    const currentEx = routine[currentExIndex];
    const dayNames = { 'D1': 'Titán', 'D2': 'Encélado', 'D3': 'Mimas' };
    const progress = Math.round(((currentExIndex + 1) / routine.length) * 100);

    const [selectedOptions, setSelectedOptions] = useState({});
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
        try {
            const rawLogs = localStorage.getItem('vitefit_workout_logs');
            if (rawLogs) {
                const parsed = JSON.parse(rawLogs);
                userHistoryRef.current = parsed.filter(log => log.user === activeUser);
            }
        } catch (e) {
            console.error("Failed to load history inside training", e);
        }
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
                prevLog.sets.forEach((prevSet, idx) => {
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
    }, [currentExIndex, currentEx.id]);

    const activeSets = exerciseLogs[currentEx.id] || [];

    const getOptionLabels = () => {
        // Warmups
        if (currentEx.id === 'D1-WU') return { primary: 'Cinta / Elíptica', alternative: 'Bicicleta Estática / Bandas' };
        if (currentEx.id === 'D2-WU') return { primary: 'Cinta / Elíptica', alternative: 'Bicicleta Estática / Bandas' };
        if (currentEx.id === 'D3-WU') return { primary: 'Cinta / Elíptica', alternative: 'Bicicleta Estática / Bandas' };

        // D1
        if (currentEx.id === 'D1-1') return { primary: 'Sentadilla Copa/Barra', alternative: 'Prensa de Piernas' };
        if (currentEx.id === 'D1-2') return { primary: 'TRX / Remo Barra', alternative: 'Remo en Máquina' };
        if (currentEx.id === 'D1-3') return { primary: 'Split Squat Manc.', alternative: 'Prensa Unilateral' };
        if (currentEx.id === 'D1-4') return { primary: 'Press Hombro Barra/Manc.', alternative: 'Prensa de Hombro' };
        if (currentEx.id === 'D1-5') return { primary: 'Curl Fitball', alternative: 'Leg Curl Sentado' };
        if (currentEx.id === 'D1-6') return { primary: 'Mancuerna Nuca / Barra', alternative: 'Extensión de Tríceps Polea' };
        if (currentEx.id === 'D1-8') return { primary: 'Supermans', alternative: 'Extensión Lumbar Máquina' };

        // D2
        if (currentEx.id === 'D2-1') return { primary: 'Press Banca Barra/Manc.', alternative: 'Prensa de Pecho' };
        if (currentEx.id === 'D2-2') return { primary: 'Zancada Libre Manc./Barra', alternative: 'Sentadilla Multipower' };
        if (currentEx.id === 'D2-3') return { primary: 'Pájaros Mancuerna', alternative: 'Pec Deck Invertido' };
        if (currentEx.id === 'D2-4') return { primary: 'Hip Thrust Barra/Discos', alternative: 'Hip Thrust en Máquina' };
        if (currentEx.id === 'D2-5') return { primary: 'Cosaca Mancuerna', alternative: 'Máquina Aductora' };
        if (currentEx.id === 'D2-6') return { primary: 'Lateral Mancuernas', alternative: 'Elevación Lateral Polea' };
        if (currentEx.id === 'D2-7') return { primary: 'Rotación Banda', alternative: 'Rotación en Polea' };

        // D3
        if (currentEx.id === 'D3-1') return { primary: 'Peso Muerto Barra/Discos', alternative: 'Hiperextensión 45°' };
        if (currentEx.id === 'D3-2') return { primary: 'Dominadas', alternative: 'Jalón Pecho Polea' };
        if (currentEx.id === 'D3-3') return { primary: 'Subida Cajón Manc.', alternative: 'Zancadas Multipower' };
        if (currentEx.id === 'D3-4') return { primary: 'Press Inclinado Barra/Manc.', alternative: 'Prensa Pecho Inclinada' };
        if (currentEx.id === 'D3-5') return { primary: 'Curtsy Lunge Manc.', alternative: 'Patada Glúteo Polea' };
        if (currentEx.id === 'D3-6') return { primary: 'Curl Mancuernas/Barra', alternative: 'Máquina de Bíceps' };
        if (currentEx.id === 'D3-8') return { primary: 'Tuck Ups Abdomen', alternative: 'Máquina Crunch Abdominal' };

        return { primary: 'Peso Libre (Barra/Manc.)', alternative: 'Máquina / Polea' };
    };

    const labels = getOptionLabels();
    const activeVideoUrl = activeOption === 'primary' ? currentEx.videoUrl : (currentEx.videoUrlAlternative || currentEx.videoUrl);
    const embedUrl = getYoutubeEmbedUrl(activeVideoUrl);

    const controls = useAnimation();

    // Native iOS Swipe-to-dismiss gesture
    const bind = useDrag(({ movement: [mx, my], velocity: [vx, vy], down, active }) => {
        const dist = Math.max(mx, my);
        const vel = Math.max(vx, vy);
        
        if (dist > window.innerWidth / 3 || (vel > 1.2 && dist > 50)) {
            if (!active) {
                if (mx > my) {
                    controls.start({ x: window.innerWidth, transition: { duration: 0.2 } }).then(() => earlyExit());
                } else {
                    controls.start({ y: window.innerHeight, transition: { duration: 0.2 } }).then(() => earlyExit());
                }
            }
        } else {
            controls.start({ 
                x: down && mx > my ? Math.max(0, mx) : 0, 
                y: down && my > mx ? Math.max(0, my) : 0, 
                transition: { type: 'spring', bounce: 0, duration: 0.4 } 
            });
        }
    }, { filterTaps: true, axis: 'lock' });

    useEffect(() => {
        controls.start({ x: 0, y: 0, transition: { duration: 0.35, ease: 'easeOut' } });
    }, [controls]);

    const handleExit = async () => {
        try {
            if (navigator.vibrate) navigator.vibrate(20);
        } catch (e) {
            console.warn("Haptics blocked", e);
        }
        await controls.start({ y: '100%', transition: { duration: 0.3, ease: 'easeIn' } });
        earlyExit();
    };

    const triggerHaptic = (duration = 30) => {
        try {
            if (navigator.vibrate) navigator.vibrate(duration);
        } catch (e) {
            console.warn("Haptics blocked", e);
        }
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
            sets[idx] = {
                ...sets[idx],
                [field]: value
            };
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
            
            setTotalRestDurations(tr => ({
                ...tr,
                [currentEx.id]: elapsedSeconds
            }));

            setExerciseFirstSetLogged(prev => ({
                ...prev,
                [currentEx.id]: true
            }));
        }
    };

    const handleFinish = () => {
        saveActiveExerciseDuration();
        triggerHaptic([30, 50, 30]);

        // 1. Compile exercise logs format
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
                    alFallo: !!s.alFallo, // persist logged alFallo boolean
                    completed: s.completed
                })),
                duration: exerciseDurations[ex.id] || 0,
                restDuration: totalRestDurations[ex.id] || 0
            };
        });

        // 2. Build session object
        const finalSession = {
            id: `session-${Date.now()}`,
            user: activeUser,
            day: selectedDay,
            dayName: dayNames[selectedDay],
            date: new Date().toISOString(),
            duration: timer,
            exercises: finalExercises
        };

        // 3. Compute consolidated Score using algorithm
        // Feed the loaded user history
        const result = calculateWorkoutScore(finalSession, userHistoryRef.current);
        finalSession.score = result.score;
        finalSession.tonnage = result.currentTonnage;

        // 4. Persistence - Retrieve, Push, Save
        try {
            const rawLogs = localStorage.getItem('vitefit_workout_logs');
            const allLogs = rawLogs ? JSON.parse(rawLogs) : [];
            allLogs.unshift(finalSession); // add to top
            localStorage.setItem('vitefit_workout_logs', JSON.stringify(allLogs));
        } catch (e) {
            console.error("Failed to save workout session to localStorage", e);
        }

        // 5. Exit to endsplash
        endSession();
    };

    return (
        <motion.div 
            {...bind()}
            initial={{ y: '100%', x: 0 }}
            animate={controls}
            exit={{ y: '100%', transition: { duration: 0.3 } }}
            className="fixed inset-0 bg-ios-bg z-50 text-white font-sans flex flex-col safe-area-pt touch-pan-y overflow-hidden"
            style={{ touchAction: 'pan-y' }}
        >
            {/* iOS Modal Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mt-2 mb-1 cursor-grab active:cursor-grabbing"></div>
            
            {/* Top Navigation */}
            <header className="px-4 py-2 flex justify-between items-center bg-ios-bg/90 backdrop-blur-md shrink-0">
                <button 
                    onClick={handleExit} 
                    className="text-ios-blue flex items-center gap-1 active:opacity-70 text-[17px] font-medium"
                    aria-label="End Session and return to Home"
                >
                    <ChevronLeft size={24} className="-ml-2"/>
                    Fin
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[12px] font-semibold tracking-wider text-gray-400 uppercase">{dayNames[selectedDay]}</span>
                    <span className="font-mono text-[17px] font-bold text-white mt-0.5">
                        {formatTime(timer)}
                    </span>
                </div>
                <div className="w-16"></div> {/* Spacer for centering */}
            </header>

            {/* Progress Bar iOS style */}
            <div className="w-full bg-[#1C1C1E] h-1 shrink-0">
                <div className="bg-ios-blue h-1 transition-all duration-300 rounded-r-full" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Main Content Scroll Container */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 mt-4 relative">
                
                {/* Exercise Description and Header */}
                <div className="text-center mb-4 max-w-lg mx-auto">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        {currentExIndex + 1} DE {routine.length}
                    </p>
                    <h2 className="text-[25px] font-extrabold leading-tight mb-1 text-white">{currentEx.name}</h2>
                    <p className="text-[14px] text-ios-blue font-semibold mb-1">{currentEx.category}</p>
                    <p className="text-[13px] text-gray-400 mb-3">Equipamiento: {currentEx.sharedEquipment}</p>
                    
                    {/* Progression Personalised Note scoped specifically to Michael / Lina */}
                    {currentEx.progressionNotes && currentEx.progressionNotes[activeUser] && (
                        <div className="bg-ios-card/40 border border-white/5 rounded-xl p-3 mb-3 text-left max-w-lg mx-auto">
                            <span className="text-[11px] font-bold text-ios-blue uppercase tracking-wider block mb-0.5">Sugerencia Técnica ({activeUser})</span>
                            <span className="text-[13px] text-gray-300 leading-tight">{currentEx.progressionNotes[activeUser]}</span>
                        </div>
                    )}
                    
                    <p className="text-[14px] text-gray-300 leading-relaxed px-2">{currentEx.description}</p>
                </div>

                {/* Direct Video Tutorials (Embedded) */}
                {currentEx.hasAlternative && (
                    <div className="flex justify-center gap-2 mb-3 max-w-lg mx-auto" role="tablist">
                        <button
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [currentEx.id]: 'primary' }))}
                            role="tab"
                            aria-selected={activeOption === 'primary'}
                            className={`px-4 py-1 rounded-full text-[11px] font-bold transition-all ${
                                activeOption === 'primary' 
                                    ? 'bg-ios-blue text-white shadow-sm' 
                                    : 'bg-[#2C2C2E] text-gray-400 hover:text-white'
                            }`}
                        >
                            {labels.primary}
                        </button>
                        <button
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [currentEx.id]: 'alternative' }))}
                            role="tab"
                            aria-selected={activeOption === 'alternative'}
                            className={`px-4 py-1 rounded-full text-[11px] font-bold transition-all ${
                                activeOption === 'alternative' 
                                    ? 'bg-ios-pink text-white shadow-sm' 
                                    : 'bg-[#2C2C2E] text-gray-400 hover:text-white'
                            }`}
                        >
                            {labels.alternative}
                        </button>
                    </div>
                )}

                {embedUrl ? (
                    <div className="w-full aspect-video rounded-[20px] overflow-hidden mb-4 bg-black border border-white/10 relative shadow-inner max-w-lg mx-auto">
                        <iframe
                            src={embedUrl}
                            title={currentEx.name}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="w-full aspect-video rounded-[20px] overflow-hidden mb-4 bg-[#1C1C1E]/50 border border-white/10 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
                        <span className="text-[32px] mb-2 select-none">📱</span>
                        <span className="text-[14px] font-bold text-white mb-1">Demostración en Video</span>
                        <p className="text-[12px] text-gray-400 mb-4 px-4 leading-snug">
                            Mira una demostración rápida y explicativa en formato vertical directamente en YouTube Shorts.
                        </p>
                        <a 
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent((activeOption === 'primary' ? currentEx.name : (labels.alternative || currentEx.name)) + ' shorts')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/20 active:scale-95 text-decoration-none"
                        >
                            Buscar en YouTube Shorts
                        </a>
                    </div>
                )}

                {/* -------------------- DYNAMIC SPORTS-SCIENCE AUTOREGULATION ALERT BANNER -------------------- */}
                {autoRegulationFactor < 1.0 && (
                    <div className="max-w-lg mx-auto bg-purple-500/10 border border-purple-500/25 rounded-[20px] p-4 mb-4 text-[13px] leading-normal flex items-start gap-3 shadow-lg shadow-purple-500/5 animate-in fade-in slide-in-from-bottom duration-300">
                        <span className="text-[18px] select-none">📉</span>
                        <div>
                            <span className="font-extrabold text-purple-400 block mb-0.5">Autorregulación Fisiológica Activa ({Math.round(autoRegulationFactor * 100)}%)</span>
                            <span className="text-gray-300">
                                Debido a tu descanso de hoy ({wellnessAssessment?.sleep === 'poor' ? 'Sueño deficiente' : 'Sueño regular'}, {wellnessAssessment?.cns === 'exhausted' ? 'SNC agotado (BJJ)' : wellnessAssessment?.cns === 'tired' ? 'SNC fatigado' : 'SNC listo'}, y {wellnessAssessment?.soreness === 'very_sore' ? 'agujetas severas' : wellnessAssessment?.soreness === 'sore' ? 'agujetas leves' : 'musculatura recuperada'}), se sugiere reducir tus cargas anteriores un <strong>{Math.round((1 - autoRegulationFactor) * 100)}%</strong>. Las sugerencias inteligentes abajo ya han sido recalculadas.
                            </span>
                        </div>
                    </div>
                )}

                {/* -------------------- SETS & REPS LOGGING INTERFACE -------------------- */}
                <div className="max-w-lg mx-auto bg-ios-card rounded-[22px] overflow-hidden p-4 shadow-xl border border-white/5 mb-6">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <span className="text-[15px] font-bold text-white flex items-center gap-1.5">
                            Historial y Registro
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={addSet}
                                className="px-2.5 py-1 bg-[#2C2C2E] text-white rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                <Plus size={14}/> Serie
                            </button>
                            <button 
                                onClick={removeSet}
                                className="px-2.5 py-1 bg-[#2C2C2E] text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                <Minus size={14}/> Serie
                            </button>
                        </div>
                    </div>

                    {/* Table Headers */}
                    {currentEx.measurementType === 'time' ? (
                        <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-gray-500 uppercase pb-2 px-1">
                            <div className="col-span-1 text-center">Ser</div>
                            <div className="col-span-2 text-center">Prev</div>
                            <div className="col-span-5 text-center">Duración</div>
                            <div className="col-span-2 text-center">Fallo</div>
                            <div className="col-span-2 text-center">Log</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-gray-500 uppercase pb-2 px-1">
                            <div className="col-span-1 text-center">Ser</div>
                            <div className="col-span-2 text-center">Prev</div>
                            <div className="col-span-3 text-center">Peso (kg)</div>
                            <div className="col-span-2 text-center">Reps</div>
                            <div className="col-span-2 text-center">Fallo</div>
                            <div className="col-span-2 text-center">Log</div>
                        </div>
                    )}

                    {/* Table Rows */}
                    <div className="space-y-2">
                        {activeSets.map((set, idx) => {
                            const prevLog = getPreviousLog(currentEx.id);
                            const prevSet = prevLog?.sets?.[idx];
                            
                            const formatTimeVal = (sec) => {
                                if (sec >= 60) return `${Math.floor(sec / 60)}m`;
                                return `${sec}s`;
                            };

                            // Displays original absolute weights or time in Previo history tag
                            const prevSuggestionText = prevSet 
                                ? (currentEx.measurementType === 'time' ? formatTimeVal(prevSet.reps) : `${prevSet.weight}k × ${prevSet.reps}`) 
                                : '—';

                            return (
                                <div 
                                    key={idx} 
                                    className={`grid grid-cols-12 gap-1 items-center py-2 px-1 rounded-xl transition-colors ${
                                        set.completed ? 'bg-ios-green/10 border border-ios-green/20' : 'bg-[#2C2C2E]/40 border border-transparent'
                                    }`}
                                >
                                    {/* Set Number */}
                                    <div className="col-span-1 text-center">
                                        <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center mx-auto ${
                                            set.completed ? 'bg-ios-green text-white' : 'bg-[#2C2C2E] text-gray-300'
                                        }`}>
                                            {set.setNum}
                                        </span>
                                    </div>

                                    {/* Previous Target Suggestion (Smart Inputs) */}
                                    <div className="col-span-2 text-center text-[10px] font-bold text-gray-400 tracking-tight leading-none select-none">
                                        {prevSuggestionText}
                                    </div>

                                    {currentEx.measurementType === 'time' ? (
                                        /* Time Duration Input Box with Quick Add/Sub buttons */
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
                                            {/* Weight Input Box with Quick Add/Sub buttons */}
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

                                            {/* Reps Input */}
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

                                    {/* Fallo Checkbox Indicator (iOS style Failure check) */}
                                    <div className="col-span-2 flex items-center justify-center px-0.5">
                                        <button
                                            onClick={() => updateSetField(idx, 'alFallo', !set.alFallo)}
                                            disabled={set.completed}
                                            className={`w-6 h-6 rounded border transition-all active:scale-90 flex items-center justify-center ${
                                                set.alFallo 
                                                    ? 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-500/30' 
                                                    : 'border-white/20 text-transparent bg-[#1C1C1E]'
                                            }`}
                                            title="Fallo muscular"
                                        >
                                            <span className="text-[10px] font-extrabold select-none leading-none">F</span>
                                        </button>
                                    </div>

                                    {/* Completed Circle Toggle */}
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
                            Finalizar Sesión
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex-1 py-3.5 bg-ios-blue text-white rounded-[20px] font-bold text-[17px] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-ios-blue/20"
                        >
                            Siguiente Ejercicio
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
        </motion.div>
    );
}
