import { describe, it, expect, beforeEach } from 'vitest';

// Vitest's default 'node' environment has no `localStorage` global. This is
// a minimal in-memory stand-in — just enough surface for workoutStore to
// exercise real read/write/JSON round-trips without pulling in jsdom for
// one global.
function createMemoryStorage() {
    const store = new Map();
    return {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: (key) => store.delete(key),
        clear: () => store.clear(),
    };
}

globalThis.localStorage = createMemoryStorage();

const { STORAGE_KEYS } = await import('../constants/storageKeys');
const workoutStore = await import('./workoutStore');

beforeEach(() => {
    globalThis.localStorage.clear();
});

describe('workoutStore: workout logs', () => {
    it('returns an empty array when nothing has been saved yet', () => {
        expect(workoutStore.getAllLogs()).toEqual([]);
        expect(workoutStore.getLogsForUser('michael')).toEqual([]);
    });

    it('saveSession prepends the new session and persists it', () => {
        workoutStore.saveSession({ id: 'a', user: 'michael', score: 80 });
        workoutStore.saveSession({ id: 'b', user: 'michael', score: 90 });
        const logs = workoutStore.getAllLogs();
        expect(logs.map((l) => l.id)).toEqual(['b', 'a']);
    });

    it('getLogsForUser only returns sessions for the requested profile', () => {
        workoutStore.saveSession({ id: 'a', user: 'michael' });
        workoutStore.saveSession({ id: 'b', user: 'lina' });
        expect(workoutStore.getLogsForUser('michael')).toEqual([{ id: 'a', user: 'michael' }]);
        expect(workoutStore.getLogsForUser('lina')).toEqual([{ id: 'b', user: 'lina' }]);
    });

    it('deleteSession removes only the matching session', () => {
        workoutStore.saveSession({ id: 'a', user: 'michael' });
        workoutStore.saveSession({ id: 'b', user: 'michael' });
        workoutStore.deleteSession('a');
        expect(workoutStore.getAllLogs().map((l) => l.id)).toEqual(['b']);
    });

    it('updateSession applies the updater and persists the result', () => {
        workoutStore.saveSession({ id: 'a', user: 'michael', score: 50 });
        const updated = workoutStore.updateSession('a', (session) => ({ ...session, score: 99 }));
        expect(updated.score).toBe(99);
        expect(workoutStore.getAllLogs()[0].score).toBe(99);
    });

    it('updateSession returns null and writes nothing when the id is not found', () => {
        workoutStore.saveSession({ id: 'a', user: 'michael', score: 50 });
        const updated = workoutStore.updateSession('missing', (session) => ({ ...session, score: 0 }));
        expect(updated).toBeNull();
        expect(workoutStore.getAllLogs()[0].score).toBe(50);
    });

    it('replaceLogsForUser swaps one profile\'s history without touching the others', () => {
        workoutStore.saveSession({ id: 'm1', user: 'michael' });
        workoutStore.saveSession({ id: 'l1', user: 'lina' });
        workoutStore.replaceLogsForUser('test', [{ id: 't1', user: 'test' }, { id: 't2', user: 'test' }]);

        const all = workoutStore.getAllLogs();
        expect(all.some((l) => l.id === 'm1')).toBe(true);
        expect(all.some((l) => l.id === 'l1')).toBe(true);
        expect(workoutStore.getLogsForUser('test').map((l) => l.id).sort()).toEqual(['t1', 't2']);
    });

    it('falls back to an empty array if the stored value is corrupted JSON', () => {
        globalThis.localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, '{not valid json');
        expect(workoutStore.getAllLogs()).toEqual([]);
    });
});

describe('workoutStore: preferences', () => {
    it('defaults the active user and selected day when nothing is stored', () => {
        expect(workoutStore.getActiveUser()).toBe('michael');
        expect(workoutStore.getSelectedDay()).toBe('D1');
    });

    it('round-trips the active user and selected day', () => {
        workoutStore.setActiveUser('lina');
        workoutStore.setSelectedDay('D2');
        expect(workoutStore.getActiveUser()).toBe('lina');
        expect(workoutStore.getSelectedDay()).toBe('D2');
    });

    it('defaults the show-test-user flag to false and round-trips it', () => {
        expect(workoutStore.getShowTestUser()).toBe(false);
        workoutStore.setShowTestUser(true);
        expect(workoutStore.getShowTestUser()).toBe(true);
        workoutStore.setShowTestUser(false);
        expect(workoutStore.getShowTestUser()).toBe(false);
    });

    it('round-trips the language preference', () => {
        expect(workoutStore.getLanguage()).toBeNull();
        workoutStore.setLanguage('de');
        expect(workoutStore.getLanguage()).toBe('de');
    });
});
