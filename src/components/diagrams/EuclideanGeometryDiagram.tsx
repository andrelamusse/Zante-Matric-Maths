import React, { useState } from 'react';

export type EuclideanTheoremType =
  | 'center_chord'
  | 'angle_at_centre'
  | 'angles_same_segment'
  | 'cyclic_quad'
  | 'tan_chord'
  | 'proportionality';

export interface EuclideanGeometryDiagramProps {
  type?: EuclideanTheoremType;
  params?: {
    centerAngleDeg?: number;
    cyclicAngleA?: number;
    showReasons?: boolean;
  };
  className?: string;
}

export const EuclideanGeometryDiagram: React.FC<EuclideanGeometryDiagramProps> = ({
  type = 'angle_at_centre',
  params = {},
  className = '',
}) => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const cx = 200;
  const cy = 180;
  const r = 125;

  const centerAngle = params.centerAngleDeg ?? 80;
  const circumfAngle = centerAngle / 2;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {type === 'center_chord'
            ? 'Theorem: Line from centre to midpoint of chord (OM ⊥ AB)'
            : type === 'angle_at_centre'
            ? `Theorem: ∠ at centre = 2 × ∠ at circumf (2θ = ${centerAngle}°, θ = ${circumfAngle}°)`
            : type === 'angles_same_segment'
            ? 'Theorem: Angles subtended by same arc in same segment (∠APB = ∠AQB)'
            : type === 'cyclic_quad'
            ? 'Theorem: Opposite angles of cyclic quad are supplementary (A + C = 180°)'
            : type === 'tan_chord'
            ? 'Theorem: Tangent-Chord Theorem (∠FTA = ∠TBA)'
            : 'Theorem: Line parallel to one side of triangle divides sides proportionally'}
        </span>
        {activeElement && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {activeElement}
          </span>
        )}
      </div>

      <svg viewBox="0 0 400 360" className="w-full h-auto select-none">
        {/* Circle Base (for circle geometry theorems) */}
        {type !== 'proportionality' && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(56, 189, 248, 0.05)"
            stroke="#475569"
            strokeWidth="2"
          />
        )}

        {/* 1. Center & Chord Theorem */}
        {type === 'center_chord' && (
          <>
            {/* Chord AB */}
            <line x1={cx - 100} y1={cy + 60} x2={cx + 100} y2={cy + 60} stroke="#7C3AED" strokeWidth="2.5" />

            {/* Center O */}
            <circle cx={cx} cy={cy} r={5} fill="#0284C7" />
            <text x={cx + 8} y={cy - 4} fontSize="12" fontWeight="bold" fill="#0284C7">O</text>

            {/* Perpendicular bisector OM */}
            <line x1={cx} y1={cy} x2={cx} y2={cy + 60} stroke="#EC4899" strokeWidth="2.5" />

            {/* Midpoint M */}
            <circle cx={cx} cy={cy + 60} r={4.5} fill="#EC4899" />
            <text x={cx + 8} y={cy + 78} fontSize="12" fontWeight="bold" fill="#EC4899">M</text>

            {/* Right-angle 90° box at M */}
            <path
              d={`M ${cx - 14} ${cy + 60} L ${cx - 14} ${cy + 46} L ${cx} ${cy + 46}`}
              fill="none"
              stroke="#EC4899"
              strokeWidth="1.5"
            />

            {/* Equal hash marks on AM and MB */}
            <line x1={cx - 50} y1={cy + 54} x2={cx - 50} y2={cy + 66} stroke="#7C3AED" strokeWidth="2" />
            <line x1={cx - 53} y1={cy + 54} x2={cx - 53} y2={cy + 66} stroke="#7C3AED" strokeWidth="2" />

            <line x1={cx + 50} y1={cy + 54} x2={cx + 50} y2={cy + 66} stroke="#7C3AED" strokeWidth="2" />
            <line x1={cx + 53} y1={cy + 54} x2={cx + 53} y2={cy + 66} stroke="#7C3AED" strokeWidth="2" />

            {/* Labels A and B */}
            <text x={cx - 118} y={cy + 65} fontSize="12" fontWeight="bold" fill="#475569">A</text>
            <text x={cx + 108} y={cy + 65} fontSize="12" fontWeight="bold" fill="#475569">B</text>

            {/* Reason Pill */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveElement('DBE Reason: line from centre to midpt of chord')}
              onMouseLeave={() => setActiveElement(null)}
              transform="translate(80, 20)"
            >
              <rect x="0" y="0" width="240" height="30" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="#CBD5E1" />
              <text x="120" y="20" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#047857">
                line from centre to midpt of chord [✓]
              </text>
            </g>
          </>
        )}

        {/* 2. Angle at Centre vs Circumference */}
        {type === 'angle_at_centre' && (
          <>
            {/* Chord / Arc points A, B */}
            {/* Center O is at (cx, cy) */}
            {/* Point P is at top (cx, cy - r) */}
            {/* A is at (cx - 95, cy + 80), B is at (cx + 95, cy + 80) */}
            {/* Center Angle Lines OA, OB */}
            <line x1={cx} y1={cy} x2={cx - 95} y2={cy + 80} stroke="#EC4899" strokeWidth="2.5" />
            <line x1={cx} y1={cy} x2={cx + 95} y2={cy + 80} stroke="#EC4899" strokeWidth="2.5" />

            {/* Circumference Angle Lines PA, PB */}
            <line x1={cx} y1={cy - r} x2={cx - 95} y2={cy + 80} stroke="#0284C7" strokeWidth="2" strokeDasharray="4 2" />
            <line x1={cx} y1={cy - r} x2={cx + 95} y2={cy + 80} stroke="#0284C7" strokeWidth="2" strokeDasharray="4 2" />

            {/* Center Angle Arc */}
            <path
              d={`M ${cx - 25} ${cy + 22} A 30 30 0 0 0 ${cx + 25} ${cy + 22}`}
              fill="none"
              stroke="#EC4899"
              strokeWidth="2.5"
            />
            <text x={cx} y={cy + 42} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#EC4899">
              2θ = {centerAngle}°
            </text>

            {/* Circumference Angle Arc at P */}
            <path
              d={`M ${cx - 15} ${cy - r + 30} A 30 30 0 0 0 ${cx + 15} ${cy - r + 30}`}
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
            />
            <text x={cx} y={cy - r + 46} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284C7">
              θ = {circumfAngle}°
            </text>

            {/* Points O, P, A, B */}
            <circle cx={cx} cy={cy} r={5} fill="#EC4899" />
            <text x={cx + 8} y={cy - 2} fontSize="11" fontWeight="bold" fill="#EC4899">O (Centre)</text>

            <circle cx={cx} cy={cy - r} r={5} fill="#0284C7" />
            <text x={cx - 2} y={cy - r - 8} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0284C7">P</text>

            <circle cx={cx - 95} cy={cy + 80} r={4.5} fill="#475569" />
            <text x={cx - 110} y={cy + 92} fontSize="12" fontWeight="bold" fill="#475569">A</text>

            <circle cx={cx + 95} cy={cy + 80} r={4.5} fill="#475569" />
            <text x={cx + 104} y={cy + 92} fontSize="12" fontWeight="bold" fill="#475569">B</text>

            {/* Reason Pill */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveElement('DBE Reason: ∠ at centre = 2 × ∠ at circumf')}
              onMouseLeave={() => setActiveElement(null)}
              transform="translate(70, 20)"
            >
              <rect x="0" y="0" width="260" height="30" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="#CBD5E1" />
              <text x="130" y="20" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#047857">
                ∠ at centre = 2 × ∠ at circumf [✓]
              </text>
            </g>
          </>
        )}

        {/* 3. Angles in Same Segment */}
        {type === 'angles_same_segment' && (
          <>
            {/* Chord AB at bottom */}
            {/* Points P and Q on top circumference */}
            {/* A: (cx - 90, cy + 85), B: (cx + 90, cy + 85) */}
            {/* P: (cx - 70, cy - 100), Q: (cx + 70, cy - 100) */}
            <line x1={cx - 90} y1={cy + 85} x2={cx + 90} y2={cy + 85} stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />

            {/* Subtended lines to P */}
            <line x1={cx - 90} y1={cy + 85} x2={cx - 70} y2={cy - 100} stroke="#EC4899" strokeWidth="2.5" />
            <line x1={cx + 90} y1={cy + 85} x2={cx - 70} y2={cy - 100} stroke="#EC4899" strokeWidth="2.5" />

            {/* Subtended lines to Q */}
            <line x1={cx - 90} y1={cy + 85} x2={cx + 70} y2={cy - 100} stroke="#0284C7" strokeWidth="2.5" />
            <line x1={cx + 90} y1={cy + 85} x2={cx + 70} y2={cy - 100} stroke="#0284C7" strokeWidth="2.5" />

            {/* Equal Angles at P and Q */}
            <text x={cx - 70} y={cy - 108} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#EC4899">P (θ)</text>
            <text x={cx + 70} y={cy - 108} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0284C7">Q (θ)</text>

            <circle cx={cx - 70} cy={cy - 100} r={5} fill="#EC4899" />
            <circle cx={cx + 70} cy={cy - 100} r={5} fill="#0284C7" />
            <circle cx={cx - 90} cy={cy + 85} r={4.5} fill="#475569" />
            <circle cx={cx + 90} cy={cy + 85} r={4.5} fill="#475569" />

            <text x={cx - 106} y={cy + 95} fontSize="12" fontWeight="bold" fill="#475569">A</text>
            <text x={cx + 96} y={cy + 95} fontSize="12" fontWeight="bold" fill="#475569">B</text>

            {/* Reason Pill */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveElement('DBE Reason: ∠s in same seg')}
              onMouseLeave={() => setActiveElement(null)}
              transform="translate(90, 20)"
            >
              <rect x="0" y="0" width="220" height="30" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="#CBD5E1" />
              <text x="110" y="20" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#047857">
                ∠s in same seg [✓]
              </text>
            </g>
          </>
        )}

        {/* 4. Cyclic Quadrilateral */}
        {type === 'cyclic_quad' && (
          <>
            {/* Vertices A, B, C, D on circle */}
            {/* A: (cx - 80, cy - 95), B: (cx + 80, cy - 95), C: (cx + 105, cy + 65), D: (cx - 105, cy + 65) */}
            {/* Extended side BC to E */}
            <polygon
              points={`${cx - 80},${cy - 95} ${cx + 80},${cy - 95} ${cx + 105},${cy + 65} ${cx - 105},${cy + 65}`}
              fill="rgba(192, 132, 252, 0.12)"
              stroke="#7C3AED"
              strokeWidth="2.5"
            />

            {/* Exterior Extension past C */}
            <line x1={cx + 105} y1={cy + 65} x2={cx + 155} y2={cy + 115} stroke="#EC4899" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx={cx + 155} cy={cy + 115} r={4} fill="#EC4899" />
            <text x={cx + 162} y={cy + 120} fontSize="11" fontWeight="bold" fill="#EC4899">E</text>

            {/* Vertices Markers */}
            <circle cx={cx - 80} cy={cy - 95} r={5} fill="#7C3AED" />
            <text x={cx - 96} y={cy - 102} fontSize="12" fontWeight="bold" fill="#7C3AED">A (72°)</text>

            <circle cx={cx + 80} cy={cy - 95} r={5} fill="#7C3AED" />
            <text x={cx + 88} y={cy - 102} fontSize="12" fontWeight="bold" fill="#7C3AED">B</text>

            <circle cx={cx + 105} cy={cy + 65} r={5} fill="#EC4899" />
            <text x={cx + 112} y={cy + 55} fontSize="12" fontWeight="bold" fill="#EC4899">C</text>

            <circle cx={cx - 105} cy={cy + 65} r={5} fill="#0284C7" />
            <text x={cx - 116} y={cy + 82} fontSize="12" fontWeight="bold" fill="#0284C7">D (108°)</text>

            {/* Reason Pill */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveElement('DBE Reason: opp ∠s of cyclic quad (suppl) / ext ∠ of cyclic quad')}
              onMouseLeave={() => setActiveElement(null)}
              transform="translate(70, 20)"
            >
              <rect x="0" y="0" width="260" height="30" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="#CBD5E1" />
              <text x="130" y="20" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#047857">
                opp ∠s of cyclic quad (suppl) [✓]
              </text>
            </g>
          </>
        )}

        {/* 5. Tangent-Chord Theorem */}
        {type === 'tan_chord' && (
          <>
            {/* Tangent line at T (bottom cx, cy + r) */}
            <line x1={cx - 140} y1={cy + r} x2={cx + 140} y2={cy + r} stroke="#10B981" strokeWidth="2.5" />
            <text x={cx - 150} y={cy + r + 4} fontSize="12" fontWeight="bold" fill="#10B981">E</text>
            <text x={cx + 145} y={cy + r + 4} fontSize="12" fontWeight="bold" fill="#10B981">F</text>

            {/* Point of contact T */}
            <circle cx={cx} cy={cy + r} r={5.5} fill="#10B981" />
            <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10B981">T</text>

            {/* Chord TA */}
            <line x1={cx} y1={cy + r} x2={cx - 90} y2={cy - 85} stroke="#EC4899" strokeWidth="2.5" />
            <circle cx={cx - 90} cy={cy - 85} r={5} fill="#EC4899" />
            <text x={cx - 105} y={cy - 90} fontSize="12" fontWeight="bold" fill="#EC4899">A</text>

            {/* Point B in alternate segment */}
            <circle cx={cx + 90} cy={cy - 85} r={5} fill="#0284C7" />
            <text x={cx + 98} y={cy - 90} fontSize="12" fontWeight="bold" fill="#0284C7">B (θ)</text>

            {/* Subtended lines AB and TB */}
            <line x1={cx - 90} y1={cy - 85} x2={cx + 90} y2={cy - 85} stroke="#475569" strokeWidth="2" />
            <line x1={cx} y1={cy + r} x2={cx + 90} y2={cy - 85} stroke="#0284C7" strokeWidth="2" />

            {/* Highlighted Angle between Tangent and Chord: ∠FTA */}
            <path
              d={`M ${cx - 30} ${cy + r} A 30 30 0 0 0 ${cx - 20} ${cy + r - 22}`}
              fill="none"
              stroke="#EC4899"
              strokeWidth="2.5"
            />
            <text x={cx - 50} y={cy + r - 10} fontSize="11" fontWeight="bold" fill="#EC4899">θ</text>

            {/* Reason Pill */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveElement('DBE Reason: tan chord thm')}
              onMouseLeave={() => setActiveElement(null)}
              transform="translate(90, 20)"
            >
              <rect x="0" y="0" width="220" height="30" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="#CBD5E1" />
              <text x="110" y="20" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#047857">
                tan chord thm [✓]
              </text>
            </g>
          </>
        )}

        {/* 6. Triangle Proportionality */}
        {type === 'proportionality' && (
          <>
            {/* Triangle ABC */}
            {/* A: (200, 60), B: (90, 280), C: (310, 280) */}
            <polygon points="200,60 90,280 310,280" fill="rgba(192, 132, 252, 0.08)" stroke="#475569" strokeWidth="2" />

            {/* Line DE parallel to BC */}
            {/* D is on AB at y=170, E is on AC at y=170 */}
            <line x1={145} y1={170} x2={255} y2={170} stroke="#10B981" strokeWidth="3" />

            {/* Parallel Arrowheads on DE and BC */}
            <path d="M 195 167 L 205 170 L 195 173" fill="none" stroke="#10B981" strokeWidth="2.5" />
            <path d="M 195 277 L 205 280 L 195 283" fill="none" stroke="#475569" strokeWidth="2.5" />

            {/* Points A, B, C, D, E */}
            <circle cx={200} cy={60} r={5} fill="#475569" />
            <text x={200} y={48} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">A</text>

            <circle cx={90} cy={280} r={5} fill="#475569" />
            <text x={75} y={292} fontSize="12" fontWeight="bold" fill="#475569">B</text>

            <circle cx={310} cy={280} r={5} fill="#475569" />
            <text x={318} y={292} fontSize="12" fontWeight="bold" fill="#475569">C</text>

            <circle cx={145} cy={170} r={4.5} fill="#10B981" />
            <text x={128} y={172} fontSize="12" fontWeight="bold" fill="#10B981">D</text>

            <circle cx={255} cy={170} r={4.5} fill="#10B981" />
            <text x={265} y={172} fontSize="12" fontWeight="bold" fill="#10B981">E</text>

            {/* Segment Ratio Annotation */}
            <text x={200} y={225} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#047857">
              AD / DB = AE / EC
            </text>

            {/* Reason Pill */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveElement('DBE Reason: line ∥ one side of △')}
              onMouseLeave={() => setActiveElement(null)}
              transform="translate(80, 15)"
            >
              <rect x="0" y="0" width="240" height="30" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="#CBD5E1" />
              <text x="120" y="20" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#047857">
                line ∥ one side of △ [✓]
              </text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

export default EuclideanGeometryDiagram;
