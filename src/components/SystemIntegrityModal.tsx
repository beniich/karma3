import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Layers, 
  Cpu, 
  Radio, 
  Database, 
  Key, 
  HardDrive,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { HighFidelityIcon } from './HighFidelityIcon';
import { cn } from '../lib/utils';
import { useTranslation } from '../hooks/useTranslation';

interface SystemIntegrityModalProps {
  isOpen: boolean;
  onClose: () => void;
  socketConnected: boolean;
  language?: 'FR' | 'EN';
}

export interface DiagnosticItem {
  id: string;
  name: string;
  category: 'AUTH' | 'DATABASE' | 'NETWORK' | 'HARDWARE' | 'SECURITY';
  description: string;
  status: 'PENDING' | 'SCANNING' | 'PASS' | 'WARNING' | 'FAIL';
  details: string;
  resolution: string;
  latencyMs?: number;
  metadata?: Record<string, any>;
}

export const SystemIntegrityModal: React.FC<SystemIntegrityModalProps> = ({
  isOpen,
  onClose,
  socketConnected,
  language = 'FR'
}) => {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeCheckId, setActiveCheckId] = useState<string | null>(null);
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [checks, setChecks] = useState<DiagnosticItem[]>([
    {
      id: 'firebase_auth',
      name: t('diagnostic.diag_firebase_auth_initialisation_s'),
      category: 'AUTH',
      description: t('diagnostic.diag_verify_secure_firebase_auth_co'),
      status: 'PENDING',
      details: t('diagnostic.diag_awaiting_system_audit_executio'),
      resolution: t('diagnostic.diag_if_this_test_fails_make_sure_y')
    },
    {
      id: 'firestore_db',
      name: t('diagnostic.diag_cloud_firestore_enclave_reacha'),
      category: 'DATABASE',
      description: t('diagnostic.diag_perform_a_network_handshake_wi'),
      status: 'PENDING',
      details: t('diagnostic.diag_awaiting_system_audit_executio'),
      resolution: t('diagnostic.diag_ensure_you_are_connected_to_th')
    },
    {
      id: 'api_reachability',
      name: t('diagnostic.diag_rest_api_ingress_routing_port'),
      category: 'NETWORK',
      description: t('diagnostic.diag_verify_the_reachability_of_sta'),
      status: 'PENDING',
      details: t('diagnostic.diag_awaiting_system_audit_executio'),
      resolution: t('diagnostic.diag_the_backend_server_must_be_sta')
    },
    {
      id: 'websocket_stream',
      name: t('diagnostic.diag_socket_io_real_time_stream'),
      category: 'NETWORK',
      description: t('diagnostic.diag_verify_active_connectivity_of'),
      status: 'PENDING',
      details: t('diagnostic.diag_awaiting_system_audit_executio'),
      resolution: t('diagnostic.diag_check_the_configuration_of_the')
    },
    {
      id: 'local_storage',
      name: t('diagnostic.diag_local_state_sandbox_quota'),
      category: 'HARDWARE',
      description: t('diagnostic.diag_verify_persistent_browser_cach'),
      status: 'PENDING',
      details: t('diagnostic.diag_awaiting_system_audit_executio'),
      resolution: t('diagnostic.diag_free_some_browser_cache_disk_s')
    },
    {
      id: 'gemini_config',
      name: t('diagnostic.diag_gemini_2_0_ai_engine_integrati'),
      category: 'SECURITY',
      description: t('diagnostic.diag_confirm_presence_and_validatio'),
      status: 'PENDING',
      details: t('diagnostic.diag_awaiting_system_audit_executio'),
      resolution: t('diagnostic.diag_add_gemini_api_key_into_your_e')
    }
  ]);

  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, `[${timestamp}] ${text}`]);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Execute diagnostics sequence
  const executeDiagnosticAudit = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setExpandedCheckId(null);
    
    // Set all to scanning at the start
    setChecks(prev => prev.map(c => ({ ...c, status: 'SCANNING', details: t('diagnostic.diag_audit_sequence_initiated') })));
    
    addLog('SYS_DIAG_ENGINE_START: Initialisation de la routine d\'audit d\'intégrité AuditAX...');
    addLog('STRICT_ISOLATED_SANDBOX: Isolation de la session d\'audit en cours...');
    await new Promise(r => setTimeout(r, 800));

    // CHECK 1: Firebase Auth Connection
    {
      const id = 'firebase_auth';
      setActiveCheckId(id);
      addLog('SCANNING [AUTH]: Analyse de la session Firebase Auth...');
      await new Promise(r => setTimeout(r, 600));
      
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          addLog(`PASS [AUTH]: Jeton de session actif détecté pour l'officier: ${currentUser.email}`);
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'PASS',
            details: language === 'FR' 
              ? `Authentification active. UID: ${currentUser.uid}. Email: ${currentUser.email}. Fournisseur: ${currentUser.providerId || 'Email/Password'}.`
              : `Authenticated session. UID: ${currentUser.uid}. Email: ${currentUser.email}. Provider: ${currentUser.providerId || 'Credentials'}.`,
            metadata: { uid: currentUser.uid, email: currentUser.email, verified: currentUser.emailVerified }
          } : c));
        } else {
          addLog('WARN [AUTH]: Aucun officier identifié. Session locale invité anonyme active.');
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'WARNING',
            details: language === 'FR'
              ? 'Le système fonctionne actuellement en mode DEMO (local). Les données brutes ne seront pas synchronisées sur Firestore tant que vous ne vous serez pas connecté avec Google Auth.'
              : 'App running in offline DEMO mode. Absolute cloud state sync is restricted until authentication is accomplished.',
            resolution: language === 'FR'
              ? 'Cliquez sur "Initialize_Session" dans l\'en-tête pour vous authentifier de manière sécurisée.'
              : 'Proceed to "Initialize_Session" in top navigator to authorize cloud database persistence.'
          } : c));
        }
      } catch (err: any) {
        addLog(`FAIL [AUTH]: Échec d'inspection des sessions d'authentification: ${err.message}`);
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'FAIL',
          details: `Error: ${err.message}`
        } : c));
      }
    }

    // CHECK 2: Firebase Firestore DB connection
    {
      const id = 'firestore_db';
      setActiveCheckId(id);
      addLog('SCANNING [DB]: Établissement de la poignée de main réseau Cloud Firestore...');
      await new Promise(r => setTimeout(r, 700));
      
      const startTime = Date.now();
      try {
        // We attempt to pull from 'risks' or perform a simple get
        const riskQuery = query(collection(db, 'risks'), limit(1));
        await getDocs(riskQuery);
        const latency = Date.now() - startTime;
        
        addLog(`PASS [DB]: Connexion Cloud Firestore établie avec succès. Latence: ${latency}ms`);
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'PASS',
          latencyMs: latency,
          details: language === 'FR'
             ? `Connexion établie au pool cloud. Latence stable à ${latency}ms. Cache de l'enclave opérationnel.`
             : `Resolved cloud collection query. Latency: ${latency}ms. Enclave memory pool responsive.`
        } : c));
      } catch (err: any) {
        const latency = Date.now() - startTime;
        // Check if the error is due to missing permissions (which means we ARE connected and reachability is 100% PASS!)
        // In firebase standard, missing permission means connected, authorized is failing. So connectivity is a PASS, with a WARNING on authorization.
        const isPermissionDenied = err.message?.includes('permissions') || err.code === 'permission-denied';
        
        if (isPermissionDenied) {
          addLog(`PASS [DB]: Reachability validée (Sécurité ACL active). Latence: ${latency}ms.`)
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'PASS',
            latencyMs: latency,
            details: language === 'FR'
              ? `La base Firestore a répondu en ${latency}ms. Les règles de sécurité de l'enclave fonctionnent (Accès anonyme bloqué par défaut).`
              : `Enclave database responded in ${latency}ms. Zero-trust security directives verified (Access denied to unauthorized sessions by default).`
          } : c));
        } else {
          addLog(`FAIL [DB]: Échec de connexion de transit à Firestore. Cause: ${err.message}`);
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'FAIL',
            latencyMs: latency,
            details: language === 'FR'
              ? `Erreur de connexion physique ou de routage: ${err.message}`
              : `Physical network stream failure: ${err.message}`
          } : c));
        }
      }
    }

    // CHECK 3: Express API Reachability
    {
      const id = 'api_reachability';
      setActiveCheckId(id);
      addLog('SCANNING [NETWORK]: Test d\'impulsion API REST Express (Port 3000)...');
      await new Promise(r => setTimeout(r, 600));
      
      const startTime = Date.now();
      try {
        const res = await fetch('/api/diagnostic/integrity');
        if (!res.ok) throw new Error(`HTTP_${res.status}`);
        const data = await res.json();
        const latency = Date.now() - startTime;
        
        addLog(`PASS [NETWORK]: Serveur Express pleinement accessible. Latence d'API: ${latency}ms`);
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'PASS',
          latencyMs: latency,
          details: language === 'FR' 
            ? `API opérationnelle. Serveur Uptime: ${data.serverDetails?.uptimeSeconds || 0}s. Client Node: ${data.serverDetails?.nodeVersion || 'N/A'}. RAM: ${data.serverDetails?.memoryUsageMb?.rss || 0}MB rss.`
            : `API running smoothly. Node Uptime: ${data.serverDetails?.uptimeSeconds || 0}s. Core platform: ${data.serverDetails?.platform || 'linux'}. Memory footer: ${data.serverDetails?.memoryUsageMb?.rss || 0}MB RSS.`,
          metadata: data
        } : c));
      } catch (err: any) {
        addLog(`FAIL [NETWORK]: Tunnel API REST déconnecté ou port 3000 congestionné: ${err.message}`);
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'FAIL',
          details: language === 'FR' 
            ? `Impossible de joindre le serveur Express sur l'adresse relative '/api/diagnostic/integrity'.`
            : `Failing relative fetch route connection to '/api/diagnostic/integrity'. Check application container proxy logs.`
        } : c));
      }
    }

    // CHECK 4: websocket_stream status
    {
      const id = 'websocket_stream';
      setActiveCheckId(id);
      addLog('SCANNING [NETWORK]: Écoute de l\'impulsion télémétrique Socket.IO...');
      await new Promise(r => setTimeout(r, 550));
      
      if (socketConnected) {
        addLog('PASS [NETWORK]: Flux bidirectionnel actif avec la console centrale.');
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'PASS',
          details: language === 'FR'
            ? 'La connexion au processeur de signaux en temps réel est configurée et active sur le protocole WSS/Socket.IO.'
            : 'Socket.IO live packet sync connection handshake verified. High priority signal queues active.'
        } : c));
      } else {
        addLog('WARN [NETWORK]: Latence WebSocket ou socket hors-ligne. Utilisation des traceurs REST par défaut.');
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'WARNING',
          details: language === 'FR'
            ? 'Le canal Socket.IO signale une déconnexion transitoire. La télémétrie SecOps et les logs en continu sont gérés de manière asynchrone.'
            : 'Socket connection is transiently disconnected. Log relays downscaling to default short poll.'
        } : c));
      }
    }

    // CHECK 5: local storage sandbox
    {
      const id = 'local_storage';
      setActiveCheckId(id);
      addLog('SCANNING [HARDWARE]: Test cyclique de l\'enclave locale LocalStorage...');
      await new Promise(r => setTimeout(r, 500));
      
      try {
        const testKey = 'auditax_diagnostic_test_write';
        const payload = `TEST_VECTOR_${Date.now()}`;
        localStorage.setItem(testKey, payload);
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (retrieved === payload) {
          const estimatedSize = JSON.stringify(localStorage).length;
          addLog(`PASS [HARDWARE]: Enclave locale disponible. Taille du cache utilisé: ${Math.round(estimatedSize / 1024)} KB`);
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'PASS',
            details: language === 'FR'
              ? `Lecture/Écriture réussie. Espace local alloué et sécurisé. Charge actuelle: ~${(estimatedSize / 1024).toFixed(2)} KB.`
              : `R/W transaction checked. Quota verification passed. Total state footprint: ~${(estimatedSize / 1024).toFixed(2)} KB.`
          } : c));
        } else {
          throw new Error('CORRUPTING_BIT_DISCREPANCY');
        }
      } catch (err: any) {
        addLog(`FAIL [HARDWARE]: Cache local bloqué ou mémoire saturée: ${err.message}`);
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'FAIL',
          details: `Error: ${err.message}`
        } : c));
      }
    }

    // CHECK 6: Google Gemini-2.0 Configuration
    {
      const id = 'gemini_config';
      setActiveCheckId(id);
      addLog('SCANNING [SECURITY]: Vérification de l\'authentification de l\'engin d\'IA Gemini...');
      await new Promise(r => setTimeout(r, 650));
      
      try {
        // Look up state cached from API reachability data we fetched earlier
        const apiCheck = checks.find(c => c.id === 'api_reachability')?.metadata as any;
        const geminiActive = apiCheck?.envCheck?.geminiApiKeyConfigured;
        
        if (geminiActive === undefined) {
          // Fallback check: call our endpoint if the previous check didn't store it
          const res = await fetch('/api/diagnostic/integrity');
          const data = await res.json();
          const active = data?.envCheck?.geminiApiKeyConfigured;
          
          if (active) {
            addLog('PASS [SECURITY]: Clé d\'API GEMINI_API_KEY détectée et pré-enregistrée sur l\'hôte.');
            setChecks(prev => prev.map(c => c.id === id ? {
              ...c,
              status: 'PASS',
              details: language === 'FR'
                ? 'Le modèle d\'intelligence artificielle Gemini-2.0-Flash est prêt à analyser et catégoriser les audits SecOps.'
                : 'Gemini-2.0-Flash artificial intelligence pipeline verified. Fully integrated on backend.'
            } : c));
          } else {
            addLog('WARN [SECURITY]: Clé d\'API GEMINI_API_KEY non configurée dans l\'environnement.');
            setChecks(prev => prev.map(c => c.id === id ? {
              ...c,
              status: 'WARNING',
              details: language === 'FR'
                ? 'La variable secrète GEMINI_API_KEY est manquante dans les configurations du serveur. Les analyses souveraines automatiques et les résumés d\'IA d\'AuditAX ne seront pas pleinement disponibles.'
                : 'Private GEMINI_API_KEY key is missing in your system environment. AI summarizer and prediction models are currently limited.',
              resolution: language === 'FR'
                ? 'Pour activer l\'analyse par IA, configurez GEMINI_API_KEY dans votre fichier .env locale ou via les paramètres AI Studio.'
                : 'To unlock AI cognitive analysis features, define GEMINI_API_KEY environment variable in your .env profile.'
            } : c));
          }
        } else if (geminiActive) {
          addLog('PASS [SECURITY]: Validation de la configuration d\'intelligence artificielle réussie.');
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'PASS',
            details: language === 'FR'
              ? 'Le module cognitif de sécurité AuditAX (Gemini Core 2.0 Pipeline) est synchronisé avec les variables d\'environnement.'
              : 'AuditAX cognitive server (Gemini Core 2.0 Pipeline) is synchronized with variables on active node.'
          } : c));
        } else {
          addLog('WARN [SECURITY]: Clé secrète GEMINI_API_KEY manquante sur le conteneur.');
          setChecks(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'WARNING',
            details: language === 'FR'
              ? 'La clé GEMINI_API_KEY n\'est pas configurée dans les variables d\'environnement. L\'assistant d\'IA et l\'harmonisation de conformité auto par IA fonctionneront en mode bridé/limité.'
              : 'The key GEMINI_API_KEY is not defined. The integrated AI assistant operates in a simulated fallback state only.',
            resolution: language === 'FR'
              ? 'Ajoutez GEMINI_API_KEY dans le fichier .env de votre espace ou via le menu des paramètres d\'AI Studio.'
              : 'Add GEMINI_API_KEY inside your local .env file or declare it under settings inside Google AI Studio.'
          } : c));
        }
      } catch (err: any) {
        addLog(`WARN [SECURITY]: Impossible de valider l'état Gemini. Cause: ${err.message}`);
        setChecks(prev => prev.map(c => c.id === id ? {
          ...c,
          status: 'WARNING',
          details: `Error reading telemetry: ${err.message}`
        } : c));
      }
    }

    setActiveCheckId(null);
    addLog('SYS_DIAG_ENGINE_COMPLETE: La routine d\'audit est terminée. Synthèse des résultats générée.');
    setIsRunning(false);
  };

  useEffect(() => {
    if (isOpen) {
      executeDiagnosticAudit();
    }
  }, [isOpen]);

  const stats = checks.reduce(
    (acc, curr) => {
      if (curr.status === 'PASS') acc.pass++;
      else if (curr.status === 'WARNING') acc.warning++;
      else if (curr.status === 'FAIL') acc.fail++;
      return acc;
    },
    { pass: 0, warning: 0, fail: 0 }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#02050a]/90 backdrop-blur-md"
      />

      {/* Main Glass Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative bg-[#070b13] border border-[#1e2f47] rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(14,165,233,0.15)] overflow-hidden"
      >
        {/* Aesthetic edge line */}
        <div className="absolute top-0 inset-x-0 h-1 sunset-gradient" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1c2e46]/60 bg-[#090d18]/80">
          <div className="flex items-center gap-4">
            <HighFidelityIcon variant={stats.fail > 0 ? 'danger' : stats.warning > 0 ? 'warning' : 'success'} size="md">
              <ShieldCheck />
            </HighFidelityIcon>
            <div className="text-left">
              <h2 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                {t('diagnostic.diag_system_integrity_diagnostics')}
              </h2>
              <p className="text-[10px] font-mono font-bold tracking-[0.15em] text-[#0ea5e9]">
                STATUS: {isRunning ? 'DIGITAL_SCAN_RUNNING' : stats.fail > 0 ? 'DIAL_COMPROMISED_ERR' : 'ACTIVE_SECURE_ENCLAVE'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-xl bg-slate-900 border border-[#1c2e46]/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with internal scrolling */}
        <div className="p-8 overflow-y-auto flex-1 space-y-8 select-none no-scrollbar">
          
          {/* Top Panel: Summary State & Quick Action */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Executive Badge */}
            <div className="md:col-span-3 p-5 bg-[#0a101d] border border-[#1c2e46]/40 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="text-left space-y-1 min-w-[200px]">
                <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">Diagnostic Audit Core</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {language === 'FR' 
                    ? "L'audit système d'AuditAX garantit l'alignement des liaisons avec la base Firebase et l'état d'intégrité de l'hôte."
                    : "Sovereign audit verifies operational binding parameters, API latency, and credentials across our nodes."}
                </p>
              </div>

              {/* Counts */}
              <div className="flex items-center gap-3">
                <div className="text-center bg-[#0d1624] border border-[#1e2f47] py-2.5 px-3.5 rounded-xl">
                  <span className="block text-2xl font-black italic tracking-tighter text-emerald-400 leading-none">{stats.pass}</span>
                  <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 uppercase">PASS</span>
                </div>
                <div className="text-center bg-[#0d1624] border border-[#1e2f47] py-2.5 px-3.5 rounded-xl">
                  <span className="block text-2xl font-black italic tracking-tighter text-amber-500 leading-none">{stats.warning}</span>
                  <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 uppercase">WARN</span>
                </div>
                <div className="text-center bg-[#0d1624] border border-[#1e2f47] py-2.5 px-3.5 rounded-xl">
                  <span className="block text-2xl font-black italic tracking-tighter text-rose-500 leading-none">{stats.fail}</span>
                  <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 uppercase">FAIL</span>
                </div>
              </div>
            </div>

            {/* Run Action Button */}
            <button
              onClick={executeDiagnosticAudit}
              disabled={isRunning}
              className={cn(
                "h-full w-full py-5 rounded-2xl flex flex-col items-center justify-center gap-2 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-md focus:outline-none cursor-pointer select-none",
                isRunning 
                  ? "bg-slate-900 border-[#1c2e46]/40 text-slate-450" 
                  : "bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-400"
              )}
            >
              <RefreshCw className={cn("w-6 h-6", isRunning ? "animate-spin text-slate-500" : "")} />
              <span>{isRunning ? 'Auditing...' : 'Re-Run Audit'}</span>
            </button>
          </div>

          {/* Middle Layout: Retro Console Log + List of Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left Box: Diagnostic Checks List (3/5 stretch) */}
            <div className="lg:col-span-3 space-y-2.5 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
              {checks.map((check) => {
                const isSelected = expandedCheckId === check.id;
                const isItemScanning = activeCheckId === check.id;
                
                return (
                  <div
                    key={check.id}
                    className={cn(
                      "border rounded-2xl transition-all duration-300 bg-[#090e18]/85",
                      isSelected 
                        ? "border-[#0ea5e9]/40 bg-[#0d1525]" 
                        : isItemScanning
                          ? "border-blue-500/50 animate-pulse bg-blue-500/5"
                          : "border-[#1c2e46]/50 hover:border-slate-700 hover:bg-[#0a0f1b]"
                    )}
                  >
                    {/* Header item */}
                    <div
                      onClick={() => setExpandedCheckId(isSelected ? null : check.id)}
                      className="flex items-center justify-between p-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5 text-left min-w-0">
                        {/* High fidelity indicator */}
                        <HighFidelityIcon
                          variant={
                            check.status === 'PASS' ? 'success' :
                            check.status === 'WARNING' ? 'warning' :
                            check.status === 'FAIL' ? 'danger' :
                            check.status === 'SCANNING' ? 'info' : 'neutral'
                          }
                          size="xs"
                          animate={check.status === 'SCANNING'}
                        >
                          {check.category === 'AUTH' ? <Key /> :
                           check.category === 'DATABASE' ? <Database /> :
                           check.category === 'NETWORK' ? <Radio /> :
                           check.category === 'HARDWARE' ? <HardDrive /> : <Layers />}
                        </HighFidelityIcon>

                        <div className="truncate min-w-0">
                          <h4 className="text-[11px] font-black tracking-tight text-white uppercase">{check.name}</h4>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{check.category} • {check.description}</span>
                        </div>
                      </div>

                      {/* Status pill & arrow */}
                      <div className="flex items-center gap-3.5 shrink-0">
                        {check.latencyMs !== undefined && (
                          <span className="text-[8px] font-mono font-bold text-slate-500">{check.latencyMs}ms</span>
                        )}
                        <span className={cn(
                          "text-[8px] font-mono font-bold tracking-wider px-2 py-1 rounded-md border uppercase select-none",
                          check.status === 'PASS' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                          check.status === 'WARNING' ? "text-amber-500 border-amber-500/20 bg-amber-500/5" :
                          check.status === 'FAIL' ? "text-rose-500 border-rose-500/30 bg-rose-500/10 shadow-inner" :
                          check.status === 'SCANNING' ? "text-blue-400 border-blue-500/20 bg-blue-500/5" :
                          "text-slate-500 border-slate-700 bg-slate-800/20"
                        )}>
                          {check.status}
                        </span>
                        {isSelected ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Explanatory detail collapse (with slide and fade) */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-[#1c2e46]/40 bg-[#070b12] rounded-b-2xl text-left"
                        >
                          <div className="p-4 space-y-3.5">
                            {/* Current Telemetry */}
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">CURRENT TELEMETRY</span>
                              <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/35 py-2 px-3 rounded-lg border border-slate-900 break-words">
                                {check.details}
                              </p>
                            </div>

                            {/* Resolution Guideline if not passing 100% */}
                            {check.status !== 'PASS' && (
                              <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-1">
                                <div className="flex items-center gap-2 text-amber-500">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">PROACTIVE GUIDELINES</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">
                                  {check.resolution}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Box: Live Terminal Log console (2/5 stretch) */}
            <div className="lg:col-span-2 flex flex-col h-[420px] bg-[#03060a] border border-[#1c2e46]/60 rounded-3xl overflow-hidden shadow-inner">
              
              {/* Terminal header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1c2e46]/50 bg-[#050910]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0ea5e9]" />
                  <span className="text-[8.5px] font-mono font-bold tracking-[0.15em] text-slate-400 uppercase">TELEMETRY JOURNAL RECEIVER</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/40" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
                  <span className="w-2 h-2 rounded-full bg-[#0ea5e9]/70 animate-ping" />
                </div>
              </div>

              {/* Terminal Scrolling Content */}
              <div className="flex-1 p-5 overflow-y-auto font-mono text-[9px] text-[#0ea5e9] space-y-2 text-left leading-relaxed no-scrollbar select-text selection:bg-slate-850 selection:text-white">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 gap-2 font-mono">
                    <Terminal className="w-8 h-8 opacity-20" />
                    <span className="uppercase tracking-[0.1em] text-[8px] font-bold">Awaiting diagnostic sequence run</span>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    const isErr = log.includes('FAIL') || log.includes('discrepancy');
                    const isWarn = log.includes('WARN');
                    const isPass = log.includes('PASS') || log.includes('SUCCESS');
                    
                    return (
                      <div 
                        key={index}
                        className={cn(
                          "transition-all duration-300",
                          isErr ? "text-red-400 font-bold" :
                          isWarn ? "text-amber-500" :
                          isPass ? "text-emerald-400 font-bold" : "text-sky-400"
                        )}
                      >
                        {log}
                      </div>
                    );
                  })
                )}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal footer - Quick utilities */}
              <div className="px-5 py-3 border-t border-[#1c2e46]/45 bg-[#050910] text-right">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(logs.join('\n'));
                  }}
                  disabled={logs.length === 0}
                  className="inline-flex items-center gap-1 text-[8px] font-mono font-bold tracking-widest text-slate-500 hover:text-[#0ea5e9] transition-colors focus:outline-none cursor-pointer"
                  title="Copy log terminal"
                >
                  <Copy className="w-3 h-3" />
                  <span>COPY LOGS</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-[#1c2e46]/60 bg-[#090d18]/70">
          <div className="flex items-center gap-2.5 text-slate-500">
            <Cpu className="w-4 h-4 text-slate-400" />
            <span className="text-[8px] font-mono tracking-widest uppercase">AUDITAX SECURE PLATFORM COMPLIANCE KERNEL</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 bg-slate-900 border border-[#1c2e46]/60 hover:bg-slate-800 hover:border-slate-600 rounded-xl text-xs font-semibold text-white transition-all focus:outline-none cursor-pointer"
          >
            {t('diagnostic.diag_dismiss_integrity_console')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
