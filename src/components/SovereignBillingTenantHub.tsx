import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  CreditCard, 
  Cpu,
  Users, 
  Key, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Zap, 
  RefreshCw, 
  AlertTriangle, 
  Terminal, 
  ArrowUpRight, 
  Lock, 
  Fingerprint, 
  CheckCircle2, 
  ArrowRight, 
  UserPlus 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation.tsx';

// Preset Tenant structures
interface SeatedOperator {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Operator' | 'Watcher' | 'Auditor';
  clearance: string;
  status: 'Active' | 'Suspended' | 'Idle';
}

interface TenantWorkspace {
  id: string;
  name: string;
  avatar: string;
  region: string;
  confidentiality: string;
  activeUsers: SeatedOperator[];
}

const DEFAULT_WORKSPACES: TenantWorkspace[] = [
  {
    id: "TEN-DELTA-01",
    name: "Delta Sovereign Systems",
    avatar: "🔺",
    region: "France (Gravelines Enclave)",
    confidentiality: "SECRET DÉFENSE (Classified)",
    activeUsers: [
      { id: "OP-01", name: "Beniich Owner", email: "beniich.contact@gmail.com", role: "Owner", clearance: "L5-Sovereign", status: 'Active' },
      { id: "OP-02", name: "Marc Lefebvre", email: "m.lefebvre@sov-energy.gouv.fr", role: "Operator", clearance: "L3-SecOps", status: 'Active' },
      { id: "OP-03", name: "Elena Rostova", email: "e.rostova@sov-energy.gouv.fr", role: "Auditor", clearance: "L4-Audit", status: 'Idle' }
    ]
  },
  {
    id: "TEN-SIGMA-02",
    name: "Sigma Aerospace Europe",
    avatar: "🛰️",
    region: "Luxembourg (Bissen Tier IV)",
    confidentiality: "RESTRICTED INDUSTRIE",
    activeUsers: [
      { id: "OP-04", name: "Jean-Pierre Boss", email: "ceo@sigma-aviation.lu", role: "Owner", clearance: "L4-Sovereign", status: 'Active' },
      { id: "OP-05", name: "Sophie Dupont", email: "s.dupont@sigma-aviation.lu", role: "Watcher", clearance: "L2-Standard", status: 'Suspended' }
    ]
  },
  {
    id: "TEN-ALPHA-03",
    name: "Alpha Threat intelligence",
    avatar: "☣️",
    region: "Germany (Frankfurt Core Hub)",
    confidentiality: "INTERIOR INTEL ONLY",
    activeUsers: [
      { id: "OP-06", name: "Cyber Commander", email: "intel-lead@alpha-threat.de", role: "Owner", clearance: "L5-Sovereign", status: 'Active' }
    ]
  }
];

