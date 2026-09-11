import { useMemo } from 'react';
import { Activity, BookOpen, Dumbbell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TipsTab({ userTheme }) {
    const { t } = useLanguage();

    const localizedTips = useMemo(() => (
        [
            { title: t('tip_1_title'), description: t('tip_1_desc') },
            { title: t('tip_2_title'), description: t('tip_2_desc') },
            { title: t('tip_3_title'), description: t('tip_3_desc') },
            { title: t('tip_4_title'), description: t('tip_4_desc') }
        ].slice(0, 3)
    ), [t]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-16">
            <div className="bg-ios-card/75 backdrop-blur-xl p-5 rounded-[22px] border border-white/5 shadow-xl">
                <h2 className="text-[18px] font-extrabold text-white mb-2 flex items-center gap-2">
                    <Activity size={20} className={userTheme.primary} />
                    {t('science_backed')}
                </h2>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                    {t('science_backed_desc')}
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1 text-gray-400">
                    <BookOpen size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('expert_tips')}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {localizedTips.map((tip, i) => (
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
    );
}
