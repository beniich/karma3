import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, Badge, DownloadPDFButton } from '../../App';
import { DashboardData, Risk, Zone, Employee, OrgNode } from '../../types';

// Unpack icons used
const { Users, Clock, ShieldAlert, Zap, FileText, Plus, Trash2, ChevronRight, BarChart3, Brain, Sparkles, RefreshCw, Save, ArrowLeft, CheckCircle2, Database, Search, Layout, TableProperties } = Lucide;

export const AIControlCenter = ({ data, actions, onNotify }: { data: DashboardData; actions: any; onNotify: (m: string) => void }) => {
  const { 
    updateRisk, 
    updateZone, 
    updateEmployee, 
    removeEmployee, 
    updateConfig,
    updateRecommendation,
    updateDocument
  } = actions;

  const handleEditRisk = (id: string, field: keyof Risk, value: string) => {
    updateRisk(id, { [field]: value });
  };

  const handleEditZone = (name: string, field: keyof Zone, value: string | number) => {
    updateZone(name, { [field]: value });
  };

  const handleEditPerf = (field: keyof DashboardData['performance'], value: number) => {
    updateConfig({ performance: { ...data.performance, [field]: value } });
  };

  const updateOrgNode = (group: keyof DashboardData['orgChart'], id: string, field: keyof OrgNode, value: any) => {
    const chart = { ...data.orgChart };
    if (group === 'director') {
      chart.director = { ...chart.director, [field]: value };
    } else {
      const nodes = [...(chart[group] as OrgNode[])];
      chart[group] = nodes.map(n => n.id === id ? { ...n, [field]: value } : n) as any;
    }
    updateConfig({ orgChart: chart });
  };

  const addOrgNode = (group: keyof DashboardData['orgChart']) => {
    if (group === 'director') return;
    const chart = { ...data.orgChart };
    const newNode: OrgNode = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'Nouveau Poste',
      name: 'Nouveau Membre',
      ...(group === 'supervisors' ? { isProblematic: false } : {})
    };
    (chart[group] as OrgNode[]).push(newNode);
    updateConfig({ orgChart: chart });
  };

  const removeOrgNode = (group: keyof DashboardData['orgChart'], id: string) => {
    if (group === 'director') return;
    const chart = { ...data.orgChart };
    chart[group] = (chart[group] as OrgNode[]).filter(n => n.id !== id) as any;
    updateConfig({ orgChart: chart });
  };

  const moveOrgNode = (group: keyof DashboardData['orgChart'], id: string, direction: 'up' | 'down') => {
    if (group === 'director') return;
    const chart = { ...data.orgChart };
    const nodes = [...(chart[group] as OrgNode[])];
    const index = nodes.findIndex(n => n.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= nodes.length) return;
    
    const [movedNode] = nodes.splice(index, 1);
    nodes.splice(newIndex, 0, movedNode);
    
    chart[group] = nodes as any;
    updateConfig({ orgChart: chart });
  };

  const handleEditEmployee = (id: string, field: keyof Employee, value: string) => {
    updateEmployee(id, { [field]: value });
  };

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: `E${Math.floor(Math.random() * 1000)}`,
      name: 'New Employee',
      role: 'Staff',
      email: 'new@auditax.com',
      phone: '+1 555-0000'
    };
    updateEmployee(newEmployee.id, newEmployee);
  };

  return (
    <div id="config-hub-view" className="space-y-8 pb-16">
      <div className="flex justify-end">
        <DownloadPDFButton targetId="config-hub-view" fileName="AuditAX-Setup-Configuration" iconOnly onEmailSent={onNotify} />
      </div>
      <Card title="Employee Directory Management" icon={Users}>
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nexus Personnel Hub</span>
                <span className="text-sm font-black text-slate-900 uppercase italic">Configure project staff & contact vectors</span>
             </div>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={addEmployee}
               className="sunset-gradient text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-sunset-orange/20 flex items-center gap-2"
             >
               <Plus className="w-4 h-4" /> Add Personnel
             </motion.button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.employees.map((emp) => (
              <div key={emp.id} className="glass-card p-6 rounded-3xl border border-slate-100 group relative hover:border-sunset-orange/30 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      value={emp.name} 
                      onChange={e => handleEditEmployee(emp.id, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black italic outline-none focus:border-sunset-orange transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role / Designation</label>
                    <input 
                      value={emp.role} 
                      onChange={e => handleEditEmployee(emp.id, 'role', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black italic outline-none focus:border-sunset-orange transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Vector</label>
                    <input 
                      value={emp.email} 
                      onChange={e => handleEditEmployee(emp.id, 'email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black italic outline-none focus:border-sunset-orange transition-all"
                    />
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Link</label>
                      <input 
                        value={emp.phone} 
                        onChange={e => handleEditEmployee(emp.id, 'phone', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black italic outline-none focus:border-sunset-orange transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => removeEmployee(emp.id)}
                      className="w-10 h-10 flex items-center justify-center text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 mb-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Nexus Node Management" icon={Users}>
        <div className="space-y-10">
          {/* Director Edit */}
          <div className="wrapper bg-slate-50/50 p-4 sm:p-8 rounded-[2rem] border border-slate-100 shadow-inner">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em] flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full sunset-gradient" /> CORE COMMAND
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                <input value={data.orgChart.director.role} onChange={e => updateOrgNode('director', 'dir', 'role', e.target.value)} className="w-full text-xs font-black p-4 rounded-2xl bg-white border border-slate-100 outline-none focus:border-sunset-orange shadow-sm transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                <input value={data.orgChart.director.name} onChange={e => updateOrgNode('director', 'dir', 'name', e.target.value)} className="w-full text-xs font-black p-4 rounded-2xl bg-white border border-slate-100 outline-none focus:border-sunset-orange shadow-sm transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-header</label>
                <input value={data.orgChart.director.sub} onChange={e => updateOrgNode('director', 'dir', 'sub', e.target.value)} className="w-full text-xs font-black p-4 rounded-2xl bg-white border border-slate-100 outline-none focus:border-sunset-orange shadow-sm transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Intermediates Edit */}
            <div className="bg-slate-50/50 p-4 sm:p-8 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> MID-LAYER MGMT
                </h4>
                <button onClick={() => addOrgNode('intermediates')} className="w-8 h-8 sunset-gradient rounded-xl flex items-center justify-center text-white shadow-lg hover:rotate-90 transition-transform">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-6">
                {data.orgChart.intermediates.map((node, index) => (
                  <div key={node.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 pb-6 border-b border-slate-200/50 last:border-0 last:pb-0 items-end group">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                      <input value={node.role} onChange={e => updateOrgNode('intermediates', node.id, 'role', e.target.value)} className="w-full text-xs font-black p-3 rounded-xl bg-white border border-slate-100 focus:border-sunset-orange outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                      <input value={node.name} onChange={e => updateOrgNode('intermediates', node.id, 'name', e.target.value)} className="w-full text-xs font-black p-3 rounded-xl bg-white border border-slate-100 focus:border-sunset-orange outline-none transition-all" />
                    </div>
                    <div className="flex gap-1">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveOrgNode('intermediates', node.id, 'up')} disabled={index === 0} className="p-1 hover:text-sunset-orange disabled:opacity-20"><ChevronRight className="-rotate-90 w-4 h-4" /></button>
                        <button onClick={() => moveOrgNode('intermediates', node.id, 'down')} disabled={index === data.orgChart.intermediates.length - 1} className="p-1 hover:text-sunset-orange disabled:opacity-20"><ChevronRight className="rotate-90 w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeOrgNode('intermediates', node.id)} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

              <div className="bg-red-50/30 p-4 sm:p-8 rounded-[2.5rem] border border-red-100/50 shadow-inner">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-[10px] font-black uppercase text-red-400 tracking-[0.3em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> AUDIT TARGETS
                </h4>
                <button onClick={() => addOrgNode('supervisors')} className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:rotate-90 transition-transform">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-6">
                {data.orgChart.supervisors.map((node, index) => (
                  <div key={node.id} className="grid grid-cols-[1fr_auto] gap-4 pb-6 border-b border-red-100/50 last:border-0 last:pb-0 items-start">
                    <div className="space-y-4">
                       <div className="flex gap-3">
                          <input value={node.name} onChange={e => updateOrgNode('supervisors', node.id, 'name', e.target.value)} className="flex-1 text-xs font-black p-4 rounded-2xl border border-red-100 bg-white focus:border-red-500 outline-none" placeholder="Supervisor Name" />
                          <div className="flex items-center gap-3 px-4 bg-white rounded-2xl border border-red-100 shrink-0">
                             <input type="checkbox" checked={node.isProblematic} onChange={e => updateOrgNode('supervisors', node.id, 'isProblematic', e.target.checked)} id={`node-${node.id}`} className="accent-red-600 w-4 h-4" />
                             <label htmlFor={`node-${node.id}`} className="text-[10px] font-black uppercase text-red-600 cursor-pointer tracking-widest italic">FLAGGED</label>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <input value={node.role || ''} onChange={e => updateOrgNode('supervisors', node.id, 'role', e.target.value)} className="w-full text-[10px] font-black p-3 rounded-xl bg-slate-50 border border-transparent focus:border-red-200 outline-none uppercase tracking-widest italic" placeholder="Supervisor Role" />
                          <input value={node.teamName || ''} onChange={e => updateOrgNode('supervisors', node.id, 'teamName', e.target.value)} className="w-full text-[10px] font-black p-3 rounded-xl bg-slate-50 border border-transparent focus:border-red-200 outline-none uppercase tracking-widest italic text-sunset-orange placeholder:text-sunset-orange/40" placeholder="Team Name" />
                       </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveOrgNode('supervisors', node.id, 'up')} disabled={index === 0} className="p-1 hover:text-red-600 disabled:opacity-20"><ChevronRight className="-rotate-90 w-4 h-4" /></button>
                        <button onClick={() => moveOrgNode('supervisors', node.id, 'down')} disabled={index === data.orgChart.supervisors.length - 1} className="p-1 hover:text-red-600 disabled:opacity-20"><ChevronRight className="rotate-90 w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeOrgNode('supervisors', node.id)} className="w-10 h-10 flex items-center justify-center bg-white text-red-400 hover:text-red-700 rounded-2xl shadow-sm border border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Nexus Performance Core Editor" icon={BarChart3}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Object.entries(data.performance).map(([key, val]) => (
            <div key={key} className="space-y-3 p-6 glass-card rounded-[2rem] border-slate-100">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full sunset-gradient" /> {key}
              </label>
              <div className="relative group">
                 <input 
                  type="number" 
                  value={val} 
                  onChange={(e) => handleEditPerf(key as any, parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-2xl font-black text-slate-900 outline-none focus:border-sunset-orange focus:bg-white transition-all shadow-inner italic"
                 />
                 <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Crisis Intel Matrix" icon={ShieldAlert}>
        <div className="overflow-x-auto no-scrollbar custom-scrollbar">
          <table className="w-full text-left text-[10px] uppercase tracking-[0.2em] border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100 italic">
              <tr>
                <th className="px-6 py-4 font-black">#</th>
                <th className="px-6 py-4 font-black">Domain</th>
                <th className="px-6 py-4 font-black">Core Intel</th>
                <th className="px-6 py-4 font-black">Criticité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.risks.map((risk) => (
                <tr key={risk.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-300 group-hover:text-sunset-orange transition-colors">{risk.id}</td>
                  <td className="px-6 py-4">
                    <input 
                      value={risk.domain} 
                      onChange={(e) => handleEditRisk(risk.id, 'domain', e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:text-sunset-orange font-black italic uppercase transition-colors"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <input 
                      value={risk.desc} 
                      onChange={(e) => handleEditRisk(risk.id, 'desc', e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:text-sunset-orange font-medium italic"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={risk.crit} 
                      onChange={(e) => handleEditRisk(risk.id, 'crit', e.target.value as any)}
                      className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm outline-none focus:border-sunset-orange transition-all cursor-pointer"
                    >
                      <option value="Critique">Critical</option>
                      <option value="Élevé">High</option>
                      <option value="Moyen">Medium</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Operational Recommendations" icon={Zap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.recommendations.map((rec) => (
            <div key={rec.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rec.id} Vector</span>
                <Badge variant={rec.color === 'red' ? 'crit' : 'orange'}>{rec.color}</Badge>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                <input 
                  value={rec.title} 
                  onChange={e => updateRecommendation(rec.id, { title: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black italic outline-none focus:border-sunset-orange transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Action Items (comma separated)</label>
                <textarea 
                  value={rec.list.join(', ')} 
                  onChange={e => updateRecommendation(rec.id, { list: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium italic outline-none focus:border-sunset-orange transition-all min-h-[100px]"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Document Registry Management" icon={FileText}>
        <div className="overflow-x-auto no-scrollbar custom-scrollbar">
          <table className="w-full text-left text-[10px] uppercase tracking-[0.2em] border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100 italic">
              <tr>
                <th className="px-6 py-4 font-black">Ref</th>
                <th className="px-6 py-4 font-black">Title</th>
                <th className="px-6 py-4 font-black">Type</th>
                <th className="px-6 py-4 font-black">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.complianceDocs.map((doc) => (
                <tr key={doc.ref} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-300 italic">{doc.ref}</td>
                  <td className="px-6 py-4">
                    <input 
                      value={doc.title} 
                      onChange={e => updateDocument(doc.ref, { title: e.target.value })}
                      className="w-full bg-transparent border-none outline-none focus:text-sunset-orange font-black italic transition-colors"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      value={doc.nature} 
                      onChange={e => updateDocument(doc.ref, { nature: e.target.value })}
                      className="w-full bg-transparent border-none outline-none focus:text-sunset-orange font-bold uppercase tracking-widest transition-colors"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={doc.priority} 
                      onChange={e => updateDocument(doc.ref, { priority: e.target.value as any })}
                      className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-sunset-orange"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Solar Expansion Nodes" icon={Zap}>
        <div className="overflow-x-auto no-scrollbar custom-scrollbar">
          <table className="w-full text-left text-[10px] uppercase tracking-[0.2em] border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100 italic">
              <tr>
                <th className="px-6 py-4 font-black">Node Name</th>
                <th className="px-6 py-4 text-center font-black">Claims</th>
                <th className="px-6 py-4 font-black">Cause</th>
                <th className="px-6 py-4 font-black">Nexus Vector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.zones.map((zone) => (
                <tr key={zone.name} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800 group-hover:text-sunset-orange transition-colors italic">{zone.name}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number"
                      value={zone.claims} 
                      onChange={(e) => handleEditZone(zone.name, 'claims', parseInt(e.target.value) || 0)}
                      className="w-20 bg-white border border-slate-100 rounded-xl px-2 py-4 text-center outline-none focus:border-sunset-orange font-black text-2xl italic tracking-tighter shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      value={zone.cause} 
                      onChange={(e) => handleEditZone(zone.name, 'cause', e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:text-sunset-orange italic font-medium"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      value={zone.solution} 
                      onChange={(e) => handleEditZone(zone.name, 'solution', e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:text-sunset-orange font-black italic text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
