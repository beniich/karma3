import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Activity, 
  Slack,
  Layers, 
  Database,
  Cpu, 
  Lock, 
  Key, 
  RefreshCw, 
  Play, 
  Check, 
  X, 
  AlertTriangle, 
  Server, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash, 
  Radio, 
  Settings, 
  Zap, 
  Cloud, 
  Sliders, 
  Workflow,
  ArrowUpRight,
  Info
} from 'lucide-react';

// --- Types ---
export type IntegrationType = 'AWS_CLOUDWATCH' | 'DATADOG' | 'PROMETHEUS' | 'SLACK' | 'JIRA' | 'CUSTOM_WEBHOOK';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  isActive: boolean;
  config: {
    url: string;
    apiKey: string;
    // Specific configs
    extraParam1?: string; // region, site, channel, secret
    extraParam2?: string;
  };
  encryptedConfigSnippet: string; // Simulated encrypted version
  createdAt: string;
}

export interface SovereignHealthMetric {
  nodeId: string;
  status: 'operational' | 'degraded' | 'critical' | 'offline';
  latency: number;
  uptime: number;
  errorRate: number;
  rawPayload: any;
  source: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "int-prom-01",
    name: "Prometheus Europe-West Production",
    type: "PROMETHEUS",
    isActive: true,
    config: {
      url: "https://prometheus.eu-west.sovereign-energy.fr",
      apiKey: "sb_live_48e772ea0b1a052f",
      extraParam1: "9090", // port
    },
    encryptedConfigSnippet: "d7a4f8902ef1e8ab:fc896e41ab127eefe81ab802cdeb0085a12ecbb3014a",
    createdAt: "2026-05-24 10:14:00"
  },
  {
    id: "int-slack-02",
    name: "Slack Secure SecOps Channel",
    type: "SLACK",
    isActive: true,
    config: {
      url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      apiKey: "xoxb-secops-bot-617a2ee34b",
      extraParam1: "#auditax-critical-alerts",
    },
    encryptedConfigSnippet: "98ab23fcd84100ea:3ab0efd8eecde1f893de93994fe88ee1cd39890aefcc34a1",
    createdAt: "2026-05-24 14:30:22"
  },
  {
    id: "int-dd-03",
    name: "Datadog EU Sovereign Sandbox",
    type: "DATADOG",
    isActive: false,
    config: {
      url: "https://api.datadoghq.eu",
      apiKey: "dd_api_key_8e41bf1109aedefc",
      extraParam1: "datadoghq.eu",
    },
    encryptedConfigSnippet: "61abde771ccfa9ba:eecf77d33b41aa721bc6683faeb5008cfde00bb7ac",
    createdAt: "2026-05-25 01:05:12"
  }
];

// Helper to simulate text encryption
const simulateEncrypt = (text: string): string => {
  const iv = Math.random().toString(16).substring(2, 18);
  const encrypted = Math.random().toString(16).substring(2, 34) + Math.random().toString(16).substring(2, 18);
  return `${iv}:${encrypted}`;
};

