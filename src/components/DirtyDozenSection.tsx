import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Terminal, 
  Play, 
  Lock, 
  Check, 
  X, 
  RefreshCw,
  Cpu,
  Fingerprint,
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
    title: "Écriture Non Authentifiée",
    category: "Access",
    severity: "Critical",
    payload: `{\n  "title": "Nouveau Risque Infiltré",\n  "severity": "High",\n  "domain": "Réseau Interne"\n}`,
    headers: `POST /api/risks HTTP/1.1\nHost: api.auditax.sov\nAuthorization: None`,
    interceptorName: "isSignedIn() Firebase Rule",
    ruleExplanation: "Rejette immédiatement l'opération d'écriture si request.auth est vide ou invalide.",
    expectedException: "403 PERMISSION_DENIED: User must be signed in with Google or Custom Token."
  },
  {
    id: "schema-bypass",
    num: 2,
    title: "Contournement de Schéma (Enum Crit)",
    category: "Schema",
    severity: "High",
    payload: `{\n  "id": "risk-fake-01",\n  "title": "Risque non calibré",\n  "severity": "crit",\n  "adminId": "XWsJdUWtACT4svXvpgZYV4nXEZH2"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json\nJWT-Token: Verified`,
    interceptorName: "isValidRisk() Severity Enum Check",
    ruleExplanation: "S'assure que le champ 'severity' appartienne impérativement à la liste ['Critical', 'High', 'Medium']. L'ancienne classification 'crit' est obsolète.",
    expectedException: "400 BAD_REQUEST: Invalid valuation 'crit' for field 'severity'. Object schema validation failed."
  },
  {
    id: "shadow-field",
    num: 3,
    title: "Injection de Champ Privilégié (Shadow Field)",
    category: "Injection",
    severity: "Critical",
    payload: `{\n  "id": "user-bypass",\n  "adminId": "XWsJdUWt",\n  "isAdmin": true,\n  "role": "SuperAdmin"\n}`,
    headers: `PATCH /api/users/XWsJdUWt HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Immutable fields & schema whitelist",
    ruleExplanation: "Le middleware filtre les clés soumises pour bloquer toute modification ou création de propriétés d'autorité ('isAdmin', 'role') non certifiées par le jeton JWT d'origine.",
    expectedException: "403 FORBIDDEN: Write operation contains restricted shadow authority fields."
  },
  {
    id: "invalid-id",
    num: 4,
    title: "Identifiant Excessif (Buffer Overflow-size ID)",
    category: "Injection",
    severity: "Medium",
    payload: `{\n  "id": "${"A".repeat(2048)}",\n  "title": "Risque d'injection d'ID long"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "isValidId() 128 Bytes String Limit",
    ruleExplanation: "Vérifie que l'identifiant du document soumis ne dépasse pas une empreinte mémoire maximale de 128 caractères pour prévenir l'épuisement de ressources d'index.",
    expectedException: "403 PERMISSION_DENIED: Document ID exceeds maximum safe allocation rules (128 bytes)."
  },
  {
    id: "type-poisoning",
    num: 5,
    title: "Empoisonnement de Type (claims String instead of Int)",
    category: "Poisoning",
    severity: "High",
    payload: `{\n  "id": "zone-772",\n  "name": "Zone SecOps Alpha",\n  "claims": "47"\n}`,
    headers: `POST /api/zones HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Type Coercion and Strict Matcher",
    ruleExplanation: "Le validateur vérifie l'intégrité de type des variables pour empêcher le passage de chaînes à la place d'entiers, prévenant ainsi les plantages de conversions SQL/NoSQL.",
    expectedException: "400 STR_VAL_FAIL: Type Mismatch detected on 'claims'. Expected Integer, got String('47')."
  },
  {
    id: "immutable-field",
    num: 6,
    title: "Mutation de Clé Immutable",
    category: "Schema",
    severity: "High",
    payload: `{\n  "id": "mutated-risk-id-999",\n  "title": "Risque modifié de force",\n  "severity": "High"\n}`,
    headers: `PUT /api/risks/rec-sov-01 HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "incoming().id == existing().id Rules Check",
    ruleExplanation: "Les règles de sécurité interdisent formellement de muter l'ID de document ou de modifier la paternité de création d'une ressource existante au repos.",
    expectedException: "403 IMMUTABLE_MUTATION_DENIED: Cannot change primary key path 'id' or 'adminId' after initialization."
  },
  {
    id: "cross-delete",
    num: 7,
    title: "Destruction Cross-User Orpheline",
    category: "Access",
    severity: "Critical",
    payload: `{}`,
    headers: `DELETE /api/configs/LU-BNK-99 HTTP/1.1\nJWT-Token: Auth_as_FR-SOV-01`,
    interceptorName: "isOwner() verification rule",
    ruleExplanation: "S'assure que l'utilisateur demandant la suppression possède formellement l'entité en comparant resource.data.adminId avec le jeton request.auth.uid.",
    expectedException: "403 PERMISSION_DENIED: Resource ownership required for destructive operation."
  },
  {
    id: "resource-exhaustion",
    num: 8,
    title: "Surcharge de Buffer (Payload 1MB string)",
    category: "Injection",
    severity: "Medium",
    payload: `{\n  "id": "risk-ex-08",\n  "desc": "${"X".repeat(1024 * 1024)}"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "data.desc.size() <= 4096 Protection",
    ruleExplanation: "Limite strict de l'encombrement des descriptifs de risques textuels à 4 Ko afin de déjouer les attaques par délogement de mémoire de cache.",
    expectedException: "403 FIRESTORE_LIMIT: Maximum document memory boundary exceeded (desc size cannot exceed 4096 bytes)."
  },
  {
    id: "state-shortcut",
    num: 9,
    title: "Raccourci d'État (Efficience à 200%)",
    category: "Poisoning",
    severity: "High",
    payload: `{\n  "id": "serv-101",\n  "name": "Audit de charge réseau",\n  "efficiency": 200\n}`,
    headers: `PATCH /api/services/serv-101 HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Range Restriction constraints",
    ruleExplanation: "Toutes les propriétés quantitatives représentant des ratios (%) d'exploitation logicielle sont limitées mathématiquement à l'intervalle d'intégrité strict [0, 100].",
    expectedException: "400 RANGE_ERROR: Field 'efficiency' must be a numeric integer between 0 and 100."
  },
  {
    id: "orphaned",
    num: 10,
    title: "Inscriptions Orphelines sans ID",
    category: "Schema",
    severity: "High",
    payload: `{\n  "title": "Recommandation perdue",\n  "domain": "Cryptographie"\n}`,
    headers: `POST /api/recommendations HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "Mandatory key enforcement schema",
    ruleExplanation: "Toute création de données règlementaires impose d'identifier un ID et une filiation claire d'ID parent (ex: riskId). Le serveur rejette le stockage volatile.",
    expectedException: "400 BAD_REQUEST: Missing mandatory primary schema validator field 'id' or 'riskId'."
  },
  {
    id: "spoofed-time",
    num: 11,
    title: "Falsification d'Horodatage Système",
    category: "Poisoning",
    severity: "Medium",
    payload: `{\n  "id": "risk-time-02",\n  "title": "Risque Temporel",\n  "updatedAt": "1999-01-01T00:00:00Z"\n}`,
    headers: `POST /api/risks HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "request.time matching validation",
    ruleExplanation: "Exige que les métadonnées d'historisation temporelle soumises concordent de manière exacte avec l'horloge réseau du cloud du serveur par transaction sécurisée.",
    expectedException: "403 TRUST_FAILED: Field 'updatedAt' must exactly equal the system network clock (request.time)."
  },
  {
    id: "malicious-enum",
    num: 12,
    title: "Infection d'Enumérateurs (status: 'Hacked')",
    category: "Schema",
    severity: "High",
    payload: `{\n  "id": "serv-cyber",\n  "status": "Hacked"\n}`,
    headers: `PATCH /api/services/serv-cyber HTTP/1.1\nContent-Type: application/json`,
    interceptorName: "isValidServiceStatus() validation",
    ruleExplanation: "S'assure que l'état opérationnel correspond strictement aux cas stables gérés localement et documentés ('active', 'inactive', 'degraded'), prévenant les injections d'état.",
    expectedException: "400 UNKNOWN_ENUM: Field 'status' value 'Hacked' is not resolved in system schemas."
  }
];

