import React, { useState } from 'react';

export interface ViewportDomain {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
}

export function createCoordinateMapper(domain: ViewportDomain) {
  const { xMin, xMax, yMin, yMax, width, height } = domain;
  const scaleX = width / (xMax - xMin);
  const scaleY = height / (yMax - yMin);

  return {
    toSvgX: (x: number) => (x - xMin) * scaleX,
    toSvgY: (y: number) => height - (y - yMin) * scaleY,
    toMathX: (svgX: number) => xMin + svgX / scaleX,
    toMathY: (svgY: number) => yMin + (height - svgY) / scaleY,
    scaleX,
    scaleY,
  };
}

export interface FunctionPlotProps {
  type?: 'parabola' | 'hyperbola' | 'exponential';
  params?: {
    a?: number;
    p?: number;
    q?: number;
    b?: number;
    showTangent?: boolean;
    showAsymptotes?: boolean;
    showInverse?: boolean;
  };
  domain?: Partial<ViewportDomain>;
  className?: string;
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({
  type = 'parabola',
  params = {},
  domain: customDomain,
  className = '',
}) => {
  const a = params.a ?? 1;
  const p = params.p ?? 0;
  const q = params.q ?? 0;
  const b = params.b ?? 2;
  const showTangent = params.showTangent ?? false;
  const showAsymptotes = params.showAsymptotes ?? true;
  const showInverse = params.showInverse ?? false;

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string } | null>(null);

  const domain: ViewportDomain = {
    xMin: customDomain?.xMin ?? -7,
    xMax: customDomain?.xMax ?? 7,
    yMin: customDomain?.yMin ?? -6,
    yMax: customDomain?.yMax ?? 8,
    width: customDomain?.width ?? 460,
    height: customDomain?.height ?? 320,
  };

  const mapper = createCoordinateMapper(domain);
  const originX = mapper.toSvgX(0);
  const originY = mapper.toSvgY(0);

  // Generate paths
  let primaryPath = '';
  let secondaryPath = ''; // e.g. second branch of hyperbola or inverse of exponential
  const keyPoints: Array<{ x: number; y: number; label: string; color: string }> = [];

