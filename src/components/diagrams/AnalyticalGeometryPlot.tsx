import React, { useState } from 'react';
import { createCoordinateMapper, ViewportDomain } from './FunctionPlot.tsx';

export interface AnalyticalGeometryPlotProps {
  type?: 'circle_tangent' | 'line_inclination';
  params?: {
    // Circle parameters
    centerX?: number;
    centerY?: number;
    radius?: number;
    contactAngleDeg?: number;
    // Line segment parameters
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    showAngle?: boolean;
  };
  domain?: Partial<ViewportDomain>;
  className?: string;
}

export const AnalyticalGeometryPlot: React.FC<AnalyticalGeometryPlotProps> = ({
  type = 'circle_tangent',
  params = {},
  domain: customDomain,
  className = '',
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const domain: ViewportDomain = {
    xMin: customDomain?.xMin ?? -7,
    xMax: customDomain?.xMax ?? 7,
    yMin: customDomain?.yMin ?? -6,
    yMax: customDomain?.yMax ?? 8,
    width: customDomain?.width ?? 460,
    height: customDomain?.height ?? 340,
  };

  const mapper = createCoordinateMapper(domain);
  const originX = mapper.toSvgX(0);
  const originY = mapper.toSvgY(0);

  // Circle Tangent Calculations
  const a = params.centerX ?? 1;
  const b = params.centerY ?? 2;
  const r = params.radius ?? 4;
  const angleDeg = params.contactAngleDeg ?? 45;
  const angleRad = (angleDeg * Math.PI) / 180;

  const contactX = a + r * Math.cos(angleRad);
  const contactY = b + r * Math.sin(angleRad);

  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);
  const isVerticalRadius = Math.abs(cosAngle) < 1e-5;
  const isHorizontalRadius = Math.abs(sinAngle) < 1e-5;

  const mRad = !isVerticalRadius ? sinAngle / cosAngle : 9999;
  // Protect against horizontal radius division-by-zero (mRad === 0 at 0°, 180°, 360°)
  const safeMRad = Math.abs(mRad) < 1e-4 ? (mRad >= 0 ? 1e-4 : -1e-4) : mRad;
  const mTan = isHorizontalRadius ? 9999 : isVerticalRadius ? 0 : -1 / safeMRad;

  // Tangent line end points
  const tDist = 5;
  const tanX1 = isHorizontalRadius ? contactX : contactX - tDist;
  const tanY1 = isHorizontalRadius ? contactY - tDist : contactY - tDist * mTan;
  const tanX2 = isHorizontalRadius ? contactX : contactX + tDist;
  const tanY2 = isHorizontalRadius ? contactY + tDist : contactY + tDist * mTan;

  // Right-angle square indicator at contact point
  const boxSize = 10;
  const uX = Math.cos(angleRad);
  const uY = Math.sin(angleRad);
  const pX = -uY;
  const pY = uX;

  const b1 = { x: contactX - uX * (boxSize / mapper.scaleX), y: contactY - uY * (boxSize / mapper.scaleY) };
  const b2 = { x: b1.x + pX * (boxSize / mapper.scaleX), y: b1.y + pY * (boxSize / mapper.scaleY) };
  const b3 = { x: contactX + pX * (boxSize / mapper.scaleX), y: contactY + pY * (boxSize / mapper.scaleY) };

  // Line inclination parameters
  const x1 = params.x1 ?? -3;
  const y1 = params.y1 ?? -1;
  const x2 = params.x2 ?? 4;
  const y2 = params.y2 ?? 5;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const lineDist = Math.hypot(x2 - x1, y2 - y1);
  const lineSlope = (y2 - y1) / (x2 - x1);
  let thetaDeg = (Math.atan(lineSlope) * 180) / Math.PI;
  if (thetaDeg < 0) thetaDeg += 180;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {type === 'circle_tangent'
            ? `Circle & Tangent: (x - ${a})² + (y - ${b})² = ${r * r} (r = ${r})`
            : `Line Segment AB: Inclination θ = ${thetaDeg.toFixed(1)}°, Distance d = ${lineDist.toFixed(2)}`}
        </span>
        {hovered && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
            {hovered}
          </span>
        )}
      </div>

      <svg viewBox={`0 0 ${domain.width} ${domain.height}`} className="w-full h-auto select-none overflow-visible">
        {/* Axes */}
        <line x1={0} y1={originY} x2={domain.width} y2={originY} stroke="#94A3B8" strokeWidth="1.2" />
        <line x1={originX} y1={domain.height} x2={originX} y2={0} stroke="#94A3B8" strokeWidth="1.2" />
        <text x={domain.width - 12} y={originY - 6} fontSize="11" fill="#64748B">x</text>
        <text x={originX + 6} y={12} fontSize="11" fill="#64748B">y</text>

        {type === 'circle_tangent' ? (
          <>
            {/* Circle perimeter and translucent fill */}
            <circle
              cx={mapper.toSvgX(a)}
              cy={mapper.toSvgY(b)}
              r={r * mapper.scaleX}
              fill="rgba(56, 189, 248, 0.08)"
              stroke="#0284C7"
              strokeWidth="2"
            />

            {/* Radius line from M(a, b) to P */}
            <line
              x1={mapper.toSvgX(a)}
              y1={mapper.toSvgY(b)}
              x2={mapper.toSvgX(contactX)}
              y2={mapper.toSvgY(contactY)}
              stroke="#EC4899"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Tangent line */}
            <line
              x1={mapper.toSvgX(tanX1)}
              y1={mapper.toSvgY(tanY1)}
              x2={mapper.toSvgX(tanX2)}
              y2={mapper.toSvgY(tanY2)}
              stroke="#10B981"
              strokeWidth="2.5"
            />

            {/* Right-angle 90° box */}
            <path
              d={`M ${mapper.toSvgX(contactX)} ${mapper.toSvgY(contactY)} L ${mapper.toSvgX(b1.x)} ${mapper.toSvgY(
                b1.y
              )} L ${mapper.toSvgX(b2.x)} ${mapper.toSvgY(b2.y)} L ${mapper.toSvgX(b3.x)} ${mapper.toSvgY(
                b3.y
              )} Z`}
              fill="rgba(236, 72, 153, 0.15)"
              stroke="#EC4899"
              strokeWidth="1.2"
            />

            {/* Center Point M */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHovered(`Centre M(${a}, ${b})`)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={mapper.toSvgX(a)} cy={mapper.toSvgY(b)} r={5} fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
              <text x={mapper.toSvgX(a) + 8} y={mapper.toSvgY(b) + 4} fontSize="11" fontWeight="bold" fill="#0284C7">
                M({a}, {b})
              </text>
            </g>

            {/* Contact Point P */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHovered(`Point of Contact P(${contactX.toFixed(1)}, ${contactY.toFixed(1)})`)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                cx={mapper.toSvgX(contactX)}
                cy={mapper.toSvgY(contactY)}
                r={5}
                fill="#EC4899"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x={mapper.toSvgX(contactX) + 8}
                y={mapper.toSvgY(contactY) - 6}
                fontSize="11"
                fontWeight="bold"
                fill="#EC4899"
              >
                P({contactX.toFixed(1)}, {contactY.toFixed(1)})
              </text>
            </g>

            {/* Tangent slope label */}
            <text
              x={mapper.toSvgX(tanX2) - 30}
              y={mapper.toSvgY(tanY2) - 8}
              fontSize="10"
              fontWeight="600"
              fill="#059669"
            >
              m_tan = {Math.abs(mTan) >= 9999 ? 'undef' : mTan.toFixed(2)}
            </text>
          </>
        ) : (
          <>
            {/* Line segment AB */}
            <line
              x1={mapper.toSvgX(x1)}
              y1={mapper.toSvgY(y1)}
              x2={mapper.toSvgX(x2)}
              y2={mapper.toSvgY(y2)}
              stroke="#7C3AED"
              strokeWidth="2.5"
            />

            {/* Horizontal baseline from A for inclination angle */}
            <line
              x1={mapper.toSvgX(x1)}
              y1={mapper.toSvgY(y1)}
              x2={mapper.toSvgX(x1 + 3.5)}
              y2={mapper.toSvgY(y1)}
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Inclination arc */}
            <circle
              cx={mapper.toSvgX(x1)}
              cy={mapper.toSvgY(y1)}
              r={24}
              fill="none"
              stroke="#EC4899"
              strokeWidth="1.5"
            />
            <text x={mapper.toSvgX(x1) + 28} y={mapper.toSvgY(y1) - 6} fontSize="11" fill="#EC4899" fontWeight="bold">
              θ = {thetaDeg.toFixed(1)}°
            </text>

            {/* Points A, B, Midpoint */}
            <circle cx={mapper.toSvgX(x1)} cy={mapper.toSvgY(y1)} r={5} fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            <text x={mapper.toSvgX(x1) - 16} y={mapper.toSvgY(y1) - 8} fontSize="11" fontWeight="bold" fill="#7C3AED">
              A({x1}, {y1})
            </text>

            <circle cx={mapper.toSvgX(x2)} cy={mapper.toSvgY(y2)} r={5} fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            <text x={mapper.toSvgX(x2) + 8} y={mapper.toSvgY(y2) + 4} fontSize="11" fontWeight="bold" fill="#7C3AED">
              B({x2}, {y2})
            </text>

            <circle cx={mapper.toSvgX(midX)} cy={mapper.toSvgY(midY)} r={4.5} fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
            <text x={mapper.toSvgX(midX) + 8} y={mapper.toSvgY(midY) - 6} fontSize="10" fontWeight="bold" fill="#D97706">
              M({midX}, {midY})
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default AnalyticalGeometryPlot;
