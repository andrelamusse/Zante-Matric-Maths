import React from 'react';
import { soundEngine } from '../../sound/audioEngine.ts';

export interface GlassPillProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  active?: boolean;
  iridescent?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  playPopSound?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassPill: React.FC<GlassPillProps> = ({
  children,
  active = false,
  iridescent = false,
  icon,
  badge,
  playPopSound = true,
  className = '',
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playPopSound) {
      soundEngine.playTapPop();
    }
    onClick?.(e);
  };

  const activeClasses = active
    ? 'active !bg-white/95 !border-violet-300 shadow-md shadow-violet-500/10 text-violet-700 font-semibold'
    : 'text-slate-700 hover:text-slate-900';

  const iridescentClasses = iridescent ? 'iridescent-border font-bold' : '';

  return (
    <div
      role="button"
      tabIndex={0}
      className={`glass-pill ${activeClasses} ${iridescentClasses} ${className}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      {...rest}
    >
      {icon && <span className="inline-flex items-center justify-center shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-bold ${
            active ? 'bg-violet-100 text-violet-700' : 'bg-slate-200/80 text-slate-600'
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default GlassPill;