  if (type === 'parabola') {
    const steps = 100;
    const dx = (domain.xMax - domain.xMin) / steps;
    let started = false;

    for (let i = 0; i <= steps; i++) {
      const x = domain.xMin + i * dx;
      const y = a * Math.pow(x - p, 2) + q;
      if (y >= domain.yMin - 4 && y <= domain.yMax + 4) {
        const sx = mapper.toSvgX(x);
        const sy = mapper.toSvgY(y);
        primaryPath += !started ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        started = true;
      } else {
        started = false;
      }
    }

    // Turning Point
    keyPoints.push({
      x: p,
      y: q,
      label: `Turning Point (${p}, ${q})`,
      color: '#EC4899',
    });

    // Roots if real
    const disc = -q / a;
    if (disc >= 0) {
      const root1 = p - Math.sqrt(disc);
      const root2 = p + Math.sqrt(disc);
      if (root1 >= domain.xMin && root1 <= domain.xMax) {
        keyPoints.push({ x: root1, y: 0, label: `x-int (${root1.toFixed(1)}, 0)`, color: '#0284C7' });
      }
      if (root2 >= domain.xMin && root2 <= domain.xMax && Math.abs(root2 - root1) > 0.1) {
        keyPoints.push({ x: root2, y: 0, label: `x-int (${root2.toFixed(1)}, 0)`, color: '#0284C7' });
      }
    }

    // y-intercept
    const yInt = a * Math.pow(0 - p, 2) + q;
    if (yInt >= domain.yMin && yInt <= domain.yMax) {
      keyPoints.push({ x: 0, y: yInt, label: `y-int (0, ${yInt.toFixed(1)})`, color: '#7C3AED' });
    }
  } else if (type === 'hyperbola') {
    // Left branch: x < p
    const steps = 60;
    const eps = 0.15;
    const dxLeft = (p - eps - domain.xMin) / steps;
    let startedL = false;
    for (let i = 0; i <= steps; i++) {
      const x = domain.xMin + i * dxLeft;
      const y = a / (x - p) + q;
      if (y >= domain.yMin - 8 && y <= domain.yMax + 8) {
        const sx = mapper.toSvgX(x);
        const sy = mapper.toSvgY(y);
        primaryPath += !startedL ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        startedL = true;
      }
    }

    // Right branch: x > p
    const dxRight = (domain.xMax - (p + eps)) / steps;
    let startedR = false;
    for (let i = 0; i <= steps; i++) {
      const x = p + eps + i * dxRight;
      const y = a / (x - p) + q;
      if (y >= domain.yMin - 8 && y <= domain.yMax + 8) {
        const sx = mapper.toSvgX(x);
        const sy = mapper.toSvgY(y);
        secondaryPath += !startedR ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        startedR = true;
      }
    }

    // Center of symmetry
    keyPoints.push({ x: p, y: q, label: `Intersection of Asymptotes (${p}, ${q})`, color: '#D97706' });
  } else if (type === 'exponential') {
    // Exponential curve: y = a * b^(x - p) + q
    const steps = 80;
    const dx = (domain.xMax - domain.xMin) / steps;
    let started = false;

    for (let i = 0; i <= steps; i++) {
      const x = domain.xMin + i * dx;
      const y = a * Math.pow(b, x - p) + q;
      if (y >= domain.yMin - 6 && y <= domain.yMax + 6) {
        const sx = mapper.toSvgX(x);
        const sy = mapper.toSvgY(y);
        primaryPath += !started ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        started = true;
      }
    }

    // y-intercept: x = 0
    const yInt = a * Math.pow(b, -p) + q;
    if (yInt >= domain.yMin && yInt <= domain.yMax) {
      keyPoints.push({ x: 0, y: yInt, label: `y-int (0, ${yInt.toFixed(2)})`, color: '#059669' });
    }

    // Optional Inverse
    if (showInverse) {
      let startedInv = false;
      const dy = (domain.yMax - domain.yMin) / steps;
      for (let i = 0; i <= steps; i++) {
        const y = domain.yMin + i * dy;
        const arg = (y - q) / a;
        if (arg > 0.01) {
          const x = Math.log(arg) / Math.log(b) + p;
          if (x >= domain.xMin - 4 && x <= domain.xMax + 4) {
            const sx = mapper.toSvgX(x);
            const sy = mapper.toSvgY(y);
            secondaryPath += !startedInv
              ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}`
              : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
            startedInv = true;
          }
        }
      }
    }
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {type === 'parabola'
            ? `Parabola: f(x) = ${a === 1 ? '' : a}(x ${p >= 0 ? '-' : '+'} ${Math.abs(p)})² ${
                q >= 0 ? '+' : '-'
              } ${Math.abs(q)}`
            : type === 'hyperbola'
            ? `Hyperbola: g(x) = ${a}/(x ${p >= 0 ? '-' : '+'} ${Math.abs(p)}) ${q >= 0 ? '+' : '-'} ${Math.abs(q)}`
            : `Exponential: h(x) = ${a === 1 ? '' : `${a}·`}${b}^(x ${p >= 0 ? '-' : '+'} ${Math.abs(p)}) ${
                q >= 0 ? '+' : '-'
              } ${Math.abs(q)}`}
        </span>
        {hoveredPoint && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
            {hoveredPoint.label}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${domain.width} ${domain.height}`}
        className="w-full h-auto select-none overflow-visible"
      >
        <defs>
          {/* Arrow markers for axes */}
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#94A3B8" />
          </marker>
        </defs>

        {/* Grid lines (Subtle) */}
        {Array.from({ length: Math.floor(domain.xMax - domain.xMin) + 1 }).map((_, idx) => {
          const val = Math.ceil(domain.xMin) + idx;
          if (val === 0) return null;
          const sx = mapper.toSvgX(val);
          return (
            <line
              key={`grid-x-${val}`}
              x1={sx}
              y1={0}
              x2={sx}
              y2={domain.height}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeDasharray="2 2"
            />
          );
        })}
        {Array.from({ length: Math.floor(domain.yMax - domain.yMin) + 1 }).map((_, idx) => {
          const val = Math.ceil(domain.yMin) + idx;
          if (val === 0) return null;
          const sy = mapper.toSvgY(val);
          return (
            <line
              key={`grid-y-${val}`}
              x1={0}
              y1={sy}
              x2={domain.width}
              y2={sy}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* X and Y Axes */}
        <line
          x1={0}
          y1={originY}
          x2={domain.width}
          y2={originY}
          stroke="#64748B"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <line
          x1={originX}
          y1={domain.height}
          x2={originX}
          y2={0}
          stroke="#64748B"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />

        {/* Axes Labels */}
        <text x={domain.width - 12} y={originY - 8} fontSize="12" fill="#475569" fontWeight="600">
          x
        </text>
        <text x={originX + 8} y={14} fontSize="12" fill="#475569" fontWeight="600">
          y
        </text>
        <text x={originX - 12} y={originY + 14} fontSize="11" fill="#94A3B8">
          0
        </text>

        {/* Asymptotes */}
        {showAsymptotes && type === 'hyperbola' && (
          <>
            {/* Vertical Asymptote x = p */}
            <line
              x1={mapper.toSvgX(p)}
              y1={0}
              x2={mapper.toSvgX(p)}
              y2={domain.height}
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Horizontal Asymptote y = q */}
            <line
              x1={0}
              y1={mapper.toSvgY(q)}
              x2={domain.width}
              y2={mapper.toSvgY(q)}
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </>
        )}

        {showAsymptotes && type === 'exponential' && (
          <line
            x1={0}
            y1={mapper.toSvgY(q)}
            x2={domain.width}
            y2={mapper.toSvgY(q)}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        {/* Axis of symmetry for Parabola: x = p */}
        {type === 'parabola' && showAsymptotes && (
          <line
            x1={mapper.toSvgX(p)}
            y1={0}
            x2={mapper.toSvgX(p)}
            y2={domain.height}
            stroke="#C084FC"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        )}

        {/* Curve Path: Primary */}
        <path
          d={primaryPath}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Curve Path: Secondary (Hyperbola 2nd branch or exponential inverse) */}
        {secondaryPath && (
          <path
            d={secondaryPath}
            fill="none"
            stroke={type === 'hyperbola' ? '#7C3AED' : '#0284C7'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Key Points / Markers */}
        {keyPoints.map((pt, idx) => {
          const sx = mapper.toSvgX(pt.x);
          const sy = mapper.toSvgY(pt.y);
          const isHovered = hoveredPoint?.label === pt.label;
          return (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={sx}
                cy={sy}
                r={isHovered ? 7 : 4.5}
                fill={pt.color}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all"
              />
              <text
                x={sx + 8}
                y={sy - 6}
                fontSize="11"
                fontWeight="600"
                fill={pt.color}
                className="select-none"
              >
                {pt.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FunctionPlot;