export const IntegrationHubSection = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(INITIAL_INTEGRATIONS[0]);

  // Form State for creating/editing Integration
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<IntegrationType>('PROMETHEUS');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [extraParam1, setExtraParam1] = useState(''); // E.g. Slack channel or AWS Region
  const [showApiKey, setShowApiKey] = useState(false);

  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'SUCCESS' | 'FAILED' | null>(null);

  // Live Metric view after sync
  const [metrics, setMetrics] = useState<SovereignHealthMetric[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);

  // Security Module Sandbox
  const [plainTextToEncrypt, setPlainTextToEncrypt] = useState('{"api_key":"prod-vault-99","secret":"enc_key_alpha"}');
  const [simulatedCiphertext, setSimulatedCiphertext] = useState('');
  const [simulatedDecrypted, setSimulatedDecrypted] = useState<any>(null);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to test logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [testLogs]);

  // Initial metric loading
  useEffect(() => {
    triggerMetricsCollection(false);
  }, []);

  // Trigger automated simulation of unified metrics from active adaptators
  const triggerMetricsCollection = (notifyUser = true) => {
    setIsCollecting(true);
    if (notifyUser) {
      onNotify("🤖 Action : Appel de l'IntegrationManager pour ré-échantillonner les adaptateurs actifs...");
    }

    setTimeout(() => {
      const activeInts = integrations.filter(i => i.isActive);

      const computedMetrics: SovereignHealthMetric[] = [];

      activeInts.forEach(integration => {
        if (integration.type === 'PROMETHEUS') {
          computedMetrics.push(
            {
              nodeId: "k8s-master-node-01",
              status: "operational",
              latency: 18.4,
              uptime: 99.98,
              errorRate: 0.01,
              source: integration.name,
              rawPayload: { instance: "k8s-master-01", query: "up", status: "1", values: [Date.now(), "1"] }
            },
            {
              nodeId: "k8s-worker-node-02",
              status: "operational",
              latency: 24.1,
              uptime: 99.95,
              errorRate: 0.04,
              source: integration.name,
              rawPayload: { instance: "k8s-worker-02", query: "up", status: "1", values: [Date.now(), "1"] }
            }
          );
        } else if (integration.type === 'SLACK') {
          // Slack Integration sends metrics/status events rather than machine metrics
          computedMetrics.push({
            nodeId: "slack-secops-pipeline",
            status: "operational",
            latency: 125.0,
            uptime: 100.0,
            errorRate: 0.0,
            source: integration.name,
            rawPayload: { channel: "#auditax-critical-alerts", status: "ready_listening", webhook_urls_configured: 1 }
          });
        } else if (integration.type === 'DATADOG') {
          computedMetrics.push({
            nodeId: "datadog-agent-satellite",
            status: "degraded",
            latency: 210.8,
            uptime: 98.4,
            errorRate: 2.5,
            source: integration.name,
            rawPayload: { datadog_host: "datadoghq.eu", stats: "sampling_degraded", latency_spike: "true" }
          });
        } else if (integration.type === 'AWS_CLOUDWATCH') {
          computedMetrics.push({
            nodeId: "aws-ec2-sovereign-db",
            status: "operational",
            latency: 12.5,
            uptime: 99.99,
            errorRate: 0.0,
            source: integration.name,
            rawPayload: { InstanceId: "i-09ab772fceea11", Region: "eu-west-3", MetricName: "CPUUtilization" }
          });
        } else if (integration.type === 'JIRA') {
          computedMetrics.push({
            nodeId: "jira-sovereign-ticketing",
            status: "operational",
            latency: 85.0,
            uptime: 99.9,
            errorRate: 0.1,
            source: integration.name,
            rawPayload: { project: "AUDITAX", status: "api_connected", open_issues: 4 }
          });
        } else if (integration.type === 'CUSTOM_WEBHOOK') {
          computedMetrics.push({
            nodeId: "webhook-receiver-listener",
            status: "operational",
            latency: 5.2,
            uptime: 100.0,
            errorRate: 0.0,
            source: integration.name,
            rawPayload: { listener: "active", ssl: "valid_tls_1.3", signature: "HMAC_SHA256" }
          });
        }
      });

      // If no active integration, provide a placeholder network node
      if (computedMetrics.length === 0) {
        computedMetrics.push({
          nodeId: "local-fallback-host",
          status: "offline",
          latency: 0,
          uptime: 0,
          errorRate: 100,
          source: "Offline Core Gateway",
          rawPayload: { reason: "Aucun adaptateur actif n'est configuré" }
        });
      }

      setMetrics(computedMetrics);
      setIsCollecting(false);
      if (notifyUser) {
        onNotify("⚡ [IntegrationManager] Les métriques normalisées de tous les services ont été actualisées.");
      }
    }, 1000);
  };

  // Connection testing of integration
  const handleTestIntegration = (integration: Integration) => {
    setIsTesting(true);
    setTestResult(null);
    setTestLogs([]);
    
    const appendLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setTestLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
          resolve();
        }, delay);
      });
    };

    const runAdapterTest = async () => {
      await appendLog(`🔍 [Adapter Matching] Analyse du type : ${integration.type}`, 100);
      await appendLog(`⚙️ [Config Loader] Déchiffrement de la configuration via EncryptionService...`, 200);
      await appendLog(`🔑 [DEC] Charge déchiffrée avec succès. IV validé : ${integration.encryptedConfigSnippet.split(':')[0]}`, 150);
      await appendLog(`🌐 [Connection] Tentative de liaison avec l'URL : ${integration.config.url}`, 250);
      
      // Simulate checking different adapter cases
      if (integration.type === 'PROMETHEUS') {
        await appendLog(`🛠️ [PrometheusAdapter] Envoi d'une requête '/api/v1/status' d'intégrité...`, 300);
        await appendLog(`📥 [PrometheusAdapter] Statut HTTP 200 reçu. Version Prometheus : 2.45.0.`, 200);
        await appendLog(`🧪 [Normalize Engine] Test de requêtage 'up'. Réponse parsée et transformée en SovereignHealthMetric[] avec succès !`, 350);
        setTestResult('SUCCESS');
        await appendLog(`🛡️ [SUCCESS] Adaptateur "${integration.name}" validé & opérationnel.`, 150);
      } else if (integration.type === 'SLACK') {
        await appendLog(`🛠️ [SlackAdapter] Payload d'audit de signature de canal SecOps...`, 250);
        await appendLog(`💬 [SlackAdapter] Destination : ${integration.config.extraParam1 || '#secops-alerts'}`, 150);
        await appendLog(`📥 [SlackAdapter] Réponse 200 OK du webhook entrant.`, 200);
        setTestResult('SUCCESS');
        await appendLog(`🛡️ [SUCCESS] Adaptateur "${integration.name}" connecté à Slack.`, 150);
      } else if (integration.type === 'DATADOG') {
        await appendLog(`🛠️ [DatadogAdapter] Ping sur Datadog API endpoint : /api/v1/validate...`, 300);
        if (integration.config.apiKey.includes('error') || integration.config.apiKey.length < 8) {
          await appendLog(`❌ [DatadogAdapter] REJET SECURE API KEY (Code 403 Forbidden).`, 200);
          setTestResult('FAILED');
          await appendLog(`🚨 [FAILURE] Connexion au tenant Datadog refusée. Clé API incorrecte ou obsolète.`, 100);
        } else {
          await appendLog(`📥 [DatadogAdapter] Authentification acceptée pour le host : ${integration.config.extraParam1 || 'datadoghq.eu'}`, 200);
          setTestResult('SUCCESS');
          await appendLog(`🛡️ [SUCCESS] Adaptateur "${integration.name}" connecté à Datadog EU.`, 150);
        }
      } else {
        // Fallback Success
        await appendLog(`🛠️ [${integration.type}Adapter] Authentification via JWT/Bearer Key...`, 200);
        await appendLog(`✅ [TLS Validation] Certificat valide scellé en TLS 1.3 de souveraineté.`, 200);
        setTestResult('SUCCESS');
        await appendLog(`🛡️ [SUCCESS] Connexion établie pour l'adaptateur généraliste.`, 100);
      }

      setIsTesting(false);
      onNotify(`Vérification de l'adaptateur ${integration.name} terminée.`);
    };

    runAdapterTest();
  };

  // Toggle active status
  const toggleActiveStatus = (id: string) => {
    const updated = integrations.map(item => {
      if (item.id === id) {
        const nextStatus = !item.isActive;
        onNotify(`[Sprint 4 Orchestrateur] Adaptateur "${item.name}" ${nextStatus ? 'ACTIVÉ et inclus dans le cycle' : 'DÉSACTIVÉ du cycle de surveillance'}`);
        return { ...item, isActive: nextStatus };
      }
      return item;
    });
    setIntegrations(updated);
    
    // Auto update metrics
    setTimeout(() => {
      // Find the updated selection if any
      const currentSelected = updated.find(u => u.id === selectedIntegration?.id) || null;
      setSelectedIntegration(currentSelected);
    }, 50);
  };

  // Add new integrations
  const handleCreateIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !apiKey) {
      onNotify("⚠️ Erreur : Veuillez renseigner le Nom, l'URL de base et la Clé d'accès API.");
      return;
    }

    const newInt: Integration = {
      id: `int-${type.toLowerCase().substring(0, 4)}-${Math.floor(100 + Math.random() * 899)}`,
      name,
      type,
      isActive: true,
      config: {
        url,
        apiKey,
        extraParam1
      },
      encryptedConfigSnippet: simulateEncrypt(apiKey),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const nextList = [...integrations, newInt];
    setIntegrations(nextList);
    setSelectedIntegration(newInt);
    setIsAdding(false);
    
    // Clean fields
    setName('');
    setUrl('');
    setApiKey('');
    setExtraParam1('');
    
    onNotify(`🚀 [Adapter Pattern] New adapter "${name}" (${type}) successfully registered and injected.`);
    
    // Refresh operational metrics directly
    setTimeout(() => {
      triggerMetricsCollection(false);
    }, 300);
  };

  // Delete integration
  const handleDeleteIntegration = (id: string, nameToDelete: string) => {
    const filtered = integrations.filter(i => i.id !== id);
    setIntegrations(filtered);
    if (selectedIntegration?.id === id) {
      setSelectedIntegration(filtered[0] || null);
    }
    onNotify(`🗑️ Adapter "${nameToDelete}" removed from integration cluster.`);
  };

  // Encryption Sandbox handlers
  const handleSimulateEncrypt = () => {
    try {
      // Format verify
      JSON.parse(plainTextToEncrypt);
      const cipher = simulateEncrypt(plainTextToEncrypt);
      setSimulatedCiphertext(cipher);
      onNotify("🔒 [Crypto] AES-256-CBC simulated encryption of config payload.");
    } catch (e) {
      onNotify("❌ Error: Input payload must be valid JSON to simulate encryption.");
    }
  };

  const handleSimulateDecrypt = () => {
    if (!simulatedCiphertext) {
      onNotify("⚠️ Please encrypt a configuration first.");
      return;
    }
    try {
      setSimulatedDecrypted(JSON.parse(plainTextToEncrypt));
      onNotify("🔑 [Crypto] Inverse decryption succeeded using ENCRYPTION_KEY server environment variable.");
    } catch(e) {
      onNotify("❌ Decryption simulation failed.");
    }
  };

  // Color classes helper for sources badge
  const getSourceBadgeColor = (type: IntegrationType) => {
    switch(type) {
      case 'PROMETHEUS': return 'bg-orange-500/10 text-orange-600 border-orange-200/50';
      case 'DATADOG': return 'bg-purple-500/10 text-purple-600 border-purple-200/50';
      case 'AWS_CLOUDWATCH': return 'bg-blue-500/10 text-blue-600 border-blue-200/50';
      case 'SLACK': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50';
      case 'JIRA': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200/50';
    }
  };

  return (
    <div 
      id="integration-hub-view" 
      style={{
        width: "auto",
        height: "auto",
        paddingLeft: "-3px",
        marginLeft: "0px",
        marginRight: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        paddingTop: "0px"
      }}
      className="space-y-12"
    >
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
           <div className="px-5 py-2 bg-slate-900 border border-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic inline-flex items-center gap-3 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              SATELLITE::SPRINT::4::INTEGRATIONS_FRAMEWORK
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.85]">
             Hub <br/><span className="text-indigo-600">& Adapters</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">
             Architected Integration Engine (Adapter Pattern), AES-256 Encryption & Sovereign Unified Metrics
           </p>
        </div>

        {/* Global actions */}
        <div className="flex gap-3">
          <button 
             onClick={() => triggerMetricsCollection(true)}
             disabled={isCollecting}
             className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-100 flex items-center gap-2 shadow-xl shadow-indigo-600/20"
          >
             <RefreshCw className={`w-3.5 h-3.5 ${isCollecting ? 'animate-spin' : ''}`} />
             Collecter les métriques unifiées
          </button>
          
          <button 
             onClick={() => setIsAdding(true)}
             className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-100 flex items-center gap-2 shadow-xl"
          >
             <Plus className="w-4 h-4" />
             Ajouter un Adaptateur
          </button>
        </div>
      </div>

      {/* SPRINT 4 INFORMATION BANNER */}
      <div 
        style={{ backgroundColor: "#237c5d" }}
        className="p-6 md:p-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl md:rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-4 max-w-3xl">
             <div className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                Patron de Conception : Adapter Pattern
             </div>
             <h2 className="text-3xl md:text-4xl font-black italic uppercase leading-none tracking-tight">
               Framework d'Intégration Extensible d'AuditAX
             </h2>
             <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 italic leading-relaxed">
               Pour garantir un couplage lâche, la plateforme utilise l'architecture en <span className="text-white underline">Adaptateur</span>. Le frontend reçoit des objets <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">SovereignHealthMetric</span> universels, masquant l'hétérogénéité d'AWS CloudWatch, Datadog ou Prometheus. De plus, toutes les clés sont chiffrées en base de données de manière étanche.
             </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div 
        style={{ width: "1013.667px" }}
        className="grid grid-cols-1 xl:grid-cols-12 gap-10"
      >

        {/* Setup Adaptaters UI - LEFT SIDE (7 Cols) */}
        <div className="xl:col-span-7 space-y-8">
           
           {/* Add/Edit Overlay or Form */}
           {isAdding && (
             <div className="p-5 md:p-8 bg-white border-2 border-indigo-200 rounded-3xl md:rounded-[3rem] shadow-2xl space-y-6 relative">
               <button 
                  onClick={() => setIsAdding(false)} 
                  className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full border"
               >
                  <X className="w-4 h-4 text-slate-500" />
               </button>
               
               <div className="space-y-1">
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block font-mono">ADAPTER INSTANTIATION ENGINE</span>
                 <h3 className="text-2xl font-black text-slate-905 uppercase italic tracking-tight">New Connector Adapter</h3>
                 <p className="text-slate-400 text-xs italic">
                    Configure the liaison middleware to ingest and translate secure metrics.
                 </p>
               </div>

               <form onSubmit={handleCreateIntegration} className="space-y-5 pt-3">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Connector Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Main Prometheus" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Third-Party Service Type</label>
                      <select 
                        value={type} 
                        onChange={(e) => {
                          const val = e.target.value as IntegrationType;
                          setType(val);
                          // Suggest placeholder url based on selection
                          if (val === 'PROMETHEUS') setUrl('https://prometheus-production.local/api/v1');
                          else if (val === 'DATADOG') setUrl('https://api.datadoghq.eu');
                          else if (val === 'AWS_CLOUDWATCH') setUrl('https://monitoring.eu-west-3.amazonaws.com');
                          else if (val === 'SLACK') setUrl('https://hooks.slack.com/services');
                          else if (val === 'JIRA') setUrl('https://auditax-sovereign.atlassian.net');
                          else setUrl('https://webhook-receiver.local/events');
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      >
                        <option value="PROMETHEUS">Prometheus TimeSeries DB</option>
                        <option value="DATADOG">Datadog APM Platform</option>
                        <option value="AWS_CLOUDWATCH">AWS CloudWatch Log System</option>
                        <option value="SLACK">Slack Incoming Webhook</option>
                        <option value="JIRA">Jira Technical Ticketing</option>
                        <option value="CUSTOM_WEBHOOK">Custom HTTP Webhook Receiver</option>
                      </select>
                    </div>
                 </div>

                 <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-slate-500">API Endpoint URL</label>
                   <input 
                     type="text" 
                     placeholder="https://" 
                     value={url} 
                     onChange={(e) => setUrl(e.target.value)}
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Access API Key (AES Encrypted in DB)</label>
                      <div className="relative">
                        <input 
                          type={showApiKey ? "text" : "password"} 
                          placeholder="e.g., sb_live_..." 
                          value={apiKey} 
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">
                        {type === 'SLACK' ? 'Default Channel (#...)' : type === 'AWS_CLOUDWATCH' ? 'AWS Region' : 'Additional Adapter Parameter'}
                      </label>
                      <input 
                        type="text" 
                        placeholder={type === 'SLACK' ? '#auditax-alerts' : type === 'AWS_CLOUDWATCH' ? 'eu-west-3' : 'Optional Value'} 
                        value={extraParam1} 
                        onChange={(e) => setExtraParam1(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                      />
                    </div>
                 </div>

                 <div className="flex gap-3 justify-end pt-2">
                   <button 
                     type="button" 
                     onClick={() => setIsAdding(false)}
                     className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-lg"
                   >
                     Register Adapter
                   </button>
                 </div>
               </form>
             </div>
           )}

           {/* Integrations Catalog */}
           <div 
             style={{
               paddingTop: "45px",
               paddingBottom: "42px",
               paddingRight: "50px",
               marginRight: "0px",
               marginBottom: "23px",
               marginTop: "4px",
               marginLeft: "-28px",
               paddingLeft: "17px",
               width: "608.042px",
               height: "783.5px"
             }}
             className="p-5 md:p-10 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-xl space-y-8"
           >
              <div className="space-y-2">
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block font-mono">SECURE APPRENTICES & CONNECTORS REGISTRY</span>
                 <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Active Third-Party Corporate Adapters</h3>
                 <p className="text-slate-400 text-xs italic">
                   Enable, disable or delete your adapters. Select one to audit its connectivity.
                 </p>
              </div>

              {/* Flex list of current items */}
              <div className="space-y-4">
                 {integrations.map((item, index) => {
                   const isSelected = selectedIntegration?.id === item.id;
                   return (
                     <div 
                       key={item.id} 
                       style={
                         index === 1 ? {
                           width: "538.708px",
                           marginLeft: "0px",
                           paddingTop: "30px",
                           marginBottom: "17px",
                           marginRight: "1px",
                           marginTop: "4px",
                           paddingBottom: "21px"
                         } : undefined
                       }
                       className={`p-6 border rounded-[2.5rem] transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative ${isSelected ? 'bg-slate-50 border-indigo-400 ring-1 ring-indigo-200 shadow' : 'bg-white hover:bg-slate-50/50'}`}
                     >
                       <div 
                         className="flex gap-4 items-start flex-1 cursor-pointer"
                         onClick={() => setSelectedIntegration(item)}
                       >
                         {/* Channel type icon box */}
                         <div className={`p-4 rounded-2xl border ${getSourceBadgeColor(item.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                           {item.type === 'SLACK' ? <Slack className="w-5 h-5" /> : item.type === 'PROMETHEUS' ? <Radio className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
                         </div>

                         <div className="space-y-1">
                           <div className="flex items-center gap-2.5 flex-wrap">
                             <h4 
                               style={index === 1 ? { marginBottom: "44px" } : undefined}
                               className="font-black text-slate-950 uppercase italic text-sm"
                             >
                               {item.name}
                             </h4>
                             <span 
                               style={
                                 index === 0 ? { marginBottom: "23px" } :
                                 index === 1 ? { marginLeft: "-246px", marginRight: "4px", paddingLeft: "10px", marginTop: "26px" } :
                                 undefined
                               }
                               className="px-3 py-0.5 bg-slate-900 text-white text-[8px] font-mono rounded"
                             >
                               {item.type}
                             </span>
                           </div>
                           <p 
                             style={
                               index === 0 ? { marginBottom: "4px" } :
                               index === 1 ? { marginLeft: "0px", paddingLeft: "0px", paddingTop: "0px", marginRight: "0px", marginTop: "3px", marginBottom: "3px" } :
                               undefined
                             }
                             className="text-[10px] text-slate-400 font-mono italic truncate max-w-sm" 
                             title={item.config.url}
                           >
                             Endpoint: {item.config.url}
                           </p>
                           <div className="flex gap-2 items-center text-[10px] font-mono">
                             <span className="text-slate-400 font-semibold uppercase">Encrypted secret:</span>
                             <span className="text-indigo-600 font-bold tracking-tight bg-indigo-50/50 border border-indigo-100/50 px-2 py-0.5 rounded text-[9px]">
                               {item.encryptedConfigSnippet.substring(0, 32)}...
                             </span>
                           </div>
                         </div>
                       </div>

                       {/* Action blocks */}
                       <div 
                         style={
                           index === 0 ? { paddingLeft: "7px", marginLeft: "-62px", marginTop: "-22px" } :
                           index === 1 ? { width: "141.25px", height: "43px", paddingTop: "1px", marginLeft: "-108px", marginBottom: "29px" } :
                           undefined
                         }
                         className="flex gap-4 items-center shrink-0"
                       >
                         {/* Toggle on off */}
                         <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black uppercase tracking-wider font-mono ${item.isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                             {item.isActive ? 'Actif' : 'Inactif'}
                           </span>
                           <button
                             onClick={() => toggleActiveStatus(item.id)}
                             className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${item.isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
                           >
                             <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${item.isActive ? 'right-1' : 'left-1'}`} />
                           </button>
                         </div>

                         <button
                           onClick={() => handleDeleteIntegration(item.id, item.name)}
                           className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                           title="Supprimer l'adaptateur"
                         >
                           <Trash className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   );
                 })}

                 {integrations.length === 0 && (
                   <div className="p-8 text-center border-2 border-dashed rounded-3xl text-slate-400 space-y-2">
                     <AlertTriangle className="w-10 h-10 mx-auto text-slate-350" />
                     <p className="font-bold text-xs uppercase tracking-wider">No adapter declared at this time</p>
                     <p className="text-[10px] italic">Click on "Add Adapter" to configure your first pipeline.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Metrics Sandbox unified dashboard panel */}
           <div 
             style={{
               marginLeft: "-24px",
               width: "608.635px",
               height: "857.5px",
               marginRight: "4px"
             }}
             className="p-5 md:p-10 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-xl space-y-8"
           >
              <div className="flex justify-between items-start flex-wrap gap-4">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-sunset-orange uppercase tracking-widest block">MONITEUR UNIFIÉ DES MÉTRIQUES (SOVEREIGN HEALTH METRIC)</span>
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Aggregate Health State</h3>
                    <p className="text-slate-400 text-xs italic">
                       Adapters translate data structures into normalized metrics synchronously.
                    </p>
                 </div>
                 
                 <div className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-150 rounded-full text-[9px] font-bold tracking-widest inline-flex items-center gap-2">
                   <Activity className="w-3.5 h-3.5 animate-pulse" />
                   {metrics.length} AGGREGATED NODES
                 </div>
              </div>

              {/* Grid of metrics cards */}
              <div 
                style={{
                  width: "581.292px",
                  height: "615.333px",
                  marginLeft: "-24px"
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {metrics.map((met, index) => {
                  const isDegraded = met.status === 'degraded';
                  const isOffline = met.status === 'offline';
                  const isCritical = met.status === 'critical';

                  let statusTextClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-100';
                  if (isDegraded) statusTextClass = 'text-amber-500 bg-amber-500/10 border-amber-100';
                  if (isOffline || isCritical) statusTextClass = 'text-red-500 bg-red-505/10 border-red-100';

                  return (
                    <div 
                      key={index} 
                      style={
                        index === 0 ? { width: "273.64599999999996px" } :
                        index === 1 ? { width: "275.64599999999996px" } :
                        undefined
                      }
                      className="p-6 bg-slate-50 border rounded-3xl space-y-4"
                    >
                       <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                             <h4 className="font-black text-slate-950 font-mono text-xs truncate max-w-[160px]" title={met.nodeId}>
                               {met.nodeId}
                             </h4>
                             <p className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[160px]">{met.source}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 border text-[8px] font-black uppercase font-mono tracking-widest rounded-full ${statusTextClass}`}>
                            {met.status}
                          </span>
                       </div>

                       <div className="grid grid-cols-3 gap-2 text-center border-t border-b border-slate-200/50 py-3">
                          <div>
                            <span className="text-[8px] font-bold uppercase text-slate-400 block">Latence</span>
                            <span className="text-xs font-mono font-black text-slate-800">{met.latency} ms</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold uppercase text-slate-400 block">Uptime</span>
                            <span className="text-xs font-mono font-black text-slate-800">{met.uptime}%</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold uppercase text-slate-400 block">Erreurs</span>
                            <span className="text-xs font-mono font-black text-slate-800">{met.errorRate}%</span>
                          </div>
                       </div>

                       {/* Toggle showing parsed raw source payload */}
                       <div className="space-y-1.5 pt-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Payload brut initial de l'adaptateur</span>
                          <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[9.5px]/tight overflow-x-auto max-h-24">
                             {JSON.stringify(met.rawPayload, null, 2)}
                          </pre>
                       </div>
                    </div>
                  );
                })}
              </div>
           </div>

        </div>

        {/* Adapter testing Terminal & Encryption sandbox - RIGHT SIDE (5 Cols) */}
        <div className="xl:col-span-5 space-y-8">
           
           {/* Interactive Adaptator connection tester */}
           <div className="p-5 md:p-8 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-xl space-y-6">
              <div className="space-y-2">
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">CONTRÔLEUR SYNCHRONE</span>
                 <h3 className="text-lg font-black text-slate-950 uppercase italic leading-none">Banc d'Essai d'Adaptateur</h3>
                 <p className="text-xs text-slate-400 italic leading-relaxed">
                   Évaluez sélectivement l'algorithme d'ingestion et de décryptage des secrets au repos.
                 </p>
              </div>

              {selectedIntegration ? (
                <div className="space-y-4 pt-2">
                   <div className="p-5 bg-slate-50 border rounded-2xl flex justify-between items-center gap-4">
                      <div className="space-y-1">
                         <span className="text-[8px] font-black text-slate-400 uppercase font-mono tracking-widest">Cible Sélectionnée</span>
                         <h4 className="text-sm font-black text-slate-900 leading-tight uppercase italic">{selectedIntegration.name}</h4>
                         <span className="px-2 py-0.5 bg-slate-900 border text-white text-[8px] font-mono rounded inline-block">
                           {selectedIntegration.type}
                         </span>
                      </div>
                      
                      <button 
                        onClick={() => handleTestIntegration(selectedIntegration)}
                        disabled={isTesting}
                        className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow px-4 py-2.5 flex items-center gap-1.5 shrink-0"
                      >
                         <Play className="w-3.5 h-3.5 fill-white" />
                         Test Adapter
                      </button>
                   </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Please select an adapter to begin connecting tests.</p>
              )}

              {/* Terminal Logs */}
              <div className="p-1 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center px-6 py-3.5 bg-slate-900 border-b border-b-slate-850">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-red-500 rounded-full" />
                     <span className="w-2 h-2 bg-orange-500 rounded-full" />
                     <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                     <span className="text-[9px] font-mono text-slate-500 ml-2">adapter_handshake.log</span>
                   </div>
                   
                   {testResult && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black ${testResult === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                        {testResult}
                      </span>
                   )}
                </div>

                {/* Log messages */}
                <div className="p-5 h-[230px] overflow-y-auto font-mono text-[10.5px]/relaxed text-slate-400 scrollbar-thin">
                   {testLogs.length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center opacity-30 text-center py-10 space-y-2">
                         <Layers className="w-8 h-8 text-slate-500" />
                         <span className="text-[9px] uppercase tracking-widest">[EMPTY CONSOLE LOGS]</span>
                      </div>
                   ) : (
                      <div className="space-y-1.5 text-left">
                         {testLogs.map((log, index) => {
                           let textClass = 'text-slate-300';
                           if (log.includes('SUCCESS') || log.includes('validé & opérationnel')) textClass = 'text-emerald-400 font-semibold';
                           if (log.includes('REJET SECURE') || log.includes('FAILURE')) textClass = 'text-red-400 font-semibold';
                           if (log.includes('[DEC]') || log.includes('Déchiffrement')) textClass = 'text-indigo-400';
                           return <div key={index} className={textClass}>{log}</div>;
                         })}
                         <div ref={logsEndRef} />
                      </div>
                   )}
                </div>
              </div>
           </div>

           {/* Security Encryption module visualization */}
           <div className="p-5 md:p-8 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-xl space-y-6">
              <div className="space-y-1">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">SECURE CYBER MODULE</span>
                    <Lock className="w-4 h-4 text-emerald-500" />
                 </div>
                 <h3 className="text-lg font-black text-slate-950 uppercase italic leading-none">EncryptionService Sandbox</h3>
                 <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Test AES-256-CBC symmetric wrapping of configurations containing sensitive keys.
                 </p>
              </div>

              <div className="space-y-4 pt-2 border-t text-xs">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Input Configuration (Plaintext JSON)</label>
                    <textarea 
                      value={plainTextToEncrypt}
                      onChange={(e) => setPlainTextToEncrypt(e.target.value)}
                      rows={2}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                 </div>

                 {/* Run button */}
                 <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleSimulateEncrypt}
                      className="py-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow"
                    >
                      🛡️ Symmetric Encrypt
                    </button>
                    <button
                      onClick={handleSimulateDecrypt}
                      disabled={!simulatedCiphertext}
                      className="py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                    >
                      🔑 Decrypt with Key
                    </button>
                 </div>

                 {simulatedCiphertext && (
                    <div className="space-y-1 font-mono text-[9px]">
                       <span className="font-sans font-black uppercase text-slate-400 block pb-1 border-b">Cipher Output (Encrypted stored in DB)</span>
                       <div className="p-3 bg-indigo-50/50 border border-indigo-100 text-indigo-700 font-bold break-all rounded-xl leading-snug">
                          {simulatedCiphertext}
                       </div>
                    </div>
                 )}

                 {simulatedDecrypted && (
                    <div className="space-y-1 font-mono text-[9px]">
                       <span className="font-sans font-black uppercase text-slate-400 block pb-1 border-b">Plaintext Output (Decrypted in RAM buffer)</span>
                       <pre className="p-3 bg-slate-900 border text-emerald-400 rounded-xl leading-snug">
                          {JSON.stringify(simulatedDecrypted, null, 2)}
                       </pre>
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
