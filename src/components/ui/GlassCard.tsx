import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  elevation?: 'sm' | 'md' | 'lg' | 'elevated' | 'subtle';
  iridescent?: boolean;
  interactive?: boolean;
  className?: string;
  glowColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  elevation = 'md',
  iridescent = false,
  interactive = false,
  className = '',
  glowColor,
  style,
  ...rest
}) => {
  const getElevationClass = () => {
    switch (elevation) {
      case 'sm':
        return 'glass-card-subtle';
      case 'elevated':
      case 'lg':
        return 'glass-card-elevated';
      case 'subtle':
        return 'glass-card-subtle';
      case 'md':
      default:
        return 'glass-card';
    }
  };

  const elevationClass = getElevationClass();
  const iridescentClass = iridescent ? 'iridescent-border' : '';
  const interactiveClass = interactive || rest.onClick ? 'interactive cursor-pointer spring-touch' : '';

  const customStyle: React.CSSProperties = {
    ...style,
    ...(glowColor ? { boxShadow: `0 0 24px -2px ${glowColor}, inset 0 1px 0 0 rgba(255, 255, 255, 0.98)` } : {}),
  };

  return (
    <div
      className={`rounded-2xl ${elevationClass} ${iridescentClass} ${interactiveClass} ${className}`}
      style={customStyle}
      {...rest}
    >
      {children}
    </div>
  );
};

export default GlassCard;
