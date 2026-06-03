import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, Zap, RefreshCw, AlertTriangle, Play, HelpCircle
} from 'lucide-react';

interface MindNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type?: 'left' | 'right' | 'center' | 'intermediate';
}

export const Karma3AIAnalysisStudio: React.FC<{ onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void }> = ({ onNotify }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number>(92);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(s => s === 1 ? 1.04 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerSync = () => {
    setIsSyncing(true);
    onNotify("🔄 Optimisation des noyaux neuronaux PEGASUS v2 lancée...", "info");
    setTimeout(() => {
      setIsSyncing(false);
      onNotify("🛡️ Alignement prédictif de risque terminé avec succès. Tous les capteurs sont opérationnels.", "success");
    }, 1500);
  };

  // Precisely matched coordinates to represent the flow in the image
  const mindNodes: MindNode[] = [
    // Central hubs
    { id: 'center', label: 'AI', x: 210, y: 190, type: 'center' },
    
    // Intermediate hubs for branching logic
    { id: 'int_left', label: 'DATA ARJAFOMDP_RP', x: 140, y: 140, type: 'intermediate' },
    { id: 'int_mid_left', label: 'RELATIONSHIP4D7Y', x: 145, y: 200, type: 'intermediate' },
    { id: 'int_low_left', label: 'SNC/KT\'N', x: 155, y: 260, type: 'intermediate' },

    // Leftmost Nodes
    { id: 'l1', label: 'NCTLLORES', x: 55, y: 50, type: 'left' },
    { id: 'l2', label: 'CATAHAMANGEYS', x: 45, y: 92, type: 'left' },
    { id: 'l3', label: 'DATA-ADJUSTMENT', x: 40, y: 135, type: 'left' },
    { id: 'l4', label: 'FRCCHCEW', x: 35, y: 178, type: 'left' },
    { id: 'l5', label: 'OACGIER', x: 35, y: 218, type: 'left' },
    { id: 'l6', label: '06_YA_ITBRIAN77', x: 45, y: 258, type: 'left' },
    { id: 'l7', label: 'TESHNICOLOOY', x: 50, y: 298, type: 'left' },
    { id: 'l8', label: 'CUMNPIRC', x: 60, y: 340, type: 'left' },
    
    // Middle Top Node above the left map
    { id: 'top_left', label: 'MONITORS', x: 120, y: 45, type: 'left' },

    // Right branches radiating from the AI node
    { id: 'r1', label: 'HAYA RELATIONSHIPS', x: 285, y: 45, type: 'right' },
    { id: 'r2', label: 'GNXPNDER', x: 330, y: 95, type: 'right' },
    { id: 'r3', label: 'OAP/MALUXAPON', x: 340, y: 150, type: 'right' },
    { id: 'r4', label: 'UODADON', x: 330, y: 220, type: 'right' },
    { id: 'r5', label: 'MADUFER', x: 315, y: 270, type: 'right' },
    { id: 'r6', label: 'DATA PREDICTON', x: 235, y: 320, type: 'right' },
    { id: 'r7', label: 'DATA ROBYNDY', x: 180, y: 345, type: 'right' },
  ];

  return (
    <div className="space-y-8 text-slate-300 p-1 text-left select-none relative bg-transparent">
      {/* Visual background connector beams linking between left side to center brain to right side */}
      <style>{`
        @keyframes flowPulse {
          0% { stroke-dashoffset: 120; opacity: 0.35; }
          50% { opacity: 0.95; }
          100% { stroke-dashoffset: 0; opacity: 0.35; }
        }
        .neural-path {
          stroke-dasharray: 8, 4;
          animation: flowPulse 5s linear infinite;
        }
        .neural-path-fast {
          stroke-dasharray: 6, 3;
          animation: flowPulse 2.5s linear infinite;
        }
        .glow-orange {
          filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.45));
        }
        .glow-brain-core {
          filter: drop-shadow(0 0 25px rgba(243, 110, 20, 0.65));
        }
      `}</style>

      {/* SVG Pipeline Lines Running Between Cards (Luminous connections exactly as shown in screenshot) */}
      <div className="absolute inset-x-0 top-32 h-[380px] pointer-events-none z-0 hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 1200 380" fill="none">
          {/* Output Pipeline from Mind Map Local AI (approx X=220, Y=190) down and right to middle Brain (approx X=600, Y=190) */}
          <path 
            d="M 235 190 Q 380 190 410 240 T 560 190" 
            stroke="url(#orange-gradient)" 
            strokeWidth="2" 
            className="neural-path" 
          />
          <path 
            d="M 235 190 Q 380 190 410 240 T 560 190" 
            stroke="#f97316" 
            strokeWidth="0.8" 
          />

          {/* Splitting Laser pipelines from middle Brain (approx X=640, Y=190) running to five Input Register arrows on far right */}
          <path d="M 640 160 Q 720 100 810 100" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 650 175 Q 730 142 810 142" stroke="#f97316" strokeWidth="1.2" className="neural-path-fast" />
          <path d="M 655 190 L 810 178" stroke="#f97316" strokeWidth="1.5" className="neural-path-fast" />
          <path d="M 650 205 Q 730 220 810 216" stroke="#f97316" strokeWidth="1.2" className="neural-path-fast" />
          <path d="M 640 220 Q 720 270 810 255" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />

          {/* Defs for pipeline gradients */}
          <defs>
            <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff7a00" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* THREE MAIN COLUMNS IN UPPER SECTION - EXACT MATCH TO IMAGE COORESPONDENCY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10 pt-2">
        
        {/* -- COLUMN 1: INTELLIGENCE PRÉDICTIVE (4 cols) -- */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Header Label precisely structured from screenshot */}
          <div className="border-b-2 border-orange-500/80 pb-2 flex justify-between items-center bg-transparent">
            <span className="text-sm font-black uppercase tracking-[0.13em] text-[#cbd5e1] font-sans">
              INTELLIGENCE PRÉDICTIVE: <span className="text-orange-500 font-extrabold font-mono">+{selectedConfidence}%</span>
            </span>
          </div>

          <div className="bg-[#0b041e]/80 border border-[#231245]/70 rounded-[1.8rem] p-4 flex flex-col justify-between relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] min-h-[410px] group hover:border-orange-500/25 transition-all duration-300">
            {/* Radial background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(249,115,22,0.03)_0%,transparent_60%)] pointer-events-none" />
            
            {/* Dynamic Mindmap canvas container */}
            <div className="relative flex-1 bg-slate-950/45 border border-[#231245]/50 rounded-2xl overflow-hidden min-h-[355px] mt-1">
              {/* Mindmap dot array grid background */}
              <div 
                className="absolute inset-0 opacity-[0.22]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #f97316 1.5px, transparent 1.5px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Luminous interactive neural connectors paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {mindNodes.map(node => {
                  if (node.id === 'center') return null;
                  
                  // Setup connections to make a stunning branching network exactly matching screenshot
                  let targetX = 210;
                  let targetY = 190;
                  
                  if (node.type === 'left') {
                    // Leftmost nodes connect to intermediate hubs
                    if (node.y < 120) {
                      targetX = 140; // int_left
                      targetY = 140;
                    } else if (node.y >= 120 && node.y < 240) {
                      targetX = 145; // int_mid_left
                      targetY = 200;
                    } else {
                      targetX = 155; // int_low_left
                      targetY = 260;
                    }
                  } else if (node.type === 'intermediate') {
                    // Intermediate hubs connect to the central AI hub
                    targetX = 210;
                    targetY = 190;
                  }

                  const midX = (node.x + targetX) / 2;
                  const midY = (node.y + targetY) / 2 - (node.x < targetX ? 15 : -8);

                  return (
                    <g key={node.id}>
                      <path
                        d={`M ${targetX} ${targetY} Q ${midX} ${midY} ${node.x} ${node.y}`}
                        stroke={hoveredNode === node.id ? '#ff7a00' : 'rgba(239, 106, 12, 0.42)'}
                        strokeWidth={hoveredNode === node.id ? 2.2 : 1.1}
                        fill="none"
                        className={hoveredNode === node.id ? "neural-path-fast" : "neural-path"}
                      />
                    </g>
                  );
                })}

                {/* Connect remaining intermediate hubs to AI center */}
                <path d="M 210 190 Q 175 165 140 140" stroke="rgba(239, 106, 12, 0.6)" strokeWidth="1.5" fill="none" />
                <path d="M 210 190 L 145 200" stroke="rgba(239, 106, 12, 0.6)" strokeWidth="1.5" fill="none" />
                <path d="M 210 190 Q 182 225 155 260" stroke="rgba(239, 106, 12, 0.6)" strokeWidth="1.5" fill="none" />
              </svg>

              {/* Left nodes mapping buttons */}
              {mindNodes.map(node => {
                const isCenter = node.id === 'center';
                const isIntermediate = node.type === 'intermediate';
                
                if (isCenter) return null;

                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      onClick={() => {
                        setSelectedConfidence(prev => Math.min(99, Math.max(90, prev + (Math.random() > 0.48 ? 1 : -1))));
                        onNotify(`🧠 Calcul d'alignement initié sur le noeud : ${node.label}`, "info");
                      }}
                      className={`px-1.5 py-0.5 rounded-md border text-[7.5px] font-black tracking-widest cursor-pointer shadow-md transition-all duration-200 leading-none ${
                        isIntermediate 
                          ? 'bg-[#150a2e]/95 text-orange-400 border-orange-500/40 hover:border-orange-400' 
                          : hoveredNode === node.id
                            ? 'bg-orange-500 text-[#0c041f] border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.55)] font-black'
                            : 'bg-[#0f071f]/95 text-slate-400 border-orange-500/15 hover:border-orange-500/50'
                      }`}
                    >
                      {node.label}
                    </motion.button>
                  </div>
                );
              })}

              {/* Central glowing Target representation 'AI' matching screenshot orange circle bubble */}
              <div 
                style={{ left: '210px', top: '190px' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              >
                <div className="absolute w-11 h-11 bg-orange-500/15 border border-orange-500/30 rounded-full animate-ping pointer-events-none" />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  onClick={() => onNotify("⚡ Couplage neuronal PEGASUS actif au niveau maximum.", "success")}
                  className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 border-none flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                >
                  <span className="text-[10px] font-black text-[#0c041f] tracking-wider leading-none">AI</span>
                </motion.button>
              </div>

            </div>

            {/* Sub text exactly matches visual layout of prompt */}
            <div className="text-[9px] text-[#8c7baf] flex justify-between items-center mt-2.5 pt-1 border-t border-orange-500/5 font-mono">
              <span>SECURITY LEVEL: CLASS-4</span>
              <span>CALCUL DE SEUIL: OK</span>
            </div>

          </div>
        </div>

        {/* -- COLUMN 2: OPERATIONS AI BRAIN & PLATFORM (4 cols) -- */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Header Label precisely structured from screenshot */}
          <div className="border-b-2 border-orange-500/80 pb-2 text-center bg-transparent">
            <span className="text-sm font-black uppercase tracking-[0.13em] text-[#cbd5e1] font-sans">
              PREDICTIVE OPÉRATIONAL INTELLIGENCE
            </span>
          </div>

          <div className="bg-[#0b041e]/90 border border-[#2d124c]/80 rounded-[1.8rem] p-5 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.55)] min-h-[410px] group hover:border-orange-500/30 transition-all duration-300">
            {/* Ambient orange light explosion background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12)_0%,transparent_65%)] pointer-events-none" />

            <div className="w-full flex justify-between items-center z-10 border-b border-orange-500/10 pb-2 mb-1">
              <span className="text-[9.5px] font-black text-rose-500 flex items-center gap-1.5 font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                SYSTEM COUPLING
              </span>
              <button 
                type="button"
                onClick={triggerSync} 
                disabled={isSyncing}
                className="p-1 px-2.5 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/30 rounded-xl text-orange-400 hover:text-white transition-all cursor-pointer text-[8px] flex items-center gap-1 font-bold tracking-widest uppercase"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'SYNC' : 'RECALIBRER'}
              </button>
            </div>

            {/* Glowing Orange Brain graphics container */}
            <div className="relative my-2 flex items-center justify-center h-[255px] w-full z-10">
              
              {/* Background ambient flare and rotating science gears */}
              <div className="absolute w-[200px] h-[200px] bg-orange-500/10 rounded-full blur-[45px] animate-pulse" />
              <div className="absolute w-[170px] h-[170px] border border-orange-500/10 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '30s' }} />
              <div className="absolute w-[140px] h-[140px] border border-dashed border-orange-500/15 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

              {/* Orange Brain glowing core */}
              <motion.div 
                style={{ scale: pulseScale }}
                transition={{ duration: 1.5 }}
                className="relative w-40 h-40 flex items-center justify-center bg-orange-600/[0.04] hover:bg-orange-600/[0.08] border border-orange-500/30 rounded-full cursor-pointer shadow-[0_0_40px_rgba(249,115,22,0.22)] transition-all glow-brain-core"
                onClick={() => {
                  setSelectedConfidence(94);
                  onNotify("🧠 Alignement neuronal PEGASUS stabilisé.", "success");
                }}
              >
                {/* Visual brain core outline */}
                <Brain className="w-24 h-24 text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.65)]" />
                
                {/* Centered orange sharp rectangular AI badge - exactly matching screenshot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-orange-500 text-[#0c041f] font-black text-[12px] px-3.5 py-1.5 rounded-lg border-2 border-[#120732] shadow-xl flex items-center justify-center leading-none tracking-widest font-sans font-bold">
                    AI
                  </div>
                </div>
              </motion.div>

              {/* Glowing flare light rise beams */}
              <div className="absolute bottom-1 inset-x-0 h-10 overflow-hidden pointer-events-none flex justify-around px-12">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: -10, opacity: [0, 0.8, 0] }}
                    transition={{
                      duration: 2 + Math.random() * 1.5,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear"
                    }}
                    className="w-[1.2px] h-6 bg-gradient-to-t from-transparent via-orange-500 to-transparent"
                  />
                ))}
              </div>

              {/* High-tech Concentric Platform with orange loop under the brain matching screenshot bottom target */}
              <svg className="absolute bottom-[-10px] w-[210px] h-[40px] pointer-events-none" viewBox="0 0 200 40">
                <ellipse cx="100" cy="20" rx="90" ry="12" fill="none" stroke="rgba(249,115,10,0.15)" strokeWidth="1" />
                <ellipse cx="100" cy="20" rx="72" ry="9" fill="none" stroke="rgba(249,115,22,0.35)" strokeWidth="1.2" strokeDasharray="5,3" className="animate-pulse" />
                <ellipse cx="100" cy="20" rx="50" ry="6" fill="rgba(249,115,22,0.06)" stroke="#f97316" strokeWidth="1.5" />
                <circle cx="100" cy="20" r="2" fill="#ffffff" />
              </svg>

            </div>

            <div className="w-full z-10 border-t border-orange-500/10 pt-2 flex flex-col items-center">
              <span className="text-[10px] text-orange-400 font-mono tracking-widest font-bold">
                ⚡ PORTAL INTER-SOUVERAIN CONNECTÉ
              </span>
            </div>

          </div>
        </div>

        {/* -- COLUMN 3: ANALYSES DE RISQUE, REGISTERS & RAPPORTS (4 cols) -- */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Header Label precisely structured from screenshot */}
          <div className="border-b-2 border-orange-500/80 pb-2 flex justify-between items-center bg-transparent">
            <span className="text-sm font-black uppercase tracking-[0.13em] text-[#cbd5e1] font-sans">
              ANALYSE DE RISQUE: <span className="text-[#ff9e00] font-black">EN COURS</span>
            </span>
          </div>

          <div className="space-y-4 flex flex-col justify-between h-[410px]">
            
            {/* Widget 1: DOUBLE GRAPHICS CARD (Spline graph + Density bars) */}
            <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-2xl p-3 flex flex-col justify-between h-[115px] overflow-hidden shadow-lg group hover:border-orange-500/15 transition-all">
              <div className="grid grid-cols-2 gap-3 flex-1 h-full items-center">
                
                {/* Spline Wave showing risque coordinates */}
                <div className="h-full relative flex flex-col justify-between pr-2 border-r border-[#2d124c]/40">
                  <div className="flex justify-between items-center">
                    <span className="text-[7.5px] text-slate-400 font-mono font-bold tracking-widest uppercase">RISK WAVE</span>
                    <span className="text-[6.5px] font-mono text-orange-400">100/0</span>
                  </div>
                  
                  <div className="relative flex-1 mt-1">
                    {/* Tiny grid coordinate lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.06]">
                      <div className="w-full h-[1px] bg-white" />
                      <div className="w-full h-[1px] bg-white" />
                      <div className="w-full h-[1px] bg-white" />
                    </div>

                    <svg className="w-full h-full" viewBox="0 0 100 38">
                      {/* Back shading */}
                      <path d="M 0 35 Q 25 10 50 28 T 100 12 L 100 38 L 0 38 Z" fill="rgba(249,115,22,0.04)" />
                      <path d="M 0 35 Q 25 10 50 28 T 100 12" fill="none" stroke="rgba(255,158,0,0.15)" strokeWidth="3" />
                      <path d="M 0 35 Q 25 10 50 28 T 100 12" fill="none" stroke="#f97316" strokeWidth="1" />
                      <circle cx="50" cy="28" r="1.5" className="fill-[#ff4d00]" />
                      <circle cx="100" cy="12" r="1.5" className="fill-white animate-pulse" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[5px] text-slate-500 font-mono tracking-widest mt-[2px] uppercase">
                    <span>001</span>
                    <span>100</span>
                    <span>200</span>
                    <span>300</span>
                    <span>400</span>
                  </div>
                </div>

                {/* Dense vertical bar chart (11-bars) matching right card of Grid 1 */}
                <div className="h-full flex flex-col justify-between pl-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[7.5px] text-slate-400 font-mono font-bold tracking-widest uppercase">FREQUENCY</span>
                    <span className="text-[6.5px] font-mono text-[#00e383]">97.2 MHz</span>
                  </div>
                  
                  <div className="flex items-end justify-between h-[23px] gap-[1px] px-0.5 mt-2">
                    {[38, 55, 78, 42, 85, 95, 63, 75, 48, 89, 70, 80].map((h, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end">
                        <div 
                          style={{ height: `${h}%` }} 
                          className="w-full bg-[#f97316]/90 rounded-t-[1px] hover:bg-orange-400 transition-all duration-200"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[5px] text-slate-500 font-mono mt-1 px-1">
                    <span>10</span>
                    <span>12</span>
                    <span>15</span>
                    <span>20</span>
                    <span>25</span>
                    <span>30</span>
                    <span>35</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Widget 2: FIVE HORIZONTAL SLIDERS WITH POINTING INPUT ARROWS */}
            <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-2xl p-3 flex flex-col justify-between flex-grow h-[130px] shadow-lg group hover:border-orange-500/15 transition-all">
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-1 mb-1 bg-transparent">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#9d89cc]">DECISION REGISTER LOCKS</span>
              </div>

              <div className="space-y-1 py-1">
                {[
                  { name: 'REG-01', width: '85%' },
                  { name: 'REG-02', width: '58%' },
                  { name: 'REG-03', width: '74%' },
                  { name: 'REG-04', width: '42%' },
                  { name: 'REG-05', width: '91%' }
                ].map((reg, index) => (
                  <div key={index} className="flex items-center gap-2 text-[8px] font-mono">
                    
                    {/* Pointing visual orange input arrow matching screenshot */}
                    <div className="flex items-center text-orange-500 animate-pulse shrink-0">
                      <Play className="w-1.5 h-1.5 fill-current rotate-0" />
                    </div>

                    <span className="text-slate-400 font-bold shrink-0 w-11 uppercase leading-none">{reg.name}</span>
                    
                    <div className="flex-1 h-2.5 bg-slate-950/80 border border-orange-500/10 rounded-full overflow-hidden p-[1px]">
                      <div 
                        style={{ width: reg.width }} 
                        className="h-full bg-gradient-to-r from-orange-500 to-[#ff9e00] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: RAPPORTS CARD with progress bars (38%, 2.9%, 7.0%) and Frequency chart */}
            <div className="bg-[#0b041e]/90 border border-[#231245]/75 rounded-2xl p-3 flex flex-col justify-between h-[125px] shadow-lg group hover:border-orange-500/20 transition-all relative">
              
              <div className="flex justify-between items-center border-b border-orange-500/10 pb-1 pt-0.5 bg-transparent">
                <span className="text-[8px] font-black uppercase tracking-widest text-white leading-none">RAPPORTS</span>
                <div className="flex gap-0.5 text-orange-500 select-none">
                  <span className="text-[8px] leading-none">★</span>
                  <span className="text-[8px] leading-none">★</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 items-center mt-1">
                
                {/* Visual statistics progress bars: 38%, 2.9%, 7.0% from screenshot */}
                <div className="space-y-1.5 pr-1 border-r border-[#2d124c]/40 h-full flex flex-col justify-center">
                  
                  {/* Row 1: 38% / +32% */}
                  <div className="flex items-center justify-between text-[7px] font-mono">
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600 rounded-full" style={{ width: '38%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-2 shrink-0 font-bold">
                      <span className="text-slate-200">38%</span>
                      <span className="text-[#00e383] text-[6.5px] font-bold bg-[#00e383]/10 px-0.5 rounded leading-none">+32%</span>
                    </div>
                  </div>

                  {/* Row 2: 2.9% / +22% */}
                  <div className="flex items-center justify-between text-[7px] font-mono">
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ff9e00] rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-2 shrink-0 font-bold">
                      <span className="text-slate-205">2.9%</span>
                      <span className="text-[#00e383] text-[6.5px] font-bold bg-[#00e383]/10 px-0.5 rounded leading-none">+22%</span>
                    </div>
                  </div>

                  {/* Row 3: 7.0% / +55% */}
                  <div className="flex items-center justify-between text-[7px] font-mono">
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-2 shrink-0 font-bold">
                      <span className="text-slate-200">7.0%</span>
                      <span className="text-[#00e383] text-[6.5px] font-bold bg-[#00e383]/10 px-0.5 rounded leading-none">+55%</span>
                    </div>
                  </div>

                </div>

                {/* Mini right bar frequencies */}
                <div className="h-full flex flex-col justify-end pb-1 pl-1">
                  <div className="h-[32px] flex items-end justify-between gap-[1.2px]">
                    {[22, 64, 45, 88, 32, 95, 55, 78, 62, 45, 12].map((v, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end">
                        <div 
                          style={{ height: `${v}%` }} 
                          className="w-full bg-[#ff4d00]/70 rounded-t-[1px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Rapports telemetry labels footer exactly matching image */}
              <div className="flex justify-between items-center text-[6px] text-[#6b5ca0] uppercase font-black font-mono tracking-widest mt-1 border-t border-orange-500/5 pt-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#00e383] rounded-full spin" />
                  FALOGER
                </span>
                <span>TA79774</span>
                <span>000085</span>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* LOWER ROW WITH TWO IDENTICAL CARD TITLES: BOTH TITLED 'FLUX DE DONNÉES OPÉRATIONNELS' */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        
        {/* -- BOTTOM LEFT CARD: FLUX DE DONNÉES OPÉRATIONNELS (6 cols) -- */}
        <div className="md:col-span-6 bg-[#0a041f]/90 border border-[#231245]/70 rounded-[1.8rem] p-4 flex flex-col justify-between h-[190px] shadow-2xl relative overflow-hidden group hover:border-orange-500/20 transition-all duration-300">
          <div className="flex justify-between items-center border-b border-orange-500/10 pb-1.5 mb-2 z-10 bg-transparent">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-sans">
              FLUX DE DONNÉES OPÉRATIONNELS
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 flex-grow z-10">
            
            {/* Left circular gauge 92% conforming to screenshot bottom left */}
            <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0 bg-slate-950/40 border border-orange-500/10 rounded-full shadow-inner">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="rgba(249,115,22,0.04)" strokeWidth="6" fill="none" />
                <circle 
                  cx="48" 
                  cy="48" 
                  r="38" 
                  stroke="#ef6a0c" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray="239"
                  strokeDashoffset={239 - (239 * 92) / 100}
                  className="glow-orange"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-xl font-black text-white font-mono scale-102">92%</span>
                <span className="text-[6px] text-[#ff9e00] font-black uppercase tracking-[0.25em] mt-1 font-mono">FLUX</span>
              </div>
            </div>

            {/* Middle double speedometer gauge with pointer and metrics */}
            <div className="flex-1 flex flex-col justify-center space-y-1.5 px-2">
              <div className="flex justify-between items-center bg-transparent">
                <span className="text-[8px] text-slate-400 font-mono tracking-wider font-bold">CORE COMPACTION</span>
                <span className="text-[8px] text-orange-400 font-mono font-bold">+92%</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/65 border border-orange-500/15 rounded-xl p-1.5 text-center flex flex-col justify-center items-center">
                  <span className="text-[14px] font-black font-mono text-[#ff4f00] leading-none">+92%</span>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <AlertTriangle className="w-2 h-2 text-orange-400" />
                    <span className="text-[5px] text-slate-500 uppercase font-mono">D4-INDEX</span>
                  </div>
                </div>

                <div className="bg-slate-950/65 border border-orange-500/15 rounded-xl p-1.5 text-center flex flex-col justify-center items-center">
                  <span className="text-[14px] font-black font-mono text-[#ff9e00] leading-none">+93%</span>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <AlertTriangle className="w-2 h-2 text-orange-400" />
                    <span className="text-[5px] text-slate-500 uppercase font-mono">L5-CORES</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right stacked frequency registers indices */}
            <div className="w-[80px] h-full flex flex-col justify-center space-y-1 pl-2 border-l border-[#2d124c]/40 shrink-0">
              {[80, 52, 94, 38, 70].map((h, i) => (
                <div key={i} className="flex items-center gap-1 text-[7px] font-mono">
                  <span className="text-slate-500 w-6">BF-0{i+1}</span>
                  <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden p-[0.3px]">
                    <div style={{ width: `${h}%` }} className="h-full bg-orange-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="text-[7.5px] text-slate-500 uppercase font-mono flex justify-between items-center. mt-1 pt-1.5 border-t border-orange-500/5 z-10 w-full">
            <span>STABILISATION OPÉRATIONNELLE</span>
            <span className="text-[#00e383] font-bold">STATUS ACTIVE</span>
          </div>
        </div>

        {/* -- BOTTOM RIGHT CARD: FLUX DE DONNÉES OPÉRATIONNELS (6 cols) -- */}
        <div className="md:col-span-6 bg-[#0a041f]/90 border border-[#231245]/70 rounded-[1.8rem] p-4 flex flex-col justify-between h-[190px] shadow-2xl relative overflow-hidden group hover:border-orange-500/20 transition-all duration-300">
          <div className="flex justify-between items-center border-b border-orange-500/10 pb-1.5 mb-2 z-10 bg-transparent">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-sans">
              FLUX DE DONNÉES OPÉRATIONNELS
            </span>
          </div>

          <div className="flex items-stretch justify-between gap-4 flex-grow z-10">
            
            {/* Left: Dual spline lines graph on custom coordinate grid (JAN, FEB...) */}
            <div className="flex-1 flex flex-col justify-between h-full relative">
              <div className="absolute right-1 top-0 flex gap-2">
                <span className="text-[6px] font-mono text-cyan-400">● INDEX-A</span>
                <span className="text-[6px] font-mono text-fuchsia-500">● INDEX-B</span>
              </div>

              {/* Spline coordinate viewport */}
              <div className="relative flex-1 mt-1 border-b border-[#2d124c]/40 border-l border-[#2d124c]/40 bg-slate-950/20">
                {/* Horizontal target indices: 400, 300, 200, 100, 0 */}
                <div className="absolute left-[-15px] inset-y-0 flex flex-col justify-between text-[5.5px] text-slate-600 font-mono text-right w-11 pointer-events-none">
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>

                {/* Fine grid overlay */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.05]">
                  <div className="w-full h-[1px] bg-white" />
                  <div className="w-full h-[1px] bg-white" />
                  <div className="w-full h-[1px] bg-white" />
                  <div className="w-full h-[1px] bg-white" />
                </div>

                <svg className="w-full h-full pl-3" viewBox="0 0 100 68">
                  {/* Cyan Curve */}
                  <path d="M 0 52 Q 22 28 44 48 T 88 12 T 110 8" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
                  
                  {/* Purple Curve */}
                  <path d="M 0 58 Q 25 35 50 56 T 90 28 T 110 24" fill="none" stroke="#d946ef" strokeWidth="1" strokeDasharray="3,1" />

                  {/* Marker targets */}
                  <circle cx="44" cy="48" r="1.5" className="fill-cyan-400" />
                  <circle cx="88" cy="12" r="1.5" className="fill-fuchsia-400 animate-pulse" />
                </svg>
              </div>

              {/* Month targets bottom alignment row: JAN, FEB, MAR, APR, MAY, JUN */}
              <div className="flex justify-between text-[6px] text-slate-500 font-mono pl-3 pt-[3px] uppercase">
                <span>Jan</span>
                <span>Féb</span>
                <span>Mar</span>
                <span>Avr</span>
                <span>Mai</span>
                <span>Jun</span>
              </div>
            </div>

            {/* Right: Stacked orange indicators status lamps representing packets */}
            <div className="w-[110px] h-full flex flex-col justify-center space-y-1 pl-3 border-l border-[#2d124c]/40 shrink-0">
              <span className="text-[7.5px] text-slate-500 font-mono self-start font-bold uppercase mb-1">LAMP CHIPSETS</span>
              {[
                { label: 'FLUX-1 v', width: '92%' },
                { label: 'FLUX-2 v', width: '74%' },
                { label: 'FLUX-3 v', width: '85%' },
                { label: 'FLUX-4 v', width: '48%' },
              ].map((lamp, i) => (
                <div key={i} className="flex flex-col space-y-[2px]">
                  <div className="flex justify-between text-[6px] font-mono text-slate-400 font-bold uppercase leading-none">
                    <span>{lamp.label}</span>
                    <span>{lamp.width}</span>
                  </div>
                  <div className="h-2.5 bg-slate-950/70 border border-orange-500/10 rounded-sm overflow-hidden p-[0.5px]">
                    <div 
                      style={{ width: lamp.width }} 
                      className="h-full bg-gradient-to-r from-[#ff4d00] to-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="text-[7.5px] text-slate-500 uppercase font-mono flex justify-between items-center mt-1 pt-1.5 border-t border-orange-500/5 z-10 w-full">
            <span>SOUVERAINETÉ DE PROTOCOLE D&apos;AUDIT</span>
            <span className="text-orange-400 font-bold">MATRIX READY</span>
          </div>
        </div>

      </div>

    </div>
  );
};
