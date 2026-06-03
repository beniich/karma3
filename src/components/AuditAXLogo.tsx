import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

/**
 * AuditAXSymbol - Pure geometric high-fidelity SVG representation of the brand emblem:
 * Features a stylized futuristic 'A' with a neon purple-and-orange dual gradient,
 * overlaid onto an interconnected, semi-translucent hexagonal lattice cyber mesh.
 */
export const AuditAXSymbol: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
    custom: '',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeClasses[size], className, 'select-none overflow-visible')}
      aria-hidden="true"
    >
      <defs>
        {/* Dynamic linear and radial gradients mirroring the high-tech glowing look */}
        <linearGradient id="auditax-purple-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="40%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        <linearGradient id="auditax-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <linearGradient id="auditax-hex-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0.5" />
        </linearGradient>

        {/* Sophisticated drop shadow for structural depth */}
        <filter id="auditax-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <filter id="neon-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="7" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* BACKGROUND HEXAGONAL NETWORK MESH SYSTEM (Integrated on the right/back) */}
      <g className="opacity-90 transition-all duration-700 hover:opacity-100">
        {/* Connection lines between nodes */}
        <path
          d="M 68 25 L 82 33 L 82 49 L 68 57 L 54 49 L 54 33 Z"
          fill="none"
          stroke="url(#auditax-hex-grad)"
          strokeWidth="0.8"
          strokeDasharray="1,1"
        />
        <path
          d="M 68 57 L 82 65 L 82 81 L 68 89 L 54 81 L 54 65 Z"
          fill="none"
          stroke="url(#auditax-hex-grad)"
          strokeWidth="0.8"
        />
        <path
          d="M 40 41 L 54 49 L 54 65 L 40 73 L 26 65 L 26 49 Z"
          fill="none"
          stroke="url(#auditax-hex-grad)"
          strokeWidth="0.6"
          strokeDasharray="2,2"
        />

        {/* Individual filled & translucent hexagons */}
        {/* Hexagon 1: Top Right */}
        <polygon 
          points="68,25 82,33 82,49 68,57 54,49 54,33" 
          fill="rgba(124, 58, 237, 0.08)" 
          stroke="rgba(124, 58, 237, 0.25)" 
          strokeWidth="0.8" 
        />
        {/* Hexagon 2: Middle Right Outer */}
        <polygon 
          points="82,49 96,57 96,73 82,81 68,73 68,57" 
          fill="rgba(249, 115, 22, 0.05)" 
          stroke="rgba(249, 115, 22, 0.15)" 
          strokeWidth="0.7" 
        />
        {/* Hexagon 3: Bottom connected cell */}
        <polygon 
          points="54,65 68,73 68,89 54,97 40,89 40,73" 
          fill="none" 
          stroke="rgba(139, 92, 246, 0.25)" 
          strokeWidth="0.8" 
        />

        {/* Microscopic node junctions with pulse */}
        <circle cx="68" cy="25" r="1.5" className="fill-purple-400 animate-pulse" />
        <circle cx="82" cy="49" r="1.2" className="fill-orange-400" />
        <circle cx="54" cy="49" r="1.2" className="fill-purple-500/80" />
        <circle cx="68" cy="73" r="1.8" className="fill-orange-500/80 animate-ping" style={{ animationDuration: '4s' }} />
        <circle cx="68" cy="73" r="1.2" className="fill-orange-500" />
        <circle cx="54" cy="81" r="1" className="fill-purple-400/60" />
      </g>

      {/* THE STYLIZED SOVEREIGN CAPITAL "A" EMBLEM */}
      <g filter="url(#auditax-glow)">
        {/* Left bold curved terminal stem (Purple component) */}
        <path
          d="M 22 82 
             C 22 55, 30 31, 44 14 
             C 47 11, 52 11, 54 13
             C 55 15, 54 18, 51 21
             C 40 37, 34 57, 34 82 
             C 34 84, 22 84, 22 82 Z"
          fill="url(#auditax-purple-grad)"
        />

        {/* Right swooping overlapping cybernetic wing (Orange component) */}
        <path
          d="M 44 14
             C 53 25, 68 45, 75 64
             C 79 73, 81 80, 81 82
             C 81 84, 73 84, 70 82
             C 69 80, 67 74, 63 65
             C 55 48, 43 31, 36 21
             C 34 18, 38 10, 44 14 Z"
          fill="url(#auditax-orange-grad)"
          filter="url(#neon-glow-filter)"
          opacity="0.95"
        />

        {/* Sharp structural connector crossbar (Sovereign core bridge) */}
        <path
          d="M 33 60
             C 42 58, 54 59, 64 63
             L 60 70
             C 51 66, 41 65, 33 67
             Z"
          fill="url(#auditax-orange-grad)"
          opacity="0.85"
        />

        {/* Inner white glow line for high contrast high-fidelity definition */}
        <path
          d="M 28 80 C 35 55, 45 35, 49 19"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M 44 15 C 51 26, 62 46, 68 62"
          fill="none"
          stroke="#ffedd5"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>
    </svg>
  );
};

interface BrandProps {
  className?: string;
  symbolSize?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  lang?: 'FR' | 'EN';
  hideTextOnMobile?: boolean;
}

/**
 * AuditAXBrand - The full unified logo + text branding component
 * Distributes the precise visual identity exactly as uploaded by the user:
 * - A high-fidelity "A" symbol with purple-and-orange gradients and hexagonal cluster overlay.
 * - Bold white "AuditAX" heading matched with a neon-inspired "Nexus Hub" tagline.
 */
export const AuditAXBrand: React.FC<BrandProps> = ({
  className = '',
  symbolSize = 'md',
  onClick,
  lang = 'FR',
  hideTextOnMobile = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3.5 select-none transition-all duration-300 group',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      {/* Symbolic brand icon */}
      <div className="relative shrink-0">
        <AuditAXSymbol 
          size={symbolSize} 
          className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" 
        />
        {/* Aesthetic micro halo effect on hover */}
        <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-xl scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Typography block perfectly scaled as in the screenshot */}
      <div className={cn('flex flex-col text-left', hideTextOnMobile ? 'hidden sm:flex' : 'flex')}>
        <span className="text-[17px] sm:text-[19px] font-extrabold tracking-tight text-white leading-none font-sans flex items-center gap-1.5 uppercase transition-all duration-300 group-hover:text-amber-50">
          AuditAX
          {/* Micro dot representation of dynamic state */}
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse ml-0.5" />
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-orange-500 font-mono mt-1 leading-none uppercase transition-all duration-300 group-hover:text-orange-400">
          Nexus Hub
        </span>
      </div>
    </div>
  );
};
