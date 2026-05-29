import React, { useState, useMemo } from 'react';
import { Dumbbell, Activity, Calendar, Play, BookOpen, LogOut, ChevronDown, ChevronUp, Clock, Award, TrendingUp, Settings, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';
import { workoutPlan, expertTips } from '../data/workoutData';
import { calculateWorkoutScore } from '../utils/scoreCalculator';

export default function Dashboard({ 
    setAppState, startTraining, activeUser, setActiveUser, selectedDay, setSelectedDay, activeTab, setActiveTab 
}) {
    // Dropdown selection for exercise analytics
    const [selectedExId, setSelectedExId] = useState('D1-1');
    // History log item expansion
    const [expandedLogId, setExpandedLogId] = useState(null);

    // Settings view state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [editDate, setEditDate] = useState('');
    const [editDuration, setEditDuration] = useState(0);
    const [editExercises, setEditExercises] = useState([]);
    const [dummyUpdate, setDummyUpdate] = useState(0);

    const isTimeEx = (exId) => {
        if (exId?.includes('WU')) return true;
        for (const day of ['D1', 'D2', 'D3']) {
            const found = workoutPlan[day]?.find(e => e.id === exId);
            if (found?.measurementType === 'time') return true;
        }
        return false;
    };

    // Safeguard haptic feedback across devices/browsers
    const triggerHaptic = (duration = 20) => {
        try {
            if (navigator.vibrate) navigator.vibrate(duration);
        } catch (e) {
            console.warn("Haptics blocked:", e);
        }
    };

    // settings and edit operations
    const handleDeleteSession = (sessionId) => {
        triggerHaptic(35);
        if (!window.confirm("¿Estás seguro de que deseas borrar este entrenamiento de tu historial?")) return;
        try {
            const rawLogs = localStorage.getItem('vitefit_workout_logs');
            if (rawLogs) {
                const allLogs = JSON.parse(rawLogs);
                const filtered = allLogs.filter(log => log.id !== sessionId);
                localStorage.setItem('vitefit_workout_logs', JSON.stringify(filtered));
                if (editingSession?.id === sessionId) {
                    setEditingSession(null);
                }
                triggerHaptic([40, 30]);
            }
        } catch (e) {
            console.error("Failed to delete session", e);
        }
    };

    const handleStartEditSession = (session) => {
        triggerHaptic(20);
        setEditingSession(session);
        // Format ISO date string into 'YYYY-MM-DDTHH:MM' for datetime-local input
        const localDate = new Date(session.date);
        const tzOffset = localDate.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = new Date(localDate - tzOffset).toISOString().slice(0, 16);
        
        setEditDate(localISOTime);
        setEditDuration(Math.round(session.duration / 60));
        setEditExercises(JSON.parse(JSON.stringify(session.exercises || []))); // deep copy
    };

    const handleSaveEditedSession = () => {
        triggerHaptic(30);
        if (!editingSession) return;
        try {
            const rawLogs = localStorage.getItem('vitefit_workout_logs');
            if (rawLogs) {
                const allLogs = JSON.parse(rawLogs);
                const updatedLogs = allLogs.map(log => {
                    if (log.id === editingSession.id) {
                        const updatedSession = {
                            ...log,
                            date: new Date(editDate).toISOString(),
                            duration: editDuration * 60,
                            exercises: editExercises
                        };
                        
                        // Recalculate score and tonnage based on historical logs
                        const otherLogs = allLogs.filter(l => l.id !== editingSession.id && l.user === activeUser);
                        const scoreResult = calculateWorkoutScore(updatedSession, otherLogs);
                        
                        updatedSession.score = scoreResult.score;
                        updatedSession.tonnage = scoreResult.currentTonnage;
                        
                        return updatedSession;
                    }
                    return log;
                });

                localStorage.setItem('vitefit_workout_logs', JSON.stringify(updatedLogs));
                setEditingSession(null);
                triggerHaptic([40, 50]);
            }
        } catch (e) {
            console.error("Failed to save edited session", e);
        }
    };

    const handleUpdateEditExerciseSet = (exIdx, setIdx, field, val) => {
        setEditExercises(prev => {
            const copy = [...prev];
            const ex = { ...copy[exIdx] };
            const sets = [...ex.sets];
            sets[setIdx] = {
                ...sets[setIdx],
                [field]: val
            };
            ex.sets = sets;
            copy[exIdx] = ex;
            return copy;
        });
    };

    // Color theme based on activeUser
    const userTheme = useMemo(() => {
        if (activeUser === 'michael') return { primary: 'text-ios-blue', bg: 'bg-ios-blue', border: 'border-ios-blue/20', glow: 'shadow-ios-blue/10' };
        if (activeUser === 'lina') return { primary: 'text-ios-pink', bg: 'bg-ios-pink', border: 'border-ios-pink/20', glow: 'shadow-ios-pink/10' };
        return { primary: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' };
    }, [activeUser]);

    const userNames = {
        michael: 'Michael',
        lina: 'Lina',
        test: 'Usuario Demo'
    };

    // Load logs for the active user from localStorage
    const logs = useMemo(() => {
        try {
            const rawLogs = localStorage.getItem('vitefit_workout_logs');
            if (!rawLogs) return [];
            const parsed = JSON.parse(rawLogs);
            return parsed.filter(log => log.user === activeUser);
        } catch (e) {
            console.error("Failed to parse logs in dashboard", e);
            return [];
        }
    }, [activeUser, activeTab]); // reload on tab switch or mount

    // Retrieve last workout score & tonnage metrics
    const summaryMetrics = useMemo(() => {
        if (logs.length === 0) return { lastScore: 0, lastTonnage: 0, totalWorkouts: 0, trend: 'N/A' };
        const lastSession = logs[0];
        
        // Calculate total tonnage for last session if not explicitly stored
        let lastTonnage = lastSession.tonnage || 0;
        if (lastTonnage === 0 && lastSession.exercises) {
            lastSession.exercises.forEach(ex => {
                ex.sets?.forEach(s => {
                    if (s.completed) lastTonnage += (s.weight || 0) * (s.reps || 0);
                });
            });
        }

        // Determine trend
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

        // 1. Calculate Progressive Overload Streak
        let overloadStreak = 0;
        const sortedLogs = [...logs].reverse(); // chronological
        const runningTonnagePerDay = { D1: 0, D2: 0, D3: 0 };
        
        sortedLogs.forEach(session => {
            const day = session.day;
            // Compute tonnage
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

        // 2. GLUT4 Translocation Activation % (Glycogen clearance stimulated by skeletal muscle contraction)
        const lastSession = logs[0];
        let lastTonnage = lastSession.tonnage || 0;
        if (lastTonnage === 0 && lastSession.exercises) {
            lastSession.exercises.forEach(ex => {
                ex.sets?.forEach(s => {
                    if (s.completed) lastTonnage += (s.weight || 0) * (s.reps || 0);
                });
            });
        }
        // An intermediate session target is 7500kg total tonnage
        const glut4Index = Math.min(100, Math.round((lastTonnage / 7500) * 100));

        // 3. Central Nervous System (CNS) Fatigue Recovery Estimate %
        let cnsRecovery = 95;
        if (lastSession.duration > 0) {
            const durationMins = lastSession.duration / 60;
            // penalty for exceeding 55m active duration (metabolic/nervous fatigue)
            const durationPenalty = Math.max(0, durationMins - 55) * 0.7;
            const scorePenalty = Math.max(0, 95 - (lastSession.score || 95)) * 0.4;
            cnsRecovery = Math.max(45, Math.round(100 - durationPenalty - scorePenalty));
        }

        return {
            overloadStreak,
            glut4Index,
            cnsRecovery
        };
    }, [logs]);

    // Flat list of all 24 exercises for the exercise selector dropdown
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
        // Loop chronological order (oldest first to draw charts left-to-right)
        [...logs].reverse().forEach(session => {
            const exLog = session.exercises?.find(e => e.exerciseId === selectedExId);
            if (exLog && exLog.sets && exLog.sets.some(s => s.completed)) {
                // Find Max Weight
                let maxWeight = 0;
                let volume = 0;
                exLog.sets.forEach(s => {
                    if (s.completed) {
                        if (s.weight > maxWeight) maxWeight = s.weight;
                        volume += (s.weight || 0) * (s.reps || 0);
                    }
                });
                
                history.push({
                    date: new Date(session.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
                    maxWeight,
                    volume,
                    score: session.score || 0
                });
            }
        });
        return history;
    }, [logs, selectedExId]);

    // Overall scoring trend data (last 15 sessions, chronological)
    const scoreTrendData = useMemo(() => {
        return [...logs]
            .slice(0, 15)
            .reverse()
            .map(session => ({
                date: new Date(session.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
                score: session.score || 0
            }));
    }, [logs]);

    const handleLogout = () => {
        if (navigator.vibrate) navigator.vibrate(30);
        setAppState('login');
    };

    // --- CUSTOM SVG CHARTS RENDER FUNCTIONS ---

    // 1. Max Weight Progress Line Chart (SVG)
    const renderMaxWeightChart = () => {
        const data = exerciseHistoryData;
        if (data.length === 0) {
            return (
                <div className="h-44 flex flex-col items-center justify-center text-gray-500 bg-[#2C2C2E]/30 rounded-2xl border border-white/5">
                    <Dumbbell size={32} className="opacity-30 mb-2"/>
                    <span className="text-xs">Sin registros de este ejercicio</span>
                </div>
            );
        }

        const width = 380;
        const height = 180;
        const paddingLeft = 35;
        const paddingRight = 15;
        const paddingTop = 20;
        const paddingBottom = 25;

        const maxVal = Math.max(...data.map(d => d.maxWeight), 10);
        const minVal = Math.min(...data.map(d => d.maxWeight), 0);
        const range = maxVal - minVal || 1;

        const getX = (index) => {
            if (data.length <= 1) return paddingLeft + (width - paddingLeft - paddingRight) / 2;
            return paddingLeft + (index / (data.length - 1)) * (width - paddingLeft - paddingRight);
        };

        const getY = (value) => {
            return height - paddingBottom - ((value - minVal) / range) * (height - paddingTop - paddingBottom);
        };

        // Draw Line Path
        let pathD = '';
        data.forEach((d, idx) => {
            const x = getX(idx);
            const y = getY(d.maxWeight);
            if (idx === 0) pathD = `M ${x} ${y}`;
            else pathD += ` L ${x} ${y}`;
        });

        // Area under line
        let areaD = '';
        if (data.length > 0) {
            const firstX = getX(0);
            const lastX = getX(data.length - 1);
            const baselineY = height - paddingBottom;
            areaD = `${pathD} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
        }

        return (
            <div className="bg-ios-card rounded-2xl p-4 border border-white/5 shadow-lg relative">
                <h4 className="text-[14px] font-bold text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    Peso Máximo (kg)
                </h4>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Horizontal grid lines */}
                    {[0, 0.5, 1.0].map((ratio, i) => {
                        const y = getY(minVal + ratio * range);
                        const val = Math.round((minVal + ratio * range) * 10) / 10;
                        return (
                            <g key={i} className="opacity-25">
                                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3 3" />
                                <text x={paddingLeft - 5} y={y + 3} fill="#8E8E93" fontSize="9" textAnchor="end" fontWeight="600">{val}kg</text>
                            </g>
                        );
                    })}

                    {/* Area under line */}
                    {data.length > 0 && (
                        <path d={areaD} fill={activeUser === 'lina' ? 'url(#pinkGlow)' : activeUser === 'michael' ? 'url(#blueGlow)' : 'url(#purpleGlow)'} className="opacity-20" />
                    )}

                    {/* Line path */}
                    <path d={pathD} fill="none" stroke={activeUser === 'lina' ? '#FF2D55' : activeUser === 'michael' ? '#007AFF' : '#A78BFA'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points & Tooltips */}
                    {data.map((d, idx) => {
                        const x = getX(idx);
                        const y = getY(d.maxWeight);
                        return (
                            <g key={idx} className="group">
                                <circle cx={x} cy={y} r="4.5" fill={activeUser === 'lina' ? '#FF2D55' : activeUser === 'michael' ? '#007AFF' : '#A78BFA'} stroke="#1C1C1E" strokeWidth="1.5" />
                                <circle cx={x} cy={y} r="9" fill="transparent" className="cursor-pointer" />
                                {/* Value bubble */}
                                {idx === data.length - 1 || idx === 0 || idx === Math.floor(data.length / 2) ? (
                                    <text x={x} y={y - 10} fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" className="bg-black/85 px-1 py-0.5 rounded">
                                        {d.maxWeight}k
                                    </text>
                                ) : null}
                            </g>
                        );
                    })}

                    {/* X Axis Labels */}
                    {data.map((d, idx) => {
                        if (data.length > 6 && idx % Math.ceil(data.length / 4) !== 0 && idx !== data.length - 1) return null;
                        const x = getX(idx);
                        return (
                            <text key={idx} x={x} y={height - 5} fill="#8E8E93" fontSize="9" fontWeight="600" textAnchor="middle">
                                {d.date}
                            </text>
                        );
                    })}

                    {/* Gradient Definitions */}
                    <defs>
                        <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#007AFF" />
                            <stop offset="100%" stopColor="#000000" />
                        </linearGradient>
                        <linearGradient id="pinkGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF2D55" />
                            <stop offset="100%" stopColor="#000000" />
                        </linearGradient>
                        <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A78BFA" />
                            <stop offset="100%" stopColor="#000000" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        );
    };

    // 2. Volume Tonnage Bar Chart (SVG)
    const renderVolumeChart = () => {
        const data = exerciseHistoryData;
        if (data.length === 0) return null;

        const width = 380;
        const height = 180;
        const paddingLeft = 38;
        const paddingRight = 15;
        const paddingTop = 20;
        const paddingBottom = 25;

        const maxVol = Math.max(...data.map(d => d.volume), 100);
        const minVol = 0;
        const range = maxVol - minVol;

        const getX = (index) => {
            if (data.length <= 1) return paddingLeft + (width - paddingLeft - paddingRight) / 2;
            return paddingLeft + (index / (data.length - 1)) * (width - paddingLeft - paddingRight);
        };

        const getY = (value) => {
            return height - paddingBottom - (value / range) * (height - paddingTop - paddingBottom);
        };

        const barWidth = Math.max(2, Math.min(16, (width - paddingLeft - paddingRight) / (data.length * 1.5)));

        return (
            <div className="bg-ios-card rounded-2xl p-4 border border-white/5 shadow-lg">
                <h4 className="text-[14px] font-bold text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    Volumen Total por Sesión (kg × reps)
                </h4>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Grid lines */}
                    {[0, 0.5, 1.0].map((ratio, i) => {
                        const y = getY(ratio * maxVol);
                        const val = Math.round(ratio * maxVol);
                        return (
                            <g key={i} className="opacity-25">
                                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3 3" />
                                <text x={paddingLeft - 5} y={y + 3} fill="#8E8E93" fontSize="9" textAnchor="end" fontWeight="600">{val}</text>
                            </g>
                        );
                    })}

                    {/* Bars */}
                    {data.map((d, idx) => {
                        const x = getX(idx) - barWidth / 2;
                        const y = getY(d.volume);
                        const barHeight = height - paddingBottom - y;
                        return (
                            <rect
                                key={idx}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={Math.max(1, barHeight)}
                                rx={barWidth / 3}
                                fill={activeUser === 'lina' ? '#FF2D55' : activeUser === 'michael' ? '#007AFF' : '#A78BFA'}
                                opacity="0.8"
                            />
                        );
                    })}

                    {/* X Axis Labels */}
                    {data.map((d, idx) => {
                        if (data.length > 6 && idx % Math.ceil(data.length / 4) !== 0 && idx !== data.length - 1) return null;
                        const x = getX(idx);
                        return (
                            <text key={idx} x={x} y={height - 5} fill="#8E8E93" fontSize="9" fontWeight="600" textAnchor="middle">
                                {d.date}
                            </text>
                        );
                    })}
                </svg>
            </div>
        );
    };

    // 3. Consolidated Day-by-Day Score Trend Chart (SVG)
    const renderScoreTrendChart = () => {
        const data = scoreTrendData;
        if (data.length === 0) return null;

        const width = 380;
        const height = 180;
        const paddingLeft = 30;
        const paddingRight = 15;
        const paddingTop = 20;
        const paddingBottom = 25;

        const maxVal = 100;
        const minVal = 50; // scores generally fall above 50%
        const range = maxVal - minVal;

        const getX = (index) => {
            if (data.length <= 1) return paddingLeft + (width - paddingLeft - paddingRight) / 2;
            return paddingLeft + (index / (data.length - 1)) * (width - paddingLeft - paddingRight);
        };

        const getY = (value) => {
            const boundedVal = Math.max(minVal, Math.min(maxVal, value));
            return height - paddingBottom - ((boundedVal - minVal) / range) * (height - paddingTop - paddingBottom);
        };

        let pathD = '';
        data.forEach((d, idx) => {
            const x = getX(idx);
            const y = getY(d.score);
            if (idx === 0) pathD = `M ${x} ${y}`;
            else pathD += ` L ${x} ${y}`;
        });

        return (
            <div className="bg-ios-card rounded-2xl p-4 border border-white/5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[14px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                        Tendencia de Puntuación (Score KPI)
                    </h4>
                    <span className="text-[12px] bg-ios-green/10 text-ios-green px-2 py-0.5 rounded-full font-bold">Últimos 15 días</span>
                </div>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Score grids */}
                    {[50, 75, 100].map((scoreVal, i) => {
                        const y = getY(scoreVal);
                        return (
                            <g key={i} className="opacity-25">
                                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3 3" />
                                <text x={paddingLeft - 5} y={y + 3} fill="#8E8E93" fontSize="9" textAnchor="end" fontWeight="600">{scoreVal}</text>
                            </g>
                        );
                    })}

                    {/* Area under line */}
                    {data.length > 0 && (
                        <path 
                            d={`${pathD} L ${getX(data.length - 1)} ${height - paddingBottom} L ${getX(0)} ${height - paddingBottom} Z`} 
                            fill={activeUser === 'lina' ? 'url(#pinkGlow)' : activeUser === 'michael' ? 'url(#blueGlow)' : 'url(#purpleGlow)'} 
                            className="opacity-15" 
                        />
                    )}

                    {/* Trend Line */}
                    <path d={pathD} fill="none" stroke={activeUser === 'lina' ? '#FF2D55' : activeUser === 'michael' ? '#007AFF' : '#A78BFA'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Dots */}
                    {data.map((d, idx) => {
                        const x = getX(idx);
                        const y = getY(d.score);
                        return (
                            <circle key={idx} cx={x} cy={y} r="3.5" fill={activeUser === 'lina' ? '#FF2D55' : activeUser === 'michael' ? '#007AFF' : '#A78BFA'} stroke="#1C1C1E" strokeWidth="1" />
                        );
                    })}

                    {/* X Axis Labels */}
                    {data.map((d, idx) => {
                        if (data.length > 6 && idx % Math.ceil(data.length / 4) !== 0 && idx !== data.length - 1) return null;
                        const x = getX(idx);
                        return (
                            <text key={idx} x={x} y={height - 5} fill="#8E8E93" fontSize="9" fontWeight="600" textAnchor="middle">
                                {d.date}
                            </text>
                        );
                    })}
                </svg>
            </div>
        );
    };

    // Tips Filtered by User
    const filteredTipsList = useMemo(() => {
        return expertTips.slice(0, 3);
    }, []);

    return (
        <div className="absolute inset-0 bg-ios-bg text-white font-sans flex flex-col overflow-hidden">
            
            {/* iOS Styled Header */}
            <header className="px-4 pb-2 shrink-0 z-40 bg-ios-bg/95 backdrop-blur-xl border-b border-white/10 safe-area-pt pt-2 flex items-end justify-between">
                <div className="max-w-lg mx-auto w-full flex justify-between items-end h-12">
                    <div className="flex flex-col items-start justify-end">
                        <h1 className="text-[32px] leading-none font-extrabold tracking-tight">Hola, {userNames[activeUser]}</h1>
                    </div>
                    
                    {/* Header Actions */}
                    <div className="flex items-center gap-3.5 pb-1">
                        <button 
                            onClick={() => { triggerHaptic(25); setIsSettingsOpen(true); }}
                            className="text-gray-400 active:text-white hover:text-white transition-colors p-1"
                            title="Configuración"
                        >
                            <Settings size={22} />
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="text-ios-pink font-semibold flex items-center gap-1 active:opacity-75 text-[15px]"
                        >
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="px-4 pt-4 max-w-lg mx-auto w-full flex-1 overflow-y-auto pb-32 no-scrollbar relative">
                
                {/* iOS Tab Selector Segmented Control */}
                <div className="mb-6">
                    <nav className="bg-[#1C1C1E] p-1 rounded-xl flex text-sm shadow-inner" role="tablist">
                        <button 
                            onClick={() => { triggerHaptic(20); setActiveTab('routine'); }}
                            role="tab"
                            aria-selected={activeTab === 'routine'}
                            className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all outline-none ${
                                activeTab === 'routine' ? 'bg-[#3A3A3C] text-white shadow-md' : 'text-gray-400'
                            }`}
                        >
                            Entrenar
                        </button>
                        <button 
                            onClick={() => { triggerHaptic(20); setActiveTab('analytics'); }}
                            role="tab"
                            aria-selected={activeTab === 'analytics'}
                            className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all outline-none ${
                                activeTab === 'analytics' ? 'bg-[#3A3A3C] text-white shadow-md' : 'text-gray-400'
                            }`}
                        >
                            Estadísticas
                        </button>
                        <button 
                            onClick={() => { triggerHaptic(20); setActiveTab('tips'); }}
                            role="tab"
                            aria-selected={activeTab === 'tips'}
                            className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all outline-none ${
                                activeTab === 'tips' ? 'bg-[#3A3A3C] text-white shadow-md' : 'text-gray-400'
                            }`}
                        >
                            Consejos
                        </button>
                    </nav>
                </div>

                {/* -------------------- TAB 1: WORKOUT ROUTINES -------------------- */}
                {activeTab === 'routine' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Day Selector */}
                        <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Rutinas">
                            {['D1', 'D2', 'D3'].map((day) => {
                                const dayTitles = { 'D1': 'Titán', 'D2': 'Encélado', 'D3': 'Mimas' };
                                const daySubtitles = { 'D1': 'Fuerza & Core', 'D2': 'Tensión Mecánica', 'D3': 'Bisagra & Poder' };
                                const isSelected = selectedDay === day;
                                
                                return (
                                    <button
                                        key={day}
                                        onClick={() => { triggerHaptic(25); setSelectedDay(day); }}
                                        role="radio"
                                        aria-checked={isSelected}
                                        className={`p-3.5 rounded-[20px] flex flex-col items-start transition-all relative overflow-hidden border ${
                                            isSelected 
                                                ? `bg-ios-card/90 ${userTheme.border} ${userTheme.glow} shadow-xl ring-1 ring-opacity-30` 
                                                : 'bg-ios-card/45 border-transparent opacity-65'
                                        }`}
                                    >
                                        {/* Colored Glow line on selected */}
                                        {isSelected && (
                                            <div className={`absolute top-0 left-0 w-full h-[3px] ${userTheme.bg}`}></div>
                                        )}
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? userTheme.primary : 'text-gray-500'}`}>
                                            {day === 'D1' ? 'Día 1' : day === 'D2' ? 'Día 2' : 'Día 3'}
                                        </span>
                                        <span className="text-[15px] font-bold text-white mt-1 text-left leading-tight">{dayTitles[day]}</span>
                                        <span className="text-[11px] text-gray-400 text-left mt-0.5 leading-snug">{daySubtitles[day]}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Exercises List Block */}
                        <div className="bg-ios-card/70 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/5 shadow-xl">
                            <div className="p-4 bg-[#2C2C2E]/40 border-b border-white/10 flex items-center justify-between">
                                <span className="text-sm font-extrabold uppercase tracking-widest text-gray-400">
                                    Secuencia de Ejercicios
                                </span>
                                <span className="text-xs bg-[#2C2C2E] px-2 py-0.5 rounded-full font-bold text-gray-300">
                                    {workoutPlan[selectedDay]?.length || 0} Total
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
                                                <h4 className="text-[15px] font-bold text-white leading-tight">{ex.name}</h4>
                                                <p className="text-[12px] text-gray-400 mt-0.5">{ex.category}</p>
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

                        {/* Space placeholder */}
                        <div className="h-6"></div>

                        {/* Sticky Bottom Training Launch Trigger */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-ios-bg/90 backdrop-blur-xl border-t border-white/10 safe-area-pb z-40">
                            <div className="max-w-lg mx-auto">
                                <button
                                    onClick={startTraining}
                                    className={`w-full py-4 ${userTheme.bg} text-white rounded-[22px] font-bold text-[17px] active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-lg ${userTheme.glow}`}
                                >
                                    <Play size={20} fill="currentColor" /> Iniciar Sesión de Hoy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------- TAB 2: DETAILED ANALYTICS VIEW -------------------- */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
                        
                        {/* Consolidated KPI Summary Card */}
                        <div className="bg-gradient-to-tr from-ios-card to-[#2C2C2E]/60 rounded-[24px] p-5 border border-white/10 shadow-xl flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Rendimiento</span>
                                <div className="flex items-center gap-1.5">
                                    <Award className={userTheme.primary} size={22} />
                                    <h3 className="text-3xl font-extrabold tracking-tight">
                                        {summaryMetrics.lastScore} <span className="text-sm font-semibold text-gray-500">/100</span>
                                    </h3>
                                </div>
                                <span className="text-[12px] text-gray-400 block mt-0.5">Última Puntuación Registrada</span>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Volumen Total</span>
                                <div className="flex items-center justify-end gap-1">
                                    <TrendingUp className="text-ios-green" size={16} />
                                    <span className="text-xl font-bold text-white">{summaryMetrics.lastTonnage} kg</span>
                                </div>
                                <span className="text-[12px] text-gray-400 block mt-0.5">{summaryMetrics.totalWorkouts} Entrenamientos</span>
                            </div>
                        </div>

                        {/* Overall Day Scoring Chart */}
                        {renderScoreTrendChart()}

                        {/* Exercise Selection Dropdown */}
                        <div className="space-y-2">
                            <label htmlFor="analytics-exercise-select" className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1 block">
                                Analizar Ejercicio Específico
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
                                            {ex.id} • {ex.name} ({ex.category})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Dynamic SVG Charts */}
                        {renderMaxWeightChart()}
                        {renderVolumeChart()}

                        {/* -------------------- ADVANCED SPORTS SCIENCE METRICS CARD -------------------- */}
                        <div className="bg-ios-card rounded-[24px] p-5 border border-white/5 shadow-xl space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                                <Activity className={userTheme.primary} size={20} />
                                <h4 className="text-[15px] font-bold text-white uppercase tracking-wider">
                                    Fisiología & Métricas Avanzadas
                                </h4>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {/* Overload Streak */}
                                <div className="bg-[#2C2C2E]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-between items-center h-[120px] hover:bg-[#2C2C2E]/60 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center mb-1">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[20px] font-black text-white">{scientificMetrics.overloadStreak}</span>
                                        <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-widest block">Racha</span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">Cargas Superadas</span>
                                </div>

                                {/* GLUT4 Translocation */}
                                <div className="bg-[#2C2C2E]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-between items-center h-[120px] hover:bg-[#2C2C2E]/60 transition-colors">
                                    <div className={`w-8 h-8 rounded-lg ${activeUser === 'lina' ? 'bg-ios-pink/15 text-ios-pink' : 'bg-ios-blue/15 text-ios-blue'} flex items-center justify-center mb-1`}>
                                        <Activity size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[20px] font-black text-white">{scientificMetrics.glut4Index}%</span>
                                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block leading-none mt-0.5">Reclutamiento</span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">Vías GLUT4</span>
                                </div>

                                {/* CNS Reserve state */}
                                <div className="bg-[#2C2C2E]/40 border border-white/5 rounded-2xl p-3 text-center flex flex-col justify-between items-center h-[120px] hover:bg-[#2C2C2E]/60 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center mb-1">
                                        <Award size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[20px] font-black text-white">{scientificMetrics.cnsRecovery}%</span>
                                        <span className="text-[9px] font-extrabold text-purple-400 uppercase tracking-widest block">Estado SNC</span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">Reserva Nerviosa</span>
                                </div>
                            </div>

                            {/* Scientific Commentary based on activeUser */}
                            <div className="bg-[#2C2C2E]/30 rounded-xl p-3 border border-white/5 text-left text-[12px] leading-relaxed text-gray-400 flex flex-col gap-1">
                                <span className={`text-[10px] font-extrabold ${userTheme.primary} uppercase tracking-wider block`}>
                                    Diagnóstico Científico Deportivo
                                </span>
                                {activeUser === 'test' && (
                                    <span>
                                        El perfil demo exhibe una excelente adherencia progresiva del 100% sobre 12 semanas. La racha acumulada demuestra un reclutamiento efectivo de unidades motoras (principio de Henneman). El SNC se encuentra en un estado de reserva favorable debido a una densidad de pacing equilibrada.
                                    </span>
                                )}
                                {activeUser === 'michael' && (
                                    <span>
                                        Michael: Mantén vigilado tu Estado del SNC. Tras sparring intenso de BJJ, si tu nivel de reserva nerviosa cae por por debajo del 75%, reduce la intensidad en el Día 3 (Mimas) o añade 15s extra a tus descansos para prevenir fatiga simpática persistente.
                                    </span>
                                )}
                                {activeUser === 'lina' && (
                                    <span>
                                        Lina: Tu activación GLUT4 estima el vaciado del glucógeno y la sensibilidad a la insulina post-esfuerzo. Al superar el 70% de activación muscular, maximizas el aclaramiento de glucosa independiente de insulina por hasta 24 horas, estabilizando tu homeostasis energética.
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* -------------------- INTERACTIVE EXPANDABLE WORKOUT LOGS -------------------- */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1 text-gray-400">
                                <Calendar size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Historial de Entrenamientos</span>
                            </div>

                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 bg-ios-card/30 rounded-2xl border border-white/5">
                                    Aún no has registrado entrenamientos. ¡Comienza hoy!
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {logs.map((session) => {
                                        const isExpanded = expandedLogId === session.id;
                                        const dateLabel = new Date(session.date).toLocaleDateString('es-ES', { 
                                            weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' 
                                        });

                                        return (
                                            <div 
                                                key={session.id} 
                                                className="bg-ios-card/85 rounded-[22px] border border-white/5 overflow-hidden transition-all duration-200"
                                            >
                                                {/* Header Row (Tappable to expand) */}
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
                                                                Día {session.day === 'D1' ? '1' : session.day === 'D2' ? '2' : '3'} — {session.dayName}
                                                            </span>
                                                        </div>
                                                        <span className="text-[12px] text-gray-400 block font-medium capitalize">{dateLabel}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <span className="text-xs font-extrabold text-ios-green block">Score: {session.score}</span>
                                                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 justify-end">
                                                                <Clock size={11}/> {Math.round(session.duration / 60)} min
                                                            </span>
                                                        </div>
                                                        {isExpanded ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
                                                    </div>
                                                </button>

                                                {/* Expanded Set Details */}
                                                {isExpanded && (
                                                    <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-[#2C2C2E]/25 divide-y divide-white/5">
                                                        {session.exercises?.filter(ex => ex.sets && ex.sets.some(s => s.completed)).map((ex, exIdx) => (
                                                            <div key={exIdx} className="py-3 first:pt-1 last:pb-1">
                                                                <div className="flex items-baseline justify-between mb-1.5">
                                                                    <h5 className="text-[14px] font-bold text-white flex items-center gap-1.5">
                                                                        {ex.exerciseName}
                                                                        {ex.selectedOption === 'alternative' && (
                                                                            <span className="text-[9px] bg-ios-pink/20 text-ios-pink font-extrabold px-1.5 py-0.5 rounded-full select-none uppercase tracking-wide">Máquina</span>
                                                                        )}
                                                                    </h5>
                                                                    <span className="text-[11px] text-gray-400">{ex.category}</span>
                                                                </div>
                                                                
                                                                {/* Sets and Weights List */}
                                                                <div className="flex flex-wrap gap-2">
                                                                    {ex.sets?.filter(s => s.completed).map((s, sIdx) => {
                                                                        const isTime = isTimeEx(ex.exerciseId);
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
                                                                                    <span className="text-[9px] bg-red-500/20 text-red-400 font-bold px-1.5 rounded select-none uppercase tracking-wider">Fallo</span>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Individual exercise timers */}
                                                                {(ex.duration > 0 || ex.restDuration > 0) && (
                                                                    <div className="flex gap-4 mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                                        {ex.duration > 0 && (
                                                                            <span>Activo: {Math.floor(ex.duration / 60)}m {ex.duration % 60}s</span>
                                                                        )}
                                                                        {ex.restDuration > 0 && (
                                                                            <span className="text-ios-blue">Descanso: {Math.floor(ex.restDuration / 60)}m {ex.restDuration % 60}s</span>
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
                )}

                {/* -------------------- TAB 3: TIPS & SCIENCE VIEW -------------------- */}
                {activeTab === 'tips' && (
                    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
                        <div className="bg-ios-card/75 backdrop-blur-xl p-5 rounded-[22px] border border-white/5 shadow-xl">
                            <h2 className="text-[18px] font-extrabold text-white mb-2 flex items-center gap-2">
                                <Activity size={20} className={userTheme.primary}/>
                                Respaldado por la Ciencia
                            </h2>
                            <p className="text-[13px] text-gray-400 leading-relaxed">
                                Este programa de entrenamiento está estructurado en base a variables fisiológicas clave para la hipertrofia progresiva, control técnico exhaustivo y la estabilización general de la fuerza mediante adaptaciones del core.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1 text-gray-400">
                                <BookOpen size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Consejos de Expertos</span>
                            </div>
                            
                            <div className="grid gap-3.5">
                                {filteredTipsList.map((tip, i) => (
                                    <div key={i} className="bg-ios-card/50 backdrop-blur-xl p-5 rounded-[20px] border border-white/5 flex gap-3.5 shadow-lg">
                                        <div className="mt-0.5 text-ios-blue shrink-0">
                                            <Dumbbell size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-bold text-white leading-tight mb-1.5">{tip.title}</h4>
                                            <p className="text-[13px] text-gray-400 leading-relaxed">{tip.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* -------------------- SETTINGS & CONFIGURATION OVERLAY MODAL -------------------- */}
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex flex-col safe-area-pt safe-area-pb text-white">
                    {/* Modal Header */}
                    <header className="px-4 py-3 flex justify-between items-center border-b border-white/10 shrink-0">
                        <button 
                            onClick={() => { triggerHaptic(20); if (editingSession) setEditingSession(null); else setIsSettingsOpen(false); }}
                            className="text-ios-blue flex items-center gap-1 active:opacity-70 text-[16px] font-medium"
                        >
                            {editingSession ? <><ArrowLeft size={20}/> Atrás</> : 'Cerrar'}
                        </button>
                        <h2 className="text-[17px] font-extrabold text-white uppercase tracking-wider">
                            {editingSession ? 'Editar Entrenamiento' : 'Configuración'}
                        </h2>
                        <div className="w-12"></div> {/* Spacer */}
                    </header>

                    {/* Modal Content Scroll Area */}
                    <main className="flex-1 overflow-y-auto p-4 space-y-6">
                        
                        {/* 1. VIEW 1: LOGS & HISTORY LIST TO EDIT/DELETE */}
                        {!editingSession ? (
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <h3 className="text-[18px] font-extrabold text-white">Administrar Entrenamientos</h3>
                                    <p className="text-[13px] text-gray-400">Edita o elimina registros específicos de tu historial local.</p>
                                </div>

                                {activeUser === 'michael' && (
                                    <div className="bg-ios-card p-4 rounded-2xl border border-white/5 space-y-4 shadow-lg">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <span className="text-[14px] font-bold text-white">Opciones de Desarrollador</span>
                                            <span className="text-[10px] bg-ios-blue/20 text-ios-blue font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <span className="text-[13px] font-bold text-white block">Mostrar Usuario Demo</span>
                                                <span className="text-[11px] text-gray-400 block leading-tight">Activa la tarjeta del Usuario de Pruebas en el Onboarding.</span>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    triggerHaptic(20);
                                                    const currentVal = localStorage.getItem('vitefit_show_test_user') === 'true';
                                                    localStorage.setItem('vitefit_show_test_user', !currentVal ? 'true' : 'false');
                                                    setDummyUpdate(prev => prev + 1);
                                                }}
                                                className={`w-12 h-7 rounded-full transition-all relative flex items-center p-0.5 border ${
                                                    localStorage.getItem('vitefit_show_test_user') === 'true' 
                                                        ? 'bg-ios-blue border-ios-blue justify-end' 
                                                        : 'bg-[#2C2C2E] border-white/10 justify-start'
                                                }`}
                                            >
                                                <span className="w-5 h-5 rounded-full bg-white shadow-md block"></span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {logs.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 bg-ios-card/30 rounded-2xl border border-white/5">
                                        No hay entrenamientos para administrar.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {logs.map((session) => (
                                            <div 
                                                key={session.id} 
                                                className="bg-ios-card p-4 rounded-2xl border border-white/5 flex items-center justify-between"
                                            >
                                                <div className="space-y-1">
                                                    <span className="text-[14px] font-bold text-white block">
                                                        Día {session.day === 'D1' ? '1' : session.day === 'D2' ? '2' : '3'} — {session.dayName}
                                                    </span>
                                                    <span className="text-[12px] text-gray-400 block font-medium">
                                                        {new Date(session.date).toLocaleDateString('es-ES', { 
                                                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                                        })}
                                                    </span>
                                                    <span className="text-[11px] bg-ios-green/10 text-ios-green px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                                                        Score: {session.score} • {session.tonnage || 0} kg
                                                    </span>
                                                </div>

                                                <div className="flex gap-2.5">
                                                    {/* Edit button */}
                                                    <button
                                                        onClick={() => handleStartEditSession(session)}
                                                        className="w-10 h-10 rounded-xl bg-ios-blue/15 text-ios-blue flex items-center justify-center active:scale-90 transition-transform"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleDeleteSession(session.id)}
                                                        className="w-10 h-10 rounded-xl bg-ios-pink/15 text-ios-pink flex items-center justify-center active:scale-90 transition-transform"
                                                        title="Borrar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* 2. VIEW 2: ACTIVE SESSION INLINE EDITOR */
                            <div className="space-y-6">
                                <div className="space-y-4 bg-ios-card p-4 rounded-2xl border border-white/5">
                                    <h3 className="text-[15px] font-extrabold text-white border-b border-white/10 pb-2">Datos de la Sesión</h3>
                                    
                                    {/* Date editor */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Fecha y Hora</label>
                                        <input 
                                            type="datetime-local" 
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                            className="w-full p-3 bg-[#2C2C2E] border-0 rounded-xl text-white font-bold text-[14px] focus:ring-1 focus:ring-ios-blue focus:outline-none"
                                        />
                                    </div>

                                    {/* Duration editor */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Duración (minutos)</label>
                                        <input 
                                            type="number" 
                                            value={editDuration}
                                            onChange={(e) => setEditDuration(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-full p-3 bg-[#2C2C2E] border-0 rounded-xl text-white font-bold text-[14px] focus:ring-1 focus:ring-ios-blue focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Exercises and Sets Editor List */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Ejercicios y Series</h3>

                                    {editExercises.map((ex, exIdx) => {
                                        const completedSets = ex.sets?.filter(s => s.completed) || [];
                                        if (completedSets.length === 0) return null; // only show completed exercises

                                        return (
                                            <div key={exIdx} className="bg-ios-card p-4 rounded-2xl border border-white/5 space-y-3">
                                                <div className="flex justify-between items-baseline border-b border-white/10 pb-1.5">
                                                    <h4 className="text-[14px] font-extrabold text-white flex items-center gap-1.5">
                                                        {ex.exerciseName}
                                                        {ex.selectedOption === 'alternative' && (
                                                            <span className="text-[9px] bg-ios-pink/20 text-ios-pink font-extrabold px-1.5 py-0.5 rounded-full select-none uppercase tracking-wide">Máquina</span>
                                                        )}
                                                    </h4>
                                                    <span className="text-[11px] text-gray-400">{ex.category}</span>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {ex.sets.map((set, setIdx) => {
                                                        if (!set.completed) return null;
                                                        const isTime = isTimeEx(ex.exerciseId);
                                                        return (
                                                            <div key={setIdx} className="grid grid-cols-12 gap-2 items-center text-[13px]">
                                                                <span className="col-span-2 text-gray-500 font-extrabold">Set {set.setNum}</span>
                                                                
                                                                {isTime ? (
                                                                    /* Time input (takes 6 columns) */
                                                                    <div className="col-span-6 flex items-center bg-[#2C2C2E] rounded-lg px-2.5 py-1 justify-between">
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Duración (seg)</span>
                                                                        <input 
                                                                            type="number"
                                                                            value={set.reps}
                                                                            onChange={(e) => {
                                                                                handleUpdateEditExerciseSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0);
                                                                                handleUpdateEditExerciseSet(exIdx, setIdx, 'weight', 0);
                                                                            }}
                                                                            className="w-16 bg-transparent border-0 p-0 text-center font-bold text-white text-[13px] focus:ring-0 focus:outline-none font-mono"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        {/* Weight input */}
                                                                        <div className="col-span-3 flex items-center bg-[#2C2C2E] rounded-lg px-2 py-1">
                                                                            <span className="text-[10px] text-gray-500 font-bold mr-1">KG</span>
                                                                            <input 
                                                                                type="number"
                                                                                step="0.5"
                                                                                value={set.weight}
                                                                                onChange={(e) => handleUpdateEditExerciseSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                                                                                className="w-full bg-transparent border-0 p-0 text-center font-bold text-white text-[13px] focus:ring-0 focus:outline-none"
                                                                            />
                                                                        </div>

                                                                        {/* Reps input */}
                                                                        <div className="col-span-3 flex items-center bg-[#2C2C2E] rounded-lg px-2 py-1">
                                                                            <span className="text-[10px] text-gray-500 font-bold mr-1">REPS</span>
                                                                            <input 
                                                                                type="number"
                                                                                value={set.reps}
                                                                                onChange={(e) => handleUpdateEditExerciseSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                                                                                className="w-full bg-transparent border-0 p-0 text-center font-bold text-white text-[13px] focus:ring-0 focus:outline-none"
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* Fallo input */}
                                                                <div className="col-span-4 flex items-center bg-[#2C2C2E] rounded-lg px-2.5 py-1 justify-between select-none">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Fallo</span>
                                                                    <input 
                                                                        type="checkbox"
                                                                        checked={!!set.alFallo}
                                                                        onChange={(e) => handleUpdateEditExerciseSet(exIdx, setIdx, 'alFallo', e.target.checked)}
                                                                        className="w-4 h-4 rounded border-gray-600 bg-black text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:outline-none cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Sticky save control */}
                                <button
                                    onClick={handleSaveEditedSession}
                                    className="w-full py-4 bg-ios-green text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg shadow-ios-green/20"
                                >
                                    <Save size={20}/> Guardar Cambios
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}
