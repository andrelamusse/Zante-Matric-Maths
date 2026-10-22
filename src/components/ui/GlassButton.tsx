import React from 'react';
import { soundEngine } from '../../sound/audioEngine.ts';

export type GlassButtonVariant = 'primary' | 'ghost' | 'subtle' | 'iridescent' | 'danger' | 'pill';
export type GlassButtonSize = 'sm' | 'md' | 'lg';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  icon?: React.ReactNode;
  playPopSound?: boolean;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'subtle',
  size = 'md',
  icon,
  playPopSound = true,
  className = '',
  onClick,
  disabled,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (playPopSound) {
      soundEngine.playTapPop();
    }
    onClick?.(e);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]';
      case 'lg':
        return 'text-base px-6 py-3.5 gap-3 min-h-[48px]';
      case 'md':
      default:
        return 'text-sm px-4 py-2.5 gap-2 min-h-[44px]';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-white/20 shadow-md shadow-violet-500/20 hover:brightness-105 active:scale-95';
      case 'iridescent':
        return 'iridescent-border text-slate-900 font-semibold shadow-sm hover:scale-[1.02] active:scale-95';
      case 'ghost':
        return 'bg-white/40 hover:bg-white/70 text-slate-700 border border-white/60 active:scale-95';
      case 'danger':
        return 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-300/60 active:scale-95';
      case 'pill':
        return 'glass-pill rounded-full';
      case 'subtle':
      default:
        return 'bg-white/75 hover:bg-white/90 text-slate-800 border border-white/90 shadow-sm shadow-slate-900/5 active:scale-95';
    }
  };

  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-xl select-none outline-none transition-all duration-200 spring-touch';
  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="inline-flex items-center justify-center shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default GlassButton;
