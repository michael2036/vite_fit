import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export default function ExitConfirmDialog({ onContinue, onExit }) {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl">
                <div className="space-y-2">
                    <h3 className="text-[19px] font-extrabold text-white">
                        {t('train_exit_confirm') || '¿Seguro que deseas salir?'}
                    </h3>
                    <p className="text-[14px] text-gray-400">
                        {t('train_exit_warning') || 'Se perderá el progreso de la sesión actual.'}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={() => { triggerHaptic(20); onContinue(); }}
                        className="py-3 px-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 active:scale-[0.98] transition-all text-[14px]"
                    >
                        {t('train_exit_continue') || 'Continuar'}
                    </button>
                    <button
                        onClick={async () => {
                            triggerHaptic(30);
                            await onExit();
                        }}
                        className="py-3 px-4 rounded-xl bg-ios-pink text-white font-bold hover:bg-ios-pink/90 active:scale-[0.98] transition-all shadow-lg shadow-ios-pink/20 text-[14px]"
                    >
                        {t('train_exit_yes') || 'Salir'}
                    </button>
                </div>
            </div>
        </div>
    );
}
