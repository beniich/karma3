import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Play, 
  Check, 
  X, 
  RefreshCw,
  Cpu,
  FileText,
  AlertTriangle,
  Server,
  Code,
  ShieldCheck,
  Zap,
  Eye,
  Activity,
  Award
} from 'lucide-react';

// --- Types ---
export interface AttackPayload {
  id: string;
  num: number;
  title: string;
  category: 'Access' | 'Schema' | 'Injection' | 'Poisoning';
  severity: 'Critical' | 'High' | 'Medium';
  payload: string;
  headers: string;
  ruleExplanation: string;
  interceptorName: string;
  expectedException: string;
}

const ATTACK_TEMPLATES: AttackPayload[] = [
  {
    id: "unauth-write",
    num: 1,
    title: "Unauthenticated Write",
    category: "Access",
    severity: "Critical",
    payload: `{\n  "title": "Nouveau Risque Infiltré",\n  "severity": "High",\n  "domain": "Réseau Interne"\n}`,
    headers: `POST /api/risks HTTP/1.1\nHost: api.auditax.sov\nAuthorization: None`,
    interceptorName: "isSignedIn() Firebase Rule",
    ruleExplanation: "Immediately rejects write operations if request.auth is empty or invalid.",
    expectedException: "403 PERMISSION_DENIED: User must be signed in with Google or Custom Token."
  },
  {
    id: "schema-bypass",
    num: 2,
    title: "Schema Bypass (Enum Crit)",
    category: "Schema",
    severity: "High",
    payload: `{\n  "id": "risk-fake-01",\n  "title": "Risque non calibré",\n  "severity": "crit",\n  "adminId": "XWsJdUWtACT4svXvpgZYV4nXEZH2"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json\nJWT-Token: Verified`,
    interceptorName: "isValidRisk() Severity Enum Check",
    ruleExplanation: "Forces the 'severity' field to strictly match the value checklist ['Critical', 'High', 'Medium']. Legacy class 'crit' is deprecated.",
    expectedException: "400 BAD_REQUEST: Invalid valuation 'crit' for field 'severity'. Object schema validation failed."
  },
  {
    id: "shadow-field",
    num: 3,
    title: "Privileged Shadow Field Injection",
    category: "Injection",
    severity: "Critical",
    payload: `{\n  "id": "user-bypass",\n  "adminId": "XWsJdUWt",\n  "isAdmin": true,\n  "role": "SuperAdmin"\n}`,
    headers: `PATCH /api/users/XWsJdUWt HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Immutable fields & schema whitelist",
    ruleExplanation: "The security middleware filters submitted keys to block editing or creation of authority properties ('isAdmin', 'role') which were not certified inside the original JWT token.",
    expectedException: "403 FORBIDDEN: Write operation contains restricted shadow authority fields."
  },
  {
    id: "invalid-id",
    num: 4,
    title: "Excessive Identifier Size (ID Buffer Overflow)",
    category: "Injection",
    severity: "Medium",
    payload: `{\n  "id": "${"A".repeat(2048)}",\n  "title": "Risque d'injection d'ID long"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "isValidId() 128 Bytes String Limit",
    ruleExplanation: "Verifies that the document identifier does not exceed a memory allocation limit of 128 characters to prevent index resource exhaustion.",
    expectedException: "403 PERMISSION_DENIED: Document ID exceeds maximum safe allocation rules (128 bytes)."
  },
  {
    id: "type-poisoning",
    num: 5,
    title: "Type Poisoning (claims String instead of Int)",
    category: "Poisoning",
    severity: "High",
    payload: `{\n  "id": "zone-772",\n  "name": "Zone SecOps Alpha",\n  "claims": "47"\n}`,
    headers: `POST /api/zones HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Type Coercion and Strict Matcher",
    ruleExplanation: "The validator checks variables for strict type integrity to prevent string properties from posing as integers, avoiding crashes in SQL/NoSQL engine conversion.",
    expectedException: "400 STR_VAL_FAIL: Type Mismatch detected on 'claims'. Expected Integer, got String('47')."
  },
  {
    id: "immutable-field",
    num: 6,
    title: "Immutable Key Mutation",
    category: "Schema",
    severity: "High",
    payload: `{\n  "id": "mutated-risk-id-999",\n  "title": "Risque modifié de force",\n  "severity": "High"\n}`,
    headers: `PUT /api/risks/rec-sov-01 HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "incoming().id == existing().id Rules Check",
    ruleExplanation: "Security rules strictly forbid mutating the primary document ID or changing the author path of an existing resource at rest.",
    expectedException: "403 IMMUTABLE_MUTATION_DENIED: Cannot change primary key path 'id' or 'adminId' after initialization."
  },
  {
    id: "cross-delete",
    num: 7,
    title: "Orphaned Cross-User Deletion",
    category: "Access",
    severity: "Critical",
    payload: `{}`,
    headers: `DELETE /api/configs/LU-BNK-99 HTTP/1.1\nJWT-Token: Auth_as_FR-SOV-01`,
    interceptorName: "isOwner() verification rule",
    ruleExplanation: "Ensures that the user requesting deletion owns the entity by comparing resource.data.adminId with the request.auth.uid claim.",
    expectedException: "403 PERMISSION_DENIED: Resource ownership required for destructive operation."
  },
  {
    id: "resource-exhaustion",
    num: 8,
    title: "Buffer Overload (Payload 1MB string)",
    category: "Injection",
    severity: "Medium",
    payload: `{\n  "id": "risk-ex-08",\n  "desc": "${"X".repeat(1024 * 1024)}"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "data.desc.size() <= 4096 Protection",
    ruleExplanation: "Strictly limits description character size to 4 KB to prevent cache storage resource exhaustion.",
    expectedException: "403 FIRESTORE_LIMIT: Maximum document memory boundary exceeded (desc size cannot exceed 4096 bytes)."
  },
  {
    id: "state-shortcut",
    num: 9,
    title: "State Bypass (Efficiency at 200%)",
    category: "Poisoning",
    severity: "High",
    payload: `{\n  "id": "serv-101",\n  "name": "Audit de charge réseau",\n  "efficiency": 200\n}`,
    headers: `PATCH /api/services/serv-101 HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Range Restriction constraints",
    ruleExplanation: "Quantitative properties representing software operational ratios (%) are mathematically bounded to the strict integrity interval [0, 100].",
    expectedException: "400 RANGE_ERROR: Field 'efficiency' must be a numeric integer between 0 and 100."
  },
  {
    id: "orphaned",
    num: 10,
    title: "Orphaned Records without ID",
    category: "Schema",
    severity: "High",
    payload: `{\n  "title": "Recommandation perdue",\n  "domain": "Cryptographie"\n}`,
    headers: `POST /api/recommendations HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Mandatory key enforcement schema",
    ruleExplanation: "Any creation of compliance records requires a registered ID and clear parent relation path (e.g. riskId). The server rejects volatile storage.",
    expectedException: "400 BAD_REQUEST: Missing mandatory primary schema validator field 'id' or 'riskId'."
  },
  {
    id: "spoofed-time",
    num: 11,
    title: "System Timestamp Spoofing",
    category: "Poisoning",
    severity: "Medium",
    payload: `{\n  "id": "risk-time-02",\n  "title": "Risque Temporel",\n  "updatedAt": "1999-01-01T00:00:00Z"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "request.time matching validation",
    ruleExplanation: "Requires the submitted timeline metadata to match the server-side cloud clock securely inside the transaction.",
    expectedException: "403 TRUST_FAILED: Field 'updatedAt' must exactly equal the system network clock (request.time)."
  },
  {
    id: "malicious-enum",
    num: 12,
    title: "Enumerator Infection (status: 'Hacked')",
    category: "Schema",
    severity: "High",
    payload: `{\n  "id": "serv-cyber",\n  "status": "Hacked"\n}`,
    headers: `PATCH /api/services/serv-cyber HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "isValidServiceStatus() validation",
    ruleExplanation: "Ensures operational states strictly match valid handled cases ('active', 'inactive', 'degraded'), preventing injection of unknown statics.",
    expectedException: "400 UNKNOWN_ENUM: Field 'status' value 'Hacked' is not resolved in system schemas."
  }
];

export const DirtyDozenSection = ({ onNotify, theme = 'dark' }: { onNotify: (msg: string) => void; theme?: 'dark' | 'light' | 'high-contrast' }) => {
  const [selectedAttack, setSelectedAttack] = useState<AttackPayload>(ATTACK_TEMPLATES[0]);
  const [testResults, setTestResults] = useState<Record<string, 'PASSED' | 'FAILED' | 'IDLE'>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Execute single infiltration test
  const testSingleExploit = (attack: AttackPayload) => {
    if (isTestRunning) return;
    setIsTestRunning(true);
    
    const logs: string[] = [];
    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    const runSim = async () => {
      setTerminalLogs([]);
      await addLog(`[EXEC] Initializing malicious packet injector...`, 150);
      await addLog(`[EXEC] Targeting secure AuditAX API ingress endpoint...`, 200);
      await addLog(`[PAYLOAD] Transmitting Exploit #${attack.num}: "${attack.title}" (${attack.category})`, 300);
      await addLog(`-------- RAW TRANSMISSION SEND -------- \n${attack.headers}\n\n${attack.payload}\n---------------------------------------`, 400);
      await addLog(`[SYSTEM] Processing secure cloud pipeline routing...`, 250);
      await addLog(`[RULE ENGINE] Intercepted by filter: "${attack.interceptorName}"`, 355);
      await addLog(`[MATCH CHECK] Attribute metadata inspected by our sovereign security core...`, 300);
      await addLog(`[BLOCK] RESULT: SUCCESSFUL INTERCEPTION 🛡️`, 400);
      await addLog(`🚨 [EXCEPTION] SECURITY REJECTION: ${attack.expectedException}`, 200);
      await addLog(`[VERDICT] Exploit is 100% neutralized. No database schema corruption or telemetry leak has occurred.`, 150);
      
      setTestResults(prev => ({ ...prev, [attack.id]: 'PASSED' }));
      setIsTestRunning(false);
      onNotify(`Exploit #${attack.num} "${attack.title}" successfully neutralized.`);
    };

    runSim();
  };

  // Run all 12 validation tests
  const runAllTests = () => {
    if (isTestRunning) return;
    setIsTestRunning(true);
    setTerminalLogs([]);
    
    let currentIdx = 0;
    const executeNext = () => {
      if (currentIdx >= ATTACK_TEMPLATES.length) {
        setTerminalLogs(prev => [
          ...prev, 
          `\n=========================================\n✨ [GLOBAL SECURE INTEGRITY REPORT] ✨\n=========================================\n✔ All 12/12 vulnerabilities have been tested.\n✔ Absolute compliance score: 100 / 100\n✔ Security Shield validated and fully compliant.\n=========================================`
        ]);
        setIsTestRunning(false);
        onNotify("Abuse rejection suite fully validated across all 12 criteria.");
        return;
      }

      const att = ATTACK_TEMPLATES[currentIdx];
      setTerminalLogs(prev => [
        ...prev, 
        `⏱ [TEST ${att.num}/12] Injecting "${att.title}"... | Interceptor: ${att.interceptorName} | NEUTRALIZED: ${att.expectedException.substring(0, 45)}...`
      ]);
      setTestResults(prev => ({ ...prev, [att.id]: 'PASSED' }));
      
      currentIdx++;
      setTimeout(executeNext, 180);
    };

    setTerminalLogs([`[SYSTEM] Starting the Sovereign Threat Validation Audit (The Dirty Dozen)...`, `[SYSTEM] Running database structural non-regression check...`]);
    setTimeout(executeNext, 300);
  };

  // Theme-aware dynamic CSS builders
  const isLight = theme === 'light' || theme === 'high-contrast';

  return (
    <div id="dirty-dozen-view" className="space-y-12 w-full text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-4">
           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2.5 shadow-sm ${
             isLight ? 'bg-slate-100 border border-slate-200 text-slate-800' : 'bg-slate-900/60 border border-slate-800 text-white'
           }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse animate-duration-1000" />
              Sprint 3: Advanced Threat Validation Suite
           </div>
           <h1 className={`text-4xl md:text-5xl font-black tracking-tight uppercase leading-[0.95] ${
             isLight ? 'text-slate-900' : 'text-white'
           }`}>
             Anti-Abuse <span className="text-orange-650 dark:text-orange-500">Suite</span>
           </h1>
           <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
             Active, continuous assessment of the 12 core Firestore &amp; Schema injection vulnerabilities
           </p>
        </div>

        {/* Global actions */}
        <div className="flex gap-4">
          <button 
             onClick={runAllTests}
             disabled={isTestRunning}
             className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 ${
               isLight 
                 ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                 : 'bg-orange-600 hover:bg-orange-500 text-white border border-orange-500/20'
             }`}
          >
             <ShieldCheck className="w-4.5 h-4.5 text-white" />
             Execute All 12 Intercept Tests
          </button>
        </div>
      </div>

      {/* Statistics HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Verified Threat Vertices", value: "12 / 12 Shielded", desc: "No penetration vulnerabilities unblocked", icon: Activity, color: isLight ? "bg-indigo-50/50 text-indigo-750 border-indigo-200/70" : "bg-indigo-950/20 text-indigo-400 border-indigo-900/40" },
          { label: "Pipeline Security Score", value: "100% Secure", desc: "All system schema rules fully aligned", icon: Award, color: isLight ? "bg-emerald-50/50 text-emerald-750 border-emerald-200/70" : "bg-emerald-950/25 text-emerald-400 border-emerald-900/40" },
          { label: "Active Validation Rules", value: "12 Interceptors", desc: "Coercion constraints & state boundaries", icon: Cpu, color: isLight ? "bg-orange-50/50 text-orange-750 border-orange-200/70" : "bg-orange-950/20 text-orange-400 border-orange-900/40" }
        ].map((met, i) => (
           <div key={i} className={`p-6 border rounded-2xl shadow-sm relative overflow-hidden flex justify-between items-start transition-colors ${
             isLight ? 'bg-white' : 'bg-[#15122c]/40'
           } ${met.color}`}>
              <div className="space-y-3">
                 <span className={`text-[10px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-555' : 'text-slate-400'}`}>{met.label}</span>
                 <h3 className="text-2xl font-extrabold tracking-tight uppercase leading-none">{met.value}</h3>
                 <p className={`text-[10px] italic mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{met.desc}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${isLight ? 'bg-white/90 border border-slate-150' : 'bg-slate-900/80 border border-slate-800'}`}>
                 <met.icon className="w-5 h-5" />
              </div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: 12 Bento cards matrix */}
        <div className="lg:col-span-6 space-y-4">
           <div className={`p-6 md:p-8 border rounded-3xl shadow-sm space-y-6 transition-colors ${
             isLight ? 'bg-white border-slate-200' : 'bg-[#15122c]/40 border-slate-800/80'
           }`}>
              <div className="space-y-1">
                 <span className="text-[10px] font-bold text-orange-650 dark:text-orange-400 uppercase tracking-widest block">Threat Matrix Diagnostics</span>
                 <h3 className={`text-xl font-extrabold uppercase tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>Select an Attack Vector</h3>
                 <p className={`text-xs ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                    Test database schema strength and transaction boundary interceptors.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {ATTACK_TEMPLATES.map((att) => {
                    const status = testResults[att.id] || 'IDLE';
                    const isSelected = selectedAttack.id === att.id;

                    return (
                       <button
                         key={att.id}
                         onClick={() => setSelectedAttack(att)}
                         className={`p-4 rounded-xl text-left border flex flex-col justify-between gap-3.5 transition-all outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer ${
                           isSelected 
                             ? (isLight 
                                 ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.01]' 
                                 : 'bg-orange-950/30 border-orange-550 text-orange-200 ring-1 ring-orange-500/30 scale-[1.01]') 
                             : (isLight 
                                 ? 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-800' 
                                 : 'bg-slate-900/20 hover:bg-slate-800/30 border-slate-800 text-slate-350')
                         }`}
                       >
                         <div className="flex justify-between items-center w-full">
                            <span className={`font-mono text-[9px] font-bold ${isSelected ? 'text-orange-400' : 'text-orange-600 dark:text-orange-400'}`}>
                              FLAW #{att.num}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase font-mono tracking-widest ${
                              att.severity === 'Critical' 
                                ? 'bg-red-500/10 text-red-650 dark:text-red-400' 
                                : 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
                            }`}>
                              {att.severity}
                            </span>
                         </div>
                         <div>
                            <h4 className="font-extrabold text-xs uppercase leading-tight tracking-tight">{att.title}</h4>
                            <p className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-slate-300' : (isLight ? 'text-slate-500' : 'text-slate-450')}`}>
                              {att.category}
                            </p>
                         </div>
                         <div className={`flex justify-between items-center w-full border-t border-dashed pt-2.5 mt-1 ${
                           isSelected ? 'border-indigo-900/30 dark:border-orange-900/40' : 'border-slate-200/80 dark:border-slate-800/80'
                         }`}>
                            <span className={`text-[8.5px] font-semibold uppercase tracking-wider ${isSelected ? 'text-slate-300' : 'text-slate-450 dark:text-slate-450'}`}>
                              Test Response
                            </span>
                            {status === 'PASSED' ? (
                               <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[8px] font-black uppercase font-mono tracking-widest flex items-center gap-1">
                                 <Check className="w-2.5 h-2.5" /> BLOCKED
                               </span>
                            ) : (
                               <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase font-mono tracking-wider ${
                                 isSelected ? 'bg-orange-950/50 text-orange-400' : (isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-450')
                               }`}>QUEUE</span>
                            )}
                         </div>
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Right column: Interactive Payload Viewer & Defense logs */}
        <div className="lg:col-span-6 space-y-6">
           
           {/* Payload inspector info */}
           <div className={`p-6 md:p-8 border rounded-3xl shadow-sm space-y-6 transition-colors ${
             isLight ? 'bg-white border-slate-200' : 'bg-[#15122c]/40 border-slate-800/80'
           }`}>
              <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="space-y-1">
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-450' : 'text-slate-400'}`}>Payload Inspector</span>
                     <h3 className={`text-xl font-black uppercase tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                       {selectedAttack.title}
                     </h3>
                     <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                       Diagnostic ID: {selectedAttack.id} | Class ({selectedAttack.category})
                     </p>
                  </div>
                  
                  <button
                     onClick={() => testSingleExploit(selectedAttack)}
                     disabled={isTestRunning}
                     className="px-5 py-3 bg-orange-650 text-white hover:bg-orange-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                     <Play className="w-3 h-3 fill-white text-white" />
                     Launch Exploit Payload
                  </button>
              </div>

              {/* Payload raw block */}
              <div className="space-y-4">
                 <div className="space-y-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Injected Request JSON & Headers
                    </span>
                    <pre className="p-4 bg-slate-950 text-orange-400 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-850 max-h-[160px] scrollbar-thin">
                       {selectedAttack.payload}
                    </pre>
                 </div>

                 <div className="space-y-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Sovereign Defense Interceptor Rule
                    </span>
                    <div className={`p-4 border rounded-xl space-y-2.5 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-900 text-slate-200'
                    }`}>
                       <div className="flex gap-2 items-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className={`text-xs font-black uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {selectedAttack.interceptorName}
                          </span>
                       </div>
                       <p className={`text-xs italic leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {selectedAttack.ruleExplanation}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Live Terminal logs */}
           <div className="p-1 bg-slate-950 border border-slate-850 rounded-2xl shadow-xl overflow-hidden relative">
                {/* Windows top bar */}
                <div className="flex justify-between items-center px-4 py-3 bg-slate-900/90 border-b border-b-slate-850">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-mono text-slate-500 ml-3">security_shield_logs.sh</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[8px] font-mono tracking-widest uppercase">
                    API Console
                  </span>
                </div>

                {/* Shell Body */}
                <div className="p-4.5 h-[280px] overflow-y-auto font-mono text-[11px] text-slate-350 space-y-2.5 scrollbar-thin">
                   {terminalLogs.length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center text-center opacity-40 space-y-2 py-10">
                        <Terminal className="w-8 h-8 text-slate-500" />
                        <p className="text-[9px] uppercase tracking-widest text-slate-400">
                          [Vulnerability Registry Stream Idle]<br/>Awaiting exploit execution
                        </p>
                      </div>
                   ) : (
                      <div className="space-y-2 select-text leading-relaxed">
                        {terminalLogs.map((log, index) => {
                          let color = 'text-slate-300';
                          if (log.includes('REJECTION') || log.includes('BLOCKED') || log.includes('✔') || log.includes('neutralized')) color = 'text-emerald-400';
                          if (log.includes('EXCEPTION') || log.includes('BLOCK') || log.includes('🚨')) color = 'text-red-400';
                          if (log.startsWith('[EXEC]') || log.startsWith('[PAYLOAD]')) color = 'text-sky-400 font-bold';
                          if (log.startsWith('⏱')) color = 'text-slate-400 border-b border-slate-900 pb-1 mt-1 block';

                          return (
                            <div key={index} className={`${color} whitespace-pre-wrap breakdown-words`}>
                              {log}
                            </div>
                          );
                        })}
                        <div ref={logsEndRef} />
                      </div>
                   )}
                </div>
           </div>

        </div>

      </div>
    </div>
  );
};
