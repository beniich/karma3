import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Lock, 
  LogIn, 
  Zap, 
  Key, 
  CheckCircle2, 
  Terminal, 
  LogOut, 
  RefreshCw, 
  Trash2, 
  BarChart3, 
  ShieldCheck, 
  Award,
  Search,
  Plus,
  ArrowRight,
  User,
  Activity,
  UserCheck,
  Building,
  Mail,
  Sliders,
  AlertTriangle,
  HardDrive,
  Server,
  Download,
  Check
} from 'lucide-react';
import { Subscriber, DashboardData } from '../types';

// Subtle styling utility helper matching existing patterns
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// Internal custom Badge implementation
const RegistryBadge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'red' | 'orange' | 'green' | 'blue' | 'purple' }) => {
  const styles = {
    default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/25",
    orange: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", styles[variant])}>
      {children}
    </span>
  );
};

interface SovereignSubscribersRegistryProps {
  data: DashboardData;
  onNotify: (msg: string) => void;
  onAddSubscriber?: (s: Subscriber) => Promise<void>;
  onRemoveSubscriber?: (id: string) => Promise<void>;
  onUpdateSubscriber?: (id: string, updates: Partial<Subscriber>) => Promise<void>;
  theme?: 'dark' | 'light' | 'high-contrast';
}

