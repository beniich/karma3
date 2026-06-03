import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  AlertTriangle, 
  Activity, 
  MapPin, 
  Plus, 
  RefreshCw, 
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  Server,
  Eye,
  ShieldCheck,
  FileText,
  Settings,
  User,
  MoreVertical,
  Check,
  Download,
  Terminal,
  ChevronRight,
  Filter,
  Trash2,
  Lock,
  Globe
} from 'lucide-react';

// Simple cn helper for classes
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface DeviceItem {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'warning' | 'offline';
  ip: string;
  latency: number;
  location: string;
  cpu: number;
}

const INITIAL_DEVICES: DeviceItem[] = [
  { id: '101', name: 'US-West Core Edge Gate', type: 'Gateway', status: 'online', ip: '192.168.1.10', latency: 4, location: 'San Francisco, USA', cpu: 32 },
  { id: '204', name: 'UK-London Cluster-M20', type: 'Server', status: 'warning', ip: '192.168.1.25', latency: 45, location: 'London, UK', cpu: 78 },
  { id: '303', name: 'DE-Berlin Ledger Node', type: 'Ledger Node', status: 'online', ip: '10.0.4.15', latency: 12, location: 'Berlin, Germany', cpu: 18 },
  { id: '412', name: 'APAC-Tokyo CDN Guard', type: 'CDN Proxy', status: 'online', ip: '172.16.8.99', latency: 22, location: 'Tokyo, Japan', cpu: 41 },
  { id: '525', name: 'BR-SaoPaulo Relay-04', type: 'Relay', status: 'warning', ip: '192.168.11.4', latency: 68, location: 'São Paulo, Brazil', cpu: 64 },
  { id: '601', name: 'IN-Mumbai Database-5', type: 'Database Vault', status: 'offline', ip: '10.8.0.42', latency: 0, location: 'Mumbai, India', cpu: 0 },
];

