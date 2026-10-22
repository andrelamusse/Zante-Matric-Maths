import React, { useState } from 'react';

export interface TrigDiagramProps {
  type?: 'cast_circle' | 'soh_cah_toa' | 'wave_graphs';
  params?: {
    angleDeg?: number;
    showCoordinates?: boolean;
    amplitude?: number;
    period?: number;
  };
  className?: string;
}

export const TrigDiagram: React.FC<TrigDiagramProps> = ({
  type = 'cast_circle',
  params = {},
  className = '',
}) => {
  const [selectedAngle, setSelectedAngle] = useState(params.angleDeg ?? 40);

  // CAST Unit Circle Setup
  const cx = 200;
  const cy = 180;
  const radius = 120;
  const rad = (selectedAngle * Math.PI) / 180;
  const pointX = cx + radius * Math.cos(rad);
  const pointY = cy - radius * Math.sin(rad); // SVG Y inverted
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);

  // SOH-CAH-TOA Triangle
  const triWidth = 240;
  const triHeight = 160;
  const triBaseX = 70;
  const triBaseY = 240;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {type === 'cast_circle'
            ? `CAST Unit Circle (θ = ${selectedAngle}°, cos θ = ${cosVal.toFixed(3)}, sin θ = ${sinVal.toFixed(3)})`
            : type === 'soh_cah_toa'
            ? 'Right-Angled Triangle (SOH • CAH • TOA Definitions)'
            : 'Trigonometric Waves: y = sin(x) & y = cos(x)'}
        </span>
        {type === 'cast_circle' && (
          <div className="flex items-center gap-1">
            {[30, 45, 60, 120, 150, 210, 240, 315].map((ang) => (
              <button
                key={ang}
                type="button"
                onClick={() => setSelectedAngle(ang)}
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-all ${
                  selectedAngle === ang
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/80 hover:bg-white text-slate-600'
                }`}
              >
                {ang}°
              </button>
            ))}
          </div>
        )}
      </div>

      {type === 'cast_circle' && (
        <svg viewBox="0 0 400 360" className="w-full h-auto select-none">
          {/* Quadrant Tint Fills */}
          <rect x={cx} y={cy - radius - 15} width={radius + 15} height={radius + 15} fill="rgba(56, 189, 248, 0.08)" />
          <rect x={cx - radius - 15} y={cy - radius - 15} width={radius + 15} height={radius + 15} fill="rgba(255, 133, 179, 0.08)" />
          <rect x={cx - radius - 15} y={cy} width={radius + 15} height={radius + 15} fill="rgba(253, 186, 116, 0.08)" />
          <rect x={cx} y={cy} width={radius + 15} height={radius + 15} fill="rgba(192, 132, 252, 0.08)" />

          {/* Unit Circle */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#64748B" strokeWidth="1.8" />

          {/* Axes */}
          <line x1={30} y1={cy} x2={370} y2={cy} stroke="#475569" strokeWidth="1.5" />
          <line x1={cx} y1={20} x2={cx} y2={340} stroke="#475569" strokeWidth="1.5" />

          {/* Quadrant Letters: C - A - S - T */}
          <text x={cx + 65} y={cy - 65} fontSize="22" fontWeight="800" fill="#0284C7">A</text>
          <text x={cx - 85} y={cy - 65} fontSize="22" fontWeight="800" fill="#EC4899">S</text>
          <text x={cx - 85} y={cy + 85} fontSize="22" fontWeight="800" fill="#D97706">T</text>
          <text x={cx + 65} y={cy + 85} fontSize="22" fontWeight="800" fill="#7C3AED">C</text>

          {/* Quadrant descriptions */}
          <text x={cx + 60} y={cy - 48} fontSize="9" fill="#0284C7">All (+)</text>
          <text x={cx - 95} y={cy - 48} fontSize="9" fill="#EC4899">Sin (+)</text>
          <text x={cx - 95} y={cy + 102} fontSize="9" fill="#D97706">Tan (+)</text>
          <text x={cx + 60} y={cy + 102} fontSize="9" fill="#7C3AED">Cos (+)</text>

          {/* Angle Arc */}
          <path
            d={`M ${cx + 30} ${cy} A 30 30 0 ${selectedAngle > 180 ? 1 : 0} 0 ${
              cx + 30 * Math.cos(rad)
            } ${cy - 30 * Math.sin(rad)}`}
            fill="none"
            stroke="#EC4899"
            strokeWidth="2"
          />
          <text x={cx + 34} y={cy - 10} fontSize="11" fontWeight="bold" fill="#EC4899">
            θ = {selectedAngle}°
          </text>

          {/* Projected Right Triangle: Adjacent (X) & Opposite (Y) */}
          <line x1={cx} y1={cy} x2={pointX} y2={cy} stroke="#0284C7" strokeWidth="2.5" />
          <line x1={pointX} y1={cy} x2={pointX} y2={pointY} stroke="#EC4899" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Radius Arm (Hypotenuse) */}
          <line x1={cx} y1={cy} x2={pointX} y2={pointY} stroke="#10B981" strokeWidth="2.5" />

          {/* Point P(cos θ, sin θ) */}
          <circle cx={pointX} cy={pointY} r={6} fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
          <text
            x={pointX + (cosVal >= 0 ? 8 : -95)}
            y={pointY + (sinVal >= 0 ? -10 : 20)}
            fontSize="11"
            fontWeight="bold"
            fill="#0F172A"
            className="bg-white"
          >
            P({cosVal.toFixed(2)}, {sinVal.toFixed(2)})
          </text>
        </svg>
      )}

      {type === 'soh_cah_toa' && (
        <svg viewBox="0 0 420 300" className="w-full h-auto select-none">
          {/* Triangle ABC */}
          {/* A is at (triBaseX, triBaseY), C is at (triBaseX + triWidth, triBaseY), B is at (triBaseX + triWidth, triBaseY - triHeight) */}
          <polygon
            points={`${triBaseX},${triBaseY} ${triBaseX + triWidth},${triBaseY} ${triBaseX + triWidth},${triBaseY - triHeight}`}
            fill="rgba(192, 132, 252, 0.08)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Right angle indicator at C */}
          <path
            d={`M ${triBaseX + triWidth - 16} ${triBaseY} L ${triBaseX + triWidth - 16} ${triBaseY - 16} L ${triBaseX + triWidth} ${triBaseY - 16}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Color-coded sides */}
          {/* Adjacent AC */}
          <line
            x1={triBaseX}
            y1={triBaseY}
            x2={triBaseX + triWidth}
            y2={triBaseY}
            stroke="#0284C7"
            strokeWidth="3.5"
          />
          {/* Opposite BC */}
          <line
            x1={triBaseX + triWidth}
            y1={triBaseY}
            x2={triBaseX + triWidth}
            y2={triBaseY - triHeight}
            stroke="#EC4899"
            strokeWidth="3.5"
          />
          {/* Hypotenuse AB */}
          <line
            x1={triBaseX}
            y1={triBaseY}
            x2={triBaseX + triWidth}
            y2={triBaseY - triHeight}
            stroke="#059669"
            strokeWidth="3.5"
          />

          {/* Angle theta arc at A */}
          <path
            d={`M ${triBaseX + 35} ${triBaseY} A 35 35 0 0 0 ${triBaseX + 30} ${triBaseY - 18}`}
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2"
          />
          <text x={triBaseX + 42} y={triBaseY - 8} fontSize="13" fontWeight="bold" fill="#7C3AED">
            θ
          </text>

          {/* Side Labels */}
          <text x={triBaseX + triWidth / 2 - 25} y={triBaseY + 22} fontSize="12" fontWeight="bold" fill="#0284C7">
            Adjacent (A)
          </text>
          <text x={triBaseX + triWidth + 10} y={triBaseY - triHeight / 2} fontSize="12" fontWeight="bold" fill="#EC4899">
            Opposite (O)
          </text>
          <text
            x={triBaseX + triWidth / 2 - 40}
            y={triBaseY - triHeight / 2 - 15}
            fontSize="12"
            fontWeight="bold"
            fill="#059669"
          >
            Hypotenuse (H)
          </text>

          {/* SOH CAH TOA Formulas Box */}
          <g transform="translate(40, 20)">
            <rect x="0" y="0" width="340" height="40" rx="10" fill="rgba(255, 255, 255, 0.85)" stroke="#E2E8F0" />
            <text x="20" y="25" fontSize="12" fontWeight="bold" fill="#EC4899">sin θ = O / H</text>
            <text x="135" y="25" fontSize="12" fontWeight="bold" fill="#0284C7">cos θ = A / H</text>
            <text x="250" y="25" fontSize="12" fontWeight="bold" fill="#7C3AED">tan θ = O / A</text>
          </g>
        </svg>
      )}

      {type === 'wave_graphs' && (
        <svg viewBox="0 0 460 220" className="w-full h-auto select-none">
          {/* Horizontal Axis: 0 to 360 deg */}
          <line x1={40} y1={110} x2={430} y2={110} stroke="#64748B" strokeWidth="1.5" />
          <line x1={50} y1={20} x2={50} y2={200} stroke="#64748B" strokeWidth="1.5" />

          {/* Ticks and Labels: 0, 90, 180, 270, 360 */}
          {[
            { deg: 0, x: 50 },
            { deg: 90, x: 140 },
            { deg: 180, x: 230 },
            { deg: 270, x: 320 },
            { deg: 360, x: 410 },
          ].map((tick) => (
            <g key={tick.deg}>
              <line x1={tick.x} y1={106} x2={tick.x} y2={114} stroke="#64748B" strokeWidth="1.5" />
              <text x={tick.x} y={130} fontSize="10" textAnchor="middle" fill="#64748B">
                {tick.deg}°
              </text>
            </g>
          ))}

          {/* Y values: +1 and -1 */}
          <text x={34} y={54} fontSize="10" textAnchor="end" fill="#64748B">+1</text>
          <text x={34} y={174} fontSize="10" textAnchor="end" fill="#64748B">-1</text>
          <line x1={46} y1={50} x2={430} y2={50} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <line x1={46} y1={170} x2={430} y2={170} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />

          {/* Sine Wave: y = sin x */}
          <path
            d="M 50 110 Q 95 50 140 50 Q 185 50 230 110 Q 275 170 320 170 Q 365 170 410 110"
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.5"
          />

          {/* Cosine Wave: y = cos x */}
          <path
            d="M 50 50 Q 95 50 140 110 Q 185 170 230 170 Q 275 170 320 110 Q 365 50 410 50"
            fill="none"
            stroke="#EC4899"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Legend */}
          <g transform="translate(280, 25)">
            <line x1="0" y1="0" x2="20" y2="0" stroke="#0284C7" strokeWidth="2.5" />
            <text x="25" y="4" fontSize="10" fontWeight="bold" fill="#0284C7">y = sin(x)</text>
            <line x1="85" y1="0" x2="105" y2="0" stroke="#EC4899" strokeWidth="2" strokeDasharray="4 3" />
            <text x="110" y="4" fontSize="10" fontWeight="bold" fill="#EC4899">y = cos(x)</text>
          </g>
        </svg>
      )}
    </div>
  );
};

export default TrigDiagram;
