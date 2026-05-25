import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard,
  Zap,
  Check,
  TrendingUp,
  Coins,
  ArrowUpRight,
  AlertOctagon,
  Sparkles,
  ClipboardList,
  RefreshCw,
  ShoppingBag,
  DollarSign,
  Briefcase,
  History,
  Info
} from 'lucide-react';

// --- Types ---
export interface TransactionRecord {
  id: string;
  timestamp: string;
  tenantName: string;
  type: 'Plan Upgrade' | 'Token Purchase' | 'Automatic Renewal' | 'SLA Fine Reversal';
  amount: number;
  tokensAdded: number;
  status: 'Succeeded' | 'Pending';
  description: string;
}

export interface UsageQuota {
  current: number;
  max: number;
  percentage: number;
  unit: string;
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "TX-781",
    timestamp: "2026-05-25 01:12:44",
    tenantName: "Sovereign Energy SAS",
    type: "Plan Upgrade",
    amount: 1499,
    tokensAdded: 500,
    status: "Succeeded",
    description: "Migration du plan Expert vers Enterprise - Alignement Souverain France"
  },
  {
    id: "TX-774",
    timestamp: "2026-05-24 18:40:02",
    tenantName: "Luxembourg Secure Vault",
    type: "Token Purchase",
    amount: 249,
    tokensAdded: 100,
    status: "Succeeded",
    description: "Recharge de quotas : Micro-pack de 100 jetons d'audit automatisés"
  },
  {
    id: "TX-762",
    timestamp: "2026-05-23 09:15:00",
    tenantName: "AuditAX Public Sandbox",
    type: "Automatic Renewal",
    amount: 0,
    tokensAdded: 50,
    status: "Succeeded",
    description: "Allocation mensuelle récurrente - Forfait Démonstration Gratuit"
  }
];

