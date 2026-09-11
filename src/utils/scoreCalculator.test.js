import { describe, it, expect } from 'vitest';
import { calculateWorkoutScore } from './scoreCalculator';

function completedSet(weight, reps) {
    return { weight, reps, completed: true };
}

function exercise(sets) {
    return { sets };
}

describe('calculateWorkoutScore', () => {
    it('scores 0 when there are no exercises', () => {
        const result = calculateWorkoutScore({ day: 'D1', exercises: [], duration: 0 });
        expect(result.score).toBe(0);
    });

    it('gives full completion score when every exercise has a completed set', () => {
        const workout = {
            day: 'D1',
            duration: 1200, // 5 completed exercises in 20 min = 4 min/exercise, well under the 8 min pacing threshold
            exercises: [
                exercise([completedSet(20, 10)]),
                exercise([completedSet(20, 10)]),
                exercise([completedSet(20, 10)]),
                exercise([completedSet(20, 10)]),
                exercise([completedSet(20, 10)]),
            ],
        };
        const result = calculateWorkoutScore(workout);
        expect(result.completionScore).toBe(60);
        expect(result.pacingScore).toBe(10);
    });

    it('only counts an exercise as completed if at least one of its sets is completed', () => {
        const workout = {
            day: 'D1',
            duration: 600,
            exercises: [
                exercise([completedSet(20, 10)]),
                exercise([{ weight: 20, reps: 10, completed: false }]),
            ],
        };
        const result = calculateWorkoutScore(workout);
        // 1 of 2 exercises completed -> 50% of 60 points
        expect(result.completionScore).toBe(30);
    });

    it('awards full volume score on a first-ever session for that day', () => {
        const workout = {
            id: 'today',
            day: 'D1',
            duration: 600,
            exercises: [exercise([completedSet(20, 10)])],
        };
        const result = calculateWorkoutScore(workout, []);
        expect(result.volumeScore).toBe(30);
        expect(result.currentTonnage).toBe(200);
    });

    it('scales the volume score down when tonnage drops versus the last same-day session', () => {
        const previous = {
            id: 'prev',
            day: 'D1',
            date: '2024-01-01T00:00:00.000Z',
            exercises: [exercise([completedSet(40, 10)])], // 400 tonnage
        };
        const current = {
            id: 'today',
            day: 'D1',
            duration: 600,
            exercises: [exercise([completedSet(20, 10)])], // 200 tonnage: half the previous
        };
        const result = calculateWorkoutScore(current, [previous]);
        expect(result.currentTonnage).toBe(200);
        expect(result.prevTonnage).toBe(400);
        expect(result.volumeScore).toBe(15); // 50% of 30
    });

    it('never lets tonnage growth push the volume score above the 30-point cap', () => {
        const previous = {
            id: 'prev',
            day: 'D1',
            date: '2024-01-01T00:00:00.000Z',
            exercises: [exercise([completedSet(10, 10)])], // 100 tonnage
        };
        const current = {
            id: 'today',
            day: 'D1',
            duration: 600,
            exercises: [exercise([completedSet(40, 10)])], // 400 tonnage: 4x previous
        };
        const result = calculateWorkoutScore(current, [previous]);
        expect(result.volumeScore).toBe(30);
    });

    it('only compares against the same workout day, ignoring other days in history', () => {
        const otherDay = {
            id: 'other-day',
            day: 'D2',
            date: '2024-01-01T00:00:00.000Z',
            exercises: [exercise([completedSet(1000, 10)])], // huge tonnage, but wrong day
        };
        const current = {
            id: 'today',
            day: 'D1',
            duration: 600,
            exercises: [exercise([completedSet(20, 10)])],
        };
        const result = calculateWorkoutScore(current, [otherDay]);
        // no D1 history exists, so this behaves like a first-ever session
        expect(result.volumeScore).toBe(30);
    });

    it('caps the total score at 100', () => {
        const workout = {
            day: 'D1',
            duration: 300,
            exercises: [exercise([completedSet(50, 10)])],
        };
        const result = calculateWorkoutScore(workout, []);
        expect(result.score).toBeLessThanOrEqual(100);
    });

    it('reduces the pacing score for slow sessions and floors it for very slow ones', () => {
        const fast = calculateWorkoutScore({
            day: 'D1', duration: 300, exercises: [exercise([completedSet(20, 10)])],
        });
        const slow = calculateWorkoutScore({
            day: 'D1', duration: 700, exercises: [exercise([completedSet(20, 10)])],
        });
        const verySlow = calculateWorkoutScore({
            day: 'D1', duration: 2000, exercises: [exercise([completedSet(20, 10)])],
        });
        expect(fast.pacingScore).toBe(10);
        expect(slow.pacingScore).toBeLessThan(10);
        expect(verySlow.pacingScore).toBe(0);
    });
});
