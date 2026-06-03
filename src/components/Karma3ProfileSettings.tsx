import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  Upload, 
  Check, 
  Trash2, 
  Lock, 
  Globe, 
  Bell, 
  Sparkles, 
  CloudLightning,
  ChevronDown,
  RefreshCw,
  X,
  Shield,
  Laptop,
  Smartphone,
  Eye,
  EyeOff,
  Cpu,
  Fingerprint,
  Info
} from 'lucide-react';

interface Karma3ProfileSettingsProps {
  onNotify: (msg: string) => void;
  theme?: 'dark' | 'light' | 'high-contrast';
}

interface UserSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  active: boolean;
  type: 'desktop' | 'mobile';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150'
];

export const Karma3ProfileSettings = ({ onNotify, theme = 'dark' }: Karma3ProfileSettingsProps) => {
  const isLight = theme === 'light' || theme === 'high-contrast';

  // State definitions aligned with original functional logic
  const [fullName, setFullName] = useState('Beniich Contact');
  const [emailAddress, setEmailAddress] = useState('beniich.contact@gmail.com');
  const [role, setRole] = useState('Sovereign Operator');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Administrative Switch configurations
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [language, setLanguage] = useState('English (US)');

  // Additional customized profile states for premium interaction
  const [encryptionKey, setEncryptionKey] = useState('AES-256-K3-NEXUS-SOVEREIGN-SEAL-X719');
  const [showKey, setShowKey] = useState(false);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([
    { id: 'SESS-01', device: 'Sovereign Lab Workstation (Lin-HML)', ip: '82.164.205.14', location: 'Paris, FR', active: true, type: 'desktop' },
    { id: 'SESS-02', device: 'Secure Mobile Console (Android Client)', ip: '194.254.91.50', location: 'Lyon, FR', active: false, type: 'mobile' }
  ]);

  // Handle Preset Avatar selection
  const selectPresetAvatar = (url: string) => {
    setAvatar(url);
    onNotify('📸 Photo de profil mise à jour via la galerie de présélections.');
  };

  // Handle local mockup portrait upload
  const handleUploadImageMock = () => {
    const randomImg = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
    setAvatar(randomImg);
    onNotify('📸 Photo de profil téléchargée et validée avec succès.');
  };

  // Safe reset routine
  const handleResetDefaults = () => {
    setFullName('Beniich Contact');
    setEmailAddress('beniich.contact@gmail.com');
    setRole('Sovereign Operator');
    setTwoFactor(true);
    setAutoSync(true);
    setNotifications(false);
    setDataEncryption(true);
    setLanguage('English (US)');
    setAvatar(null);
    setEncryptionKey('AES-256-K3-NEXUS-SOVEREIGN-SEAL-X719');
    setActiveSessions([
      { id: 'SESS-01', device: 'Sovereign Lab Workstation (Lin-HML)', ip: '82.164.205.14', location: 'Paris, FR', active: true, type: 'desktop' },
      { id: 'SESS-02', device: 'Secure Mobile Console (Android Client)', ip: '194.254.91.50', location: 'Lyon, FR', active: false, type: 'mobile' }
    ]);
    onNotify('🔄 Paramètres de profil et d\'administration réinitialisés à l\'état d\'origine.');
  };

  // Saving state simulation
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('💾 Les configurations d\'administration et de profil ont été enregistrées avec succès.');
  };

  // Revoking device action
  const revokeSession = (id: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    onNotify('🔌 Révocation et désaccouplement immédiat du terminal sécurisé.');
  };

  // Calculate dynamic security stance score based on custom switches
  const calculateSecurityStance = () => {
    let score = 40;
    if (twoFactor) score += 20;
    if (dataEncryption) score += 25;
    if (autoSync) score += 15;
    return score;
  };

  const securityScore = calculateSecurityStance();

  return (
    <div id="sovereign-profile-layout" className={`space-y-6 text-left select-none rounded-[1.8rem] p-4 md:p-6 transition-all duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800 border border-slate-200' : 'bg-[#021117] text-slate-100'
    }`}>
      
      {/* 1. HERO HEADER BAR */}
      <div id="profile-heading-card" className={`backdrop-blur-xl border rounded-[1.6rem] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242e]/85 border-teal-800/40 shadow-2xl'
      }`}>
        {/* Glow ambient backing */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-orange-500/5' : 'bg-orange-500/10'
        }`} />

        <div className="flex items-center gap-4 relative z-10" id="profile-brand-slot">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
            isLight 
              ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
              : 'bg-orange-500/10 border-orange-550/20 text-orange-400'
          }`}>
            <CloudLightning className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${
                isLight ? 'text-orange-700' : 'text-orange-400'
              }`}>
                Karma3 Operating Console
              </span>
              <span className={`px-2 py-0.5 border rounded-full text-[8px] font-mono uppercase font-black tracking-widest flex items-center gap-1 ${
                isLight 
                  ? 'bg-[#fef4eb] border-orange-200 text-orange-700' 
                  : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                Souveraineté Certifiée
              </span>
            </div>
            <h1 className={`text-xl md:text-2xl font-black tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white font-sans'
            }`}>
              Personnalisation du Système &amp; Administrateur
            </h1>
          </div>
        </div>

        {/* Action Top triggers aligned nicely */}
        <div className="flex gap-2 w-full md:w-auto relative z-10" id="profile-top-trigger-deck">
          <button 
            type="button"
            onClick={handleResetDefaults}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-[9.5px] font-mono uppercase font-extrabold rounded-xl transition-all cursor-pointer border ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' 
                : 'bg-white/5 border-[#153442] hover:bg-white/10 text-slate-350'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC HEALTH / SECURITY STANCE DECK */}
      <div id="profile-status-cards" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Security Score Widget */}
        <div id="card-security-score" className={`p-4.5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
                Score d'Intégrité de Session
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-black font-mono tracking-tight ${
                  securityScore >= 80 ? 'text-emerald-500' : securityScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {securityScore}%
                </span>
                <span className="text-[8.5px] font-mono font-black uppercase text-slate-400">
                  / 100 max
                </span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              securityScore >= 80 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-[#07171e] h-1.5 rounded-full overflow-hidden mt-3.5">
            <div 
              className={`h-full rounded-full transition-all duration-305 ${
                securityScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${securityScore}%` }}
            />
          </div>
          <p className="text-[9.5px] text-slate-400 leading-tight mt-2.5 font-sans font-medium">
            Calculé en temps réel selon les algorithmes d'encryption et d'authentification active.
          </p>
        </div>

        {/* Operating Identity Card */}
        <div id="card-operating-identity" className={`p-4.5 rounded-2xl border transition-all flex items-center gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl border overflow-hidden bg-[#150a30] border-orange-500/30 flex items-center justify-center shadow-lg">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-orange-500" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#021117] flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
            </div>
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-[8px] font-black tracking-widest text-[#94a3b8] uppercase font-mono block">
              Opérateur Assigné
            </span>
            <h4 className={`text-sm font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {fullName || 'Profil Anonyme'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate leading-none">
              {role} • {emailAddress}
            </p>
          </div>
        </div>

        {/* Global Protection Node info */}
        <div id="card-protection-node" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Sceau Cryptographique Matériel
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <Fingerprint className="w-4 h-4 text-orange-500" />
              <span className="text-[10.5px] font-bold text-teal-500">
                FIPS 140-3 LEVEL 4
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-tight mt-1.5 font-medium">
              Signature matérielle injectée via les puces de sécurité TPM physiques.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-550/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
        </div>

      </div>

      {/* 3. CORE SUBSTRATE GRID (Profile & System Controls Panel) */}
      <div id="profile-core-substrate" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN LEFT (Span 7): USER PROFILE CONFIGURATION FORM */}
        <div id="profile-identity-card" className={`rounded-[1.6rem] p-5 md:p-6 border flex flex-col justify-between lg:col-span-7 transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242f]/85 border-teal-800/40 shadow-2xl'
        }`}>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            
            <div className="space-y-0.5 border-b pb-3 border-slate-200 dark:border-teal-800/20">
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider block ${
                isLight ? 'text-orange-700' : 'text-orange-400'
              }`}>
                Section d'Identification Opérateur
              </span>
              <h3 className={`text-md font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Informations Personnelles &amp; Accréditations
              </h3>
            </div>

            <div className="space-y-4">
              
              {/* Full name input */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-bold uppercase text-slate-450 dark:text-slate-400 block tracking-widest font-mono">
                  Nom Complet de l'Opérateur
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Saisissez votre nom complet..." 
                    className={`w-full text-xs px-4 py-3 rounded-xl outline-none font-medium transition-all duration-200 border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500 focus:bg-white placeholder-slate-400' 
                        : 'bg-[#05141b]/80 border-teal-800/25 text-white focus:border-orange-500 focus:bg-[#071922] placeholder-slate-650'
                    }`}
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                </div>
              </div>

              {/* Email input as dynamic email validator address */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-bold uppercase text-slate-450 dark:text-slate-400 block tracking-widest font-mono">
                  Adresse e-mail Souveraine
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="ex: operator@audidax.secure" 
                    className={`w-full text-xs px-4 py-3 rounded-xl outline-none font-medium transition-all duration-200 border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500 focus:bg-white placeholder-slate-400' 
                        : 'bg-[#05141b]/80 border-teal-800/25 text-white focus:border-orange-500 focus:bg-[#071922] placeholder-slate-650'
                    }`}
                  />
                  <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                </div>
              </div>

              {/* Operator Role */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-bold uppercase text-slate-450 dark:text-slate-400 block tracking-widest font-mono">
                  Rôle Système &amp; Prélèvement de Sécurité
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Opérateur niveau 3, Auditeur..." 
                    className={`w-full text-xs px-4 py-3 rounded-xl outline-none font-medium transition-all duration-205 border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500 focus:bg-white placeholder-slate-400' 
                        : 'bg-[#05141b]/80 border-teal-800/25 text-white focus:border-orange-500 focus:bg-[#071922] placeholder-slate-650'
                    }`}
                  />
                  <Shield className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                </div>
              </div>

              {/* Avatar Selector and Preset Gallery */}
              <div className="space-y-3 pt-3.5 border-t border-dashed border-slate-200 dark:border-teal-800/20">
                <span className="text-[9.5px] font-bold uppercase text-slate-450 dark:text-slate-450 block tracking-widest font-mono">
                  Photo de Profil &amp; Identité Visuelle
                </span>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl border overflow-hidden shrink-0 flex items-center justify-center  ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#05141b] border-teal-800/35'
                  }`}>
                    {avatar ? (
                      <img src={avatar} alt="Active portrait" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleUploadImageMock}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-mono font-extrabold tracking-wide text-[9.5px] uppercase transition-all shadow-sm cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                        Importer Fichier
                      </button>

                      {avatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar(null);
                            onNotify('🗑️ Photo de profil retirée et réinitialisée par défaut.');
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[9px] font-black uppercase font-mono transition-all border cursor-pointer ${
                            isLight 
                              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-[#20050c]'
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                          Retirer
                        </button>
                      )}
                    </div>
                    <p className="text-[9px] text-[#94a3b8] leading-normal font-sans">
                      Chargez une photo au format JPG / PNG, max 1 Mb. Ou sélectionnez l'une des présélections cryptographiques ci-dessous :
                    </p>
                  </div>
                </div>

                {/* Preset Avatar Selection Deck */}
                <div className="flex gap-2.5 pt-2.5">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectPresetAvatar(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                        avatar === url ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-300 dark:border-teal-800/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

              </div>

            </div>

            {/* Twin triggers aligned elegantly */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-teal-800/20">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4 stroke-[3px]" /> Enregistrer les changements
              </button>
            </div>

          </form>
        </div>

        {/* COLUMN RIGHT (Span 5): ADMINISTRATIVE PANEL AS TOGGLES & SESSIONS */}
        <div id="profile-admin-card" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main administrative Switches */}
          <div id="administrative-settings-toggles" className={`rounded-[1.6rem] p-5 border flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242f]/85 border-teal-800/40 shadow-2xl'
          }`}>
            <div className="space-y-4">
              <div className="border-b pb-2.5 border-slate-200 dark:border-teal-800/20">
                <span className={`text-[10px] font-mono font-black uppercase tracking-wider block ${
                  isLight ? 'text-teal-700' : 'text-teal-400'
                }`}>
                  Console de Pilotage Administratif
                </span>
                <h3 className={`text-md font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Sécurité et Comportement Système
                </h3>
              </div>

              {/* Switch 1: Multi-factor authenticator */}
              <div className="flex justify-between items-center gap-4 p-3 rounded-xl border bg-slate-50/50 dark:bg-[#05141b]/60 border-slate-200 dark:border-teal-800/10">
                <div className="space-y-0.5 text-left flex-1">
                  <div className={`text-[11px] font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Double Facteur Obligatoire (2FA)
                  </div>
                  <p className="text-[9px] text-[#94a3b8] leading-tight font-mono">
                    Validation OTP lors du ciblage stratégique.
                  </p>
                </div>
                <button
                  type="button"
                  id="toggle-2fa"
                  onClick={() => {
                    setTwoFactor(!twoFactor);
                    onNotify(!twoFactor ? '🔒 Double facteur enclenché obligatoirement.' : '⚠️ Protection double facteur assouplie.');
                  }}
                  className={`w-11 h-6 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${
                    twoFactor 
                      ? 'bg-orange-600 justify-end' 
                      : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Switch 2: Device Auto-Sync */}
              <div className="flex justify-between items-center gap-4 p-3 rounded-xl border bg-slate-50/50 dark:bg-[#05141b]/60 border-slate-200 dark:border-teal-800/10">
                <div className="space-y-0.5 text-left flex-1">
                  <div className={`text-[11px] font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Synchronisation Automatique
                  </div>
                  <p className="text-[9px] text-[#94a3b8] leading-tight font-mono">
                    Télémétrie asynchrone continue avec le Hub.
                  </p>
                </div>
                <button
                  type="button"
                  id="toggle-autosync"
                  onClick={() => {
                    setAutoSync(!autoSync);
                    onNotify(!autoSync ? '🔄 Restauration de la liaison asynchrone automatique.' : '⚠️ Synchronisation manuelle requise.');
                  }}
                  className={`w-11 h-6 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${
                    autoSync 
                      ? 'bg-orange-600 justify-end' 
                      : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Switch 3: System notifications */}
              <div className="flex justify-between items-center gap-4 p-3 rounded-xl border bg-slate-50/50 dark:bg-[#05141b]/60 border-slate-200 dark:border-teal-800/10">
                <div className="space-y-0.5 text-left flex-1">
                  <div className={`text-[11px] font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Signaux d'Intrusion &amp; Alerte
                  </div>
                  <p className="text-[9px] text-[#94a3b8] leading-tight font-mono">
                    Notifications immédiates sur sabotage de courant.
                  </p>
                </div>
                <button
                  type="button"
                  id="toggle-notifications"
                  onClick={() => {
                    setNotifications(!notifications);
                    onNotify(!notifications ? '🔔 Surveillance active sur les attaques force-brute en direct.' : '🔇 Notifications désactivées.');
                  }}
                  className={`w-11 h-6 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${
                    notifications 
                      ? 'bg-orange-600 justify-end' 
                      : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Switch 4: Force local Database Encryption */}
              <div className="flex justify-between items-center gap-4 p-3 rounded-xl border bg-slate-50/50 dark:bg-[#05141b]/60 border-slate-200 dark:border-teal-800/10">
                <div className="space-y-0.5 text-left flex-1">
                  <div className={`text-[11px] font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Encryption Fortifiée AES-GCM-256
                  </div>
                  <p className="text-[9px] text-[#94a3b8] leading-tight font-mono">
                    Verrouillage cryptographique matériel de la dB locale.
                  </p>
                </div>
                <button
                  type="button"
                  id="toggle-encryption"
                  onClick={() => {
                    setDataEncryption(!dataEncryption);
                    onNotify(!dataEncryption ? '🔒 Base de données locale chiffrée avec succès.' : '⚠️ Chiffrement matériel affaibli.');
                  }}
                  className={`w-11 h-6 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${
                    dataEncryption 
                      ? 'bg-orange-600 justify-end' 
                      : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Dropdown: Language Preference selection */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[9.5px] font-bold uppercase text-slate-455 dark:text-slate-400 block tracking-widest font-mono">
                  Sélections de la Langue Système
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      onNotify(`🌐 Langue système modifiée : ${e.target.value}`);
                    }}
                    className={`w-full text-xs px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-950 focus:border-orange-500' 
                        : 'bg-[#05141b] border-teal-800/25 text-slate-100 focus:border-orange-500'
                    }`}
                  >
                    <option value="English (US)">English (US) 🇺🇸</option>
                    <option value="French (FR)">Français (FR) 🇫🇷</option>
                    <option value="Spanish (ES)">Español (ES) 🇪🇸</option>
                    <option value="German (DE)">Deutsch (DE) 🇩🇪</option>
                  </select>
                  <ChevronDown className="w-4.5 h-4.5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* ACTIVE AUTHORIZED SESSIONS TRACKER */}
          <div id="authorized-sessions-hud" className={`rounded-[1.6rem] p-5 border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242f]/85 border-teal-800/40 shadow-2xl'
          }`}>
            <div className="border-b pb-2.5 border-slate-200 dark:border-teal-800/20 mb-4 text-left">
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider block ${
                isLight ? 'text-teal-700' : 'text-teal-400'
              }`}>
                Terminaux Autorisés en Ligne ({activeSessions.length})
              </span>
              <h3 className={`text-md font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Audit des Sessions Actives
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto no-scrollbar" id="session-records-list">
              <AnimatePresence>
                {activeSessions.map(ses => (
                  <motion.div
                    key={ses.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                      ses.active 
                        ? (isLight ? 'bg-emerald-50/60 border-emerald-300' : 'bg-[#04241b] border-emerald-800/30 text-emerald-300')
                        : (isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#03151e]/60 border-teal-800/10 text-slate-350')
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 text-left">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        ses.active 
                          ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-500/10 border-slate-550/20 text-slate-400'
                      }`}>
                        {ses.type === 'desktop' ? <Laptop className="w-4.5 h-4.5" /> : <Smartphone className="w-4.5 h-4.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold truncate leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {ses.device}
                          </span>
                          {ses.active && (
                            <span className="px-1.5 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-widest bg-emerald-500 text-white leading-none font-mono">
                              ACTIF
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-wide leading-none">
                          {ses.ip} • {ses.location}
                        </p>
                      </div>
                    </div>

                    {!ses.active && (
                      <button
                        type="button"
                        onClick={() => revokeSession(ses.id)}
                        className={`p-2 rounded-lg border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer ${
                          isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-black/30 border-slate-805 text-slate-500'
                        }`}
                        title="Révoquer l'appareil"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {activeSessions.length === 0 && (
                <div className="text-center py-5 italic text-slate-500 text-xs font-mono">
                  Aucune session secondaire autorisée actuellement.
                </div>
              )}
            </div>

            {/* Sovereign Key configuration field with visual show/hide toggle */}
            <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-teal-800/25 text-left space-y-1.5">
              <label className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase font-mono block">
                Clé de Descellement Matériel Souveraine
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type={showKey ? 'text' : 'password'}
                    readOnly
                    value={encryptionKey}
                    aria-label="Clé de chiffrement"
                    className={`w-full text-[9px] font-mono px-3 py-2.5 rounded-xl border focus:outline-none truncate ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-800' 
                        : 'bg-[#05141b]/90 border-teal-800/30 text-teal-400'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-slate-400 hover:text-[#da6012] transition-colors cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(encryptionKey);
                    onNotify('📋 Clé de descellement copiée dans le presse-papier de l\'opérateur.');
                  }}
                  className="px-3.5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[9px] font-mono uppercase font-black cursor-pointer leading-tight shadow-sm shrink-0"
                >
                  Copier Key
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* QUICK INFORMATIONAL BANNER FOOTER */}
      <div id="profile-footer-tip" className={`p-4 rounded-xl border flex gap-3 text-left ${
        isLight ? 'bg-orange-50/50 border-orange-200/50' : 'bg-orange-500/5 border-orange-500/20'
      }`}>
        <Info className="w-4 h-4 shrink-0 text-orange-500 mt-0.5" />
        <div className="space-y-0.5 leading-tight">
          <div className={`text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider`}>
            CONSEIL DE SÉCURITÉ ADMIN
          </div>
          <p className="text-[10px] text-slate-450 dark:text-slate-400 text-left font-sans">
            Pour maintenir une certification **SOC 2 &amp; ISO 27001** sans dérive, conservez l'encryption matériel active et effectuez une rotation de la clé souveraine de descellement tous les 90 jours.
          </p>
        </div>
      </div>

    </div>
  );
};
