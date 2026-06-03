import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Settings, 
  Code, 
  Terminal, 
  Check, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileCode,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Plus,
  Trash2,
  Search,
  BookOpen,
  Calendar,
  Clock,
  PlayCircle,
  Copy,
  AlertTriangle,
  FileText,
  Save,
  Grid,
  Monitor,
  CheckCircle,
  Wifi,
  ChevronDown
} from 'lucide-react';

interface ScriptTemplate {
  id: string;
  category: 'Security' | 'Network' | 'Maintenance' | 'Custom';
  title: string;
  description: string;
  targetNode: string;
  cronInterval: string;
  code: string;
}

const INITIAL_SCRIPTS: ScriptTemplate[] = [
  {
    id: 'SCR-008',
    category: 'Security',
    title: 'Sovereign Device Connect & Handshake',
    description: 'Establishes encrypted TLS link with hardware node and triggers physical identity challenge validation.',
    targetNode: 'gate-alpha-x1',
    cronInterval: 'Every 5 Mins',
    code: `/* 
 * Script: Sovereign Device Connect & Handshake
 * Version: 2.4.1 (Sprint 7 Sovereign Core)
 */
async function executeSovereignHandshake(targetNode, payload) {
  const connection = await SovereignNexus.connect(targetNode);
  if (!connection.secure) {
    throw new Error(\`Security Drift Detected on: \${targetNode}\`);
  }
  
  const challenge = await connection.generateChallenge("FIPS-140-3");
  const receipt = await connection.commitChallenge(challenge, payload.signature);
  
  console.log(\`Handshake approved. Session token: \${receipt.sessionToken}\`);
  return { status: "SECURE", nodeLat: connection.latency };
}

executeSovereignHandshake("gate-alpha-x1", {
  signature: "SEC_KEY_829_NEXUS"
});`
  },
  {
    id: 'SCR-004',
    category: 'Security',
    title: 'AES-256 Key & Certificate Rotation',
    description: 'Automates regular renewal of active database encryption keys and asymetric tenant credentials.',
    targetNode: 'db-relay-paris',
    cronInterval: 'Every 24 Hours',
    code: `/*
 * Script: AES-256 Key & Certificate Rotation
 * Verification Std: SOC-2 / ISO 27001 Annex A.12
 */
async function rotateSovereignCerts(zoneId) {
  const gateway = await SentinelGateway.locate(zoneId);
  const rotationToken = await gateway.requestRotation();
  
  if (rotationToken.entropy < 256) {
    throw new Error("Entropy violation: unsafe key generation threshold.");
  }
  
  const status = await gateway.commitRotation(rotationToken);
  console.log(\`Key rotation committed under FIPS-140-3 framework in \${zoneId}\`);
  return { status: "Success", hash: rotationToken.sha256Signature };
}

rotateSovereignCerts("db-relay-paris");`
  },
  {
    id: 'SCR-009',
    category: 'Network',
    title: 'Blockchain Sentinel Synergy Pulse',
    description: 'Publishes local system state snapshots to the consensus validation ledger for decentralized auditing.',
    targetNode: 'karma3-consensus',
    cronInterval: 'Every Hour',
    code: `/*
 * Script: Blockchain Sentinel Synergy Pulse
 * Protocol: Karma3 Sovereign Ledger Consensual Link
 */
async function broadcastSovereignState() {
  const ledger = await Karma3Consensus.getConsensus();
  const stateHash = await SystemState.generateIntegrityHash();
  
  const block = await ledger.appendBlock({
    hash: stateHash,
    authorizedBy: "Root-Sentinel-Operator",
    timestamp: Date.now()
  });
  
  console.log(\`Consensus confirmed. Block height compiled: \${block.height}\`);
  return block;
}

broadcastSovereignState();`
  },
  {
    id: 'SCR-012',
    category: 'Maintenance',
    title: 'Automated IP Quarantine & Flush',
    description: 'Sweeps suspect address blocks logged by Anti-Abuse Sentinel and enforces direct CDN quarantines.',
    targetNode: 'cdn-balancer-04',
    cronInterval: 'Every 15 Mins',
    code: `/*
 * Script: Automated IP Quarantine & Flush
 * Focus Core: Anti-Abuse Suite Integration
 */
async function flushAbusiveTenants() {
  const logStream = await AntiAbuseSuite.getSuspectLogs();
  let quarantineCount = 0;
  
  for (const log of logStream) {
    if (log.driftFactor > 0.85 && !log.quarantined) {
      await Firewall.banIP(log.ipAddress, { duration: "24h" });
      quarantineCount++;
    }
  }
  
  console.log(\`Sweep complete. \${quarantineCount} suspicious IP nodes quarantined.\`);
  return { quarantineCount };
}

flushAbusiveTenants();`
  },
  {
    id: 'SCR-015',
    category: 'Maintenance',
    title: 'Local Database Ledger Backups',
    description: 'Creates cold-storage dumps of subscribers and system configurations and saves them encrypted.',
    targetNode: 'backup-cold-storage',
    cronInterval: 'Every 12 Hours',
    code: `/*
 * Script: Local Database Ledger Backups
 * Compliance Policy: disaster_recovery_plan
 */
async function executeColdBackup() {
  const dbModule = await Database.getModule("SovereignLocal");
  const payload = await dbModule.createDump();
  
  const encryptedArchive = await Cryptography.encryptAES(payload, {
    strength: "AES-256",
    keyType: "tp-tp-hsm"
  });
  
  await ArchiveNode.upload(encryptedArchive, "/cold/backups/ledger-dump.sql.enc");
  console.log("Database backup completed and uploaded to HSM vaults.");
  return { dumpedRecords: payload.recordsCount };
}

executeColdBackup();`
  }
];

