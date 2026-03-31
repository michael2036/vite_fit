import React, { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function TimerAlert({ sugarAlertShown, setSugarAlertShown }) {
    
    // Auto dismiss logic could go here if wanted, but explicitly requested manual dismiss in PRD
    
    if (!sugarAlertShown) return null;

    return (
        <div 
            className="fixed left-4 right-4 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 mx-auto max-w-sm"
            style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
            <div className="bg-[#1C1C1E]/95 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl border border-white/10 flex items-start gap-4 cursor-pointer active:scale-95 transition-transform"
                 onClick={() => setSugarAlertShown(false)}>
                
                <div className="bg-ios-pink rounded-[14px] p-2 mt-0.5">
                    <ShieldAlert size={24} className="text-white" />
                </div>
                
                <div className="flex-1">
                    <h4 className="text-[15px] font-semibold text-white">Alerta de 60 Minutos</h4>
                    <p className="text-[15px] text-gray-300 leading-tight mt-0.5">Lina: Asegúrate de monitorear tus niveles de energía y considera carbohidratos rápidos inmediatamente para prevenir hipoglucemia.</p>
                </div>
                
                <div className="text-[12px] text-gray-500 font-medium">Ahora</div>
            </div>
        </div>
    );
}