export const SovereignSubscribersRegistry = ({
  data,
  onNotify,
  onAddSubscriber,
  onRemoveSubscriber,
  onUpdateSubscriber,
  theme = 'dark'
}: SovereignSubscribersRegistryProps) => {
  const [subTab, setSubTab] = useState<'registry' | 'portal'>('registry');
  const isLight = theme === 'light';
  const [filter, setFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newName, setNewName] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'Expert' | 'Corporate' | 'Enterprise'>('Enterprise');

  // Portal Authentication state
  const [authEmail, setAuthEmail] = useState('');
  const [authenticatedSub, setAuthenticatedSub] = useState<Subscriber | null>(null);
  const [apiToken, setApiToken] = useState('ax_live_tok_9f408acbe8c37d042f9e4a81');
  const [isRotating, setIsRotating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [emergencyCounter, setEmergencyCounter] = useState(0);

  // De-enrollment / Revocation states
  const [deEnrollTarget, setDeEnrollTarget] = useState<Subscriber | null>(null);
  const [revocationCode, setRevocationCode] = useState('');
  const [isDeEnrolling, setIsDeEnrolling] = useState(false);
  const [deEnrollStep, setDeEnrollStep] = useState('');
  const [hasCheckedTerms, setHasCheckedTerms] = useState(false);

  const handleExecuteDeEnroll = async () => {
    if (!deEnrollTarget) return;
    if (revocationCode.trim().toUpperCase() !== 'REVOQUER') {
      onNotify("⚠️ Code de confirmation de révocation invalide.");
      return;
    }
    if (!hasCheckedTerms) {
      onNotify("⚠️ Vous devez certifier la révocation réglementaire de cet actif.");
      return;
    }

    setIsDeEnrolling(true);
    setDeEnrollStep("Interrogation des clés mTLS et révocation du certificat client...");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setDeEnrollStep("Extraction de l'adresse IP et fermeture forcée des tunnels IPsec...");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setDeEnrollStep("Destruction définitive de l'enclave cryptographique HSM-01...");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setDeEnrollStep("Poussée de la configuration d'exclusion dans le Kernel FreeBSD...");
    await new Promise(resolve => setTimeout(resolve, 600));

    if (onRemoveSubscriber) {
      await onRemoveSubscriber(deEnrollTarget.id);
      setHasUnsavedChanges(true);
      onNotify(`🚨 Nœud ${deEnrollTarget.organization} entièrement révoqué et désenrôlé. (Pensez à appliquer les changements pour recompiler l'appliance).`);
    }

    setIsDeEnrolling(false);
    setDeEnrollTarget(null);
    setRevocationCode('');
    setHasCheckedTerms(false);
    setDeEnrollStep('');
  };

  // pfSense-Style Appliance OS States & Tickers
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [applyStep, setApplyStep] = useState('');
  const [systemUptime, setSystemUptime] = useState('03d 11h 45m');
  const [cpuUsage, setCpuUsage] = useState(24);
  const [ramUsage, setRamUsage] = useState(44);

  // Simulated live host cpu cycle changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(12, Math.min(84, prev + delta));
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleApplyChanges = () => {
    setIsApplyingChanges(true);
    setApplyStep("Initialisation de la recompilation du noyau FreeBSD local...");
    
    setTimeout(() => {
      setApplyStep("Analyse syntaxique du fichier maître XML /etc/karma3/config.xml...");
    }, 700);

    setTimeout(() => {
      setApplyStep("Rechargement des ponts cryptographiques mTLS & Routage PAM...");
    }, 1400);

    setTimeout(() => {
      setApplyStep("Mise à jour à chaud des règles d'audit (Suricata & pfBlockerNG)...");
    }, 2100);

    setTimeout(() => {
      setIsApplyingChanges(false);
      setHasUnsavedChanges(false);
      setApplyStep('');
      onNotify("⚡ Appliance recalculée : tous les services de filtrage et clés ont été synchronisés à l'OS.");
    }, 2800);
  };

  const handleDownloadConfigXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<karma3_appliance>
  <system>
    <hostname>pfsense-karma3.sovereign.local</hostname>
    <os_kernel>FreeBSD 14.1-STABLE (Core Edition)</os_kernel>
    <mtls_security>enabled</mtls_security>
    <api_endpoint>https://karma3.sovereign.local/api/v2</api_endpoint>
  </system>
  <subscribers_registry>
    ${subscribers.map(sub => `
    <subscriber id="${sub.id}">
      <organization>${sub.organization}</organization>
      <officer>${sub.name}</officer>
      <email>${sub.email}</email>
      <plan_tier>${sub.plan}</plan_tier>
      <status>${sub.status}</status>
      <joined_date>${sub.joinedDate}</joined_date>
    </subscriber>`).join('')}
  </subscribers_registry>
  <api_configuration>
    <token_signature>${apiToken}</token_signature>
    <emergency_lock>${emergencyCounter}</emergency_lock>
  </api_configuration>
</karma3_appliance>`;

    const blob = new Blob([xmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `karma3-appliance-config.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify("📄 Téléchargement réussi de 'karma3-appliance-config.xml' (Manager Central).");
  };

  const handleDownloadCompose = () => {
    const composeContent = `version: '3.8'

services:
  karma3-core-manager:
    image: karma3/core-manager:2.8.1-RELEASE
    container_name: karma3-core-manager
    restart: always
    environment:
      - NODE_ENV=production
      - APPLIANCE_MODE=true
      - CONFIG_PATH=/etc/karma3/config.xml
    volumes:
      - ./config.xml:/etc/karma3/config.xml
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "3000:3000"

  jumpserver-client:
    image: karma3/jumpserver-pam:latest
    container_name: karma3-jumpserver
    restart: always

  prometheus-sentinel:
    image: prom/prometheus:latest
    container_name: karma3-prometheus
    restart: always
`;

    const blob = new Blob([composeContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `docker-compose.yml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify("🐳 Master Orchestrator Bundle Téléchargé (docker-compose.yml)");
  };

  const [auditLogs, setAuditLogs] = useState<string[]>([
    "Initialisation globale du nœud souverain terminée.",
    "Certificats mTLS cryptographiques validés : Statut optimal.",
    "Canal de sécurité mTLS établi avec le cluster central Karma3."
  ]);

  const subscribers = data.subscribers || [];

  // Filter & Search computation
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter = filter === 'All' || sub.status === filter;
    const matchesSearch = 
      sub.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle subscriber direct login bypass or via email typing
  const handleSubscriberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      onNotify("Veuillez saisir une adresse e-mail.");
      return;
    }
    const match = subscribers.find(
      (s) => s.email.trim().toLowerCase() === authEmail.trim().toLowerCase()
    );
    if (match) {
      setAuthenticatedSub(match);
      onNotify(`🔐 Connexion réussie à l'espace souverain de ${match.organization}.`);
      setAuditLogs([
        `Nœud ${match.id} authentifié à ${new Date().toLocaleTimeString()} UTC`,
        `Plan d'engagement audité : ${match.plan} Tier`,
        "Connexion mTLS double-canal consolidée avec succès.",
        "Vérification d'accès MFA approuvée par le contrôleur."
      ]);
    } else {
      onNotify("Aucun compte d'abonné actif correspondant dans le Ledguer Cloud.");
    }
  };

  const handleSubscriberLogout = () => {
    setAuthenticatedSub(null);
    setAuthEmail('');
    onNotify("Déconnexion sécurisée de votre espace abonné terminée.");
  };

  // Create a new subscriber/node entry
  const handleDirectSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newOrg || !newEmail) {
      onNotify("Veuillez remplir l'ensemble des champs requis.");
      return;
    }

    const emailInUse = subscribers.some(
      (s) => s.email.trim().toLowerCase() === newEmail.trim().toLowerCase()
    );
    if (emailInUse) {
      onNotify("Cet e-mail possède déjà une licence active. Connectez-vous directement.");
      return;
    }

    const newSub: Subscriber = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      organization: newOrg,
      email: newEmail,
      plan: newPlan,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (onAddSubscriber) {
      await onAddSubscriber(newSub);
      setAuthenticatedSub(newSub);
      setHasUnsavedChanges(true);
      onNotify(`🎉 Bienvenue ! Nœud souverain ${newSub.id} raccordé avec succès.`);
      setNewName('');
      setNewOrg('');
      setNewEmail('');
      setAuditLogs([
        `Nouveau nœud d'accès ${newSub.id} créé par visioconférence`,
        `Identifiant organisationnel ${newOrg} validé numériquement`,
        "Enregistrement de sécurité dans le registre unifié réussi."
      ]);
    }
  };

  // Interactive secret api key rotation
  const handleRotateKey = () => {
    setIsRotating(true);
    setTimeout(() => {
      const chars = "abcdef0123456789";
      let key = "ax_live_tok_";
      for (let i = 0; i < 24; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
      }
      setApiToken(key);
      setIsRotating(false);
      setHasUnsavedChanges(true);
      onNotify("🔑 Clé SDK asynchrone régénérée. L'ancienne clé a été révoquée (Appliquez les changements).");
      setAuditLogs(prev => [`Clé d'API régénérée : ${key.substring(0, 15)}... [Sûr]`, ...prev]);
    }, 1000);
  };
  // Interactive diagnostic d'urgence simulation with actual progress bar
  const handleTriggerInstantAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);
    onNotify("⚙️ Lancement immédiat de l'audit cryptographique à distance...");

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setEmergencyCounter(prevCount => prevCount + 1);
          onNotify("✅ Audit à chaud terminé. 0 vulnérabilité détectée sur vos pipelines.");
          setAuditLogs(currentLogs => [
            `[Audit d'urgence] Validé à ${new Date().toLocaleTimeString()} (0 anomalie, conformité 100%)`,
            ...currentLogs
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleCreateSubscriberFromRegistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newOrg || !newEmail) {
      onNotify("Veuillez remplir l'ensemble des informations d'institution.");
      return;
    }

    const newSub: Subscriber = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      organization: newOrg,
      email: newEmail,
      plan: newPlan,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (onAddSubscriber) {
      await onAddSubscriber(newSub);
      setHasUnsavedChanges(true);
      onNotify(`💡 Nouveau nœud "${newOrg}" inséré avec succès. ID : ${newSub.id} (Pensez à appliquer les changements).`);
      setShowAddForm(false);
      setNewName('');
      setNewOrg('');
      setNewEmail('');
    }
  };

  return (
    <div className={cn(
      "space-y-8 font-sans text-left relative selection:bg-orange-500 selection:text-white transition-colors duration-300",
      isLight ? "text-zinc-805" : "text-slate-300"
    )}>

      {/* pfSense OS Recompile and apply overlays */}
      <AnimatePresence>
        {isApplyingChanges && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              className="max-w-xl w-full bg-[#111] border border-orange-500/30 p-8 rounded-[2rem] shadow-2xl space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-orange-600/10 border border-orange-500/40 rounded-full flex items-center justify-center animate-spin">
                  <RefreshCw className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#ff7a00] font-mono block">NEXUS CORE SYSTEM APPLIANCE</span>
                <h3 className="text-xl font-bold font-mono tracking-tight text-white uppercase italic">RECOMPILING HOST ENVIRONMENT</h3>
                <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
                  Le Manager de Configuration Central applique les paramètres du fichier XML de sécurité au système FreeBSD virtuel sous-jacent.
                </p>
              </div>

              <div className="p-4 bg-black border border-zinc-800 rounded-xl font-mono text-left space-y-1 text-[10px] text-emerald-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">▶</span>
                  <span className="animate-pulse">{applyStep}</span>
                </div>
                <div className="text-slate-500 text-[9px] mt-2">
                  Logs d'Appliance: CPU {cpuUsage}% | MEM {ramUsage}% | Mode: Single-Image | SLA Active
                </div>
              </div>

              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-600 h-full rounded-full animate-pulse" style={{ width: '80%' }} />
              </div>

              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Ne débranchez pas la liaison montante mTLS.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* pfSense-Style: Save & Apply Warning Banner */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-red-600/15 via-orange-600/10 to-transparent border border-orange-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none relative overflow-hidden text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/20 border border-orange-500/40 rounded-xl text-orange-500 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-black uppercase text-[#ff7a00] tracking-widest block font-mono">pfSense-Style Security Policy Engine</span>
                <p className="text-[11.5px] text-zinc-300 font-sans">
                  <strong>Modifications non rechargées !</strong> Le fichier maître <code className="font-mono text-[10.5px] px-1 bg-black rounded text-orange-400">config.xml</code> a été modifié localement mais n'a pas été poussé au Kernel FreeBSD.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleApplyChanges}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ff5500] to-[#ff7a00] hover:from-[#ff7a00] hover:to-[#ff9500] text-white font-black uppercase tracking-wider text-[10px] rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-none"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Appliquer les Changements
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Military Grade Asset Revocation and De-Enrollment Modal */}
      <AnimatePresence>
        {deEnrollTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-white text-center"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="max-w-2xl w-full bg-[#0d0707] border-2 border-red-500/30 p-8 rounded-[1.5rem] shadow-2xl space-y-6 font-mono text-left"
            >
              {/* Official Header */}
              <div className="text-center border-b border-red-500/20 pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-2 border border-red-500/20 bg-red-500/10 rounded-xl text-red-500 animate-pulse">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg font-black uppercase tracking-[0.3em] text-red-500">
                  Sovereign Karma3 Command
                </h3>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">
                  PROCÉDURE DE RÉVOCATION & DÉSENRÔLEMENT MILITAIRE • ACCRÉDITATION DIRECTE
                </p>
              </div>

              {isDeEnrolling ? (
                <div className="py-6 space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-red-400 block animate-pulse">
                      PROCESSUS TACTIQUE EN COURS
                    </span>
                    <p className="text-xs text-slate-300 bg-red-950/20 py-2.5 px-4 rounded-xl border border-red-500/10 max-w-sm mx-auto">
                      {deEnrollStep}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-red-400">
                      IDENTIFICATION DE L'ACTIF À EXCLURE
                    </span>
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Id du Nœud :</span>
                        <strong className="text-white text-sm font-bold block">{deEnrollTarget.id}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Origine / Institution :</span>
                        <strong className="text-white text-sm font-bold block">{deEnrollTarget.organization}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Responsable mTLS :</span>
                        <strong className="text-white text-sm font-bold block">{deEnrollTarget.name}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Canal Associé :</span>
                        <strong className="text-white text-sm font-bold block">{deEnrollTarget.email}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-450 border-b border-zinc-800 pb-1">
                      Certification Opérationnelle
                    </h4>

                    {/* Strict Compliance Checkboxes */}
                    <div className="space-y-2 text-xs">
                      <label className="flex items-start gap-3 p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={hasCheckedTerms} 
                          onChange={(e) => setHasCheckedTerms(e.target.checked)}
                          className="mt-0.5 accent-red-600"
                        />
                        <span className="text-[11px] text-slate-300 leading-normal">
                          Je certifie que cet actif n'est plus autorisé à communiquer, et que toutes ses clés d'accès HSM seront formellement révoquées du pont de sécurité mTLS.
                        </span>
                      </label>
                    </div>

                    {/* Révocation Confirmation Field */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                        Confirmer par écrit de sécurité
                      </label>
                      <input 
                        type="text" 
                        value={revocationCode}
                        onChange={(e) => setRevocationCode(e.target.value)}
                        placeholder="Saisissez 'REVOQUER' pour valider"
                        className="w-full px-4 py-3 bg-black border border-zinc-800 focus:border-red-500/40 focus:outline-none rounded-xl text-xs font-black tracking-widest placeholder:text-zinc-700 uppercase"
                      />
                    </div>
                  </div>

                  {/* Operational Signatures Footer */}
                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-900 leading-none">
                    <div className="text-center">
                      <div className="border-b border-zinc-805 h-8 mb-2"></div>
                      <p className="text-[9px] uppercase text-slate-500">Signature de l'Opérateur</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-zinc-805 h-8 mb-2"></div>
                      <p className="text-[9px] uppercase text-slate-500">Signature Officier Commandement</p>
                    </div>
                  </div>

                  {/* Buttons group */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setDeEnrollTarget(null);
                        setRevocationCode('');
                        setHasCheckedTerms(false);
                      }}
                      className="px-5 py-3 bg-zinc-950 hover:bg-zinc-900 text-slate-400 font-bold border border-zinc-850 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button 
                      type="button" 
                      onClick={handleExecuteDeEnroll}
                      disabled={!hasCheckedTerms || revocationCode.trim().toUpperCase() !== 'REVOQUER'}
                      className="px-6 py-3 bg-gradient-to-r from-red-650 to-red-750 hover:scale-[1.02] text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/20 active:scale-95 disabled:opacity-55 disabled:pointer-events-none transition-all text-[10px] cursor-pointer border-none"
                    >
                      Exécuter la Révocation Tactique
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* pfSense-Style: System integrated live hardware status widgets */}
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-[2rem] border transition-all shadow-xl text-left font-mono",
        isLight ? "bg-[#deecff] border-blue-200" : "bg-zinc-950/60 border-zinc-800/80"
      )}>
        {/* Box 1: Host information */}
        <div className="space-y-1">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block">Machine Hostname</span>
          <div className="flex items-center gap-2 pt-0.5">
            <Server className="w-4 h-4 text-[#ff7a00]" />
            <span className={cn("text-xs font-black truncate", isLight ? "text-zinc-900" : "text-white")}>pfsense-karma3.sovereign</span>
          </div>
          <span className="text-[9.5px] text-slate-400 block pt-0.5 font-sans">Uptime: {systemUptime}</span>
        </div>

        {/* Box 2: System Kernel OS */}
        <div className="space-y-1">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block">System Kernel / OS</span>
          <div className="flex items-center gap-2 pt-0.5">
            <HardDrive className="w-4 h-4 text-emerald-500" />
            <span className={cn("text-xs font-black truncate", isLight ? "text-zinc-900" : "text-white")}>FreeBSD 14.1-STABLE</span>
          </div>
          <button 
            type="button" 
            className="mt-1 py-1 px-2.5 rounded text-[8px] font-bold uppercase transition-all bg-emerald-500 text-white cursor-pointer border-none"
            style={isLight ? { backgroundColor: '#13b8bb' } : undefined}
          >
            Noyau Status
          </button>
          <span className="text-[9.5px] text-slate-400 block pt-0.5 font-sans">Mode: Sovereign Appliance</span>
        </div>

        {/* Box 3: Live CPU gauges */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[8.5px] font-black text-slate-500 uppercase tracking-widest">
            <span>CPU Active Pulse</span>
            <span>{cpuUsage}%</span>
          </div>
          <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${cpuUsage}%` }} />
          </div>
          <span className="text-[8.5px] text-slate-500 block font-sans">SLA Protection : active</span>
        </div>

        {/* Box 4: Central config manager backups */}
        <div className="space-y-1.5">
          <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block font-sans">Appliance Central back</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button 
              onClick={handleDownloadConfigXML}
              className="flex items-center justify-center gap-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[8.5px] font-bold rounded-lg transition-colors border border-blue-500/25 cursor-pointer"
              title="Télécharger la configuration centrale au format XML standard pfSense"
            >
              <Download className="w-3 h-3" /> config.xml
            </button>
            <button 
              onClick={handleDownloadCompose}
              className="flex items-center justify-center gap-1 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-[8.5px] font-bold rounded-lg transition-colors border border-[#ff5500]/25 cursor-pointer"
              title="Télécharger l'orchestrateur Docker-Compose pour déployer la Sovereign Appliance"
            >
              <Download className="w-3 h-3" /> Compose
            </button>
          </div>
        </div>
      </div>

      {/* Visual Header inspired by the sleek Cyber Obsidian branding guidelines */}
      <div className={cn(
        "flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-2 border-b transition-colors",
        isLight ? "border-zinc-200" : "border-zinc-800/60"
      )}>
        <div>
          <div className={cn(
            "px-3 py-1 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-1.5 w-max rounded-full border transition-colors",
            isLight 
              ? "bg-orange-50 text-orange-600 border-orange-200" 
              : "bg-zinc-900 text-[#ff7a00] border border-[#ff5500]/25"
          )}>
            <Users className="w-3.5 h-3.5 animate-pulse" />
            REGISTRE SOUVERAIN DES ABONNÉS INSTITUTIONNELS
          </div>
          <h2 className={cn(
            "text-4xl font-extrabold tracking-tight mt-3 transition-colors",
            isLight ? "text-zinc-900" : "text-white"
          )}>
            Service & Registre Neural
          </h2>
          <p className={cn(
            "text-xs mt-1 font-semibold uppercase tracking-wider transition-colors",
            isLight ? "text-zinc-650" : "text-slate-400"
          )}>
            Vérification de l'abonnement, clés d'accès d'audit cryptographique et gestion multi-nœuds souveraine.
          </p>
        </div>

        {/* Modular switcher with pristine rounded alignment */}
        <div className={cn(
          "flex gap-2 p-1.5 rounded-2xl shadow-2xl items-center shrink-0 border transition-all",
          isLight ? "bg-[#deecff] border-blue-200" : "bg-black border-zinc-800"
        )}>
          <button
            onClick={() => setSubTab('registry')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
              subTab === 'registry' 
                ? "bg-gradient-to-r from-[#ff5500] to-[#ff7a00] text-white shadow-lg shadow-[#ff5500]/20" 
                : isLight 
                  ? "text-zinc-700 hover:text-zinc-950 hover:bg-blue-100"
                  : "text-slate-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Registre ({subscribers.length})
          </button>
          <button
            onClick={() => setSubTab('portal')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
              subTab === 'portal' 
                ? "bg-gradient-to-r from-[#ff5500] to-[#ff7a00] text-white shadow-lg shadow-[#ff5500]/20" 
                : isLight 
                  ? "text-zinc-700 hover:text-zinc-950 hover:bg-blue-100"
                  : "text-slate-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <Lock className="w-3.5 h-3.5" />
            {authenticatedSub ? "🔒 Mon Espace (Actif)" : "🔑 Portail Privé"}
          </button>
        </div>
      </div>

      {subTab === 'registry' ? (
        <React.Fragment>
          {/* Top Panel Actions & Search Bar */}
          <div className={cn(
            "rounded-[1.25rem] p-6 shadow-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border transition-colors",
            isLight ? "bg-[#deecff] border-blue-200" : "bg-black border-zinc-800"
          )}>
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={cn("w-4 h-4 bg-transparent", isLight ? "text-zinc-550" : "text-slate-500")} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une institution, un nom de responsable, un e-mail..."
                className={cn(
                  "w-full pl-10 pr-4 py-3 border rounded-xl text-xs outline-none focus:border-[#ff5500] transition-colors font-sans font-medium",
                  isLight 
                    ? "bg-white border-blue-105 text-zinc-900 placeholder:text-zinc-400 focus:border-sunset-orange" 
                    : "bg-zinc-950 border border-zinc-800 text-slate-100 placeholder:text-slate-550 focus:border-[#ff5500]"
                )}
              />
            </div>
            
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-5 py-3 bg-gradient-to-r from-[#ff5500]/10 to-[#ff7a00]/10 hover:from-[#ff5500]/20 hover:to-[#ff7a00]/20 text-white border border-[#ff5500]/45 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#ff5500]" />
                {showAddForm ? 'Fermer Panel' : 'Ajouter un Nœud'}
              </button>
            </div>
          </div>

          {/* Collapsible pristine additions form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateSubscriberFromRegistry}
                className={cn(
                  "p-6 md:p-8 border rounded-2xl shadow-2xl space-y-6 transition-colors duration-300",
                  isLight ? "bg-[#deecff] border-blue-200 text-zinc-900" : "bg-zinc-950 border border-[#ff5500]/30 text-white"
                )}
              >
                <div>
                   <h3 className={cn(
                     "text-sm font-black uppercase tracking-wider flex items-center gap-1.5",
                     isLight ? "text-zinc-900" : "text-white"
                   )}>
                     <Building className="w-4 h-4 text-[#ff5500]" /> Raccorder un Nouveau Nœud Institutionnel
                   </h3>
                   <p className={cn(
                     "text-[10px] font-bold uppercase tracking-wide mt-1",
                     isLight ? "text-zinc-650" : "text-slate-400"
                   )}>L'accès sera validé numériquement et indexé de manière chiffrée.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Nom de l'Institution</label>
                      <input 
                        type="text" 
                        value={newOrg} 
                        onChange={e => setNewOrg(e.target.value)}
                        placeholder="Ex: Tesla Motors SARL" 
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:border-[#ff5500] focus:outline-none transition-colors",
                          isLight ? "bg-white border-blue-200 text-zinc-905" : "bg-black border-zinc-800 text-white"
                        )}
                        required
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Email de Communication</label>
                      <input 
                        type="email" 
                        value={newEmail} 
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="Ex: cyber@tesla.com" 
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:border-[#ff5500] focus:outline-none transition-colors",
                          isLight ? "bg-white border-blue-200 text-zinc-905" : "bg-black border-zinc-800 text-white"
                        )}
                        required
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Nom du Responsable (Officier d'Audit)</label>
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Ex: John Connor" 
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:border-[#ff5500] focus:outline-none transition-colors",
                          isLight ? "bg-white border-blue-200 text-zinc-905" : "bg-black border-zinc-800 text-white"
                        )}
                        required
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Niveau de validation (Accréditation)</label>
                      <select 
                        value={newPlan} 
                        onChange={e => setNewPlan(e.target.value as any)}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl text-xs font-bold focus:border-[#ff5500] focus:outline-none transition-colors",
                          isLight ? "bg-white border-blue-200 text-zinc-905" : "bg-black border-zinc-800 text-white"
                        )}
                      >
                         <option value="Enterprise" className={isLight ? "bg-white text-zinc-900" : "bg-black text-white"}>Enterprise Node Tier (SLA 2h)</option>
                         <option value="Corporate" className={isLight ? "bg-white text-zinc-900" : "bg-black text-white"}>Corporate Node Tier (SLA 6h)</option>
                         <option value="Expert" className={isLight ? "bg-white text-zinc-900" : "bg-black text-white"}>Expert Node Tier (SLA 12h)</option>
                      </select>
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className={cn(
                      "px-5 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
                      isLight 
                        ? "border-blue-200 hover:bg-blue-50 text-zinc-700 bg-white" 
                        : "border-zinc-800 hover:bg-zinc-900 text-slate-400"
                    )}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-[#ff5500] to-[#ff7a00] hover:scale-[1.02] text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-orange-500/10 transition-all text-[10px]"
                  >
                    Activer l'Accès au Nœud
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Aesthetic High Performance Stats Dashboard Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'MRR Neural', value: `$${(subscribers.length * 1690).toLocaleString()}`, delta: '+12.4% Ce Mois-cy', icon: BarChart3, color: 'text-[#ff6d00]' },
              { label: 'Nœuds Actifs', value: subscribers.filter(s => s.status === 'Active').length, delta: 'Faisceaux Synchronisés', icon: ShieldCheck, color: 'text-emerald-400' },
              { label: 'Intégrité du Réseau', value: '99.8%', delta: '0 Rupture Décelée', icon: Activity, color: 'text-[#0ea5e9]' },
              { label: 'Valeur Global (LTV)', value: `$${(subscribers.length * 44800).toLocaleString()}`, delta: 'Souscription Souveraine', icon: Award, color: 'text-purple-400' },
            ].map((kpi) => (
              <div 
                key={kpi.label} 
                className={cn(
                  "p-6 border rounded-[1.25rem] relative overflow-hidden flex flex-col justify-between min-h-[125px] transition-colors shadow-xl",
                  isLight 
                    ? "bg-[#deecff] border-blue-205 hover:border-blue-300 text-zinc-905" 
                    : "bg-black border-zinc-800 hover:border-zinc-700 text-white"
                )}
              >
                <div className="absolute top-2 right-2 opacity-5">
                  <kpi.icon className="w-14 h-14" />
                </div>
                <div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", isLight ? "text-zinc-650" : "text-slate-400")}>{kpi.label}</span>
                  <div className={cn(
                    "text-3xl font-black italic tracking-tight uppercase leading-none mt-2",
                    isLight ? "text-zinc-900" : "text-white"
                  )}>{kpi.value}</div>
                </div>
                <div className={cn("text-[8.5px] font-bold uppercase tracking-wider mt-1.5", kpi.color)}>
                  {kpi.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Cloud Ledger Table Container */}
          <div className={cn(
            "border rounded-[1.5rem] p-6 shadow-2xl relative transition-all duration-300",
            isLight ? "bg-[#deecff] border-blue-200 text-zinc-900" : "bg-black border-zinc-800 text-slate-300"
          )}>
            
            {/* Table Header Filter controls (Strictly matches functional structure, beautiful UI) */}
            <div className={cn(
              "flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 mb-5 gap-4 transition-colors",
              isLight ? "border-blue-200" : "border-zinc-800/70"
            )}>
              <div>
                <h3 className={cn("text-base font-bold tracking-wide", isLight ? "text-[#000050]" : "text-white")}>Contrôle des Accréditations Actives</h3>
                <p className={cn("text-[11px] mt-1", isLight ? "text-zinc-650" : "text-slate-400")}>Interrogez le statut de validation, le plan d'SLA et l'intégrité de chaque nœud.</p>
              </div>

              {/* Minimal filter badges */}
              <div className={cn(
                "flex gap-1.5 p-1 rounded-xl border shrink-0 transition-colors",
                isLight ? "bg-blue-50 border-blue-105" : "bg-[#09090b] border-zinc-800"
              )}>
                {['All', 'Active', 'Pending', 'Expired'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer",
                      filter === f 
                        ? "bg-[#ff5500] text-white" 
                        : isLight 
                          ? "text-zinc-600 hover:text-zinc-950 bg-white border border-blue-100 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Main responsive table block */}
            <div className="overflow-x-auto w-full no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={cn(
                    "border-b font-sans text-[10px] uppercase font-bold tracking-wider font-mono transition-colors",
                    isLight ? "border-blue-200 text-zinc-700 font-extrabold" : "border-zinc-800/70 text-slate-400"
                  )}>
                    <th className="py-3 px-4" style={isLight ? { width: '0px', height: '0px', padding: 0, overflow: 'hidden' } : undefined}>Node ID</th>
                    <th className="py-3 px-4" style={isLight ? { width: '187px' } : undefined}>Institution</th>
                    <th className="py-3 px-4">Officier Responsable</th>
                    <th className="py-3 px-4">Type de Contrat</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Qualité SLA</th>
                    <th className="py-3 px-4 text-center">Actions d'Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {filteredSubscribers.map((sub) => {
                    const statusConfig = 
                      sub.status === 'Active' 
                        ? { variant: 'green', text: sub.status } 
                        : sub.status === 'Pending'
                          ? { variant: 'orange', text: sub.status }
                          : { variant: 'red', text: sub.status || 'Expired' };

                    const integrityVal = 
                      sub.plan === 'Enterprise' 
                        ? { val: '99.8%', width: '99%', color: '#10b981' } 
                        : sub.plan === 'Corporate' 
                          ? { val: '98.5%', width: '85%', color: '#f59e0b' } 
                          : { val: '94.2%', width: '70%', color: '#3b82f6' };

                    return (
                      <tr key={sub.id} className={cn(
                        "transition-colors border-b",
                        isLight 
                          ? "hover:bg-blue-50/50 border-blue-100/30" 
                          : "hover:bg-zinc-900/40 border-b border-zinc-800/30"
                      )}>
                        {/* Node ID */}
                        <td 
                          className={cn("py-4 px-4 font-mono transition-colors", isLight ? "bg-[#deecff]" : "")}
                          style={isLight ? { width: '118.2083px' } : undefined}
                        >
                          <span className={cn(
                            "font-bold border px-2.5 py-1 rounded-lg text-[10px] transition-all",
                            isLight 
                              ? "bg-[#07f290] text-zinc-900 border-emerald-300 shadow-sm" 
                              : "bg-[#09090b] text-slate-400 border border-zinc-800"
                          )}>
                            {sub.id}
                          </span>
                        </td>

                        {/* Institution metadata */}
                        <td className="py-4 px-4 font-bold">
                          <div className="flex flex-col text-left">
                            <span className={cn(
                              "font-semibold text-sm leading-tight hover:text-[#ff7a00] transition-colors",
                              isLight ? "text-zinc-900" : "text-white"
                            )}>{sub.organization}</span>
                            <span className={cn(
                              "text-[10px] font-mono mt-0.5 font-normal transition-colors",
                              isLight ? "text-zinc-650" : "text-slate-500"
                            )}>{sub.email}</span>
                          </div>
                        </td>

                        {/* Officer Info with a gorgeous rounded icon header */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-full border text-[#ff7a00] font-black text-[9.5px] uppercase flex items-center justify-center shrink-0 transition-colors",
                              isLight ? "bg-white border-blue-200" : "bg-zinc-900 border border-zinc-800"
                            )}>
                              {sub.name.charAt(0)}
                            </div>
                            <span className={cn(
                              "text-xs font-semibold transition-colors",
                              isLight ? "text-[#000050]" : "text-zinc-200"
                            )}>{sub.name}</span>
                          </div>
                        </td>

                        {/* Accréditation plan level */}
                        <td className="py-4 px-4">
                          <RegistryBadge variant={sub.plan === 'Enterprise' ? 'blue' : sub.plan === 'Corporate' ? 'orange' : 'purple'}>
                            {sub.plan}
                          </RegistryBadge>
                        </td>

                        {/* Interactive Dynamic Status indications */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full",
                              sub.status === 'Active' ? 'bg-emerald-500 animate-pulse' : sub.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                            )} />
                            <span className={cn("text-[10.5px] font-black uppercase tracking-wider transition-colors",
                              sub.status === 'Active' 
                                ? isLight ? "text-emerald-700" : "text-emerald-400" 
                                : sub.status === 'Pending' ? "text-amber-500" : "text-red-500"
                            )}>
                              {sub.status}
                            </span>
                          </div>
                        </td>

                        {/* Visual graph metric indicating SLA Integrity directly on table row */}
                        <td className="py-4 px-4">
                          <div className="space-y-1 w-24">
                            <div className="flex justify-between text-[8.5px] font-bold uppercase text-slate-500 font-mono">
                              <span>Intégrité</span>
                              <span>{integrityVal.val}</span>
                            </div>
                            <div className={cn("w-full h-1 rounded-full overflow-hidden transition-colors", isLight ? "bg-blue-105" : "bg-zinc-950")}>
                              <div className="h-full rounded-full" style={{ width: integrityVal.width, backgroundColor: integrityVal.color }} />
                            </div>
                          </div>
                        </td>

                        {/* Actions group preserving full functional capability requested by user */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            
                            <button
                              onClick={() => {
                                setAuthenticatedSub(sub);
                                setSubTab('portal');
                                onNotify(`🖥️ Redirection vers le nœud privé d'accès de: ${sub.organization}`);
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[9.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 border",
                                isLight 
                                  ? "bg-[#99ffd5] text-[#000050] border-emerald-300 hover:bg-[#a6ffe0] shadow-sm" 
                                  : "bg-[#09090b] hover:bg-[#ff5500]/10 text-slate-200 hover:text-white border border-zinc-800 hover:border-[#ff5500]/40"
                              )}
                              title="Se connecter directement"
                            >
                              <LogIn className="w-3 h-3 text-[#ff5500]" /> Sign-In
                            </button>

                            <button 
                              onClick={async () => {
                                if (onUpdateSubscriber) {
                                  let nextStatus: 'Active' | 'Pending' | 'Expired' = 'Active';
                                  if (sub.status === 'Active') nextStatus = 'Pending';
                                  else if (sub.status === 'Pending') nextStatus = 'Expired';
                                  
                                  await onUpdateSubscriber(sub.id, { status: nextStatus });
                                  setHasUnsavedChanges(true);
                                  onNotify(`Statut du nœud ${sub.organization} commuté : ${nextStatus} (Changement non-appliqué).`);
                                }
                              }}
                              className={cn(
                                "p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center border",
                                isLight 
                                  ? "bg-white border-blue-200 text-zinc-700 hover:bg-blue-50" 
                                  : "bg-[#09090b] border border-zinc-800 text-slate-400 hover:text-[#ff5500] hover:border-[#ff5500]/20"
                              )}
                              title="Commuter le statut d'authentification"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>

                            <button 
                              onClick={() => {
                                setDeEnrollTarget(sub);
                                setRevocationCode('');
                                setHasCheckedTerms(false);
                              }}
                              className={cn(
                                "p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center border",
                                isLight 
                                  ? "bg-white border-blue-200 text-red-650 hover:bg-red-50" 
                                  : "bg-[#09090b] border-zinc-800 text-slate-400 hover:text-red-550 hover:border-red-500/25 shadow-lg active:scale-95"
                              )}
                              title="Dé-enrôler / Révoquer l'actif"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-550" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredSubscribers.length === 0 && (
                <div className="py-16 text-center animate-pulse">
                  <Sliders className="w-12 h-12 text-[#ff5500] mx-auto opacity-20 mb-3" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic font-mono">Aucun nœud d'abonné actif correspondant à l'index.</p>
                </div>
              )}
            </div>

          </div>
        </React.Fragment>
      ) : (
        /* PORTAL & SECURE ABONNEMENT SPACE VIEW */
        <div className="space-y-6 animate-in fade-in duration-300">

          {!authenticatedSub ? (
            /* DISCONNECTED COMPONENT (Double panels with beautiful grids) */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              
              {/* Left Panel: Clean, High contrast secure keys entrance */}
              <div 
                className={cn(
                  "p-8 border rounded-[1.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors duration-300",
                  isLight ? "border-blue-200 text-zinc-900" : "bg-black border-zinc-800 text-white"
                )}
                style={isLight ? { backgroundColor: '#bcecfd' } : undefined}
              >
                {/* div:nth-of-type(1) -> Holds the icon & titles */}
                <div style={isLight ? { backgroundColor: '#bcecfd' } : undefined}>
                  {/* div:nth-of-type(1) inside div:nth-of-type(1) -> The Lock Icon Wrapper */}
                  <div className={cn(
                    "p-3 rounded-2xl w-max mb-5 border transition-colors",
                    isLight ? "bg-white border-blue-200 text-orange-600" : "bg-[#111] border-zinc-800 text-[#ff5500]"
                  )}
                  style={isLight ? { backgroundColor: '#bcecfd' } : undefined}
                  >
                    <Lock className="w-7 h-7 animate-pulse" />
                  </div>
                  <h3 className={cn(
                    "text-2xl font-extrabold italic uppercase tracking-tight transition-colors",
                    isLight ? "text-zinc-900" : "text-white"
                  )}>
                    <span style={isLight ? { backgroundColor: '#13b8bb' } : undefined}>Espace Authentifié Militant</span>
                  </h3>
                  <p className={cn(
                    "text-xs mt-2 leading-relaxed font-sans transition-colors",
                    isLight ? "text-zinc-650" : "text-slate-400"
                  )}>
                    S'authentifier via mTLS asynchrone pour accéder instantanément à vos clés d'API, vos rapports d'échéances et déclencher des audits réseau souverains prioritaires.
                  </p>
                </div>

                {/* div:nth-of-type(2) -> Holds the form */}
                <div>
                  <form onSubmit={handleSubscriberLogin} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <label className={cn("text-[9.5px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Adresse Email de Connexion</label>
                      <input 
                        type="email"
                        required
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="Ex: cyber@electroplus.fr"
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl text-xs outline-none focus:border-[#ff5500] transition-all font-sans",
                          isLight ? "bg-white border-blue-200 text-zinc-905 placeholder:text-zinc-400" : "bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-sunset-orange transition-all font-sans"
                        )}
                      />
                    </div>

                    <button
                      type="submit"
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none shadow-lg",
                        isLight 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/15" 
                          : "bg-gradient-to-r from-[#ff5500] to-[#ff7a00] hover:from-[#ff7a00] hover:to-[#ff9500] text-white shadow-orange-500/10 hover:scale-[1.01] active:scale-100"
                      )}
                    >
                      <LogIn className="w-4 h-4" /> s'authentifier au nœud d'accès
                    </button>
                  </form>
                </div>

                {/* div:nth-of-type(3) -> Holds the presets block with exactly three preset card-divs and four sub-buttons */}
                <div className={cn("mt-8 pt-6 border-t", isLight ? "border-blue-105" : "border-zinc-800/60")}>
                  {/* div:nth-of-type(1) -> Optional title wrapper */}
                  <div>
                    <span 
                      className={cn(
                        "text-[9px] font-black tracking-widest uppercase block rounded px-2 py-1 w-max",
                        isLight ? "text-[#000050]" : "text-[#ff5500]"
                      )}
                      style={isLight ? { backgroundColor: '#78da57' } : undefined}
                    >
                      Tester rapidement avec un profil actif :
                    </span>
                  </div>

                  {/* div:nth-of-type(2) -> Container with individual item divs (Selector 3, 4, 6) */}
                  <div className="flex flex-col gap-2 mt-3">
                    {subscribers.slice(0, 3).map((sub, sIdx) => (
                      <div
                        key={sub.id}
                        onClick={() => setAuthEmail(sub.email)}
                        className={cn(
                          "p-2 rounded-xl transition-all border cursor-pointer flex justify-between items-center bg-white border-zinc-200",
                          isLight ? "hover:bg-blue-50" : "hover:bg-zinc-900 border-zinc-800"
                        )}
                        style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                      >
                         {/* div:nth-of-type(1) -> Organization info */}
                         <div>
                           <span className={cn("text-[9.5px] font-bold", isLight ? "text-zinc-800" : "text-white")}>
                             🖥️ {sub.organization}
                           </span>
                         </div>
                         {/* div:nth-of-type(2) -> Badge element (Selector 7, 8, 9) */}
                         <div>
                           <span 
                             className="px-1.5 py-0.5 rounded text-[8.5px] font-mono text-zinc-500"
                             style={isLight ? { backgroundColor: '#929e9f', color: '#ffffff' } : undefined}
                           >
                             {sub.email}
                           </span>
                         </div>
                      </div>
                    ))}
                  </div>

                  {/* div:nth-of-type(3) -> Action sub-buttons for Quick Toggles (Selector 14, 15, 16) */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                     {[1, 2, 3, 4].map((num) => {
                       const isSel14 = num === 2;
                       const isSel16 = num === 3;
                       const isSel15 = num === 4;
                       const isTargeted = isSel14 || isSel15 || isSel16;
                       return (
                         <button
                           key={num}
                           type="button"
                           className="p-1 px-2.5 text-[8px] font-bold uppercase transition-all bg-zinc-105 hover:bg-zinc-200 text-zinc-700 border border-zinc-250 cursor-pointer"
                           style={isLight && isTargeted ? { backgroundColor: '#13b8bb', color: '#ffffff' } : undefined}
                         >
                           Preset {num}
                         </button>
                       );
                     })}
                  </div>
                </div>

              </div>
              
              {/* Right Panel: Clean, modern direct self-registrations */}
              <div 
                className={cn(
                  "p-8 border rounded-[1.5rem] shadow-2xl relative overflow-hidden transition-colors duration-300",
                  isLight ? "border-emerald-200 text-zinc-900" : "bg-black border-[#ff5500]/25 text-slate-350"
                )}
                style={isLight ? { backgroundColor: '#bcecfd' } : undefined}
              >
                {/* div:nth-of-type(1) -> Zap Icon & Titles wrapper */}
                <div style={isLight ? { backgroundColor: '#bcecfd' } : undefined}>
                  {/* div:nth-of-type(1) inside div:nth-of-type(1) -> Zap Icon Wrapper (Selector 2) */}
                  <div 
                    className={cn(
                      "p-3 rounded-2xl w-max mb-5 border transition-colors",
                      isLight ? "bg-white border-blue-200 text-orange-600" : "bg-[#111] border-zinc-855 text-[#ff5500]"
                    )}
                    style={isLight ? { backgroundColor: '#bcecfd' } : undefined}
                  >
                    <Zap className="w-7 h-7 text-[#ff5500] animate-bounce" />
                  </div>
                  <h3 className={cn(
                    "text-2xl font-extrabold italic uppercase tracking-tight transition-colors",
                    isLight ? "text-zinc-950" : "text-white"
                  )}>Raccordez-vous Directement</h3>
                  <p className={cn(
                    "text-xs mt-1 leading-relaxed transition-colors",
                    isLight ? "text-zinc-650" : "text-slate-400"
                  )}>
                    Pas encore de nœud dédié ? Enregistrez immédiatement votre organisation dans notre Ledger Cloud pour lancer votre diagnostic réglementaire.
                  </p>
                </div>

                <form onSubmit={handleDirectSubscribe} className="space-y-4 mt-6">
                  {/* div:nth-of-type(1) -> Custom accreditation options (Selector 17, 18) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-white/40 border border-zinc-200/50">
                    <span className="text-[9px] font-extrabold uppercase tracking-wide text-zinc-600 block">Choisissez l'Accréditation active</span>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((pId) => {
                        const isSel17 = pId === 2;
                        const isSel18 = pId === 3;
                        const isTargeted = isSel17 || isSel18;
                        return (
                          <button
                            key={pId}
                            type="button"
                            className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[8.5px] font-bold rounded-lg transition-all border border-zinc-250 cursor-pointer"
                            style={isLight && isTargeted ? { backgroundColor: '#13b8bb', color: '#ffffff' } : undefined}
                          >
                            Tier_0{pId}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* div:nth-of-type(2) -> Institution */}
                  <div className="space-y-1.5">
                    <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Institution</label>
                    <input 
                      type="text"
                      required
                      value={newOrg}
                      onChange={e => setNewOrg(e.target.value)}
                      placeholder="Ex: SpaceX Operations"
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:border-[#ff5500] focus:outline-none transition-colors",
                        isLight ? "bg-white border-blue-200 text-zinc-905 placeholder:text-zinc-405" : "bg-zinc-950 border border-zinc-800 text-xs text-slate-205 outline-none focus:border-sunset-orange transition-colors"
                      )}
                    />
                  </div>

                  {/* div:nth-of-type(3) -> Responsable Principal */}
                  <div className="space-y-1.5">
                    <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-750" : "text-slate-400")}>Responsable Principal</label>
                    <input 
                      type="text"
                      required
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Ex: Elon Musk"
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:border-[#ff5500] focus:outline-none transition-colors",
                        isLight ? "bg-white border-blue-200 text-zinc-905 placeholder:text-zinc-405" : "bg-zinc-950 border border-zinc-800 text-xs text-slate-205 outline-none focus:border-sunset-orange transition-colors"
                      )}
                    />
                  </div>

                  {/* div:nth-of-type(4) -> E-mail Officiel d'Institution */}
                  <div className="space-y-1.5">
                    <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-755" : "text-slate-400")}>E-mail Officiel d'Institution</label>
                    <input 
                      type="email"
                      required
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="Ex: ops@spacex.com"
                      className={cn(
                        "w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:border-[#ff5500] focus:outline-none transition-colors animate-none",
                        isLight ? "bg-white border-blue-200 text-zinc-905 placeholder:text-zinc-405" : "bg-zinc-950 border border-zinc-800 text-xs text-slate-205 outline-none focus:border-sunset-orange transition-colors animate-none"
                      )}
                    />
                  </div>

                  {/* div:nth-of-type(5) -> Formula details section (Selector 5 background color: #ffffff!) */}
                  <div 
                    className="space-y-1.5 p-3.5 rounded-xl border border-blue-200 bg-white"
                    style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                  >
                    <label className={cn("text-[9px] font-black uppercase tracking-wider block", isLight ? "text-zinc-755" : "text-slate-400")}>Formule d'accréditation souhaitée</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: 'Expert', desc: 'SLA: 12 Heures' },
                        { label: 'Corporate', desc: 'SLA: 6 Heures' },
                        { label: 'Enterprise', desc: 'SLA: 2 Heures' }
                      ].map((p) => {
                        const isExpertButton = p.label === 'Expert';
                        return (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setNewPlan(p.label as any)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer",
                              newPlan === p.label 
                                ? isLight 
                                  ? isExpertButton
                                    ? "text-[#000050] border-emerald-400 font-extrabold shadow-md"
                                    : "bg-blue-500 text-white border-blue-600 shadow-md"
                                  : "bg-zinc-950 text-white border-[#ff5500] shadow-[#ff5500]/10 shadow-lg" 
                                : isLight 
                                  ? "bg-white border-blue-200 text-zinc-700 hover:bg-blue-50" 
                                  : "bg-black border-zinc-800 text-slate-400 hover:text-white"
                            )}
                            style={isLight && isExpertButton ? { backgroundColor: '#11f140' } : undefined}
                          >
                            <span className="text-xs font-black tracking-wider block">{p.label}</span>
                            <span className="text-[8.5px] opacity-60 font-semibold block mt-0.5 whitespace-nowrap">{p.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* button:nth-of-type(1) -> Submit registration button (Selector 21 background #fcb244!) */}
                  <button
                    type="submit"
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-100 transition-all cursor-pointer mt-2",
                      isLight 
                        ? "text-white" 
                        : "bg-gradient-to-r from-[#ff5500]/20 to-[#ff7a00]/20 hover:from-[#ff5500]/30 hover:to-[#ff7a00]/30 text-white border border-[#ff5500]/45"
                    )}
                    style={isLight ? { backgroundColor: '#fcb244' } : undefined}
                  >
                    🚀 Enregistrer l'organisation & démarrer
                  </button>
                </form>

              </div>

            </div>
          ) : (
            /* SECURE PRIVATE DASHBOARD ONCE SOUVERAIN PORTAL IS CONNECTED */
            <div className={cn("space-y-6", isLight ? "text-zinc-900" : "text-slate-300")}>
              
              {/* Dynamic Header Section */}
              <div 
                className={cn(
                  "p-6 md:p-8 border rounded-[1.5rem] shadow-2xl relative overflow-hidden flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6",
                  isLight ? "border-blue-200 text-zinc-900" : "bg-black border-zinc-800 text-slate-300"
                )}
                style={isLight ? { backgroundColor: '#ffffff' } : undefined}
              >
                <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(circle_at_top_right,rgba(255,77,0,0.03),transparent_60%)] pointer-events-none" />
                
                <div className="space-y-2.5 flex-1 text-left">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      AUTHENTIFIÉ PAR CONTRÔLEUR CENTRAL
                    </span>
                    <span className={cn("text-[10px] font-mono font-bold block", isLight ? "text-zinc-700" : "text-slate-550")}>{authenticatedSub.id}</span>
                  </div>
                  
                  <h3 className={cn("text-3xl font-extrabold italic uppercase leading-none", isLight ? "text-zinc-950" : "text-white")}>
                     Espace Privé : <span className={isLight ? "text-orange-750" : "text-[#ff7a00]"}>{authenticatedSub.organization}</span>
                  </h3>
                  <p className={cn("text-xs font-medium", isLight ? "text-zinc-800" : "text-slate-400")}>
                     Utilisateur : <strong className={isLight ? "text-zinc-900" : "text-white"}>{authenticatedSub.name}</strong> • Plan d'audit contractualisé : <strong className="text-emerald-500 font-extrabold">{authenticatedSub.plan} Tier</strong>
                  </p>
                </div>

                <div className="shrink-0 flex gap-3">
                  <button
                    type="button"
                    onClick={handleSubscriberLogout}
                    className={cn(
                      "px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2",
                      isLight 
                        ? "text-zinc-800 hover:text-red-600 hover:bg-zinc-100 border border-zinc-300/80" 
                        : "bg-zinc-950 hover:bg-red-500/10 hover:text-red-400 text-slate-350 border border-zinc-850 hover:border-red-500/20"
                    )}
                    style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                  >
                    <LogOut className="w-4 h-4" /> se déconnecter
                  </button>
                </div>
              </div>

              {/* Advanced Subscriber Panel grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Private API metrics & key rotate keys */}
                <div 
                  className={cn(
                    "lg:col-span-4 p-6 border rounded-[1.5rem] shadow-xl flex flex-col justify-between space-y-6 transition-all",
                    isLight ? "border-blue-200 text-zinc-900" : "bg-black border-zinc-800 text-white"
                  )}
                  style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                >
                  <div>
                    <div className={cn("flex gap-2.5 items-center border-b pb-3", isLight ? "text-zinc-900 border-zinc-300/60" : "text-white border-zinc-800/60")}>
                      <Key className="w-5 h-5 text-[#ff5500]" />
                      <h4 className="text-sm font-bold uppercase tracking-wider italic">Jeton d'Intégration CI/CD</h4>
                    </div>

                    <p className={cn("text-[11.5px] mt-4 leading-relaxed font-sans", isLight ? "text-zinc-700 font-medium" : "text-slate-400")}>
                      Utilisez cette clé d'API asynchrone pour connecter vos pipelines de déploiement continu à vos analyses réseau internes.
                    </p>

                    <div 
                      className={cn(
                        "p-4 rounded-xl border mt-4 space-y-1 text-left",
                        isLight ? "border-blue-105" : "bg-[#09090b] border-zinc-850"
                      )}
                      style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                    >
                      <span className={cn("text-[8px] font-bold uppercase tracking-wider block font-mono", isLight ? "text-zinc-500" : "text-slate-500")}>CLEF EN LIGNE ACTIVE (ROTABLE)</span>
                      <div className={cn("font-mono text-xs tracking-tight break-all", isLight ? "text-zinc-800 font-bold" : "text-white")}>{apiToken}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRotateKey}
                    disabled={isRotating}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50",
                      isLight 
                        ? "text-white border-none" 
                        : "bg-[#09090b] hover:bg-zinc-900 border border-zinc-800 text-slate-300 hover:text-white"
                    )}
                    style={isLight ? { backgroundColor: '#e14c01', paddingLeft: '9px' } : undefined}
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isRotating ? "animate-spin" : "")} />
                    {isRotating ? "Rotation sécurisée..." : "Régénérer et Révoquer l'ancien jeton"}
                  </button>
                </div>

                {/* Middle: Active audit trigger request and simulated telemetry progress bar */}
                <div 
                  className={cn(
                    "lg:col-span-4 p-6 border rounded-[1.5rem] shadow-xl flex flex-col justify-between space-y-6 transition-all",
                    isLight ? "border-blue-200 text-zinc-900" : "bg-black border-zinc-800 text-white"
                  )}
                  style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                >
                  <div>
                    <div className={cn("flex gap-2.5 items-center border-b pb-3", isLight ? "text-zinc-900 border-zinc-300/60" : "text-white border-zinc-800/60")}>
                      <ShieldCheck className="w-5 h-5 text-emerald-500 animate-pulse" />
                      <h4 className="text-sm font-bold uppercase tracking-wider italic">Contrôle SLA Réseau & Urgences</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div 
                        className={cn(
                          "p-3 rounded-xl border text-left",
                          isLight ? "border-blue-105" : "bg-[#09090b] border-zinc-850"
                        )}
                        style={isLight ? { backgroundColor: '#f7f7ff' } : undefined}
                      >
                        <span className={cn("text-[9px] font-bold uppercase block", isLight ? "text-slate-600" : "text-slate-500")}>Délai Garantie SLA</span>
                        <span className={cn("text-sm font-black italic block mt-1", isLight ? "text-zinc-900" : "text-zinc-100")}>
                          {authenticatedSub.plan === 'Enterprise' ? "2 Heures" : authenticatedSub.plan === 'Corporate' ? "6 Heures" : "12 Heures"}
                        </span>
                      </div>
                      <div 
                        className={cn(
                          "p-3 rounded-xl border text-left",
                          isLight ? "border-blue-105" : "bg-[#09090b] border-zinc-850"
                        )}
                        style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                      >
                        <span className={cn("text-[9px] font-bold uppercase block", isLight ? "text-slate-600" : "text-slate-500")}>Statut d'Accès</span>
                        <span className="text-sm font-black italic text-emerald-500 block mt-1">Sain & Actif</span>
                      </div>
                    </div>

                    <p className={cn("text-[11.5px] mt-4 leading-relaxed font-sans", isLight ? "text-zinc-700 font-medium" : "text-slate-400")}>
                      En cas de détection suspecte d'anomalies sur vos clusters ou de faux positifs, déclenchez une analyse cryptographique immédiate.
                    </p>

                    {/* Progress bar scanning mechanism */}
                    <AnimatePresence>
                      {isAuditing && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="mt-4 space-y-1 bg-[#09090b] border border-zinc-850 p-3 rounded-xl text-left"
                        >
                          <div className="flex justify-between text-[8px] font-bold font-mono uppercase text-[#ff5500]">
                            <span>analyse de chiffrement...</span>
                            <span>{auditProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-[#ff5500] transition-all duration-300" style={{ width: `${auditProgress}%` }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {emergencyCounter > 0 && !isAuditing && (
                      <div className="mt-4 p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10.5px] font-bold rounded-xl flex items-center gap-1.5 font-sans">
                        <AlertTriangle className="w-4 h-4 animate-bounce" /> Demande d'audit transmise avec succès ({emergencyCounter} fois)
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerInstantAudit}
                    disabled={isAuditing}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {isAuditing ? "Audit cryptographique..." : "Déclencher diagnostic d'urgence"}
                  </button>
                </div>

                {/* Right: Simulated terminal system logs securely aligned */}
                <div 
                  className={cn(
                    "lg:col-span-4 p-6 border rounded-[1.5rem] shadow-xl flex flex-col justify-between space-y-4 transition-all",
                    isLight ? "border-blue-200 text-zinc-900" : "bg-black border-zinc-800 text-white"
                  )}
                  style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                >
                  <div>
                    <div className={cn("flex gap-2.5 items-center border-b pb-3 font-sans", isLight ? "text-zinc-900 border-zinc-300/60" : "text-white border-zinc-800/60")}>
                      <Terminal className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-sm font-bold uppercase tracking-wider italic">Journal de Sécurité Privé</h4>
                    </div>

                    {/* Terminal window - beautiful styling with standard scrollbars */}
                    <div 
                      className={cn(
                        "p-4 rounded-xl font-mono text-[10px] leading-relaxed h-[165px] overflow-y-auto space-y-2.5 border mt-4 text-left no-scrollbar",
                        isLight ? "border-blue-105 text-zinc-800" : "bg-[#09090b] text-slate-300 border-zinc-855"
                      )}
                      style={isLight ? { backgroundColor: '#ffffff' } : undefined}
                    >
                      {auditLogs.map((log, index) => (
                        <div key={index} className="flex gap-1.5 text-left">
                          <span className="text-[#ff5500] select-none font-bold">▸</span>
                          <span className={cn("break-words leading-normal font-sans", isLight ? "text-zinc-800 font-medium" : "text-slate-200")}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={cn("text-[9px] font-mono italic mt-1 leading-tight text-left", isLight ? "text-zinc-650" : "text-slate-500")}>
                    Synchronisation cryptographique du Ledger central réussie.
                  </div>
                </div>

              </div>
              
            </div>
          )}

        </div>
      )}

    </div>
  );
};
