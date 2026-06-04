import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Cpu, 
  Database, 
  Layout, 
  ArrowRightLeft, 
  ShieldCheck, 
  Workflow, 
  Server, 
  Zap,
  Globe,
  Radio,
  Share2,
  Monitor,
  Laptop,
  Smartphone,
  Shield,
  Lock,
  Terminal,
  Cloud,
  Network,
  Bell,
  Activity,
  ArrowRight
} from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  status: 'ONLINE' | 'STANDBY' | 'FILTERING' | 'SECURED';
  rate: string;
  load: string;
  detailsFR: string;
  detailsEN: string;
}

export const NexusArchitectureOverview = ({ onNotify, language = 'FR' }: { onNotify: (msg: string) => void; language?: 'FR' | 'EN' }) => {
  const t = (fr: string, en: string) => language === 'FR' ? fr : en;
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isTrafficActive, setIsTrafficActive] = useState(true);
  const [activeTunnel, setActiveTunnel] = useState<string | null>(null);
  const [latencyMultiplier, setLatencyMultiplier] = useState<number>(1);
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZATION: Connected to Sovereign System Orchestrator",
    "TUNNEL vpn-1: Status SECURED - AES-GCM-256 shaking hands",
    "API gateway-cloud: Multi-zone routing deployed successfully"
  ]);

  // Handle system ticks for live logs simulation
  useEffect(() => {
    if (!isTrafficActive) return;
    const interval = setInterval(() => {
      const liveEvents = [
        "PACKET: Transit device-cluster -> bastion-transit -> db-write-success",
        "SECURITY: Packet hash verification OK - HMAC checked",
        "TELEMETRY: Node telemetry reported to Orchestrator, status green",
        "ENCLAVE: Re-keying complete for VPN Sovereign-1",
        "LOAD-BALANCER: Routed user request to closest container zone"
      ];
      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      const timestamp = new Date().toISOString().slice(11, 19);
      setLogs(prev => [`[${timestamp}] ${randomEvent}`, ...prev.slice(0, 15)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isTrafficActive]);

  const componentsData: Record<string, ComponentDetail> = {
    // Client section
    'client-env': {
      id: 'client-env',
      name: 'Client Device Cluster',
      status: 'ONLINE',
      rate: '1.2 GB/s',
      load: '34%',
      detailsFR: 'Point d\'accès local des utilisateurs souverains. Chiffrement natif de bout en bout et isolation matérielle contre les attaques de canal auxiliaire.',
      detailsEN: 'Local endpoint hub for secure clients. Implements zero-trust application verification and localized anti-sniffing protective hardware.'
    },
    'controllers': {
      id: 'controllers',
      name: 'Sovereign Controllers',
      status: 'ONLINE',
      rate: '890 MB/s',
      load: '12%',
      detailsFR: 'Contrôleurs locaux gérant l\'orchestration locale du trafic, les signatures asymétriques et la répartition de charge initiale.',
      detailsEN: 'Localized telemetry coordinators handling cryptographic handshakes, and token routing metrics on-premise.'
    },
    // Bastion Tunnels
    'vpn-1': {
      id: 'vpn-1',
      name: 'VPN Sovereign Secure Access 1',
      status: 'SECURED',
      rate: '350 MB/s',
      load: '45%',
      detailsFR: 'Tunnel sécurisé primaire militarisé. Utilise un échange de clés post-quantiques cryptographiques et rotation de tokens asynchrones.',
      detailsEN: 'Primary hardened communications tunnel. Utilizes post-quantum key exchanges and cryptographic token rotation hourly.'
    },
    'vpn-2': {
      id: 'vpn-2',
      name: 'VPN Sovereign Secure Access 2',
      status: 'SECURED',
      rate: '410 MB/s',
      load: '18%',
      detailsFR: 'Tunnel secondaire destiné aux basculements à haute disponibilité en cas de saturation de ligne ou de détection d\'anomalie.',
      detailsEN: 'Backup high-availability network path for seamless failover during intense network congestion periods.'
    },
    'vpn-3': {
      id: 'vpn-3',
      name: 'VPN Secure Direct',
      status: 'SECURED',
      rate: '600 MB/s',
      load: '40%',
      detailsFR: 'Ligne directe exclusive pour l\'administration distante sécurisée et flux de configuration système en temps réel.',
      detailsEN: 'Dedicated admin link strictly reserved for manual sovereign remote operations & core real-time telemetry pipelines.'
    },
    'vpn-4': {
      id: 'vpn-4',
      name: 'VPN Access Assertion',
      status: 'FILTERING',
      rate: '150 MB/s',
      load: '72%',
      detailsFR: 'Système d\'assertion d\'accès filtrant en continu tous les jetons d\'autorisation système pour bloquer les usurpations de privilèges.',
      detailsEN: 'Access assertion pipeline evaluating micro-permissions live. Instantly isolates untrusted device credentials.'
    },
    'api-gateway': {
      id: 'api-gateway',
      name: 'API Edge Access Layer',
      status: 'ONLINE',
      rate: '150 ms (Avg)',
      load: '22%',
      detailsFR: 'Porte d\'entrée API externe sécurisée, appliquant du rate-limiting strict et du sandboxing automatique des charges utiles d\'appels.',
      detailsEN: 'DDoS protected entry point for official external integrations, enforcing payload hygiene tests concurrently.'
    },
    // Cloud
    'api-layer': {
      id: 'api-layer',
      name: 'Internal Cloud APIs',
      status: 'ONLINE',
      rate: '3,400 Req/s',
      load: '29%',
      detailsFR: 'Microservices de routage de données internes traduisant les requêtes chiffrées en instructions d\'audits.',
      detailsEN: 'Backbone internal cloud routers orchestrating high-density secure service routing across compute environments.'
    },
    'db-layer': {
      id: 'db-layer',
      name: 'Immutable Vault Database',
      status: 'ONLINE',
      rate: '99.999% Sync',
      load: '49%',
      detailsFR: 'Base de données cryptographique sécurisée et persistante, contenant tous les journaux d\'audit et traces d\'accès inaltérables.',
      detailsEN: 'Hardened cryptographic datastore designed for ledger audit integrity, persisting all security logs of client devices.'
    },
    'compute': {
      id: 'compute',
      name: 'High-Density Compute Enclave',
      status: 'ONLINE',
      rate: '12 TFLOPS',
      load: '58%',
      detailsFR: 'Algorithmes d\'inférence IA et traitement cognitif identifiant les menaces complexes et auditant les machines distantes.',
      detailsEN: 'Cognitive models and heuristics processors parsing anomalous telemetry data in real-time isolation.'
    },
    'webapp': {
      id: 'webapp',
      name: 'Nexus Admin Portal App',
      status: 'ONLINE',
      rate: '0.04s Load',
      load: '15%',
      detailsFR: 'Interface d\'administration principale, distribuant les tableaux de bord et visualisations interactives aux opérateurs de sécurité.',
      detailsEN: 'Main supervisory cockpit UI compiling graphical analytics databases and offering dynamic playbook executors.'
    },
    // Orchestrator
    'orchestrator': {
      id: 'orchestrator',
      name: 'Sovereign System Orchestrator',
      status: 'ONLINE',
      rate: 'Apex Core',
      load: '5%',
      detailsFR: 'Le centre névralgique de commande. Il surveille l\'intégrité de tous les commutateurs, VPNs, bases de données et infrastructures.',
      detailsEN: 'The central system brain. Monitors integrity of all virtual switches, VPN assets, databases and server infrastructures.'
    }
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
    const item = componentsData[elementId];
    if (item) {
      onNotify(`⚙️ Inspecteur Nexus : Éléments cryptographiques "${item.name}" activé.`);
    }
  };

  return (
    <div className="space-y-6 text-[#cbd5e1] text-left select-none relative">
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .network-cable {
          stroke-dasharray: 8, 4;
          animation: dash 2.5s linear infinite;
        }
        .network-cable-fast {
          stroke-dasharray: 6, 3;
          animation: dash 1.2s linear infinite;
        }
        .glow-hover:hover {
          filter: drop-shadow(0px 0px 8px rgba(249, 115, 22, 0.4));
        }
      `}</style>

      {/* Controller Controls Toolbar */}
      <div className="bg-[#0b1728] border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#94a3b8]">
            {t("Simulateur d'Intégrité d'Infrastructure", "Infrastructure Integrity Simulator")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsTrafficActive(!isTrafficActive);
              onNotify(isTrafficActive ? t("⏸️ Flux d'activité réseau mis en pause", "⏸️ Network traffic activity stream paused") : t("▶️ Flux de paquets réactivé", "▶️ Packet flows reactivated"));
            }}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
              isTrafficActive 
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-slate-900' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isTrafficActive ? 'PAUSE TRAFFIC' : 'RESUME TRAFFIC'}
          </button>
          <button
            type="button"
            onClick={() => {
              const newMultiplier = latencyMultiplier === 1 ? 0.3 : latencyMultiplier === 0.3 ? 2 : 1;
              setLatencyMultiplier(newMultiplier);
              onNotify(t(`🚀 Vitesse de transmission ajustée : x${1/newMultiplier}`, `🚀 Transmission speed adjusted: x${1/newMultiplier}`));
            }}
            className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            SPEED: x{latencyMultiplier === 1 ? '1.0' : latencyMultiplier === 0.3 ? '3.0' : '0.5'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Master Diagram Area */}
        <div className="lg:col-span-8 bg-[#0a1626]/95 border border-slate-800/80 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
          
          {/* Header titles */}
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none">
              Nexus Infrastructure Architecture
            </h3>
            <p className="text-xs text-slate-400 font-bold tracking-wider font-mono">
              Technical infrastructure details.
            </p>
          </div>

          {/* BACKGROUND SYSTEM GRID & CONNECTIONS SVG SCREEN (Absolutely placed under components) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" style={{ minHeight: '520px' }} viewBox="0 0 800 500" preserveAspectRatio="none">
              {/* Grid backgrounds */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(249, 115, 22, 0.02)" strokeWidth="1" />
                </pattern>
                <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ea580c" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* DYNAMIC PIPELINES REPRESENTING FLUID PACKETS IN SCREENSHOT */}
              {isTrafficActive && (
                <>
                  {/* Pipeline from Orchestrator down to Left Panel */}
                  <path d="M 400 65 L 180 65 L 180 110" fill="none" stroke="url(#gradient-orange)" strokeWidth="2" className="network-cable" style={{ animationDuration: `${2 * latencyMultiplier}s` }} />
                  
                  {/* Pipeline from Orchestrator down to Central Panel */}
                  <path d="M 400 65 L 400 110" fill="none" stroke="url(#gradient-orange)" strokeWidth="2" className="network-cable-fast" style={{ animationDuration: `${1.5 * latencyMultiplier}s` }} />

                  {/* Pipeline from Orchestrator down to Right Panel */}
                  <path d="M 400 65 L 620 65 L 620 110" fill="none" stroke="url(#gradient-orange)" strokeWidth="2" className="network-cable" style={{ animationDuration: `${2.2 * latencyMultiplier}s` }} />

                  {/* High Intensity Parallel Streams through VPNs (Left into Middle into Right) */}
                  <path d="M 230 180 L 330 180" fill="none" stroke="rgba(249, 115, 22, 0.45)" strokeWidth="2.5" className="network-cable-fast" />
                  <path d="M 235 240 L 330 240" fill="none" stroke="rgba(249, 115, 22, 0.45)" strokeWidth="2.5" className="network-cable" style={{ animationDelay: '0.4s' }} />
                  <path d="M 235 300 L 330 300" fill="none" stroke="rgba(249, 115, 22, 0.45)" strokeWidth="2.5" className="network-cable" style={{ animationDelay: '0.8s' }} />
                  <path d="M 235 360 L 330 360" fill="none" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="1.5" className="network-cable" />

                  {/* Output streams from Middle VPN Tunnels into Cloud Backend layers */}
                  <path d="M 470 180 L 580 180" fill="none" stroke="#f97316" strokeWidth="2" className="network-cable-fast" />
                  <path d="M 470 240 L 580 240" fill="none" stroke="#ea580c" strokeWidth="2" className="network-cable" style={{ animationDelay: '0.5s' }} />
                  <path d="M 470 300 L 580 300" fill="none" stroke="#f97316" strokeWidth="2" className="network-cable" style={{ animationDelay: '0.9s' }} />
                  <path d="M 470 360 L 580 360" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="network-cable" />

                  {/* Feedback line back up */}
                  <path d="M 720 375 L 720 440 L 400 440 L 400 110" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" className="network-cable" />
                </>
              )}
            </svg>
          </div>

          {/* MAIN GRAPHICS WRAPPER LAYOUT */}
          <div className="relative z-10 space-y-10">

            {/* TOP COMPONENT: SOVEREIGN SYSTEM ORCHESTRATOR */}
            <div className="flex justify-center select-none">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(249,115,22,0.3)" }}
                onClick={() => handleElementClick('orchestrator')}
                className={`px-8 py-3 bg-[#0d1c31] border-2 ${
                  selectedElement === 'orchestrator' ? 'border-orange-500 shadow-[0_0_15px_#f97316]' : 'border-orange-500/40'
                } rounded-xl text-center cursor-pointer transition-all duration-300 max-w-sm`}
              >
                <div className="flex items-center gap-3 justify-center">
                  <Workflow className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="text-xs font-black tracking-[0.22em] text-white uppercase font-sans">
                    Sovereign System Orchestrator
                  </span>
                </div>
              </motion.div>
            </div>

            {/* THE THREE MAJORS COLUMNS (Client, Bastion, Cloud) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">

              {/* COLUMN 1: CLIENT DEVICES */}
              <div className="bg-[#050f1a]/80 border border-slate-800/80 rounded-[1.8rem] p-5 flex flex-col justify-between shadow-lg relative glow-hover transition-all">
                {/* Header label */}
                <div className="w-full bg-[#0d1b2d] border-b border-slate-800/80 rounded-t-[1.4rem] py-3 text-center mb-6">
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase font-sans">
                    Client Devices
                  </h4>
                </div>

                {/* Vertical list of raw hardware indicators */}
                <div 
                  onClick={() => handleElementClick('client-env')}
                  className={`space-y-4 p-4 rounded-2xl border ${
                    selectedElement === 'client-env' ? 'bg-[#0e213b]/60 border-orange-500' : 'bg-transparent border-slate-900'
                  } cursor-pointer hover:bg-slate-900/45 transition-colors`}
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <Monitor className="w-6 h-6 shrink-0 text-orange-500/80" />
                    <span className="text-[9px] font-mono leading-none">DESKTOP_NODE</span>
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  
                  <div className="flex items-center justify-between text-slate-400">
                    <Laptop className="w-6 h-6 shrink-0 text-orange-500/80" />
                    <span className="text-[9px] font-mono leading-none">MOBILE_LAPTOP_X</span>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <Smartphone className="w-6 h-6 shrink-0 text-orange-500/80" />
                    <span className="text-[9px] font-mono leading-none">SECURE_SURFACE</span>
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                </div>

                {/* The central mini-server on the bottom of Column A labeled (Controllers) */}
                <div className="mt-8 flex justify-center">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementClick('controllers');
                    }}
                    className={`w-full bg-[#0b1726] border ${
                      selectedElement === 'controllers' ? 'border-orange-500 text-orange-400 shadow-[0_0_12px_#f97316]' : 'border-slate-800 text-slate-350'
                    } rounded-xl p-3 cursor-pointer hover:bg-slate-900 transition-all flex flex-col items-center gap-1.5`}
                  >
                    <Server className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Controllers</span>
                    <div className="w-12 h-1 bg-orange-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* COLUMN 2: BASTION GATEWAY */}
              <div className="bg-[#050f1a]/80 border border-slate-800/80 rounded-[1.8rem] p-5 flex flex-col justify-between shadow-lg relative glow-hover transition-all">
                {/* Header label */}
                <div className="w-full bg-[#0d1b2d] border-b border-slate-800/80 rounded-t-[1.4rem] py-3 text-center mb-6">
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase font-sans">
                    Bastion Gateway
                  </h4>
                </div>

                {/* 5 Layer slots precisely matching screenshot */}
                <div className="space-y-3">
                  {[
                    { id: 'vpn-1', label: 'VPN, Secure Access', icon: Lock },
                    { id: 'vpn-2', label: 'VPN, Secure Access', icon: Lock },
                    { id: 'vpn-3', label: 'VPN Secure', icon: Shield },
                    { id: 'vpn-4', label: 'VPN Accert', icon: ShieldCheck },
                    { id: 'api-gateway', label: 'API Gateway Stream', icon: ArrowRightLeft }
                  ].map((tunnel) => (
                    <motion.div
                      key={tunnel.id}
                      onClick={() => handleElementClick(tunnel.id)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-[9.5px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                        selectedElement === tunnel.id 
                          ? 'bg-[#0e2133] border-orange-500 text-orange-400' 
                          : 'bg-[#101b2a]/55 border-slate-800 text-slate-300 hover:bg-[#152336]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <tunnel.icon className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{tunnel.label}</span>
                      </div>
                      <span className="text-[7.5px] bg-orange-500/15 border border-orange-500/30 text-orange-400 px-1.5 py-0.5 rounded-full font-black">
                        {tunnel.id === 'vpn-4' ? 'ACCERT' : 'ACTIVE'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* COLUMN 3: CLOUD SERVICES */}
              <div className="bg-[#050f1a]/80 border border-slate-800/80 rounded-[1.8rem] p-5 flex flex-col justify-between shadow-lg relative glow-hover transition-all">
                {/* Header label */}
                <div className="w-full bg-[#0d1b2d] border-b border-slate-800/80 rounded-t-[1.4rem] py-3 text-center mb-6">
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase font-sans">
                    Cloud Services
                  </h4>
                </div>

                {/* 4 Interactive node items connected visually with gears, db, compute, webapp */}
                <div className="space-y-4">
                  {[
                    { id: 'api-layer', label: 'API Layer Integration', desc: 'Secure APIs Outward', icon: Cloud },
                    { id: 'db-layer', label: 'Secured Database Vault', desc: 'Immutable Ledger logs', icon: Database },
                    { id: 'compute', label: 'High Density Compute', desc: 'Sovereign AI Enclaves', icon: Cpu },
                    { id: 'webapp', label: 'Web Management Portal', desc: 'Vanguard Operator UI', icon: Layout }
                  ].map((colNode) => (
                    <div
                      key={colNode.id}
                      onClick={() => handleElementClick(colNode.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer hover:bg-slate-900/60 transition-all ${
                        selectedElement === colNode.id 
                          ? 'bg-[#0e2133] border-orange-500 text-orange-400 shadow-md' 
                          : 'bg-[#101b2a]/55 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
                          <colNode.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[9.5px] font-black uppercase truncate leading-tight">{colNode.label}</div>
                          <div className="text-[7.5px] text-slate-400 truncate mt-0.5">{colNode.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right Inspector Drawer / System Parameter & Event Logs panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed module inspector Card */}
          <div className="bg-[#0b172a] border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
            </div>

            <h4 className="text-xs font-black uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              Sovereign Module Inspector
            </h4>

            <AnimatePresence mode="wait">
              {selectedElement ? (
                <motion.div
                  key={selectedElement}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-[11px] sm:text-xs"
                >
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-orange-500/20 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.14em] text-orange-500 font-mono">
                      Component Identifier
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white italic truncate uppercase">
                      {componentsData[selectedElement]?.name || selectedElement}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-black">
                    <div className="p-2 bg-slate-900/85 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-[8px] uppercase tracking-wider mb-1">Status</div>
                      <span className="text-orange-400">
                        {componentsData[selectedElement]?.status}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-900/85 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-[8px] uppercase tracking-wider mb-1">Live Rate</div>
                      <span className="text-slate-300">
                        {componentsData[selectedElement]?.rate}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-900/85 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-[8px] uppercase tracking-wider mb-1">CPU Load</div>
                      <span className="text-slate-300">
                        {componentsData[selectedElement]?.load}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-850 text-slate-300 space-y-1">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Description (FR)</div>
                      <p className="leading-relaxed leading-medium">{componentsData[selectedElement]?.detailsFR}</p>
                    </div>

                    <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-850 text-slate-350 space-y-1">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Description (EN)</div>
                      <p className="leading-relaxed leading-medium italic">{componentsData[selectedElement]?.detailsEN}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onNotify(t(`🛡️ Commande envoyée: Audit de diagnostic immédiat sur ${componentsData[selectedElement]?.name}`, `🛡️ Command sent: Immediate diagnostic audit on ${componentsData[selectedElement]?.name}`));
                    }}
                    className="w-full py-2 bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 border-none leading-none select-none text-center"
                  >
                    {t("FORCER DIAGNOSTIC RESEAU", "FORCE NETWORK DIAGNOSTIC")}
                  </button>
                </motion.div>
              ) : (
                <div className="py-12 text-center text-slate-500 px-4 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-slate-700 animate-bounce" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest">
                    {t("En attente de sélection", "Awaiting Selection")}
                  </p>
                  <p className="text-[9px] leading-relaxed text-slate-600">
                    {t("Cliquez sur l'un des ports VPN, des terminaux ou des enclaves du schéma technique pour évaluer l'état de sécurité cryptographique.", "Click on one of the VPN ports, terminals or enclaves of the technical diagram to evaluate the cryptographic security status.")}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Infrastructure Live telemetry console logs */}
          <div className="bg-[#0b172a] border border-slate-800/80 rounded-3xl p-6 shadow-xl text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse shrink-0" />
                Live Enclave Stream Telemetry
              </span>
              <span className="text-[8.5px] bg-[#1a2d42] px-2 py-0.5 rounded-[0.4rem] font-mono text-slate-400 font-bold border border-slate-800 leading-none">
                {isTrafficActive ? 'TELEMETRY LIVE' : 'STREAM STALE'}
              </span>
            </h4>

            <div className="bg-slate-950/85 border border-slate-900 rounded-2xl p-4 h-[190px] overflow-y-auto font-mono text-[9px] text-green-400 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-orange-500 select-none">&gt;</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
