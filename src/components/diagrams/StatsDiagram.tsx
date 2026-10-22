import React, { useState } from 'react';

export interface StatsDiagramProps {
  type?: 'box_plot' | 'ogive';
  params?: {
    min?: number;
    q1?: number;
    median?: number;
    q3?: number;
    max?: number;
    outliers?: number[];
    ogivePoints?: Array<{ x: number; y: number }>;
    totalN?: number;
  };
  className?: string;
}

export const StatsDiagram: React.FC<StatsDiagramProps> = ({
  type = 'box_plot',
  params = {},
  className = '',
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  // Five-number summary defaults
  const min = params.min ?? 12;
  const q1 = params.q1 ?? 28;
  const median = params.median ?? 45;
  const q3 = params.q3 ?? 68;
  const max = params.max ?? 92;
  const outliers = params.outliers ?? [];
  const iqr = q3 - q1;

  // Box plot dimensions
  const width = 460;
  const height = 150;
  const padding = 45;
  const dataRange = max - min || 1;
  const scale = (val: number) => padding + ((val - min) / dataRange) * (width - 2 * padding);
  const yCenter = 70;
  const boxHeight = 44;

  const minX = scale(min);
  const q1X = scale(q1);
  const medX = scale(median);
  const q3X = scale(q3);
  const maxX = scale(max);

  // Ogive Points defaults
  const ogivePoints = params.ogivePoints ?? [
    { x: 10, y: 0 },
    { x: 20, y: 8 },
    { x: 30, y: 22 },
    { x: 40, y: 46 },
    { x: 50, y: 74 },
    { x: 60, y: 90 },
    { x: 70, y: 100 },
  ];
  const totalN = params.totalN ?? 100;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {type === 'box_plot'
            ? `Five-Number Summary (Min: ${min}, Q1: ${q1}, Median: ${median}, Q3: ${q3}, Max: ${max}, IQR: ${iqr})`
            : `Cumulative Frequency Ogive (n = ${totalN})`}
        </span>
        {hovered && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
            {hovered}
          </span>
        )}
      </div>

      {type === 'box_plot' ? (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Calibrated Axis line */}
          <line x1={padding - 10} y1={120} x2={width - padding + 10} y2={120} stroke="#94A3B8" strokeWidth="1.5" />

          {/* Left Whisker */}
          <line x1={minX} y1={yCenter} x2={q1X} y2={yCenter} stroke="#334155" strokeWidth="2" />
          <line x1={minX} y1={yCenter - 14} x2={minX} y2={yCenter + 14} stroke="#334155" strokeWidth="2.5" />

          {/* IQR Box */}
          <rect
            x={q1X}
            y={yCenter - boxHeight / 2}
            width={q3X - q1X}
            height={boxHeight}
            rx={6}
            fill="rgba(192, 132, 252, 0.20)"
            stroke="#7C3AED"
            strokeWidth="2"
            className="cursor-pointer transition-colors hover:fill-violet-200/40"
            onMouseEnter={() => setHovered(`IQR = Q3 - Q1 = ${q3} - ${q1} = ${iqr}`)}
            onMouseLeave={() => setHovered(null)}
          />

          {/* Median Line */}
          <line
            x1={medX}
            y1={yCenter - boxHeight / 2}
            x2={medX}
            y2={yCenter + boxHeight / 2}
            stroke="#EC4899"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Right Whisker */}
          <line x1={q3X} y1={yCenter} x2={maxX} y2={yCenter} stroke="#334155" strokeWidth="2" />
          <line x1={maxX} y1={yCenter - 14} x2={maxX} y2={yCenter + 14} stroke="#334155" strokeWidth="2.5" />

          {/* Outliers */}
          {outliers.map((val, idx) => {
            const ox = scale(val);
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(`Outlier: ${val}`)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle cx={ox} cy={yCenter} r={4.5} fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x={ox} y={yCenter - 10} fontSize="10" textAnchor="middle" fill="#EF4444" fontWeight="bold">
                  *
                </text>
              </g>
            );
          })}

          {/* Axis Value Labels */}
          <text x={minX} y={138} textAnchor="middle" fontSize="11" fill="#64748B" fontWeight="600">
            {min}
          </text>
          <text x={q1X} y={32} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7C3AED">
            Q1={q1}
          </text>
          <text x={medX} y={32} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#EC4899">
            M={median}
          </text>
          <text x={q3X} y={32} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7C3AED">
            Q3={q3}
          </text>
          <text x={maxX} y={138} textAnchor="middle" fontSize="11" fill="#64748B" fontWeight="600">
            {max}
          </text>

          {/* Ticks on axis */}
          <line x1={minX} y1={116} x2={minX} y2={124} stroke="#94A3B8" strokeWidth="1.5" />
          <line x1={q1X} y1={116} x2={q1X} y2={124} stroke="#94A3B8" strokeWidth="1.5" />
          <line x1={medX} y1={116} x2={medX} y2={124} stroke="#94A3B8" strokeWidth="1.5" />
          <line x1={q3X} y1={116} x2={q3X} y2={124} stroke="#94A3B8" strokeWidth="1.5" />
          <line x1={maxX} y1={116} x2={maxX} y2={124} stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 460 260" className="w-full h-auto select-none">
          {/* Ogive Axes */}
          <line x1={50} y1={220} x2={430} y2={220} stroke="#64748B" strokeWidth="1.5" />
          <line x1={50} y1={20} x2={50} y2={220} stroke="#64748B" strokeWidth="1.5" />

          {/* Y Axis labels: 25%, 50%, 75%, 100% */}
          {[
            { label: 'n/4', y: 170, color: '#7C3AED' },
            { label: 'n/2 (Median)', y: 120, color: '#EC4899' },
            { label: '3n/4', y: 70, color: '#7C3AED' },
            { label: 'n', y: 30, color: '#0F172A' },
          ].map((level, idx) => (
            <g key={idx}>
              <text x={44} y={level.y + 4} textAnchor="end" fontSize="10" fill={level.color} fontWeight="600">
                {level.label}
              </text>
              <line x1={50} y1={level.y} x2={430} y2={level.y} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
            </g>
          ))}

          {/* Smooth Ogive Curve */}
          <path
            d="M 50 220 C 130 215 170 190 220 120 C 270 50 340 35 410 30"
            fill="none"
            stroke="#0284C7"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Median Projection Downward */}
          <line x1={220} y1={120} x2={220} y2={220} stroke="#EC4899" strokeWidth="1.8" strokeDasharray="4 3" />
          <circle cx={220} cy={120} r={5} fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
          <text x={220} y={236} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#EC4899">
            Median
          </text>
        </svg>
      )}
    </div>
  );
};

export default StatsDiagram;
