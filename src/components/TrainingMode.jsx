import React, { useEffect } from 'react';
import { X, PlayCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { workoutPlan } from '../data/workoutData';
import { motion, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

export default function TrainingMode({ 
    setAppState, activeProfile, selectedDay, timer, currentExIndex, setCurrentExIndex, 
    completedExercises, toggleCurrentExercise, endSession, formatTime 
}) {
    const currentEx = workoutPlan[selectedDay][currentExIndex];
    const isDone = completedExercises.includes(currentEx.id);
    const progress = Math.round(((currentExIndex + 1) / workoutPlan[selectedDay].length) * 100);

    const controls = useAnimation();

    // Native iOS Gesture (Swipe to dismiss)
    const bind = useDrag(({ movement: [mx, my], velocity: [vx, vy], down, cancel, active }) => {
        const dist = Math.max(mx, my);
        const vel = Math.max(vx, vy);
        
        if (dist > window.innerWidth / 3 || (vel > 1.2 && dist > 50)) {
            if (!active) {
                if (mx > my) {
                    controls.start({ x: window.innerWidth, transition: { duration: 0.2 } }).then(() => setAppState('dashboard'));
                } else {
                    controls.start({ y: window.innerHeight, transition: { duration: 0.2 } }).then(() => setAppState('dashboard'));
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
        if (navigator.vibrate) navigator.vibrate(20);
        await controls.start({ y: '100%', transition: { duration: 0.3, ease: 'easeIn' } });
        setAppState('dashboard');
    };

    const triggerHaptic = (duration = 30) => {
        if (navigator.vibrate) navigator.vibrate(duration);
    };

    const handleNext = () => {
        triggerHaptic();
        setCurrentExIndex(Math.min(workoutPlan[selectedDay].length - 1, currentExIndex + 1));
    };

    const handlePrev = () => {
        triggerHaptic();
        setCurrentExIndex(Math.max(0, currentExIndex - 1));
    };

    const handleFinish = () => {
        triggerHaptic([30, 50, 30]);
        endSession();
    };

    return (
        <motion.div 
            {...bind()}
            initial={{ y: '100%', x: 0 }}
            animate={controls}
            exit={{ y: '100%', transition: { duration: 0.3 } }}
            className="fixed inset-0 bg-ios-bg z-50 text-white font-sans flex flex-col safe-area-pt touch-pan-y"
            style={{ touchAction: 'pan-y' }}
        >
            {/* iOS Modal Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mt-2 mb-1 cursor-grab active:cursor-grabbing"></div>
            
            {/* Top Navigation */}
            <header className="px-4 py-2 flex justify-between items-center bg-ios-bg/90 backdrop-blur-md">
                <button 
                    onClick={handleExit} 
                    className="text-ios-blue flex items-center gap-1 active:opacity-70 text-[17px]"
                    aria-label="End Session and return to Home"
                >
                    <ChevronLeft size={24} className="-ml-2"/>
                    Fin
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[12px] font-medium text-gray-400">Día {selectedDay}</span>
                    <span className={`font-mono text-[17px] font-semibold ${timer >= 3600 ? 'text-ios-pink animate-pulse' : 'text-white'}`}>
                        {formatTime(timer)}
                    </span>
                </div>
                <div className="w-16"></div> {/* Spacer for centering */}
            </header>

            {/* Progress Bar iOS style */}
            <div className="w-full bg-[#1C1C1E] h-1">
                <div className="bg-ios-blue h-1 transition-all duration-300 rounded-r-full" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Main Content Carousel */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-6 px-4 mt-6 relative">
                <div className="text-center mb-6">
                    <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                        {currentExIndex + 1} DE {workoutPlan[selectedDay].length}
                    </p>
                    <h2 className="text-[28px] font-bold leading-tight mb-2">{currentEx.category}</h2>
                    <p className="text-[15px] text-gray-400">{currentEx.sharedEquipment}</p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                    {/* User 1 Component */}
                    {(activeProfile === 'both' || activeProfile === 'lina') && (
                        <article className="bg-ios-card rounded-[20px] p-5 shadow-lg shadow-black/20 relative z-10 transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-ios-pink/10 text-ios-pink px-2.5 py-1 rounded-md text-[13px] font-semibold tracking-wide">LINA</span>
                                <a 
                                    href={currentEx.lina.videoUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-ios-pink active:opacity-70 hover:scale-105 transition-transform"
                                    aria-label={`View video tutorial for ${currentEx.lina.name}`}
                                >
                                    <PlayCircle size={28} />
                                </a>
                            </div>
                            <h3 className="text-[20px] font-semibold mb-2 leading-tight tracking-tight">{currentEx.lina.name}</h3>
                            <p className="text-[15px] text-gray-400 mb-6">{currentEx.lina.description}</p>
                            
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1 bg-[#2C2C2E] rounded-[14px] p-3 text-center">
                                    <div className="text-[12px] text-gray-400 font-medium mb-1">SERIES</div>
                                    <div className="text-[22px] font-bold text-ios-pink">{currentEx.lina.sets}</div>
                                </div>
                                <div className="flex-1 bg-[#2C2C2E] rounded-[14px] p-3 text-center">
                                    <div className="text-[12px] text-gray-400 font-medium mb-1">REPS</div>
                                    <div className="text-[22px] font-bold text-ios-pink">{currentEx.lina.reps}</div>
                                </div>
                            </div>
                            <div className="bg-[#2C2C2E] p-3 rounded-[14px] text-[15px] text-gray-300">
                                <span className="font-semibold text-white">Nota: </span>{currentEx.lina.notes}
                            </div>
                        </article>
                    )}

                    {/* User 2 Component */}
                    {(activeProfile === 'both' || activeProfile === 'michael') && (
                        <article className="bg-ios-card rounded-[20px] p-5 shadow-lg shadow-black/20 relative z-10 transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-ios-blue/10 text-ios-blue px-2.5 py-1 rounded-md text-[13px] font-semibold tracking-wide">MICHAEL</span>
                                <a 
                                    href={currentEx.michael.videoUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-ios-blue active:opacity-70 hover:scale-105 transition-transform"
                                    aria-label={`View video tutorial for ${currentEx.michael.name}`}
                                >
                                    <PlayCircle size={28} />
                                </a>
                            </div>
                            <h3 className="text-[20px] font-semibold mb-2 leading-tight tracking-tight">{currentEx.michael.name}</h3>
                            <p className="text-[15px] text-gray-400 mb-6">{currentEx.michael.description}</p>
                            
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1 bg-[#2C2C2E] rounded-[14px] p-3 text-center">
                                    <div className="text-[12px] text-gray-400 font-medium mb-1">SERIES</div>
                                    <div className="text-[22px] font-bold text-ios-blue">{currentEx.michael.sets}</div>
                                </div>
                                <div className="flex-1 bg-[#2C2C2E] rounded-[14px] p-3 text-center">
                                    <div className="text-[12px] text-gray-400 font-medium mb-1">REPS</div>
                                    <div className="text-[22px] font-bold text-ios-blue">{currentEx.michael.reps}</div>
                                </div>
                            </div>
                            <div className="bg-[#2C2C2E] p-3 rounded-[14px] text-[15px] text-gray-300">
                                <span className="font-semibold text-white">Nota: </span>{currentEx.michael.notes}
                            </div>
                        </article>
                    )}
                </div>
            </main>

            {/* Bottom Nav Bar - iOS Sticky ToolBar */}
            <footer className="shrink-0 bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-8 safe-area-pb z-40 relative">
                <div className="max-w-lg mx-auto flex justify-between items-center gap-4">
                    <button 
                        onClick={handlePrev}
                        disabled={currentExIndex === 0}
                        className="p-3 bg-[#2C2C2E] rounded-full disabled:opacity-30 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-white outline-none"
                        aria-label="Previous Exercise"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {currentExIndex === workoutPlan[selectedDay].length - 1 ? (
                        <button
                            onClick={handleFinish}
                            className="flex-1 py-3.5 bg-ios-green text-white rounded-[20px] font-semibold text-[17px] active:scale-[0.98] transition-transform text-center"
                        >
                            Finalizar Sesión
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                toggleCurrentExercise(currentEx.id);
                                if (!isDone) {
                                    setTimeout(handleNext, 400); // 400ms delay to see checkmark before sliding to next
                                }
                            }}
                            className={`flex-1 py-3.5 rounded-[20px] font-semibold text-[17px] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 ${
                                isDone ? 'bg-[#2C2C2E] text-ios-green ring-1 ring-ios-green' : 'bg-ios-blue text-white'
                            }`}
                        >
                            {isDone ? <><Check size={20}/> Completado</> : 'Completar y Siguiente'}
                        </button>
                    )}

                    <button 
                        onClick={handleNext}
                        disabled={currentExIndex === workoutPlan[selectedDay].length - 1}
                        className="p-3 bg-[#2C2C2E] rounded-full disabled:opacity-30 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-white outline-none"
                        aria-label="Next Exercise"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </footer>
        </motion.div>
    );
}
