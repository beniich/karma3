import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, Badge, DownloadPDFButton } from '../../App';
import { DashboardData, Risk, Zone, Employee, OrgNode } from '../../types';

// Unpack icons used
const { Users, Clock, ShieldAlert, Zap, FileText, Plus, Trash2, ChevronRight, BarChart3, Brain, Sparkles, RefreshCw, Save, ArrowLeft, CheckCircle2, Database, Search, Layout, TableProperties } = Lucide;

export const UserSettings = ({ user, onNotify }: { user: any; onNotify: (m: string) => void }) => {
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || '??';

  return (
    <div id="profile-view" className="space-y-8">
      <div className="flex justify-end">
        <DownloadPDFButton targetId="profile-view" fileName="AuditAX-Profile-Officer" iconOnly onEmailSent={onNotify} />
      </div>
      <Card title="Elite Officer Profile" icon={Users}>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-48 h-48 rounded-[3rem] p-1 sunset-gradient shadow-2xl shrink-0 overflow-hidden">
            <div className="w-full h-full bg-white rounded-[2.8rem] flex items-center justify-center font-black text-6xl text-sunset-orange italic overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                initials
              )}
            </div>
          </div>
          <div className="space-y-8 flex-1">
            <div className="space-y-2">
              <Badge variant="crit" className="mb-4">Active Clearance</Badge>
              <h2 className="text-4xl font-black italic text-slate-900 uppercase tracking-tighter">{user?.displayName || 'Elite User'}</h2>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-widest italic">{user?.email || 'NEXUS Agent'}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Division Vector</div>
                <div className="text-lg font-black text-slate-900 tracking-tight italic">Audit & Global Integrity</div>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Security Node ID</div>
                <div className="text-lg font-black text-slate-900 font-mono tracking-tight">{user?.uid?.substring(0, 8).toUpperCase() || 'NODE-PENDING'}</div>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Last Login Axis</div>
                <div className="text-lg font-black text-slate-900 tracking-tight italic">Authenticated Session</div>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Neural Sync Status</div>
                <div className="text-lg font-black text-emerald-600 tracking-tight italic">Optimized (99.8%)</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card title="Activity Stream" icon={Clock} className="md:col-span-2">
            <div className="space-y-6">
              {[
                { time: '09:42', action: 'Compliance matrix updated', node: 'Node-7' },
                { time: '08:15', action: 'Risk exposure recalibrated', node: 'Core' },
                { time: 'Yesterday', action: 'New service deployment authorized', node: 'Vector-H' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sunset-orange/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">{activity.time}</span>
                    <span className="text-sm font-bold text-slate-700 italic">{activity.action}</span>
                  </div>
                  <Badge variant="blue">{activity.node}</Badge>
                </div>
              ))}
            </div>
         </Card>
         <Card title="System Credentials" icon={ShieldAlert}>
            <div className="space-y-4">
              <div className="h-40 w-full rounded-2xl sunset-gradient p-1">
                 <div className="w-full h-full bg-slate-950 rounded-[0.9rem] flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-[8px] font-black text-sunset-orange uppercase tracking-[0.4em] mb-2">Nexus Certificate</div>
                    <div className="w-12 h-1 bg-sunset-orange/30 rounded-full mb-4" />
                    <div className="text-[10px] font-medium text-white/40 leading-relaxed italic">Encryption layers active. Digital signature verified. Access persistent.</div>
                 </div>
              </div>
              <button 
                onClick={() => onNotify("Certificate renewal request dispatched.")}
                className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-center"
              >
                Renew Credentials
              </button>
            </div>
         </Card>
      </div>
    </div>
  );
};
