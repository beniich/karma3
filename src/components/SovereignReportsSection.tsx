import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Shield, CheckCircle, AlertTriangle, Clock, 
  ArrowRight, Download, Search, RefreshCw, Send, Lock
} from 'lucide-react';

interface SecurityReport {
  id: string;
  title: string;
  category: 'Compliance' | 'Key Rotation' | 'Data Enclave' | 'UBA Logs';
  date: string;
  enclaveName: string;
  severity: 'CRITICAL' | 'OPTIMAL' | 'WARNING';
  hash: string;
  downloadCount: number;
}

export const SovereignReportsSection: React.FC<{ onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void }> = ({ onNotify }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  const [reports, setReports] = useState<SecurityReport[]>([
    {
      id: "REP-2026-B81",
      title: "Audit Souverain d'Intégrité Géodésique",
      category: "Compliance",
      date: "2026-06-02",
      enclaveName: "Paris SecOps Primary",
      severity: "OPTIMAL",
      hash: "SHA-256: 3ca9b78...f229",
      downloadCount: 142
    },
    {
      id: "REP-2026-N49",
      title: "Rapport d'Enclave - Algorithmes Post-Quantiques L5",
      category: "Data Enclave",
      date: "2026-05-28",
      enclaveName: "Europe Sovereign Core L5",
      severity: "WARNING",
      hash: "SHA-256: 8cb39d1...013a",
      downloadCount: 89
    },
    {
      id: "REP-2026-X11",
      title: "Rapport SecOps - Attaques par Canaux Auxiliaires",
      category: "UBA Logs",
      date: "2026-05-15",
      enclaveName: "Luxembourg Secure Vault",
      severity: "CRITICAL",
      hash: "SHA-256: e8eb10f...f97c",
      downloadCount: 231
    },
    {
      id: "REP-2026-K92",
      title: "Analyse d'Alignement - Rotations des Clés HSM",
      category: "Key Rotation",
      date: "2026-05-02",
      enclaveName: "Geneva Core Sentinel",
      severity: "OPTIMAL",
      hash: "SHA-256: 4aa67c9...8b5c",
      downloadCount: 64
    },
    {
      id: "REP-2026-A12",
      title: "Cartographie de Conformité RGPD v3 Multilatérale",
      category: "Compliance",
      date: "2026-04-22",
      enclaveName: "Bruxelles Enclave Core",
      severity: "OPTIMAL",
      hash: "SHA-256: df8e102...bc33",
      downloadCount: 110
    }
  ]);

  const simulateDownload = (reportId: string, title: string) => {
    setIsExporting(reportId);
    onNotify(`📥 Cryptographie en cours... Signature de l'audit ${reportId} par clé post-quantique en cours`, "info");
    
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, downloadCount: r.downloadCount + 1 } : r));
      setIsExporting(null);
      onNotify(`🛡️ Rapport "${title}" exporté avec signature matérielle valide !`, "success");
    }, 2000);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.enclaveName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-slate-300 pb-12">
      
      {/* Upper stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center border border-orange-500/30">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold block">AUDITS SOUVERAINS</span>
            <span className="text-xl font-black text-white">{reports.length} Générés</span>
          </div>
        </div>

        <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00e383]/15 flex items-center justify-center border border-[#00e383]/30">
            <CheckCircle className="w-5 h-5 text-[#00e383]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold block">ÉTAT OPTIMAL</span>
            <span className="text-xl font-black text-[#00e383]">3 Sécurisés</span>
          </div>
        </div>

        <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold block">AVERTISSEMENTS ACTIFS</span>
            <span className="text-xl font-black text-amber-500">1 Alerte</span>
          </div>
        </div>

        <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center border border-rose-500/30">
            <Lock className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold block">CRYPTAGE POST-QUANTIQUE</span>
            <span className="text-xl font-black text-white">SHA-256</span>
          </div>
        </div>
      </div>

      {/* Main card reporting system */}
      <div className="bg-[#0b041e]/90 border border-[#231245]/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Glowing flares background effect */}
        <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Controls menu strip */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b border-orange-500/10 z-10 relative">
          
          {/* Categories selectors */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'Compliance', 'Key Rotation', 'Data Enclave', 'UBA Logs'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-[#0c041f] border-orange-400 font-bold shadow-lg shadow-orange-500/20'
                    : 'bg-[#150c2c] border-[#251842] text-slate-400 hover:text-white hover:border-orange-500/25'
                }`}
              >
                {cat === 'ALL' ? 'TOUS LES RAPPORTS' : cat}
              </button>
            ))}
          </div>

          {/* Search bar input with icon */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, enclave, ID..."
              className="w-full bg-[#150c2c] border border-orange-500/10 hover:border-orange-500/20 focus:border-orange-500/40 rounded-xl py-2 px-10 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans font-medium"
            />
          </div>

        </div>

        {/* Security reports table/list */}
        <div className="relative z-10 pt-4 overflow-x-auto">
          {filteredReports.length > 0 ? (
            <div className="min-w-[700px] space-y-3">
              {filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className="bg-slate-950/40 border border-[#211142] hover:border-orange-500/20 transition-all duration-200 p-4 rounded-2xl flex items-center justify-between gap-4 group"
                >
                  {/* Left block information */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      report.severity === 'CRITICAL' 
                        ? 'bg-rose-500/10 border border-rose-500/25 text-rose-500 animate-pulse'
                        : report.severity === 'WARNING' 
                          ? 'bg-amber-500/10 border border-amber-500/25 text-amber-500' 
                          : 'bg-[#00e383]/10 border border-[#00e383]/20 text-[#00e383]'
                    }`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-extrabold text-[#ff9e00] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                          {report.id}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 font-bold">
                          {report.category}
                        </span>
                        <span className="text-[9px] text-[#6b6288] font-mono">
                          | {report.enclaveName}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                        {report.title}
                      </h4>
                      
                      <div className="flex items-center gap-3 text-[9.5px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" /> Publié le {report.date}
                        </span>
                        <span>•</span>
                        <span className="text-[8px] tracking-wider text-slate-600 select-all hover:text-slate-400">
                          {report.hash}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Severity tag */}
                  <div className="shrink-0 w-28 text-center hidden md:block">
                    <span className={`text-[8.5px] font-black font-mono tracking-widest px-2.5 py-1 rounded-md border ${
                      report.severity === 'CRITICAL' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse'
                        : report.severity === 'WARNING' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                          : 'bg-[#00e383]/10 text-[#00e383] border-[#00e383]/20'
                    }`}>
                      {report.severity}
                    </span>
                  </div>

                  {/* Quick stats and downloads trigger action button */}
                  <div className="flex items-center gap-4 shrink-0 justify-end">
                    <span className="text-[9px] text-slate-500 font-mono hidden sm:block">
                      {report.downloadCount} EXPORTS
                    </span>

                    <button
                      type="button"
                      disabled={isExporting !== null}
                      onClick={() => simulateDownload(report.id, report.title)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-450 text-[#090513] font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border-none shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-40"
                    >
                      {isExporting === report.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          EXPORTATION...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 fill-current" />
                          TÉLÉCHARGER (.AUDIT)
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto animate-bounce" />
              <p className="text-slate-400 text-sm font-medium">Aucun rapport d&apos;audit ne correspond à vos filtres actuels.</p>
              <button 
                type="button"
                onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                className="bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer"
              >
                RÉINITIALISER LES FILTRES
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Audit verification section */}
      <div className="bg-[#0a041f]/85 border border-[#231245]/70 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e383] animate-ping" />
            Vérifier la validité d&apos;une signature numérique d&apos;audit (.audit)
          </h4>
          <p className="text-xs text-slate-400">
            Faites glisser-déposer un rapport AuditAX signé ou copiez son empreinte SHA-256 pour confirmer son intégrité souveraine en direct.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNotify("🔍 En attente du dépôt du fichier cryptographique...", "info")}
          className="px-5 py-3 bg-[#11052b] hover:bg-[#1a0c3a] border border-[#2c155c] rounded-2xl text-orange-400 hover:text-white transition-all cursor-pointer font-black text-[9px] uppercase tracking-widest flex items-center gap-2 block shrink-0"
        >
          GLISSER UN ARCHIVE UNIQUE <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
