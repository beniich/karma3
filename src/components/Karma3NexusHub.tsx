import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  AlertTriangle, 
  Activity, 
  Thermometer, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  Sliders, 
  Play, 
  Settings, 
  Database, 
  Server, 
  Info, 
  ShieldAlert, 
  BarChart3, 
  Clock, 
  ArrowRight, 
  Shield, 
  Trash2,
  Wrench,
  Search,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Karma3NexusHubProps {
  onNotify: (message: string) => void;
  theme?: 'dark' | 'light' | 'high-contrast';
}

// Structuring correlated events for the Event Correlation Engine
interface CorrelatedEvent {
  id: string;
  time: string;
  source: 'Physical Infrastructure' | 'Anti-Abuse Suite' | 'Multi-Tenancy' | 'Integration Hub';
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  correlationFactor: number; // Percentage
  details: string;
}

const INITIAL_EVENTS: CorrelatedEvent[] = [
  {
    id: 'EVT-01',
    time: '23:02:11',
    source: 'Physical Infrastructure',
    title: 'Anomalie Thermique Transformateur TX-03',
    severity: 'High',
    correlationFactor: 94,
    details: 'Élévation subite constatée de 12°C en 90 secondes sur le noyau d\'enroulement.'
  },
  {
    id: 'EVT-02',
    time: '23:02:08',
    source: 'Anti-Abuse Suite',
    title: 'Attaque par Force Brute (Compte FR-SOV-01)',
    severity: 'High',
    correlationFactor: 89,
    details: 'Plus de 450 tentatives de connexions infructueuses détectées depuis l\'IP CDN suspecte.'
  },
  {
    id: 'EVT-03',
    time: '23:00:45',
    source: 'Multi-Tenancy',
    title: 'Pic de Charge sur Isolated Tenant Storage',
    severity: 'Medium',
    correlationFactor: 75,
    details: 'Le locataire Sovereign Energy accède en boucle aux ledgers de validation d\'audit.'
  },
  {
    id: 'EVT-04',
    time: '22:55:12',
    source: 'Integration Hub',
    title: 'Resynchronisation Requise Ledger Google Sheets',
    severity: 'Low',
    correlationFactor: 62,
    details: 'Légers désalignements temporels de réplication asynchrone sur le pont d\'intégration.'
  },
  {
    id: 'EVT-05',
    time: '22:50:00',
    source: 'Physical Infrastructure',
    title: 'Chute d\'Amortisseur Thermique de la Grille CL-1',
    severity: 'Medium',
    correlationFactor: 78,
    details: 'La charge du bloc d\'infrastructure secondaire a progressé de 15%.'
  },
  {
    id: 'EVT-06',
    time: '22:45:10',
    source: 'Anti-Abuse Suite',
    title: 'Bannissement d\'IP Temporaire suite à IP-Drift',
    severity: 'Low',
    correlationFactor: 42,
    details: 'L\'accès a été sécurisé et les clés API associées ont été temporairement restreintes.'
  }
];

// Historical data for sovereign charts matching light and dark guidelines
const HISTORICAL_THERMAL_CURVE = [
  { time: '17:00', temperature: 62.4, gridStability: 96, threatLevel: 12 },
  { time: '18:00', temperature: 65.1, gridStability: 94, threatLevel: 15 },
  { time: '19:00', temperature: 71.0, gridStability: 91, threatLevel: 18 },
  { time: '20:00', temperature: 78.5, gridStability: 85, threatLevel: 25 },
  { time: '21:00', temperature: 84.2, gridStability: 79, threatLevel: 45 },
  { time: '22:00', temperature: 87.4, gridStability: 72, threatLevel: 78 },
  { time: '23:00', temperature: 89.1, gridStability: 69, threatLevel: 84 },
];

