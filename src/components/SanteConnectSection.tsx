import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartPulse, 
  Activity, 
  AlertTriangle, 
  MoreHorizontal, 
  Settings, 
  RefreshCw, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  MapPin, 
  Sliders, 
  Check, 
  Award,
  Users,
  ShieldAlert,
  Info
} from 'lucide-react';

interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info';
  color: string;
}

export const SanteConnectSection = ({ onNotify, language = 'FR' }: { onNotify: (m: string) => void; language?: 'FR' | 'EN' }) => {
  const { t: translate } = useTranslation();
  // Simulator State
  const [hospitalName, setHospitalName] = useState("HÔPITAL UNIVERSITAIRE DE RABAT");
  const [hospitalCity, setHospitalCity] = useState("Rabat");
  const [fluxUrgences, setFluxUrgences] = useState(92);
  const [litsLibres, setLitsLibres] = useState(14);
  const [staffActif, setStaffActif] = useState(86);
  
  // Design Preset
  const [themePreset, setThemePreset] = useState<'cyber-purple' | 'emerald-glass' | 'deep-ocean'>('cyber-purple');

  // Simulation play state
  const [isSimulating, setIsSimulating] = useState(true);

  const t = (fr: string, en: string) => {
    if (fr.includes('.') && !fr.includes(' ')) {
      return translate(fr);
    }
    return language === 'FR' ? fr : en;
  };

  // Active real-time alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      title: 'ADMISSION CRITIQUE',
      subtitle: 'AMBULANCE #402 EN APPROCHE',
      timestamp: '2m',
      type: 'critical',
      color: '#ff4d00'
    },
    {
      id: '2',
      title: 'SURCHARGE TECHNIQUE',
      subtitle: 'SÉCHOIR ZONE STÉRILISATION 3 HS',
      timestamp: '8m',
      type: 'warning',
      color: '#f59e0b'
    },
    {
      id: '3',
      title: 'VÉRIFICATION PATIENT',
      subtitle: 'DEMANDE DE SCANNER CONFIRMÉE',
      timestamp: '15m',
      type: 'info',
      color: '#10b981'
    }
  ]);

  // Form for custom simulation actions
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertSubtitle, setNewAlertSubtitle] = useState('');
  const [newAlertType, setNewAlertType] = useState<'critical' | 'warning' | 'info'>('critical');

  // Trigger automated dashboard updates when simulation is active
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Small random variations inside realistic boundaries
      setFluxUrgences(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const next = Math.max(10, Math.min(100, prev + delta));
        return next;
      });

      setLitsLibres(prev => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const next = Math.max(2, Math.min(60, prev + delta));
        return next;
      });

      setStaffActif(prev => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const next = Math.max(30, Math.min(150, prev + delta));
        return next;
      });

      // Occasional notification or automatic warning updates
      if (Math.random() > 0.8) {
        const randomHospitalsInfo = [
          "Mise à jour des lits en Réanimation chirurgicale.",
          "Nouveau planning du personnel d'urgence injecté.",
          "Service de cardiologie disponible à 100%.",
          "Synchronisation satellite stable pour les télé-transmissions."
        ];
        const randomNote = randomHospitalsInfo[Math.floor(Math.random() * randomHospitalsInfo.length)];
        onNotify(`Hospital Sync: ${randomNote}`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulating, onNotify]);

  // Derive status label for Emergency Flow
  const getFluxStatus = (val: number) => {
    if (val >= 90) return { label: 'OPTIMUM', color: 'text-cyan-400' };
    if (val >= 75) return { label: 'SOUS TENSION', color: 'text-amber-400' };
    if (val >= 50) return { label: 'MODÉRÉ', color: 'text-emerald-400' };
    return { label: 'FLUIDE', color: 'text-sky-450' };
  };

  // Derive status label for Free Beds
  const getBedsStatus = (val: number) => {
    if (val <= 5) return { label: 'CRITIQUE', color: 'text-red-500' };
    if (val <= 15) return { label: 'TENSION', color: 'text-orange-500' };
    if (val <= 30) return { label: 'SATISFAISANT', color: 'text-emerald-400' };
    return { label: 'EXCELLENT', color: 'text-cyan-400' };
  };

  // Derive status label for Staff
  const getStaffStatus = (val: number) => {
    if (val < 50) return { label: 'SOUS-EFFECTIF', color: 'text-red-400' };
    if (val < 75) return { label: 'FLUX TENDU', color: 'text-amber-400' };
    return { label: 'STABLE', color: 'text-green-400' };
  };

  // Switch hospital templates
  const applyHospitalTemplate = (name: string, city: string) => {
    setHospitalName(name.toUpperCase());
    setHospitalCity(city);
    onNotify(`Connexion établie avec ${name} (${city})`);
    
    // Simulate typical baseline values for each template
    if (city === 'Rabat') {
      setFluxUrgences(92);
      setLitsLibres(14);
      setStaffActif(86);
    } else if (city === 'Casablanca') {
      setFluxUrgences(97);
      setLitsLibres(4);
      setStaffActif(120);
    } else if (city === 'Marrakech') {
      setFluxUrgences(84);
      setLitsLibres(28);
      setStaffActif(72);
    } else {
      setFluxUrgences(70);
      setLitsLibres(35);
      setStaffActif(64);
    }
  };

  // Add a new alert manually
  const handleAddAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle.trim()) {
      onNotify("Le titre de l'alerte ne peut pas être vide !");
      return;
    }

    const colorMap = {
      critical: '#ff4d00',
      warning: '#f59e0b',
      info: '#10b981'
    };

    const added: AlertItem = {
      id: Date.now().toString(),
      title: newAlertTitle.toUpperCase(),
      subtitle: (newAlertSubtitle || 'RÉSEAU INTERNE SYNCHRONISÉ').toUpperCase(),
      timestamp: 'Prêt',
      type: newAlertType,
      color: colorMap[newAlertType]
    };

    setAlerts(prev => [added, ...prev]);
    setNewAlertTitle('');
    setNewAlertSubtitle('');
    onNotify(`✨ Alerte "${added.title}" insérée dans le flux temps réel !`);
  };

  // Delete individual alert
  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(al => al.id !== id));
    onNotify("🗑️ Message d'alerte acquitté et supprimé.");
  };

  // Reset all alerts
  const resetAlerts = () => {
    setAlerts([
      {
        id: '1',
        title: 'ADMISSION CRITIQUE',
        subtitle: 'AMBULANCE #402 EN APPROCHE',
        timestamp: '2m',
        type: 'critical',
        color: '#ff4d00'
      }
    ]);
    onNotify("🔄 Flux de données réinitialisé à l'état initial de l'image.");
  };

  // Dynamic colors derived from selected visual preset
  const presetStyles = {
    'cyber-purple': {
      bgGradient: 'from-[#190938] via-[#0b031b] to-[#04010e]',
      cardBg: 'bg-[#21144a]/40 border-[#38267d]/50',
      cardGlow: 'shadow-[0_0_60px_rgba(33,20,74,0.4)]',
      headerGlow: 'bg-[#ff4d00]/10',
      divider: 'border-[#38267d]/35',
      badgeBg: 'bg-[#1b2559]/75 border-[#2b3a8a]/60 text-cyan-400',
      miniCardBg: 'bg-[#29175a]/50 border-[#3a2082]/65',
      alertBg: 'bg-[#22124d]/60 border-[#351a7e]/55',
    },
    'emerald-glass': {
      bgGradient: 'from-[#031d16] via-[#010806] to-[#000101]',
      cardBg: 'bg-[#06241b]/55 border-[#0d4f3b]/50',
      cardGlow: 'shadow-[0_0_60px_rgba(6,36,27,0.45)]',
      headerGlow: 'bg-emerald-500/10',
      divider: 'border-[#0d4f3b]/35',
      badgeBg: 'bg-[#021c15]/80 border-[#0d533d]/70 text-emerald-400',
      miniCardBg: 'bg-[#042d22]/50 border-[#0e513e]/75',
      alertBg: 'bg-[#021f17]/65 border-[#0e4e3a]/60',
    },
    'deep-ocean': {
      bgGradient: 'from-[#05142b] via-[#020914] to-[#000205]',
      cardBg: 'bg-[#071d3a]/50 border-[#123664]/50',
      cardGlow: 'shadow-[0_0_60px_rgba(7,29,58,0.4)]',
      headerGlow: 'bg-cyan-500/10',
      divider: 'border-[#123664]/35',
      badgeBg: 'bg-[#04152b]/80 border-[#113a69]/70 text-sky-400',
      miniCardBg: 'bg-[#0a2345]/50 border-[#133e72]/75',
      alertBg: 'bg-[#071f3e]/65 border-[#123b6b]/60',
    }
  };

  const activeStyles = presetStyles[themePreset];

  return (
    <div className={`min-h-screen text-slate-100 p-4 md:p-8 space-y-12 bg-gradient-to-br ${activeStyles.bgGradient} transition-all duration-700 rounded-3xl md:rounded-[4rem]`}>
      
      {/* SECTION TITLE & DEMO SETTINGS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-white/5 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 rounded-full text-[10px] tracking-widest font-black uppercase mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Architecture de Pilotage en Haute Fidélité
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            Santé Connect <span className="text-cyan-400 font-mono">v2</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium max-w-xl">
            Rendu fidèle à l'interface originale avec gestionnaire de flux, alertes dynamiques et presets visuels de haute accessibilité hospitalière.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Preset Buttons */}
          <div className="flex bg-black/40 p-1 border border-white/5 rounded-2xl">
            <button 
              onClick={() => setThemePreset('cyber-purple')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-xl transition-all ${themePreset === 'cyber-purple' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Cyber Violet (Orig.)
            </button>
            <button 
              onClick={() => setThemePreset('emerald-glass')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-xl transition-all ${themePreset === 'emerald-glass' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Emerald Glass
            </button>
            <button 
              onClick={() => setThemePreset('deep-ocean')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-xl transition-all ${themePreset === 'deep-ocean' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Deep Ocean
            </button>
          </div>

          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider ${isSimulating ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
            title={isSimulating ? "Mettre en pause la simulation de flux" : "Activer la simulation automatique"}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Sim Live [ON]</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span>Sim [PAUSE_OFF]</span>
              </>
            )}
          </button>

          <button 
            onClick={resetAlerts}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl text-[10px] font-black tracking-wider uppercase transition-all"
            title="Reset to image state"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* CORE EXPERIENCE GRID: Left Side is original high fidelity card, Right Side is control console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE HIGH-FIDELITY DASHBOARD (AS VISUALLY REPRESENTED IN SCREENSHOT) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center py-6 w-full">
          
          <div className="text-[9px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-2">PREVIEW RENDER (EÉCHELLE RÉELLE)</div>
          
          {/* Main Visual Card Container */}
          <div className={`w-full max-w-lg p-9 ${activeStyles.cardBg} ${activeStyles.cardGlow} backdrop-blur-2xl rounded-[3rem] border transition-all duration-700 relative overflow-hidden flex flex-col justify-start text-left`}>
            
            {/* Background Atmosphere Aura */}
            <div className={`absolute -right-20 -top-20 w-44 h-44 rounded-full blur-[70px] ${activeStyles.headerGlow} opacity-80 pointer-events-none transition-all duration-700`} />
            
            {/* Header Area */}
            <div className="flex justify-between items-center w-full z-10">
              
              {/* Emblem / Badge & Institutional Info */}
              <div className="flex items-center gap-4">
                
                {/* Emblem Box with inner pulse cross */}
                <div className={`w-14 h-14 bg-[#1b2559]/60 border border-[#2b3a8a]/60 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer ${themePreset === 'emerald-glass' ? 'bg-[#01140f] border-emerald-500/40 shadow-emerald-550/10' : ''} ${themePreset === 'deep-ocean' ? 'bg-sky-950/50 border-sky-500/40 shadow-sky-500/10 animate-pulse' : ''}`}>
                  <div className="relative flex items-center justify-center">
                    <HeartPulse className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute animate-ping pointer-events-none" />
                  </div>
                </div>
                
                {/* Titles */}
                <div className="flex flex-col">
                  <h3 className="text-xl md:text-[21px] font-black italic text-white uppercase tracking-tight leading-none">
                    {hospitalName}
                  </h3>
                  <span className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-500 inline-block shrink-0" />
                    <span>HÔPITAL UNIVERSITAIRE DE {hospitalCity.toUpperCase()}</span>
                  </span>
                </div>

              </div>

              {/* Status Header Dots */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                </span>
                <span className="w-2 h-2 rounded-full bg-indigo-950 border border-indigo-900" />
              </div>

            </div>

            {/* Separator */}
            <div className={`border-b ${activeStyles.divider} my-6 z-10`} />

            {/* Core KPI Stats Row (Three beautiful mini-cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 z-10 w-full mb-8">
              
              {/* stat 1: flow */}
              <div className={`${activeStyles.miniCardBg} p-4 rounded-3xl flex flex-col items-center justify-between text-center min-h-[110px] border shadow-md relative hover:scale-[1.02] transition-transform`}>
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase font-sans">
                  FLUX URGENCES
                </span>
                <h4 className="text-2xl md:text-3xl font-black italic text-white leading-none my-1">
                  {fluxUrgences}%
                </h4>
                <span className={`text-[9.5px] font-black tracking-widest uppercase mt-0.5 ${getFluxStatus(fluxUrgences).color}`}>
                  {getFluxStatus(fluxUrgences).label}
                </span>
              </div>

              {/* stat 2: free beds */}
              <div className={`${activeStyles.miniCardBg} p-4 rounded-3xl flex flex-col items-center justify-between text-center min-h-[110px] border shadow-md relative hover:scale-[1.02] transition-transform`}>
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase font-sans">
                  LITS LIBRES
                </span>
                <h4 className="text-2xl md:text-3xl font-black italic text-white leading-none my-1">
                  {litsLibres}
                </h4>
                <span className={`text-[9.5px] font-black tracking-widest uppercase mt-0.5 ${getBedsStatus(litsLibres).color}`}>
                  {getBedsStatus(litsLibres).label}
                </span>
              </div>

              {/* stat 3: staff active */}
              <div className={`${activeStyles.miniCardBg} p-4 rounded-3xl flex flex-col items-center justify-between text-center min-h-[110px] border shadow-md relative hover:scale-[1.02] transition-transform`}>
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase font-sans">
                  STAFF ACTIF
                </span>
                <h4 className="text-2xl md:text-3xl font-black italic text-white leading-none my-1">
                  {staffActif}
                </h4>
                <span className={`text-[9.5px] font-black tracking-widest uppercase mt-0.5 ${getStaffStatus(staffActif).color}`}>
                  {getStaffStatus(staffActif).label}
                </span>
              </div>

            </div>

            {/* Alerts Subsection Header */}
            <div className="flex justify-between items-center mb-4 z-10">
              <h4 className="text-[11px] font-black tracking-widest text-[#94a3b8] uppercase font-sans">
                ALERTES TEMPS RÉEL
              </h4>
              <button 
                onClick={() => onNotify("Paramètres d'acquittement d'alertes ouverts.")}
                className="text-slate-500 hover:text-white transition-colors p-1 flex items-center justify-center shrink-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Live Alerts Area with smooth AnimatePresence transitions */}
            <div className="space-y-3 z-10 w-full min-h-[180px] overflow-hidden">
              <AnimatePresence initial={false}>
                {alerts.length > 0 ? (
                  alerts.slice(0, 3).map((al, idx) => (
                    <motion.div
                      key={al.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.95, x: 30 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className={`${activeStyles.alertBg} p-4 rounded-3xl border flex items-center justify-between relative overflow-hidden group hover:bg-slate-900/40 transition-colors`}
                    >
                      {/* Original Bracket Crescent Shape on left */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-20 border-2 border-r-0 border-l-[#ff4d00]/90 border-t-[#ff4d00]/30 border-b-[#ff4d00]/30 rounded-l-full pointer-events-none opacity-80" 
                        style={{ borderColor: `rgba(255, 77, 0, ${idx === 0 ? 0.95 : 0.25})`, borderLeftColor: al.color }}
                      />

                      {/* Icon & Details */}
                      <div className="flex items-center gap-4 pl-4">
                        {/* Red/Orange Warning Rotated Badge */}
                        <div className="w-10 h-10 bg-black/40 border rounded-xl rotate-45 flex items-center justify-center shrink-0 shadow-lg relative group overflow-hidden"
                          style={{ borderColor: al.color + '60' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr opacity-20" style={{ backgroundImage: `linear-gradient(135deg, ${al.color}, transparent)` }} />
                          <AlertTriangle className="w-[18px] h-[18px] -rotate-45" style={{ color: al.color }} />
                        </div>

                        {/* Title details */}
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-extrabold text-white uppercase tracking-wider leading-none">
                            {al.title}
                          </span>
                          <span className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest mt-1">
                            {al.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Right side Metadata Action or Time */}
                      <div className="flex items-center gap-3 pr-2">
                        <span className="text-[10px] font-black font-mono text-slate-420">
                          {al.timestamp}
                        </span>
                        
                        {/* Action option to manually dismiss alert */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAlert(al.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-all shrink-0"
                          title="Acquitter l'alerte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 border-2 border-dashed border-slate-800/40 rounded-3xl flex flex-col items-center justify-center text-slate-500 text-xs italic">
                     Aucune alerte active dans le registre. <br />
                     Utilisez la console pour en générer de nouvelles.
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Real-time sync ticker bar at the bottom */}
            <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shadow-[0_0_8px_#10b981]" />
                EN DIRECT : SATELLITE CHU_NODE_09
              </span>
              <span>RABAT_NET STABLE (12ms)</span>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATOR CONTROL CORE */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Quick instructions panel */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] space-y-3">
            <h3 className="text-md font-extrabold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Console d'Interactivité & Test
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ce simulateur vous permet de manipuler en temps réel l'interface élégante. Modifiez l'état d'urgence, changez d'établissement, ou émettez des alertes critiques instantanées pour vérifier l'intégration de l'affichage.
            </p>
          </div>

          {/* Slider controller cards */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] space-y-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Curseurs de Métriques Directes</h4>
            
            {/* Urgent flow */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Flux Urgences (%)</span>
                <span className="text-cyan-400 font-mono font-black">{fluxUrgences}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={fluxUrgences}
                onChange={(e) => setFluxUrgences(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <div className="flex justify-between text-[9px] text-[#475569] font-bold">
                <span>FLUIDE</span>
                <span>OPTIMAL (90%+)</span>
                <span>TENSION CRITIQUE</span>
              </div>
            </div>

            {/* Beds */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Lits Disponibles</span>
                <span className="text-amber-400 font-mono font-black">{litsLibres} lits</span>
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                value={litsLibres}
                onChange={(e) => setLitsLibres(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer outline-none focus:ring-1 focus:ring-amber-500"
              />
              <div className="flex justify-between text-[9px] text-[#475569] font-bold">
                <span>CRITIQUE (&lt;5)</span>
                <span>TENSION DE LITS (14)</span>
                <span>CONFORT STAT</span>
              </div>
            </div>

            {/* Staff */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Personnel Actif</span>
                <span className="text-emerald-400 font-mono font-black">{staffActif} collaborateurs</span>
              </div>
              <input 
                type="range"
                min="30"
                max="150"
                value={staffActif}
                onChange={(e) => setStaffActif(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer outline-none"
              />
              <div className="flex justify-between text-[9px] text-[#475569] font-bold">
                <span>SOUS-EFFECTIF</span>
                <span>STABLE (86)</span>
                <span>SURCHARGE PERSONNEL</span>
              </div>
            </div>
          </div>

          {/* Hospital Switcher */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Établissements Hospitaliers Partenaires</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button 
                onClick={() => applyHospitalTemplate("HÔPITAL UNIVERSITAIRE DE RABAT", "Rabat")}
                className={`p-3 text-left border rounded-xl transition-all ${hospitalCity === 'Rabat' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-black' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="text-[11px] font-black uppercase">CHU Rabat (Suivi Orig.)</div>
                <div className="text-[9px] text-slate-500 leading-none mt-1">Surcharge 92%, 14 lits</div>
              </button>

              <button 
                onClick={() => applyHospitalTemplate("CHU IBN ROCHD DE CASABLANCA", "Casablanca")}
                className={`p-3 text-left border rounded-xl transition-all ${hospitalCity === 'Casablanca' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-black' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="text-[11px] font-black uppercase">CHU Ibn Rochd</div>
                <div className="text-[9px] text-slate-500 leading-none mt-1">Surcharge critique 97%, 4 lits</div>
              </button>

              <button 
                onClick={() => applyHospitalTemplate("CHU MOHAMMED VI DE MARRAKECH", "Marrakech")}
                className={`p-3 text-left border rounded-xl transition-all ${hospitalCity === 'Marrakech' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-black' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="text-[11px] font-black uppercase">CHU Mohammed VI</div>
                <div className="text-[9px] text-slate-500 leading-none mt-1">Urgences 84%, 28 lits</div>
              </button>

              <button 
                onClick={() => applyHospitalTemplate("CENTRE HOSPITALIER SOZIER TANGER", "Tanger")}
                className={`p-3 text-left border rounded-xl transition-all ${hospitalCity === 'Tanger' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-black' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="text-[11px] font-black uppercase">CH Sozier Tanger</div>
                <div className="text-[9px] text-slate-500 leading-none mt-1">Urgences optimales 70%</div>
              </button>
            </div>
          </div>

          {/* Trigger manual alerts form */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem]">
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Générateur d'Alertes Temps Réel</h4>
            
            <form onSubmit={handleAddAlertSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest font-mono">Titre de l'Alerte</label>
                <input 
                  type="text" 
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  placeholder="Ex: CARDIO LOGIQUE EN ARRIVÉE" 
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest font-mono">Sous-texte optionnel / Info complémentaire</label>
                <input 
                  type="text" 
                  value={newAlertSubtitle}
                  onChange={(e) => setNewAlertSubtitle(e.target.value)}
                  placeholder="Ex: CHOC ANAPHYLACTIQUE PRÉ-ADMIS" 
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewAlertType('critical')}
                  className={`py-2 text-[10px] font-black uppercase border rounded-xl transition-all ${newAlertType === 'critical' ? 'bg-[#ff4d00]/10 border-[#ff4d00] text-red-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Critique
                </button>
                <button
                  type="button"
                  onClick={() => setNewAlertType('warning')}
                  className={`py-2 text-[10px] font-black uppercase border rounded-xl transition-all ${newAlertType === 'warning' ? 'bg-amber-500/10 border-amber-500 text-amber-350' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Attention
                </button>
                <button
                  type="button"
                  onClick={() => setNewAlertType('info')}
                  className={`py-2 text-[10px] font-black uppercase border rounded-xl transition-all ${newAlertType === 'info' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-350' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Régulé
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-white" /> Injection d'Alerte
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
