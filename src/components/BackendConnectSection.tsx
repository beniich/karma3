import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Database, 
  Send, 
  Terminal, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Play, 
  Sparkles, 
  Code, 
  Cpu, 
  CheckCircle2, 
  Activity,
  Code2
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface PingResponse {
  status: string;
  message: string;
  receivedMessage: string;
  clientTime: string;
  serverTime: string;
  delayMs: number;
  environment: string;
  serverPort: number;
  features: string[];
}

export const BackendConnectSection = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  // Use our socket hook
  const { socket, isConnected } = useSocket("connect-dashboard");
  const [socketLogs, setSocketLogs] = useState<any[]>([]);
  const [pingStats, setPingStats] = useState<{ lastPingMs: number | null; totalPings: number }>({
    lastPingMs: null,
    totalPings: 0
  });

  // REST Testing forms state
  const [customMessage, setCustomMessage] = useState('Analyse de liaison réseau sécurisée');
  const [pingLoading, setPingLoading] = useState(false);
  const [pingResult, setPingResult] = useState<PingResponse | null>(null);

  // AI Backend Proxy testing state
  const [aiPrompt, setAiPrompt] = useState('Exlique pourquoi une architecture full-stack sécurise les clés d’API comme GEMINI_API_KEY en les limitant au serveur.');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string>('');

  // Log terminal ref for autoscroll
  const loggerEndRef = useRef<HTMLDivElement>(null);

  // Trace live background socket events
  useEffect(() => {
    if (!socket) return;

    const handleAgentLog = (log: any) => {
      setSocketLogs(prev => [
        {
          id: Math.random().toString(36).substring(7),
          time: log.time || new Date().toLocaleTimeString('en-US', { hour12: false }),
          level: log.level || 'INFO',
          agent: log.agent || 'Server',
          text: log.text || JSON.stringify(log),
          color: log.color || 'text-indigo-400'
        },
        ...prev.slice(0, 49) // Keep last 50 logs
      ]);
    };

    const handleStripeWebhook = (data: any) => {
      setSocketLogs(prev => [
        {
          id: Math.random().toString(36).substring(7),
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          level: 'SUCCESS',
          agent: 'StripeWeb',
          text: `🔔 Webhook Stripe traité: Plan ${data.planName} (+${data.tokensAdded} jetons). Signature validée!`,
          color: 'text-emerald-400'
        },
        ...prev
      ]);
      onNotify(`💳 Flux paiement capté en temps réel par Webhook : +${data.tokensAdded} jetons !`);
    };

    socket.on('agent-log', handleAgentLog);
    socket.on('stripe-webhook-processed', handleStripeWebhook);

    // Push initial status log
    setSocketLogs(prev => [
      {
        id: 'init-log',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: 'INFO',
        agent: 'System',
        text: 'Terminal d\'écoute connecté au flux d\'événements Socket.IO du serveur.',
        color: 'text-sky-400'
      },
      ...prev
    ]);

    return () => {
      socket.off('agent-log', handleAgentLog);
      socket.off('stripe-webhook-processed', handleStripeWebhook);
    };
  }, [socket, onNotify]);

  // REST API ping-pong caller
  const handleRestPing = async () => {
    setPingLoading(true);
    const start = Date.now();
    try {
      const response = await fetch('/api/connect/ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientTime: new Date().toISOString(),
          clientMessage: customMessage,
          browserInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node-Client'
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: PingResponse = await response.json();
      const end = Date.now();
      
      setPingResult(data);
      setPingStats(prev => ({
        lastPingMs: end - start,
        totalPings: prev.totalPings + 1
      }));
      onNotify('⚡ Requête REST effectuée avec succès !');
    } catch (err: any) {
      console.error(err);
      onNotify(`❌ Échec de la requête REST : ${err.message}`);
    } finally {
      setPingLoading(false);
    }
  };

  // Trigger manual sovereign workflow stream via WebSocket
  const triggerSocketWorkflow = () => {
    if (!socket || !isConnected) {
      onNotify('❌ Impossible de déclencher : WebSocket déconnecté.');
      return;
    }
    
    setSocketLogs(prev => [
      {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: 'TRIGGER',
        agent: 'Client',
        text: '📤 Envoi d\'un signal "trigger-agent-workflow" via WebSocket au serveur...',
        color: 'text-[#f97316]'
      },
      ...prev
    ]);

    socket.emit('trigger-agent-workflow');
    onNotify('📤 Signal workflow transmis au serveur.');
  };

  // Secure Server-Side Gemini Request AI proxy
  const handleSecureAiQuery = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult('');
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          systemInstruction: "You are Karma3 Full-Stack Security Evaluator. Explain key features and security strategies simply with maximum 2-3 short, clean bullet points. Return pure text, no markdown block syntax."
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur serveur ${response.status}`);
      }

      const data = await response.json();
      setAiResult(data.text || 'Le serveur n\'a renvoyé aucun texte.');
      onNotify('🤖 Génération de réponse sécurisée via intermédiaire serveur complétée.');
    } catch (err: any) {
      console.error(err);
      setAiResult(`❌ Échec de la requête trans-serveur : ${err.message}\nAssurez-vous que la clé d'API GEMINI_API_KEY est configurée dans votre panneau de configuration d'environnement.`);
      onNotify(`❌ Échec de l'appel AI : ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#cbd5e1] p-1 md:p-4 text-left select-none relative">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-wider">
            Full-Stack Connection Lab
          </span>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3 mt-2">
            <span className="w-2.5 h-7 bg-indigo-500 rounded-full inline-block" />
            Frontend & Backend Connector Hub
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Supervisez, testez et validez en temps réel le pont de communication REST API et WebSocket entre votre navigateur et le serveur d'exécution Node.js.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-[#0d0725]/60 border border-[#3e238f]/40 p-3.5 rounded-2xl shadow-xl">
          <div className="flex flex-col items-end text-right">
            <span className="text-[9px] uppercase text-slate-400 font-mono">STATUT WS SERVEUR</span>
            <span className="text-xs font-black text-white font-mono uppercase mt-0.5">
              {isConnected ? 'CONNECTÉ' : 'HORS LIGNE'}
            </span>
          </div>
          <div className="relative flex h-3.5 w-3.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
              </>
            ) : (
              <>
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Network Path Architectural Visualization & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Architectural Path Block (7 cols) */}
        <div className="lg:col-span-8 bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[340px]">
          {/* Abstract Grid Map Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase font-mono block mb-2">
              LIAISON TOPOLOGIQUE ACTIVE
            </span>
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider">Topologie de Connexion Full-Stack</h4>
            <p className="text-[10.5px] text-slate-400 mt-1">
              Visualisez le chemin emprunté par les requêtes HTTP (REST) et les événements bidirectionnels asynchrones (WebSockets) via le port d'ingress <strong className="text-indigo-400 font-mono">3000</strong>.
            </p>
          </div>

          {/* Interactive CSS Cable Animation Diagram */}
          <div className="my-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            {/* Client Browser */}
            <div className="w-full sm:w-2/9 bg-[#09051c]/90 border-2 border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(99,102,241,0.2)]">
              <div className="p-3 bg-indigo-500/10 rounded-xl mb-2 text-indigo-400">
                <Code className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black text-white">Navigateur Client</span>
              <span className="text-[8px] font-mono text-slate-400 mt-1">Vite + React SPA</span>
              <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded text-[8px] font-mono mt-2">
                PORT: Client-Side
              </span>
            </div>

            {/* Pulsing Cables lines representing communication protocols */}
            <div className="flex-1 w-full sm:w-auto h-24 sm:h-auto flex flex-col justify-center items-center gap-4 relative">
              {/* REST (HTTP) Pipeline */}
              <div className="w-full relative flex items-center justify-center">
                <div className="absolute left-0 right-0 h-1 bg-indigo-950 rounded" />
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f97316] to-transparent rounded"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
                <span className="relative z-10 px-2.5 py-1 bg-[#10072d] border border-white/5 rounded-full text-[8.5px] font-black text-orange-400 font-mono">
                  REST POST/GET (HTTP)
                </span>
              </div>

              {/* WebSocket (Socket.io) Pipeline */}
              <div className="w-full relative flex items-center justify-center">
                <div className="absolute left-0 right-0 h-1 bg-indigo-950 rounded" />
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                />
                <span className={`relative z-10 px-2.5 py-1 bg-[#10072d] border border-white/5 rounded-full text-[8.5px] font-black font-mono transition-all ${isConnected ? 'text-cyan-400' : 'text-slate-400 line-through'}`}>
                  {isConnected ? '⚡ WEBSOCKET (SOCKET.IO) ACTIVE' : '🔌 WS DISCONNECTED'}
                </span>
              </div>
            </div>

            {/* Server Node.js */}
            <div className={`w-full sm:w-2/9 bg-[#09051c]/90 border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg transition-all ${isConnected ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'border-[#372375]'}`}>
              <div className={`p-3 rounded-xl mb-2 transition-all ${isConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                <Server className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[11px] font-black text-white">Serveur Express</span>
              <span className="text-[8px] font-mono text-slate-400 mt-1">NodeJS (TSX Runner)</span>
              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded text-[8px] font-mono mt-2">
                PORT: 3000 Ingress
              </span>
            </div>
          </div>

          <div className="bg-[#0c0525] border border-[#3e238f]/40 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-semibold font-mono">Dernière performance réseau</div>
                <div className="text-xs text-white font-extrabold uppercase mt-0.5">
                  {pingResult ? `${pingStats.lastPingMs} ms de latence aller-retour` : 'En attente de connexion...'}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRestPing}
              disabled={pingLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              {pingLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 text-emerald-300" />}
              Lancer Test REST
            </button>
          </div>
        </div>

        {/* Real-Time KPIs Panel (4 cols) */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-4">
          
          {/* Socket KPI card */}
          <div className="bg-[#1b103c]/45 border border-[#372375]/50 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#4e31a1]/70 transition-all">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
              <Wifi className="w-20 h-20 text-cyan-400" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase font-mono">
                  WEBSOCKET CHANNEL
                </span>
                <span className={`px-2 py-0.5 border rounded text-[8px] font-bold font-mono uppercase ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {isConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <h3 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 leading-none mt-3">
                {isConnected ? 'Socket.io v4' : 'Offline'}
              </h3>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed mt-2">
              {isConnected ? (
                <span className="font-mono text-[9px] text-[#22c55e]">
                  ✓ Écouteur opérationnel de logs d'audit configuré sur le tunnel.
                </span>
              ) : (
                <span className="text-red-400">
                  ✗ Déconnecté. Le serveur redémarre peut-être, ou la connexion est fermée.
                </span>
              )}
            </div>
          </div>

          {/* REST API Call Tracker */}
          <div className="bg-[#1b103c]/45 border border-[#372375]/50 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#4e31a1]/70 transition-all">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
              <Activity className="w-20 h-20 text-orange-400" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase font-mono">
                  SUITE DES REST CALLS
                </span>
                <span className="text-[9.5px] text-orange-400 font-extrabold font-mono">
                  {pingStats.totalPings} ESSAIS
                </span>
              </div>
              <h3 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 leading-none mt-3">
                HTTP REST
              </h3>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed mt-2 font-mono">
              GET /api/billing/webhook-logs <br />
              POST /api/connect/ping (OK)
            </div>
          </div>

        </div>
      </div>

      {/* Main Connection Playground Layout & Log terminal */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Playgound 1: REST Interactive Tester & State Explorer */}
        <div className="xl:col-span-6 bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-orange-400" />
                REST Playground & Diagnostic Center
              </h4>
              <p className="text-[10.5px] text-slate-400 mt-1">
                Soumettez des données structurées et observez la désérialisation, le traitement serveur, et la réponse scellée en retour.
              </p>
            </div>

            <div className="space-y-4 bg-[#09051e]/80 border border-[#3e238f]/40 p-4 rounded-2xl">
              {/* REST Message text field */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider font-mono">Message personnalisé (Payload)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Tapez un message..." 
                    className="flex-1 bg-[#150a30]/80 border border-[#3e238f]/60 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-medium"
                  />
                  <button 
                    onClick={handleRestPing}
                    disabled={pingLoading}
                    className="px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-850 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all border border-orange-500/20"
                  >
                    {pingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Advanced Live actions testers */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-indigo-950/40">
                <button
                  onClick={async () => {
                    setPingLoading(true);
                    try {
                      const res = await fetch('/api/billing/webhook-logs');
                      const json = await res.json();
                      setPingResult({
                        status: "success",
                        message: "Logs de facturation Stripe récupérés avec succès de la mémoire du serveur.",
                        receivedMessage: "GET /api/billing/webhook-logs",
                        clientTime: new Date().toISOString(),
                        serverTime: new Date().toISOString(),
                        delayMs: 2,
                        environment: "production_mock",
                        serverPort: 3000,
                        features: json.map((l: any) => `${l.eventType} (${l.status})`)
                      });
                      onNotify("📬 Logs de facturation Stripe synchronisés !");
                    } catch (e: any) {
                      onNotify(`❌ Échec : ${e.message}`);
                    } finally {
                      setPingLoading(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#180d38] border border-[#3e238f]/50 hover:bg-[#251457] rounded-lg text-[9.5px] font-black uppercase text-indigo-400 hover:text-white transition-all cursor-pointer font-mono"
                >
                  GET Logs Facturation
                </button>
                
                <button
                  onClick={triggerSocketWorkflow}
                  className="px-3 py-1.5 bg-[#f97316]/10 border border-[#f97316]/30 hover:bg-[#f97316]/20 rounded-lg text-[9.5px] font-black uppercase text-orange-400 hover:text-white transition-all cursor-pointer font-mono"
                >
                  Trigger WS Workflow Stream
                </button>
              </div>
            </div>

            {/* Response Console output */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider font-mono">
                CONSOLE DE SORTIE DE PING REST (JSON RETOURNÉ)
              </span>
              <div className="bg-[#070318] border border-[#3e238f]/40 px-4 py-3.5 rounded-2xl min-h-[160px] max-h-[220px] overflow-y-auto font-mono text-[10px] text-emerald-400 text-left relative flex flex-col justify-between">
                {pingResult ? (
                  <pre className="whitespace-pre-wrap text-emerald-400/90 leading-relaxed max-w-full">
                    {JSON.stringify(pingResult, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 py-10">
                    <Code2 className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
                    <span>En attente d'une requête...</span>
                    <span className="text-[9px] text-slate-600 mt-1">Cliquez sur "Lancer Test REST" pour interroger /api/connect/ping</span>
                  </div>
                )}
                {pingResult && (
                  <div className="border-t border-[#1b103c]/40 pt-2 mt-4 text-[8.5px] text-slate-500 flex justify-between">
                    <span>STATUS: {pingResult.status.toUpperCase()}</span>
                    <span>PORT: {pingResult.serverPort}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Playground 2: Secure Server-Side Gemini API Proxy Test */}
        <div className="xl:col-span-6 bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-extrabold text-[#c084fc] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                Serveur Proxy AI (Exclusivité Server-Side)
              </h4>
              <p className="text-[10.5px] text-slate-400 mt-1">
                La clé <strong className="text-indigo-400 font-mono">GEMINI_API_KEY</strong> est stockée de manière sûre sur le serveur. Ce proxy permet au frontend de l'exploiter sans jamais l'exposer dans les outils de développement du navigateur.
              </p>
            </div>

            <div className="space-y-4 bg-[#09051e]/80 border border-purple-500/10 p-4 rounded-2xl">
              {/* Prompt field */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider font-mono">Instruction/Prompt pour le modèle sécurisé</label>
                <div className="flex gap-2">
                  <textarea 
                    rows={2}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Décrivez votre requête pour le robot d'analyse..." 
                    className="flex-1 bg-[#150a30]/80 border border-[#3e238f]/60 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-purple-500 font-medium resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  onClick={handleSecureAiQuery}
                  disabled={aiLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] flex items-center gap-2 cursor-pointer"
                >
                  {aiLoading ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      <span>Appel en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5 text-purple-200" />
                      <span>Envoyer via Proxy Serveur</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI result terminal */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider font-mono">
                RÉPONSE DU MODÈLE GEMINI-2.0-FLASH VIA SERVEUR PROXY
              </span>
              <div className="bg-[#070318] border border-purple-500/10 px-4 py-3.5 rounded-2xl min-h-[128px] max-h-[180px] overflow-y-auto text-xs text-purple-200 leading-relaxed text-left font-mono">
                {aiResult ? (
                  <p className="whitespace-pre-wraps text-[#cbd5e1] font-mono leading-relaxed">
                    {aiResult}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 py-6">
                    <Sparkles className="w-7 h-7 text-purple-900/40 mb-1" />
                    <span className="text-[10px]">Prêt à traiter votre prompt de test d'API d'IA.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row 3: Socket.IO Live Operations Log Streamer */}
      <div className="bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-xl">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 animate-pulse"></span>
              </span>
              Flux WebSocket en Direct (Audit Event Logs)
            </h4>
            <p className="text-[10px] text-[#94a3b8] font-semibold mt-1">
              Consultez en direct les événements système diffusés en temps réel par le serveur Node.js via le protocole Socket.IO.
            </p>
          </div>
          
          <button
            onClick={() => setSocketLogs([])}
            className="text-[10.5px] font-bold font-mono text-slate-400 hover:text-white bg-black/45 border border-[#372375]/60 hover:border-indigo-500 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Effacer flux
          </button>
        </div>

        {/* Live terminal style table */}
        <div className="bg-[#070319] border border-[#372375]/40 rounded-2xl p-4 md:p-6 overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/40 px-2.5 py-1 rounded-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            LISTEN STATE: ACTIVE_SUBSCRIBE
          </div>

          <div className="max-h-[250px] min-h-[160px] overflow-y-auto space-y-2 text-left font-mono text-[11px] leading-relaxed select-text pr-2 scrollbar-thin scrollbar-thumb-indigo-900/30 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {socketLogs.length > 0 ? (
                socketLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-1.5 border-b border-[#1b103c]/20"
                  >
                    <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/5 shrink-0 select-none ${log.color} w-20 text-center inline-block`}>
                      {log.agent}
                    </span>
                    <span className={`font-semibold shrink-0 select-none text-[9.5px] ${log.level === 'WARN' ? 'text-yellow-500' : log.level === 'SUCCESS' ? 'text-green-400' : 'text-slate-400'}`}>
                      {log.level} :
                    </span>
                    <span className="text-[#cbd5e1] whitespace-pre-wrap break-all">{log.text}</span>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 text-slate-500">
                  <WifiOff className="w-8 h-8 text-slate-600 mb-2" />
                  <span>Aucun log reçu pour le moment.</span>
                  <span className="text-[10px] text-slate-600">Les logs d'infrastructure serveur apparaitront d'ici quelques secondes ou après déclenchement d'un workflow.</span>
                </div>
              )}
            </AnimatePresence>
            <div ref={loggerEndRef} />
          </div>
        </div>
      </div>

    </div>
  );
};
