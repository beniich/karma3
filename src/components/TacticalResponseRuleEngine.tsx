import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  RefreshCw, 
  Activity, 
  Server, 
  Terminal, 
  CheckCircle, 
  Layers, 
  Cpu,
  AlertTriangle,
  Play,
  Save,
  Plus,
  Trash2,
  Sliders,
  Flame,
  Bell,
  Network,
  HelpCircle,
  X,
  PlusCircle,
  Radio,
  FileCode,
  Check,
  Power
} from 'lucide-react';

interface NodeSocket {
  name: string;
  color: 'orange' | 'green' | 'red';
}

interface RuleNode {
  id: string;
  label: string;
  type: 'trigger' | 'action';
  x: number;
  y: number;
  inputs: NodeSocket[];
  outputs: NodeSocket[];
  icon: React.ElementType;
  description: string;
}

interface Connection {
  id: string;
  fromNode: string;
  fromOutputIdx: number;
  toNode: string;
  toInputIdx: number;
}

interface ConsoleLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  source: string;
  message: string;
}

export const TacticalResponseRuleEngine = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  // Sidebar categories and item specifications
  const sidebarTriggers = [
    { label: 'Unauthorized Access', desc: 'Détection d\'accès SSH/API non autorisés', icon: AlertTriangle, inputs: [{ name: 'Input', color: 'green' as const }, { name: 'Input', color: 'green' as const }], outputs: [{ name: 'Input', color: 'orange' as const }, { name: 'Output', color: 'orange' as const }, { name: 'Output', color: 'green' as const }] },
    { label: 'Malware Detected', desc: 'Présence suspecte de binaires compromis d\'après UBA', icon: Cpu, inputs: [{ name: 'Input', color: 'orange' as const }, { name: 'Output', color: 'green' as const }], outputs: [{ name: 'Output', color: 'orange' as const }] },
    { label: 'High Traffic Anomaly', desc: 'Pic d\'activité anormale ou requête DDoS détectée', icon: Activity, inputs: [{ name: 'Port Sensor', color: 'green' as const }], outputs: [{ name: 'Anomalies', color: 'orange' as const }, { name: 'Alert Flag', color: 'orange' as const }] },
    { label: 'Malware Anomaly', desc: 'Processus indésirable persistant détecté au niveau de l\'hôte', icon: FileCode, inputs: [{ name: 'Process Reg', color: 'green' as const }], outputs: [{ name: 'Payload Detect', color: 'orange' as const }] }
  ];

  const sidebarActions = [
    { label: 'HSM Secret Destruction', desc: 'Déclenche la suppression préemptive des clés de l\'enclave HSM', icon: Flame, inputs: [{ name: 'Input', color: 'orange' as const }, { name: 'Concess', color: 'green' as const }, { name: 'Description', color: 'green' as const }], outputs: [{ name: 'Output', color: 'orange' as const }] },
    { label: 'Quarantine Host', desc: 'Isole instantanément l\'hôte sur le commutateur réseau central', icon: Shield, inputs: [{ name: 'Respection', color: 'green' as const }, { name: 'Success', color: 'green' as const }, { name: 'Quarantine', color: 'green' as const }], outputs: [{ name: 'Output', color: 'orange' as const }] },
    { label: 'Alert SOC', desc: 'Envoie une notification d\'urgence prioritaire au SOC central', icon: Bell, inputs: [{ name: 'Input', color: 'orange' as const }, { name: 'Output', color: 'green' as const }], outputs: [{ name: 'Output', color: 'orange' as const }] },
    { label: 'Apply Firewall Rule', desc: 'Incorpore des filtres de paquet strict pour bloquer l\'attaquant IP', icon: Network, inputs: [{ name: 'Rule ID', color: 'green' as const }, { name: 'Target IP', color: 'green' as const }], outputs: [{ name: 'Blocked', color: 'orange' as const }] }
  ];

  // Initial nodes exactly matching image
  const [nodes, setNodes] = useState<RuleNode[]>([
    {
      id: 'unauthorized_access',
      label: 'Unauthorized Access',
      type: 'trigger',
      x: 180,
      y: 120,
      inputs: [
        { name: 'Input', color: 'green' },
        { name: 'Input', color: 'green' }
      ],
      outputs: [
        { name: 'Input', color: 'orange' },
        { name: 'Output', color: 'orange' },
        { name: 'Output', color: 'green' }
      ],
      icon: AlertTriangle,
      description: 'Détection d\'accès SSH/API non autorisés'
    },
    {
      id: 'hsm_secret_destruction',
      label: 'HSM Secret Destruction',
      type: 'action',
      x: 520,
      y: 60,
      inputs: [
        { name: 'Input', color: 'orange' },
        { name: 'Concess', color: 'green' },
        { name: 'Description', color: 'green' }
      ],
      outputs: [
        { name: 'Output', color: 'orange' }
      ],
      icon: Flame,
      description: 'Déclenche la suppression préemptive des clés de l\'enclave HSM'
    },
    {
      id: 'alert_soc',
      label: 'Alert SOC',
      type: 'action',
      x: 520,
      y: 280,
      inputs: [
        { name: 'Input', color: 'orange' },
        { name: 'Output', color: 'green' }
      ],
      outputs: [
        { name: 'Output', color: 'orange' }
      ],
      icon: Bell,
      description: 'Envoie une notification d\'urgence prioritaire au SOC central'
    },
    {
      id: 'malware_detected',
      label: 'Malware Detected',
      type: 'trigger',
      x: 180,
      y: 400,
      inputs: [
        { name: 'Input', color: 'orange' },
        { name: 'Output', color: 'green' }
      ],
      outputs: [
        { name: 'Output', color: 'orange' }
      ],
      icon: Cpu,
      description: 'Présence suspecte de binaires compromis d\'après UBA'
    },
    {
      id: 'quarantine_host',
      label: 'Quarantine Host',
      type: 'action',
      x: 520,
      y: 390,
      inputs: [
        { name: 'Respection', color: 'green' },
        { name: 'Success', color: 'green' },
        { name: 'Quarantine', color: 'green' }
      ],
      outputs: [
        { name: 'Output', color: 'orange' }
      ],
      icon: Shield,
      description: 'Isole instantanément l\'hôte sur le commutateur réseau central'
    }
  ]);

  // Initial connections precisely linking nodes as requested
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', fromNode: 'unauthorized_access', fromOutputIdx: 0, toNode: 'hsm_secret_destruction', toInputIdx: 0 },
    { id: 'c2', fromNode: 'unauthorized_access', fromOutputIdx: 1, toNode: 'alert_soc', toInputIdx: 0 },
    { id: 'c3', fromNode: 'malware_detected', fromOutputIdx: 0, toNode: 'quarantine_host', toInputIdx: 0 }
  ]);

  // Interaction State Control
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeTab, setActiveSidebarTab] = useState<'triggers' | 'actions'>('triggers');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePulses, setActivePulses] = useState<string[]>([]);
  const [connectingSource, setConnectingSource] = useState<{ nodeId: string; outputIdx: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Custom Drag State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Simulation Logs state
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { id: '1', timestamp: '23:00:01', type: 'info', source: 'ENGINE', message: 'Tactical Rule Engine v2 initié avec succès.' },
    { id: '2', timestamp: '23:00:15', type: 'success', source: 'COMPILER', message: 'Toutes les configurations de canaux HSM physiques compilées (5/5 enclaves OK).' },
  ]);

  const addConsoleLog = (type: 'info' | 'success' | 'warn' | 'error', source: string, message: string) => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setConsoleLogs(prev => [
      { id: Date.now().toString() + Math.random(), timestamp: ts, type, source, message },
      ...prev.slice(0, 49)
    ]);
  };

  // Node Drag and Drop handlers
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedNode(id);
    const node = nodes.find(n => n.id === id);
    if (!node || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    setDraggingNodeId(id);
    setDragOffset({
      x: clientX - rect.left - node.x,
      y: clientY - rect.top - node.y
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      // Limit to canvas bounds
      const boundedX = Math.max(10, Math.min(rect.width - 240, x));
      const boundedY = Math.max(10, Math.min(rect.height - 130, y));

      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: boundedX, y: boundedY } : n));
    }
    
    if (connectingSource && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Trigger Action / Add customizable node dynamically
  const handleAddNodeFromSidebar = (item: typeof sidebarTriggers[0], category: 'trigger' | 'action') => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newId = `${category}_${Date.now()}`;
    const newNode: RuleNode = {
      id: newId,
      label: item.label,
      type: category,
      x: rect.width / 2 - 100 + (Math.random() * 40 - 20),
      y: rect.height / 2 - 50 + (Math.random() * 40 - 20),
      inputs: item.inputs.map(i => ({ name: i.name, color: i.color })),
      outputs: item.outputs.map(o => ({ name: o.name, color: o.color })),
      icon: item.icon,
      description: item.desc
    };
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newId);
    addConsoleLog('info', 'USER', `Nœud '${item.label}' ajouté au Logic Builder.`);
    onNotify(`➕ Nouveau noeud '${item.label}' ajouté au plan.`);
  };

  // Remove existing node
  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.fromNode !== id && c.toNode !== id));
    if (selectedNode === id) setSelectedNode(null);
    addConsoleLog('warn', 'PLANNER', `Nœud '${id}' et ses liaisons ont été retirés.`);
    onNotify(`🗑️ Nœud ${id} supprimé.`);
  };

  // Handle Socket clicks for custom real-time connections
  const handleSocketClick = (e: React.MouseEvent, nodeId: string, type: 'input' | 'output', idx: number) => {
    e.stopPropagation();
    if (type === 'output') {
      setConnectingSource({ nodeId, outputIdx: idx });
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      addConsoleLog('info', 'BUILDER', `Création d'une liaison depuis le canal de sortie ${idx} de '${nodeId}'...`);
    } else {
      // It is an input
      if (connectingSource) {
        if (connectingSource.nodeId === nodeId) {
          // Cannot connect to itself
          setConnectingSource(null);
          addConsoleLog('warn', 'BUILDER', "Création annulée : Connexion vers soi-même impossible.");
          return;
        }

        // Check if connection already exists
        const exists = connections.some(
          c => c.fromNode === connectingSource.nodeId &&
               c.fromOutputIdx === connectingSource.outputIdx &&
               c.toNode === nodeId &&
               c.toInputIdx === idx
        );

        if (!exists) {
          const newConn: Connection = {
            id: `c_${Date.now()}`,
            fromNode: connectingSource.nodeId,
            fromOutputIdx: connectingSource.outputIdx,
            toNode: nodeId,
            toInputIdx: idx
          };
          setConnections(prev => [...prev, newConn]);
          addConsoleLog('success', 'BUILDER', `Liaison établie avec succès vers l'entrée ${idx} de '${nodeId}'.`);
          onNotify("🔒 Nouvelle liaison tactique sécurisée.");
        }
        setConnectingSource(null);
      }
    }
  };

  // Run whole interactive simulation sequence
  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    addConsoleLog('info', 'SIMULATOR', '🚀 Lancement du protocole de simulation tactique...');
    onNotify("⚙️ Simulation des réponses tactiques en cours...");

    // Stage 1: Trigger 'Unauthorized Access' and 'Malware Detected'
    setTimeout(() => {
      addConsoleLog('warn', 'SENSOR', '⚠️ [ALERTE SENSORIELLE] Intrusion détectée sur le port d\'API souverain (Source IP suspecte).');
      addConsoleLog('warn', 'UBA_CORE', '👾 Virus et signature de ransomware cryptographique repérés sur l\'Hôte-721.');
      
      // Ignite connect wire pulses
      setActivePulses(connections.map(c => c.id));
    }, 800);

    // Stage 2: Fire action modules sequentially as energy pulses arrive
    setTimeout(() => {
      addConsoleLog('error', 'HSM_VAULT', '🔥 Séquence de destruction d\'urgence : Clés cryptographiques effacées du HSM Enclave Sec-02.');
      addConsoleLog('success', 'SOC_ALERT', '📡 Relais crypté envoyé au SOC principal - Coordonnées transmises.');
      addConsoleLog('success', 'FIREWALL', '🛡️ [RÈGLE PAQUET COMPILÉ] Trafic hostile IP bloqué sur la passerelle bastion.');
      addConsoleLog('error', 'QUARANTINE', '🔒 Isolement virtuel complété : L\'Hôte-721 est confiné en déconnexion mTLS.');
      
      // Stop pulses but flash targets
      setActivePulses([]);
      onNotify("🛡️ Alignement tactique achevé. Menaces neutralisées automatiquement.");
      setIsSimulating(false);
    }, 3500);
  };

  const saveRuleset = () => {
    addConsoleLog('success', 'DATABASE', `Ruleset actif sauvegardé. (${nodes.length} nœuds, ${connections.length} câbles cryptologiques)`);
    onNotify("💾 Configuration tactique sauvegardée dans le registre central AuditAX.");
  };

  const deployConfig = () => {
    addConsoleLog('info', 'DEPLOIER', 'Déploiement de la configuration des règles sur l\'OS Sovereign...');
    setTimeout(() => {
      addConsoleLog('success', 'DEPLOIER', '✓ Synchronisation effectuée avec succès! Les règles mTLS d\'AuditAX sont résolues.');
      onNotify("🚀 Déploiement matériel terminé.");
    }, 1200);
  };

  // Helper values for drawing SVG connection paths dynamically
  const getNodeCoordinates = (nodeId: string, socketType: 'input' | 'output', index: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const cardWidth = 205;
    const headerHeight = 36;
    const itemHeight = 24;
    const spacingTop = 40;

    if (socketType === 'output') {
      const x = node.x + cardWidth;
      const y = node.y + headerHeight + (index * itemHeight) + itemHeight / 2 + 10;
      return { x, y };
    } else {
      const x = node.x;
      const y = node.y + headerHeight + (index * itemHeight) + itemHeight / 2 + 10;
      return { x, y };
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-350 p-1 text-left select-none relative bg-transparent">
      {/* Visual Animation & Glow Style Definitions */}
      <style>{`
        @keyframes dashflow {
          to {
            stroke-dashoffset: -40;
          }
        }
        .wire-path {
          stroke-dasharray: 4, 4;
          animation: dashflow 4s linear infinite;
        }
        .wire-pulse {
          stroke-dasharray: 8, 120;
          animation: dashflow 1.5s linear infinite;
        }
        .canvas-grid {
          background-image: radial-gradient(rgba(249, 115, 22, 0.12) 1.5px, transparent 1.5px);
          background-size: 20px 20px;
        }
        .neon-glow-card {
          box-shadow: 0 0 35px rgba(249, 115, 22, 0.08);
        }
        .custom-glow-orange {
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.25);
        }
      `}</style>

      {/* Header section identical in typography style and placement */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl md:text-5xl font-black uppercase text-white font-sans tracking-tight">
          TACTICAL RESPONSE RULE ENGINE
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-bold tracking-wider font-mono">
          Defining automated tactical responses.
        </p>
      </div>

      {/* Main Container - Logic Builder */}
      <div className="bg-[#120822]/80 border border-orange-500/20 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] neon-glow-card">
        
        {/* Logic Builder Header Bar */}
        <div className="bg-[#130727] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-orange-500/10">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center">
              <span className="text-orange-500 text-sm font-black font-sans leading-none">A</span>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Logic Builder</h3>
              <p className="text-[10px] text-slate-500 font-mono">WORKSPACE ID: SEC-ORCH-PEGAUS</p>
            </div>
          </div>

          {/* Action buttons inside builder bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const triggerType = activeTab === 'triggers' ? sidebarTriggers[0] : sidebarActions[0];
                const cat = activeTab === 'triggers' ? 'trigger' as const : 'action' as const;
                handleAddNodeFromSidebar(triggerType, cat);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:bg-[#1a0f2b] hover:border-orange-500/35 transition-all text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-orange-500" />
              Add Node
            </button>
            <button
              onClick={saveRuleset}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:bg-[#1a0f2b] hover:border-orange-500/35 transition-all text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              Save Ruleset
            </button>
            <button
              onClick={deployConfig}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:bg-[#1a0f2b] hover:border-orange-500/35 transition-all text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              Deploy Config
            </button>
            <button
              onClick={triggerSimulation}
              disabled={isSimulating}
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10 active:scale-95 transition-all custom-glow-orange border-none leading-none"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isSimulating ? 'SIMULATING...' : 'Test Simulation'}
            </button>
          </div>

        </div>

        {/* Builder Interactive Hub Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] relative">
          
          {/* 1. Extreme Left Siderail */}
          <div className="hidden sm:flex lg:col-span-1 border-r border-[#24133f] bg-[#0c051a] flex-col py-6 items-center gap-6 text-slate-500 z-10 shrink-0">
            <button 
              onClick={() => setActiveSidebarTab('triggers')}
              className={`p-2 rounded-xl transition-all ${activeTab === 'triggers' ? 'bg-orange-600/15 border border-orange-500/30 text-orange-400 font-bold' : 'hover:text-slate-200 bg-transparent border border-transparent'}`}
              title="EVENT TRIGGERS"
            >
              <Radio className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveSidebarTab('actions')}
              className={`p-2 rounded-xl transition-all ${activeTab === 'actions' ? 'bg-orange-600/15 border border-orange-500/30 text-orange-400 font-bold' : 'hover:text-slate-200 bg-transparent border border-transparent'}`}
              title="ACTIONS SYSTEM"
            >
              <Layers className="w-4 h-4" />
            </button>
            <div className="h-px w-6 bg-slate-800" />
            <button className="p-2 hover:text-slate-350 transition-colors" title="LOG DETAILS">
              <Terminal className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-slate-350 transition-colors" title="SETTINGS">
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Main Sidebar list of triggers & actions */}
          <div className="lg:col-span-3 border-r border-[#24133f] bg-[#0f0722] p-5 flex flex-col justify-between gap-6 z-10">
            
            <div className="space-y-5">
              
              <div className="flex border-b border-orange-500/10 pb-2 justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                  {activeTab === 'triggers' ? 'EVENT TRIGGERS' : 'SYSTEM ACTIONS'}
                </span>
                <span className="text-[8px] bg-orange-500/10 border border-orange-500/25 text-orange-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                  {activeTab === 'triggers' ? 'TRIGGERS' : 'ACTIONS'}
                </span>
              </div>

              {/* Toggle switch for category */}
              <div className="grid grid-cols-2 gap-2 bg-[#090314] p-1 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => setActiveSidebarTab('triggers')}
                  className={`py-1.5 text-[8.5px] font-mono font-black uppercase tracking-widest rounded-lg transition-all border-none cursor-pointer ${activeTab === 'triggers' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`}
                >
                  Triggers
                </button>
                <button
                  onClick={() => setActiveSidebarTab('actions')}
                  className={`py-1.5 text-[8.5px] font-mono font-black uppercase tracking-widest rounded-lg transition-all border-none cursor-pointer ${activeTab === 'actions' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`}
                >
                  Actions
                </button>
              </div>

              {/* Scrollable nodes list */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto no-scrollbar py-1">
                {(activeTab === 'triggers' ? sidebarTriggers : sidebarActions).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.label}
                      onClick={() => handleAddNodeFromSidebar(item, activeTab === 'triggers' ? 'trigger' : 'action')}
                      className="group p-3 rounded-2xl bg-[#140a2c]/65 border border-orange-500/10 hover:border-orange-500/35 hover:bg-[#1c0f3d] transition-all duration-200 cursor-pointer text-left relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${activeTab === 'triggers' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-200">{item.label}</span>
                      </div>
                      <p className="text-[8.5px] text-slate-500 mt-1.5 leading-relaxed truncate group-hover:text-slate-400">
                        {item.desc}
                      </p>
                      
                      {/* Hover action indicator */}
                      <span className="absolute right-3 top-3 text-[8.5px] bg-orange-600/15 text-orange-400 hover:text-white px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest font-black font-mono scale-75 opacity-0 group-hover:opacity-100 transition-all">
                        + ADD
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Instruction tooltip block */}
            <div className="p-3.5 bg-slate-950/40 border border-orange-500/5 rounded-2xl">
              <div className="flex gap-2 items-start text-[9px] text-slate-400 leading-relaxed font-mono">
                <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Interactive Node Builder:</strong>
                  <p className="mt-1">Glissez et déplacez les nœuds librement. Cliquez sur un connecteur orange d&apos;un nœud puis sur l&apos;entrée d&apos;un autre nœud pour former de nouvelles liaisons.</p>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Main Workflow/Canvas Area */}
          <div 
            ref={canvasRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className="lg:col-span-8 bg-[#090314] relative canvas-grid min-h-[460px] overflow-hidden flex-1"
          >
            {/* Ambient Background Grid and soft light spheres nested inside */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#130727]/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Connections SVG Layers for lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Live drawing line from active socket to cursor */}
              {connectingSource && (
                (() => {
                  const srcCoords = getNodeCoordinates(connectingSource.nodeId, 'output', connectingSource.outputIdx);
                  const dx = Math.abs(mousePos.x - srcCoords.x) * 0.5;
                  return (
                    <path
                      d={`M ${srcCoords.x} ${srcCoords.y} C ${srcCoords.x + dx} ${srcCoords.y}, ${mousePos.x - dx} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                      stroke="#f97316"
                      strokeWidth="2"
                      fill="none"
                      className="wire-path text-orange-500"
                    />
                  );
                })()
              )}

              {/* Static compiled lines from connections state */}
              {connections.map((c) => {
                const start = getNodeCoordinates(c.fromNode, 'output', c.fromOutputIdx);
                const end = getNodeCoordinates(c.toNode, 'input', c.toInputIdx);
                const isSelected = selectedNode === c.fromNode || selectedNode === c.toNode;
                const pathPulseActive = isSimulating || activePulses.includes(c.id);
                
                // Beautiful organic bezier control points
                const midX1 = start.x + Math.max(40, (end.x - start.x) * 0.45);
                const midX2 = end.x - Math.max(40, (end.x - start.x) * 0.45);

                const pathString = `M ${start.x} ${start.y} C ${midX1} ${start.y}, ${midX2} ${end.y}, ${end.x} ${end.y}`;

                return (
                  <g key={c.id}>
                    {/* Shadow outline background */}
                    <path
                      d={pathString}
                      stroke="rgba(0,0,0,0.5)"
                      strokeWidth="5"
                      fill="none"
                    />
                    
                    {/* Core connection glow wire */}
                    <path
                      d={pathString}
                      stroke={isSelected ? '#f97316' : 'url(#wire-gradient)'}
                      strokeWidth={isSelected ? 2.5 : 1.8}
                      fill="none"
                      className={`transition-colors duration-300 wire-path ${isSelected ? 'opacity-100' : 'opacity-85'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Let users remove connection by clicking link path
                        setConnections(prev => prev.filter(conn => conn.id !== c.id));
                        addConsoleLog('warn', 'BUILDER', 'Liaison retirée par action utilisateur.');
                        onNotify('🔗 Câble supprimé.');
                      }}
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    />

                    {/* Animated flow pulse energy particle */}
                    {pathPulseActive && (
                      <path
                        d={pathString}
                        stroke="#ffffff"
                        strokeWidth="3.5"
                        fill="none"
                        className="wire-pulse opacity-95"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive Nodes list strictly matching visual parameters */}
            {nodes.map((node) => {
              const IconComponent = node.icon;
              const isSelected = selectedNode === node.id;
              const isTrigger = node.type === 'trigger';

              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className="absolute z-10 w-[205px]"
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                >
                  <div 
                    className={`rounded-2xl overflow-hidden bg-[#110526]/95 border-2 transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.5)] ${
                      isSelected 
                        ? 'border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.3)] scale-[1.02]' 
                        : 'border-[#29164b] hover:border-orange-500/40'
                    }`}
                  >
                    
                    {/* Node Header */}
                    <div className={`px-3 py-2 flex items-center justify-between border-b ${
                      isTrigger ? 'bg-orange-500/10 border-orange-500/20' : 'bg-[#e11d48]/5 border-rose-500/10'
                    }`}>
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-3.5 h-3.5 ${isTrigger ? 'text-orange-500' : 'text-rose-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-100 truncate max-w-[125px]">{node.label}</span>
                      </div>
                      
                      {/* Delete node option bubble */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors border-none bg-transparent cursor-pointer"
                        title="Remove Node"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Node Sockets Columns */}
                    <div className="py-2.5 px-3 space-y-1.5 bg-[#0e041d]/80 text-[9px] font-semibold text-slate-300">
                      
                      {/* Sockets Row mapping */}
                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        
                        {/* Inputs Column on left */}
                        <div className="space-y-2">
                          {node.inputs.map((input, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 relative py-0.5 leading-none">
                              
                              {/* Sockets input circle trigger */}
                              <div
                                onClick={(e) => handleSocketClick(e, node.id, 'input', idx)}
                                className={`w-2.5 h-2.5 rounded-full border cursor-pointer hover:scale-125 transition-all absolute top-1/2 -translate-y-1/2 -left-[18.25px] border-black/40 ${
                                  input.color === 'green' ? 'bg-emerald-500' : 'bg-[#f97316]'
                                } ${connectingSource ? 'animate-pulse scale-110 shadow-2xl ring-2 ring-orange-500/50' : ''}`}
                                title="Click to Connect Input"
                              />
                              <span className="text-slate-400 text-[8.5px] font-medium leading-none pl-1 truncate select-none uppercase tracking-wide font-mono block">{input.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Outputs Column on right */}
                        <div className="space-y-2 text-right">
                          {node.outputs.map((output, idx) => (
                            <div key={idx} className="flex items-center justify-end gap-1.5 relative py-0.5 leading-none">
                              <span className="text-slate-400 text-[8.5px] font-medium leading-none pr-1 truncate select-none uppercase tracking-wide font-mono block">{output.name}</span>
                              
                              {/* Sockets output circle trigger */}
                              <div
                                onClick={(e) => handleSocketClick(e, node.id, 'output', idx)}
                                className={`w-2.5 h-2.5 rounded-full border cursor-pointer hover:scale-125 transition-all absolute top-1/2 -translate-y-1/2 -right-[18.25px] border-black/40 ${
                                  output.color === 'orange' ? 'bg-[#f97316]' : 'bg-emerald-500'
                                }`}
                                title="Click to wire Outward Link"
                              />
                            </div>
                          ))}
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

        </div>

        {/* Lower Logs Command OS Console */}
        <div className="bg-[#0f041f] border-t border-orange-500/10 p-5">
          <div className="flex items-center justify-between border-b border-[#24133f] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-[10.5px] font-black uppercase tracking-widest text-[#e2e8f0]">Tactical Orchestrator OS Logs</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e383] animate-ping" />
              <span className="text-[8px] text-slate-500 font-mono font-bold tracking-widest uppercase">STABLE HYPER-V PIPELINE</span>
            </div>
          </div>

          <div className="bg-slate-950/75 rounded-2xl p-4 h-[115px] overflow-y-auto font-mono text-[9.5px] text-orange-400 space-y-1.5 scrollbar-thin scrollbar-thumb-[#1e0e3a] scrollbar-track-transparent">
            {consoleLogs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <span className="text-slate-600 select-none shrink-0 font-extrabold">{log.timestamp}</span>
                <span className={`shrink-0 font-black px-1.5 py-0.5 rounded text-[7px] uppercase tracking-wider ${
                  log.type === 'error' ? 'bg-red-500/25 text-red-400' :
                  log.type === 'warn' ? 'bg-orange-500/25 text-orange-400' :
                  log.type === 'success' ? 'bg-emerald-500/25 text-emerald-400' :
                  'bg-blue-500/20 text-blue-300'
                }`}>{log.source}</span>
                <span className="text-slate-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