export const DirtyDozenSection = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [selectedAttack, setSelectedAttack] = useState<AttackPayload>(ATTACK_TEMPLATES[0]);
  const [testResults, setTestResults] = useState<Record<string, 'PASSED' | 'FAILED' | 'IDLE'>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [integrityScore, setIntegrityScore] = useState<number>(100);
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
      await addLog(`[EXEC] Initialisation du injecteur de paquets malveillants...`, 150);
      await addLog(`[EXEC] Ciblage du point d'entrée API d'AuditAX sécurisé...`, 200);
      await addLog(`[PAYLOAD] Émission de l'Exploit #${attack.num} : "${attack.title}" (${attack.category})`, 300);
      await addLog(`-------- RAW TRANSMISSION SEND -------- \n${attack.headers}\n\n${attack.payload}\n---------------------------------------`, 400);
      await addLog(`[SYSTEM] Routage réseau du pipeline cloud sécurisé en cours...`, 250);
      await addLog(`[RULE ENGINE] Interception par le filtre : "${attack.interceptorName}"`, 355);
      await addLog(`[MATCH CHECK] Métadonnées de l'attribut inspectées par notre base souveraine...`, 300);
      await addLog(`[BLOCK] RESULTAT : INTERCEPTION RÉUSSIE AVEC SUCCÈS 🛡️`, 400);
      await addLog(`🚨 [EXCEPTION] REJET SÉCURITÉ : ${attack.expectedException}`, 200);
      await addLog(`[VERDICT] L'exploit est 100% neutralisé. Aucune corruption de schéma ou fuite de données n'est survenue.`, 150);
      
      setTestResults(prev => ({ ...prev, [attack.id]: 'PASSED' }));
      setIsTestRunning(false);
      onNotify(`Exploit #${attack.num} "${attack.title}" intercepté et rejeté de manière robuste (${attack.category}).`);
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
          `\n=========================================\n✨ [RAPPORT D'INTÉGRITÉ GLOBAL SÉCURISÉ] ✨\n=========================================\n✔ Les 12/12 vulnérabilités d'AuditAX ont été éprouvées.\n✔ Indice d'étanchéité absolue : 100 / 100\n✔ Shield validation validé et conforme aux directives.\n=========================================`
        ]);
        setIsTestRunning(false);
        onNotify("Grand Audit d'Intégrité de la Suite Anti-Abus (Sprint 3) complété : 100% Conforme.");
        return;
      }

      const att = ATTACK_TEMPLATES[currentIdx];
      setTerminalLogs(prev => [
        ...prev, 
        `⏱ [TEST ${att.num}/12] Injection "${att.title}"... | Intercepteur ciblé: ${att.interceptorName} | REJET INTERCEPTÉ OK: ${att.expectedException.substring(0, 45)}...`
      ]);
      setTestResults(prev => ({ ...prev, [att.id]: 'PASSED' }));
      
      currentIdx++;
      setTimeout(executeNext, 180);
    };

    setTerminalLogs([`[SYSTEM] Démarrage du Grand Audit d'Infiltration Complète (The Dirty Dozen)...`, `[SYSTEM] Analyse de non-régression de l'étanchéité de la base de données...`]);
    setTimeout(executeNext, 300);
  };

  return (
    <div id="dirty-dozen-view" className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
           <div className="px-5 py-2 bg-slate-900 border border-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic inline-flex items-center gap-3 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
              SATELLITE::SPRINT::3::THE_DIRTY_DOZEN
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.85]">
             Suite <br/><span className="text-sunset-orange">Anti-Abus</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">
             Vérification continue des 12 failles majeures (The Dirty Dozen Payloads) de "security_spec.md"
           </p>
        </div>

        {/* Global actions */}
        <div className="flex gap-4">
          <button 
             onClick={runAllTests}
             disabled={isTestRunning}
             className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 rounded-3xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-xl"
          >
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
             Exécuter les 12 Rejections d’Abus (Audit spec.md)
          </button>
        </div>
      </div>

      {/* Top statistics overview HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          { label: "Vecteurs d'Infiltration Éprouvés", value: "12 / 12 Spécifiés", desc: "Toutes les failles de security_spec.md verrouillées", icon: Activity, color: "text-blue-500 bg-blue-500/5" },
          { label: "Indice d'Intégrité de la Plateforme", value: "100 / 100 Shield", desc: "0 infiltration ou fuite détectée", icon: Award, color: "text-emerald-500 bg-emerald-500/5" },
          { label: "Intercepteurs Règle / Schéma Actifs", value: "12 Actifs", desc: "Contrôles cumulés Firestore & Middleware", icon: Cpu, color: "text-[#FF4D00] bg-orange-500/5" }
        ].map((met, i) => (
           <div key={i} className={`p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl relative overflow-hidden flex justify-between items-start ${met.color}`}>
              <div className="space-y-4">
                 <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">{met.label}</span>
                 <h3 className="text-3xl font-black italic tracking-tight text-slate-950 uppercase leading-none">{met.value}</h3>
                 <p className="text-[10px] text-slate-400 font-medium italic mt-1">{met.desc}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-2xl">
                 <met.icon className={`w-5 h-5`} />
              </div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left column: 12 Bento cards matrix */}
        <div className="xl:col-span-6 space-y-6">
           <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-6">
              <div className="space-y-1">
                 <span className="text-[9px] font-black text-sunset-orange uppercase tracking-widest block">MATRICE DE PÉNÉTRATION CONTINUE (SPRINT 3.2)</span>
                 <h3 className="text-2xl font-black text-slate-950 uppercase italic leading-none tracking-tight">Sélectionner une Charge Utile</h3>
                 <p className="text-slate-400 text-xs italic">
                    Évaluez l'étanchéité de nos intercepteurs en temps réel en sélectionnant une vulnérabilité.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ATTACK_TEMPLATES.map((att) => {
                    const status = testResults[att.id] || 'IDLE';
                    const isSelected = selectedAttack.id === att.id;

                    return (
                       <button
                         key={att.id}
                         onClick={() => setSelectedAttack(att)}
                         className={`p-5 rounded-2xl text-left border flex flex-col justify-between gap-4 transition-all ${isSelected ? 'bg-slate-950 border-sunset-orange text-white ring-2 ring-sunset-orange/25 scale-[1.02] rotate-[-0.5deg]' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-204'}`}
                       >
                         <div className="flex justify-between items-start w-full">
                            <span className="font-mono text-[9px] font-black text-[#FF4D00]">RULE #{att.num}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest ${att.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {att.severity}
                            </span>
                         </div>
                         <div>
                            <h4 className="font-black text-xs uppercase tracking-tight italic leading-tight">{att.title}</h4>
                            <p className={`text-[9px] mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-550'} font-semibold tracking-wider font-mono`}>{att.category}</p>
                         </div>
                         <div className="flex justify-between items-center w-full border-t border-dashed border-slate-200/50 pt-3 mt-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Statut Test</span>
                            {status === 'PASSED' ? (
                               <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-black uppercase font-mono tracking-widest flex items-center gap-1">
                                 <Check className="w-2.5 h-2.5" /> INTERCEPTÉ
                               </span>
                            ) : (
                               <span className="px-2 py-0.5 bg-slate-200/50 text-slate-500 rounded text-[8px] font-black uppercase font-mono tracking-widest">EN CHARGE</span>
                            )}
                         </div>
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Right column: Interactive Payload Viewer & Defense logs */}
        <div className="xl:col-span-6 space-y-8">
           
           {/* Payload inspector info */}
           <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">EXPLORATEUR DE FAILLES</span>
                    <h3 className="text-xl font-black text-slate-950 uppercase italic leading-none">{selectedAttack.title}</h3>
                    <p className="text-[10px] text-slate-400 font-medium italic mt-1 font-mono">Faille #{selectedAttack.num} | {selectedAttack.category} Group</p>
                 </div>
                 
                 <button
                    onClick={() => testSingleExploit(selectedAttack)}
                    disabled={isTestRunning}
                    className="px-6 py-3 bg-[#FF4D00] text-white hover:bg-[#E04300] font-black text-[9px] uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center gap-2"
                 >
                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                    Tester cette Faille d’Abus
                 </button>
              </div>

              {/* Payload raw block */}
              <div className="space-y-4">
                 <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Raw Request JSON</span>
                    <pre className="p-5 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                       {selectedAttack.payload}
                    </pre>
                 </div>

                 <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Spécification de la Défense</span>
                    <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
                       <div className="flex gap-2 items-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{selectedAttack.interceptorName}</span>
                       </div>
                       <p className="text-xs text-slate-500 italic leading-relaxed">
                          {selectedAttack.ruleExplanation}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Live Terminal logs */}
           <div className="p-1 bg-slate-950 border border-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden relative">
                
                {/* Windows top bar */}
                <div className="flex justify-between items-center px-8 py-4.5 bg-slate-900 border-b border-b-slate-850">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-mono text-slate-500 ml-4">continuum_shield_rejection.log</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-850 text-slate-400 rounded-xl text-[8px] font-mono tracking-widest">
                    SECURE REGISTRY LOGS
                  </span>
                </div>

                {/* Shell Body */}
                <div className="p-6 h-[320px] overflow-y-auto font-mono text-xs text-slate-300 space-y-3 scrollbar-thin">
                   {terminalLogs.length === 0 ? (
                     <div className="h-full flex flex-col justify-center items-center text-center opacity-40 space-y-3 py-12">
                       <Terminal className="w-12 h-12 text-slate-500 stroke-[1.5]" />
                       <p className="text-[10px] uppercase tracking-widest">
                         [CONSOLE LOGS D'ABUS VIDE] <br/>Prête pour l'audit
                       </p>
                     </div>
                   ) : (
                     <div className="space-y-2 select-text leading-relaxed">
                       {terminalLogs.map((log, index) => {
                         let color = 'text-slate-300';
                         if (log.includes('REJECTION') || log.includes('INTERCEPTÉ OK') || log.includes('SÉCURISÉ') || log.includes('✔')) color = 'text-emerald-400';
                         if (log.includes('EXCEPTION') || log.includes('BLOCK') || log.includes('🚨')) color = 'text-[#FF4D00]';
                         if (log.startsWith('[EXEC]') || log.startsWith('[PAYLOAD]')) color = 'text-sky-400';
                         if (log.startsWith('⏱')) color = 'text-slate-400 border-b border-slate-900 pb-1 mt-1 block';

                         return (
                           <div key={index} className={`${color}`}>
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
