import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, Badge, DownloadPDFButton } from '../../App';
import { DashboardData, Risk, Zone, Employee, OrgNode } from '../../types';

// Unpack icons used
const { Users, Clock, ShieldAlert, Zap, FileText, Plus, Trash2, ChevronRight, BarChart3, Brain, Sparkles, RefreshCw, Save, ArrowLeft, CheckCircle2, Database, Search, Layout, TableProperties } = Lucide;

export const BillingPanel = ({ onNotify }: { onNotify: (m: string) => void }) => {
  const plans = [
    { 
      name: "SaaS Expert", 
      price: "$99", 
      period: "/ mo",
      badge: "Individual",
      description: "Individual command post for high-value experts.",
      features: ["Cognitive AI Assistant", "Unlimited Nodes", "Basic RAG Storage", "Community Support"],
      cta: "Initialize Proxy",
      color: "bg-slate-900"
    },
    { 
      name: "Corporate", 
      price: "$299", 
      period: "/ user / mo",
      badge: "Team",
      description: "Standardization of analysis intelligence within your critical departments.",
      features: ["Priority Neural Link", "Team Synchronization", "Advanced RAG Storage (1TB)", "Dedicated Relay Hub"],
      cta: "Sync Team",
      color: "sunset-gradient",
      highlight: true
    },
    { 
      name: "Enterprise", 
      price: "Custom", 
      period: "/ annual",
      badge: "Elite",
      description: "The complete neural operating system for institutions and governments.",
      features: ["On-Premise Deployment", "Unlimited RAG Context", "White Label Interface", "SLA: 99.99% Neural Uptime"],
      cta: "Establish Link",
      color: "bg-black"
    }
  ];

  return (
    <div className="space-y-16 py-8">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-block px-4 py-1.5 bg-sunset-orange/10 border border-sunset-orange/20 rounded-full text-[10px] font-black text-sunset-orange uppercase tracking-widest italic animate-pulse">
          Elite Licensing Models
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-[0.9]">
          The Price of <br /><span className="text-sunset-orange">Certainty</span>
        </h2>
        <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
          Nexus AI is not a tool; it is an instrument of decision. We don't sell code; we sell time, clarity, and the power of immediate insight.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-5 md:p-10 rounded-3xl md:rounded-[3rem] border relative overflow-hidden flex flex-col group transition-all duration-500",
              plan.highlight ? "border-sunset-orange/30 shadow-2xl shadow-sunset-orange/10 bg-white" : "border-slate-100 bg-white hover:border-slate-300"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-0 w-full h-2 sunset-gradient" />
            )}
            <div className="space-y-8 flex-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{plan.badge}</span>
                  {plan.highlight && <Zap className="w-5 h-5 text-sunset-orange animate-pulse" />}
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">{plan.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black italic tracking-tighter text-slate-900">{plan.price}</span>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">{plan.period}</span>
              </div>

              <div className="space-y-4">
                <div className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] italic mb-4">Neural Capabilities</div>
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[11px] font-bold text-slate-600 italic">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onNotify(`${plan.name} license request initiated.`)}
              className={cn(
                "mt-12 w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all active:scale-95",
                plan.highlight ? "sunset-gradient text-white shadow-xl shadow-sunset-orange/20" : "bg-slate-900 text-white"
              )}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-12 bg-slate-900 rounded-3xl md:rounded-[3rem] text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,77,0,0.1)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative z-10 space-y-6">
          <h4 className="text-3xl font-black italic tracking-tighter text-white uppercase">The "Early Vector" Advantage</h4>
          <p className="text-white/40 text-sm max-w-2xl mx-auto italic font-medium">
            Be one of the first 100 officers to establish a neural link and lock in our foundation pricing. Exclusivity is a feature, not a choice.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-black text-white italic tracking-tighter">74 / 100</div>
              <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mt-1 italic">Nodes Claimed</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-sunset-orange italic tracking-tighter">ESTABLISHED</div>
              <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mt-1 italic">SLA Confidence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
