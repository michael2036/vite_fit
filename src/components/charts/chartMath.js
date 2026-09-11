// Shared geometry for Dashboard's hand-rolled SVG charts. Previously three
// near-identical chart-rendering functions in Dashboard.jsx each reimplemented
// this axis-scaling and path-building math from scratch; this is the one
// place it lives now.

/** Maps a data index / value pair onto pixel coordinates inside the chart's padded drawing area. */
export function makeScales({ width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, count, minVal, maxVal }) {
    const range = maxVal - minVal || 1;
    const innerWidth = width - paddingLeft - paddingRight;
    const innerHeight = height - paddingTop - paddingBottom;

    const getX = (index) => {
        if (count <= 1) return paddingLeft + innerWidth / 2;
        return paddingLeft + (index / (count - 1)) * innerWidth;
    };
    const getY = (value) => {
        const bounded = Math.max(minVal, Math.min(maxVal, value));
        return height - paddingBottom - ((bounded - minVal) / range) * innerHeight;
    };

    return { getX, getY };
}

/** Builds an SVG path `d` string connecting one point per value with straight lines. */
export function buildLinePath(values, getX, getY) {
    let pathD = '';
    values.forEach((value, idx) => {
        const x = getX(idx);
        const y = getY(value);
        pathD += idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    return pathD;
}

/** Closes a line path down to the chart's baseline, for an area-under-the-line fill. */
export function buildAreaPath(linePathD, count, getX, baselineY) {
    if (count === 0) return '';
    const firstX = getX(0);
    const lastX = getX(count - 1);
    return `${linePathD} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
}

/**
 * Decides which x-axis labels to render so dense data doesn't overlap: show
 * every label when there are 6 or fewer points, otherwise thin them out
 * while always keeping the last one visible.
 */
export function shouldShowXLabel(index, count) {
    if (count <= 6) return true;
    return index % Math.ceil(count / 4) === 0 || index === count - 1;
}
