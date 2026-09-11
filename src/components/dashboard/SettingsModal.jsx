import { useState } from 'react';
import { ArrowLeft, Edit, Save, Trash2 } from 'lucide-react';
import { calculateWorkoutScore } from '../../utils/scoreCalculator';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryTranslation as translateCategory } from '../../utils/categories';
import { isTimeExercise } from '../../utils/exercises';
import { triggerHaptic } from '../../utils/haptics';
import * as workoutStore from '../../services/workoutStore';

/**
 * Settings overlay: language switch, dev options, and the workout history
 * list with an inline session editor. The editor's own state (which session
 * is being edited, its draft fields) lives here since nothing outside this
 * modal ever needs it.
 */
export default function SettingsModal({ onClose, activeUser, logs }) {
    const { language, changeLanguage, t } = useLanguage();
    const getCategoryTranslation = (category) => translateCategory(category, t);

    const [editingSession, setEditingSession] = useState(null);
    const [editDate, setEditDate] = useState('');
    const [editDuration, setEditDuration] = useState(0);
    const [editExercises, setEditExercises] = useState([]);
    const [, forceRender] = useState(0); // re-renders after toggling the show-test-user flag below

    const handleDeleteSession = (sessionId) => {
        triggerHaptic(35);
        if (!window.confirm("¿Estás seguro de que deseas borrar este entrenamiento de tu historial?")) return;
        workoutStore.deleteSession(sessionId);
        if (editingSession?.id === sessionId) {
            setEditingSession(null);
        }
        triggerHaptic([40, 30]);
    };

    const handleStartEditSession = (session) => {
        triggerHaptic(20);
        setEditingSession(session);
        // Format ISO date string into 'YYYY-MM-DDTHH:MM' for datetime-local input
        const localDate = new Date(session.date);
        const tzOffset = localDate.getTimezoneOffset() * 60000;
        const localISOTime = new Date(localDate - tzOffset).toISOString().slice(0, 16);

        setEditDate(localISOTime);
        setEditDuration(Math.round(session.duration / 60));
        setEditExercises(JSON.parse(JSON.stringify(session.exercises || []))); // deep copy
    };

    const handleSaveEditedSession = () => {
        triggerHaptic(30);
        if (!editingSession) return;

        const otherLogs = workoutStore.getLogsForUser(activeUser).filter(l => l.id !== editingSession.id);
        const updated = workoutStore.updateSession(editingSession.id, (session) => {
            const updatedSession = {
                ...session,
                date: new Date(editDate).toISOString(),
                duration: editDuration * 60,
                exercises: editExercises
            };
            const scoreResult = calculateWorkoutScore(updatedSession, otherLogs);
            updatedSession.score = scoreResult.score;
            updatedSession.tonnage = scoreResult.currentTonnage;
            return updatedSession;
        });

        if (updated) {
            setEditingSession(null);
            triggerHaptic([40, 50]);
        }
    };

    const handleUpdateEditExerciseSet = (exIdx, setIdx, field, val) => {
        setEditExercises(prev => {
            const copy = [...prev];
            const ex = { ...copy[exIdx] };
            const sets = [...ex.sets];
            sets[setIdx] = { ...sets[setIdx], [field]: val };
            ex.sets = sets;
            copy[exIdx] = ex;
            return copy;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex flex-col safe-area-pt safe-area-pb text-white">
            <header className="px-4 py-3 flex justify-between items-center border-b border-white/10 shrink-0">
                <button
                    onClick={() => { triggerHaptic(20); if (editingSession) setEditingSession(null); else onClose(); }}
                    className="text-ios-blue flex items-center gap-1 active:opacity-70 text-[16px] font-medium"
                >
                    {editingSession ? <><ArrowLeft size={20} /> {t('back')}</> : t('cancel')}
                </button>
                <h2 className="text-[17px] font-extrabold text-white uppercase tracking-wider">
                    {editingSession ? t('stats_edit_title') : t('tab_settings')}
                </h2>
                <div className="w-12"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {!editingSession ? (
                    <div className="space-y-5">
                        {/* Language Selection Card */}
                        <div className="bg-ios-card p-4 rounded-2xl border border-white/5 space-y-3 shadow-lg">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <span className="text-[14px] font-bold text-white">{t('language_setting') || 'Idioma de la Aplicación'}</span>
                                <span className="text-[10px] bg-ios-blue/20 text-ios-blue font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">i18n</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 bg-[#2C2C2E]/60 p-1 rounded-xl">
                                {[
                                    { code: 'es', name: 'Español' },
                                    { code: 'en', name: 'English' },
                                    { code: 'de', name: 'Deutsch' }
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { triggerHaptic(20); changeLanguage(lang.code); }}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                            language === lang.code
                                                ? 'bg-ios-blue text-white shadow-md'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-[18px] font-extrabold text-white">{t('settings_manage_workouts')}</h3>
                            <p className="text-[13px] text-gray-400">{t('settings_manage_desc')}</p>
                        </div>

                        {activeUser === 'michael' && (
                            <div className="bg-ios-card p-4 rounded-2xl border border-white/5 space-y-4 shadow-lg">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <span className="text-[14px] font-bold text-white">{t('dev_options')}</span>
                                    <span className="text-[10px] bg-ios-blue/20 text-ios-blue font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className="text-[13px] font-bold text-white block">{t('show_demo_user')}</span>
                                        <span className="text-[11px] text-gray-400 block leading-tight">{t('settings_dev_desc')}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            triggerHaptic(20);
                                            workoutStore.setShowTestUser(!workoutStore.getShowTestUser());
                                            forceRender(prev => prev + 1);
                                        }}
                                        className={`w-12 h-7 rounded-full transition-all relative flex items-center p-0.5 border ${
                                            workoutStore.getShowTestUser()
                                                ? 'bg-ios-blue border-ios-blue justify-end'
                                                : 'bg-[#2C2C2E] border-white/10 justify-start'
                                        }`}
                                    >
                                        <span className="w-5 h-5 rounded-full bg-white shadow-md block"></span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-ios-card/30 rounded-2xl border border-white/5">
                                {t('settings_no_workouts')}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((session) => (
                                    <div key={session.id} className="bg-ios-card p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[14px] font-bold text-white block">
                                                {session.day === 'D1' ? t('day_1') : session.day === 'D2' ? t('day_2') : t('day_3')} — {session.day === 'D1' ? t('day_1_title') : session.day === 'D2' ? t('day_2_title') : t('day_3_title')}
                                            </span>
                                            <span className="text-[12px] text-gray-400 block font-medium">
                                                {new Date(session.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'de' ? 'de-DE' : 'es-ES', {
                                                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                            <span className="text-[11px] bg-ios-green/10 text-ios-green px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                                                Score: {session.score} • {session.tonnage || 0} kg
                                            </span>
                                        </div>

                                        <div className="flex gap-2.5">
                                            <button
                                                onClick={() => handleStartEditSession(session)}
                                                className="w-10 h-10 rounded-xl bg-ios-blue/15 text-ios-blue flex items-center justify-center active:scale-90 transition-transform"
                                                title={t('stats_edit')}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSession(session.id)}
                                                className="w-10 h-10 rounded-xl bg-ios-pink/15 text-ios-pink flex items-center justify-center active:scale-90 transition-transform"
                                                title={t('stats_delete')}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4 bg-ios-card p-4 rounded-2xl border border-white/5">
                            <h3 className="text-[15px] font-extrabold text-white border-b border-white/10 pb-2">{t('settings_session_data')}</h3>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">{t('stats_date_time')}</label>
                                <input
                                    type="datetime-local"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="w-full p-3 bg-[#2C2C2E] border-0 rounded-xl text-white font-bold text-[14px] focus:ring-1 focus:ring-ios-blue focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">{t('settings_duration_min')}</label>
                                <input
                                    type="number"
                                    value={editDuration}
                                    onChange={(e) => setEditDuration(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full p-3 bg-[#2C2C2E] border-0 rounded-xl text-white font-bold text-[14px] focus:ring-1 focus:ring-ios-blue focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">{t('settings_ex_sets')}</h3>

                            {editExercises.map((ex, exIdx) => {
                                const completedSets = ex.sets?.filter(s => s.completed) || [];
                                if (completedSets.length === 0) return null;

                                return (
                                    <div key={exIdx} className="bg-ios-card p-4 rounded-2xl border border-white/5 space-y-3">
                                        <div className="flex justify-between items-baseline border-b border-white/10 pb-1.5">
                                            <h4 className="text-[14px] font-extrabold text-white flex items-center gap-1.5">
                                                {t(ex.exerciseId + '_name') || ex.exerciseName}
                                                {ex.selectedOption === 'alternative' && (
                                                    <span className="text-[9px] bg-ios-pink/20 text-ios-pink font-extrabold px-1.5 py-0.5 rounded-full select-none uppercase tracking-wide">{t('train_machine')}</span>
                                                )}
                                            </h4>
                                            <span className="text-[11px] text-gray-400">{getCategoryTranslation(ex.category)}</span>
                                        </div>

                                        <div className="space-y-2.5">
                                            {ex.sets.map((set, setIdx) => {
                                                if (!set.completed) return null;
                                                const isTime = isTimeExercise(ex.exerciseId);
                                                return (
                                                    <div key={setIdx} className="grid grid-cols-12 gap-2 items-center text-[13px]">
                                                        <span className="col-span-2 text-gray-500 font-extrabold">{t('train_set')} {set.setNum}</span>

                                                        {isTime ? (
                                                            <div className="col-span-6 flex items-center bg-[#2C2C2E] rounded-lg px-2.5 py-1 justify-between">
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('duration_seconds')}</span>
                                                                <input
                                                                    type="number"
                                                                    value={set.reps}
                                                                    onChange={(e) => {
                                                                        handleUpdateEditExerciseSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0);
                                                                        handleUpdateEditExerciseSet(exIdx, setIdx, 'weight', 0);
                                                                    }}
                                                                    className="w-16 bg-transparent border-0 p-0 text-center font-bold text-white text-[13px] focus:ring-0 focus:outline-none font-mono"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="col-span-3 flex items-center bg-[#2C2C2E] rounded-lg px-2 py-1">
                                                                    <span className="text-[10px] text-gray-500 font-bold mr-1">KG</span>
                                                                    <input
                                                                        type="number"
                                                                        step="0.5"
                                                                        value={set.weight}
                                                                        onChange={(e) => handleUpdateEditExerciseSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                                                                        className="w-full bg-transparent border-0 p-0 text-center font-bold text-white text-[13px] focus:ring-0 focus:outline-none"
                                                                    />
                                                                </div>

                                                                <div className="col-span-3 flex items-center bg-[#2C2C2E] rounded-lg px-2 py-1">
                                                                    <span className="text-[10px] text-gray-500 font-bold mr-1">REPS</span>
                                                                    <input
                                                                        type="number"
                                                                        value={set.reps}
                                                                        onChange={(e) => handleUpdateEditExerciseSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                                                                        className="w-full bg-transparent border-0 p-0 text-center font-bold text-white text-[13px] focus:ring-0 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="col-span-4 flex items-center bg-[#2C2C2E] rounded-lg px-2.5 py-1 justify-between select-none">
                                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('train_failure')}</span>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!set.alFallo}
                                                                onChange={(e) => handleUpdateEditExerciseSet(exIdx, setIdx, 'alFallo', e.target.checked)}
                                                                className="w-4 h-4 rounded border-gray-600 bg-black text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:outline-none cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleSaveEditedSession}
                            className="w-full py-4 bg-ios-green text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg shadow-ios-green/20"
                        >
                            <Save size={20} /> {t('stats_save_changes')}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
