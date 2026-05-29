import React from 'react';
import { User, UserRound, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Onboarding({ setAppState, setActiveUser, triggerSeeding }) {
    
    const showTestUser = React.useMemo(() => {
        try {
            return localStorage.getItem('vitefit_show_test_user') === 'true';
        } catch (e) {
            return false;
        }
    }, []);

    const handleUserSelect = (user) => {
        console.log("CoupleFit Welcome Screen - Profile Selected:", user);
        try {
            if (navigator.vibrate) navigator.vibrate(40);
        } catch (e) {
            console.warn("Haptic vibration blocked by browser sandbox:", e);
        }
        
        setActiveUser(user);
        
        // If test user is selected, we ensure the seed script runs
        if (user === 'test') {
            triggerSeeding();
        }
        
        setAppState('dashboard');
    };

    return (
        <div className="min-h-screen bg-ios-bg text-white flex flex-col items-center justify-center p-6 relative overflow-hidden safe-area-pt safe-area-pb">
            {/* Soft Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-ios-blue/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-ios-pink/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Logo and Greeting Area */}
            <motion.div 
                className="max-w-md w-full z-10 text-center mb-12 mt-6 flex flex-col items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="relative mb-6">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-ios-blue to-ios-pink opacity-35 blur-md"></div>
                    <img 
                        src="/pwa-192x192.png" 
                        alt="CoupleFit Logo" 
                        className="w-24 h-24 rounded-3xl shadow-2xl relative border border-white/10" 
                    />
                </div>
                <h1 className="text-[32px] font-bold text-white tracking-tight mb-2">
                    Bienvenido a CoupleFit
                </h1>
                <p className="text-[16px] text-gray-400 font-medium px-4">
                    Selecciona tu perfil de entrenamiento para iniciar
                </p>
            </motion.div>

            {/* Glassmorphic User Profile Options */}
            <motion.div 
                className="w-full max-w-md space-y-4 z-10 mb-8 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            >
                {/* Michael Card */}
                <button
                    onClick={() => handleUserSelect('michael')}
                    className="w-full relative p-5 rounded-[22px] bg-ios-card/70 active:scale-[0.98] transition-all duration-200 text-left flex items-center gap-4 border border-white/5 backdrop-blur-xl hover:bg-ios-card/90"
                >
                    <div className="absolute top-0 right-0 w-24 h-full bg-ios-blue/5 rounded-r-[22px] blur-sm pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-xl bg-ios-blue/20 text-ios-blue flex items-center justify-center shrink-0 shadow-inner">
                        <User size={26} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[18px] font-bold text-white leading-tight">Michael</h3>
                            <span className="text-[10px] bg-ios-blue/25 text-ios-blue font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Fuerza</span>
                        </div>
                        <p className="text-[13px] text-gray-400 mt-1">Sparring, BJJ y desarrollo de fuerza explosiva</p>
                    </div>
                </button>

                {/* Lina Card */}
                <button
                    onClick={() => handleUserSelect('lina')}
                    className="w-full relative p-5 rounded-[22px] bg-ios-card/70 active:scale-[0.98] transition-all duration-200 text-left flex items-center gap-4 border border-white/5 backdrop-blur-xl hover:bg-ios-card/90"
                >
                    <div className="absolute top-0 right-0 w-24 h-full bg-ios-pink/5 rounded-r-[22px] blur-sm pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-xl bg-ios-pink/20 text-ios-pink flex items-center justify-center shrink-0 shadow-inner">
                        <UserRound size={26} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[18px] font-bold text-white leading-tight">Lina</h3>
                            <span className="text-[10px] bg-ios-pink/25 text-ios-pink font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Postura</span>
                        </div>
                        <p className="text-[13px] text-gray-400 mt-1">Flexibilidad activa, control técnico y tempo</p>
                    </div>
                </button>

                {/* Conditional Demo User Card */}
                {showTestUser && (
                    <button
                        onClick={() => handleUserSelect('test')}
                        className="w-full relative p-5 rounded-[22px] bg-ios-card/70 active:scale-[0.98] transition-all duration-200 text-left flex items-center gap-4 border border-white/5 backdrop-blur-xl hover:bg-ios-card/90"
                    >
                        <div className="absolute top-0 right-0 w-24 h-full bg-purple-500/5 rounded-r-[22px] blur-sm pointer-events-none"></div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
                            <Activity size={26} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[18px] font-bold text-white leading-tight">Usuario Demo</h3>
                                <span className="text-[10px] bg-purple-500/25 text-purple-400 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Test</span>
                            </div>
                            <p className="text-[13px] text-gray-400 mt-1">Registros progresivos de 3 meses para probar gráficos</p>
                        </div>
                    </button>
                )}

            </motion.div>
        </div>
    );
}
