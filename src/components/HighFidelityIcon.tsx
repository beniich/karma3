import React from 'react';
import { cn } from '../lib/utils'; // If not present, we will define a fallback helper or use fallback cn

// Fallback utility in case lib/utils or cn is missing/modified
const localCn = (...classes: (string | undefined | null | boolean | { [key: string]: boolean })[]) => {
  return classes
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === 'string') return [c];
      if (typeof c === 'object') {
        return Object.entries(c)
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
      }
      return [];
    })
    .join(' ');
};

export type IconVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'amber' | 'blue' | 'purple' | 'emerald';
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface HighFidelityIconProps {
  children: React.ReactElement<any>;
  variant?: IconVariant;
  size?: IconSize;
  className?: string;
  animate?: boolean;
}

export const HighFidelityIcon: React.FC<HighFidelityIconProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  animate = false,
}) => {
  // Map sizes for the outer container and icon
  const outerSizeMap = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-xl md:rounded-2xl',
    lg: 'w-16 h-16 rounded-[1.25rem]',
    xl: 'w-24 h-24 rounded-[1.8rem]',
  };

  const innerSizeMap = {
    xs: 'w-5.5 h-5.5 rounded-md p-0.5',
    sm: 'w-7.5 h-7.5 rounded-lg p-1',
    md: 'w-9 h-9 rounded-[10px] p-1.5',
    lg: 'w-13 h-13 rounded-[14px] p-2.5',
    xl: 'w-20.5 h-20.5 rounded-[22px] p-4',
  };

  const iconSizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5 md:w-5 md:h-5',
    lg: 'w-7 h-7',
    xl: 'w-11 h-11',
  };

  // Map high-fidelity accent styling
  const variantStyles = {
    neutral: {
      outer: 'bg-slate-900/10 dark:bg-slate-900 border border-slate-200/55 dark:border-[#1c2e46]/60 text-slate-400 group-hover:border-slate-350 dark:group-hover:border-[#0ea5e9]/40',
      inner: 'bg-slate-50 dark:bg-[#0d1520]/80 border border-slate-100/50 dark:border-slate-800/40',
      dot: 'bg-slate-400 dark:bg-slate-500',
    },
    info: {
      outer: 'bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.06)]',
      inner: 'bg-blue-500/5 border border-blue-500/15',
      dot: 'bg-sky-450 animate-ping',
    },
    blue: {
      outer: 'bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-sky-400',
      inner: 'bg-blue-500/5 border border-blue-500/15',
      dot: 'bg-blue-500',
    },
    success: {
      outer: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.06)]',
      inner: 'bg-emerald-500/5 border border-emerald-500/15',
      dot: 'bg-emerald-400',
    },
    emerald: {
      outer: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400',
      inner: 'bg-emerald-500/5 border border-emerald-500/15',
      dot: 'bg-emerald-500',
    },
    warning: {
      outer: 'bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.06)]',
      inner: 'bg-amber-500/5 border border-amber-500/15',
      dot: 'bg-amber-500 animate-pulse',
    },
    amber: {
      outer: 'bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400',
      inner: 'bg-amber-500/5 border border-amber-500/15',
      dot: 'bg-amber-500',
    },
    danger: {
      outer: 'bg-red-500/15 border border-red-500/30 text-rose-500 dark:text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.12)]',
      inner: 'bg-red-500/10 border border-red-500/20',
      dot: 'bg-red-500 animate-bounce',
    },
    purple: {
      outer: 'bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.06)]',
      inner: 'bg-purple-500/5 border border-purple-500/15',
      dot: 'bg-purple-400',
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  // Clone Lucide icon dynamically to set modern, high-fidelity thin strokes (strokeWidth=1.5)
  // This completely overrides standard heavy stroke="2" weight to convey an elegant premium vibe.
  const modifiedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        className: cn(iconSizeMap[size], (children.props as any).className),
        strokeWidth: (children.props as any)?.strokeWidth !== undefined ? (children.props as any).strokeWidth : 1.5,
      })
    : children;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 transition-all duration-500',
        outerSizeMap[size],
        style.outer,
        animate ? 'animate-pulse' : '',
        className
      )}
    >
      {/* Absolute micro outer line ring for depth */}
      <div className="absolute inset-0 rounded-inherit border border-white/5 pointer-events-none" />

      {/* Inner cushion wrapper */}
      <div
        className={cn(
          'flex items-center justify-center w-full h-full p-1',
          innerSizeMap[size],
          style.inner
        )}
      >
        {modifiedChild}
      </div>

      {/* Microscopic status indicator dot representing decentralized alive/telemetry */}
      {size !== 'xs' && (
        <span
          className={cn(
            'absolute top-1 right-1 w-1.5 h-1.5 rounded-full ring-1 ring-white/10 dark:ring-[#051424]/40',
            style.dot
          )}
        />
      )}
    </div>
  );
};
