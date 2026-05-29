/**
 * Calculates a consolidated daily workout score between 0 and 100.
 *
 * Formula:
 * Score = (Completion % * 60) + (Volume Overload Index * 30) + (Pacing Index * 10)
 *
 * @param {Object} currentWorkout - The workout session data being evaluated.
 * @param {Array} history - The user's historical workout sessions for progressive comparison.
 * @returns {Object} - Object containing the calculated score, sub-scores, and progressive overload metrics.
 */
export function calculateWorkoutScore(currentWorkout, history = []) {
    const { day, exercises = [], duration = 0 } = currentWorkout;

    // 1. Completion Score (Max 60 points)
    const totalExercises = exercises.length;
    if (totalExercises === 0) {
        return { score: 0, completionScore: 0, volumeScore: 0, pacingScore: 0 };
    }

    // A completed exercise is one where at least one set is marked as completed
    const completedExercises = exercises.filter(ex => 
        ex.sets && ex.sets.some(s => s.completed)
    );
    const numCompleted = completedExercises.length;
    const completionRate = numCompleted / totalExercises;
    const completionScore = Math.round(completionRate * 60);

    // 2. Volume Overload Score (Max 30 points)
    // Compute current tonnage (Weight * Reps) for all completed sets
    let currentTonnage = 0;
    exercises.forEach(ex => {
        if (ex.sets) {
            ex.sets.forEach(set => {
                if (set.completed && set.weight > 0 && set.reps > 0) {
                    currentTonnage += Number(set.weight) * Number(set.reps);
                }
            });
        }
    });

    // Find the user's previous completed session of the SAME workout day (e.g., D1)
    const sameDayHistory = history
        .filter(h => h.day === day && h.id !== currentWorkout.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

    let prevTonnage = 0;
    if (sameDayHistory.length > 0) {
        const prevWorkout = sameDayHistory[0];
        if (prevWorkout.exercises) {
            prevWorkout.exercises.forEach(ex => {
                if (ex.sets) {
                    ex.sets.forEach(set => {
                        if (set.completed && set.weight > 0 && set.reps > 0) {
                            prevTonnage += Number(set.weight) * Number(set.reps);
                        }
                    });
                }
            });
        }
    }

    let volumeIndex = 1.0;
    let overloadDelta = 0; // % increase or decrease
    if (prevTonnage > 0 && currentTonnage > 0) {
        volumeIndex = currentTonnage / prevTonnage;
        overloadDelta = Math.round(((currentTonnage - prevTonnage) / prevTonnage) * 100);
    }

    // Progressive Overload Score: 
    // - If first session or tonnage matches/exceeds previous, get full 30 points.
    // - If less tonnage, score scales down proportionally.
    // - Capped at 30 points.
    const volumeFactor = Math.min(1.0, volumeIndex);
    const volumeScore = Math.round(volumeFactor * 30);

    // 3. Pacing/Rest Efficiency Score (Max 10 points)
    // Avoid penalizing users who do partial workouts quickly by checking average duration per completed exercise.
    let pacingScore = 10;
    if (numCompleted > 0 && duration > 0) {
        const avgSecondsPerExercise = duration / numCompleted;
        // Standard high-efficiency workout is 5-8 minutes (300-480s) per exercise including sets and transitions.
        if (avgSecondsPerExercise <= 480) {
            pacingScore = 10;
        } else if (avgSecondsPerExercise <= 720) {
            // Scales down linearly between 8m and 12m per exercise
            const factor = (720 - avgSecondsPerExercise) / (720 - 480);
            pacingScore = Math.max(5, Math.round(5 + factor * 5));
        } else {
            // Over 12 minutes per exercise drops to a lower score
            pacingScore = Math.max(0, Math.round(5 - ((avgSecondsPerExercise - 720) / 120)));
        }
    } else {
        pacingScore = 0;
    }

    // Consolidated Total Score
    const score = Math.min(100, completionScore + volumeScore + pacingScore);

    return {
        score,
        completionScore,
        volumeScore,
        pacingScore,
        currentTonnage,
        prevTonnage,
        overloadDelta
    };
}
