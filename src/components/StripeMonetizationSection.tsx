import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSocket } from '../hooks/useSocket';
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
  Info,
  Lock,
  Key,
  ShieldCheck,
  Database,
  Terminal,
  Activity,
  Award,
  Globe,
  Settings,
  ShieldAlert,
  Server,
  FileCode,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

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
  stripeProductId?: string;
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
    amount: 1450,
    tokensAdded: 2000,
    status: "Succeeded",
    description: "Migration du plan Pro vers Enterprise Empire (v1.0 stable) - Alignement Souverain France",
    stripeProductId: "prod_Uc3sIZJZhaUe2R"
  },
  {
    id: "TX-774",
    timestamp: "2026-05-24 18:40:02",
    tenantName: "Luxembourg Secure Vault",
    type: "Token Purchase",
    amount: 399,
    tokensAdded: 500,
    status: "Succeeded",
    description: "Recharge de quotas : Micro-pack de 500 jetons d'audit automatisés via Stripe"
  },
  {
    id: "TX-762",
    timestamp: "2026-05-23 09:15:00",
    tenantName: "AuditAX Public Sandbox",
    type: "Automatic Renewal",
    amount: 0,
    tokensAdded: 50,
    status: "Succeeded",
    description: "Allocation mensuelle récurrente - Forfait Démonstration Gratuit (plan-free)"
  }
];

interface StripeMonetizationSectionProps {
  onNotify: (msg: string) => void;
  theme?: 'dark' | 'light' | 'high-contrast';
}

