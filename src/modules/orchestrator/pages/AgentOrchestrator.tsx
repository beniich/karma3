import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Activity, Power, Settings, 
  User, Terminal, Zap, Play, AlertCircle, CheckCircle2 
} from 'lucide-react';

// --- MOCK DATA ---
const AGENTS = [
  { id: 'alpha', name: 'Agent Alpha', role: 'Synthesizing Data', status: 'Active', successRate: 92, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { id: 'beta', name: 'Agent Beta', role: 'Optimizing Query', status: 'Amber', successRate: 88, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { id: 'gamma', name: 'Agent Gamma', role: 'Executing Trade', status: 'Amber', successRate: 95, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
];

const AgentCard = ({ agent }: any) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className={`p-4 rounded-2xl border ${agent.border} ${agent.bg} backdrop-blur-md mb-4`}
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{agent.name}</div>
          <div className="text-[10px] text-gray-400">{agent.role}</div>
        </div>
      </div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${agent.border} ${agent.color}`}>
        {agent.status}
      </div>
    </div>
    
    <div className="mb-4">
      <div className="flex justify-between text-[10px] mb-1 text-gray-400 uppercase tracking-widest">
        <span>Success Rate</span>
        <span>{agent.successRate}%</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${agent.successRate}%` }}
          className={`h-full ${agent.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} 
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all cursor-pointer">
        <Power className="w-3 h-3" /> Kill Switch
      </button>
      <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold hover:bg-white/10 transition-all cursor-pointer">
        Manual Override
      </button>
    </div>
  </motion.div>
);

export const AgentOrchestrator = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 1. Connexion au serveur
    const socketUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
    console.log('Connecting socket in AgentOrchestrator at:', socketUrl);
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.io connected (AgentOrchestrator)');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected (AgentOrchestrator)');
      setIsConnected(false);
    });

    // 2. Écoute des événements 'agent-log'
    socket.on('agent-log', (newLog: any) => {
      setLogs(prev => {
        // Limitation à 60 logs pour éviter les lenteurs DOM
        const updatedLogs = [...prev, newLog];
        return updatedLogs.slice(-60);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-scroll vers le bas lors de l'arrivée de nouveaux logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#05050a] text-white p-8 font-sans overflow-hidden relative">
      {/* Visual Connection Status Indicator (Top-Right Corner) */}
      <div 
        id="connection-status-indicator" 
        className={`absolute top-6 right-8 z-50 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/90 border text-xs font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 ${
          isConnected 
            ? 'border-green-500/30 indicator-pulse-active' 
            : 'border-white/10'
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          {isConnected ? (
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-green-500 pulse-green"></span>
          ) : (
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-red-500 pulse-red"></span>
          )}
        </span>
        <span className={isConnected ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
          {isConnected ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* TOP NAV */}
      <nav className="flex justify-between items-center mb-10 border-b border-white/5 pb-4 pr-32">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(191,90,242,0.4)]">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-syne tracking-tight">Agent Orchestrator</h1>
            <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5 tracking-wider">Karma3 Sovereign Control Zone</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <span className="text-white border-b-2 border-purple-500 pb-1 cursor-pointer">Dashboard</span>
          <span className="hover:text-white cursor-pointer transition-colors">Agents</span>
          <span className="hover:text-white cursor-pointer transition-colors">Logs</span>

          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)]">
        
        {/* LEFT: Active Agents */}
        <div className="col-span-3 flex flex-col gap-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 flex items-center gap-2 font-mono">
            <Activity className="w-3 h-3" /> Active Agents
          </h2>
          <div className="overflow-y-auto pr-2 scrollbar-hide flex-1">
            {AGENTS.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
          <div className="mt-auto p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase font-bold font-mono">Global Safety</span>
            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
            </span>
          </div>
        </div>

        {/* RIGHT: Workflow & Logs */}
        <div className="col-span-9 flex flex-col gap-6 h-full justify-between">
          
          {/* Workflow Visualization */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden min-h-[300px]">
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
               <Zap className="w-4 h-4 text-purple-500" />
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Agent Workflow Visualization</span>
            </div>
            
            {/* SVG Graph Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 200 150 C 300 150, 300 220, 400 220" stroke="#bf5af2" strokeWidth="2" fill="none" strokeOpacity="0.4" />
              <path d="M 200 290 C 300 290, 300 220, 400 220" stroke="#bf5af2" strokeWidth="2" fill="none" strokeOpacity="0.4" />
              <path d="M 400 220 C 500 220, 500 150, 600 150" stroke="#bf5af2" strokeWidth="2" fill="none" strokeOpacity="0.4" />
              <path d="M 400 220 C 500 220, 500 290, 600 290" stroke="#bf5af2" strokeWidth="2" fill="none" strokeOpacity="0.4" />
              
              {/* Pulse animation */}
              <circle r="4" fill="#a855f7" filter="drop-shadow(0 0 5px #a855f7)">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 200 150 C 300 150, 300 220, 400 220" />
              </circle>
              <circle r="4" fill="#10b981" filter="drop-shadow(0 0 5px #10b981)">
                <animateMotion dur="5s" repeatCount="indefinite" path="M 400 220 C 500 220, 500 290, 600 290" />
              </circle>
            </svg>

            {/* Nodes */}
            <div className="absolute top-1/2 left-[5%] -translate-y-1/2 flex flex-col gap-12 z-10">
               <div className="p-3 rounded-lg bg-slate-950/80 border border-white/20 text-[10px] w-32 text-center font-mono text-slate-300">Input Node A</div>
               <div className="p-3 rounded-lg bg-slate-950/80 border border-white/20 text-[10px] w-32 text-center font-mono text-slate-300">Input Node B</div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
               <div className="w-36 h-20 rounded-2xl bg-purple-600/20 border-2 border-purple-500 flex flex-col items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(191,90,242,0.3)]">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wide font-mono">Decision Engine</span>
                  <span className="text-[8px] text-emerald-400 font-mono mt-1">SOVEREIGN CORE COMPLIANT</span>
               </div>
            </div>

            <div className="absolute top-1/2 left-[80%] -translate-y-1/2 flex flex-col gap-12 z-10">
               <div className="p-3 rounded-lg bg-slate-950/80 border border-white/20 text-[10px] w-32 text-center font-mono text-slate-300">Outcome Alpha</div>
               <div className="p-3 rounded-lg bg-slate-950/80 border border-white/20 text-[10px] w-32 text-center font-mono text-slate-300">Outcome Beta</div>
            </div>
          </div>

          {/* Streaming Thought Process Log */}
          <div className="h-64 bg-[#0a0a0f] border border-white/10 rounded-3xl p-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-xs font-mono text-gray-400">Streaming Thought Process Log (Socket.io Tunnel)</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 p-6 font-mono text-sm overflow-y-auto scrollbar-hide bg-[#030307]"
            >
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex gap-4 mb-2 text-xs border-b border-white/5 pb-1"
                  >
                    <span className="text-gray-600 text-[10px]">{log.time}</span>
                    <span className="text-purple-400 text-[10px] font-bold uppercase shrink-0">[{log.agent || 'SYSTEM'}]</span>
                    <span className={`${log.color || 'text-slate-300'} text-xs`}>{log.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 italic text-xs">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500 mb-2" />
                  <span>Connecting to Live Socket.io Core, initializing neural pathways...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgentOrchestrator;