export const NexusMainDashboard = ({ onNotify, theme }: { onNotify: (msg: string) => void; theme?: 'dark' | 'light' | 'high-contrast' }) => {
  const [currentSubTab, setCurrentSubTab] = useState<'summary' | 'dashboard' | 'devices' | 'alerts' | 'reports' | 'settings'>('summary');
  const isLight = theme === 'light';

  // Sovereign Settings à la pfSense
  const [config, setConfig] = useState({
    bastion: { enabled: true, port: 443 },
    monitoring: { interval: 'realtime', alertThreshold: 90 },
    security: { mfa_required: true, mtls_enforced: true, token_rotation: true, slow_pings: false }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Synchronise system state with backend
  useEffect(() => {
    fetch('/api/system/config')
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(data => {
        if (data) setConfig(data);
      })
      .catch(err => console.error("Could not load setting config from sovereign api", err));
  }, []);

  const handleUpdate = (section: 'bastion' | 'monitoring' | 'security', field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const applyChanges = async () => {
    setIsApplying(true);
    try {
      const response = await fetch('/api/system/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        setHasChanges(false);
        onNotify("Configuration du système appliquée avec succès et services synchronisés !");
      } else {
        onNotify("Erreur lors de l'application de la configuration.");
      }
    } catch (err) {
      console.error(err);
      onNotify("Erreur réseau ou hôte système injoignable.");
    } finally {
      setIsApplying(false);
    }
  };

  // Real-time fluctuating state stats matching image count precisely as base
  const [totalDevices, setTotalDevices] = useState(1245678);
  const [cpuVal, setCpuVal] = useState(45);
  const [ramVal, setRamVal] = useState(52);
  const [logs, setLogs] = useState<string[]>([
    '⚡ Initialisation de la surveillance globale Nexus réussie.',
    '✓ Flux de paquets MTLS synchronisé avec le nœud central.',
  ]);

  // Devices states
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'warning' | 'offline'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Gateway');
  const [newIp, setNewIp] = useState('192.168.1.');
  const [newLocation, setNewLocation] = useState('London, UK');

  // Report Generator State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fluctuations of telemetries to look fully real
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change device counts by very tiny margin (+/- 1 or 2)
      setTotalDevices((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
      
      // CPU fluctuates by (+/- 1-3)
      setCpuVal((prev) => {
        const d = Math.floor(Math.random() * 5) - 2;
        return Math.max(40, Math.min(50, prev + d));
      });

      // RAM fluctuates by (+/- 1)
      setRamVal((prev) => {
        const d = Math.floor(Math.random() * 3) - 1;
        return Math.max(50, Math.min(55, prev + d));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Map Pins targeting exact responsive areas on the image visual
  const mapPins = [
    { id: '1', name: 'US-West Seattle Node', x: '16%', y: '45%', color: 'orange', status: 'Optimal', latency: '4ms' },
    { id: '2', name: 'US-East New York Cluster', x: '26%', y: '48%', color: 'orange', status: 'Optimal', latency: '12ms' },
    { id: '3', name: 'UK-London Core-Gateway', x: '46%', y: '42%', color: 'red', status: 'Critical Audit Triggered', latency: '45ms' },
    { id: '4', name: 'DE-Berlin secure Ledger Node', x: '51%', y: '40%', color: 'red', status: 'Warning SLA Bridge', latency: '18ms' },
    { id: '5', name: 'BR-Sao-Paulo Backup-Vault', x: '32%', y: '72%', color: 'orange', status: 'Warning Delay', latency: '68ms' },
    { id: '6', name: 'IN-Mumbai Secure Cache Group', x: '68%', y: '56%', color: 'orange', status: 'Optimal', latency: '22ms' },
    { id: '7', name: 'SG-Southeast Asia Node', x: '75%', y: '64%', color: 'red', status: 'Unregistered firmware', latency: '82ms' },
    { id: '8', name: 'AU-Sydney Fiber Router', x: '86%', y: '78%', color: 'orange', status: 'Optimal', latency: '18ms' }
  ];

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newDev: DeviceItem = {
      id: Math.floor(Math.random() * 800 + 100).toString(),
      name: newName,
      type: newType,
      status: 'online',
      ip: newIp,
      latency: Math.floor(Math.random() * 25) + 3,
      location: newLocation,
      cpu: Math.floor(Math.random() * 35) + 12
    };
    setDevices([newDev, ...devices]);
    setShowAddModal(false);
    onNotify(`✓ Équipement raccordé : ${newDev.name}`);
    setLogs((prev) => [`[SECURE] Nouveau nœud raccordé avec succès: ${newDev.name} (${newDev.ip})`, ...prev]);
    setNewName('');
  };

  const handleStartDiagnostics = () => {
    onNotify("⚡ Diagnostic complet du sous-réseau en cours...");
    setLogs((prev) => [
      `[DIAG] Diagnostic de sécurité lancé : Vérification de mTLS sur 1,245,678 serveurs.`,
      `[DIAG] Flux chiffrés : OK | Algorithme AES-256 actif.`,
      `[DIAG] Analyse complète menée avec 0 erreur critique détectée.`,
      ...prev
    ]);
  };

  const triggerReportGeneration = () => {
    if (isGeneratingReport) return;
    setIsGeneratingReport(true);
    setGenerationProgress(5);
    onNotify("📑 Génération du rapport exécutif d'échéances...");
    
    const interval = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGeneratingReport(false);
          onNotify("✓ Rapport compilé et prêt à l'exportation PDF/CSV.");
          setLogs((prev) => [`[COMPLIANCE] Rapport exécutif de sécurité compilé, intégrité vérifiée par hachage SHA-256.`, ...prev]);
          return 100;
        }
        return p + 20;
      });
    }, 450);
  };

  // Inline SVG Gauge rendering precisely like the image half-donut arch
  const renderHalfDonutGauge = (percent: number, rating: string, activeColor: string, hoverText: string) => {
    const radius = 35;
    const circumference = Math.PI * radius; // approx 110
    const dashOffset = circumference * (1 - percent / 100);

    return (
      <div className="flex flex-col items-center justify-center relative mt-3 group">
        <svg className="w-36 h-20" viewBox="0 0 100 55">
          {/* Base Background gauge track */}
          <path
            d="M 12,50 A 35,35 0 0,1 88,50"
            fill="none"
            stroke={isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={7.5}
            strokeLinecap="round"
          />
          {/* Overlay Active Colored track */}
          <path
            d="M 12,50 A 35,35 0 0,1 88,50"
            fill="none"
            stroke={activeColor || "#10b981"}
            strokeWidth={7.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px ${activeColor || '#10b981'}80)`
            }}
          />
        </svg>
        {/* Absolute labels centered underneath */}
        <div className="absolute top-[40%] flex flex-col items-center justify-center">
          <span className={cn("text-xl font-extrabold tracking-widest leading-none select-all", isLight ? "text-zinc-950 font-black" : "text-white")}>
            {percent}%
          </span>
          <span className="text-[9px] font-extrabold mt-0.5 tracking-wider uppercase" style={{ color: activeColor }}>
            {rating}
          </span>
        </div>
      </div>
    );
  };

  // Filter device rows
  const filteredDevices = devices.filter((d) => {
    const queryMatches = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.ip.includes(searchQuery) || d.location.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'all') return queryMatches;
    return queryMatches && d.status === statusFilter;
  });

  return (
    <div 
      className={cn(
        "w-full min-h-screen font-sans border rounded-[2rem] shadow-2xl relative overflow-hidden select-none p-4 md:p-6 text-left selection:bg-orange-500 selection:text-white transition-all duration-300",
        isLight 
          ? "bg-[#f4f6fc] border-blue-200 text-zinc-900" 
          : "bg-[#060813] border-white/[0.03] text-slate-300"
      )}
    >
      {/* Sovereign pfSense "Pending Changes" Banner */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative z-50 border border-orange-400/20"
          >
            <div className="flex items-center gap-2 text-left">
              <AlertTriangle className="w-5 h-5 animate-pulse shrink-0 text-white" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider">Vous avez des modifications système en attente</p>
                <p className="text-[10px] font-medium opacity-90">Cliquez sur "Appliquer" pour orchestrer les services sur l'hôte Linux.</p>
              </div>
            </div>
            <button 
              onClick={applyChanges}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-white hover:text-orange-400 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer shadow-lg shrink-0"
            >
              Appliquer les changements
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Applying Configuration loader */}
      {isApplying && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[10000]">
          <div className="text-center p-6 max-w-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="font-mono text-xs uppercase tracking-widest text-orange-550 font-bold">
              Orchestration de la Sovereign Appliance...
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-2 leading-relaxed">
              Recréation des fichiers de configuration, injection de clés TLS et redémarrage de l'enclave locale.
            </p>
          </div>
        </div>
      )}
      {/* Dynamic Background glowing ambient elements like in the screenshot art */}
      <div className={cn(
        "absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-500",
        isLight
          ? "bg-[radial-gradient(circle,rgba(59,130,246,0.08),transparent_70%)]"
          : "bg-[radial-gradient(circle,rgba(30,58,138,0.18),transparent_70%)]"
      )} />
      <div className={cn(
        "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-500",
        isLight
          ? "bg-[radial-gradient(circle,rgba(249,115,22,0.03),transparent_70%)]"
          : "bg-[radial-gradient(circle,rgba(255,85,0,0.04),transparent_70%)]"
      )} />

      {/* GLOBAL HEADER BAR - Mirrors EXACTLY top bar of image */}
      <div className={cn(
        "flex flex-col lg:flex-row justify-between items-start lg:items-center border-b pb-5 mb-6 gap-4",
        isLight ? "border-slate-250" : "border-white/[0.05]"
      )}>
        
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          {/* Complex intersecting spiral icon logo */}
          <div className={cn(
            "w-10 h-10 p-1 flex items-center justify-center rounded-xl border shadow-md select-none",
            isLight 
              ? "bg-blue-50 border-blue-100 shadow-[0_4px_12px_rgba(59,130,246,0.08)]" 
              : "bg-gradient-to-br from-[#10b981]/20 to-[#1e40af]/20 border-white/10 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
          )}>
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <defs>
                <linearGradient id="spiral1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path d="M50,15 A12,25 45 0,1 65,35 A12,25 45 0,1 50,55 A12,25 45 0,1 35,35 Z" fill="url(#spiral1)" opacity="0.85" />
              <path d="M50,45 A12,25 -45 0,1 75,55 A12,25 -45 0,1 50,85 A12,25 -45 0,1 25,55 Z" fill="url(#spiral1)" opacity="0.6" />
              <circle cx="50" cy="50" r="6" fill={isLight ? "#1e3a8a" : "#ffffff"} />
            </svg>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-1">
                <span className={cn("text-xl font-extrabold tracking-wider leading-none", isLight ? "text-zinc-950" : "text-white")}>Global</span>
                <span className={cn(
                  "text-xl font-black tracking-wider leading-none",
                  isLight ? "text-blue-700 drop-shadow-[0_0_8px_rgba(37,99,235,0.15)]" : "text-[#50b1fd] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                )}>Nexus</span>
              </div>
            </div>
            
            <div className={cn("h-6 w-[1.5px] hidden md:block", isLight ? "bg-slate-300" : "bg-white/20")} />
            
            <div className="text-left hidden md:block">
              <span className={cn("text-xs font-semibold font-sans tracking-wide", isLight ? "text-slate-650" : "text-slate-400")}>
                Sovereign Device Nexus - Executive Summary
              </span>
            </div>
          </div>
        </div>

        {/* TOP RIGHT NAVIGATION - Matches exact labels of screenshot */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 w-full lg:w-auto mt-2 lg:mt-0">
          <div className={cn(
            "flex items-center p-1 border rounded-xl",
            isLight ? "bg-white/80 border-blue-200" : "bg-[#0d1226]/80 border-white/[0.04]"
          )}>
            {[
              { id: 'summary', label: 'Summary' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'devices', label: 'Devices' },
              { id: 'alerts', label: 'Alerts' },
              { id: 'reports', label: 'Reports' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => {
              const isActive = currentSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentSubTab(tab.id as any);
                    onNotify(`Rubrique Nexus : ${tab.label}`);
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative",
                    isActive 
                      ? isLight 
                        ? "text-blue-800 bg-blue-100/50 shadow-xs font-extrabold border-b-[2px] border-blue-700" 
                        : "text-[#4fc3f7] bg-white/[0.06] shadow-sm font-extrabold border-b-[2px] border-[#4fc3f7]" 
                      : isLight 
                        ? "text-slate-600 hover:text-zinc-950" 
                        : "text-slate-400 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Admin Metadata drop-trigger */}
          <button 
            onClick={() => onNotify("👑 Grade d'habilitation : Tier 01 Active")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ml-auto lg:ml-0",
              isLight 
                ? "bg-white hover:bg-slate-50 border-blue-200 text-zinc-800 shadow-sm" 
                : "bg-[#0e172e] hover:bg-[#152347] border border-white/5 text-slate-300"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center border",
              isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/20 border-blue-400/30"
            )}>
              <User className={cn("w-3 h-3", isLight ? "text-blue-700" : "text-[#4fc3f7]")} />
            </div>
            <span>Admin</span>
          </button>
        </div>

      </div>

      {/* CORE VIEWPORT METRICS SCREEN */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          
          {/* ==================== 0. SUMMARY PRIMARY SCREEN (SYMMETRICAL GRID OF RISK & COMPLIANCE) ==================== */}
          {currentSubTab === 'summary' && (
            <div className="space-y-6 animate-none">
              <div className="flex flex-col gap-1 text-left">
                <h2 className={cn("text-2xl font-black italic tracking-tighter uppercase", isLight ? "text-slate-900" : "text-white")}>
                  Executive Compliance & Risk Grid
                </h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className={cn("text-[9px] font-black uppercase tracking-widest", isLight ? "text-slate-600" : "text-cyan-400")}>
                    Sovereign Appliance Status • Secure Enclave Active Mode
                  </p>
                </div>
              </div>

              {/* Symmetrical 2x2 Grid of risk and compliance metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                
                {/* CARD 1: GLOBAL COMPLIANCE INDEX */}
                <div 
                  className={cn(
                    "border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] transition-all duration-300 shadow-xl",
                    isLight 
                      ? "bg-white border-blue-200 text-zinc-900" 
                      : "bg-gradient-to-b from-[#0e1730]/90 to-[#070b16]/95 border-[#38bdf8]/20 text-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Audit Global OK
                      </span>
                      <h3 className={cn("text-lg font-black italic uppercase mt-1.5", isLight ? "text-slate-950" : "text-white")}>
                        Compliance Index
                      </h3>
                    </div>
                    <div className="p-2 border border-emerald-500/25 bg-emerald-500/10 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 my-4 items-center">
                    {/* Circle dial */}
                    <div className="col-span-4 flex justify-center">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="34" className={isLight ? "stroke-slate-100" : "stroke-[#18253a]"} strokeWidth="5" fill="none" />
                          <circle cx="40" cy="40" r="34" stroke="#10b981" strokeWidth="5" fill="none" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - 0.942)} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn("text-sm font-black italic", isLight ? "text-slate-900" : "text-white")}>94.2%</span>
                          <span className="text-[7px] font-black text-slate-500 uppercase">SCORE</span>
                        </div>
                      </div>
                    </div>

                    {/* Checklists */}
                    <div className="col-span-8 space-y-2 text-xs font-mono text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">SOC 2 Trust Principles:</span>
                        <span className="text-emerald-500 font-bold uppercase text-[10px]">100% Conforme</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">ISO 27001 Annex A:</span>
                        <span className="text-emerald-500 font-bold uppercase text-[10px]">91.2% Validé</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">RGPD Privacy Directives:</span>
                        <span className="text-emerald-500 font-bold uppercase text-[10px]">Conforme IP</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">mTLS Enforced Links:</span>
                        <span className={cn("font-bold uppercase text-[10px]", config.security.mtls_enforced ? "text-emerald-500" : "text-amber-500")}>
                          {config.security.mtls_enforced ? "100% Activé" : "Bypass Partiel"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={cn("border-t pt-3 text-left", isLight ? "border-slate-150" : "border-white/5")}>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      L'indice de conformité agrège l'état cryptographique de l'appliance, la validité des politiques mTLS et la détection d'intrusions locales.
                    </p>
                  </div>
                </div>

                {/* CARD 2: RISK EXPOSURE BAROMETER */}
                <div 
                  className={cn(
                    "border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] transition-all duration-300 shadow-xl",
                    isLight 
                      ? "bg-white border-blue-200 text-zinc-900" 
                      : "bg-gradient-to-b from-[#0e1730]/90 to-[#070b16]/95 border-[#38bdf8]/20 text-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded border border-[#ff7a00]/20">
                        Niveau Résiduel : Faible
                      </span>
                      <h3 className={cn("text-lg font-black italic uppercase mt-1.5", isLight ? "text-slate-950" : "text-white")}>
                        Risk Exposure
                      </h3>
                    </div>
                    <div className="p-2 border border-orange-500/25 bg-orange-500/10 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-orange-550" />
                    </div>
                  </div>

                  <div className="my-4 text-left">
                    <div className="flex justify-between items-center mb-1 text-xs font-mono">
                      <span className="text-slate-500">Facteur Global d'Exposition :</span>
                      <span className="text-orange-550 font-black">1.25 / 5.00 (Low)</span>
                    </div>
                    {/* Horizontal Bar */}
                    <div className={cn("h-2.5 rounded-full w-full overflow-hidden flex", isLight ? "bg-slate-100" : "bg-[#18253a]")}>
                      <div className="bg-emerald-500 h-full" style={{ width: '40%' }} />
                      <div className="bg-amber-500 h-full" style={{ width: '15%' }} />
                      <div className="bg-red-500 h-full" style={{ width: '5%' }} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 text-[9px] font-mono whitespace-nowrap">
                      <div className={cn("p-2 border rounded-xl", isLight ? "bg-slate-50 border-slate-200" : "bg-[#04060d] border-white/5")}>
                        <span className="text-slate-500 block">Vecteurs Internes</span>
                        <strong className="text-emerald-500 font-extrabold uppercase">0 MALS Sains</strong>
                      </div>
                      <div className={cn("p-2 border rounded-xl", isLight ? "bg-slate-50 border-slate-200" : "bg-[#04060d] border-white/5")}>
                        <span className="text-slate-500 block">Ports Étrangers</span>
                        <strong className="text-emerald-500 font-extrabold uppercase animate-pulse">1 Actif (3000)</strong>
                      </div>
                      <div className={cn("p-2 border rounded-xl", isLight ? "bg-slate-50 border-slate-200" : "bg-[#04060d] border-white/5")}>
                        <span className="text-slate-500 block">Incursions OS</span>
                        <strong className="text-emerald-500 font-extrabold uppercase">Bloqué (FW)</strong>
                      </div>
                    </div>
                  </div>

                  <div className={cn("border-t pt-3 text-left", isLight ? "border-slate-150" : "border-white/5")}>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Aucun débordement de buffer mémoire ou attaque brute-force n'a été détecté dans les enclaves réseau du système Linux d'accueil.
                    </p>
                  </div>
                </div>

                {/* CARD 3: CRYPTOGRAPHIC ENCLAVES & HSM STATUS */}
                <div 
                  className={cn(
                    "border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] transition-all duration-300 shadow-xl",
                    isLight 
                      ? "bg-white border-blue-200 text-zinc-900" 
                      : "bg-gradient-to-b from-[#0e1730]/90 to-[#070b16]/95 border-[#38bdf8]/20 text-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded border border-[#0ea5e9]/20">
                        Kernel-Verified Module
                      </span>
                      <h3 className={cn("text-lg font-black italic uppercase mt-1.5", isLight ? "text-slate-950" : "text-white")}>
                        Sovereign HSM Enclaves
                      </h3>
                    </div>
                    <div className="p-2 border border-sky-500/25 bg-sky-500/10 rounded-xl">
                      <Lock className="w-5 h-5 text-sky-550" />
                    </div>
                  </div>

                  <div className="my-4 space-y-3 text-xs font-mono text-left">
                    <div className="flex items-center justify-between p-2 border border-sky-500/10 bg-sky-500/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-sky-400" />
                        <div>
                          <p className={cn("text-[10px] font-black", isLight ? "text-slate-800" : "text-white")}>HSM Partition Sentinel-01</p>
                          <p className="text-[8px] text-slate-500">Merkle Root: verified_da8f921</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[8px] rounded uppercase animate-pulse">ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={cn("p-2.5 border rounded-xl", isLight ? "bg-slate-50 border-slate-200" : "bg-[#04060d] border-white/5")}>
                        <span className="text-slate-500 text-[8px] uppercase block mb-1">Rotation de clés</span>
                        <span className={cn("text-[9px] font-black uppercase", config.security.token_rotation ? "text-emerald-500" : "text-amber-500")}>
                          {config.security.token_rotation ? "Automatique (12h)" : "Statique / Manuel"}
                        </span>
                      </div>
                      <div className={cn("p-2.5 border rounded-xl", isLight ? "bg-slate-50 border-slate-200" : "bg-[#04060d] border-white/5")}>
                        <span className="text-slate-500 text-[8px] uppercase block mb-1">Passerelle Bastion</span>
                        <span className="text-[#0ea5e9] text-[9px] font-black uppercase">
                          {config.bastion.enabled ? `Port ${config.bastion.port} (Actif)` : "Désactivé"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={cn("border-t pt-3 text-left", isLight ? "border-slate-150" : "border-white/5")}>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Les clés d'audit privée restent signées à chaud par co-génération locale HSM, et ne quittent jamais la barrière de protection.
                    </p>
                  </div>
                </div>

                {/* CARD 4: AUDITING ACTIVITY & LIVE TELEMETRY ENGINE */}
                <div 
                  className={cn(
                    "border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] transition-all duration-300 shadow-xl",
                    isLight 
                      ? "bg-white border-blue-200 text-zinc-900" 
                      : "bg-gradient-to-b from-[#0e1730]/90 to-[#070b16]/95 border-[#38bdf8]/20 text-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        SLA Telemetry Node
                      </span>
                      <h3 className={cn("text-lg font-black italic uppercase mt-1.5", isLight ? "text-slate-950" : "text-white")}>
                        Telemetry Engine Sync
                      </h3>
                    </div>
                    <div className="p-2 border border-purple-500/25 bg-purple-500/10 rounded-xl">
                      <Activity className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>

                  <div className="my-4 space-y-2.5 text-xs font-mono text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Taux d'échantillonnage de ping:</span>
                      <span className="text-purple-400 font-black uppercase text-[10px]">{config.monitoring.interval}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Seuil d'alerte configuré:</span>
                      <span className="text-purple-400 font-black uppercase text-[10px]">{config.monitoring.alertThreshold}% d'intensité</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">MFA de l'Audit:</span>
                      <span className="text-purple-400 font-black uppercase text-[10px]">{config.security.mfa_required ? "Activé (Strict)" : "Inactif"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Lenteur Écho ping:</span>
                      <span className="text-purple-400 font-black uppercase text-[10px]">{config.security.slow_pings ? "Oui (+1.5s)" : "Normal (Réduit)"}</span>
                    </div>
                  </div>

                  <div className={cn("border-t pt-3 text-left", isLight ? "border-slate-150" : "border-white/5")}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Moteur de télémétrie actif sur port local.</span>
                      <button 
                        onClick={() => {
                          onNotify("Télémétrie ré-évaluée manuellement.");
                        }}
                        className="p-1 text-[9px] font-black uppercase tracking-wider text-[#0e50e9] hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Recalibrer
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 1. DASHBOARD PRIMARY SCREEN (MATCHES IMAGE SPEC) ==================== */}
          {currentSubTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* TOP GRID PANELS - Online Counter, CPU health, RAM health */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1.1 TOTAL DEVICES ON LINE CARD (GLOWING HALO BEZEL) - Large Left Panel */}
                <div 
                  className={cn(
                    "lg:col-span-6 border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[185px] transition-all duration-300",
                    isLight 
                      ? "border-blue-200 shadow-[0_0_25px_rgba(59,130,246,0.1)]" 
                      : "bg-gradient-to-b from-[#0e1730]/90 to-[#070b16]/95 border-[#38bdf8]/20 hover:border-[#38bdf8]/40 shadow-[0_0_35px_rgba(14,165,233,0.12)]"
                  )}
                  style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                >
                  {/* Outer aura light source */}
                  <div className="absolute top-0 right-0 w-[40px] h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                  
                  <div className="space-y-1">
                    <span className={cn(
                      "text-[10px] uppercase font-black tracking-[0.2em] block font-mono",
                      isLight ? "text-blue-900" : "text-cyan-400"
                    )}>
                      TOTAL DEVICES ONLINE
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className={cn(
                      "text-4xl md:text-5xl font-black hover:scale-[1.01] tracking-tight leading-none transition-transform select-all",
                      isLight ? "text-zinc-950 font-black" : "text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                    )}>
                      {totalDevices.toLocaleString()}
                    </h3>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold select-none",
                    isLight ? "text-emerald-800" : "text-emerald-450"
                  )}>
                    <span className={cn("p-0.5 rounded-full", isLight ? "bg-emerald-200" : "bg-[#10b981]/15")}>
                      <svg className="w-3 h-3 fill-emerald-600" viewBox="0 0 24 24">
                        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                      </svg>
                    </span>
                    <span>+1.2% since yesterday</span>
                  </div>
                </div>

                {/* 1.2 GLOBAL CPU HEALTH (Donut Gauge) - Middle Card */}
                <div 
                  className={cn(
                    "lg:col-span-3 border rounded-2xl p-4 flex flex-col justify-between items-center shadow-md relative transition-all duration-300",
                    isLight 
                      ? "border-blue-200" 
                      : "bg-[#0d1527]/70 border-white/[0.06] hover:border-white/[0.12]"
                  )}
                  style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                >
                  <div className="w-full flex justify-between items-center select-none">
                    <span className={cn(
                      "text-[10px] font-black tracking-widest uppercase font-mono",
                      isLight ? "text-zinc-850" : "text-slate-400"
                    )}>
                      GLOBAL CPU HEALTH
                    </span>
                    <button 
                      onClick={() => onNotify("Info: Charge processeur sous-jacente saine.")} 
                      className={cn(isLight ? "text-slate-700 hover:text-zinc-950" : "text-slate-500 hover:text-white")}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {renderHalfDonutGauge(cpuVal, "Optimal", "#10b981", "Charge CPU globale")}

                  <div className={cn(
                    "w-full mt-2 pt-2 border-t space-y-1 text-center font-sans",
                    isLight ? "border-blue-300" : "border-white/[0.04]"
                  )}>
                    <div className={cn("flex items-center justify-center gap-1.5 text-[9px] font-medium", isLight ? "text-zinc-800" : "text-slate-400")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>Charge par cœur: {cpuVal}% stable</span>
                    </div>
                    <div className={cn("flex items-center justify-center gap-1.5 text-[9px] font-medium", isLight ? "text-zinc-800" : "text-slate-400")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>Nœuds de calcul : {ratingLabelForValue(cpuVal)}</span>
                    </div>
                  </div>
                </div>

                {/* 1.3 GLOBAL RAM HEALTH (Donut Gauge) - Right Card */}
                <div 
                  className={cn(
                    "lg:col-span-3 border rounded-2xl p-4 flex flex-col justify-between items-center shadow-md relative transition-all duration-300",
                    isLight 
                      ? "border-blue-200" 
                      : "bg-[#0d1527]/70 border-white/[0.06] hover:border-white/[0.12]"
                  )}
                  style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                >
                  <div className="w-full flex justify-between items-center select-none">
                    <span className={cn(
                      "text-[10px] font-black tracking-widest uppercase font-mono",
                      isLight ? "text-zinc-850" : "text-slate-400"
                    )}>
                      GLOBAL RAM HEALTH
                    </span>
                    <button 
                      onClick={() => onNotify("Info: Consommation mémoire RAM allouée.")} 
                      className={cn(isLight ? "text-slate-700 hover:text-zinc-950" : "text-slate-500 hover:text-white")}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {renderHalfDonutGauge(ramVal, "Optimal", "#10b981", "Allocation mémoire")}

                  <div className={cn(
                    "w-full mt-2 pt-2 border-t space-y-1 text-center font-sans",
                    isLight ? "border-blue-300" : "border-white/[0.04]"
                  )}>
                    <div className={cn("flex items-center justify-center gap-1.5 text-[9px] font-medium", isLight ? "text-zinc-800" : "text-slate-400")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>Physique allouée: {ramVal}% active</span>
                    </div>
                    <div className={cn("flex items-center justify-center gap-1.5 text-[9px] font-medium", isLight ? "text-zinc-800" : "text-slate-400")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>Mémoire cache restante: OK</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTIVE ALERTS MAP CONTAINER - LARGE CENTRAL BLOCK */}
              <div 
                className={cn(
                  "border rounded-2xl p-5 shadow-xl transition-all duration-300",
                  isLight ? "border-blue-200 text-zinc-950" : "bg-[#0b1021]/80 border-white/[0.05] text-slate-300"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                <div className="flex justify-between items-center mb-4 text-left select-none">
                  <h4 className={cn("text-xs font-black uppercase tracking-[0.16em] flex items-center gap-2", isLight ? "text-zinc-950" : "text-white")}>
                    <Globe className="w-4 h-4 text-orange-500" /> ACTIVE ALERTS MAP
                  </h4>
                  <span className={cn(
                    "px-2.5 py-1 rounded text-[9.5px] font-bold border",
                    isLight 
                      ? "bg-red-500/10 text-red-800 border-red-500/20" 
                      : "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/25"
                  )}>
                    3 MENACES CRITIQUES DÉTECTÉES
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  
                  {/* Left Column Map Plot (SVG World Projection Grid) - Spans 8 cols */}
                  <div 
                    className={cn(
                      "xl:col-span-8 border rounded-xl p-3 relative flex items-center justify-center min-h-[350px] overflow-hidden",
                      isLight ? "border-blue-200 shadow-inner" : "bg-[#04060d] border-white/[0.04]"
                    )}
                    style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                  >
                    
                    {/* Legend Scale / Controls inside map strictly aligned to screenshot */}
                    <div className={cn(
                      "absolute top-3 left-3 flex flex-col border rounded-lg overflow-hidden shadow-md z-20",
                      isLight ? "bg-white border-blue-200" : "bg-[#0b1021] border-white/5"
                    )}>
                      <button 
                        onClick={() => onNotify("World Zoom Multiplier: 1.5x")}
                        className={cn(
                          "w-7 h-7 flex items-center justify-center transition-all font-bold text-xs border-b cursor-pointer",
                          isLight 
                            ? "hover:bg-slate-100 text-blue-700 border-blue-200" 
                            : "hover:bg-white/5 text-[#4fc3f7] hover:text-white border-white/5"
                        )}
                      >
                        +
                      </button>
                      <button 
                        onClick={() => onNotify("World Zoom Multiplier: 1.0x (Optimal)")}
                        className={cn(
                          "w-7 h-7 flex items-center justify-center transition-all font-bold text-xs cursor-pointer",
                          isLight 
                            ? "hover:bg-slate-100 text-slate-750" 
                            : "hover:bg-white/5 text-slate-400 hover:text-white"
                        )}
                      >
                        -
                      </button>
                    </div>

                    {/* Vector projection path representation maps */}
                    <svg className="absolute inset-x-2 inset-y-4 w-full h-full opacity-35" viewBox="0 0 540 280">
                      {/* Dotted Coordinates Grid Mesh */}
                      <g className={isLight ? "stroke-slate-200/70" : "stroke-white/[0.04]"} strokeDasharray="2,2" strokeWidth="0.5">
                        <line x1="80" y1="0" x2="80" y2="280" />
                        <line x1="160" y1="0" x2="160" y2="280" />
                        <line x1="240" y1="0" x2="240" y2="280" />
                        <line x1="320" y1="0" x2="320" y2="280" />
                        <line x1="400" y1="0" x2="400" y2="280" />
                        <line x1="480" y1="0" x2="480" y2="280" />
                        <line x1="0" y1="60" x2="540" y2="60" />
                        <line x1="0" y1="120" x2="540" y2="120" />
                        <line x1="0" y1="180" x2="540" y2="180" />
                        <line x1="0" y1="240" x2="540" y2="240" />
                      </g>
                    </svg>

                    {/* Custom styled vector continents representation with warm blue overlay fill */}
                    <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 540 280">
                      <g 
                        fill={isLight ? "#f1f5f9" : "#17223b"} 
                        stroke={isLight ? "#94a3b8" : "#253557"} 
                        strokeWidth="0.5" 
                        opacity={isLight ? "0.95" : "0.65"}
                      >
                        {/* Greenland */}
                        <path d="M 200,30 L 220,15 L 245,20 L 235,50 L 210,55 Z" />
                        {/* North America */}
                        <path d="M 30,55 L 70,35 L 140,40 L 190,55 L 180,95 L 170,120 L 145,115 L 110,135 L 75,100 L 45,98 Z" />
                        {/* South America */}
                        <path d="M 110,135 L 155,145 L 175,190 L 150,250 L 132,250 L 120,185 Z" />
                        {/* Africa */}
                        <path d="M 240,140 L 290,130 L 320,150 L 315,220 L 290,240 L 280,180 L 250,165 Z" />
                        {/* Eurasia */}
                        <path d="M 235,90 L 270,55 L 390,45 L 490,50 L 510,75 L 435,110 L 415,145 L 360,160 L 305,120 L 255,100 Z" />
                        {/* Australia */}
                        <path d="M 450,210 L 495,205 L 500,235 L 465,240 Z" />
                      </g>
                    </svg>

                    {/* Interactive pulsating pins corresponding exactly to coordinates */}
                    <div className="absolute inset-0 w-full h-full">
                      {mapPins.map((pin) => {
                        const isRed = pin.color === 'red';
                        const accent = isRed ? '#ef4444' : '#f97316';
                        return (
                          <button
                            key={pin.id}
                            onClick={() => {
                              onNotify(`📍 Signal reçu : ${pin.name} | Latence : ${pin.latency}`);
                              setLogs((prev) => [`[PING] Nœud '${pin.name}' contacté à distance. Latence opérationnelle : ${pin.latency}.`, ...prev]);
                            }}
                            style={{ left: pin.x, top: pin.y }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group outline-none cursor-pointer focus:scale-125 transition-all"
                          >
                            <span className="relative flex h-6 w-6 items-center justify-center">
                              {/* Pulse effect */}
                              <span 
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                                style={{ backgroundColor: accent }}
                              />
                              <span 
                                className="relative inline-flex rounded-full h-3 w-3 shadow-xl"
                                style={{ 
                                  backgroundColor: accent,
                                  boxShadow: `0 0 14px ${accent}` 
                                }}
                              />
                            </span>

                            {/* Hover floating coordinate data tags */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 transition-all origin-bottom bg-[#080d1a] border border-white/10 p-2 rounded-lg text-[9px] font-bold text-white whitespace-nowrap shadow-2xl z-40">
                              <div style={{ color: accent }} className="font-extrabold">{pin.name}</div>
                              <div className="text-[8px] text-slate-400 font-mono mt-0.5 uppercase">LAT : {pin.latency} | STATUS : {pin.status}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Map footer helper */}
                    <div className={cn(
                      "absolute bottom-3 left-3 right-3 border rounded-lg p-2 text-center text-[10px] font-medium shadow-sm transition-all duration-300",
                      isLight ? "bg-slate-50 border-blue-200 text-slate-700" : "bg-[#0d1226]/90 border-white/5 text-slate-400"
                    )}>
                      ⚡ Carte interactive globale. Cliquez sur un nœud d'infrastructure pour lancer l'écho de diagnostic.
                    </div>

                  </div>

                  {/* Right Column "Top Alerts (Last 24h)" - Spans 4 cols */}
                  <div 
                    className={cn(
                      "xl:col-span-4 border rounded-xl p-4 flex flex-col justify-between text-left",
                      isLight ? "border-blue-200" : "bg-[#0a0f21] border-white/[0.04]"
                    )}
                    style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                  >
                    <div>
                      <h5 className={cn(
                        "text-[11px] font-black uppercase tracking-wider pb-2.5 border-b mb-3",
                        isLight ? "text-zinc-700 border-zinc-200" : "text-slate-400 border-white/[0.05]"
                      )}>
                        Top Alerts (Last 24h)
                      </h5>

                      {/* Hardcoded alerts stack precisely like screenshot */}
                      <div className="space-y-3">
                        
                        {/* Alert 1 */}
                        <div className={cn(
                          "p-3 border rounded-xl flex items-start gap-2.5 transition-all text-left",
                          isLight 
                            ? "bg-slate-50/70 border-slate-200 hover:bg-slate-100" 
                            : "bg-[#04060d] border-white/5 hover:bg-white/[0.04]"
                        )}>
                          <span className="relative flex h-2 w-2 mt-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <div className="space-y-1">
                            <p className={cn("text-xs font-bold leading-tight", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>
                              Critical Security Breach - Server Node NY-01
                            </p>
                            <div className="flex flex-wrap gap-2 items-center text-[9.5px]">
                              <span className="px-1.5 py-0.5 bg-red-500/10 text-red-650 rounded font-bold uppercase border border-red-500/20">
                                High
                              </span>
                              <span className={isLight ? "text-slate-650" : "text-slate-500"}>12m ago</span>
                            </div>
                          </div>
                        </div>

                        {/* Alert 2 */}
                        <div className={cn(
                          "p-3 border rounded-xl flex items-start gap-2.5 transition-all text-left",
                          isLight 
                            ? "bg-slate-50/70 border-slate-200 hover:bg-slate-100" 
                            : "bg-[#04060d] border-white/5 hover:bg-white/[0.04]"
                        )}>
                          <span className="relative flex h-2 w-2 mt-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                          <div className="space-y-1">
                            <p className={cn("text-xs font-bold leading-tight", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>
                              High Latency - APAC Region
                            </p>
                            <div className="flex flex-wrap gap-2 items-center text-[9.5px]">
                              <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-650 rounded font-bold uppercase border border-orange-500/20">
                                Medium
                              </span>
                              <span className={isLight ? "text-slate-650" : "text-slate-500"}>45m ago</span>
                            </div>
                          </div>
                        </div>

                        {/* Alert 3 */}
                        <div className={cn(
                          "p-3 border rounded-xl flex items-start gap-2.5 transition-all text-left",
                          isLight 
                            ? "bg-slate-50/70 border-slate-200 hover:bg-slate-100" 
                            : "bg-[#04060d] border-white/5 hover:bg-white/[0.04]"
                        )}>
                          <span className="relative flex h-2 w-2 mt-1.5 shrink-0">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                          </span>
                          <div className="space-y-1">
                            <p className={cn("text-xs font-bold leading-tight", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>
                              Firmware Outdated - Fleet 304
                            </p>
                            <div className="flex flex-wrap gap-2 items-center text-[9.5px]">
                              <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-650 rounded font-bold uppercase border border-yellow-500/25">
                                Low
                              </span>
                              <span className={isLight ? "text-slate-650" : "text-slate-500"}>2h ago</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <button 
                      onClick={() => setCurrentSubTab('alerts')}
                      className={cn(
                        "w-full mt-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                        isLight 
                          ? "bg-slate-100 hover:bg-slate-200 text-zinc-800 border-zinc-205" 
                          : "bg-white/[0.03] hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/10"
                      )}
                    >
                      Inspecter toutes les menaces
                    </button>
                  </div>

                </div>
              </div>

              {/* QUICK ACTIONS ROW SECTION */}
              <div className="space-y-3">
                <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] block text-left", isLight ? "text-zinc-700" : "text-slate-400")}>
                  QUICK ACTIONS
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  
                  {/* Action 1 */}
                  <button 
                    onClick={() => {
                      onNotify("🚀 Déploiement des mises à jour planifié!");
                      setLogs((p) => ["[MIS-A-JOURS] Déploiement groupé planifié au format binaire sécurisé.", ...p]);
                    }}
                    className={cn(
                      "p-4 border rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group",
                      isLight 
                        ? "bg-white hover:bg-sky-50/50 border-blue-200 text-zinc-900 shadow-xs" 
                        : "bg-[#0a1021] hover:bg-[#131d3d] border-white/[0.04] hover:border-blue-500/30 text-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all border",
                      isLight 
                        ? "bg-blue-100 text-blue-700 border-blue-200" 
                        : "bg-blue-500/10 group-hover:bg-[#38bdf8]/15 text-[#38bdf8] border-blue-500/15"
                    )}>
                      <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
                    </div>
                    <div className="min-w-0">
                      <span className={cn("text-xs font-extrabold block uppercase tracking-wide", isLight ? "text-zinc-950 font-black" : "text-white")}>Deploy Updates</span>
                      <span className={cn("text-[10px] block truncate mt-0.5 font-sans font-medium", isLight ? "text-zinc-650" : "text-slate-400")}>Deploy updates and updates updates</span>
                    </div>
                  </button>

                  {/* Action 2 */}
                  <button 
                    onClick={triggerReportGeneration}
                    className={cn(
                      "p-4 border rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group",
                      isLight 
                        ? "bg-white hover:bg-sky-50/50 border-blue-200 text-zinc-900 shadow-xs" 
                        : "bg-[#0a1021] hover:bg-[#131d3d] border-white/[0.04] hover:border-blue-500/30 text-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all border",
                      isLight 
                        ? "bg-emerald-100 text-emerald-700 border-emerald-250" 
                        : "bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/15"
                    )}>
                      <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <span className={cn("text-xs font-extrabold block uppercase tracking-wide", isLight ? "text-zinc-950 font-black" : "text-white")}>View Security Reports</span>
                      <span className={cn("text-[10px] block truncate mt-0.5 font-sans font-medium", isLight ? "text-zinc-650" : "text-slate-400")}>View simenalons to security security reports</span>
                    </div>
                  </button>

                  {/* Action 3 */}
                  <button 
                    onClick={() => setCurrentSubTab('settings')}
                    className={cn(
                      "p-4 border rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group",
                      isLight 
                        ? "bg-white hover:bg-sky-50/50 border-blue-200 text-zinc-900 shadow-xs" 
                        : "bg-[#0a1021] hover:bg-[#131d3d] border-white/[0.04] hover:border-blue-500/30 text-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all border",
                      isLight 
                        ? "bg-cyan-100 text-cyan-700 border-cyan-200" 
                        : "bg-cyan-500/10 group-hover:bg-cyan-500/20 text-[#0ea5e9] border-cyan-500/15"
                    )}>
                      <FileText className="w-5 h-5 group-hover:translate-y-[-1px] transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <span className={cn("text-xs font-extrabold block uppercase tracking-wide", isLight ? "text-zinc-950 font-black" : "text-white")}>Manage Policies</span>
                      <span className={cn("text-[10px] block truncate mt-0.5 font-sans font-medium", isLight ? "text-zinc-650" : "text-slate-400")}>Manage policies tits & manage policies</span>
                    </div>
                  </button>

                  {/* Action 4 */}
                  <button 
                    onClick={handleStartDiagnostics}
                    className={cn(
                      "p-4 border rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group",
                      isLight 
                        ? "bg-white hover:bg-sky-50/50 border-blue-200 text-zinc-900 shadow-xs" 
                        : "bg-[#0a1021] hover:bg-[#131d3d] border-white/[0.04] hover:border-blue-500/30 text-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all border",
                      isLight 
                        ? "bg-amber-100 text-amber-700 border-amber-200" 
                        : "bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 border-amber-500/15"
                    )}>
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className={cn("text-xs font-extrabold block uppercase tracking-wide", isLight ? "text-zinc-950 font-black" : "text-white")}>System Diagnostics</span>
                      <span className={cn("text-[10px] block truncate mt-0.5 font-sans font-medium", isLight ? "text-zinc-650" : "text-slate-400")}>Analyse new wiiarieers and system diagnostics</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* LIVE CONSOLE TRACE LOG - Highly useful, matches visual night feel */}
              <div 
                className={cn(
                  "border rounded-xl p-4 text-left font-mono transition-all duration-300",
                  isLight ? "border-blue-200" : "bg-[#04060d] border-white/[0.05]"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                <div className={cn(
                  "flex justify-between items-center pb-2 border-b mb-2 font-mono text-[10px] uppercase",
                  isLight ? "border-zinc-200 text-zinc-500" : "border-white/[0.05] text-slate-500"
                )}>
                  <span>Journal de Securité Local Nexus TRACE</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-550 animate-pulse" />
                    <span>Synchronisé</span>
                  </div>
                </div>
                <div className={cn("h-28 overflow-y-auto no-scrollbar font-mono text-[11px] space-y-2 leading-relaxed", isLight ? "text-zinc-800" : "text-cyan-400/90")}>
                  {logs.map((log, lIdx) => (
                    <div key={lIdx} className="flex gap-2 font-mono">
                      <span className={cn("select-none font-bold", isLight ? "text-zinc-400" : "text-slate-600")}>[{lIdx}]</span>
                      <span className="break-all font-mono">{log}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== 2. DEVICES DATA VIEWPORT ==================== */}
          {currentSubTab === 'devices' && (
            <div className="space-y-6 animate-none">
              <div 
                className={cn(
                  "border rounded-2xl p-5 shadow-xl transition-all",
                  isLight ? "border-blue-200" : "bg-[#0b1021]/80 border-white/[0.05]"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                
                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  {/* Left Controls */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial min-w-[200px]">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Rechercher par nom, IP, pays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          "w-full px-9 py-2 rounded-xl text-xs outline-none transition-colors",
                          isLight 
                            ? "bg-white border border-blue-200 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white" 
                            : "bg-[#04060d] border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        )}
                      />
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1.5 p-1 rounded-xl border",
                      isLight ? "bg-white border-blue-200" : "bg-[#04060d] border-white/5"
                    )}>
                      {(['all', 'online', 'warning', 'offline'] as const).map((fil) => (
                        <button
                          key={fil}
                          onClick={() => setStatusFilter(fil)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                            statusFilter === fil 
                              ? isLight 
                                ? "bg-blue-600 text-white font-extrabold" 
                                : "bg-white/10 text-[#4fc3f7] font-extrabold" 
                              : isLight 
                                ? "text-slate-600 hover:text-zinc-900" 
                                : "text-slate-400 hover:text-white"
                          )}
                        >
                          {fil}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Button */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 border-none cursor-pointer self-stretch md:self-auto justify-center"
                  >
                    <Plus className="w-4 h-4" /> Raccorder Matériel
                  </button>
                </div>

                {/* Table Data list of devices */}
                <div className={cn(
                  "overflow-x-auto rounded-xl border",
                  isLight ? "border-blue-200" : "border-white/[0.04]"
                )}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={cn(
                        "font-mono text-[8.5px] uppercase font-bold border-b",
                        isLight ? "bg-slate-100 text-slate-700 border-blue-250" : "bg-white/[0.01] text-slate-400 border-white/[0.04]"
                      )}>
                        <th className="p-3">ID #</th>
                        <th className="p-3">Équipement / Type</th>
                        <th className="p-3">Adresse IP Securisé</th>
                        <th className="p-3">Région Physique</th>
                        <th className="p-3">Charge CPU</th>
                        <th className="p-3">Echo Ping</th>
                        <th className="p-3 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-transparent">
                      {filteredDevices.map((item) => {
                        return (
                          <tr 
                            key={item.id} 
                            className={cn(
                              "transition-colors border-b",
                              isLight 
                                ? "hover:bg-slate-100/50 bg-white border-blue-100 text-zinc-900" 
                                : "hover:bg-white/[0.02] border-white/[0.03] text-slate-300"
                            )}
                          >
                            <td className={cn("p-3 font-mono text-[10px]", isLight ? "text-slate-600" : "text-slate-500")}>
                              {item.id}
                            </td>
                            <td className="p-3 flex items-center gap-2.5 font-bold text-left">
                              <div className={cn(
                                "p-2 rounded-lg shrink-0",
                                item.status === 'online' ? "bg-emerald-500/10 text-emerald-500" : item.status === 'warning' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                              )}>
                                <Server className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className={cn("font-semibold", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>{item.name}</span>
                                <span className={cn("text-[10px] tracking-wide", isLight ? "text-slate-500" : "text-slate-500 font-sans")}>{item.type}</span>
                              </div>
                            </td>
                            <td className={cn("p-3 font-mono text-[11px]", isLight ? "text-slate-800 font-semibold" : "text-slate-350")}>
                              {item.ip}
                            </td>
                            <td className={cn("p-3", isLight ? "text-slate-800 font-medium" : "text-slate-400")}>
                              {item.location}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2 min-w-[80px]">
                                <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", isLight ? "bg-slate-200" : "bg-white/5")}>
                                  <div 
                                    className={cn("h-full rounded-full", item.status === 'online' ? "bg-emerald-500" : "bg-amber-500")}
                                    style={{ width: `${item.cpu || 0}%` }}
                                  />
                                </div>
                                <span className={cn("font-mono text-[10px] font-bold", isLight ? "text-zinc-850" : "text-white")}>{item.cpu}%</span>
                              </div>
                            </td>
                            <td className={cn("p-3 font-mono", isLight ? "text-slate-800" : "text-slate-300")}>
                              {item.latency > 0 ? `${item.latency}ms` : '—'}
                            </td>
                            <td className="p-3 text-right">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                                item.status === 'online' ? "bg-emerald-500/15 text-emerald-600" : item.status === 'warning' ? "bg-amber-500/15 text-amber-600" : "bg-red-500/15 text-red-600"
                              )}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredDevices.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500 italic">
                            Aucun équipement ne correspond à votre filtre de tri.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 3. ALERTS DETAILED AUDIT STREAM ==================== */}
          {currentSubTab === 'alerts' && (
            <div className="space-y-6">
              <div 
                className={cn(
                  "border rounded-2xl p-5 shadow-xl text-left transition-all",
                  isLight ? "border-blue-200" : "bg-[#0b1021]/80 border-white/[0.05]"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={cn("text-xs font-black uppercase tracking-wider", isLight ? "text-blue-900" : "text-slate-400")}>
                    Historique complet des incidents & alertes de sécurité
                  </span>
                  <button 
                    onClick={() => {
                      onNotify("✓ Purge sécurisée simulée.");
                      setLogs(p => ["Purge du registre d'accréditations locales réussie.", ...p]);
                    }}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Réinitialiser
                  </button>
                </div>

                <div className="space-y-3.5">
                  {[
                    { node: "Server-Node NY-01", desc: "Viol des contraintes de signature mTLS obligatoire sur le endpoint.", time: "Il y a 12 min", severity: "HIGH", location: "New York, USA", action: "Blocus IP automatique" },
                    { node: "APAC Region Router", desc: "Surcharges de réponse et latences supérieures à 500ms sur la passerelle.", time: "Il y a 45 min", severity: "MEDIUM", location: "Tokyo, Japan", action: "Déviation de trafic planifiée" },
                    { node: "Storage Vault DE-304", desc: "Firmware asynchrone obsolète détient des certificats SHA-1 non valides.", time: "Il y a 2 heures", severity: "LOW", location: "Berlin, Germany", action: "Mise à niveau forcée requise" },
                    { node: "Sao-Paulo Relay Node", desc: "Perte temporaire du signal d'accréditation ping battement de cœur.", time: "Il y a 4 heures", severity: "LOW", location: "São Paulo, Brazil", action: "Auto-rétablissement en cours" },
                  ].map((inc, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 border rounded-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors text-left",
                        inc.severity === 'HIGH' 
                          ? isLight ? "bg-red-50 border-red-300 text-red-950" : "bg-red-950/20 border-red-500/25 text-red-200" 
                          : inc.severity === 'MEDIUM' 
                            ? isLight ? "bg-amber-50 border-amber-300 text-amber-950" : "bg-amber-950/20 border-amber-500/20 text-amber-200" 
                            : isLight ? "bg-white border-blue-200 text-zinc-900" : "bg-white/[0.02] border-white/5 text-slate-300"
                      )}
                    >
                      {/* Left Block info */}
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            inc.severity === 'HIGH' ? "bg-red-500" : inc.severity === 'MEDIUM' ? "bg-amber-500" : "bg-yellow-400"
                          )} />
                          <strong className={cn("text-xs", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>{inc.node}</strong>
                          <span className={cn("text-[10px]", isLight ? "text-slate-650 font-bold" : "text-slate-500")}>• {inc.location}</span>
                        </div>
                        <p className={cn("text-[11.5px] leading-relaxed max-w-2xl font-sans", isLight ? "text-zinc-800 font-medium" : "text-slate-300")}>{inc.desc}</p>
                        <span className={cn("text-[10px]", isLight ? "text-slate-550 font-bold" : "text-slate-500")}>{inc.time}</span>
                      </div>

                      {/* Right Block action mitigation */}
                      <div className="flex flex-col items-start md:items-end justify-between self-stretch md:self-auto min-w-[150px] gap-2 md:gap-0">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                          inc.severity === 'HIGH' 
                            ? isLight ? "bg-red-200 text-red-800 border border-red-300" : "bg-red-500/20 text-red-400 border border-red-500/30" 
                            : inc.severity === 'MEDIUM' 
                              ? isLight ? "bg-amber-200 text-amber-800 border border-amber-300" : "bg-amber-500/20 text-amber-400 border border-amber-500/35" 
                              : isLight ? "bg-slate-100 text-slate-700 border border-slate-200" : "bg-white/5 text-slate-400 border border-white/10"
                        )}>
                          CRITICALITY: {inc.severity}
                        </span>

                        <span className={cn("text-[10px] font-mono italic", isLight ? "text-slate-800" : "text-slate-400")}>
                          Action : <strong className="text-[#38bdf8]">{inc.action}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* ==================== 4. REPORTS GENERATOR SUITE ==================== */}
          {currentSubTab === 'reports' && (
            <div className="space-y-6">
              <div 
                className={cn(
                  "border rounded-2xl p-5 shadow-xl text-left max-w-3xl mx-auto space-y-6 transition-all",
                  isLight ? "border-blue-200" : "bg-[#0b1021]/80 border-white/[0.05]"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                <div>
                  <h4 className={cn("text-sm font-black uppercase tracking-wider flex items-center gap-2", isLight ? "text-zinc-950" : "text-white")}>
                    <FileText className="w-5 h-5 text-[#38bdf8]" /> Générateur de Rapport SLA Réglementaires
                  </h4>
                  <p className={cn("text-xs mt-1 font-medium italic", isLight ? "text-slate-705 font-semibold" : "text-slate-400")}>
                    Générez de vrais rapports décrivant l'activité, les latences d'écho et les signatures de chiffrement de vos nœuds de calcul d'infrastructure.
                  </p>
                </div>

                {/* Progress Visualiser */}
                {isGeneratingReport && (
                  <div className={cn(
                    "p-4 rounded-xl border space-y-2 animate-pulse",
                    isLight ? "bg-white border-blue-200" : "bg-[#04060d] border-white/5"
                  )}>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className={isLight ? "text-blue-700 font-bold" : "text-cyan-400"}>Compilation du rapport global...</span>
                      <span className="font-mono">{generationProgress}%</span>
                    </div>
                    <div className={cn("w-full h-2 rounded-full overflow-hidden", isLight ? "bg-slate-200" : "bg-white/5")}>
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-350"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Option Block 1 */}
                  <div className={cn(
                    "p-4 border rounded-xl flex items-start gap-4 transition-all hover:scale-[1.01]",
                    isLight ? "bg-white border-blue-200 text-zinc-900 shadow-xs" : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.04]"
                  )}>
                    <div className="p-2.5 bg-blue-500/10 text-cyan-400 rounded-lg shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className={cn("text-xs font-bold block uppercase tracking-wide", isLight ? "text-zinc-950 font-black" : "text-white")}>Rapport Général d'Audits</span>
                      <p className={cn("text-[11px] leading-normal", isLight ? "text-slate-700 font-medium" : "text-slate-400")}>
                        Rapports réglementaires décrivant le statut d'habilitation et la mTLS active.
                      </p>
                    </div>
                  </div>

                  {/* Option Block 2 */}
                  <div className={cn(
                    "p-4 border rounded-xl flex items-start gap-4 transition-all hover:scale-[1.01]",
                    isLight ? "bg-white border-blue-200 text-zinc-900 shadow-xs" : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.04]"
                  )}>
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <span className={cn("text-xs font-bold block uppercase tracking-wide", isLight ? "text-zinc-950 font-black" : "text-white")}>Analyse Latence Réseau</span>
                      <p className={cn("text-[11px] leading-normal", isLight ? "text-slate-700 font-medium" : "text-slate-400")}>
                        Tracés chronologiques d'échos ping avec relevés de dépassements de garantie SLA.
                      </p>
                    </div>
                  </div>

                </div>

                <div className={cn("pt-4 border-t flex justify-end gap-3 font-sans", isLight ? "border-blue-250" : "border-white/[0.05]")}>
                  <button
                    type="button"
                    onClick={() => {
                      onNotify("Rapport brut imprimé dans la console.");
                      console.log("=== EXTRAIT RAPPORT GLOBAL NEXUS ===");
                      console.log("Total Devices: " + totalDevices);
                      console.log("CPU rating average: " + cpuVal + "%");
                    }}
                    className={cn(
                      "px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer",
                      isLight 
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-750 border-zinc-200" 
                        : "bg-white/[0.03] hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/10"
                    )}
                  >
                    Imprimer Logs
                  </button>

                  <button
                    type="button"
                    disabled={isGeneratingReport}
                    onClick={triggerReportGeneration}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#10b981] to-teal-650 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg border-none hover:scale-[1.02] active:scale-100 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 font-sans"
                  >
                    <Download className="w-4 h-4 font-sans" /> Compiler le PDF du Rapport
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 5. SETTINGS CONTROL PANEL ==================== */}
          {currentSubTab === 'settings' && (
            <div className="space-y-6">
              <div 
                className={cn(
                  "border rounded-2xl p-5 shadow-xl text-left max-w-2xl mx-auto space-y-6 transition-all",
                  isLight ? "border-blue-200" : "bg-[#0b1021]/80 border-white/[0.05]"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                <div>
                  <h4 className={cn("text-sm font-black uppercase tracking-wider flex items-center gap-2", isLight ? "text-zinc-950" : "text-white")}>
                    <Settings className="w-5 h-5 text-orange-500" /> Administrative Nexus Variable Settings
                  </h4>
                  <p className={cn("text-xs mt-1 font-medium italic", isLight ? "text-slate-705 font-semibold" : "text-slate-400")}>
                    Configurez dynamiquement les paramètres d'habilitation réseau et les rythmes de rafraîchissement des échos.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  
                  {/* Control 1 */}
                  <div className={cn(
                    "flex justify-between items-center p-3 rounded-xl border transition-all",
                    isLight ? "bg-white border-blue-200 text-zinc-900" : "bg-white/[0.02] border-white/[0.04]"
                  )}>
                    <div className="text-left">
                      <span className={cn("text-xs font-bold block", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>Forcer la Signature mTLS Obligatoire</span>
                      <span className={cn("text-[10.5px] block mt-0.5", isLight ? "text-slate-700 font-medium" : "text-slate-400")}>Assure l'encryptage absolu TLS de tous les transferts bidirectionnels de paquets.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.security.mtls_enforced} 
                        className="sr-only peer" 
                        onChange={(e) => handleUpdate('security', 'mtls_enforced', e.target.checked)}
                      />
                      <div className={cn(
                        "w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 transition-colors",
                        isLight ? "bg-slate-200" : "bg-white/10"
                      )}></div>
                    </label>
                  </div>

                  {/* Control 2 */}
                  <div className={cn(
                    "flex justify-between items-center p-3 rounded-xl border transition-all",
                    isLight ? "bg-white border-blue-200 text-zinc-900" : "bg-white/[0.02] border-white/[0.04]"
                  )}>
                    <div className="text-left">
                      <span className={cn("text-xs font-bold block", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>Auto-Rotation des Jetons d'API asynchrones</span>
                      <span className={cn("text-[10.5px] block mt-0.5", isLight ? "text-slate-700 font-medium" : "text-slate-400")}>Déclenche automatiquement de nouvelles clés cryptographiques toutes les 12 heures.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.security.token_rotation} 
                        className="sr-only peer" 
                        onChange={(e) => handleUpdate('security', 'token_rotation', e.target.checked)}
                      />
                      <div className={cn(
                        "w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 transition-colors",
                        isLight ? "bg-slate-200" : "bg-white/10"
                      )}></div>
                    </label>
                  </div>

                  {/* Control 3 */}
                  <div className={cn(
                    "flex justify-between items-center p-3 rounded-xl border transition-all",
                    isLight ? "bg-white border-blue-200 text-zinc-900" : "bg-white/[0.02] border-white/[0.04]"
                  )}>
                    <div className="text-left">
                      <span className={cn("text-xs font-bold block", isLight ? "text-zinc-950 font-extrabold" : "text-white")}>Rythmes d'Echo Ping Réduits</span>
                      <span className={cn("text-[10.5px] block mt-0.5", isLight ? "text-slate-700 font-medium" : "text-slate-400")}>Espacer la simulation de flux pour économiser l'occupation CPU de l'appareil.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.security.slow_pings} 
                        className="sr-only peer" 
                        onChange={(e) => handleUpdate('security', 'slow_pings', e.target.checked)}
                      />
                      <div className={cn(
                        "w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 transition-colors",
                        isLight ? "bg-slate-200" : "bg-white/10"
                      )}></div>
                    </label>
                  </div>

                </div>

                <div className={cn("pt-3 border-t text-right", isLight ? "border-blue-250" : "border-white/[0.05]")}>
                  <span className={cn("text-[9px] font-mono italic block", isLight ? "text-blue-900 font-bold" : "text-slate-500")}>
                    Modifications enregistrées instantanément et poussées à chaud sur le cluster global v14.1.
                  </span>
                </div>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* RACCORDER APPAREIL MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "border shadow-2xl p-6 rounded-2xl max-w-md w-full text-left space-y-4",
                isLight ? "bg-white border-blue-200" : "bg-[#0b1021] border-[#38bdf8]/30"
              )}
            >
              <h3 className={cn(
                "text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b pb-3",
                isLight ? "text-zinc-950 border-zinc-205" : "text-white border-white/[0.05]"
              )}>
                <Server className="w-5 h-5 text-emerald-500" /> RACCORDER ÉQUIPEMENT INTELLIGENT
              </h3>
              
              <form onSubmit={handleCreateDevice} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={cn("text-[10px] font-bold uppercase block tracking-widest font-mono", isLight ? "text-zinc-700" : "text-slate-400")}>Nom d'équipement</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: CDN-Proxy Core" 
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none transition-colors",
                      isLight 
                        ? "bg-slate-50 border border-slate-205 text-zinc-900 focus:border-blue-500 focus:bg-white" 
                        : "bg-[#04060d] border border-white/10 text-white focus:border-[#38bdf8]"
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={cn("text-[10px] font-bold uppercase block tracking-widest font-mono", isLight ? "text-zinc-700" : "text-slate-400")}>Type de matériel</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none transition-colors font-semibold",
                      isLight 
                        ? "bg-slate-50 border border-slate-205 text-zinc-900 focus:border-blue-500 focus:bg-white" 
                        : "bg-[#04060d] border border-white/10 text-white focus:border-[#38bdf8]"
                    )}
                  >
                    <option value="Gateway">Subnet Gateway</option>
                    <option value="Server">Edge Computing Server</option>
                    <option value="Ledger Node">Heuristic Ledger Node</option>
                    <option value="CDN Proxy">Sovereign CDN Proxy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={cn("text-[10px] font-bold uppercase block tracking-widest font-mono", isLight ? "text-zinc-700" : "text-slate-400")}>Adresse IP Réseau</label>
                  <input 
                    type="text" 
                    required
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="Ex: 192.168.1.55" 
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none transition-colors font-mono",
                      isLight 
                        ? "bg-slate-50 border border-slate-205 text-zinc-900 focus:border-blue-500 focus:bg-white" 
                        : "bg-[#04060d] border border-white/10 text-slate-200 focus:border-[#38bdf8]"
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={cn("text-[10px] font-bold uppercase block tracking-widest font-mono", isLight ? "text-zinc-700" : "text-slate-400")}>Emplacement Géographique</label>
                  <input 
                    type="text" 
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ex: Paris, France" 
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none transition-colors",
                      isLight 
                        ? "bg-slate-50 border border-slate-205 text-zinc-900 focus:border-blue-500 focus:bg-white" 
                        : "bg-[#04060d] border border-white/10 text-white focus:border-[#38bdf8]"
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={cn(
                      "flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center",
                      isLight 
                        ? "border-slate-200 hover:bg-slate-50 text-slate-650" 
                        : "border-white/10 hover:bg-white/5 text-slate-400"
                    )}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg border-none cursor-pointer text-center"
                  >
                    Raccorder à l'Écho
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Help helper triggers ratings
function ratingLabelForValue(v: number): string {
  if (v < 55) return "Charge Faible / Sain";
  if (v < 80) return "Modéré";
  return "Activité Intense";
}
