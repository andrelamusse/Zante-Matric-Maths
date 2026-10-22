import React, { useRef, useState, useEffect } from 'react';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassButton from '../ui/GlassButton.tsx';

export interface GlassScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

export const GlassScratchpad: React.FC<GlassScratchpadProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#0F172A');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [opacity, setOpacity] = useState<number>(0.85);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Undo / Redo stacks
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const pointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef<boolean>(false);

  const colors = [
    { label: 'Charcoal', hex: '#0F172A' },
    { label: 'Hot Rose', hex: '#FF85B3' },
    { label: 'Violet', hex: '#C084FC' },
    { label: 'Electric Cyan', hex: '#38BDF8' },
    { label: 'Emerald', hex: '#059669' },
  ];

  // HiDPI Canvas initialization & resize
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Preserve existing drawing when resizing
    let existingData: ImageData | null = null;
    if (canvas.width > 0 && canvas.height > 0) {
      try {
        existingData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {
        // Ignore
      }
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (existingData) {
      try {
        ctx.putImageData(existingData, 0, 0);
      } catch {
        // Ignore
      }
    } else if (undoStackRef.current.length === 0) {
      saveState();
    }
  }, [isOpen, isMinimized]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (undoStackRef.current.length >= 20) {
      undoStackRef.current.shift();
    }
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    pointsRef.current = [{ x, y }];
    redoStackRef.current = [];

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Draw single dot on click
    ctx.save();
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, lineWidth * 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pts = pointsRef.current;
    pts.push({ x, y });

    if (pts.length < 3) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 7;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    // Midpoint quadratic bezier smoothing
    const lastP = pts[pts.length - 2];
    const currP = pts[pts.length - 1];
    const midX = (lastP.x + currP.x) / 2;
    const midY = (lastP.y + currP.y) / 2;

    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 3].x, pts[pts.length - 3].y);
    ctx.quadraticCurveTo(lastP.x, lastP.y, midX, midY);
    ctx.stroke();
    ctx.restore();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    pointsRef.current = [];
    saveState();
  };

  const handleClear = () => {
    soundEngine.playTapPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const handleUndo = () => {
    if (undoStackRef.current.length <= 1) return;
    soundEngine.playTapPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const current = undoStackRef.current.pop()!;
    redoStackRef.current.push(current);
    const prev = undoStackRef.current[undoStackRef.current.length - 1];
    ctx.putImageData(prev, 0, 0);
  };

  const handleRedo = () => {
    if (redoStackRef.current.length === 0) return;
    soundEngine.playTapPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(next);
    ctx.putImageData(next, 0, 0);
  };

  if (!isOpen) return null;

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <button
          type="button"
          onClick={() => {
            soundEngine.playTapPop();
            setIsMinimized(false);
          }}
          className="glass-card iridescent-border p-3 rounded-full shadow-xl flex items-center gap-2 spring-touch animate-bounce"
          title="Restore Glass Scratchpad"
        >
          <span className="text-xl">✏️</span>
          <span className="text-xs font-bold text-slate-800 pr-1">Scratchpad</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-all ${className}`}
      style={{ backgroundColor: `rgba(15, 23, 42, ${Math.max(0.15, 0.45 * (1 - opacity))})` }}
    >
      <div
        className="relative w-full max-w-4xl h-[85vh] rounded-3xl glass-card-elevated shadow-2xl flex flex-col overflow-hidden border border-white/90"
        style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
      >
        {/* Toolbar Header */}
        <div className="px-4 py-3 bg-white/70 backdrop-blur-md border-b border-white/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">✏️</span>
              <span className="text-sm font-bold text-slate-900">Glass Scratchpad</span>
            </div>

            {/* Tool Mode: Pen vs Eraser */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/70 border border-white/80">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTapPop();
                  setTool('pen');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  tool === 'pen' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Pen
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTapPop();
                  setTool('eraser');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  tool === 'eraser' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Eraser
              </button>
            </div>

            {/* Pastel Ink Color Swatches */}
            {tool === 'pen' && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300/60">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      soundEngine.playTapPop();
                      setColor(c.hex);
                    }}
                    title={c.label}
                    className={`w-6 h-6 rounded-full transition-all spring-touch ${
                      color === c.hex ? 'ring-2 ring-violet-500 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}

            {/* Line Weight Selector */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-300/60">
              {[2, 3.5, 6].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setLineWidth(w);
                  }}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                    lineWidth === w ? 'bg-violet-100 text-violet-700 font-bold ring-1 ring-violet-400' : 'text-slate-500'
                  }`}
                >
                  <span
                    className="rounded-full bg-current"
                    style={{ width: `${w * 1.8}px`, height: `${w * 1.8}px` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Opacity Slider, Undo/Redo, Minimize, Close */}
          <div className="flex items-center gap-2">
            {/* Opacity Slider */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
              <span>Glass:</span>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-18 accent-violet-600 cursor-pointer"
                title={`Glass Opacity: ${(opacity * 100).toFixed(0)}%`}
              />
            </div>

            <GlassButton
              variant="subtle"
              size="sm"
              onClick={handleUndo}
              title="Undo"
              className="!px-2.5 !py-1"
            >
              ↩
            </GlassButton>
            <GlassButton
              variant="subtle"
              size="sm"
              onClick={handleRedo}
              title="Redo"
              className="!px-2.5 !py-1"
            >
              ↪
            </GlassButton>

            <GlassButton
              variant="danger"
              size="sm"
              onClick={handleClear}
              title="Clear Scratchpad"
              className="!px-2.5 !py-1"
            >
              Clear
            </GlassButton>

            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => {
                soundEngine.playTapPop();
                setIsMinimized(true);
              }}
              title="Minimize Scratchpad"
              className="!px-2 !py-1"
            >
              ⎯
            </GlassButton>

            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => {
                soundEngine.playTapPop();
                onClose();
              }}
              title="Close Scratchpad"
              className="!px-2 !py-1 font-bold"
            >
              ✕
            </GlassButton>
          </div>
        </div>

        {/* Live Drawing Canvas */}
        <div className="relative flex-1 w-full h-full cursor-crosshair touch-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      </div>
    </div>
  );
};

export default GlassScratchpad;