export const Karma3NexusHub = ({ onNotify, theme = 'dark' }: Karma3NexusHubProps) => {
  const isLight = theme === 'light' || theme === 'high-contrast';

  // State controls for Sprint 7 Metrics and Slider
  const [thermalLevel, setThermalLevel] = useState<number>(87.4);
  const [dispatcherThreshold, setDispatcherThreshold] = useState<'Low Warning' | 'Moderate' | 'High Alert'>('High Alert');
  
  // Real-time calculated health state
  const [coolingPurgeActive, setCoolingPurgeActive] = useState<boolean>(false);
  const [ipShieldActive, setIpShieldActive] = useState<boolean>(false);
  const [isolatedLoadActive, setIsolatedLoadActive] = useState<boolean>(false);
  const [keysRotatedActive, setKeysRotatedActive] = useState<boolean>(false);

  // Search/Filter for Correlation events
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('All');

  // Terminal simulated logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[SYSTEM] Initialisation de la Suite Karma3 Sovereign Analytics...`,
    `[CORRELATION] Liaison établie avec le Module Multi-Tenancy (Locataires d'énergie)`,
    `[CORRELATION] Canal sécurisé couplé avec la Suite Anti-Abus (Sentinel Logs)`,
    `[SENSORS] Télémétrie physique connectée sur TX-03 (Transformateur Principal)`,
    `[STATUS] Moteur de corrélation d'événements opérationnel à latence sub-10ms.`
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isSimulatingStress, setIsSimulatingStress] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto Scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Handle thermal values triggers
  useEffect(() => {
    if (thermalLevel >= 92 && dispatcherThreshold !== 'High Alert') {
      setDispatcherThreshold('High Alert');
      onNotify('🚨 Température critique ! Passage automatique en Niveau d\'Alerte Maximale (High Alert).');
    } else if (thermalLevel >= 75 && thermalLevel < 92 && dispatcherThreshold === 'Low Warning') {
      setDispatcherThreshold('Moderate');
      onNotify('⚠️ Hausse de température. Seuil basculé au niveau Modéré.');
    }
  }, [thermalLevel, dispatcherThreshold, onNotify]);

  // Calculate dynamic core health metric
  const calculateSystemHealth = () => {
    let base = 96;
    // Temp penalty: decreases dramatically above 70
    if (thermalLevel > 70) {
      base -= (thermalLevel - 70) * 1.6;
    }
    // Dynamic adjustments from active counters
    if (coolingPurgeActive) base += 14;
    if (ipShieldActive) base += 8;
    if (keysRotatedActive) base += 5;
    if (isSimulatingStress) base -= 15;

    // Constrain score
    return Math.max(10, Math.min(100, Math.round(base)));
  };

  const currentHealth = calculateSystemHealth();

  // Color mappings for dynamic score
  const getHealthColorClass = (score: number) => {
    if (score >= 82) return isLight ? 'text-emerald-600' : 'text-emerald-400';
    if (score >= 60) return isLight ? 'text-amber-600' : 'text-amber-400';
    return isLight ? 'text-rose-600' : 'text-rose-400';
  };

  const getHealthBgClass = (score: number) => {
    if (score >= 82) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  // Run comprehensive stress test simulator
  const startStressSimulation = async () => {
    if (isSimulatingStress) return;
    setIsSimulatingStress(true);
    onNotify('🔌 Lancement de la simulation d\'incident et stress-test sur la Grille...');

    const runLogStep = (txt: string, delay: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, txt]);
          resolve();
        }, delay);
      });
    };

    await runLogStep('⚡ [SIMULATION] Déclenchement de la surcharge de courant à transition asymétrique...', 400);
    setThermalLevel(89.2);
    await runLogStep('🌡️ [TELEMETRY] Alerte : Température transformateur TX-03 grimpe à 89.2°C.', 500);
    await runLogStep('🛡️ [CORRELATOR] Croisement des signaux : Anomalie thermique corrélée avec l\'attaque brute-force active.', 600);
    await runLogStep('🤖 [DISPATCHER] Alerte de Niveau Intermédiaire émise vers le central de gouvernance.', 500);
    setThermalLevel(94.8);
    await runLogStep('🔥 [TELEMETRY] Température transformateur critique à 94.8°C ! Fusibles d\'enroulements sous tension.', 700);
    setDispatcherThreshold('High Alert');
    await runLogStep('🚨 [DISPATCHER] Seuil critique dépassé. Recommandation système : Purger et basculer sur le circuit auxiliaire.', 600);
    setIsSimulatingStress(false);
    onNotify('✅ Stress-test simulé. Analysez les écarts et déclenchez les contre-mesures opérationnelles !');
  };

  // Trigger individual interactive counter-measures
  const triggerCoolingPurge = () => {
    if (coolingPurgeActive) {
      setCoolingPurgeActive(false);
      setTerminalLogs(prev => [...prev, `❄️ [DISPATCHER] Désactivation de la purge d\'azote azimutale.`]);
      onNotify('Purge de refroidissement désactivée.');
    } else {
      setCoolingPurgeActive(true);
      setTerminalLogs(prev => [...prev, `❄️ [DISPATCHER] ENCLENCHEMENT DE LA PURGE AZOTÉE THERMIQUE SUR TX-03.`]);
      onNotify('❄️ Refroidissement actif. La température commence à refluer !');
      
      // Gradually decrease temperature
      const interval = setInterval(() => {
        setThermalLevel(prev => {
          if (prev <= 68) {
            clearInterval(interval);
            return 68;
          }
          return parseFloat((prev - 4.2).toFixed(1));
        });
      }, 500);
    }
  };

  const triggerIpShield = () => {
    setIpShieldActive(!ipShieldActive);
    const text = !ipShieldActive 
      ? `🔒 [DISPATCHER] Isolation IP : Plongeon CDN suspect dans le bac à sable hermétique (Quarantaine active).`
      : `🔒 [DISPATCHER] Levée temporaire de l\'isolation CDN. Surveillance passive réactivée.`;
    setTerminalLogs(prev => [...prev, text]);
    onNotify(!ipShieldActive ? '🔒 Placé en quarantaine IP via la suite anti-abus !' : '🔓 Levée de quarantaine IP.');
  };

  const triggerIsolatedLoad = () => {
    setIsolatedLoadActive(!isolatedLoadActive);
    const text = !isolatedLoadActive
      ? `⚡ [DISPATCHER] Délestage Réseau : Répartition de 35% de charge vers le transformateur de secours CL-2.`
      : `⚡ [DISPATCHER] Restauration du schéma de charge classique de la grille CL-1.`;
    setTerminalLogs(prev => [...prev, text]);
    onNotify(!isolatedLoadActive ? '⚡ Délestage réseau et répartition démarrés !' : 'Schéma de charge classique restauré.');
  };

  const triggerKeysRotation = () => {
    setKeysRotatedActive(true);
    setTerminalLogs(prev => [...prev, `🔐 [DISPATCHER] Rotation en direct des jetons cryptographiques de Multi-Tenancy.`]);
    onNotify('🔐 Certificats et clés locataires asymétriques renouvelés avec succès !');
    setTimeout(() => setKeysRotatedActive(false), 3000);
  };

  // Chat/CLI Terminal Commands Input
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalInput('');
    setTerminalLogs(prev => [...prev, `> ${cmd}`]);

    setTimeout(() => {
      let output = `Commande non reconnue. Saisissez 'help' ou 'aide' pour les options souveraines.`;
      const lowered = cmd.toLowerCase();

      if (lowered === 'help' || lowered === 'aide') {
        output = `Options de terminal : 'status' (état de la corrélation), 'cool' (lance purge d'azote), 'isolate' (quarantaine de l'IP CDN suspecte), 'clear' (efface l'écran).`;
      } else if (lowered === 'clear') {
        setTerminalLogs([]);
        return;
      } else if (lowered === 'cool') {
        triggerCoolingPurge();
        return;
      } else if (lowered === 'isolate') {
        triggerIpShield();
        return;
      } else if (lowered === 'status') {
        output = `STATUS ACCORD : Santé globale ${currentHealth}%, Thermique TX-03 à ${thermalLevel}°C, Alerte dispatch active : ${dispatcherThreshold}.`;
      } else if (lowered.includes('temp ') || lowered.includes('set ')) {
        const val = parseFloat(lowered.replace(/[^0-9.]/g, ''));
        if (!isNaN(val) && val >= 30 && val <= 150) {
          setThermalLevel(val);
          output = `Consigne thermique ajustée à ${val}°C.`;
        } else {
          output = `Température invalide (Saisir entre 30 et 150 °C).`;
        }
      }

      setTerminalLogs(prev => [...prev, `🤖 ${output}`]);
    }, 150);
  };

  // Filtering Events
  const filteredEvents = INITIAL_EVENTS.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'All' || evt.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div id="karma3-sovereign-layout" className={`space-y-6 text-left select-none rounded-[1.8rem] p-4 md:p-6 transition-all duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800 border border-slate-200 shadow-inner' : 'bg-[#021117] text-slate-100'
    }`}>
      
      {/* 1. MASTER HEADER */}
      <div id="karma3-header-card" className={`backdrop-blur-xl border rounded-[1.6rem] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242e]/85 border-teal-800/40 shadow-2xl'
      }`}>
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-teal-500/5' : 'bg-teal-500/10'
        }`} />

        <div className="flex items-center gap-4 relative z-10" id="karma3-title-container">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
            isLight 
              ? 'bg-teal-50 border-teal-200 text-teal-600 shadow-sm' 
              : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
          }`}>
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${
                isLight ? 'text-teal-700' : 'text-teal-400'
              }`}>
                Sprint 7 Sovereign Core
              </span>
              <span className={`px-2 py-0.5 border rounded-full text-[8px] font-mono uppercase font-black tracking-widest flex items-center gap-1 ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-green-500/10 border-green-500/20 text-green-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Hub Synchronisé
              </span>
            </div>
            <h1 className={`text-xl md:text-2xl font-black tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white font-sans'
            }`}>
              Karma3 Sovereign Analytics
            </h1>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto relative z-10" id="karma3-main-triggers">
          <button 
            id="btn-stress-test"
            onClick={startStressSimulation}
            disabled={isSimulatingStress}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-[9.5px] font-mono uppercase font-extrabold rounded-xl bg-orange-600 hover:bg-orange-500 transition-all text-white disabled:opacity-40 cursor-pointer shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatingStress ? 'animate-spin' : ''}`} />
            {isSimulatingStress ? 'Stress-test Actif' : 'Simuler Stress Grille'}
          </button>
          
          <button 
            id="btn-reset-metrics"
            onClick={() => {
              setThermalLevel(87.4);
              setDispatcherThreshold('High Alert');
              setCoolingPurgeActive(false);
              setIpShieldActive(false);
              setIsolatedLoadActive(false);
              onNotify('⚙️ Réinitialisation des paramètres physiques et réseau d\'origine.');
              setTerminalLogs(prev => [...prev, `[SYSTEM] Réalignement par défaut effectué.`]);
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-[9.5px] font-mono uppercase font-extrabold rounded-xl transition-all cursor-pointer border ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' 
                : 'bg-white/5 border-[#153442] hover:bg-white/10 text-slate-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Vider
          </button>
        </div>
      </div>

      {/* 2. CORE TACTICAL KPI METRICS GRID */}
      <div id="karma3-kpi-deck" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Dynamic Health Ratio Badge */}
        <div id="kpi-sovereign-ratio" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Sovereign Health Metric
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${getHealthColorClass(currentHealth)}`}>
                {currentHealth}%
              </span>
              <span className={`text-[8.5px] font-mono font-bold leading-none ${
                currentHealth >= 80 ? 'text-emerald-500' : currentHealth >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {currentHealth >= 82 ? 'EXCELLENT' : currentHealth >= 60 ? 'PASSABLE' : 'ALERTE GOUVERNANCE'}
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-tight font-medium">Croisement thermal &amp; cyber</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getHealthBgClass(currentHealth)}`}>
            <Activity className={`w-5 h-5 ${getHealthColorClass(currentHealth)}`} />
          </div>
        </div>

        {/* Level Thermique Transformateur */}
        <div id="kpi-thermal-level" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1 flex-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Thermique Transformateur
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${
                thermalLevel >= 90 ? 'text-rose-500' : thermalLevel >= 75 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {thermalLevel} °C
              </span>
              <span className="text-xs text-slate-400">/ 120°</span>
            </div>
            
            {/* Visual Quick Status */}
            <div className="w-full bg-slate-200 dark:bg-[#07171e] h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  thermalLevel >= 90 ? 'bg-rose-500 animate-pulse' : thermalLevel >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (thermalLevel / 120) * 100)}%` }}
              />
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            thermalLevel >= 90 
              ? 'bg-rose-500/10 border-rose-500/20' 
              : thermalLevel >= 75 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <Thermometer className={`w-5 h-5 ${
              thermalLevel >= 90 
                ? 'text-rose-500 animate-bounce' 
                : thermalLevel >= 75 ? 'text-amber-500' : 'text-emerald-500'
            }`} />
          </div>
        </div>

        {/* Micro-Latence Stream Node */}
        <div id="kpi-latency" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Latence de Corrélation
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl md:text-3xl font-black text-teal-500">
                {isSimulatingStress ? '18.4 ms' : '9.6 ms'}
              </span>
              <span className="text-[8.5px] font-bold text-emerald-500">REALTIME</span>
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1 leading-tight font-medium">
              Vitesse de décision hardware
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Central Dispatch Authority Level */}
        <div id="kpi-dispatcher-threshold" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Seuil d'Alerte Dispatcher
            </span>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(['Low Warning', 'Moderate', 'High Alert'] as const).map(lev => {
                const isCurrent = dispatcherThreshold === lev;
                let cClass = '';
                if (isCurrent) {
                  if (lev === 'High Alert') cClass = 'bg-rose-500 text-white';
                  else if (lev === 'Moderate') cClass = 'bg-amber-500 text-black';
                  else cClass = 'bg-emerald-600 text-white';
                } else {
                  cClass = isLight ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-[#07161c] text-slate-400 hover:bg-[#0c232d]';
                }

                return (
                  <button
                    key={lev}
                    id={`alert-btn-${lev.toLowerCase().replace(' ', '-')}`}
                    onClick={() => {
                      setDispatcherThreshold(lev);
                      onNotify(`Ajustement manuel du seuil dispatcher à: ${lev}`);
                    }}
                    className={`text-[8px] font-black uppercase font-mono px-2 py-1 rounded transition-all cursor-pointer ${cClass}`}
                  >
                    {lev === 'High Alert' ? 'HIGH 🚨' : lev === 'Moderate' ? 'MOD ⚠️' : 'LOW ✅'}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-slate-450 dark:text-slate-400 leading-tight block mt-1 font-mono">
              Consigne : {dispatcherThreshold === 'High Alert' ? 'Sécurité Totale' : 'Normalisé'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. DOUBLE-COLUMN DECK (Event correlate & Dispatch controllers) */}
      <div id="karma3-interactive-deck" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN A (Span 7): EVENT CORRELATION ENGINE (Moteur de Corrélation d'Événements) */}
        <div id="karma3-correlation-engine" className={`rounded-[1.6rem] p-5 border flex flex-col justify-between lg:col-span-7 transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242f]/85 border-teal-800/40 shadow-2xl'
        }`}>
          
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="space-y-0.5">
                <span className={`text-[9.5px] font-mono font-black uppercase tracking-wider ${isLight ? 'text-teal-700' : 'text-teal-400'}`}>
                  Moteur de Corrélation d'Événements (E.C.E)
                </span>
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Signaux Croisés Système &amp; Physique
                </h3>
              </div>

              {/* Source Quick badging */}
              <div className="flex flex-wrap gap-1">
                {['All', 'Physical Infrastructure', 'Anti-Abuse Suite', 'Multi-Tenancy'].map(src => (
                  <button
                    key={src}
                    id={`filter-${src.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setSelectedSource(src)}
                    className={`text-[8px] font-mono uppercase font-black px-2 py-1 rounded transition-colors cursor-pointer ${
                      selectedSource === src 
                        ? 'bg-teal-600 text-white' 
                        : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-150' : 'bg-black/30 text-slate-400 hover:text-white'
                    }`}
                  >
                    {src === 'Physical Infrastructure' ? 'Métal 🌡️' : src === 'Anti-Abuse Suite' ? 'Cyber 🛡️' : src === 'Multi-Tenancy' ? 'Isolated 🔑' : 'Tous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Event search box inline */}
            <div className="relative mb-3.5" id="engine-search-bar">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher des signaux de corrélation (ex: force brute, transformateur)..."
                value={searchQuery}
                aria-label="Filtre événements"
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none font-sans border transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-600 focus:bg-white placeholder-slate-400' 
                    : 'bg-[#05141b]/85 border-teal-800/35 text-white focus:border-teal-500 placeholder-slate-500 font-mono text-[10px]'
                }`}
              />
            </div>

            {/* List of Correlated Signals */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar pr-1" id="correlated-events-list">
              <AnimatePresence>
                {filteredEvents.map(evt => {
                  let badgeColorClass = '';
                  let bBorderClass = '';
                  if (evt.severity === 'Critical' || evt.severity === 'High') {
                    badgeColorClass = 'text-rose-500 bg-rose-500/10';
                    bBorderClass = 'border-rose-500/20';
                  } else if (evt.severity === 'Medium') {
                    badgeColorClass = 'text-amber-500 bg-amber-500/10';
                    bBorderClass = 'border-amber-500/20';
                  } else {
                    badgeColorClass = 'text-blue-500 bg-blue-500/10';
                    bBorderClass = 'border-blue-500/20';
                  }

                  // Active mitigation warnings
                  const hasActiveMitigation = 
                    (evt.id === 'EVT-01' && coolingPurgeActive) ||
                    (evt.id === 'EVT-02' && ipShieldActive) ||
                    (evt.id === 'EVT-05' && isolatedLoadActive);

                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                        hasActiveMitigation
                          ? (isLight ? 'bg-emerald-50/55 border-emerald-500/40 ring-1 ring-emerald-500/10' : 'bg-[#06241b] border-emerald-500/40 shadow-sm')
                          : (isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-[#05141b]/70 border-teal-800/15 hover:border-teal-800/30')
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-slate-400">{evt.time}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest border ${badgeColorClass} ${bBorderClass}`}>
                              {evt.id} • {evt.severity}
                            </span>
                            <span className={`text-[8.5px] font-semibold font-mono ${
                              evt.source.includes('Infrastructure') ? 'text-amber-500' : 'text-blue-400'
                            }`}>
                              [{evt.source}]
                            </span>
                          </div>
                          <h4 className={`text-xs font-black tracking-tight ${
                            hasActiveMitigation ? 'text-emerald-500' : isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {evt.title}
                          </h4>
                        </div>

                        {/* Factor Circle score */}
                        <div className="text-right flex items-center gap-1.5 shrink-0">
                          <div className="text-[9px] font-mono">
                            <span className="block text-slate-400 leading-none">Corrélation</span>
                            <span className="font-extrabold text-teal-500 text-xs mt-0.5">{evt.correlationFactor}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Technical specifications */}
                      <p className={`text-[10.5px] mt-2 leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-350'}`}>
                        {evt.details}
                      </p>

                      {/* Immediate mitigation feedback */}
                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-dashed border-slate-200 dark:border-teal-800/20">
                        <span className="text-[9px] font-mono text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Alignement instantané asynchrone
                        </span>
                        {hasActiveMitigation ? (
                          <span className="text-[8.5px] font-mono font-black uppercase text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Contre-Mesure Active
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-mono font-black uppercase text-rose-500 flex items-center gap-1">
                            ⚠️ En attente de purge / isolement
                          </span>
                        )}
                      </div>

                    </motion.div>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-10 italic text-slate-500 text-xs">
                    Aucun signal de corrélation relevé avec ces critères de filtrage.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Informational note */}
          <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-teal-800/25 flex gap-3 text-left">
            <Info className="w-4 h-4 shrink-0 text-teal-500 mt-0.5 animate-pulse" />
            <p className="text-[9.5px] leading-snug text-slate-450 dark:text-slate-400 font-medium">
              Conformément à l'architecture **AuditAX multi-stream**, ce moteur compare de façon continue le courant physique sous-jacent et les signatures d'authentification IP de la suite anti-abus afin d'éviter les menaces de sabotage industriel sur les transformateurs locataires.
            </p>
          </div>

        </div>

        {/* COLUMN B (Span 5): CENTRAL LOGIC DISPATCHER & PREVIEW CHANNELS */}
        <div id="karma3-dispatcher-system" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Dispatch Actions Center */}
          <div id="central-logic-dispatcher-card" className={`rounded-[1.6rem] p-5 border text-left flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242f]/85 border-teal-800/40 shadow-2xl'
          }`}>
            <div className="space-y-4">
              <div className="border-b pb-2.5 border-slate-200 dark:border-teal-800/20">
                <span className={`text-[9.5px] font-mono font-black uppercase tracking-wider block ${isLight ? 'text-teal-700' : 'text-teal-400'}`}>
                  Central Logic Dispatcher
                </span>
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Contre-Mesures Grille et Sabotage
                </h3>
              </div>

              {/* Slider for Thermal Level */}
              <div className="space-y-2 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-teal-800/20 rounded-2xl p-4.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-300 font-mono tracking-wider flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    Glissière Thermique Transformateur
                  </label>
                  <span className="text-xs font-mono font-black text-teal-400">{thermalLevel} °C</span>
                </div>
                
                <input 
                  type="range"
                  min="30"
                  max="120"
                  step="0.5"
                  value={thermalLevel}
                  aria-label="Contrôle thermique"
                  onChange={(e) => {
                    const nextVal = parseFloat(e.target.value);
                    setThermalLevel(nextVal);
                    if (nextVal > 95) {
                      setTerminalLogs(prev => [...prev, `🔥 [TELEMETRY] Surcharge de consigne manuelle à ${nextVal}°C.`]);
                    }
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-[#07161c] rounded-lg appearance-none cursor-pointer accent-teal-500"
                />

                <div className="flex justify-between text-[8px] font-mono uppercase text-slate-500 leading-none">
                  <span>30°C (Repos)</span>
                  <span>75°C (Moyen)</span>
                  <span>120°C (Fusible)</span>
                </div>
              </div>

              {/* Tactical Buttons for Counter-measures Grid */}
              <div className="grid grid-cols-2 gap-3" id="dispatch-tactical-buttons">
                
                {/* 1. Cooling purger */}
                <button
                  id="action-cool-purge"
                  onClick={triggerCoolingPurge}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                    coolingPurgeActive 
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] animate-pulse' 
                      : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-[#05141b]/70 border-teal-800/15 hover:bg-black/35 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[8.5px] font-mono font-black uppercase tracking-widest block">Purge Azote</span>
                    <span className={`w-2 h-2 rounded-full ${coolingPurgeActive ? 'bg-cyan-400' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase block leading-none">Refroidir</span>
                    <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">Purge TX-03 d'azote</span>
                  </div>
                </button>

                {/* 2. Anti-abuse suspect CDN isolation */}
                <button
                  id="action-ip-quarantine"
                  onClick={triggerIpShield}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                    ipShieldActive 
                      ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]' 
                      : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-[#05141b]/70 border-teal-800/15 hover:bg-black/35 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[8.5px] font-mono font-black uppercase tracking-widest block">Isoler IP CDN</span>
                    <span className={`w-2 h-2 rounded-full ${ipShieldActive ? 'bg-rose-500' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase block leading-none">Quarantaine</span>
                    <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">Bac à sable suspect</span>
                  </div>
                </button>

                {/* 3. Grid load shedding */}
                <button
                  id="action-grid-delestage"
                  onClick={triggerIsolatedLoad}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                    isolatedLoadActive 
                      ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                      : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-[#05141b]/70 border-teal-800/15 hover:bg-black/35 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[8.5px] font-mono font-black uppercase tracking-widest block">Délestage Grille</span>
                    <span className={`w-2 h-2 rounded-full ${isolatedLoadActive ? 'bg-yellow-500' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase block leading-none">Contenir</span>
                    <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">Basculer sur CL-2</span>
                  </div>
                </button>

                {/* 4. Renew Multi-tenancy Key Tokens */}
                <button
                  id="action-rotate-tokens"
                  onClick={triggerKeysRotation}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                    keysRotatedActive 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-[#05141b]/70 border-teal-800/15 hover:bg-black/35 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[8.5px] font-mono font-black uppercase tracking-widest block">Rotation jetons</span>
                    <span className={`w-2 h-2 rounded-full ${keysRotatedActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase block leading-none">Renouveler</span>
                    <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">Clés locataires energy</span>
                  </div>
                </button>

              </div>
            </div>
          </div>

          {/* SIMULATED SHELL TERMINAL LOGS FEED */}
          <div id="karma3-realtime-terminal-card" className={`rounded-[1.6rem] border flex flex-col h-[320px] justify-between overflow-hidden ${
            isLight ? 'bg-slate-900 text-[#cbd5e1] border-slate-950' : 'bg-[#01090d] border-[#07161c] text-[#00ffcc]'
          }`}>
            <div className="p-3 border-b border-white/5 bg-[#03151f] flex justify-between items-center shrink-0">
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] font-black text-slate-450 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                Terminal Souverain Dispatch Logs
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Scrollable container of logs */}
            <div 
              ref={scrollRef}
              className="flex-1 p-3.5 space-y-2 overflow-y-auto no-scrollbar font-mono text-[9.5px] leading-relaxed text-left"
              id="terminal-stdout-logs"
            >
              {terminalLogs.map((lg, i) => (
                <div key={i} className="whitespace-pre-line tracking-wide">
                  {lg}
                </div>
              ))}
            </div>

            {/* Interactive command execution form */}
            <form onSubmit={handleTerminalSubmit} className="p-2 border-t border-white/5 bg-[#03151f] flex gap-1.5 shrink-0">
              <span className="text-[10px] font-mono pl-1.5 pt-1.5 text-slate-500">$</span>
              <input 
                type="text"
                placeholder="Consigne terminal (ex: cool, isolate, status)..."
                value={terminalInput}
                aria-label="Directive terminal"
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-[10px] py-1 border-none focus:outline-none focus:ring-0 text-white placeholder-slate-600 font-mono"
              />
              <button 
                type="submit"
                className="px-3 py-1 bg-teal-600 hover:bg-teal-505 transition-colors text-white font-mono rounded text-[8.5px] font-black uppercase cursor-pointer"
              >
                Envoyer
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* 4. SOVEREIGN RATIO GRAPHICAL PERFORMANCE DASHBOARD */}
      <div id="karma3-performance-dashboard-deck" className={`rounded-[1.6rem] p-5 border text-left ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242f]/85 border-teal-800/40 shadow-2xl'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b pb-4.5 border-slate-200 dark:border-teal-800/20">
          <div className="space-y-0.5">
            <span className={`text-[9.5px] font-mono font-black uppercase tracking-wider block ${isLight ? 'text-teal-700' : 'text-teal-400'}`}>
              Sovereign Ratio Dashboard
            </span>
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Télémétrie Temporelle et Historique de la Température du transformateur
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase font-black text-slate-450 dark:text-slate-400">
            Fréquence : live (10ms) • Archivage 24H
          </span>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="sovereign-graphical-sections">
          
          {/* Main Area Chart: Temperature Historical Profile */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-350 block">
              Historique de Surchauffes TX-03 contre-balancé
            </span>
            <div className="h-[220px] w-full bg-slate-50 dark:bg-black/20 rounded-2xl p-2 border border-slate-100 dark:border-teal-800/5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_THERMAL_CURVE}>
                  <defs>
                    <linearGradient id="coolBlueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isLight ? '#0d9488' : '#14b8a6'} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={isLight ? '#0d9488' : '#14b8a6'} stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={isLight ? '#cbd5e1' : '#071b24'} strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke={isLight ? '#475569' : '#555'} fontSize={9} />
                  <YAxis stroke={isLight ? '#475569' : '#555'} fontSize={9} />
                  <Tooltip contentStyle={
                    isLight 
                      ? { backgroundColor: '#fff', borderColor: '#cbd5e1', color: '#1e293b' }
                      : { backgroundColor: '#021117', borderColor: '#14b8a6', color: '#fff', fontSize: '10px' }
                  } />
                  <Area type="monotone" name="Température transformateur (°C)" dataKey="temperature" stroke="#14b8a6" fillOpacity={1} fill="url(#coolBlueGlow)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Stab Grille auxiliary vs Threat */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-350 block">
              Rapport de Stabilité Réseau &amp; Niveau de Menace
            </span>
            <div className="h-[220px] w-full bg-slate-50 dark:bg-black/20 rounded-2xl p-2 border border-slate-100 dark:border-teal-800/5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_THERMAL_CURVE}>
                  <CartesianGrid stroke={isLight ? '#cbd5e1' : '#071b24'} strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke={isLight ? '#475569' : '#555'} fontSize={9} />
                  <YAxis stroke={isLight ? '#475569' : '#555'} fontSize={9} />
                  <Tooltip contentStyle={
                    isLight 
                      ? { backgroundColor: '#fff', borderColor: '#cbd5e1', color: '#1e293b' }
                      : { backgroundColor: '#021117', borderColor: '#071b24', color: '#fff', fontSize: '10px' }
                  } />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" name="Stabilité Grille (%)" dataKey="gridStability" stroke="#f59e0b" strokeWidth={2.5} />
                  <Line type="monotone" name="Menace Isolée (%)" dataKey="threatLevel" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Tactical Recommendation Box based on live variables */}
        <div className={`mt-5 p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
          thermalLevel >= 90 ? 'bg-rose-500/15 border-rose-500/35' : 'bg-emerald-500/10 border-emerald-500/20'
        }`} id="tactical-guideline">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${thermalLevel >= 90 ? 'text-rose-500' : 'text-emerald-500'}`} />
              <span className={`text-[10px] font-black uppercase font-mono tracking-wider ${
                thermalLevel >= 90 ? 'text-rose-555 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                {thermalLevel >= 90 ? 'RECOMMANDATION D\'URGENCE CORRELATION' : 'CONFORME À LA CHARGE SOVERAIGN'}
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              {thermalLevel >= 90 
                ? 'Critique : Activez la purge asynchrone d\'azote gazeux et isolez immédiatement l\'IP CDN suspecte pour stabiliser les transformateurs locataires.'
                : 'Charge nominale autorisée. Les seuils de sabotage sont continuellement surveillés par la suite de correlation combinée.'
              }
            </p>
          </div>
          {thermalLevel >= 90 && (
            <button
              onClick={triggerCoolingPurge}
              className="self-start sm:self-center px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[9px] font-black uppercase rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
            >
              Lancer Purge Immédiate
            </button>
          )}
        </div>

      </div>

      {/* FOOTER SYSTEM INFORMATION */}
      <footer id="karma3-footer" className={`px-4.5 py-4 border-t flex flex-col md:flex-row justify-between items-center text-[8.5px] font-mono uppercase tracking-widest gap-4 mt-6 ${
        isLight ? 'border-slate-200 text-slate-500 font-medium' : 'border-teal-800/15 text-slate-500'
      }`}>
        <span>© 2026 AuditAX Sovereign Ledger. Module de corrélation de grille Karma3.</span>
        <div className="flex flex-wrap gap-4 items-center">
          <span className="hover:text-teal-400 cursor-pointer transition-colors">Norme CCPA / RGPD ISO AUX</span>
          <span className={`cursor-pointer font-bold animate-pulse transition-colors ${
            isLight ? 'text-teal-700' : 'text-teal-400'
          }`}>
            Garantie Hardened AES-256
          </span>
          <span className="hover:text-teal-400 cursor-pointer transition-colors">V1.3.0 Engine Grid</span>
        </div>
      </footer>

    </div>
  );
};
