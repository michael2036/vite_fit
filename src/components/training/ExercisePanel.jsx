import { useLanguage } from '../../context/LanguageContext';
import { getCategoryTranslation } from '../../utils/categories';
import { getYoutubeEmbedUrl } from '../../utils/youtube';
import { getOptionLabelKeys } from '../../utils/exerciseOptionLabels';

/** Left column of TrainingMode: exercise description, progression notes, and video/option tabs. */
export default function ExercisePanel({
    currentEx, currentExIndex, routineLength, activeUser,
    activeOption, onSelectOption,
}) {
    const { t } = useLanguage();

    const labelKeys = getOptionLabelKeys(currentEx.id);
    const labels = { primary: t(labelKeys.primary), alternative: t(labelKeys.alternative) };

    const activeVideoUrl = activeOption === 'primary' ? currentEx.videoUrl : (currentEx.videoUrlAlternative || currentEx.videoUrl);
    const embedUrl = getYoutubeEmbedUrl(activeVideoUrl);

    const userSuffix = activeUser === 'Michael' ? 'm' : activeUser === 'Lina' ? 'l' : 'm';
    const localizedNotes = t(currentEx.id + '_notes_' + userSuffix) || (currentEx.progressionNotes && currentEx.progressionNotes[activeUser]);

    return (
        <div className="space-y-4">
            <div className="text-center md:text-left mb-4 max-w-lg md:max-w-none mx-auto md:mx-0">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {currentExIndex + 1} {t('train_of')} {routineLength}
                </p>
                <h2 className="text-[25px] font-extrabold leading-tight mb-1 text-white">{t(currentEx.id + '_name') || currentEx.name}</h2>
                <p className="text-[14px] text-ios-blue font-semibold mb-1">{getCategoryTranslation(currentEx.category, t)}</p>
                <p className="text-[13px] text-gray-400 mb-3">{t('train_equipment') || 'Equipamiento'}: {currentEx.sharedEquipment}</p>

                {localizedNotes && (
                    <div className="bg-ios-card/40 border border-white/5 rounded-xl p-3 mb-3 text-left max-w-lg md:max-w-none mx-auto md:mx-0">
                        <span className="text-[11px] font-bold text-ios-blue uppercase tracking-wider block mb-0.5">{t('train_tech_suggestion') || 'Sugerencia Técnica'} ({activeUser})</span>
                        <span className="text-[13px] text-gray-300 leading-tight">{localizedNotes}</span>
                    </div>
                )}

                <p className="text-[14px] text-gray-300 leading-relaxed px-2 md:px-0 text-center md:text-left">{t(currentEx.id + '_desc') || currentEx.description}</p>
            </div>

            {currentEx.hasAlternative && (
                <div className="flex justify-center md:justify-start gap-2 mb-3 max-w-lg md:max-w-none mx-auto md:mx-0" role="tablist">
                    <button
                        onClick={() => onSelectOption('primary')}
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
                        onClick={() => onSelectOption('alternative')}
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
                <div className="w-full aspect-video rounded-[20px] overflow-hidden mb-4 bg-black border border-white/10 relative shadow-inner max-w-lg md:max-w-none mx-auto md:mx-0">
                    <iframe
                        src={embedUrl}
                        title={t(currentEx.id + '_name') || currentEx.name}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="w-full aspect-video rounded-[20px] overflow-hidden mb-4 bg-[#1C1C1E]/50 border border-white/10 flex flex-col items-center justify-center p-6 text-center max-w-lg md:max-w-none mx-auto md:mx-0">
                    <span className="text-[32px] mb-2 select-none">📱</span>
                    <span className="text-[14px] font-bold text-white mb-1">{t('train_video_tutorial') || 'Demostración en Video'}</span>
                    <p className="text-[12px] text-gray-400 mb-4 px-4 leading-snug">
                        {t('train_view_shorts_desc') || 'Mira una demostración rápida y explicativa en formato vertical directamente en YouTube Shorts.'}
                    </p>
                    <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent((activeOption === 'primary' ? (t(currentEx.id + '_name') || currentEx.name) : (labels.alternative || t(currentEx.id + '_name') || currentEx.name)) + ' shorts')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/20 active:scale-95 text-decoration-none"
                    >
                        {t('train_search_shorts') || 'Buscar en YouTube Shorts'}
                    </a>
                </div>
            )}
        </div>
    );
}
