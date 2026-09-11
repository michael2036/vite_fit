import { describe, it, expect } from 'vitest';
import { makeScales, buildLinePath, buildAreaPath, shouldShowXLabel } from './chartMath';

describe('makeScales', () => {
    const scales = makeScales({
        width: 100, height: 100,
        paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
        count: 3, minVal: 0, maxVal: 10,
    });

    it('spreads points evenly across the width', () => {
        expect(scales.getX(0)).toBe(0);
        expect(scales.getX(1)).toBe(50);
        expect(scales.getX(2)).toBe(100);
    });

    it('maps values to y with the origin at the bottom', () => {
        expect(scales.getY(0)).toBe(100);
        expect(scales.getY(10)).toBe(0);
        expect(scales.getY(5)).toBe(50);
    });

    it('centers a single point when there is only one data point', () => {
        const single = makeScales({ width: 100, height: 100, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, count: 1, minVal: 0, maxVal: 10 });
        expect(single.getX(0)).toBe(50);
    });

    it('clamps values outside the domain instead of drawing off-chart', () => {
        expect(scales.getY(999)).toBe(0);
        expect(scales.getY(-999)).toBe(100);
    });
});

describe('buildLinePath / buildAreaPath', () => {
    const getX = (i) => i * 10;
    const getY = (v) => 100 - v;

    it('builds a moveto/lineto path visiting every value in order', () => {
        const path = buildLinePath([1, 2, 3], getX, getY);
        expect(path).toBe('M 0 99 L 10 98 L 20 97');
    });

    it('closes the area path down to the given baseline', () => {
        const line = buildLinePath([1, 2], getX, getY);
        const area = buildAreaPath(line, 2, getX, 100);
        expect(area).toBe('M 0 99 L 10 98 L 10 100 L 0 100 Z');
    });

    it('returns an empty area path for no data', () => {
        expect(buildAreaPath('', 0, getX, 100)).toBe('');
    });
});

describe('shouldShowXLabel', () => {
    it('shows every label when there are 6 or fewer points', () => {
        for (let i = 0; i < 6; i++) {
            expect(shouldShowXLabel(i, 6)).toBe(true);
        }
    });

    it('thins labels out for larger datasets but always keeps the last one', () => {
        const count = 15;
        expect(shouldShowXLabel(count - 1, count)).toBe(true);
        expect(shouldShowXLabel(0, count)).toBe(true);
        // not every index should show once thinned
        const shown = Array.from({ length: count }, (_, i) => shouldShowXLabel(i, count)).filter(Boolean).length;
        expect(shown).toBeLessThan(count);
    });
});
