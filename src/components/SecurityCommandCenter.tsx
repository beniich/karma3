import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Settings, 
  ListTodo, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  Play, 
  RefreshCw,
  Plus,
  HelpCircle,
  FileText,
  Lock,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  X,
  FileCode,
  CheckCircle2,
  AlertOctagon,
  Fingerprint,
  Radio,
  History,
  Terminal,
  Cpu
} from 'lucide-react';
import { TacticalResponseRuleEngine } from './TacticalResponseRuleEngine';
import { SovereignWAFSandbox } from './SovereignWAFSandbox';
import { HighFidelityIcon } from './HighFidelityIcon';
import { scanInput, SecurityStatus } from '../lib/securityShield';

interface Threat {
  id: string;
  source: string;
  severity: 'Critical' | 'Warning' | 'Low';
  details: string;
  mitigated: boolean;
}

const INITIAL_THREATS: Threat[] = [
  { id: 'THR-81', source: 'IP 185.120.44.200', severity: 'Critical', details: 'Brute-force SSH attack signature on Zone-A-Rack2', mitigated: false },
  { id: 'THR-82', source: 'Rogue Device 405', severity: 'Critical', details: 'Unsigned firmware load attempted', mitigated: false },
  { id: 'THR-83', source: 'Subnet 10.0.4.0/24', severity: 'Warning', details: 'Irregular packet volumetric throughput spike', mitigated: false },
  { id: 'THR-84', source: 'Token System-Root-01', severity: 'Low', details: 'Admin access outside business hours parameters', mitigated: false }
];

