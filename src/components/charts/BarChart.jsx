import { makeScales, shouldShowXLabel } from './chartMath';

const WIDTH = 380;
const HEIGHT = 180;
const PADDING_LEFT = 38;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 25;
const PADDING_RIGHT = 15;

/** A simple bar chart, used for the Session Volume chart on the Analytics tab. */
export default function BarChart({
    data, // [{ date: string, value: number }]
    color,
    domain, // { min, max }
    gridTicks,
    formatGridLabel,
    title,
    emptyState = null,
}) {
    if (data.length === 0) {
        return emptyState;
    }

    const { getX, getY } = makeScales({
        width: WIDTH, height: HEIGHT,
        paddingLeft: PADDING_LEFT, paddingRight: PADDING_RIGHT, paddingTop: PADDING_TOP, paddingBottom: PADDING_BOTTOM,
        count: data.length, minVal: domain.min, maxVal: domain.max,
    });

    const barWidth = Math.max(2, Math.min(16, (WIDTH - PADDING_LEFT - PADDING_RIGHT) / (data.length * 1.5)));
    const baselineY = HEIGHT - PADDING_BOTTOM;

    return (
        <div className="bg-ios-card rounded-2xl p-4 border border-white/5 shadow-lg">
            <h4 className="text-[14px] font-bold text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                {title}
            </h4>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto overflow-visible">
                {gridTicks.map((tickValue, i) => {
                    const y = getY(tickValue);
                    return (
                        <g key={i} className="opacity-25">
                            <line x1={PADDING_LEFT} y1={y} x2={WIDTH - PADDING_RIGHT} y2={y} stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="3 3" />
                            <text x={PADDING_LEFT - 5} y={y + 3} fill="#8E8E93" fontSize="9" textAnchor="end" fontWeight="600">{formatGridLabel(tickValue)}</text>
                        </g>
                    );
                })}

                {data.map((d, idx) => {
                    const x = getX(idx) - barWidth / 2;
                    const y = getY(d.value);
                    const barHeight = baselineY - y;
                    return (
                        <rect
                            key={idx}
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(1, barHeight)}
                            rx={barWidth / 3}
                            fill={color}
                            opacity="0.8"
                        />
                    );
                })}

                {data.map((d, idx) => (
                    shouldShowXLabel(idx, data.length) && (
                        <text key={idx} x={getX(idx)} y={HEIGHT - 5} fill="#8E8E93" fontSize="9" fontWeight="600" textAnchor="middle">
                            {d.date}
                        </text>
                    )
                ))}
            </svg>
        </div>
    );
}