export const SovereignBillingTenantHub = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const { t } = useTranslation();
  
  // Persistent or initial state
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'tokens' | 'tenants'>('overview');
  
  // Subscriptions State
  const [activePlan, setActivePlan] = useState<'free' | 'standard' | 'enterprise'>('standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  
  // Tokens State (Stored in localStorage or initialised)
  const [tokenBalance, setTokenBalance] = useState<number>(() => {
    const saved = localStorage.getItem('auditax-hub-tokens');
    return saved ? parseInt(saved, 10) : 3250;
  });

  const [tokenTransactions, setTokenTransactions] = useState<any[]>(() => {
    return [
      { id: "TX-901", desc: "Sovereign API Call : Code Security Audit", cost: -150, timestamp: "2h ago", status: "Succeeded" },
      { id: "TX-902", desc: "Token Pack Purchase (Credit Card #4421)", cost: 1500, timestamp: "5h ago", status: "Succeeded" },
      { id: "TX-903", desc: "Automated Routine System Logging check", cost: -50, timestamp: "1d ago", status: "Succeeded" }
    ];
  });

  // Multi-Tenancy/Multi-User States
  const [workspaces, setWorkspaces] = useState<TenantWorkspace[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("TEN-DELTA-01");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceRegion, setNewWorkspaceRegion] = useState("");
  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false);
  
  // Dynamic user form
  const [newOpName, setNewOpName] = useState('');
  const [newOpEmail, setNewOpEmail] = useState('');
  const [newOpRole, setNewOpRole] = useState<'Owner' | 'Operator' | 'Watcher' | 'Auditor'>('Operator');
  const [newOpClearance, setNewOpClearance] = useState('L3-SecOps');
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Buy token modal simulation
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedTokenPack, setSelectedTokenPack] = useState({ amount: 1500, price: 150 });

  // Sync token balance with localStorage
  useEffect(() => {
    localStorage.setItem('auditax-hub-tokens', tokenBalance.toString());
  }, [tokenBalance]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Logic handlers
  const handleUpgradePlan = (plan: 'free' | 'standard' | 'enterprise') => {
    setActivePlan(plan);
    const planName = plan === 'free' ? 'Free Sandbox' : plan === 'standard' ? 'Standard Pro' : 'Enterprise Core';
    onNotify(`✨ Abonnement réaligné vers : ${planName}`);
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber) {
      onNotify('⚠️ Veuillez insérer les coordonnées de votre carte de crédit de test.');
      return;
    }
    onNotify('🛡️ Traitement 3D-Secure de secours en cours ...');
    setTimeout(() => {
      onNotify('✅ Transaction de facturation émulée avec succès via le proxy Stripe Sandbox.');
      setCardName('');
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');
    }, 1500);
  };

  const handleBuyTokens = () => {
    setTokenBalance(prev => prev + selectedTokenPack.amount);
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setTokenTransactions(prev => [
      {
        id: `TX-${Math.floor(100 + Math.random() * 900)}`,
        desc: `Micro-Recharge de ${selectedTokenPack.amount} jetons d'audit`,
        cost: selectedTokenPack.amount,
        timestamp: `${timeStr} (Simulated)`,
        status: "Succeeded"
      },
      ...prev
    ]);

    setIsBuyModalOpen(false);
    onNotify(`🪙 ${selectedTokenPack.amount} jetons ajoutés à votre balance opérationnelle !`);
  };

  const handleSimulateTokenConsumption = (action: string, cost: number) => {
    if (tokenBalance < cost) {
      onNotify('🚨 Votre solde de jetons est insuffisant pour initier cette expertise de sécurité.');
      return;
    }
    setTokenBalance(prev => prev - cost);
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTokenTransactions(prev => [
      {
        id: `TX-${Math.floor(100 + Math.random() * 900)}`,
        desc: `${action} (Retrait de ressources)`,
        cost: -cost,
        timestamp: `${timeStr} (Simulated)`,
        status: "Succeeded"
      },
      ...prev
    ]);
    onNotify(`⚡ Consommation : ${cost} jetons d'audit pour "${action}".`);
  };

  // Add operator to workspace
  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpName || !newOpEmail) {
      onNotify('⚠️ Informations d\'opérateur incomplètes.');
      return;
    }

    const newOp: SeatedOperator = {
      id: `OP-${Math.floor(100 + Math.random() * 900)}`,
      name: newOpName,
      email: newOpEmail,
      role: newOpRole,
      clearance: newOpClearance,
      status: 'Active'
    };

    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          activeUsers: [...w.activeUsers, newOp]
        };
      }
      return w;
    }));

    setNewOpName('');
    setNewOpEmail('');
    setIsAddingUser(false);
    onNotify(`👥 Nouvel opérateur assis : ${newOp.name} assigné au tenant.`);
  };

  // Delete operator
  const handleDeleteOperator = (opId: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          activeUsers: w.activeUsers.filter(u => u.id !== opId)
        };
      }
      return w;
    }));
    onNotify(`🧹 Opérateur déconnecté du terminal local.`);
  };

  // Create new tenant workspace
  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName) {
      onNotify('⚠️ Veuillez assigner un nom au nouveau tenant cryptographique.');
      return;
    }

    const newWorkspace: TenantWorkspace = {
      id: `TEN-${newWorkspaceName.slice(0, 5).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newWorkspaceName,
      avatar: "⚙️",
      region: newWorkspaceRegion || "Europe West Enclave (Fallback)",
      confidentiality: "OPERATIONAL STAGE",
      activeUsers: [
        { id: "OP-AUTO", name: "Beniich Owner", email: "beniich.contact@gmail.com", role: "Owner", clearance: "L5-Sovereign", status: 'Active' }
      ]
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
    setNewWorkspaceName('');
    setNewWorkspaceRegion('');
    setIsAddingWorkspace(false);
    onNotify(`📂 Tenant "${newWorkspace.name}" créé avec isolation logique.`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#cbd5e1] font-sans pb-12 text-left">
      
      {/* Immersive futuristic visual header */}
      <div className="bg-[#140b2f]/85 border border-[#372375]/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-orange-500/10 text-orange-400 font-extrabold border border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                CORE SUITE PRO | SOVEREIGN CRYPTO CONSOLE
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                CONNECTED
              </span>
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Gestionnaire d'Infrastructures, Jetons &amp; Multi-Utilisateurs
            </h3>
            <p className="text-xs text-slate-400 font-medium max-w-2xl leading-relaxed">
              Consolide la supervision globale des abonnements d'enclaves, du solde de jetons d'audit préjudiciels, et du partitionnement multi-tenants des opérateurs cryptographiques autorisés.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0 bg-[#0c051f]/80 p-4 border border-[#372375]/40 rounded-2xl min-w-[240px]">
            <div className="flex-1 text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[8px]">Plan Actif</div>
              <div className="text-md font-black text-white uppercase mt-1">
                {activePlan === 'free' ? 'Free Sandbox' : activePlan === 'standard' ? 'Standard Pro' : 'Enterprise Core'}
              </div>
            </div>
            <div className="border-r border-slate-800" />
            <div className="flex-grow text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[8px]">Jetons</div>
              <div className="text-md font-black text-orange-400 mt-1 flex items-center justify-center gap-1.5">
                <Coins className="w-4 h-4" />
                {tokenBalance.toLocaleString()} 🪙
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Console Navigation Row */}
      <div className="flex flex-wrap gap-4 border-b border-slate-800/80 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Vue d'ensemble AuditAX
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'subscriptions' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Abonnements de Sécurité (Stripe)
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'tokens' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          Jetons d'Audit &amp; Consommation
        </button>
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'tenants' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Multi-Utilisateurs &amp; Tenants ({workspaces.length})
        </button>
      </div>

      {/* Displaying contents based on tabs */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Subscription status */}
              <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-sky-500/15 text-sky-450 border border-sky-500/30 font-black px-2.5 py-0.5 rounded-full uppercase font-mono">
                      PLANS &amp; SLAS
                    </span>
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                  </div>
                  <h4 className="text-white text-md font-black mt-4 uppercase">License d'enclaves active</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Votre Workspace utilise actuellement le plan <strong className="text-sky-300 uppercase">{activePlan}</strong>. Les enclaves restent isolées géographiquement.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-900/60 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-mono">Uptime SLA: 99.98%</span>
                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className="text-[9px] text-orange-400 font-black flex items-center gap-1 uppercase hover:underline"
                  >
                    Gérer l'abonnements <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2: Token Metrics */}
              <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-orange-500/15 text-orange-450 border border-orange-500/30 font-black px-2.5 py-0.5 rounded-full uppercase font-mono">
                      WALLET &amp; LIMITS
                    </span>
                    <Coins className="w-5 h-5 text-orange-400" />
                  </div>
                  <h4 className="text-white text-md font-black mt-4 uppercase">Jetons d'Audit Souverains</h4>
                  <div className="mt-2 text-2xl font-black text-orange-400 font-mono">{tokenBalance.toLocaleString()} <span className="text-xs">COINS</span></div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Nécessaires pour générer des cryptogrammes validés ou pour auditer des scripts d meute.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-900/60 flex justify-between items-center">
                  <span className="text-[10px] text-emerald-400 font-mono">Zone Saine / Liquidité active</span>
                  <button
                    onClick={() => setActiveTab('tokens')}
                    className="text-[9px] text-orange-400 font-black flex items-center gap-1 uppercase hover:underline cursor-pointer"
                  >
                    Recharger / Utiliser <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 3: Seated Operators */}
              <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-emerald-500/15 text-emerald-450 border border-emerald-500/30 font-black px-2.5 py-0.5 rounded-full uppercase font-mono">
                      OPERATOR SEATS
                    </span>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-white text-md font-black mt-4 uppercase">Tenancy &amp; Utilisateurs</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Tenant actif : <strong className="text-emerald-300 font-mono">{activeWorkspace.name}</strong> avec <strong className="text-emerald-300">{activeWorkspace.activeUsers.length} opérateurs</strong> certifiés.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-900/60 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-mono">Region: {activeWorkspace.region.split(' ')[0]}</span>
                  <button
                    onClick={() => setActiveTab('tenants')}
                    className="text-[9px] text-orange-400 font-black flex items-center gap-1 uppercase hover:underline cursor-pointer"
                  >
                    Configurer la Tenancy <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick action section */}
            <div className="bg-[#100727]/40 border border-[#271754]/40 rounded-3xl p-6">
              <h4 className="text-xs font-black uppercase text-white tracking-widest mb-3">ACTIONNEUR DE COMPTABILITÉ RAPIDE (SANDBOX)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setIsBuyModalOpen(true)}
                  className="p-4 bg-orange-600/10 hover:bg-orange-650/25 border border-orange-500/35 hover:border-orange-500 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="text-[9px] text-orange-400 font-black uppercase tracking-wider font-mono">SIMULATION COIN PACK</div>
                    <div className="text-xs font-black text-white mt-1 group-hover:text-orange-400 transition-colors">Acheter des Jetons (+1500)</div>
                  </div>
                  <Coins className="w-5 h-5 text-orange-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleSimulateTokenConsumption("AI Smart Auditer Code Analysis", 150)}
                  className="p-4 bg-indigo-600/10 hover:bg-indigo-650/25 border border-indigo-500/35 hover:border-indigo-500 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="text-[9px] text-indigo-400 font-black uppercase tracking-wider font-mono">SIMULATE USAGE</div>
                    <div className="text-xs font-black text-white mt-1">Audit IA (-150 Jetons)</div>
                  </div>
                  <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleSimulateTokenConsumption("Military SLA Enclave Verification", 300)}
                  className="p-4 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/25 border border-[#7c3aed]/35 hover:border-[#7c3aed] rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="text-[9px] text-purple-400 font-black uppercase tracking-wider font-mono">SLA TRIGGER</div>
                    <div className="text-xs font-black text-white mt-1">Sceau SecOps (-300 Jetons)</div>
                  </div>
                  <Lock className="w-5 h-5 text-purple-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Simulated Live Transaction Feed */}
            <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 text-left space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Flux de Journal de Ressources de l'Opérateur</h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {tokenTransactions.slice(0, 4).map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#0d0421] border border-[#271754]/30 rounded-xl font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${tx.cost < 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-450'}`}>
                        {tx.cost < 0 ? '▼' : '▲'}
                      </div>
                      <span className="font-bold text-slate-300">{tx.desc}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-[10px]">{tx.timestamp}</span>
                      <span className={`font-black ${tx.cost < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {tx.cost > 0 ? `+${tx.cost}` : tx.cost} 🪙
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Cycle Control */}
            <div className="flex justify-center">
              <div className="bg-[#0b031b] p-1.5 rounded-2xl border border-[#3e238f]/40 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-205'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    billingCycle === 'yearly' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-205'
                  }`}
                >
                  Annuel (-15%)
                </button>
              </div>
            </div>

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Free Plan */}
              <div className={`bg-[#12072b]/60 border rounded-[2.2rem] p-6.5 shadow-xl relative flex flex-col justify-between ${
                activePlan === 'free' ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-[#382079]/45'
              }`}>
                {activePlan === 'free' && (
                  <span className="absolute top-4 right-4 bg-orange-600/20 border border-orange-500 text-orange-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest">
                    ACTIVE PLAN
                  </span>
                )}
                <div>
                  <span className="text-[9px] text-[#cbd5e1] font-black uppercase tracking-widest font-mono">DEVELOPER HUB</span>
                  <h4 className="text-white text-xl font-black mt-2">Free Sandbox</h4>
                  <div className="text-3xl font-black text-rose-500 mt-4">0 € <span className="text-xs text-slate-400 font-medium">/ month</span></div>
                  <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                    Accès d'évaluation initial et simulation de l'environnement complet de qualification dans un cloud publique partagé.
                  </p>
                  
                  <div className="border-t border-slate-900 pt-4 mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">SLA Standard (99.0%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">1 Tenant de test autorisé</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">50 jetons d'audits mensuels</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradePlan('free')}
                  disabled={activePlan === 'free'}
                  className={`mt-8 w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activePlan === 'free' 
                      ? 'bg-emerald-650/20 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800 hover:bg-slate-705 border border-slate-700/60 text-white cursor-pointer'
                  }`}
                >
                  {activePlan === 'free' ? 'Sélectionné' : 'Rétrograder'}
                </button>
              </div>

              {/* Standard Pro Plan */}
              <div className={`bg-[#12072b]/60 border rounded-[2.2rem] p-6.5 shadow-xl relative overflow-hidden flex flex-col justify-between ${
                activePlan === 'standard' ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-[#382079]/45'
              }`}>
                <div className="absolute -right-12 -top-12 w-28 h-28 bg-orange-650/10 rounded-full blur-2xl" />
                {activePlan === 'standard' && (
                  <span className="absolute top-4 right-4 bg-orange-600/20 border border-orange-500 text-orange-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest">
                    ACTIVE PLAN
                  </span>
                )}
                <div>
                  <span className="text-[9px] text-[#cbd5e1] font-black uppercase tracking-widest font-mono">ALIGNEMENT TACTIQUE</span>
                  <h4 className="text-white text-xl font-black mt-2">Standard Pro</h4>
                  <div className="text-3xl font-black text-rose-500 mt-4">
                    {billingCycle === 'monthly' ? '499 €' : '420 €'} <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                    La certification de protection de calibre militaire pour les infrastructures souveraines indépendantes.
                  </p>
                  
                  <div className="border-t border-slate-900 pt-4 mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">SLA de Secours de 99.9%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">3 Tenants d'isolations logiques</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">1,500 jetons d'audits mensuels</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-455 shrink-0" />
                      <span className="text-[11px] text-slate-300">Filtre anti-injection WAF actif</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradePlan('standard')}
                  disabled={activePlan === 'standard'}
                  className={`mt-8 w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activePlan === 'standard' 
                      ? 'bg-emerald-650/20 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-orange-600 hover:bg-orange-550 text-white cursor-pointer shadow-lg shadow-orange-600/15'
                  }`}
                >
                  {activePlan === 'standard' ? 'Sélectionné' : 'Passer à Standard Pro'}
                </button>
              </div>

              {/* Enterprise Core Plan */}
              <div className={`bg-[#12072b]/60 border rounded-[2.2rem] p-6.5 shadow-xl relative overflow-hidden flex flex-col justify-between ${
                activePlan === 'enterprise' ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-[#382079]/45'
              }`}>
                {activePlan === 'enterprise' && (
                  <span className="absolute top-4 right-4 bg-orange-600/20 border border-orange-500 text-orange-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest">
                    ACTIVE PLAN
                  </span>
                )}
                <div>
                  <span className="text-[9px] text-orange-450 font-black uppercase tracking-widest font-mono">SOUVERAINETÉ MAÎTRESSE</span>
                  <h4 className="text-white text-xl font-black mt-2 text-orange-400">Enterprise Core</h4>
                  <div className="text-3xl font-black text-rose-500 mt-4">
                    {billingCycle === 'monthly' ? '1 499 €' : '1 270 €'} <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                    Souveraineté totale de classe maître. Enclaves dédiées on-premise de chiffrement certifié et jetons illimités.
                  </p>
                  
                  <div className="border-t border-slate-900 pt-4 mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">SLA 100% garanti par contrat</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">Tenants multiples illimités</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-[11px] text-slate-300">Jetons d'audits et d'appels ILLIMITÉS</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-455 shrink-0" />
                      <span className="text-[11px] text-slate-300">Audit et support 24/7 de SecOps</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradePlan('enterprise')}
                  disabled={activePlan === 'enterprise'}
                  className={`mt-8 w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activePlan === 'enterprise' 
                      ? 'bg-emerald-650/20 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg shadow-indigo-650/15'
                  }`}
                >
                  {activePlan === 'enterprise' ? 'Sélectionné' : 'Passer à Enterprise Core'}
                </button>
              </div>

            </div>

            {/* Simulated Credit Card Payment Box */}
            <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6.5 shadow-xl max-w-2xl mx-auto text-left space-y-6">
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">STRIPE SECURE WEB PORTAL (SANDBOX MODE)</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-semibold">Simulate credential card registrations. Credentials are encrypted and isolated on client browser local storage.</p>
              </div>

              <form onSubmit={handleSimulatePayment} className="space-y-4 font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Nom de l'Opérateur (Sur la Carte)</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="BENIICH SECURE CONTACT"
                      className="w-full bg-[#090217] border border-[#3e238f]/60 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Numéro de carte de test</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-[#090217] border border-[#3e238f]/60 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Date d'expiration</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      placeholder="12/28"
                      className="w-full bg-[#090217] border border-[#3e238f]/60 rounded-xl p-3 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Code de Securité CVC</label>
                    <input
                      type="password"
                      required
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      maxLength={3}
                      placeholder="***"
                      className="w-full bg-[#090217] border border-[#3e238f]/60 rounded-xl p-3 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-550 hover:to-emerald-450 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <Lock className="w-4 h-4" />
                  ENREGISTRER LA CARTE STRIPE CRYPTOGRAPHIQUE [4242]
                </button>
              </form>
            </div>

          </motion.div>
        )}

        {/* TAB 3: TOKENS */}
        {activeTab === 'tokens' && (
          <motion.div
            key="tokens"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
          >
            {/* Top overview container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Token Wallet */}
              <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6.5 shadow-xl space-y-4">
                <span className="text-[9px] bg-orange-500/10 text-orange-400 font-extrabold border border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Sovereign Token Safe
                </span>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">SOLDE DE COIN AUDITAX</h4>
                
                <div className="bg-[#0b031b] border border-[#382079]/20 p-6 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase font-mono">Liquidity Wallet Balance</div>
                    <div className="text-3xl font-black text-orange-400 font-mono flex items-center gap-2">
                      <Coins className="w-7 h-7" />
                      {tokenBalance.toLocaleString()} 🪙
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsBuyModalOpen(true)}
                    className="px-5 py-3.5 bg-orange-600 hover:bg-orange-550 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Acheter des Jetons
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Les jetons d'audits souverains agissent comme le « Gaz » du réseau d'AuditAX. Chaque diagnostic d'intégrité, scan intelligent de code, et signature d'audit consomme des jetons.
                </p>
              </div>

              {/* Token Utilities Simulation */}
              <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6.5 shadow-xl space-y-4">
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-extrabold border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-mono animate-pulse">
                  API Token Gas Simulator
                </span>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Utiliser les Jetons d'Audit</h4>
                <p className="text-[11.5px] text-slate-400 font-semibold">Simulez des appels API automatiques ou des services d'isolation pour observer la comptabilité en temps réel.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleSimulateTokenConsumption("Analyse WAF Anti-Injection", 50)}
                    className="p-3 bg-[#1c1240]/45 border border-[#3c258d]/30 hover:border-orange-500 hover:bg-[#1a0e3f] rounded-xl text-left transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Scan WAF de Sécurité</div>
                      <span className="text-[10px] text-slate-500 font-bold font-mono">Cost: 50 Jetons</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleSimulateTokenConsumption("Audit de Conformité NIS2", 150)}
                    className="p-3 bg-[#1c1240]/45 border border-[#3c258d]/30 hover:border-orange-500 hover:bg-[#1a0e3f] rounded-xl text-left transition-all cursor-pointer flex justify-between items-center group animate-none"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Validation NIS2</div>
                      <span className="text-[10px] text-slate-500 font-bold font-mono">Cost: 150 Jetons</span>
                    </div>
                    <Cpu className="w-4 h-4 text-sky-450 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleSimulateTokenConsumption("Signature de Sceau Cryptographique", 250)}
                    className="p-3 bg-[#1c1240]/45 border border-[#3c258d]/30 hover:border-orange-500 hover:bg-[#1a0e3f] rounded-xl text-left transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Sceau .audit d'Intégrité</div>
                      <span className="text-[10px] text-slate-500 font-bold font-mono">Cost: 250 Jetons</span>
                    </div>
                    <Fingerprint className="w-4 h-4 text-purple-450 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleSimulateTokenConsumption("Deep Intel Sandbox Sandbox Mock", 500)}
                    className="p-3 bg-[#1c1240]/45 border border-[#3c258d]/30 hover:border-orange-500 hover:bg-[#1a0e3f] rounded-xl text-left transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Honeypot Sandbox Suite</div>
                      <span className="text-[10px] text-slate-500 font-bold font-mono font-sans">Cost: 500 Jetons</span>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
                  </button>
                </div>
              </div>

            </div>

            {/* Token Transactions Feed */}
            <div className="bg-[#12072b]/65 border border-[#382079]/45 rounded-3xl p-6.5 shadow-xl space-y-4">
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">HISTORIQUE BANCAIRE DES RESSOURCES D'AUDITAX</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Track resource deposits and consumptions with cryptographically structured logging values.</p>
              </div>

              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {tokenTransactions.map((tx, i) => (
                  <div key={i} className="p-4 bg-[#0d0421] border border-[#271754]/30 rounded-2xl flex justify-between items-center font-mono">
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono border ${
                          tx.cost < 0 
                            ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                          {tx.cost < 0 ? 'WITHDRAW' : 'RECHARGE'}
                        </span>
                        <span className="text-xs font-extrabold text-white">{tx.desc}</span>
                        <span className="text-[10px] text-slate-500">#{tx.id}</span>
                      </div>
                      <div className="text-[9px] text-slate-500">Transferred via Sovereign Sandbox Node • Active Audit Seal Verified</div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                      <span className={`font-black text-sm ${tx.cost < 0 ? 'text-red-400' : 'text-emerald-450'}`}>
                        {tx.cost > 0 ? `+${tx.cost}` : tx.cost} 🪙
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 4: TENANTS & MULTI-USER */}
        {activeTab === 'tenants' && (
          <motion.div
            key="tenants"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            
            {/* Split view: workspaces list left, active users right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* Left Column: Workspaces listing (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">TENANTS CRYPTOGRAPHIQUES ISOLÉS</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Select or spin up a new logically partitioned system container.</p>
                    </div>
                    
                    <button
                      onClick={() => setIsAddingWorkspace(prev => !prev)}
                      className="p-2 bg-slate-800 border border-slate-700/60 rounded-xl text-xs hover:bg-slate-700 hover:text-white transition-all text-slate-300 flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add workspace form option */}
                  <AnimatePresence>
                    {isAddingWorkspace && (
                      <motion.form
                        onSubmit={handleCreateWorkspace}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-[#0a031a] rounded-2xl border border-[#3e238f]/40 space-y-3 relative overflow-hidden"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Nom de la Tenancy / Institution</label>
                          <input
                            type="text"
                            required
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="Sovereign Core France SAS"
                            className="w-full bg-[#12072b] border border-[#3e238f]/60 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Zone Géographique de l'Enclave</label>
                          <input
                            type="text"
                            value={newWorkspaceRegion}
                            onChange={(e) => setNewWorkspaceRegion(e.target.value)}
                            placeholder="France (Gravelines Enclave)"
                            className="w-full bg-[#12072b] border border-[#3e238f]/60 rounded-xl p-2.5 text-xs text-white outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-orange-600 hover:bg-orange-550 text-white font-black text-xs uppercase rounded-xl tracking-wider transition-all cursor-pointer text-center"
                        >
                          Créer le Tenant Isolé
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Workspace selector map */}
                  <div className="space-y-3">
                    {workspaces.map((ws, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveWorkspaceId(ws.id);
                          onNotify(`📂 Basculement logique vers le tenant : ${ws.name}`);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                          ws.id === activeWorkspaceId 
                            ? 'bg-[#180a3a]/75 border-orange-500 shadow-md ring-1 ring-orange-500/10' 
                            : 'bg-[#180833]/25 border-[#271754]/30 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl shrink-0 p-2 bg-[#090217] border border-[#271754]/30 rounded-xl">
                            {ws.avatar}
                          </div>
                          <div>
                            <span className="text-[8.5px] font-mono text-[#00bcff] font-bold uppercase tracking-wider block">{ws.id}</span>
                            <span className="text-xs font-black text-white block truncate max-w-[180px]">{ws.name}</span>
                            <span className="text-[9px] text-slate-500 tracking-wide font-medium block mt-0.5">{ws.region}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[8px] bg-[#0c2c1c] text-[#10b981] border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                            {ws.activeUsers.length} Operators
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              {/* Right Column: Seated Operators inside active workspace (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6.5 shadow-xl space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        Active Workspace Members
                      </span>
                      <h4 className="text-md font-black text-white mt-2 uppercase">Opérateurs Associés • {activeWorkspace.name}</h4>
                    </div>

                    <button
                      onClick={() => setIsAddingUser(prev => !prev)}
                      className="px-4 py-2 bg-[#120c2b] border border-[#3e238f]/80 hover:bg-slate-900/40 text-slate-200 text-xs font-black uppercase rounded-xl transition-all tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Associer Opérateur
                    </button>
                  </div>

                  {/* Add User Operator Dynamic Form Overlay */}
                  <AnimatePresence>
                    {isAddingUser && (
                      <motion.form
                        onSubmit={handleAddOperator}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-5 bg-[#090217] rounded-2xl border border-[#3e238f]/60 space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Nom de l'Opérateur</label>
                            <input
                              type="text"
                              required
                              value={newOpName}
                              onChange={(e) => setNewOpName(e.target.value)}
                              placeholder="Sophia Loren"
                              className="w-full bg-[#12072b] border border-[#3e238f]/60 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wide">Adresse e-mail</label>
                            <input
                              type="email"
                              required
                              value={newOpEmail}
                              onChange={(e) => setNewOpEmail(e.target.value)}
                              placeholder="s.loren@audits.gouv.fr"
                              className="w-full bg-[#12072b] border border-[#3e238f]/60 rounded-xl p-2.5 text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-455 font-bold uppercase tracking-wide">Rôle de Clef</label>
                            <select
                              value={newOpRole}
                              onChange={(e: any) => setNewOpRole(e.target.value)}
                              className="w-full bg-[#12072b] border border-[#3e238f]/65 rounded-xl p-2.5 text-xs text-slate-300 outline-none"
                            >
                              <option value="Owner">Owner (Propriétaire)</option>
                              <option value="Operator">Operator (SecOps)</option>
                              <option value="Auditor">Auditor (Vérificateur)</option>
                              <option value="Watcher">Watcher (Enquêteur)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-455 font-bold uppercase tracking-wide">Habilitation de Sécurité</label>
                            <input
                              type="text"
                              value={newOpClearance}
                              onChange={(e) => setNewOpClearance(e.target.value)}
                              placeholder="L3-SecOps"
                              className="w-full bg-[#12072b] border border-[#3e238f]/60 rounded-xl p-2.5 text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingUser(false)}
                            className="px-4 py-2 text-xs text-slate-450 uppercase font-black"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-550 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Valider l'Opérateur
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Users Seating List */}
                  <div className="space-y-3">
                    {activeWorkspace.activeUsers.map((op, idx) => (
                      <div key={idx} className="p-4 bg-[#0d0421] border border-[#271754]/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/30 rounded-full flex items-center justify-center font-bold text-white text-md">
                            {op.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{op.name}</span>
                              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase font-mono rounded">
                                {op.role}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono block">{op.email}</span>
                          </div>
                        </div>

                        {/* Status/Actions */}
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-[8.5px] text-slate-400 block font-mono">Habilitation:</span>
                            <span className="text-[10px] text-[#00fcff] font-bold block uppercase font-mono">{op.clearance}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono ${
                            op.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : op.status === 'Suspended' 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {op.status}
                          </span>

                          {op.role !== 'Owner' && (
                            <button
                              onClick={() => handleDeleteOperator(op.id)}
                              className="p-1.5 bg-red-650/15 border border-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* MODAL SIMULATION FOR BUYING TOKENS */}
      <AnimatePresence>
        {isBuyModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0c051f] border border-[#3e238f]/60 rounded-[2.5rem] p-8 max-w-lg w-full text-left space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-orange-400 animate-spin-slow" />
                  <div>
                    <h4 className="text-[9px] text-slate-450 font-black font-mono uppercase tracking-wider">SECURE TOKEN RECHARGE HUB</h4>
                    <span className="text-md font-black text-white uppercase tracking-tight">Proxy de Jetons d'Audit</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsBuyModalOpen(false)}
                  className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Selector Package Grid */}
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Choisissez un volume cryptographique de jetons d'audit à allouer à votre terminal. Les transactions Stripe Sandbox simulent directement l'appel webhook.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { amount: 500, label: "MICRO", price: 50 },
                    { amount: 1500, label: "STANDARD", price: 150 },
                    { amount: 5000, label: "SOVEREIGN", price: 450 }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTokenPack({ amount: p.amount, price: p.price })}
                      className={`p-4 rounded-2xl text-center border transition-all cursor-pointer flex flex-col gap-1 ${
                        selectedTokenPack.amount === p.amount
                          ? 'bg-[#1b103c] border-orange-500 text-white shadow-md'
                          : 'bg-[#180833]/25 border-[#271754]/30 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-[8px] font-black uppercase font-mono text-cyan-400 tracking-wider mb-1">{p.label}</span>
                      <strong className="text-md font-black text-white block mt-0.5">+{p.amount} 🪙</strong>
                      <span className="text-[10px] text-orange-400 font-bold block font-mono">{p.price} €</span>
                    </button>
                  ))}
                </div>

                {/* Simulated webhook information box */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-450 shrink-0" />
                  <p className="text-[10px] leading-relaxed text-slate-300">
                    <strong>Processus Actif :</strong> L'approbation invoquera un événement Webhook Stripe factice. Votre balance sera rechargée instantanément sans déduction de fonds réels.
                  </p>
                </div>
              </div>

              {/* Action and Dismiss */}
              <div className="flex gap-3 pt-4 border-t border-slate-900">
                <button
                  onClick={() => setIsBuyModalOpen(false)}
                  className="flex-1 py-3 text-slate-400 hover:text-white bg-slate-800/40 rounded-xl text-xs uppercase font-black"
                >
                  Fermer
                </button>
                <button
                  onClick={handleBuyTokens}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-550 hover:to-orange-450 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg cursor-pointer text-center"
                >
                  Déclencher le Webhook Stripe Sandbox
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Internal mini icons
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