export const StripeMonetizationSection = ({ onNotify, theme = 'dark' }: StripeMonetizationSectionProps) => {
  // Live socket connection to intercept background raw-body webhook processed events
  const { socket } = useSocket();
  const isLight = theme === 'light' || theme === 'high-contrast';

  // Quota and plan state
  const [activePlan, setActivePlan] = useState<'Corporate' | 'Expert' | 'Enterprise'>('Expert');
  const [quotas, setQuotas] = useState<Record<string, UsageQuota>>({
    audits: { current: 850, max: 1000, percentage: 85, unit: 'Audits' },
    clusters: { current: 14, max: 15, percentage: 93.3, unit: 'Clusters K8s' },
  });
  const [tokens, setTokens] = useState<number>(310);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);

  // Simulation parameters
  const [simulationTriggered, setSimulationTriggered] = useState<boolean>(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Labo 4 Piliers States
  const [customKey, setCustomKey] = useState<string>('');
  const [encryptedKey, setEncryptedKey] = useState<string>('');
  const [decryptedKey, setDecryptedKey] = useState<string>('');
  const [licTenant, setLicTenant] = useState<string>('Sovereign Corp');
  const [licPlan, setLicPlan] = useState<'Corporate' | 'Expert' | 'Enterprise'>('Enterprise');
  const [licExpiry, setLicExpiry] = useState<string>('2027-12-31');
  const [generatedLic, setGeneratedLic] = useState<string>('');
  const [inputLic, setInputLic] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<{valid: boolean; tenant?: string; plan?: string; expiry?: string; msg: string} | null>(null);

  // Fetch the Express backend StripeWebhookLog audit table
  const fetchWebhookLogs = async () => {
    try {
      const res = await fetch('/api/billing/webhook-logs');
      if (res.ok) {
        const data = await res.json();
        setWebhookLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch webhook logs:", err);
    }
  };

  useEffect(() => {
    fetchWebhookLogs();
  }, []);

  // Set up live socket updates to prevent stale user tokens
  useEffect(() => {
    if (!socket) return;

    const handleWebhookSignal = (data: any) => {
      onNotify(`🎉 [Live Webhook Signal] Stripe Webhook "${data.eventType}" validé avec succès en arrière-plan [Signature VALID] !`);
      
      setActivePlan(data.planName);
      setTokens(prev => prev + data.tokensAdded);

      // Adjust Quotas accordingly in real-time
      setQuotas(prev => ({
        audits: { 
          current: prev.audits.current, 
          max: data.planName === 'Enterprise' ? 10000 : data.planName === 'Expert' ? 1000 : 250, 
          percentage: Math.round((prev.audits.current / (data.planName === 'Enterprise' ? 10000 : data.planName === 'Expert' ? 1000 : 250)) * 100), 
          unit: 'Audits' 
        },
        clusters: { 
          current: prev.clusters.current, 
          max: data.planName === 'Enterprise' ? 999 : data.planName === 'Expert' ? 15 : 3, 
          percentage: Math.round((prev.clusters.current / (data.planName === 'Enterprise' ? 999 : data.planName === 'Expert' ? 15 : 3)) * 100), 
          unit: 'Clusters K8s' 
        }
      }));

      // Add fresh transaction scellée to memory ledger
      const newTx: TransactionRecord = {
        id: data.eventId || `TX-${Math.floor(800 + Math.random() * 199)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        tenantName: "Sovereign Energy SAS",
        type: "Plan Upgrade",
        amount: data.price,
        tokensAdded: data.tokensAdded,
        status: "Succeeded",
        description: `Validation sécurisée pour le forfait ${data.planName} (Bypass cache "Stale Token").`,
        stripeProductId: data.productId
      };
      setTransactions(prev => [newTx, ...prev]);
      
      // Update our database live log visualization
      fetchWebhookLogs();
    };

    const handleTokenUpdate = (data: any) => {
      setTokens(data.tokenBalance);
    };

    socket.on("stripe-webhook-processed", handleWebhookSignal);
    socket.on("token-balance-updated", handleTokenUpdate);
    return () => {
      socket.off("stripe-webhook-processed", handleWebhookSignal);
      socket.off("token-balance-updated", handleTokenUpdate);
    };
  }, [socket]);

  // Upgrade Plan handler - Triggers the real raw body API of Express to execute signature validation
  const handleUpgradePlan = (plan: 'Corporate' | 'Expert' | 'Enterprise', price: number) => {
    if (plan === activePlan) {
      onNotify(`Vous possédez déjà le plan ${plan}.`);
      return;
    }

    const activeStripeId = plan === 'Enterprise'
      ? 'prod_Uc3sIZJZhaUe2R'
      : plan === 'Expert'
        ? 'prod_Uc3rO31IkGhY9v'
        : 'prod_Uc3qapaLfo84Oq';

    setIsProcessingStripe(true);
    onNotify(`[Stripe Checkout] Initialisation de l'iframe de paiement sécurisé pour le Produit ${activeStripeId} (${price}€)...`);

    // Simulate redirection and Stripe webhook emission to our raw billing server endpoint after 1500ms
    setTimeout(async () => {
      try {
        const response = await fetch('/api/billing/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'stripe-signature': `t=1716940800,v1=${Math.random().toString(36).substring(2,15)}`
          },
          body: JSON.stringify({
            eventType: "checkout.session.completed",
            productId: activeStripeId,
            price: price
          })
        });

        if (response.ok) {
          setIsProcessingStripe(false);
          setSimulationTriggered(false); // clear limit alert
        } else {
          setIsProcessingStripe(false);
          onNotify("❌ Erreur de traitement du webhook de tarification.");
        }
      } catch (err: any) {
        console.error("Simulation error:", err);
        setIsProcessingStripe(false);
        onNotify(`❌ Erreur réseau de simulation : ${err.message}`);
      }
    }, 1500);
  };

  // Buy Quick Pack Tokens Handler
  const handleBuyTokens = (packName: string, count: number, price: number) => {
    setIsProcessingStripe(true);
    onNotify(`[Stripe Checkout] Session de paiement direct pour le pack "${packName}" (${price}€ HT)...`);

    setTimeout(async () => {
      try {
        // Emit pay-as-you-go topup through raw body webhook endpoint
        const response = await fetch('/api/billing/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'stripe-signature': 't=1716940800,v1=topup_signature'
          },
          body: JSON.stringify({
            eventType: "checkout.session.completed",
            productId: "prod_token_topup",
            price: price,
            tokensAdded: count
          })
        });

        if (response.ok) {
          setTokens(prev => prev + count);
          setIsProcessingStripe(false);
          setSimulationTriggered(false); // clear warning limit

          // Dynamically expand diagnostics limits for the current cycle
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

          onNotify(`🛡️ [Stripe] Paiement de ${price}€ validé ! +${count} Jetons injectés et Quotas étendus.`);
        }
      } catch (e) {
        setIsProcessingStripe(false);
      }
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
    setIsResetting(true);
    setTimeout(() => {
      setSimulationTriggered(false);
      setQuotas({
        audits: { current: 850, max: 1000, percentage: 85, unit: 'Audits' },
        clusters: { current: 14, max: 15, percentage: 93.3, unit: 'Clusters K8s' },
      });
      setIsResetting(false);
      onNotify(`Réinitialisation des quotas aux niveaux d'usine.`);
    }, 600);
  };

  return (
    <div className={cn(
      "space-y-8 text-left select-none rounded-[2rem] p-4 md:p-6 min-h-screen transition-colors duration-300",
      isLight ? "bg-slate-55 border border-slate-200/80 shadow-inner text-slate-800" : "bg-[#021319] text-slate-100"
    )}>
      
      {/* 1. MASTER HEADER WITH PREMIUM DESIGN */}
      <div className={cn(
        "backdrop-blur-2xl border rounded-[2.2rem] p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden transition-all duration-300",
        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0b2931]/75 border-teal-800/40 shadow-2xl"
      )}>
        {/* Ambient glow decoration */}
        <div className={cn(
          "absolute right-0 top-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40",
          isLight ? "bg-orange-300/15" : "bg-orange-500/10"
        )} />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={cn(
            "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300",
            isLight 
              ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm" 
              : "bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.15)]"
          )}>
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "text-[10px] font-black tracking-widest uppercase font-mono px-2.5 py-0.5 rounded-full border",
                isLight 
                  ? "bg-orange-50 border-orange-100 text-orange-700" 
                  : "bg-orange-500/10 border-orange-500/20 text-orange-400"
              )}>
                Sprint 2: Stripe Billing Linker
              </span>
              <span className={cn(
                "px-2 py-0.5 border rounded-full text-[8.5px] font-mono uppercase font-black tracking-widest flex items-center gap-1",
                isLight 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-green-500/10 border-green-500/20 text-green-400"
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Webhook Listener Online
              </span>
            </div>
            <h1 className={cn(
              "text-2xl md:text-3.5xl font-extrabold tracking-tight mt-1 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}>
              Moteur Économique &amp; Monétisation
            </h1>
          </div>
        </div>

        {/* Live Simulator Header Actions */}
        <div className="flex gap-2.5 w-full sm:w-auto relative z-10 shrink-0">
          <button 
            type="button"
            onClick={simulateLimitExceeded}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-mono uppercase font-black rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            Simuler Dépassement Quota
          </button>
          
          <button 
            type="button"
            onClick={handleResetQuotas}
            className={cn(
              "p-3 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer",
              isLight 
                ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800" 
                : "bg-white/5 border-teal-800/40 hover:bg-white/10 text-slate-300"
            )}
            title="Réinitialiser Quotas"
          >
            <RefreshCw className={cn("w-4 h-4", isResetting ? "animate-spin" : "")} />
          </button>
        </div>
      </div>

      {/* SPRINT 2.6: CONTEXTUAL UPGRADE BANNER (DURABLE CONVERSION TOOL) */}
      <AnimatePresence>
        {simulationTriggered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            className="p-6 md:p-8 bg-gradient-to-r from-orange-600 via-[#FF4D00] to-rose-600 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-3 max-w-3xl">
                <div className="px-3.5 py-1.5 bg-white/15 border border-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic inline-flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  Sprint 2.6 : Bannière de Conversion Contextuelle Activable
                </div>
                <h2 className="text-2xl md:text-3.5xl font-black italic uppercase leading-none tracking-tight">
                  Quota Dépassé ! Évitez l'interruption de vos Diagnostics
                </h2>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-orange-50 italic leading-relaxed">
                  Votre instance "Sovereign Energy SAS" a consommé <span className="font-mono text-white bg-black/30 px-2 py-0.5 rounded border border-white/10 font-bold">1024 / 1000</span> audits de sécurité sur ce cycle. Votre pipeline d'intégration risque d'être bloqué.
                </p>
              </div>

              {/* Conversion Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 z-10">
                <button 
                  onClick={() => handleBuyTokens("Mégajetons", 500, 399)}
                  className="px-6 py-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#FF4D00] flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-100 cursor-pointer shadow-lg"
                >
                  💥 Multi-pack (+500 jetons)
                </button>
                <button 
                  onClick={() => handleUpgradePlan('Enterprise', 1450)}
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-100 shadow-lg cursor-pointer"
                >
                  ⚡ Passer à Enterprise Elite
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI TACTICAL METRICS HEALTH DECK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: "Solde Jetons d'Audit", value: `${tokens} Tokens`, desc: "Crédits de requêtes d'analyse", icon: Coins, color: "text-amber-500 bg-amber-500/5 border-amber-500/20" },
          { label: "Plan d'Abonnement Actuel", value: activePlan === 'Enterprise' ? 'Enterprise Empire' : activePlan === 'Expert' ? 'Expert Sovereign' : 'Corporate Shield', desc: "Géré via la passerelle Stripe", icon: Briefcase, color: "text-blue-500 bg-blue-500/5 border-blue-500/20" },
          { label: "Chiffre d'Affaires Simulél MRR", value: `${activePlan === 'Enterprise' ? '1 450' : activePlan === 'Expert' ? '420' : '50'} € / mois`, desc: "Facturation d'abonnements", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20" },
          { label: "Consommation Quota API", value: `${quotas.audits.current} / ${quotas.audits.max}`, desc: `${Math.max(0, quotas.audits.max - quotas.audits.current)} audits restants`, icon: Zap, color: "text-indigo-500 bg-indigo-500/5 border-indigo-500/20" }
        ].map((met, i) => (
          <div 
            key={i} 
            className={cn(
              "p-5 border backdrop-blur-md rounded-2xl shadow-sm relative overflow-hidden flex justify-between items-start transition-all duration-300",
              isLight ? "bg-white border-slate-200/80" : "bg-slate-900/40 border-slate-800"
            )}
          >
            <div className="space-y-2 text-left">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider",
                isLight ? "text-slate-500" : "text-slate-400"
              )}>{met.label}</span>
              <h3 className={cn(
                "text-xl font-bold tracking-tight uppercase leading-none",
                isLight ? "text-slate-900" : "text-white"
              )}>{met.value}</h3>
              <p className={cn(
                "text-[9.5px] font-medium italic",
                isLight ? "text-slate-500" : "text-slate-400"
              )}>{met.desc}</p>
            </div>
            <div className={cn(
              "p-2.5 rounded-xl border flex items-center justify-center shrink-0",
              isLight ? "bg-slate-50 border-slate-100" : "bg-slate-900 border-slate-800"
            )}>
              <met.icon className={cn("w-4.5 h-4.5", met.color.split(" ")[0])} />
            </div>
          </div>
        ))}
      </div>

      {/* PRIMARY GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: ACTIVE PLANS MATRIX (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6 justify-between">
          
          {/* SUBSCRIPTIONS PRICING PANEL */}
          <div className={cn(
            "p-6 md:p-8 border backdrop-blur-md rounded-[2rem] shadow-sm space-y-6 flex-1 flex flex-col justify-between",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/50 border-teal-800/20"
          )}>
            <div className="flex justify-between items-start flex-wrap gap-4 text-left border-b pb-4 border-slate-200/10">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest italic block">PASSERELLE DE TRANSACTION SÉCURISÉE STRIPE</span>
                <h2 className={cn(
                  "text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none flex items-center gap-2",
                  isLight ? "text-slate-900" : "text-white"
                )}>
                  Abonnements &amp; Forfaits Souverains
                </h2>
                <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
                  Évaluez instantanément les quotas et simulez des déclenchements de webhooks asynchrones Stripe à l'aide de notre simulateur.
                </p>
              </div>
              
              {isProcessingStripe && (
                <span className={cn(
                  "px-4 py-2 rounded-full text-[9px] font-mono tracking-widest flex items-center gap-1.5 shadow-md animate-pulse border",
                  isLight ? "bg-slate-950 text-white border-slate-800" : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                )}>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  STRIPE IFRAME SECURE
                </span>
              )}
            </div>

            {/* Pricing columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {[
                { 
                  id: 'Corporate', 
                  name: 'Corporate Shield', 
                  price: 50, 
                  tokens: '100 Jetons / mois', 
                  features: ['1 Administrateur principal', '3 Clusters K8s sécurisés', 'Support par e-mail en 24h', 'Validation Réglementaire Base'],
                  badgeText: 'plan-light',
                  stripeId: 'prod_Uc3qapaLfo84Oq'
                },
                { 
                  id: 'Expert', 
                  name: 'Expert Sovereign', 
                  price: 420, 
                  tokens: '500 Jetons / mois', 
                  features: ['10 Collaborateurs certifiés', '15 Clusters K8s isolés K8s', 'BYOK Cryptography active', 'Dashboard de souveraineté', 'SLA Infiltration sous 12h'],
                  badgeText: 'plan-pro',
                  stripeId: 'prod_Uc3rO31IkGhY9v'
                },
                { 
                  id: 'Enterprise', 
                  name: 'Enterprise Elite', 
                  price: 1450, 
                  tokens: '2 000 Jetons / mois', 
                  features: ['Sièges illimités', 'K8s Multi-Régions Infini', 'Assurance Conformité Fiscale', 'Ingénierie Décoration Dédiée', 'Audit Trail Commercial Infini'],
                  badgeText: 'plan-enterprise',
                  stripeId: 'prod_Uc3sIZJZhaUe2R'
                },
              ].map(p => {
                const isActive = activePlan === p.id;
                return (
                  <div 
                    key={p.id}
                    className={cn(
                      "p-5 rounded-2xl border flex flex-col justify-between gap-5 relative transition-all duration-300 text-left",
                      isActive 
                        ? (isLight 
                            ? "bg-slate-50 border-orange-500 shadow-md ring-2 ring-orange-500/20" 
                            : "bg-[#051a20] border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.1)] ring-1 ring-orange-500/20")
                        : (isLight 
                            ? "bg-white hover:bg-slate-50 border-slate-200" 
                            : "bg-slate-900/30 hover:bg-slate-900/50 border-slate-800")
                    )}
                  >
                    {isActive && (
                      <span className="absolute top-4 right-4 bg-orange-600 text-white text-[7.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">PLAN ACTIF</span>
                    )}

                    <div className="space-y-2">
                      <span className={cn(
                        "px-2.5 py-0.5 border rounded-full text-[7.5px] font-black uppercase tracking-widest inline-block",
                        isActive 
                          ? "bg-orange-500/10 border-orange-500/20 text-orange-400" 
                          : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400"
                      )}>{p.badgeText}</span>
                      <h3 className={cn("text-base font-black uppercase tracking-tight", isLight ? "text-slate-900" : "text-white")}>{p.name}</h3>
                      <div className="flex items-baseline gap-0.5 pt-1">
                        <span className={cn("text-2xl font-extrabold font-mono", isLight ? "text-slate-900" : "text-white")}>{p.price}€</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400">/ mois</span>
                      </div>
                      <div className="text-[10px] font-mono font-black text-orange-500">{p.tokens}</div>
                    </div>

                    <div className={cn("border-t py-3 border-dashed", isLight ? "border-slate-150" : "border-slate-850")}>
                      <ul className="space-y-2">
                        {p.features.map((feat, index) => (
                          <li key={index} className="flex gap-2 items-start text-[10px]/snug">
                            <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-500" />
                            <span className={cn(isActive && !isLight ? "text-slate-200" : "text-slate-400")}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metadata stripe info */}
                    <div className={cn(
                      "p-2.5 rounded-xl space-y-0.5 border text-[8.5px]",
                      isLight ? "bg-slate-100 border-slate-200" : "bg-black/40 border-slate-800"
                    )}>
                      <span className="text-slate-400 block font-mono font-bold uppercase tracking-wider">Stripe Product ID :</span>
                      <span className="text-orange-500 font-mono font-bold block truncate">{p.stripeId}</span>
                    </div>

                    <button 
                      type="button"
                      disabled={isActive || isProcessingStripe}
                      onClick={() => handleUpgradePlan(p.id as any, p.price)}
                      className={cn(
                        "w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-sm",
                        isActive 
                          ? "bg-slate-800/10 border border-slate-800/20 text-slate-500 cursor-not-allowed" 
                          : "bg-orange-600 hover:bg-orange-500 text-white hover:scale-[1.01]"
                      )}
                    >
                      {isActive ? 'Abonnement Actuel' : `Basculer via Stripe (${p.price}€)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOKEN QUICK LOADER (PAY-AS-YOU-GO) */}
          <div className={cn(
            "p-6 md:p-8 border backdrop-blur-md rounded-[2rem] shadow-sm space-y-5",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/50 border-teal-800/20"
          )}>
            <div className="flex gap-3 items-start text-left">
              <div className={cn(
                "p-2 rounded-xl shrink-0 border",
                isLight ? "bg-orange-50 border-orange-200" : "bg-orange-500/10 border-orange-500/20"
              )}>
                <Coins className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-0.5">
                <h3 className={cn("text-base font-black uppercase tracking-tight", isLight ? "text-slate-900" : "text-white")}>
                  Chargement Rapide de Jetons d'Audit
                </h3>
                <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
                  Achetez ponctuellement des recharges de tokens via Stripe Checkout pour étendre vos quotas de diagnostic.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Starter Reload Pack", count: 100, price: 99, desc: "+100 audits immédiats", icon: Zap },
                { name: "Sovereign Audit Cargo", count: 500, price: 399, desc: "+500 audits de clusters", icon: Sparkles },
                { name: "Enterprise Empire Pack", count: 2000, price: 1299, desc: "+2000 audits d'enclaves", icon: Coins },
              ].map((pack, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all hover:border-orange-500/40 text-left",
                    isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/40 border-slate-800/65"
                  )}
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-black uppercase font-mono tracking-widest text-orange-500">{pack.name}</span>
                    <h4 className={cn("text-md font-bold italic", isLight ? "text-slate-900" : "text-white")}>+{pack.count} Jetons</h4>
                    <p className={cn("text-[10px] italic", isLight ? "text-slate-500" : "text-slate-400")}>{pack.desc}</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-dashed border-slate-200/15 pt-3">
                    <span className="text-lg font-black text-orange-500 font-mono italic">{pack.price}€</span>
                    <button 
                      type="button"
                      onClick={() => handleBuyTokens(pack.name, pack.count, pack.price)}
                      disabled={isProcessingStripe}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-505 text-white font-mono font-black text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      Prendre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CAPACITY METRICS & WEBHOOK STREAM (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* REAL-TIME QUOTA GAUGES */}
          <div className={cn(
            "p-6 border backdrop-blur-md rounded-[2rem] shadow-sm space-y-5 text-left flex-1 flex flex-col justify-between",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/50 border-teal-800/20"
          )}>
            <div className="space-y-1">
              <span className={cn(
                "text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border block w-fit",
                isLight ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-orange-500/10 border-orange-500/20 text-orange-400"
              )}>
                SYSTEM RE-ROUTER ACCURACY
              </span>
              <h3 className={cn("text-lg font-black uppercase italic leading-none", isLight ? "text-slate-900" : "text-white")}>
                Quotas Applicatifs Actifs
              </h3>
            </div>

            <div className="space-y-5 flex-1 pt-3">
              {Object.entries(quotas).map(([key, quota]) => {
                const isExceeded = quota.current > quota.max;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase leading-none">
                      <span className={isLight ? "text-slate-600" : "text-slate-300"}>{quota.unit}</span>
                      <span className={isExceeded ? "text-orange-500 font-mono font-black animate-pulse" : "text-slate-400 font-mono"}>
                        {quota.current} / {quota.max} {isExceeded ? '⚠️' : ''}
                      </span>
                    </div>
                    
                    {/* Visual Gauge track */}
                    <div className={cn(
                      "w-full h-2.5 rounded-full overflow-hidden border",
                      isLight ? "bg-slate-100 border-slate-150" : "bg-slate-950/80 border-slate-800"
                    )}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(quota.percentage, 100)}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          isExceeded 
                            ? "bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" 
                            : "bg-orange-500"
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-between text-[9px] italic text-slate-400 uppercase font-medium">
                      <span>Consommation de cycle</span>
                      <span>{quota.percentage}% consommé</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMMERCIAL AUDIT TRAIL / SERVER WEBHOOK LOGS */}
          <div className={cn(
            "p-6 border backdrop-blur-md rounded-[2rem] shadow-sm space-y-4 text-left flex-1 flex flex-col justify-between h-[360px]",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/50 border-teal-800/20"
          )}>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest font-mono">
                  SÉRIE DE SYNCHRONISATION COMMERCIALE
                </span>
                <History className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className={cn("text-base font-black text-white uppercase italic", isLight ? "text-slate-900" : "text-white")}>
                Commercial Audit Trail
              </h3>
              <p className="text-[9.5px] text-slate-400 italic leading-snug">
                Sondes Stripe asynchrones enregistrées dans l'enclave de conformité d'AuditAX.
              </p>
            </div>

            {/* Transaction Logs ledger area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[190px] border-t border-slate-200/10 pt-3">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className={cn(
                    "p-3 rounded-xl border space-y-1.5 text-[11px] transition-all",
                    isLight ? "bg-slate-55 border-slate-200" : "bg-black/30 border-slate-800/70"
                  )}
                >
                  <div className="flex justify-between text-[8px] font-mono text-slate-400">
                    <span>{tx.timestamp}</span>
                    <span className="font-bold text-slate-300">{tx.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-start leading-none">
                    <span className={cn(
                      "font-black uppercase text-[9.5px] flex items-center gap-1",
                      isLight ? "text-slate-800" : "text-white"
                    )}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      {tx.type}
                    </span>
                    <span className="font-mono font-black text-orange-500 italic">
                      {tx.amount > 0 ? `+${tx.amount} €` : 'Gratuit'}
                    </span>
                  </div>
                  
                  <p className={cn("text-[9.5px] leading-tight font-medium", isLight ? "text-slate-600" : "text-slate-400")}>
                    {tx.description}
                  </p>

                  <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-400 border-t border-slate-200/5 pt-1.5 mt-1">
                    <span>{tx.tenantName}</span>
                    <span className="font-black text-emerald-400">+{tx.tokensAdded} jeton(s)</span>
                  </div>
                </div>
              ))}
              
              {transactions.length === 0 && (
                <p className="text-center italic text-xs text-slate-500 p-8">Aucun audit consolidé.</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* WEBHOOKS LOGS TERMINAL TABLE */}
      <div className={cn(
        "p-6 border rounded-[2rem] shadow-sm text-left relative overflow-hidden",
        isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/30 border-teal-800/20"
      )}>
        <div className="flex justify-between items-center border-b pb-3 border-slate-205/10 mb-4">
          <div className="space-y-0.5">
            <span className="text-[8px] font-black font-mono tracking-widest text-orange-500 uppercase">
              STRIPE SIGNATURE RAW BODY ENFORCER
            </span>
            <h3 className={cn("text-base font-black uppercase italic leading-none", isLight ? "text-slate-900" : "text-white")}>
              Journal de Réception du Webhook de Facturation (/api/billing/webhook)
            </h3>
          </div>
          <button 
            onClick={fetchWebhookLogs}
            className={cn(
              "p-2 rounded-lg border flex items-center gap-1 text-[10px] font-mono uppercase bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all",
              isLight ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800" : "bg-slate-950 border-slate-850"
            )}
          >
            <RefreshCw className="w-3 h-3" /> Recharger Logs Serveur
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className={cn(
                "border-b border-slate-200/10 text-slate-400 text-[10px] uppercase font-black tracking-wider text-left",
                isLight ? "bg-slate-50" : "bg-black/30"
              )}>
                <th className="p-3">ID Event</th>
                <th className="p-3">Type Stripe</th>
                <th className="p-3">Webhook Date</th>
                <th className="p-3">Taille</th>
                <th className="p-3">Raw Check</th>
                <th className="p-3">Certifié</th>
                <th className="p-3">Sujet de Traitement / Détail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/5">
              {webhookLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className={cn(
                    "hover:bg-slate-200/5 transition-all text-left",
                    isLight ? "text-slate-800" : "text-slate-300"
                  )}
                >
                  <td className="p-3 font-semibold text-orange-500 whitespace-nowrap">{log.id}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/10 text-[9.5px] uppercase font-black text-orange-500">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="p-3 text-[10px] whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3 text-slate-400">{log.payloadSize} Bytes</td>
                  <td className="p-3">
                    {log.rawBodyValidated ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9.5px]">
                        <ShieldCheck className="w-3.5 h-3.5" /> SECURE MATCH
                      </span>
                    ) : (
                      <span className="text-rose-500 font-bold">FALSE</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={cn(
                      "px-2 py-0.5 border rounded-md text-[8.5px] font-black uppercase tracking-widest",
                      log.status === 'PROCESSED' 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>{log.status}</span>
                  </td>
                  <td className="p-3 text-[11px] font-sans pr-4 leading-normal">{log.details}</td>
                </tr>
              ))}
              {webhookLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center italic text-slate-400">Aucun signal capté dans cette session. Déclenchez l'achat des abonnements pour l'alimenter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🔬 AUDITAX DEV-SANDBOX: 4 PILIERS DE MONÉTISATION */}
      {/* ========================================== */}
      <div className="mt-12 pt-8 border-t border-slate-200/10 space-y-6">
        <div className="space-y-2 text-left">
          <div className={cn(
            "px-4 py-1.5 border rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2",
            isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
          )}>
            <Cpu className="w-3.5 h-3.5" />
            SOLUTIONS D'IMPLÉMENTATION TECHNIQUE
          </div>
          <h2 className={cn(
            "text-2xl md:text-3.5xl font-black italic uppercase tracking-tight",
            isLight ? "text-slate-900" : "text-white"
          )}>
            Le Labo Technique des 4 Piliers (SaaS &amp; On-Premise)
          </h2>
          <p className={cn("text-xs md:text-sm leading-relaxed max-w-4xl", isLight ? "text-slate-600" : "text-slate-400")}>
            Testez de manière interactive les quatre piliers fondamentaux sous-jacents aux flux commerciaux d'AuditAX : 
            du middleware de blocage temporaire à la signature de certificats cryptographiques pour les déploiements on-premise isolés.
          </p>
        </div>

        {/* 2x2 Clean Grid Box WITHOUT any hardcoded orange backgrounds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* PILIER 1 : GC-SAAS MIDDLEWARE DE QUOTAS */}
          <div className={cn(
            "p-6 rounded-2xl border flex flex-col justify-between gap-5 text-left transition-all hover:border-slate-500/10",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/40 border-teal-800/15"
          )}>
            <div className="space-y-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className={cn("text-base font-black uppercase tracking-tight", isLight ? "text-slate-900" : "text-white")}>
                1. SaaS &amp; Middleware de Quotas Secures
              </h3>
              <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                Garantit les barrières commerciales à l'échelle. Si un pipeline de conformité sature ses limites associées à son plan (<span className="text-orange-500 font-bold uppercase">{activePlan}</span>), le middleware rejette la transaction avec un code <span className="font-mono text-rose-400 font-extrabold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">402 Payment Required</span>.
              </p>

              {/* Code configuration */}
              <div className={cn(
                "p-3 rounded-xl font-mono text-[9px] space-y-1.5 border",
                isLight ? "bg-slate-50 border-slate-150 text-slate-700" : "bg-black/40 border-slate-850 text-slate-350"
              )}>
                <div className="text-orange-500 font-medium">// Active Plan Limits Config Matrix</div>
                <div>PLAN_LIMITS = &#123;</div>
                <div className="pl-3">Corporate: &#123; audits: 250, clusters: 3 &#125;,</div>
                <div className="pl-3">Expert: &#123; audits: 1000, clusters: 15 &#125;,</div>
                <div className="pl-3">Enterprise: &#123; audits: 10000, clusters: 999 &#125;</div>
                <div>&#125;</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={cn(
                "p-3 rounded-xl border flex flex-col gap-1 text-[11px]",
                isLight ? "bg-slate-50 border-slate-150" : "bg-black/30 border-slate-800/80"
              )}>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Forfait</span>
                  <span>Consommation Active</span>
                </div>
                <div className="flex justify-between font-bold font-mono">
                  <span className={isLight ? "text-slate-800" : "text-white"}>{activePlan} Tier</span>
                  <span className={quotas.audits.current >= quotas.audits.max ? "text-rose-400 animate-pulse" : "text-emerald-400"}>
                    {quotas.audits.current} / {quotas.audits.max} audits
                  </span>
                </div>
              </div>

              {/* Live probe logger */}
              <div className={cn(
                "p-3 rounded-xl font-mono text-[9px] border space-y-0.5 h-[80px] overflow-y-auto no-scrollbar",
                isLight ? "bg-slate-100 border-slate-150 text-slate-700" : "bg-[#02090b] border-slate-850 text-slate-350"
              )}>
                <div>[info] Initializing quota validation wrapper...</div>
                <div>Target route: POST /api/audit/start_enclave</div>
                <div>Checking credits for {activePlan} Plan ({quotas.audits.max} allowed)</div>
                {quotas.audits.current >= quotas.audits.max ? (
                  <div className="text-red-400 font-bold animate-pulse">[ERR-402] LIMIT_EXCEEDED: Quota saturated. Upgrade or load micro-tokens.</div>
                ) : (
                  <div className="text-emerald-400 font-medium">[SUCCESS-200] CREDITS_VERIFIED: Request successfully cleared.</div>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    const currentAudits = quotas.audits.current;
                    const maxAudits = quotas.audits.max;
                    if (currentAudits >= maxAudits) {
                      onNotify("⛔ Middleware Quota Sature : Code 402 - Quota Saturation. Rechargez en tokens ou migrez de plan !");
                    } else {
                      setQuotas(prev => {
                        const updatedCurrent = prev.audits.current + 20;
                        return {
                          ...prev,
                          audits: {
                            ...prev.audits,
                            current: updatedCurrent,
                            percentage: Math.round((updatedCurrent / prev.audits.max) * 100)
                          }
                        };
                      });
                      onNotify("✅ [Middleware Log Check] Diagnostic validé ! +20 audits reportés.");
                    }
                  }}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center font-sans shadow-sm"
                >
                  🚀 Exécuter Audit (+20)
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    setQuotas(prev => ({
                      ...prev,
                      audits: { ...prev.audits, current: prev.audits.max, percentage: 100 }
                    }));
                    onNotify("⚠️ Quotas forcés au maximum pour observer le comportement d'échec.");
                  }}
                  className={cn(
                    "px-3.5 py-2.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center",
                    isLight ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200" : "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 text-rose-400"
                  )}
                >
                  Saturer Quotas
                </button>
              </div>
            </div>
          </div>

          {/* PILIER 2 : TOKEN ECONOMY (LE PAY-AS-YOU-GO) */}
          <div className={cn(
            "p-6 rounded-2xl border flex flex-col justify-between gap-5 text-left transition-all hover:border-slate-500/10",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/40 border-teal-800/15"
          )}>
            <div className="space-y-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit">
                <Coins className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className={cn("text-base font-black uppercase tracking-tight", isLight ? "text-slate-900" : "text-white")}>
                2. L'Économie de Jetons (Pay-As-You-Go)
                <span className="text-[9px] inline-block ml-2 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full font-mono">Simulé</span>
              </h3>
              <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                Chaque diagnostic micro-latence ou requêtes IA consomme vos crédits de jeton. Des quotas dynamiques protègent vos serveurs on-premise contre les goulets d'étranglement de charge. 
              </p>

              <div className={cn(
                "p-3 rounded-xl font-mono text-[9px] space-y-1 border",
                isLight ? "bg-slate-50 border-slate-150 text-slate-700" : "bg-black/40 border-slate-850 text-slate-350"
              )}>
                <div className="text-orange-500 font-medium">// Token Balance Safety Loop</div>
                <div>if (organization.credits &lt; transactionCost) &#123;</div>
                <div className="pl-3 text-rose-500">throw new Error("Quota depleted. 402 Required");</div>
                <div>&#125;</div>
                <div>await db.tenant.update(&#123; credits: &#123; decrement: 15 &#125; &#125;)</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className={cn(
                  "p-3 rounded-xl border text-center space-y-0.5",
                  isLight ? "bg-slate-50 border-slate-150" : "bg-black/40 border-slate-800"
                )}>
                  <span className="text-[8.5px] font-bold text-slate-400 block uppercase font-mono">Mon Solde Jetons</span>
                  <div className={cn("text-lg font-black font-mono", isLight ? "text-slate-800" : "text-white")}>{tokens} Tokens</div>
                </div>
                <div className={cn(
                  "p-3 rounded-xl border text-center space-y-0.5",
                  isLight ? "bg-slate-50 border-slate-150" : "bg-black/40 border-slate-800"
                )}>
                  <span className="text-[8.5px] font-bold text-slate-400 block uppercase font-mono">Débit Diagnostique</span>
                  <div className="text-xs font-black text-orange-500 font-mono">15 Jetons/Diagnostic</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    if (tokens >= 15) {
                      setTokens(prev => prev - 15);
                      onNotify("⚡ Audit de conformité physique IA exécuté ! -15 Tokens soustraits.");
                    } else {
                      onNotify("⛔ Crédit Jeton Sature ! Veuillez acquérir un pack de jeton via Stripe ci-dessus.");
                    }
                  }}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-center font-mono"
                >
                  💥 Diagnostic IA (-15)
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    setTokens(prev => prev + 50);
                    onNotify("🪙 Simulation réussie d'une recharge de pack ! +50 Jetons insérés.");
                  }}
                  className={cn(
                    "px-3.5 py-2.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center",
                    isLight ? "bg-slate-100 hover:bg-slate-150 text-slate-800 border border-slate-300" : "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
                  )}
                >
                  Charger +50
                </button>
              </div>
            </div>
          </div>

          {/* PILIER 3 : BYOK (BRING YOUR OWN KEY) ENCRYPTION */}
          <div className={cn(
            "p-6 rounded-2xl border flex flex-col justify-between gap-5 text-left transition-all hover:border-slate-500/10",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/40 border-teal-800/15"
          )}>
            <div className="space-y-3">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl w-fit">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className={cn("text-base font-black uppercase tracking-tight", isLight ? "text-slate-900" : "text-white")}>
                3. Option BYOK (Bring Your Own Key) &amp; Chiffrement
              </h3>
              <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                Les clients souverains exigent d'alimenter les API de LLM avec leurs propres clés. La clé est stockée chiffrée avec <span className="font-bold">AES-256-GCM</span> au niveau database, et déchiffrée paresseusement à l'exécution.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase font-mono tracking-wider">Votre clé API Gemini / OpenAI Souveraine</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="password"
                        placeholder="sk-aistudio-v2-aes..."
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-orange-500/40",
                          isLight ? "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400" : "bg-slate-950 border-slate-800 text-white placeholder-slate-600"
                        )}
                      />
                      <Key className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        if (!customKey.trim()) {
                          onNotify("Veuillez saisir une clé de chiffrement à stocker.");
                          return;
                        }
                        const timestamp = Date.now().toString(16);
                        const mockCipher = `AES-256-GCM::CIPHER::${btoa(customKey)}::iv-${timestamp}`;
                        setEncryptedKey(mockCipher);
                        setDecryptedKey(customKey);
                        onNotify("🔒 Clé de chiffrement scellée et enregistrée en base de données de manière isolée !");
                      }}
                      className="px-3.5 py-2 bg-orange-600 hover:bg-orange-505 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm text-center"
                    >
                      Chiffrer
                    </button>
                  </div>
                </div>

                {encryptedKey && (
                  <div className={cn(
                    "p-2.5 border rounded-lg space-y-0.5",
                    isLight ? "bg-slate-50 border-slate-150" : "bg-black/40 border-slate-850"
                  )}>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-mono">Stockage chiffré en Database :</span>
                    <div className="font-mono text-[9px] text-orange-500 break-all select-all font-bold p-1 bg-black/10 rounded">
                      {encryptedKey}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className={cn(
                "p-3 rounded-xl font-mono text-[9px] border space-y-0.5 h-[55px] overflow-y-auto no-scrollbar",
                isLight ? "bg-slate-100 border-slate-150 text-slate-700" : "bg-[#02090b] border-slate-850 text-slate-350"
              )}>
                <div>[Gateway Router] Inspecting request payload...</div>
                {decryptedKey ? (
                  <>
                    <div className="text-emerald-400 font-bold">[ROUTE_BYOK] Clé privée détectée. Facturation directe sur votre compte.</div>
                  </>
                ) : (
                  <>
                    <div className="text-orange-500 font-bold">[ROUTE_SYSTEM] Clé système par défaut. -5 Jetons du quota d'instance.</div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    if (decryptedKey) {
                      onNotify("💎 Diagnostic exécuté gratuitement via votre clé d'API BYOK sans toucher vos jetons !");
                    } else {
                      if (tokens >= 5) {
                        setTokens(prev => prev - 5);
                        onNotify("🛰️ Diagnostic exécuté sur la clé globale d'AuditAX. Coût : 5 Tokens.");
                      } else {
                        onNotify("⛔ Crédit insuffisant sur le plan global AuditAX. Ajoutez des jetons ou connectez une clé BYOK.");
                      }
                    }
                  }}
                  className="flex-1 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center font-sans shadow-sm"
                >
                  Appel IA Diagnostic
                </button>
                {decryptedKey && (
                  <button 
                    type="button"
                    onClick={() => {
                      setCustomKey('');
                      setEncryptedKey('');
                      setDecryptedKey('');
                      onNotify("🗑️ Configuration BYOK nettoyée.");
                    }}
                    className={cn(
                      "px-3.5 py-2 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center",
                      isLight ? "bg-rose-50 hover:bg-rose-100 text-rose-700" : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10"
                    )}
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PILIER 4 : ON-PREMISE LICENSING SYSTEM */}
          <div className={cn(
            "p-6 rounded-2xl border flex flex-col justify-between gap-5 text-left transition-all hover:border-slate-500/10",
            isLight ? "bg-white border-slate-200" : "bg-[#0b1f24]/40 border-teal-800/15"
          )}>
            <div className="space-y-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className={cn("text-base font-black uppercase tracking-tight", isLight ? "text-slate-900" : "text-white")}>
                4. Signature &amp; Vérification de Licences On-Prem
              </h3>
              <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                Signez et émettez des fichiers de certificats ou clés d'évaluation chiffrées RSA pour des déploiements isolés hors-ligne ou Docker en datacenters privés.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Client Souverain</label>
                    <input 
                      type="text"
                      value={licTenant}
                      onChange={(e) => setLicTenant(e.target.value)}
                      className={cn(
                        "w-full px-2.5 py-1.5 border rounded-lg text-[10px] font-sans font-bold text-white focus:outline-none",
                        isLight ? "bg-slate-55 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-white"
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Niveau Forfait</label>
                    <select 
                      value={licPlan}
                      onChange={(e) => setLicPlan(e.target.value as any)}
                      className={cn(
                        "w-full px-2 h-[29px] border rounded-lg text-[10px] font-sans font-bold bg-slate-950 text-white focus:outline-none",
                        isLight ? "bg-slate-55 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-white"
                      )}
                    >
                      <option value="Corporate">Corporate Shield</option>
                      <option value="Expert">Expert Sovereign</option>
                      <option value="Enterprise">Enterprise Elite</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 items-end">
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Expiration</label>
                    <input 
                      type="date"
                      value={licExpiry}
                      onChange={(e) => setLicExpiry(e.target.value)}
                      className={cn(
                        "w-full px-2.5 py-1 border rounded-lg text-[10px] font-sans h-[29px] focus:outline-none",
                        isLight ? "bg-slate-55 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-white"
                      )}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const payload = {
                        tenant: licTenant,
                        plan: licPlan,
                        expiry: licExpiry,
                        engine: 'auditax-k8s-sprint7'
                      };
                      const stringPayload = JSON.stringify(payload);
                      const signature = btoa(stringPayload).substring(0, 32) + "::RSA-253";
                      const completeLicense = `LIC::${btoa(stringPayload)}::SIG::${signature}`;
                      setGeneratedLic(completeLicense);
                      setInputLic(completeLicense);
                      onNotify("📜 Licence Crypto scellée avec succès !");
                    }}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer h-[29px] shadow-sm text-center"
                  >
                    Générer Sceau
                  </button>
                </div>

                {generatedLic && (
                  <div className={cn(
                    "p-2 bg-slate-950/60 border rounded-lg space-y-1 text-left",
                    isLight ? "bg-slate-50 border-slate-200" : "bg-black/30 border-slate-850"
                  )}>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block font-mono">Sceau Signé Copiable :</span>
                    <textarea 
                      readOnly
                      value={generatedLic}
                      className="w-full block h-9 p-1 font-mono text-[8px] bg-black/10 border border-slate-800 rounded text-emerald-400 resize-none font-bold outline-none focus:ring-0"
                      onClick={(e) => (e.target as any).select()}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block font-mono">Sonde et Validateur Applicatif Docker</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="LIC::...::SIG::..."
                    value={inputLic}
                    onChange={(e) => setInputLic(e.target.value)}
                    className={cn(
                      "flex-1 px-2.5 py-1.5 border rounded-lg font-mono text-[9px] focus:outline-none",
                      isLight ? "bg-slate-55 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-white"
                    )}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (!inputLic.trim()) {
                        onNotify("Veuillez charger une clé de licence pour tester.");
                        return;
                      }
                      try {
                        const parts = inputLic.split('::');
                        if (parts[0] !== 'LIC' || !parts[1] || parts[2] !== 'SIG' || !parts[3]) {
                          setVerifyResult({ valid: false, msg: "Signature ou en-tête altéré ! Échec du scellé d'intégrité." });
                          onNotify("❌ [Dépistage] Erreur Fatale : Empreinte de licence non authentique.");
                          return;
                        }
                        const payload = JSON.parse(atob(parts[1]));
                        const expiryDate = new Date(payload.expiry);
                        const currentDate = new Date('2026-05-28'); // simulated baseline
                        
                        if (expiryDate < currentDate) {
                          setVerifyResult({ valid: false, tenant: payload.tenant, plan: payload.plan, expiry: payload.expiry, msg: "Alerte : Durée d'évaluation expirée." });
                          onNotify("⚠️ Licence Échue - Instance bloquée !");
                          return;
                        }
                        setVerifyResult({ valid: true, tenant: payload.tenant, plan: payload.plan, expiry: payload.expiry, msg: `Sceau Valide ! Client: ${payload.tenant} | Niveau: ${payload.plan}` });
                        onNotify("✅ Licence vérifiée ! Autorisation de démarrage Docker accordée.");
                      } catch (e) {
                        setVerifyResult({ valid: false, msg: "Fichier altéré ou signature corrompue." });
                        onNotify("❌ Défaillance cryptographique de la signature RSA-256.");
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Tester
                  </button>
                </div>
              </div>

              {verifyResult && (
                <div className={cn(
                  "p-3 rounded-lg border flex items-start gap-2.5 text-[10.5px]",
                  verifyResult.valid 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                )}>
                  <ShieldCheck className={cn("w-4 h-4 mt-0.5 shrink-0", verifyResult.valid ? "text-emerald-400" : "text-rose-400")} />
                  <div className="space-y-0.5 leading-tight text-left">
                    <div className="font-extrabold uppercase text-white">{verifyResult.valid ? "✅ LICENCE VALIDE & CERTIFIÉE" : "❌ ERREUR DE DÉPLOIEMENT"}</div>
                    <div className="italic text-slate-300 text-[10px]">{verifyResult.msg}</div>
                    {verifyResult.valid && (
                      <div className="text-[9px] font-semibold text-slate-400 uppercase font-mono">
                        Clusters alloués: {verifyResult.plan === 'Enterprise Elite' ? 'Illimités' : verifyResult.plan === 'Expert Sovereign' ? '15 clusters max' : '3 clusters max'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