interface ScheduledJob {
  id: string;
  name: string;
  interval: string;
  target: string;
  status: 'active' | 'inactive';
}

interface NexusScriptLibraryProps {
  onNotify: (msg: string) => void;
  theme?: 'dark' | 'light' | 'high-contrast';
}

export const NexusScriptLibrary = ({ onNotify, theme = 'dark' }: NexusScriptLibraryProps) => {
  const isLight = theme === 'light' || theme === 'high-contrast';

  // State Definitions
  const [scripts, setScripts] = useState<ScriptTemplate[]>(INITIAL_SCRIPTS);
  const [selectedScriptIdx, setSelectedScriptIdx] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableCode, setEditableCode] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Creation form overlay triggers
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Security' | 'Network' | 'Maintenance' | 'Custom'>('Custom');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newNode, setNewNode] = useState<string>('');
  const [newCron, setNewCron] = useState<string>('Every Hour');
  const [newCode, setNewCode] = useState<string>('');

  // Terminal state monitoring
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[SYSTEM] Code Executor Module Initialized.`,
    `[SENSORS] Secure satellite telemetry pipeline operational inside sandbox.`,
    `[STATUS] Type 'help' to review manual terminal inputs.`
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runProgress, setRunProgress] = useState<number>(0);

  // Scheduled Jobs Array State
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([
    { id: 'CRON-01', name: 'Verify SOC 2 drift', interval: 'Every 4 Hours', target: 'gate-alpha-x1', status: 'active' },
    { id: 'CRON-02', name: 'Flush suspect IPs', interval: 'Every 15 Mins', target: 'cdn-balancer-04', status: 'active' },
    { id: 'CRON-03', name: 'Backup Sovereign Ledger', interval: 'Every 12 Hours', target: 'backup-cold-storage', status: 'active' },
    { id: 'CRON-04', name: 'Sovereign Consensus Pulse', interval: 'Every Hour', target: 'karma3-consensus', status: 'inactive' }
  ]);

  // Sync edits upon selection change
  useEffect(() => {
    if (scripts[selectedScriptIdx]) {
      setEditableCode(scripts[selectedScriptIdx].code);
      setIsEditing(false);
    }
  }, [selectedScriptIdx, scripts]);

  // Simple selector list
  const activeScript = scripts[selectedScriptIdx] || scripts[0];

  // Filters calculation
  const filteredScripts = scripts.filter(sc => {
    const matchesCat = selectedCategory === 'All' || sc.category === selectedCategory;
    const matchesSearch = sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Code runner simulator
  const handleRunScript = () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunProgress(0);
    setTerminalLogs(prev => [
      ...prev,
      `--- START OF TRANSITION: EXECUTING ${activeScript.id} ---`,
      `[SANDBOX] Spawning isolated runtime context (TPM secure).`,
      `[RESOLVER] Resolving target cluster node: ${activeScript.targetNode}...`
    ]);

    onNotify(`⚡ Lancement immédiat de l'automatisation: ${activeScript.title}`);

    const runtimeSteps = [
      `[NETWORK] Secured connection established with ${activeScript.targetNode} (latency: 14ms).`,
      `[SECURITY] FIPS certificate signature matches operator level. Validated.`,
      `[COMPLIANCE] Verification checkpoints evaluated: drift factor: 0.04 (Compliant).`,
      `[EXECUTION] Parsing script blocks successfully...`,
      `[STDOUT] Parsing payload... OK.`,
      `[STDOUT] Committing localized modifications via multi-sig protocol.`,
      `[LEDGER] Snapshot broadcast as block height verification consensus.`,
      `[SUCCESS] Script ${activeScript.id} executed successfully. Termination code: 0.`
    ];

    let current = 0;
    const tracker = setInterval(() => {
      if (current < runtimeSteps.length) {
        setTerminalLogs(prev => [...prev, runtimeSteps[current]]);
        setRunProgress(Math.floor(((current + 1) / runtimeSteps.length) * 100));
        current++;
      } else {
        clearInterval(tracker);
        setIsRunning(false);
        onNotify(`✨ Automatisation ${activeScript.id} finalisée avec succès sur ${activeScript.targetNode}.`);
        setTerminalLogs(prev => [...prev, `--- PROCESS CONCLUDED WITH SUCCESS ({exit_code: 0, time: 12ms}) ---`]);
      }
    }, 400);
  };

  // Keyboard CLI input processor
  const handleCLICommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const query = terminalInput.trim();
    setTerminalInput('');
    setTerminalLogs(prev => [...prev, `> ${query}`]);

    setTimeout(() => {
      let resultText = '';
      const parts = query.toLowerCase().split(' ');
      const masterCmd = parts[0];

      if (masterCmd === 'help' || masterCmd === 'aide') {
        resultText = `Actions console : 'list' (tous les scripts), 'run' (procède sur script actif), 'clear' (vide), 'info' (métadonnées).`;
      } else if (masterCmd === 'clear') {
        setTerminalLogs([]);
        return;
      } else if (masterCmd === 'list') {
        resultText = `Scripts actifs : ` + scripts.map(s => `[${s.id}: ${s.title}]`).join(', ');
      } else if (masterCmd === 'run') {
        handleRunScript();
        return;
      } else if (masterCmd === 'info') {
        resultText = `Active Script Info: ID: ${activeScript.id} | Node: ${activeScript.targetNode} | Cron: ${activeScript.cronInterval}.`;
      } else {
        resultText = `Directive '${query}' inconnue. Saisissez 'help' pour les options.`;
      }

      setTerminalLogs(prev => [...prev, `🤖 console: ${resultText}`]);
    }, 150);
  };

  // Scheduled job state toggle
  const toggleJobState = (id: string) => {
    setScheduledJobs(prev => prev.map(job => {
      if (job.id === id) {
        const nextState = job.status === 'active' ? 'inactive' : 'active';
        onNotify(`${nextState === 'active' ? '🟢 Enclenchement' : '🔴 Suspension'} du planificateur ${job.id}.`);
        return { ...job, status: nextState };
      }
      return job;
    }));
  };

  // Delete script function
  const deleteScript = (id: string, idx: number) => {
    if (scripts.length <= 1) {
      onNotify(`⚠️ Le système exige au moins une automatisation de base.`);
      return;
    }
    const nextScripts = scripts.filter(sc => sc.id !== id);
    setScripts(nextScripts);
    setSelectedScriptIdx(0);
    onNotify(`🗑️ Script d'automatisation ${id} retiré du registre local.`);
  };

  // Create script callback
  const handleAddNewScriptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onNotify(`⚠️ Le titre du script est obligatoire.`);
      return;
    }

    const compiledNewScript: ScriptTemplate = {
      id: `SCR-${Math.floor(100 + Math.random() * 900)}`,
      category: newCategory,
      title: newTitle,
      description: newDesc || "Custom user created automation task script.",
      targetNode: newNode || "dev-node-unassigned",
      cronInterval: newCron,
      code: newCode || `/*\n * Custom User Script: ${newTitle}\n */\nconsole.log("Triggered user custom execution payload...");`
    };

    setScripts(prev => [...prev, compiledNewScript]);
    setSelectedScriptIdx(scripts.length);
    setShowCreateModal(false);

    // Reset fields
    setNewTitle('');
    setNewCategory('Custom');
    setNewDesc('');
    setNewNode('');
    setNewCron('Every Hour');
    setNewCode('');

    onNotify(`✨ Nouveau script ${compiledNewScript.id} enregistré et prêt au déploiement !`);
  };

  return (
    <div id="nexus-automation-scripts-layout" className={`space-y-6 text-left select-none rounded-[1.8rem] p-4 md:p-6 transition-all duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800 border border-slate-200 shadow-inner' : 'bg-[#021117] text-slate-100'
    }`}>
      
      {/* 1. MASTER HEADER SECTION */}
      <div id="automation-header-card" className={`backdrop-blur-xl border rounded-[1.6rem] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242e]/85 border-teal-800/40 shadow-2xl'
      }`}>
        {/* Glow ambient design */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-cyan-500/5' : 'bg-cyan-500/10'
        }`} />

        <div className="flex items-center gap-4 relative z-10" id="automation-title-lockup">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
            isLight 
              ? 'bg-cyan-50 border-cyan-200 text-cyan-600 shadow-sm' 
              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
          }`}>
            <Code className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${
                isLight ? 'text-cyan-700' : 'text-cyan-400'
              }`}>
                Nexus Automation Suite
              </span>
              <span className={`px-2 py-0.5 border rounded-full text-[8px] font-mono uppercase font-black tracking-widest flex items-center gap-1 ${
                isLight ? 'bg-[#f0fdfa] border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Schedules Online
              </span>
            </div>
            <h1 className={`text-xl md:text-2xl font-black tracking-tight mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white font-sans'
            }`}>
              Automatisations &amp; Exécution de Scripts
            </h1>
          </div>
        </div>

        {/* Global top-right action trigger of script library */}
        <div className="flex gap-2 w-full md:w-auto relative z-10" id="automation-primary-buttons">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-[9.5px] font-mono uppercase font-black rounded-xl bg-orange-650 hover:bg-orange-550 transition-all text-white cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            Créer un Script
          </button>
        </div>
      </div>

      {/* 2. CORE PERFORMANCE INDICATORS DECK */}
      <div id="automation-kpis-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Total Scripts */}
        <div id="kpi-total-scripts" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Automatisations Actives
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className={`text-2xl md:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {scripts.length}
              </span>
              <span className="text-[9px] text-[#22d3ee] font-bold">SCRIPTS</span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-none mt-1 font-medium">Prêts au lancement direct</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-[#22d3ee]">
            <FileCode className="w-5 h-5" />
          </div>
        </div>

        {/* Live Success Rate percentage */}
        <div id="kpi-success-rate" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Taux de Réussite Ordonné
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl md:text-3xl font-black text-emerald-500">
                99.42%
              </span>
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                SOC-2 CERT
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-none mt-1 font-medium">Aucun échec critique</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Active Cron queue list size */}
        <div id="kpi-cron-queue" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Tâches Chron Splanifiées
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl md:text-3xl font-black text-cyan-500">
                {scheduledJobs.filter(j => j.status === 'active').length}
              </span>
              <span className="text-xs text-slate-400">/ {scheduledJobs.length}</span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-none mt-1 font-medium">En queue d'évaluation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* System Health Impact rating */}
        <div id="kpi-system-health-impact" className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c242f]/70 border-teal-800/20'
        }`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono block">
              Impact de Santé Sandbox
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl md:text-3xl font-black text-purple-400">
                NUL 🔌
              </span>
              <span className="text-[8px] font-black text-[#cbd5e1] leading-none">ISOLATED</span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-none mt-1 font-medium">Conteneurisation sécurisé TPM</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. MULTI-COLUMN DESIGN WORKSPACE */}
      <div id="automation-workspace-slots" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN LEFT (Span 4): FILE NAVIGATOR & CATEGORIES */}
        <div id="automations-registry-navigator" className={`rounded-[1.6rem] p-4 border flex flex-col gap-4 lg:col-span-4 justify-between transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242e]/85 border-teal-800/40 shadow-2xl'
        }`}>
          <div className="space-y-4">
            
            {/* Nav title */}
            <div className="border-b pb-2.5 border-slate-200 dark:border-teal-800/25 text-left">
              <span className={`text-[9.5px] font-mono font-black uppercase tracking-wider block ${
                isLight ? 'text-cyan-700' : 'text-cyan-400'
              }`}>
                Registre des Opérations
              </span>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Catalogue des Automations
              </h3>
            </div>

            {/* Quick search input */}
            <div className="relative" id="scripts-search-bar">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Filtrer par nom ou ID..."
                value={searchQuery}
                aria-label="Filtre scripts"
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-3.5 py-2.5 text-xs outline-none border transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 focus:bg-white text-slate-900 placeholder-slate-400' 
                    : 'bg-[#05141b]/80 border-teal-800/25 focus:border-teal-400 text-white placeholder-slate-600 font-mono text-[9.5px]'
                }`}
              />
            </div>

            {/* Category selection bar */}
            <div className="flex flex-wrap gap-1" id="category-filter-chips">
              {['All', 'Security', 'Network', 'Maintenance'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[8.5px] font-mono px-2.5 py-1.5 rounded-lg font-black uppercase transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-cyan-600 text-white shadow-sm' 
                      : isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-black/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'Security' ? 'SHIELD 🛡️' : cat === 'Network' ? 'NET 🌐' : cat === 'Maintenance' ? 'OPS ⚙️' : 'TOUS'}
                </button>
              ))}
            </div>

            {/* Scrollable list of script selectors */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto no-scrollbar" id="nav-scripts-list">
              <AnimatePresence>
                {filteredScripts.map((sc, index) => {
                  const originalIdx = scripts.findIndex(item => item.id === sc.id);
                  const isSelected = selectedScriptIdx === originalIdx;

                  let catBadgeColor = '';
                  if (sc.category === 'Security') catBadgeColor = 'text-rose-500 bg-rose-500/10';
                  else if (sc.category === 'Network') catBadgeColor = 'text-blue-400 bg-blue-500/10';
                  else if (sc.category === 'Maintenance') catBadgeColor = 'text-amber-500 bg-amber-500/10';
                  else catBadgeColor = 'text-slate-405 bg-slate-500/10';

                  return (
                    <motion.div
                      key={sc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedScriptIdx(originalIdx)}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative ${
                        isSelected 
                          ? (isLight ? 'bg-cyan-50/70 border-cyan-405 shadow-sm' : 'bg-[#06242c] border-cyan-500/40 shadow-xl ring-1 ring-cyan-500/10')
                          : (isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-[#05141b]/60 border-teal-800/10 hover:border-teal-800/25')
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8px] font-mono font-black text-slate-400">{sc.id}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black uppercase ${catBadgeColor}`}>
                              {sc.category}
                            </span>
                          </div>
                          <h4 className={`text-xs font-black truncate mt-1 tracking-tight ${
                            isSelected ? 'text-cyan-400' : isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {sc.title}
                          </h4>
                        </div>
                      </div>

                      {/* Brief Description */}
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mt-1.5">
                        {sc.description}
                      </p>

                      {/* Metadata Footer */}
                      <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-dashed border-slate-200 dark:border-teal-800/10 text-[8.5px] font-mono text-slate-450 dark:text-slate-500">
                        <span>🛰️ {sc.targetNode}</span>
                        <span>⏱️ {sc.cronInterval}</span>
                      </div>

                      {/* Delete Trigger directly inline */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScript(sc.id, originalIdx);
                        }}
                        className="absolute top-2.5 right-2 text-slate-450 hover:text-rose-500 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                        title="Désenregistrer le script"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </motion.div>
                  );
                })}

                {filteredScripts.length === 0 && (
                  <div className="text-center py-10 italic text-slate-500 text-xs font-mono">
                    Aucun script d'automatisation trouvé.
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Core Tip info card */}
          <div className={`p-3.5 rounded-xl border leading-snug mt-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#041d24]/50 border-teal-800/10'
          }`}>
            <span className="text-[8px] font-mono font-black uppercase text-[#cbd5e1] block tracking-widest">INFO SECURISATION</span>
            <p className="text-[9.5px] text-slate-450 dark:text-slate-400 mt-1">
              Chaque fichier de script est encodé cryptographiquement et auditable selon le protocole de conformité **ISO 27001**.
            </p>
          </div>

        </div>

        {/* COLUMN MIDDLE (Span 8): CODE EDITOR INTERFACE & FLOW */}
        <div id="automations-workspace-ide" className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main IDE-looking layout */}
          <div id="ide-workspace-card" className={`rounded-[1.6rem] p-5 border flex flex-col justify-between relative overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b240e]/40 d-black border-teal-800/35 bg-[#0b242e]/85 shadow-2xl'
          }`}>
            
            <div className="space-y-4">
              
              {/* Script description banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2.5 border-b pb-3 border-slate-200 dark:border-teal-800/25 text-left">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-cyan-400">{activeScript.id}</span>
                    <h2 className={`text-md font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activeScript.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">
                    {activeScript.description} 
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase shrink-0">
                  <span className={`px-2 py-1 border rounded-lg ${
                    isLight ? 'bg-slate-100 border-slate-250 text-slate-700' : 'bg-black/40 border-teal-800/30 text-teal-300'
                  }`}>
                    Node Target: {activeScript.targetNode}
                  </span>
                </div>
              </div>

              {/* IDE Workspace container */}
              <div className={`rounded-xl border font-mono overflow-hidden shadow-2xl relative ${
                isLight ? 'bg-slate-950 text-slate-350 border-slate-900' : 'bg-[#020a0d] text-cyan-200 border-[#0b2b35]/40'
              }`} id="editor-container">
                
                {/* Editor Header */}
                <div className="bg-[#03151e] px-4.5 py-3 flex justify-between items-center border-b border-black/40 text-slate-400 shrink-0">
                  <span className="text-[9.5px] font-black text-cyan-400 flex items-center gap-1.5 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Editeur Script Terminal
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[8.5px] font-medium uppercase text-slate-500">Language: JavaScript (Chrome v8)</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(editableCode);
                        onNotify(`📋 Code du script ${activeScript.id} copié dans le presse-papier.`);
                      }}
                      className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                      title="Copier le code"
                    >
                      <Copy className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Editor code section */}
                <div className="flex p-4 min-h-[300px] text-left">
                  
                  {/* Dynamic line numbers */}
                  <div className="text-right text-slate-600 select-none pr-4.5 border-r border-teal-900/10 font-bold text-xs leading-[24px] font-mono shrink-0">
                    {Array.from({ length: editableCode.split('\n').length + 3 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Absolute Editor Box */}
                  <div className="flex-1 min-w-0 font-mono text-xs leading-[24px]">
                    {isEditing ? (
                      <textarea
                        value={editableCode}
                        onChange={(e) => setEditableCode(e.target.value)}
                        aria-label="Code d'automatisation"
                        className="w-full bg-transparent min-h-[300px] font-mono text-xs leading-[24px] text-emerald-300 px-4 py-0 resize-none outline-none border-none focus:outline-none focus:ring-0 select-text"
                        spellCheck="false"
                      />
                    ) : (
                      <pre className="px-4 bg-transparent text-left overflow-x-auto text-indigo-200/90 whitespace-pre font-mono selection:bg-cyan-500/20">
                        {editableCode}
                      </pre>
                    )}
                  </div>

                </div>

              </div>

              {/* Console commands of IDE footer */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4.5 pt-2">
                
                {/* Action primary Run */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={handleRunScript}
                    className="px-6 py-3.5 bg-gradient-to-r from-orange-655 to-orange-550 bg-orange-650 hover:bg-orange-550 transition-all text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-orange-500/10 active:scale-95 disabled:opacity-40"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                        <span>EXÉCUTION... ({runProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
                        <span>Exécuter Automatisation</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setIsEditing(false);
                        // Save to state
                        const nextScpts = [...scripts];
                        nextScpts[selectedScriptIdx] = {
                          ...nextScpts[selectedScriptIdx],
                          code: editableCode
                        };
                        setScripts(nextScpts);
                        onNotify(`💾 Modifications du script ${activeScript.id} sauvegardées dans le registre.`);
                      } else {
                        setIsEditing(true);
                        onNotify(`✍️ Mode d'édition activé. Saisissez votre code JavaScript.`);
                      }
                    }}
                    className={`px-5 py-3.5 bg-transparent border-2 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isEditing 
                        ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10' 
                        : 'border-orange-500/60 text-[#df6012] hover:bg-orange-500/5'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4.5 h-4.5 stroke-[2.5]" />
                        <span>Enregistrer</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-4.5 h-4.5" />
                        <span>Modifier Code</span>
                      </>
                    )}
                  </button>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditableCode(activeScript.code);
                      setIsEditing(false);
                      onNotify(`🔄 Code restauré aux paramètres d'origine du modèle.`);
                    }}
                    className="p-2 text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-mono leading-none font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* SPREAD OUT: SATELLITE SYSTEM CRON SCHEDULER */}
          <div id="satellite-scheduler-card" className={`rounded-[1.6rem] p-5 border text-left flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b242e]/85 border-teal-800/40 shadow-2xl'
          }`}>
            <div className="space-y-4">
              
              <div className="border-b pb-2.5 border-slate-200 dark:border-teal-800/25 flex justify-between items-center flex-wrap gap-2">
                <div className="space-y-0.5">
                  <span className={`text-[9.5px] font-mono font-black uppercase tracking-wider block ${
                    isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}>
                    Sovereign Consensus Daemon Queue
                  </span>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Planificateur de Tâches Récurrentes (Cron Engine)
                  </h3>
                </div>
                <div className={`px-2 py-0.5 border rounded-full text-[8px] font-mono font-black tracking-widest uppercase flex items-center gap-1 ${
                  isLight ? 'bg-emerald-50 border-emerald-150 text-emerald-700' : 'bg-green-500/10 border-green-500/20 text-green-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Daemon Actif
                </div>
              </div>

              {/* Scheduled queue table/deck */}
              <div className="space-y-2.5" id="chron-queues-deck">
                {scheduledJobs.map(job => (
                  <div
                    key={job.id}
                    id={`cron-job-${job.id.toLowerCase()}`}
                    className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                      job.status === 'active' 
                        ? (isLight ? 'bg-slate-50 border-cyan-200' : 'bg-[#031d24] border-cyan-800/30 text-cyan-200')
                        : (isLight ? 'bg-slate-50/50 border-slate-200 opacity-60' : 'bg-black/20 border-teal-850 opacity-55')
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        job.status === 'active' 
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                          : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {job.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black uppercase bg-black/30 border border-teal-822 text-slate-400 leading-none">
                            {job.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono leading-none">
                          Node: {job.target} • intervalle: <span className="font-bold text-orange-400">{job.interval}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[8.5px] font-mono uppercase font-black tracking-widest ${
                        job.status === 'active' ? 'text-[#06b6d2]' : 'text-slate-500'
                      }`}>
                        {job.status === 'active' ? 'Abonnement Actif' : 'Suspendu'}
                      </span>
                      <button
                        type="button"
                        id={`toggle-job-${job.id.toLowerCase()}`}
                        onClick={() => toggleJobState(job.id)}
                        className={`w-10 h-5.5 rounded-full transition-all flex items-center p-0.5 cursor-pointer ${
                          job.status === 'active' 
                            ? 'bg-orange-600 justify-end' 
                            : 'bg-slate-300 dark:bg-slate-800 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* DUAL STREAM: INTEGRATED TERMINAL MONITOR PANEL */}
          <div id="integrated-console-logs-card" className={`rounded-[1.6rem] border flex flex-col h-[350px] justify-between overflow-hidden ${
            isLight ? 'bg-slate-900 border-slate-950 text-[#94a3b8]' : 'bg-[#01090d] border-[#07161c] text-[#00ffcc]'
          }`}>
            <div className="p-3 bg-[#03151f] border-b border-white/5 flex justify-between items-center shrink-0">
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] font-black text-slate-450 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00ffcc] animate-pulse" />
                Dépôt Console stdout stream logs
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTerminalLogs([]);
                    onNotify('🗑️ Console vidée.');
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded font-mono text-[8px] font-black uppercase cursor-pointer"
                >
                  Clear Console
                </button>
              </div>
            </div>

            {/* Logs Area */}
            <div className="flex-1 p-3.5 space-y-2 overflow-y-auto no-scrollbar font-mono text-[10px] leading-relaxed text-left selection:bg-cyan-500/20" id="terminal-screen">
              {terminalLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-line tracking-wide">
                  {log}
                </div>
              ))}
            </div>

            {/* Standard CLI manual Command Input */}
            <form onSubmit={handleCLICommand} className="p-2 border-t border-white/5 bg-[#03151f] flex gap-2 shrink-0">
              <span className="text-[10px] font-mono pl-1 text-slate-500 pt-1.5">$</span>
              <input 
                type="text"
                placeholder="Exécution CLI manuelle (ex: help, run, info, list)..."
                value={terminalInput}
                aria-label="Directives console"
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-[10.5px] py-1 text-white placeholder-slate-650 focus:outline-none focus:ring-0 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-705 hover:bg-cyan-600 bg-cyan-600 text-white rounded font-mono text-[8.5px] uppercase font-black cursor-pointer shadow"
              >
                Proc_cmd
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* 4. MODAL: CREATE CUSTOM AUTOMATION SCRIPT */}
      <AnimatePresence>
        {showCreateModal && (
          <div id="modal-backdrop" className="fixed inset-0 bg-black/75 z-55 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl rounded-2xl border p-5 md:p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-left relative ${
                isLight ? 'bg-white border-slate-250 text-slate-800' : 'bg-[#081820] border-teal-800/40 text-slate-100'
              }`}
            >
              
              <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-teal-850">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-500" />
                  <h3 className="text-md font-bold text-white dark:text-white font-sans">
                    Création d'un Nouveau Script d'Automatisation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewScriptSubmit} className="space-y-4 pt-4">
                
                {/* Script Title */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-[#94a3b8] block font-mono">
                    Titre du Script
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Anti-Entropy Token Pulse..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full text-xs px-3.5 py-3 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500' 
                        : 'bg-black/40 border-teal-800/30 text-white focus:border-orange-550'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Category select option */}
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold uppercase tracking-widest text-[#94a3b8] block font-mono">
                      Catégorie Fonctionnelle
                    </label>
                    <div className="relative">
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className={`w-full text-xs px-3.5 py-3 rounded-xl border outline-none appearance-none cursor-pointer ${
                          isLight 
                            ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500' 
                            : 'bg-black/40 border-teal-800/30 text-white focus:border-orange-500'
                        }`}
                      >
                        <option value="Security">Security 🛡️</option>
                        <option value="Network">Network 🌐</option>
                        <option value="Maintenance">Maintenance ⚙️</option>
                        <option value="Custom">Custom Script 🔧</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Target cluster Node ID */}
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold uppercase tracking-widest text-[#94a3b8] block font-mono">
                      Identifiant du Nœud Cible
                    </label>
                    <input 
                      type="text" 
                      placeholder="ex: core-db-sub-1"
                      value={newNode}
                      onChange={(e) => setNewNode(e.target.value)}
                      className={`w-full text-xs px-3.5 py-3 rounded-xl border outline-none ${
                        isLight 
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500' 
                          : 'bg-black/40 border-teal-800/30 text-white focus:border-orange-550'
                      }`}
                    />
                  </div>

                </div>

                {/* Scheduled Cron expression */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-[#94a3b8] block font-mono">
                    Intervalle de Planification (Consensus Daemon)
                  </label>
                  <input 
                    type="text" 
                    placeholder="ex: Every 15 Mins, Every 24 Hours..."
                    value={newCron}
                    onChange={(e) => setNewCron(e.target.value)}
                    className={`w-full text-xs px-3.5 py-3 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500' 
                        : 'bg-black/40 border-teal-800/30 text-white focus:border-orange-550'
                    }`}
                  />
                </div>

                {/* Brief description */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-[#94a3b8] block font-mono">
                    Description Tactique de l'Automatisation
                  </label>
                  <input 
                    type="text" 
                    placeholder="Saisissez le but de cette automatisation..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className={`w-full text-xs px-3.5 py-3 rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500' 
                        : 'bg-black/40 border-teal-800/30 text-white focus:border-orange-550'
                    }`}
                  />
                </div>

                {/* Template Code container */}
                <div className="space-y-1 pt-2">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-[#94a3b8] block font-mono">
                    Payload de Code JavaScript d'Origine
                  </label>
                  <textarea
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="/* Saisissez votre logique de script d'exécution */&#10;async function main() { ... }"
                    className={`w-full min-h-[140px] font-mono text-xs p-3 rounded-xl border outline-none resize-none leading-relaxed ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500 focus:bg-white' 
                        : 'bg-black/40 border-teal-800/30 text-emerald-350 focus:border-orange-555 focus:bg-black/60'
                    }`}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-teal-850 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 text-xs font-mono uppercase font-black tracking-normal text-slate-400 hover:text-white bg-transparent outline-none cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-650 hover:bg-orange-550 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer shadow-sm"
                  >
                    Enregistrer dans la Bibliothèque
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
