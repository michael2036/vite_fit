import React from 'react';
import { Dumbbell, Users, Activity, ShieldAlert, Play, BookOpen } from 'lucide-react';
import { workoutPlan, expertTips } from '../data/workoutData';

export default function Dashboard({ appState, setAppState, startTraining, activeProfile, setActiveProfile, selectedDay, setSelectedDay, activeTab, setActiveTab }) {
    
    // Icon mapper for tips
    const getTipIcon = (iconName) => {
        switch(iconName) {
            case 'Activity': return <Activity className="text-ios-blue" size={24} />;
            case 'ShieldAlert': return <ShieldAlert className="text-ios-pink" size={24} />;
            case 'CheckCircle': return <Dumbbell className="text-ios-green" size={24} />; // using dumbbell as fallback CheckCircle
            default: return <BookOpen className="text-white" size={24} />;
        }
    };

    return (
        <div className="absolute inset-0 bg-ios-bg text-white font-sans flex flex-col">
            
            {/* iOS Navigation Bar */}
            <header className="px-4 pb-2 shrink-0 z-40 bg-ios-bg/80 backdrop-blur-xl border-b border-white/10 safe-area-pt pt-2">
                <div className="max-w-lg mx-auto w-full flex justify-between items-end h-12">
                    <h1 className="text-[34px] leading-tight font-bold tracking-tight">Hoy</h1>
                    <button
                        onClick={() => setAppState('onboarding')}
                        className="text-[17px] text-ios-blue flex items-center gap-1 active:opacity-70 font-medium pb-1.5"
                    >
                        {activeProfile === 'both' ? 'Pareja' : activeProfile === 'michael' ? 'Michael' : 'Lina'}
                    </button>
                </div>
            </header>

            <main className="px-4 pt-6 max-w-lg mx-auto w-full flex-1 overflow-y-auto pb-32 relative">
                <div className="mb-8">
                    {/* iOS Segmented Control */}
                    <nav className="bg-[#1C1C1E] p-1 rounded-lg flex text-sm" role="tablist" aria-label="Content Views">
                        <button 
                            onClick={() => setActiveTab('routine')}
                            role="tab"
                            aria-selected={activeTab === 'routine'}
                            className={`flex-1 py-1.5 rounded-md font-medium transition-all focus-visible:ring-2 focus-visible:ring-ios-blue outline-none ${activeTab === 'routine' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            Rutina
                        </button>
                        <button 
                            onClick={() => setActiveTab('tips')}
                            role="tab"
                            aria-selected={activeTab === 'tips'}
                            className={`flex-1 py-1.5 rounded-md font-medium transition-all focus-visible:ring-2 focus-visible:ring-ios-blue outline-none ${activeTab === 'tips' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            Consejos y Ciencia
                        </button>
                    </nav>
                </div>

                {activeTab === 'routine' && (
                    <section className="animate-in fade-in duration-300" aria-label="Routine View">
                        {/* Day Selector - 2x2 Matrix */}
                        <div className="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Training Days">
                            {['A', 'B', 'C', 'D'].map((day) => {
                                const dayTitles = { 'A': 'Foco Sentadilla', 'B': 'Foco Bisagra', 'C': 'Cuerpo Completo', 'D': 'Cardio Zona 2' };
                                const isSelected = selectedDay === day;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        role="radio"
                                        aria-checked={isSelected}
                                        className={`p-4 rounded-2xl flex flex-col items-start transition-all focus-visible:ring-2 focus-visible:ring-white outline-none ${isSelected ? 'bg-ios-card ring-1 ring-ios-blue' : 'bg-[#1C1C1E] opacity-70'}`}
                                    >
                                        <span className={`text-[12px] font-semibold uppercase tracking-wider ${isSelected ? 'text-ios-blue' : 'text-gray-500'}`}>
                                            Día {day}
                                        </span>
                                        <span className="text-[15px] font-medium text-white mt-1 text-left">{dayTitles[day]}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* List Sequence - iOS List Style */}
                        <div className="bg-ios-card rounded-[20px] overflow-hidden mb-24">
                            {workoutPlan[selectedDay].map((ex, i) => (
                                <div key={ex.id} className={`p-4 flex flex-col ${i !== workoutPlan[selectedDay].length - 1 ? 'border-b border-white/10' : ''}`}>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="w-5 h-5 rounded-full bg-[#2C2C2E] text-gray-400 text-[11px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                                        <span className="text-[17px] font-medium text-white">{ex.category}</span>
                                    </div>
                                    <span className="text-[14px] text-gray-400 ml-8">{ex.sharedEquipment}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sticky Bottom Button */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-ios-bg/90 backdrop-blur-xl border-t border-white/10 safe-area-pb z-40 pointer-events-auto">
                            <div className="max-w-lg mx-auto">
                                <button
                                    onClick={startTraining}
                                    className="w-full py-4 bg-ios-blue text-white rounded-[20px] font-semibold text-[17px] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-ios-blue/20"
                                >
                                    <Play size={20} fill="currentColor" /> Iniciar Sesión Ahora
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'tips' && (
                    <section className="animate-in fade-in duration-300 space-y-4" aria-labelledby="science-heading">
                        <article className="bg-ios-card p-6 rounded-[20px]">
                            <h2 id="science-heading" className="text-[20px] font-semibold text-white mb-2">Respaldado por la Ciencia</h2>
                            <p className="text-[15px] text-gray-400 leading-relaxed">
                                Curado para estabilizar los niveles glucémicos mediante hipertrofia progresiva y desarrollar fuerza funcional para Jiu-Jitsu sin sobrecargar el Sistema Nervioso Central.
                            </p>
                        </article>
                        
                        {expertTips.map((tip, i) => (
                            <article key={i} className="bg-ios-card p-5 rounded-[20px] flex gap-4">
                                <div className="mt-1" aria-hidden="true">
                                    {getTipIcon(tip.icon)}
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-semibold text-white mb-1.5">{tip.title}</h3>
                                    <p className="text-[15px] text-gray-400 leading-relaxed">{tip.description}</p>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
