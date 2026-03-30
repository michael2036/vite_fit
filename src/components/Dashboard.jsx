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
        <div className="min-h-screen bg-ios-bg text-white font-sans safe-area-pt safe-area-pb pb-24">
            
            {/* iOS Navigation Bar */}
            <header className="px-4 pt-6 pb-2 sticky top-0 z-40 bg-ios-bg/80 backdrop-blur-xl border-b border-white/10">
                <div className="flex justify-between items-end h-12">
                    <h1 className="text-[34px] leading-tight font-bold tracking-tight">Today</h1>
                    <button
                        onClick={() => setAppState('onboarding')}
                        className="text-[17px] text-ios-blue flex items-center gap-1 active:opacity-70 font-medium pb-1.5"
                    >
                        {activeProfile === 'both' ? 'Couple' : activeProfile === 'michael' ? 'Michael' : 'Lina'}
                    </button>
                </div>
            </header>

            <main className="px-4 mt-6 max-w-lg mx-auto">
                <div className="mb-8">
                    {/* iOS Segmented Control */}
                    <div className="bg-[#1C1C1E] p-1 rounded-lg flex text-sm">
                        <button 
                            onClick={() => setActiveTab('routine')}
                            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${activeTab === 'routine' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            Routine
                        </button>
                        <button 
                            onClick={() => setActiveTab('tips')}
                            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${activeTab === 'tips' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            Tips & Science
                        </button>
                    </div>
                </div>

                {activeTab === 'routine' && (
                    <div className="animate-in fade-in duration-300">
                        {/* Day Selector - 2x2 Matrix */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {['A', 'B', 'C', 'D'].map((day) => {
                                const dayTitles = { 'A': 'Squat Focus', 'B': 'Hinge Focus', 'C': 'Full Body', 'D': 'Zone 2 Cardio' };
                                const isSelected = selectedDay === day;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`p-4 rounded-2xl flex flex-col items-start transition-all ${isSelected ? 'bg-ios-card ring-1 ring-ios-blue' : 'bg-[#1C1C1E] opacity-70'}`}
                                    >
                                        <span className={`text-[12px] font-semibold uppercase tracking-wider ${isSelected ? 'text-ios-blue' : 'text-gray-500'}`}>
                                            Day {day}
                                        </span>
                                        <span className="text-[15px] font-medium text-white mt-1 text-left">{dayTitles[day]}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* List Sequence - iOS List Style */}
                        <div className="bg-ios-card rounded-[20px] overflow-hidden mb-8">
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

                        <button
                            onClick={startTraining}
                            className="w-full py-4 bg-ios-blue text-white rounded-[20px] font-semibold text-[17px] active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
                        >
                            <Play size={20} fill="currentColor" /> Start Session Now
                        </button>
                    </div>
                )}

                {activeTab === 'tips' && (
                    <div className="animate-in fade-in duration-300 space-y-4">
                        <div className="bg-ios-card p-6 rounded-[20px]">
                            <h2 className="text-[20px] font-semibold text-white mb-2">Backing Science</h2>
                            <p className="text-[15px] text-gray-400 leading-relaxed">
                                Curated to stabilize glycemic levels via progressive hypertrophy, and develop functional strength for Jiu-Jitsu without overloading the Central Nervous System.
                            </p>
                        </div>
                        
                        {expertTips.map((tip, i) => (
                            <div key={i} className="bg-ios-card p-5 rounded-[20px] flex gap-4">
                                <div className="mt-1">
                                    {getTipIcon(tip.icon)}
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-semibold text-white mb-1.5">{tip.title}</h3>
                                    <p className="text-[15px] text-gray-400 leading-relaxed">{tip.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