export const StripeMonetizationSection = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  // Quota and plan state
  const [activePlan, setActivePlan] = useState<'Corporate' | 'Expert' | 'Enterprise'>('Expert');
  const [quotas, setQuotas] = useState<Record<string, UsageQuota>>({
    audits: { current: 850, max: 1000, percentage: 85, unit: 'Audits' },
    clusters: { current: 14, max: 15, percentage: 93.3, unit: 'Clusters K8s' },
  });
  const [tokens, setTokens] = useState<number>(310);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  // Simulation parameters
  const [simulationTriggered, setSimulationTriggered] = useState<boolean>(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);

  // Upgrade Plan handler
  const handleUpgradePlan = (plan: 'Corporate' | 'Expert' | 'Enterprise', price: number) => {
    if (plan === activePlan) {
      onNotify(`Vous possédez déjà le plan ${plan}.`);
      return;
    }

    setIsProcessingStripe(true);
    onNotify(`[Sprint 2 Stripe] Initialisation de la session de paiement Checkout Stripe pour le plan ${plan}...`);

    setTimeout(() => {
      setActivePlan(plan);
      setIsProcessingStripe(false);
      
      // Calculate token additions
      const tokensToAdd = plan === 'Enterprise' ? 2000 : plan === 'Expert' ? 500 : 100;
      setTokens(prev => prev + tokensToAdd);

      // Adjust Quotas accordingly
      setQuotas({
        audits: { 
          current: quotas.audits.current, 
          max: plan === 'Enterprise' ? 10000 : plan === 'Expert' ? 1000 : 250, 
          percentage: Math.round((quotas.audits.current / (plan === 'Enterprise' ? 10000 : plan === 'Expert' ? 1000 : 250)) * 100), 
          unit: 'Audits' 
        },
        clusters: { 
          current: quotas.clusters.current, 
          max: plan === 'Enterprise' ? 999 : plan === 'Expert' ? 15 : 3, 
          percentage: Math.round((quotas.clusters.current / (plan === 'Enterprise' ? 999 : plan === 'Expert' ? 15 : 3)) * 100), 
          unit: 'Clusters K8s' 
        }
      });

      // Add to commercial audit trail
      const newTx: TransactionRecord = {
        id: `TX-${Math.floor(800 + Math.random() * 199)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        tenantName: "Sovereign Energy SAS",
        type: "Plan Upgrade",
        amount: price,
        tokensAdded: tokensToAdd,
        status: "Succeeded",
        description: `Migration réussie vers le forfait ${plan} via webhook Stripe scellé.`
      };

      setTransactions(prev => [newTx, ...prev]);
      setSimulationTriggered(false); // Clear banner on upgrade
      onNotify(`🎉 [Stripe] Paiement de ${price}€ confirmé ! Plan mis à niveau vers : ${plan}. Quotas étendus.`);
    }, 1500);
  };

  // Buy Quick Pack Tokens Handler
  const handleBuyTokens = (packName: string, count: number, price: number) => {
    setIsProcessingStripe(true);
    onNotify(`[Sprint 2 Quotas] Demande d'achat rapide de ${count} jetons d'audit (${price}€)...`);

    setTimeout(() => {
      setTokens(prev => prev + count);
      setIsProcessingStripe(false);

      // Add tokens to Quota Limit dynamically
      setQuotas(prev => {
        const newMax = prev.audits.max + count;
        return {
          ...prev,
          audits: {
            ...prev.audits,
            max: newMax,
            percentage: Math.round((prev.audits.current / newMax) * 100)
          }
        };
      });

      const newTx: TransactionRecord = {
        id: `TX-${Math.floor(800 + Math.random() * 199)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        tenantName: "Sovereign Energy SAS",
        type: "Token Purchase",
        amount: price,
        tokensAdded: count,
        status: "Succeeded",
        description: `Approvisionnement direct de ${count} jetons d'audit pour pallier les dépassements.`
      };

      setTransactions(prev => [newTx, ...prev]);
      setSimulationTriggered(false); // clear banner limit
      onNotify(`🛡️ [Stripe] Achat Direct Validé ! +${count} Tokens de diagnostic injectés de manière fluide.`);
    }, 1200);
  };

  // Trigger simulated limit hit
  const simulateLimitExceeded = () => {
    setSimulationTriggered(true);
    setQuotas({
      audits: { current: 1024, max: 1000, percentage: 102.4, unit: 'Audits' },
      clusters: { current: 15, max: 15, percentage: 100, unit: 'Clusters K8s' },
    });
    onNotify(`⚠️ [Simulation] Quota critique Dépassé ! Affichage de la Bannière de Plan d'Urgence (Sprint 2.6).`);
  };

  // Reset Quotas
  const handleResetQuotas = () => {
    setSimulationTriggered(false);
    setQuotas({
      audits: { current: 850, max: 1000, percentage: 85, unit: 'Audits' },
      clusters: { current: 14, max: 15, percentage: 93.3, unit: 'Clusters K8s' },
    });
    onNotify(`Réinitialisation des quotas aux niveaux d'usine.`);
  };

  return (
    <div id="stripe-monetization-view" className="space-y-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
           <div className="px-5 py-2 bg-slate-900 border border-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic inline-flex items-center gap-3 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              SATELLITE::SPRINT::2::STRIPE_AND_QUOTAS
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.85]">
             Économie <br/><span className="text-sunset-orange">& Monétisation</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">
             Stripe Checkout Integration, Quotas de diagnostic & Audit Trail Commercial
           </p>
        </div>

        {/* Quick sandbox control */}
        <div className="flex gap-3">
          <button 
             onClick={simulateLimitExceeded}
             className="px-6 py-3 bg-[#FF4D00] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-100 flex items-center gap-2 shadow-xl shadow-sunset-orange/20"
          >
             <AlertOctagon className="w-3.5 h-3.5" />
             Simuler Dépassement Quota (Sprint 2.6)
          </button>
          
          <button 
             onClick={handleResetQuotas}
             className="p-3 bg-slate-150 text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
             title="Réinitialiser"
          >
             <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SPRINT 2.6: CONTEXTUAL UPGRADE BANNER (DURABLE CONVERSION TOOL) */}
      <AnimatePresence>
        {simulationTriggered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="p-8 bg-gradient-to-r from-[#FF4D00] to-rose-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-4 max-w-2xl">
                 <div className="px-3.5 py-1.5 bg-white/15 border border-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic inline-flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    Sprint 2.6 : Bannière de Conversion Contextuelle Activable
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black italic uppercase leading-none tracking-tight">
                   Quota Dépassé ! Évitez l'interruption de vos Diagnostics
                 </h2>
                 <p className="text-xs font-semibold uppercase tracking-wider text-rose-100 italic leading-relaxed">
                   Votre instance "Sovereign Energy SAS" a consommé <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">1024 / 1000</span> audits autorisés sur ce cycle. Votre pipeline d'intégration continue de souveraineté risque d'être momentanément bridé.
                 </p>
              </div>

              {/* Conversion Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
                 <button 
                   onClick={() => handleBuyTokens("Mégajetons", 500, 499)}
                   className="px-8 py-4.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#FF4D00] flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-100"
                 >
                   💥 Injection Immédiate Multi-pack (+500 jetons)
                 </button>
                 <button 
                   onClick={() => handleUpgradePlan('Enterprise', 2499)}
                   className="px-8 py-4.5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-100 shadow-xl"
                 >
                   ⚡ Mettre à Niveau vers Enterprise (Clés Illimitées)
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top statistics overview HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Solde de Jeton d'Audit", value: `${tokens} Tokens`, desc: "Crédits de requêtes d'analyse", icon: Coins, color: "text-amber-500 bg-amber-500/5 border-amber-100" },
          { label: "Forfait d'Abonnement Actuel", value: activePlan, desc: "Abonné via Stripe Platform", icon: CreditCard, color: "text-blue-500 bg-blue-500/5 border-blue-100" },
          { label: "Génération de Chiffre d'Affaires/MRR", value: `${activePlan === 'Enterprise' ? '2 499 €' : activePlan === 'Expert' ? '1 499 €' : '499 €'} / mois`, desc: "Simulation d'abonnements récurrents", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/5 border-emerald-100" },
          { label: "Consommation API", value: `${quotas.audits.current} / ${quotas.audits.max}`, desc: `${quotas.audits.max - quotas.audits.current} jetons restants`, icon: Zap, color: "text-indigo-500 bg-indigo-500/5 border-indigo-150" }
        ].map((met, i) => (
           <div key={i} className={`p-8 bg-white border rounded-[2.5rem] shadow-xl relative overflow-hidden flex justify-between items-start ${met.color}`}>
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

      {/* Main Sandbox Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Side: Dynamic Stripe Subscriptions Pricing Sandbox */}
        <div className="xl:col-span-8 space-y-8">
          <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-8">
             <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="space-y-2">
                   <span className="text-[9px] font-black text-sunset-orange uppercase tracking-widest italic block">PASSERELLE DE TRANSACTION INTELLIGENTE</span>
                   <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight leading-none gap-3 flex items-center">
                     <CreditCard className="w-7 h-7 text-[#FF4D00]" />
                     Abonnements & Forfaits Souverains
                   </h2>
                   <p className="text-xs text-slate-400 italic">
                     Simulez et évaluez instantanément les parcours de mise à niveau de Stripe d'AuditAX.
                   </p>
                </div>
                
                {isProcessingStripe && (
                   <span className="px-5 py-2.5 bg-slate-950 text-white rounded-full text-[10px] font-mono tracking-widest flex items-center gap-2 shadow-2xl animate-pulse">
                     <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                     SECURE STRIPE SANDBOX ACTIVE
                   </span>
                )}
             </div>

             {/* Three Billing Options Matrix */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[
                  { 
                    id: 'Corporate', 
                    name: 'Corporate Shield', 
                    price: 499, 
                    tokens: '100 Jetons / mois', 
                    features: ['1 Administrateur principal', '3 Clusters K8s sécurisés', 'Support par courriel sous 24h', 'Validation Règlementaire de Base'],
                    badgeText: 'Idéal PME'
                  },
                  { 
                    id: 'Expert', 
                    name: 'Expert Sovereign', 
                    price: 1499, 
                    tokens: '500 Jetons / mois', 
                    features: ['10 Collaborateurs certifiés', '15 Clusters K8s isolés MD5', 'BYOK Cryptography active', 'SLA d\'Infiltration garanti sous 12h', 'Dashboard de souveraineté étanche'],
                    badgeText: 'Populaire'
                  },
                  { 
                    id: 'Enterprise', 
                    name: 'Enterprise Empire', 
                    price: 2499, 
                    tokens: '2 000 Jetons / mois', 
                    features: ['Sièges & Collaborateurs illimités', 'K8s Multi-Régions Illimité', 'Assurance Conformité Fiscale Stripe', 'Ingénierie de Détection dédiée', 'Audit Trail Commercial Infini (v2)'],
                    badgeText: 'Recommandé Souverain'
                  },
                ].map(p => {
                  const isActive = activePlan === p.id;
                  return (
                    <div 
                      key={p.id}
                      className={`p-8 border rounded-[3rem] flex flex-col justify-between gap-8 relative transition-all ${isActive ? 'bg-slate-950 border-sunset-orange text-white ring-2 ring-sunset-orange/30 shadow-2xl scale-[1.03] rotate-[-0.5deg]' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/50'}`}
                    >
                      {isActive && (
                        <span className="absolute top-6 right-6 bg-sunset-orange text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">PLAN ACTIF ACTUEL</span>
                      )}

                      <div className="space-y-4">
                         <span className="px-3.5 py-1 bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/15 rounded-full text-[8.5px] font-black uppercase tracking-widest inline-block">{p.badgeText}</span>
                         <h3 className="text-xl font-black uppercase italic leading-none">{p.name}</h3>
                         <div className="flex items-baseline gap-1 pt-2">
                           <span className="text-4xl font-extrabold italic">{p.price}€</span>
                           <span className={`text-[10px] uppercase font-bold ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>/ mois HT</span>
                         </div>
                         <div className="text-[11px] font-mono font-bold text-emerald-500">{p.tokens}</div>
                      </div>

                      <div className={`border-t py-4 ${isActive ? 'border-slate-800' : 'border-slate-200'}`}>
                         <ul className="space-y-3">
                           {p.features.map((feat, index) => (
                             <li key={index} className="flex gap-2.5 items-start text-[11px]/tight">
                               <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-sunset-orange' : 'text-slate-800'}`} />
                               <span className={isActive ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                             </li>
                           ))}
                         </ul>
                      </div>

                      <button 
                        disabled={isActive || isProcessingStripe}
                        onClick={() => handleUpgradePlan(p.id as any, p.price)}
                        className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-950 hover:bg-slate-900 text-white shadow-lg'}`}
                      >
                         {isActive ? 'Votre Abonnement Actuel' : `Basculer via Stripe (${p.price}€)`}
                      </button>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Quick Pack Shop */}
          <div className="p-8 bg-slate-950 border border-slate-850 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-[300px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
             
             <div className="flex gap-4 items-start max-w-xl">
                <div className="p-3 bg-white/10 rounded-2xl">
                   <Coins className="w-6 h-6 text-sunset-orange" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-black uppercase italic leading-none text-white">Magasin Rapide de Jetons d'Audit</h3>
                   <p className="text-slate-400 text-xs italic">
                     Approvisionnement rapide de secours sans changement de forfait annuel pour vos diagnostics souverains immédiats.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Starter Pack", count: 100, price: 99, desc: "+100 analyses immédiates", icon: Zap },
                  { name: "Sovereign Pack", count: 500, price: 399, desc: "+500 analyses d'infrastructure", icon: Sparkles },
                  { name: "Empire Enterprise Pack", count: 2000, price: 1299, desc: "+2000 analyses réglementaires", icon: Coins },
                ].map((pack, index) => (
                  <div key={index} className="p-6 bg-slate-900 rounded-[2rem] border border-slate-850 justify-between flex flex-col gap-6">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase font-mono tracking-widest text-[#FF4D00]">{pack.name}</span>
                        <h4 className="text-lg font-black text-white italic">+{pack.count} Jetons</h4>
                        <p className="text-[10px] text-slate-400 italic">{pack.desc}</p>
                     </div>
                     <div className="flex justify-between items-center mt-2 border-t border-slate-850 pt-4">
                        <span className="text-2xl font-black text-[#FF4D00] font-mono italic">{pack.price}€</span>
                        <button 
                           onClick={() => handleBuyTokens(pack.name, pack.count, pack.price)}
                           disabled={isProcessingStripe}
                           className="px-4 py-2 bg-white text-slate-950 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors"
                        >
                           Prendre
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Side Column: Hard Limit Gauges & Commercial Audit Trail */}
        <div className="xl:col-span-4 space-y-8">
           
           {/* Limit Gauges */}
           <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-6">
              <div className="space-y-1">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">QUOTAS MATÉRIELS EN TEMPS RÉEL</span>
                 <h3 className="text-lg font-black text-slate-950 uppercase italic leading-none tracking-tight">Capacité d'Exploitation</h3>
              </div>

              <div className="space-y-6 pt-4">
                {Object.entries(quotas).map(([key, quota]) => {
                  const isExceeded = quota.current > quota.max;
                  return (
                    <div key={key} className="space-y-3">
                       <div className="flex justify-between text-xs font-bold uppercase leading-none">
                          <span className="text-slate-800 tracking-tight">{quota.unit}</span>
                          <span className={isExceeded ? 'text-[#FF4D00] font-mono font-black' : 'text-slate-650'}>
                             {quota.current} / {quota.max} {isExceeded ? '(DÉPASSEMENT !)' : ''}
                          </span>
                       </div>
                       <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isExceeded ? 'bg-gradient-to-r from-red-500 to-[#FF4D00] animate-pulse' : 'bg-[#FF4D00]'}`}
                            style={{ width: `${Math.min(quota.percentage, 100)}%` }}
                          />
                       </div>
                       <div className="flex justify-between text-[10px] italic text-slate-400 uppercase font-medium">
                          <span>Usage total</span>
                          <span>{quota.percentage}% consommé</span>
                       </div>
                    </div>
                  );
                })}
              </div>
           </div>

           {/* COMMERCIAL AUDIT TRAIL */}
           <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#FF4D00] uppercase tracking-widest">RAPPORT RECOMMANDÉ PAR L'ARCHITECTE</span>
                    <History className="w-4 h-4 text-slate-400" />
                 </div>
                 <h3 className="text-lg font-black text-slate-950 uppercase italic leading-none">Commercial Audit Trail</h3>
                 <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Registre tamper-proof détaillant les transactions, mises à niveaux de quotas et modifications de privilèges.
                 </p>
              </div>

              <div className="space-y-4 pt-4 border-t max-h-[300px] overflow-y-auto no-scrollbar">
                 {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                       <div className="flex justify-between text-[10px]">
                          <span className="font-mono font-semibold text-slate-400">{tx.timestamp}</span>
                          <span className="font-mono font-bold text-slate-800">{tx.id}</span>
                       </div>
                       <div className="flex justify-between items-start">
                          <span className="font-black text-slate-905 uppercase text-[11px] leading-tight flex items-center gap-1.5">
                             <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                             {tx.type}
                          </span>
                          <span className="font-mono font-black text-slate-700 italic shrink-0">
                             {tx.amount > 0 ? `+${tx.amount} €` : 'Gratuit'}
                          </span>
                       </div>
                       <p className="text-[10px] text-slate-500 italic leading-snug">{tx.description}</p>
                       <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t pt-2 mt-2">
                          <span>Tenant: {tx.tenantName}</span>
                          <span className="font-bold text-emerald-600">+{tx.tokensAdded} Jeton(s)</span>
                       </div>
                    </div>
                 ))}
                 
                 {transactions.length === 0 && (
                    <p className="text-center italic text-xs text-slate-400 py-8">Aucune transaction enregistrée.</p>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