export const SecurityCommandCenter = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [threats, setThreats] = useState<Threat[]>(INITIAL_THREATS);
  const [showThreatDetails, setShowThreatDetails] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [secTab, setSecTab] = useState<'overview' | 'rule-engine' | 'waf'>('overview');
  
  // Policies active states triggering score updates
  const [policies, setPolicies] = useState([
    { id: 'pol-iso', name: 'ISO-27001 Multiplatform standard key setup', active: true, value: 30 },
    { id: 'pol-soc', name: 'SOC-2 real-time continuous compliance telemetry', active: true, value: 25 },
    { id: 'pol-hip', name: 'GDPR client-side absolute cryptography rule', active: true, value: 20 },
    { id: 'pol-tls', name: 'Force TLS 1.3 only on satellite backhauls', active: false, value: 17 }
  ]);

  const [healthScores, setHealthScores] = useState({
    firewall: 94,
    intrusionPrevention: 88,
    credentialVault: 95
  });

  // Calculate compliance score on-the-fly based on toggled policies
  const totalComplianceScore = policies.reduce((acc, pol) => {
    return acc + (pol.active ? pol.value : 0);
  }, 10); // Base 10 score

  const handleMitigateThreat = (id: string, name: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, mitigated: true } : t));
    onNotify(`🛡️ Menace ${id} (${name}) neutralisée avec succès.`);
  };

  const handleTogglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.active;
        onNotify(`⚖️ Commutation de stratégie : ${p.name} -> ${nextState ? 'ACTIVER' : 'DÉSACTIVER'}`);
        return { ...p, active: nextState };
      }
      return p;
    }));
  };

  const handleRegenHealth = () => {
    setHealthScores({
      firewall: Math.floor(Math.random() * 8) + 92,
      intrusionPrevention: Math.floor(Math.random() * 12) + 84,
      credentialVault: Math.floor(Math.random() * 5) + 95
    });
    onNotify('📊 Audit de santé des clusters cryptographiques régénéré.');
  };

  const activeThreatsCount = threats.filter(t => !t.mitigated && t.severity === 'Critical').length;

  return (
    <div className="space-y-8 font-sans text-[#cbd5e1] p-1 md:p-4 text-left select-none relative">
      
      {/* Visual background noise */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
            <span className="w-2.5 h-7 bg-orange-500 rounded-full inline-block" />
            SECURITY COMMAND CENTER HUB
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            SOVEREIGN DEVICE NEXUS - Security and Compliance Dashboard
          </p>
        </div>

        <button 
          onClick={handleRegenHealth}
          className="px-4 py-2.5 bg-[#1b0e3e] hover:bg-[#251554] border border-[#3e238f]/60 hover:border-orange-500/50 text-orange-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-orange-400" /> RE-AUDIT SECURITY
        </button>
      </div>

      {/* Sub-Tab Navigation Toggle */}
      <div className="flex border-b border-slate-800/80 gap-6 pb-px">
        <button
          type="button"
          onClick={() => setSecTab('overview')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${secTab === 'overview' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Overview & Threats
        </button>
        <button
          type="button"
          onClick={() => setSecTab('rule-engine')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${secTab === 'rule-engine' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Tactical Response Engine
          <span className="text-[8px] bg-orange-600/30 text-orange-400 font-extrabold border border-orange-500/30 px-1.5 py-0.5 rounded-full uppercase animate-pulse">ACTIVE</span>
        </button>
        <button
          type="button"
          onClick={() => setSecTab('waf')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${secTab === 'waf' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Sovereign WAF Shield
          <span className="text-[8px] bg-emerald-600/35 text-emerald-400 font-extrabold border border-emerald-500/30 px-1.5 py-0.5 rounded-full uppercase">SECURE</span>
        </button>
      </div>

      {secTab === 'rule-engine' && (
        <TacticalResponseRuleEngine onNotify={onNotify} />
      )}

      {secTab === 'waf' && (
        <SovereignWAFSandbox onNotify={onNotify} />
      )}

      {secTab === 'overview' && (
        <>
          {/* Row 1 Grid: Threat and Policy panels matched perfectly with Screenshot 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Module 1: THREAT DETECTION STATUS */}
        <div className="bg-[#1b103c]/45 border border-[#372375]/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest font-mono">THREAT DETECTION STATUS</h3>
            
            <div className="flex items-center gap-6">
              {/* Massive orange shield alert icon, using HighFidelityIcon for pure elegance */}
              <HighFidelityIcon variant="danger" size="xl" className="shrink-0">
                <ShieldAlert />
              </HighFidelityIcon>

              {/* Counts display info */}
              <div className="space-y-1">
                <div className="text-2xl font-black italic text-white leading-tight uppercase">CRITICAL ALERTS: {activeThreatsCount}</div>
                <div className="text-lg font-bold text-orange-450 uppercase tracking-tight">ACTIVE THREATS: {threats.filter(t=>!t.mitigated).length}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowThreatDetails(true)}
            className="w-full sm:w-auto self-start px-9 py-4.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-450 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg text-center mt-8 cursor-pointer"
          >
            VIEW DETAILS
          </button>
        </div>

        {/* Module 2: POLICY MANAGEMENT */}
        <div className="bg-[#1b103c]/45 border border-[#372375]/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest font-mono">POLICY MANAGEMENT</h3>
            
            <div className="flex items-center gap-6">
              {/* Massive orange gears lock icon replicated image */}
              <div className="w-24 h-24 bg-orange-600/20 text-orange-500 rounded-3xl border border-orange-500/35 flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.15)] shrink-0">
                <Lock className="w-12 h-12" />
              </div>

              {/* Scores display info */}
              <div className="space-y-1">
                <div className="text-2xl font-black italic text-white leading-tight uppercase">COMPLIANCE SCORE: {totalComplianceScore}%</div>
                <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider font-mono">POLICIES APPLIED: {policies.filter(p=>p.active).length} | PENDING: {policies.filter(p=>!p.active).length}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPolicies(true)}
            className="w-full sm:w-auto self-start px-9 py-4.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-450 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg text-center mt-8 cursor-pointer"
          >
            MANAGE POLICIES
          </button>
        </div>

      </div>

      {/* Row 2 split: Recent Activity Log and Device Security Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Bottom Panel: RECENT ACTIVITY LOG */}
        <div className="lg:col-span-7 bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-xl h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">RECENT ACTIVITY LOG</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-semibold">Decentralized syslog monitoring node anomalies.</p>
              </div>
              <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/35 px-2.5 py-1 rounded-full uppercase font-mono">AUDIT: LIVE</span>
            </div>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
              <div className="border-l-2 border-orange-500/60 pl-4 py-1 text-xs">
                <div className="flex justify-between font-mono text-[9px] text-slate-500">
                  <span>ROOT-COMMAND-NODE-01</span>
                  <span>2 seconds ago</span>
                </div>
                <p className="text-slate-300 font-medium mt-1">Event logged: Certificate validated successfully for device connection.</p>
              </div>
              
              <div className="border-l-2 border-red-500/60 pl-4 py-1 text-xs">
                <div className="flex justify-between font-mono text-[9px] text-slate-500">
                  <span>EXTERNAL-SSH-IP</span>
                  <span>10 minutes ago</span>
                </div>
                <p className="text-slate-305 font-medium mt-1">Abnormal penetration probe detected on ports: <span className="text-orange-400 font-mono">22, 2222</span>.</p>
              </div>

              <div className="border-l-2 border-[#3e238f]/60 pl-4 py-1 text-xs">
                <div className="flex justify-between font-mono text-[9px] text-slate-500">
                  <span>SENTINEL-GATEWAY-ALPHA</span>
                  <span>1 hour ago</span>
                </div>
                <p className="text-slate-300 font-medium mt-1">Hourly automated key rotation protocol executed; payload entropy verified.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Bottom Panel: DEVICE SECURITY HEALTH WITH STATUS BARS */}
        <div className="lg:col-span-5 bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-xl h-full">
          <div className="mb-6">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">DEVICE SECURITY HEALTH</h4>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold font-sans">Current integrity health check metrics across core clusters.</p>
          </div>

          <div className="space-y-5">
            {/* Status Bar 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#cbd5e1] font-bold">FIREWALL GATEWAY</span>
                <span className="text-orange-400 font-black">{healthScores.firewall}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#150a30] rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${healthScores.firewall}%` }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </div>

            {/* Status Bar 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#cbd5e1] font-bold">INTRUSION PREVENTION</span>
                <span className="text-orange-400 font-black">{healthScores.intrusionPrevention}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#150a30] rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${healthScores.intrusionPrevention}%` }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </div>

            {/* Status Bar 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#cbd5e1] font-bold">ENCRYPTED CREDENTIAL VAULT</span>
                <span className="text-orange-400 font-black">{healthScores.credentialVault}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#150a30] rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${healthScores.credentialVault}%` }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
      </>
      )}

      {/* Threats Live mitigation Modal */}
      <AnimatePresence>
        {showThreatDetails && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0827] border border-orange-500/30 rounded-[2.5rem] shadow-2xl p-7 max-w-lg w-full text-left space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-md font-extrabold text-white uppercase tracking-wider flex items-center gap-3">
                  <HighFidelityIcon variant="danger" size="sm">
                    <ShieldAlert />
                  </HighFidelityIcon>
                  INCIDENTS SECURE LOG & RESOLUTION
                </h3>
                <button onClick={() => setShowThreatDetails(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
                {threats.map((threat) => (
                  <div key={threat.id} className="p-4 bg-[#140b2f] border border-[#3e238f]/60 rounded-2xl flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase text-white ${threat.severity === 'Critical' ? 'bg-red-650 bg-red-600' : threat.severity === 'Warning' ? 'bg-amber-550 bg-amber-500' : 'bg-slate-700'}`}>
                          {threat.severity}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">{threat.id} - {threat.source}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-medium">{threat.details}</p>
                    </div>

                    <button
                      disabled={threat.mitigated}
                      onClick={() => handleMitigateThreat(threat.id, threat.source)}
                      className={`px-4 py-2 text-[10px] font-black rounded-lg uppercase tracking-wider text-white transition-all shrink-0 ${threat.mitigated ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/20' : 'bg-orange-600 hover:bg-orange-500 cursor-pointer'}`}
                    >
                      {threat.mitigated ? 'Mitigated' : 'Mitigate'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-right pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowThreatDetails(false)}
                  className="px-6 py-2.5 bg-[#1b0e3e] hover:bg-[#251554] border border-[#3e238f]/60 rounded-xl text-[10px] font-black text-slate-305 uppercase"
                >
                  Close Console
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Policy management controls Modal */}
      <AnimatePresence>
        {showPolicies && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0827] border border-orange-500/30 rounded-[2.5rem] shadow-2xl p-7 max-w-lg w-full text-left space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-md font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-450" />
                  COMPLIANCE STRATEGY ENFORCEMENT
                </h3>
                <button onClick={() => setShowPolicies(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-semibold uppercase leading-snug">
                Basculez les commutateurs pour appliquer les cadres réglementaires. La modification d'un statut recalcule automatiquement votre note de souveraineté.
              </p>

              <div className="space-y-4">
                {policies.map((pol) => (
                  <div key={pol.id} className="flex justify-between items-center gap-6 p-3.5 bg-[#140b2f] border border-slate-800 rounded-2xl">
                    <div className="space-y-0.5 flex-1">
                      <div className="text-xs font-bold text-white uppercase font-sans leading-snug">{pol.name}</div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase font-black">IMPACT: +{pol.value}% TO SCORE</span>
                    </div>

                    {/* Highly finished custom slide-toggle checkbox representation matching administrative toggles */}
                    <button
                      onClick={() => handleTogglePolicy(pol.id)}
                      className={`w-13 h-7 rounded-full transition-all flex items-center p-1 cursor-pointer ${pol.active ? 'bg-orange-600 justify-end' : 'bg-slate-800 justify-start'}`}
                    >
                      <motion.div 
                        layout 
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">AGGREGATED SPEC:</span>
                  <div className="text-sm font-black text-orange-400">SCORE: {totalComplianceScore}% / 100%</div>
                </div>
                <button
                  onClick={() => setShowPolicies(false)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                >
                  Commit Strategies
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
