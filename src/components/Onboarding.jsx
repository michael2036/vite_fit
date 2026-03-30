import React from 'react';
import { Dumbbell, Activity, Users, ShieldAlert } from 'lucide-react';

export default function Onboarding({ setAppState, setActiveProfile }) {
    return (
        <div className="min-h-screen bg-ios-bg text-white flex flex-col items-center justify-center p-6 relative overflow-hidden safe-area-pt safe-area-pb">
            {/* Ambient Background Gradient typically found in Apple apps */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ios-blue/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ios-pink/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-md w-full z-10 text-center mb-16 mt-10 flex flex-col items-center">
                <img 
                    src="/pwa-192x192.png" 
                    alt="CoupleFit Logo" 
                    className="w-24 h-24 rounded-3xl shadow-xl shadow-ios-blue/20 mb-6 border border-white/10" 
                />
                <h1 className="text-4xl font-semibold text-white tracking-tight mb-3">
                    CoupleFit
                </h1>
                <p className="text-lg text-ios-separator font-medium max-w-sm mx-auto">
                    Synchronize your goals. Train together, progress at your own pace.
                </p>
            </div>

            <div className="w-full max-w-md space-y-4 z-10 mb-8">
                
                <button
                    onClick={() => { setActiveProfile('michael'); setAppState('dashboard'); }}
                    className="w-full relative p-5 rounded-[20px] bg-ios-card active:scale-[0.98] transition-all duration-200 overflow-hidden text-left flex items-center gap-4 border border-white/5"
                >
                    <div className="w-12 h-12 rounded-xl bg-ios-blue/20 text-ios-blue flex items-center justify-center shrink-0">
                        <Activity size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[17px] font-semibold text-white">Michael</h3>
                        <p className="text-[14px] text-ios-separator">Advanced • BJJ Focus</p>
                    </div>
                </button>

                <button
                    onClick={() => { setActiveProfile('both'); setAppState('dashboard'); }}
                    className="w-full relative p-5 rounded-[20px] bg-ios-card active:scale-[0.98] transition-all duration-200 overflow-hidden text-left flex items-center gap-4 border border-white/5"
                >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Users size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[17px] font-semibold text-white">Couple Mode</h3>
                        <p className="text-[14px] text-ios-separator">Synchronized View</p>
                    </div>
                </button>

                <button
                    onClick={() => { setActiveProfile('lina'); setAppState('dashboard'); }}
                    className="w-full relative p-5 rounded-[20px] bg-ios-card active:scale-[0.98] transition-all duration-200 overflow-hidden text-left flex items-center gap-4 border border-white/5"
                >
                    <div className="w-12 h-12 rounded-xl bg-ios-pink/20 text-ios-pink flex items-center justify-center shrink-0">
                        <ShieldAlert size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[17px] font-semibold text-white">Lina</h3>
                        <p className="text-[14px] text-ios-separator">Beginner • Hypertrophy</p>
                    </div>
                </button>

            </div>
        </div>
    );
}
