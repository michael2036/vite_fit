import { makeScales, buildLinePath, buildAreaPath, shouldShowXLabel } from './chartMath';

const WIDTH = 380;
const HEIGHT = 180;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 25;
const PADDING_RIGHT = 15;

/**
 * A line chart with an area fill underneath, used for both the Max Weight
 * progression chart and the Score Trend chart on the Analytics tab. The two
 * differ only in domain, color, grid ticks, and whether points get a value
 * label — everything else (scaling, path building, label thinning) is
 * shared via chartMath.js.
 */
export default function LineChart({
    data, // [{ date: string, value: number }]
    color,
    gradientId,
    domain, // { min, max }
    gridTicks, // raw values to draw horizontal gridlines + labels at
    formatGridLabel,
    formatPointLabel,
    showPointLabels = false,
    title,
    headerRight = null,
    emptyState = null,
    paddingLeft = 35,
}) {
    if (data.length === 0) {
        return emptyState;
    }

    const values = data.map((d) => d.value);
    const { getX, getY } = makeScales({
        width: WIDTH, height: HEIGHT,
        paddingLeft, paddingRight: PADDING_RIGHT, paddingTop: PADDING_TOP, paddingBottom: PADDING_BOTTOM,
        count: data.length, minVal: domain.min, maxVal: domain.max,
    });

    const linePath = buildLinePath(values, getX, getY);
    const areaPath = buildAreaPath(linePath, data.length, getX, HEIGHT - PADDING_BOTTOM);

    return (
        <div className="bg-ios-card rounded-2xl p-4 border border-white/5 shadow-lg relative">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                    {title}
                </h4>
                {headerRight}
            </div>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto overflow-visible">
                {/* Horizontal grid lines */}
                {gridTicks.map((tickValue, i) => {
                    const y = getY(tickValue);
                    return (
                        <g key={i} className="opacity-25">
                            <line x1={paddingLeft} y1={y} x2={WIDTH - PADDING_RIGHT} y2={y} stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3 3" />
                            <text x={paddingLeft - 5} y={y + 3} fill="#8E8E93" fontSize="9" textAnchor="end" fontWeight="600">{formatGridLabel(tickValue)}</text>
                        </g>
                    );
                })}

                {/* Area under line */}
                <path d={areaPath} fill={`url(#${gradientId})`} className="opacity-20" />

                {/* Line path */}
                <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points & value labels */}
                {data.map((d, idx) => {
                    const x = getX(idx);
                    const y = getY(d.value);
                    const isLabeledPoint = idx === data.length - 1 || idx === 0 || idx === Math.floor(data.length / 2);
                    return (
                        <g key={idx}>
                            <circle cx={x} cy={y} r="4.5" fill={color} stroke="#1C1C1E" strokeWidth="1.5" />
                            {showPointLabels && isLabeledPoint && (
                                <text x={x} y={y - 10} fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                                    {formatPointLabel(d.value)}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* X axis labels */}
                {data.map((d, idx) => (
                    shouldShowXLabel(idx, data.length) && (
                        <text key={idx} x={getX(idx)} y={HEIGHT - 5} fill="#8E8E93" fontSize="9" fontWeight="600" textAnchor="middle">
                            {d.date}
                        </text>
                    )
                ))}

                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor="#000000" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
