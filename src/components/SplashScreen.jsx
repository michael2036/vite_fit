import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ setAppReady }) {
    useEffect(() => {
        // Wait exactly 2 seconds to simulate native launch parsing
        const timer = setTimeout(() => {
            setAppReady(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [setAppReady]);

    return (
        <motion.div 
            className="fixed inset-0 bg-ios-bg z-[1000] flex flex-col items-center justify-center text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
                <img 
                    src="/pwa-192x192.png" 
                    alt="CoupleFit Logo" 
                    className="w-32 h-32 rounded-[28px] shadow-2xl" 
                    draggable="false" 
                />
            </motion.div>
        </motion.div>
    );
}
