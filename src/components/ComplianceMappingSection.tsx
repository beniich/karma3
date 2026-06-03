import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Workflow, 
  Brain, 
  SlidersHorizontal, 
  AlertTriangle, 
  Shuffle, 
  CheckCircle2, 
  Download, 
  X, 
  ArrowRight,
  Shield,
  Lock,
  LockOpen,
  Key,
  FolderLock,
  Database,
  Terminal,
  Clock,
  RefreshCw,
  FileCheck
} from 'lucide-react';

interface ComplianceMappingSectionProps {
  onNotify: (m: string) => void;
}

export const ComplianceMappingSection = ({ onNotify }: ComplianceMappingSectionProps) => {
  const [rotationTimer, setRotationTimer] = useState<string>("4H 32M");
  const [activeEnclave, setActiveEnclave] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Access lists for Bastion logs table (matches Image 3)
  const [logs, setLogs] = useState([
    { access: 'SECURE ACCESS', uid: '206100031', time: '104/T5 15:00' },
    { access: 'SECURE ACCESS', uid: '189188334', time: '104/T5 15:00' },
    { access: 'SECURE ACCESS', uid: '209360024', time: '104/T5 16:00' },
    { access: 'SECURE ACCESS', uid: '304192001', time: '104/T5 16:00' },
    { access: 'SECURE ACCESS', uid: '184920404', time: '104/T5 16:00' },
    { access: 'SECURE ACCESS', uid: '201198339', time: '104/T5 16:00' }
  ]);

  const handleManualScan = () => {
    setIsRefreshing(true);
    onNotify("🛰️ Lancement du scan régulateur global Auditax Militaires...");
    setTimeout(() => {
      setIsRefreshing(false);
      onNotify("🎖️ Tous les nœuds de la forteresse HSM sont opérationnels - Score mTLS à 100%.");
    }, 1400);
  };

  return (
    <div className="space-y-6 text-[#cbd5e1] text-left select-none relative font-sans">
      <style>{`
        @keyframes stampPulse {
          0% { transform: scale(1.1) rotate(-12deg); opacity: 0.8; }
          50% { transform: scale(1) rotate(-12deg); opacity: 1; }
          100% { transform: scale(1.1) rotate(-12deg); opacity: 0.8; }
        }
        .grade-militaire-stamp {
          border: 4px double #ea580c;
          border-radius: 4px;
          color: #ea580c;
          font-family: 'JetBrains Mono', Courier, monospace;
          font-weight: 900;
          text-align: center;
          background: rgba(234, 88, 12, 0.04);
          transform: rotate(-12deg);
          box-shadow: 0 0 10px rgba(234, 88, 12, 0.1);
        }
        .grade-militaire-stamp-pulse {
          animation: stampPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .cyber-castle-glow {
          filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.25));
        }
      `}</style>

      {/* Main Title Section exactly styled */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
          Military-Grade Security Framework
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-bold tracking-wider font-mono">
          AuditAX Compliance and HSM hardware containment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: mTLS Strength & Key Rotations (3 cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* mTLS & Encryption Strength Card */}
          <div className="bg-[#0b101c]/95 border border-[#1b253b] rounded-3xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#cbd5e1]">
                mTLS & Encryption Strength
              </span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </div>

            {/* Custom SVG flow directory to lock */}
            <div className="relative py-2 flex items-center justify-center">
              <svg className="w-full h-[60px]" viewBox="0 0 240 60">
                {/* Lines from index directories to page */}
                <path d="M 15 10 L 45 30" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.5" />
                <path d="M 15 30 L 45 30" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.5" />
                <path d="M 15 50 L 45 30" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="1" />

                <path d="M 45 30 L 120 30" stroke="#f97316" strokeWidth="2" strokeDasharray="4,3" className="network-dash-fast" />
                <path d="M 160 30 L 210 30" stroke="#f97316" strokeWidth="1.5" />

                {/* Nodes with folder shapes */}
                <circle cx="15" cy="10" r="4.5" fill="#f97316" />
                <circle cx="15" cy="30" r="4.5" fill="#ea580c" />
                <circle cx="15" cy="50" r="4.5" fill="rgba(249, 115, 22, 0.2)" />
              </svg>

              {/* absolute Overlay locks icons exactly as schematic */}
              <div className="absolute inset-0 flex items-center justify-center gap-10 pointer-events-none">
                <div className="w-7 h-7 rounded-lg bg-orange-600/10 border border-orange-500/25 flex items-center justify-center text-orange-500 ml-4">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-orange-600/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <FileCheck className="w-4 h-4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Downward gauge displaying maximum militarized strength */}
            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl text-center space-y-1 mt-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">GRADE MILITAIRE - MAX STRENGTH</span>
              
              {/* Curve arc */}
              <div className="relative h-12 flex justify-center items-end overflow-hidden mt-1 select-none pointer-events-none">
                <svg className="w-24 h-12 transform">
                  <circle cx="48" cy="48" r="40" stroke="#161e2e" strokeWidth="6.5" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="#ea580c" strokeWidth="6.5" fill="none" strokeDasharray="125" strokeDashoffset="18" />
                </svg>
                <div className="absolute top-4 inset-x-0 font-mono font-black text-[13px] text-orange-500">
                  AES-256
                </div>
              </div>
            </div>
          </div>

          {/* Key Rotation Cycles Card */}
          <div className="bg-[#0b101c]/95 border border-[#1b253b] rounded-3xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#cbd5e1]">
                Key Rotation Cycles
              </span>
              <span className="w-2 h-2 rounded-full bg-orange-500" />
            </div>

            {/* Rotations timeline metrics indicator mapping keys */}
            <div className="flex items-center justify-between px-2 py-4 relative my-2">
              <div className="absolute inset-x-2 h-1 bg-slate-900 rounded-full" />
              <div className="absolute left-2 right-12 h-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" />
              
              {/* Rotating golden key indicators */}
              <div className="flex justify-between w-full relative z-10 font-mono">
                {[
                  { age: 'Active', active: true },
                  { age: '24h ago', active: true },
                  { age: '3d ago', active: true },
                  { age: '7d ago', active: false }
                ].map((key, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      key.active ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-slate-950 border-slate-850 text-slate-700'
                    }`}>
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[7.5px] text-slate-500 font-extrabold font-mono uppercase mt-1">{key.age}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl text-center">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">NEXT AUTOMATIC ROTATION</span>
              <div className="text-xl font-black text-orange-500 font-mono mt-0.5 animate-pulse">
                {rotationTimer}
              </div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: GORGEOUS CYBER CYBER SECURITY BASTION ISO FORTRESS (6 cols) */}
        <div className="lg:col-span-6 bg-[#090e1a]/95 border border-[#1b243b] rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ minHeight: '440px' }}>
          
          <div className="flex justify-between items-center mb-4 border-b border-slate-800/60 pb-3 z-10 relative">
            <span className="text-xs font-black uppercase tracking-widest text-white font-sans">
              Isomeric Enforcement Citadel
            </span>
            <button
              onClick={handleManualScan}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white border-none font-black text-[9px] uppercase tracking-wider rounded-lg shadow cursor-pointer transition-all active:scale-95 leading-none"
            >
              {isRefreshing ? "Compiling..." : "Force Hardening Scan"}
            </button>
          </div>

          {/* Interactive Fortress Blueprint & Grade Stamps exactly styled */}
          <div className="relative flex-1 flex flex-col justify-center items-center py-6 select-none z-10">
            
            {/* Holographic Glowing Stamps - GRADE MILITAIRE - exactly as mockup overlay */}
            <div className="absolute top-1 left-2 select-none z-20 overflow-visible">
              <div className="grade-militaire-stamp grade-militaire-stamp-pulse px-3 py-1.5 text-[10px] sm:text-xs">
                ★ GRADE ★<br />MILITAIRE
              </div>
            </div>

            <div className="absolute bottom-2 right-12 select-none z-20 overflow-visible">
              <div className="grade-militaire-stamp px-3 py-1.5 text-[9px] sm:text-[11px] opacity-75">
                MILITARY<br />★ GRADE ★
              </div>
            </div>

            {/* Glowing Isometric Castle fortress SVG details */}
            <div className="w-[320px] h-[220px] relative pointer-events-none flex items-center justify-center py-4">
              <svg className="w-full h-full cyber-castle-glow" viewBox="0 0 400 300">
                {/* Visual geometric grids */}
                <ellipse cx="200" cy="180" rx="140" ry="60" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="1.5" fill="none" />
                <ellipse cx="200" cy="180" rx="190" ry="85" stroke="rgba(249, 115, 22, 0.05)" strokeWidth="1" fill="none" />

                {/* Left Side Connection Lines */}
                <path d="M 60 160 Q 150 160 200 180" stroke="rgba(249,115,22,0.6)" strokeWidth="1.8" fill="none" className="network-dash" />
                {/* Right Side Connection Lines */}
                <path d="M 340 160 Q 250 160 200 180" stroke="#f97316" strokeWidth="1.8" fill="none" className="network-dash-fast" />

                {/* Isometric Castle Citadel graphics */}
                {/* Front Gate */}
                <polygon points="170,195 230,195 230,165 200,150 170,165" fill="#121c33" stroke="#f97316" strokeWidth="2" />
                <polygon points="185,195 215,195 215,175 185,175" fill="#f97316" fillOpacity="0.25" stroke="#f97316" strokeWidth="1.5" />
                
                {/* Rear Towers */}
                <polygon points="140,155 170,155 170,110 140,110" fill="#0c1426" stroke="#ea580c" strokeWidth="2" />
                <polygon points="230,155 260,155 260,110 230,110" fill="#0c1426" stroke="#ea580c" strokeWidth="2" />

                {/* Center Core Spire Tower */}
                <polygon points="180,145 220,145 220,90 180,90" fill="#1b253d" stroke="#f97316" strokeWidth="2.5" />
                <polygon points="190,90 210,90 200,60" fill="#ea580c" stroke="#f97316" strokeWidth="2" />

                {/* Floating Shield and Accents */}
                <ellipse cx="200" cy="115" rx="8" ry="11" fill="rgba(249, 115, 22, 0.2)" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="200" y1="104" x2="200" y2="126" stroke="#ffffff" strokeWidth="1" />

                {/* Flag on center */}
                <polygon points="200,60 215,63 200,67" fill="#ea580c" />
              </svg>

              {/* absolute Labels overlay on visual elements */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[185px] px-3.5 py-1 rounded bg-[#0b101c]/95 border border-orange-500/35 text-[9.5px] font-black tracking-widest uppercase font-mono text-orange-400">
                HSM Enclaves
              </div>
              <div className="absolute right-4 top-[145px] px-3.5 py-1 rounded bg-[#0b101c]/95 border border-slate-800 text-[8.5px] font-bold tracking-widest uppercase font-mono text-slate-350">
                Bastion Gateways
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center border-t border-slate-800/60 pt-3 z-10 leading-none">
            Enclaves cryptographiques de défense asynchrones configurées par matériel chiffré.
          </div>

        </div>

        {/* RIGHT COLUMN: ENCLAVES SCAN & LIVE ACCESS LOGS (3 cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* HSM Enclave Status Dials */}
          <div className="bg-[#0b101c]/95 border border-[#1b253b] rounded-3xl p-5 shadow-2xl flex-1 flex flex-col justify-between relative">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#cbd5e1]">
                HSM Enclave Status
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00e383]" />
            </div>

            {/* Render 4 nice shield items */}
            <div className="grid grid-cols-4 gap-2 py-1">
              {[1, 2, 3, 4].map((id) => (
                <div 
                  key={id} 
                  onClick={() => {
                    setActiveEnclave(`Active Enclave [E-${id}]`);
                    onNotify(`🔒 Audit d'enclave HSM-${id} complet : Score d'entropie OK.`);
                  }}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                    activeEnclave === `Active Enclave [E-${id}]` ? 'bg-orange-600/10 border-orange-500 text-orange-400' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <Shield className="w-5 h-5 text-orange-500 mb-1" />
                  <span className="text-[7.5px] font-monospace font-black uppercase tracking-wider text-slate-300">SECURE</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00e383] mt-1" />
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl text-center text-[10px] font-mono text-[#00e383] font-black uppercase tracking-wider mt-2">
              ✓ ALL ENCLAVES SECURE
            </div>
          </div>

          {/* Bastion Gateway Logs containing orange tilted stamp overlay */}
          <div className="bg-[#0b101c]/95 border border-[#1b253b] rounded-3xl p-5 shadow-2xl flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#cbd5e1]">
                Bastion Gateway Logs
              </span>
              <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold border border-red-500/20">
                PROPRIETARY
              </span>
            </div>

            {/* Logs table content with relative overlay stamp precisely as mockup Image 3 */}
            <div className="relative h-[120px] overflow-hidden">
              
              {/* Nice orange stamp overlay precisely mimicking screenshot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="border-[3px] border-orange-500/80 px-4 py-2 text-orange-500 font-mono font-black text-[11px] sm:text-xs tracking-widest uppercase transform -rotate-15 bg-[#0b101c]/90 shadow-lg leading-snug">
                  SECURE ACCESS -<br />GRADE MILITAIRE
                </div>
              </div>

              {/* Data Rows underneath the stamp */}
              <div className="space-y-1 text-[8.5px] font-mono select-none pointer-events-none opacity-40">
                <div className="grid grid-cols-3 text-slate-500 uppercase font-black border-b border-slate-900 pb-0.5">
                  <span>Access</span>
                  <span>User ID</span>
                  <span className="text-right">Timestamp</span>
                </div>
                
                {logs.map((log, index) => (
                  <div key={index} className="grid grid-cols-3 items-center text-slate-300">
                    <span className="text-emerald-500 font-bold">{log.access}</span>
                    <span className="font-semibold text-slate-400">{log.uid}</span>
                    <span className="text-right text-slate-505 truncate">{log.time}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
