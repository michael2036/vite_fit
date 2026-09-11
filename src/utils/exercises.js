import { workoutPlan } from '../data/workoutData';

/**
 * Whether an exercise is logged as an elapsed duration (seconds) rather than
 * weight x reps. Warmups are always time-based regardless of their entry in
 * workoutData.js.
 */
export function isTimeExercise(exerciseId) {
    if (exerciseId?.includes('WU')) return true;
    for (const day of Object.keys(workoutPlan)) {
        const found = workoutPlan[day]?.find((e) => e.id === exerciseId);
        if (found?.measurementType === 'time') return true;
    }
    return false;
}
