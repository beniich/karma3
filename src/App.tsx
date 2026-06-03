import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Activity, 
  ClipboardList, 
  Calendar as CalendarIcon, 
  FileText, 
  ShieldAlert, 
  Zap, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  ArrowRight,
  ArrowLeft,
  Settings,
  Plus,
  Trash2,
  Save,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  LogIn,
  LogOut,
  RefreshCw,
  Brain,
  Sparkles,
  Layout,
  TableProperties,
  ArrowUp,
  Database,
  BookOpen,
  Download,
  Mail,
  Check,
  X,
  ShieldCheck,
  Key,
  Globe,
  Terminal,
  Play,
  Lock,
  GraduationCap,
  Award,
  Cpu,
  CreditCard,
  Workflow,
  FileSpreadsheet,
  Loader2,
  Menu,
  Bell,
  Sun,
  Moon,
  HeartPulse,
  Truck,
  Code,
  HelpCircle,
  User,
  Wifi,
  Eye
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Risk, type Zone, type Recommendation, type Document, type DashboardData, type OrgNode, type Service, type Employee, type Subscriber } from './types';
import { useFirebaseDashboard } from './hooks/useFirebaseDashboard';
import { useSocket } from './hooks/useSocket';
import { signInWithGoogle, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { MultiTenancySection } from './components/MultiTenancySection';
import { StripeMonetizationSection } from './components/StripeMonetizationSection';
import { DirtyDozenSection } from './components/DirtyDozenSection';
import { IntegrationHubSection } from './components/IntegrationHubSection';
import { GmailSentinelSection } from './components/GmailSentinelSection';
import { SheetsSentinelSection } from './components/SheetsSentinelSection';
import { ComplianceMappingSection } from './components/ComplianceMappingSection';
import { Karma3Hub } from './components/Karma3Hub';
import { SanteConnectSection } from './components/SanteConnectSection';
import { BackendConnectSection } from './components/BackendConnectSection';
import { HighFidelityIcon } from './components/HighFidelityIcon';
import { SystemIntegrityModal } from './components/SystemIntegrityModal';

// --- New Sovereign Device Karma3 V2 Layout Components ---
import { Karma3MainDashboard } from './components/Karma3MainDashboard';
import { Karma3SupportCenter } from './components/Karma3SupportCenter';
import { Karma3ProfileSettings } from './components/Karma3ProfileSettings';
import { Karma3ScriptLibrary } from './components/Karma3ScriptLibrary';
import { SecurityCommandCenter } from './components/SecurityCommandCenter';
import { TacticalResponseRuleEngine } from './components/TacticalResponseRuleEngine';
import { Karma3ArchitectureOverview } from './components/Karma3ArchitectureOverview';
import { FleetMonitoring } from './components/FleetMonitoring';
import { DeviceInventoryList } from './components/DeviceInventoryList';
import { SovereignSubscribersRegistry } from './components/SovereignSubscribersRegistry';
import { Karma3AIAnalysisStudio } from './components/Karma3AIAnalysisStudio';
import { SovereignReportsSection } from './components/SovereignReportsSection';

// --- Types ---
type TabType = 'summary' | 'compliance' | 'risk' | 'org' | 'services' | 'intelligence' | 'profile' | 'config' | 'handbook' | 'subscribers' | 'license' | 'bastion' | 'roadmap' | 'academy' | 'admin' | 'multitenancy' | 'monetization' | 'dirtydozen' | 'integrations' | 'gmail' | 'sheets' | 'karma3' | 'sante' | 'fleet' | 'inventory' | 'security' | 'rule-engine' | 'scripts' | 'architecture' | 'support' | 'connect';

// --- Mock Data for Charts ---
const EXPOSURE_TREND = [
  { month: 'Jan', exposure: 400, projected: 400 },
  { month: 'Feb', exposure: 600, projected: 600 },
  { month: 'Mar', exposure: 800, projected: 800 },
  { month: 'Apr', exposure: 900, projected: 900 },
  { month: 'May', exposure: 1100, projected: 1100 },
  { month: 'Jun', exposure: 1300, projected: 1300 },
  { month: 'Jul', exposure: 1500, projected: 1500 },
  { month: 'Aug', exposure: 1600, projected: 1600 },
  { month: 'Sep', exposure: 1800, projected: 1800 },
  { month: 'Oct', exposure: 2000, projected: 2000 },
  { month: 'Nov', exposure: null, projected: 2200 },
  { month: 'Dec', exposure: null, projected: 2400 },
];

const VOLATILITY_DATA = [
  { val: 12 }, { val: 18 }, { val: 15 }, { val: 24 }, { val: 20 }, 
  { val: 10 }, { val: 22 }, { val: 14 }, { val: 28 }, { val: 16 }, 
  { val: 25 }, { val: 19 }
];

const CREDIT_RISK_DATA = [
  { val: 2.1 }, { val: 1.8 }, { val: 2.3 }, { val: 2.0 }, { val: 2.5 }, 
  { val: 2.2 }, { val: 2.7 }, { val: 2.4 }, { val: 2.8 }, { val: 2.6 }
];

// --- Components ---

const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'crit'; className?: string }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    red: "bg-red-50 text-red-600 border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    orange: "bg-sunset-orange/10 text-sunset-orange border-sunset-orange/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    crit: "bg-sunset-red text-white border-transparent shadow-lg shadow-sunset-red/30 font-black",
  };
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] border font-black transition-all", variants[variant], className)}>
      {variant === 'crit' && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-white" />}
      {children}
    </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: any;
  tag?: React.ReactNode;
  key?: string | number;
}

const Card = ({ children, className, title, icon: Icon, tag }: CardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn("glass-card rounded-2xl md:rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-sunset-orange/10 transition-all duration-700", className)}
  >
    {(title || Icon || tag) && (
      <div className="px-5 py-4 md:px-8 md:py-6 border-b border-slate-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {Icon && (
            <HighFidelityIcon variant="neutral" size="sm" className="group-hover:scale-105 transition-transform duration-300">
              <Icon />
            </HighFidelityIcon>
          )}
          {title && <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-800">{title}</h3>}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto uppercase">
          {tag}
        </div>
      </div>
    )}
    <div className="p-5 md:p-8">{children}</div>
  </motion.div>
);

const GaugeChart = ({ value, label }: { value: number; label: string }) => {
  const data = [
    { value: value, fill: '#ff4d00' },
    { value: 100 - value, fill: '#e2e8f0' }
  ];

  return (
    <div className="relative w-full h-24 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={45}
            outerRadius={65}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <div className="text-lg font-black text-slate-900 leading-none">{label}</div>
        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status</div>
      </div>
    </div>
  );
};

const Sparkline = ({ data }: { data: any[] }) => (
  <div className="h-16 w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="val" 
          stroke="#ff4d00" 
          strokeWidth={3} 
          dot={false} 
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const SparklineBar = ({ data }: { data: any[] }) => (
  <div className="h-16 w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar 
          dataKey="val" 
          fill="#ff4d00" 
          radius={[4, 4, 0, 0]} 
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const KPI = ({ icon: Icon, value, label, sub, color = 'blue', chart }: { icon: any; value: string | number; label: string; sub: string; color?: 'red' | 'orange' | 'yellow' | 'blue'; chart?: React.ReactNode }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card rounded-[2rem] p-8 shadow-xl relative overflow-hidden group border-white h-full"
    >
      <div className="absolute top-0 right-0 w-24 h-24 sunset-gradient opacity-10 blur-3xl -translate-y-12 translate-x-12" />
      <div className="flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</div>
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:sunset-gradient group-hover:text-white transition-all duration-500">
             <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</div>
          {label === 'Liquidity Risk' && <ArrowDownRight className="w-6 h-6 text-sunset-orange" />}
        </div>
        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 uppercase tracking-wider mt-1">
          {sub}
        </div>
        <div className="mt-auto">
          {chart}
        </div>
      </div>
    </motion.div>
  );
};

const DownloadPDFButton = ({ targetId, fileName, className, iconOnly = false, onEmailSent }: { targetId: string; fileName: string; className?: string; iconOnly?: boolean; onEmailSent?: (msg: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const generatePDF = async (action: 'download' | 'email') => {
    setIsGenerating(true);
    if (action === 'email') setIsEmailing(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const element = document.getElementById(targetId);
      
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            // Fix for Tailwind 4 oklch colors which html2canvas cannot parse
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              * { 
                color-scheme: light !important;
              }
              [class*="bg-"], [class*="text-"], [class*="border-"] {
                --tw-bg-opacity: 1 !important;
                --tw-text-opacity: 1 !important;
                --tw-border-opacity: 1 !important;
              }
            `;
            clonedDoc.head.appendChild(style);
            
            // Force computed styles back to elements to bypass oklch parsing in some cases
            const allElements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i] as HTMLElement;
              const comp = window.getComputedStyle(el);
              if (comp.backgroundColor.includes('oklch')) el.style.backgroundColor = '#f8fafc'; // fallback slate-50
              if (comp.color.includes('oklch')) el.style.color = '#0f172a'; // fallback slate-900
              if (comp.borderColor.includes('oklch')) el.style.borderColor = '#e2e8f0'; // fallback slate-200
            }
          }
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        if (action === 'download') {
          doc.save(`${fileName}.pdf`);
        } else {
          // Simulate real sending process
          await new Promise(resolve => setTimeout(resolve, 1500));
          if (onEmailSent) {
            onEmailSent(`Report "${fileName}" injected into the SMTP stream.`);
          }
        }
      }
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
      setIsEmailing(false);
    }
  };

  if (iconOnly) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <button 
          onClick={() => generatePDF('download')}
          disabled={isGenerating}
          title="Télécharger PDF"
          className="p-2 bg-slate-900 text-white rounded-lg hover:bg-sunset-orange transition-all shadow-md disabled:opacity-50"
        >
          {isGenerating && !isEmailing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        </button>
        <button 
          onClick={() => generatePDF('email')}
          disabled={isGenerating}
          title="Envoyer par email"
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          {isEmailing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button 
        onClick={() => generatePDF('download')}
        disabled={isGenerating}
        className={cn(
          "flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sunset-orange hover:shadow-xl transition-all shadow-xl",
          isGenerating && !isEmailing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isGenerating && !isEmailing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        <span>{isGenerating && !isEmailing ? "Génération..." : "PDF"}</span>
      </button>
      <button 
        onClick={() => generatePDF('email')}
        disabled={isGenerating}
        className={cn(
          "flex items-center gap-2 px-3 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-md",
          isEmailing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isEmailing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
      </button>
    </div>
  );
};

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={cn(
        "fixed bottom-8 right-8 z-[100] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border backdrop-blur-xl",
        type === 'success' ? "bg-slate-900/90 border-emerald-500/30 text-white" : "bg-red-950/90 border-red-500/30 text-white"
      )}
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", type === 'success' ? "bg-emerald-500" : "bg-red-500")}>
        {type === 'success' ? <Check className="w-6 h-6 text-white" /> : <AlertTriangle className="w-6 h-6 text-white" />}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hub Notification</p>
        <p className="text-sm font-black italic tracking-tight">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 p-2 hover:bg-white/10 rounded-xl transition-colors">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </motion.div>
  );
};

const ProgressRow = ({ label, value, percentage }: { label: string; value: number | string; percentage: number }) => (
  <div className="space-y-3 mb-8 last:mb-0">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black uppercase text-slate-700 tracking-[0.2em]">{label}</span>
      <span className="text-xs font-black text-slate-900 tracking-tighter italic">({percentage}%)</span>
    </div>
    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 p-0.5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-full rounded-full sunset-gradient shadow-[0_0_15px_rgba(255,77,0,0.2)] relative"
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      </motion.div>
    </div>
  </div>
);

const SPARK_DATA = [
  { val: 10 }, { val: 25 }, { val: 15 }, { val: 30 }, { val: 20 }, { val: 45 }, { val: 35 }
];

interface UIAction {
  type: string;
  fieldId?: string;
  severity?: string;
  message?: string;
  reason?: string;
  component?: string;
  props?: any;
}

const parseUIResponse = (text: string) => {
  const actionRegex = /<UI_ACTION\s+([^>]+)\/>/gi;
  const actions: UIAction[] = [];
  
  const regex = new RegExp(actionRegex);
  let match;
  while ((match = regex.exec(text)) !== null) {
    const rawAttrs = match[1];
    const action: any = {};
    
    // Parse key-value attributes like type="..." or fieldId="..."
    const attrRegex = /(\w+)=["']([^"']*)["']/gi;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      action[attrMatch[1]] = attrMatch[2];
    }
    
    // Specifically parse props={...} which may contain valid JSON or key-value fields
    const propsMatch = rawAttrs.match(/props=(?:\{([^}]+)\}|"([^"]+)")/i);
    if (propsMatch) {
      const rawPropsStr = (propsMatch[1] || propsMatch[2] || "").trim();
      try {
        let cleanPropsStr = rawPropsStr
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
          .replace(/'/g, '"');
        action.props = JSON.parse(cleanPropsStr);
      } catch (e) {
        action.props = {};
        const kvRegex = /(\w+)\s*:\s*(?:["']([^"']*)["']|(\d+)|\[([^\]]+)\])/g;
        let kvMatch;
        while ((kvMatch = kvRegex.exec(rawPropsStr)) !== null) {
          const key = kvMatch[1];
          if (kvMatch[2] !== undefined) {
            action.props[key] = kvMatch[2];
          } else if (kvMatch[3] !== undefined) {
            action.props[key] = Number(kvMatch[3]);
          } else if (kvMatch[4] !== undefined) {
            try {
              action.props[key] = JSON.parse(`[${kvMatch[4].replace(/'/g, '"')}]`);
            } catch (pErr) {
              action.props[key] = [];
            }
          }
        }
      }
    }
    actions.push(action as UIAction);
  }
  
  const cleanText = text.replace(actionRegex, '').trim();
  return { cleanText, actions };
};

const GenerativeWidget = ({ 
  action, 
  onNotify, 
  onSelectField, 
  onSendMessage 
}: { 
  action: UIAction; 
  onNotify: (m: string) => void; 
  onSelectField?: (f: string) => void; 
  onSendMessage?: (p: string) => void; 
}) => {
  if (!action || !action.type) return null;

  switch (action.type) {
    case 'TRIGGER_ALERT': {
      const severity = action.severity || 'info';
      const isError = severity === 'error';
      const isWarning = severity === 'warning';
      
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-5 rounded-2xl border flex items-start gap-4 shadow-md border-l-4",
            isError ? "bg-red-50/80 border-red-200 border-l-red-500 text-red-800" :
            isWarning ? "bg-amber-50/80 border-amber-200 border-l-amber-500 text-amber-800" :
            "bg-blue-50/80 border-blue-200 border-l-blue-500 text-blue-800"
          )}
        >
          {isError ? (
            <HighFidelityIcon variant="danger" size="sm" className="mt-0.5 shrink-0 animate-bounce">
              <ShieldAlert />
            </HighFidelityIcon>
          ) : isWarning ? (
            <HighFidelityIcon variant="warning" size="sm" className="mt-0.5 shrink-0">
              <ShieldAlert />
            </HighFidelityIcon>
          ) : (
            <HighFidelityIcon variant="info" size="sm" className="mt-0.5 shrink-0">
              <Info />
            </HighFidelityIcon>
          )}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              {severity === 'error' ? 'CRITICAL DISCREPANCY' : severity === 'warning' ? 'ANOMALY DETECTED' : 'SYSTEM METRIC NOTICE'}
            </div>
            <p className="text-xs font-bold leading-relaxed">{action.message}</p>
          </div>
        </motion.div>
      );
    }

    case 'SUGGEST_FIELD': {
      const field = action.fieldId;
      if (!field) return null;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700/50 shadow-xl flex items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-sunset-orange animate-pulse" />
            </div>
            <div>
              <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Recommandation Pegasus</div>
              <h4 className="text-xs font-black text-sunset-orange uppercase tracking-tight mt-0.5">{field}</h4>
              <p className="text-[10px] text-white/70 italic mt-1 leading-normal">{action.reason}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onSelectField) onSelectField(field);
              if (onSendMessage) onSendMessage(`Analyze the field ${field} and show me its relationship with risks.`);
              onNotify(`Field ${field} selected and analyzed by Pegasus.`);
            }}
            className="px-4 py-2 bg-sunset-orange text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-sunset-orange/90 transition-all hover:scale-105 shrink-0 shadow-lg shadow-sunset-orange/20"
          >
            Add & Analyze
          </button>
        </motion.div>
      );
    }

    case 'RENDER_COMPONENT': {
      const comp = action.component;
      const props = action.props || {};
      const title = props.title || "Analyse de Données Augmentée";
      
      const renderChartContent = () => {
        if (comp === 'LineChart') {
          const chartData = props.data || [
            { name: 'Node-01', value: 45 },
            { name: 'Node-02', value: 65 },
            { name: 'Node-03', value: 85 },
            { name: 'Node-04', value: 55 },
          ];
          return (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '9px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="value" stroke="#ff4d00" strokeWidth={2.5} dot={{ r: 4, stroke: '#ff4d00', strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        }

        if (comp === 'BarChart') {
          const chartData = props.data || [
            { name: 'Secteur A', value: 60 },
            { name: 'Secteur B', value: 80 },
            { name: 'Secteur C', value: 40 },
          ];
          return (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '9px', fontWeight: 'bold' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff4d00' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        }

        if (comp === 'Gauge') {
          const val = Number(props.value) || 75;
          const subtitle = props.subtitle || "Indicateur optimal de conformité";
          return (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="55" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  <motion.circle 
                    cx="72" 
                    cy="72" 
                    r="55" 
                    stroke="url(#sunset-grad-id)" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 55}
                    initial={{ strokeDashoffset: 2 * Math.PI * 55 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 55 * (1 - val / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="sunset-grad-id" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff7b00" />
                      <stop offset="100%" stopColor="#ff4d00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black italic text-slate-900 tracking-tighter">{val}%</span>
                  <span className="text-[7px] font-black uppercase text-emerald-500 tracking-widest mt-1">AX-CONFIRMED</span>
                </div>
              </div>
              <p className="text-[9px] font-mono text-slate-400 uppercase mt-2 text-center">{subtitle}</p>
            </div>
          );
        }

        if (comp === 'ComparisonTable') {
          const list = props.data || [
            { col1: 'Critère', col2: 'Sujet A', col3: 'Compagnon' },
            { col1: 'Disponibilité', col2: 'Stable', col3: 'Stable' },
            { col1: 'Intégrité', col2: 'Stable', col3: 'Dérive' }
          ];
          const headers = list[0];
          const rows = list.slice(1);

          return (
            <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-slate-50/30">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-3 font-black uppercase text-slate-600 tracking-tight">{headers.col1}</th>
                    <th className="p-3 font-black uppercase text-slate-600 tracking-tight">{headers.col2}</th>
                    <th className="p-3 font-black uppercase text-slate-600 tracking-tight">{headers.col3}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-white/50 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{row.col1}</td>
                      <td className="p-3 font-mono text-slate-500">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                          row.col2 === 'Conforme' || row.col2 === 'Stable' || row.col2 === 'Online' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                        )}>
                          {row.col2}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-500">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                          row.col3 === 'Conforme' || row.col3 === 'Stable' || row.col3 === 'Online' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                        )}>
                          {row.col3}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      };

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sunset-orange animate-ping" />
              {title}
            </span>
            <span className="text-[8px] font-mono text-slate-300">COMP-AUTOGEN</span>
          </div>
          {renderChartContent()}
        </motion.div>
      );
    }

    default:
      return null;
  }
};

const TypewriterText = ({ 
  text, 
  speed = 10, 
  onComplete,
  onActionsDetected
}: { 
  text: string, 
  speed?: number, 
  onComplete?: () => void,
  onActionsDetected?: (actions: any[]) => void
}) => {
  const { cleanText, actions } = React.useMemo(() => parseUIResponse(text), [text]);
  const [displayedText, setDisplayedText] = useState('');
  
  const onActionsDetectedRef = React.useRef(onActionsDetected);
  const onCompleteRef = React.useRef(onComplete);
  const lastExecutedTextRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    onActionsDetectedRef.current = onActionsDetected;
  }, [onActionsDetected]);

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (actions.length > 0 && lastExecutedTextRef.current !== text) {
      lastExecutedTextRef.current = text;
      onActionsDetectedRef.current?.(actions);
    }
  }, [actions, text]);

  useEffect(() => {
    setDisplayedText('');
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < cleanText.length) {
        setDisplayedText(prev => prev + cleanText[charIdx]);
        charIdx++;
      } else {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [cleanText, speed]);

  return (
    <div className="markdown-body prose prose-slate max-w-none prose-sm prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-widest prose-p:italic prose-strong:text-sunset-orange text-slate-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayedText}
      </ReactMarkdown>
    </div>
  );
};

const CommandPalette = ({ isOpen, onClose, onSelect, fieldGroups }: { isOpen: boolean, onClose: () => void, onSelect: (f: string) => void, fieldGroups: any[] }) => {
  const [query, setQuery] = useState('');
  
  const allFields = fieldGroups.flatMap(g => g.fields.map(f => ({ group: g.name, field: f })));
  const filtered = allFields.filter(f => f.field.toLowerCase().includes(query.toLowerCase()) || f.group.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes, metrics or tools... (Esc to close)"
            className="w-full bg-transparent border-none outline-none text-sm font-bold italic text-slate-900 placeholder:text-slate-300"
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2 no-scrollbar">
          {filtered.map((item, i) => (
            <button 
              key={i}
              onClick={() => {
                onSelect(item.field);
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors text-left group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.group}</span>
                <span className="text-xs font-bold text-slate-700 italic">{item.field}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-sunset-orange transition-colors" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 italic text-xs">No matching nodes found in directory.</div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-2">
            <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-400">ESC</kbd>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">to close</span>
          </div>
          <div className="flex gap-2">
            <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-400">ENTER</kbd>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">to select</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sections ---

const Karma3AISection = ({ data, onNotify, onExit }: { data: DashboardData; onNotify: (m: string) => void; onExit?: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    {
      role: 'ai',
      content: `👋 Hello! I am **Pegasus**, the Central Intelligence and Orchestrator of Karma3 AI.

I do not only analyze your compliance data, I also drive this interface in real-time to optimize your decision-making processes.

<UI_ACTION type="TRIGGER_ALERT" severity="warning" message="Minor anomaly of authentication drift detected on node Personnel_Registry." />

To start an analysis, ask me a question or try one of our predictive tools:
<UI_ACTION type="SUGGEST_FIELD" fieldId="Compliance_Score" reason="Crucial link to model the overall audit risk." />

Here is the current state of our node network:
<UI_ACTION type="RENDER_COMPONENT" component="Gauge" props={"value": 87, "title": "Overall Confidence Index", "subtitle": "Karma3 weighted security score"} />`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [activePage, setActivePage] = useState('page1');
  const [selectedVis, setSelectedVis] = useState<number | null>(0);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Karma3_Core_v1']);
  const [activeGroup, setActiveGroup] = useState<string>('Karma3_Core_v1');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Custom interactive & predictive state
  const [glowingFields, setGlowingFields] = useState<string[]>([]);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  // Hydrate from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('karma3-ai-storage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.messages && parsed.messages.length > 0) setMessages(parsed.messages);
        if (parsed.selectedFields) setSelectedFields(parsed.selectedFields);
        if (parsed.activeGroup) setActiveGroup(parsed.activeGroup);
      } catch (e) {
        console.error("Failed to restore Pegasus state:", e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('karma3-ai-storage', JSON.stringify({
      messages,
      selectedFields,
      activeGroup
    }));
  }, [messages, selectedFields, activeGroup]);

  // Highlight/glow fields mentioned in AI response
  const triggerGlow = (fields: string[]) => {
    setGlowingFields(prev => [...new Set([...prev, ...fields])]);
    setTimeout(() => {
      setGlowingFields(prev => prev.filter(f => !fields.includes(f)));
    }, 5500);
  };

  const scanForMentions = (text: string) => {
    const knownFields = [
      'Audit_Status', 'Compliance_Score', 'Node_Health',
      'Exposure_Value', 'Volatility_Delta', 'Sector_Impact',
      'CPU_Load', 'Memory_Buffer', 'Latency_ms',
      'Access_Level', 'Auth_Token', 'Node_ID'
    ];
    const found = knownFields.filter(f => text.toLowerCase().includes(f.toLowerCase()));
    if (found.length > 0) {
      triggerGlow(found);
    }
  };

  const selectFieldExplicitly = (field: string) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) return prev;
      return [...prev, field];
    });
  };

  const fieldGroups = [
    { name: 'Karma3_Core_v1', fields: ['Audit_Status', 'Compliance_Score', 'Node_Health'] },
    { name: 'Risk_Heuristics', fields: ['Exposure_Value', 'Volatility_Delta', 'Sector_Impact'] },
    { name: 'Operational_Metrics', fields: ['CPU_Load', 'Memory_Buffer', 'Latency_ms'] },
    { name: 'Personnel_Registry', fields: ['Access_Level', 'Auth_Token', 'Node_ID'] }
  ];

  const groupMetrics: Record<string, { label: string; value: string; color: string }[]> = {
    'Karma3_Core_v1': [
      { label: 'System_Health', value: 'NOMINAL', color: 'text-emerald-500' },
      { label: 'Neural_Latency', value: '24ms', color: 'text-amber-500' },
      { label: 'Confidence_Score', value: '98.2%', color: 'text-slate-900' }
    ],
    'Risk_Heuristics': [
      { label: 'Volatility', value: '0.12 ∆', color: 'text-orange-500' },
      { label: 'Skew', value: '-0.45', color: 'text-emerald-500' },
      { label: 'Kurtosis', value: '2.8%', color: 'text-slate-900' }
    ],
    'Operational_Metrics': [
      { label: 'CPU_Load', value: '42%', color: 'text-emerald-500' },
      { label: 'Buffer_Saturation', value: 'Low', color: 'text-emerald-500' },
      { label: 'I/O_Wait', value: '1.2ms', color: 'text-slate-900' }
    ],
    'Personnel_Registry': [
      { label: 'Auth_Drift', value: 'Stable', color: 'text-emerald-500' },
      { label: 'Identity_Sync', value: '99.9%', color: 'text-emerald-500' },
      { label: 'Access_Anomalies', value: '0', color: 'text-emerald-500' }
    ]
  };

  const toggleGroup = (name: string) => {
    setActiveGroup(name);
    setExpandedGroups(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleActionsDetected = (actions: any[]) => {
    actions.forEach(action => {
      if (action.type === 'SELECT_FIELD' && action.fieldId) {
        selectFieldExplicitly(action.fieldId);
      }
      if (action.type === 'TRIGGER_ALERT' && action.message) {
        onNotify(action.message);
      }
    });
  };

  const sendMessage = async (customPrompt?: string, toolName?: string) => {
    const text = customPrompt || input;
    if (!text || loading) return;

    if (toolName) setActiveAnalysis(toolName);
    const newMessages = [...messages, { role: 'user', content: text } as const];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      let endpoint = '/api/ai/generate';
      let payload: any = { 
        prompt: `DATA CONTEXT (Use this information for your analysis):
${JSON.stringify({
  risks: data.risks.map(r => ({ domain: r.domain, crit: r.crit, desc: r.desc })),
  services: data.services.map(s => ({ name: s.name, status: s.status, eff: s.efficiency })),
  perf: data.performance,
  selectedFields
})}

USER QUERY:
${text}`,
        systemInstruction: `You are Pegasus, the Central Intelligence and Interface Orchestrator of Karma3 AI.
You are not just a text chat assistant, you have full power to dynamically manipulate the UI using special '<UI_ACTION>' action tags.

You must use these tags proactively to assist the user in their analysis:

1. SELECT_FIELD: Automatically check a field in the left data panel (without canceling it if already present).
   Available fields: Audit_Status, Compliance_Score, Node_Health, Exposure_Value, Volatility_Delta, Sector_Impact, CPU_Load, Memory_Buffer, Latency_ms, Access_Level, Auth_Token, Node_ID.
   Syntax: <UI_ACTION type="SELECT_FIELD" fieldId="Node_Health" />

2. RENDER_COMPONENT: Decide which interactive chart or widget to render directly below your response.
   Choose from: LineChart, BarChart, Gauge, ComparisonTable.
   - LineChart Example: <UI_ACTION type="RENDER_COMPONENT" component="LineChart" props={"field": "CPU_Load", "title": "CPU Load Trend", "data": [{"name": "00:00", "value": 30}, {"name": "04:00", "value": 45}, {"name": "08:00", "value": 85}, {"name": "12:00", "value": 60}, {"name": "16:00", "value": 75}]} />
   - ComparisonTable Example: <UI_ACTION type="RENDER_COMPONENT" component="ComparisonTable" props={"title": "Compliance Summary", "data": [{"col1": "Control", "col2": "SOC 2 Status", "col3": "ISO 27001"}, {"col1": "Auth Drift", "col2": "Compliant", "col3": "Compliant"}, {"col1": "Node Health", "col2": "Stable", "col3": "Compliant"}]} />
   - Gauge Example: <UI_ACTION type="RENDER_COMPONENT" component="Gauge" props={"value": 92, "title": "Audit Confidence Index", "subtitle": "Global weighted score"} />

3. SUGGEST_FIELD: Propose a relevant field to the user that they haven't analyzed yet with a rational justification.
   Syntax: <UI_ACTION type="SUGGEST_FIELD" fieldId="Risk_Heuristics" reason="Direct link with detected authentication drift anomalies." />

4. TRIGGER_ALERT: Render a critical security or compliance alert.
   Syntax: <UI_ACTION type="TRIGGER_ALERT" severity="warning" message="Authentication drift detected on node Personnel_Registry." />

COMMERCE & STYLE:
- Be proactive: if the user asks a question about a metric, select it and render the appropriate chart.
- Be minimalist: only one major component per response, accompanied by a professional Cyber-Audit style textual explanation (bold titles, key points, metric-driven conclusions).
- Respond in English clearly, rigorously, and concisely. You also have perfect knowledge of the professionalization curriculum PRDF-TEC-2026-002.`
      };

      if (toolName === 'Harmonize Standards') {
        endpoint = '/api/audit/harmonize';
        payload = { fields: selectedFields.length > 0 ? selectedFields : ['All Active Nodes'] };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      
      if (!response.ok) {
        setMessages([...newMessages, { role: 'ai', content: `⚠️ **SYSTEM ERROR:** ${resData.error || "Karma3 connection severed. Please try again later."}` }]);
        return;
      }
      
      if (toolName === 'Harmonize Standards' && resData.mapping) {
        setMessages([...newMessages, { role: 'ai', content: `### 🔄 Harmonization Sync Complete\n\n**Status:** ${resData.status}\n\n${resData.mapping}` }]);
      } else if (resData.text) {
        // Run reactive actions first
        scanForMentions(resData.text);
        const { actions } = parseUIResponse(resData.text);
        actions.forEach(action => {
          if (action.type === 'SELECT_FIELD' && action.fieldId) {
            selectFieldExplicitly(action.fieldId);
          }
          if (action.type === 'TRIGGER_ALERT' && action.message) {
            onNotify(action.message);
          }
        });
        setMessages([...newMessages, { role: 'ai', content: resData.text }]);
      } else {
        setMessages([...newMessages, { role: 'ai', content: "ERROR: Data node returned null or unexpected format." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: "SYSTEM ERROR: Karma3 connection severed. Please re-authenticate." }]);
    } finally {
      setLoading(false);
      setActiveAnalysis(null);
    }
  };

  const aiTools = [
    { name: 'Bastion Orchestrator', icon: Terminal, desc: 'INTENT_ACCESS_ENGINE', prompt: "Translate the following intent into JumpServer access commands: 'Open SSH for admin on Karma3-Core-DB-01 for 2 hours'. Verify rights and propose specific bastion rule changes." },
    { name: 'Behavioral Sentry', icon: ShieldCheck, desc: 'REALTIME_UBA_SCAN', prompt: "Analyze the current JumpServer session logs for behavioral anomalies. Use UBA (User Behavior Analytics) to detect suspicious terminal commands or unexpected protocol shifts." },
    { name: 'Audit Evidence Gen', icon: FileText, desc: 'COMPLIANCE_PROOF_SYNC', prompt: "Generate a certified audit evidence report combining JumpServer session logs and Karma3 AI security logic. Map interactions directly to ISO 27001 Annex A.9 controls." },
    { name: 'Compliance Audit', icon: ShieldAlert, desc: 'CORE_VALIDATION_ENGINE', prompt: "Perform a complete SOC 2 and ISO 27001 audit on the current operational status. Evaluate control points, data integrity, and access protocols." },
    { name: 'Harmonize Standards', icon: Zap, desc: 'CROSS_WALK_MAPPER', prompt: "Run full cross-framework harmonization. Map all active data nodes to both SOC 2 and ISO 27001 requirements." },
    { name: 'Summary Brief', icon: FileText, desc: 'NEURAL_SYNTHESIS_LITE', prompt: "Rapid synthesis of current risks and node efficiencies. Identify the single most critical point of failure." },
    { name: 'Professionalization', icon: GraduationCap, desc: 'EXPERT_AUTONOMY_PLAN', prompt: "Explain the strategic benefits of the PRDF-TEC-2026-002 program and how it addresses current operational risks." },
    { name: 'Risk Topology', icon: Brain, desc: 'NODE_DEPENDENCY_GRAH', prompt: "Map dependencies between high priority risks and operational services." },
    { name: 'Executive Report', icon: Layout, desc: 'POSTURE_DOCUMENT_GEN', prompt: "Draft a formal executive briefing for the CFO regarding current posture." },
    { name: 'Performance Audit', icon: BarChart3, desc: 'SLO_METRIC_ANALYTIC', prompt: "Evaluate performance metrics. Which sector requires immediate reallocation?" },
    { name: 'Strategic Roadmap', icon: ArrowUpRight, desc: 'FUTURE_POSTURE_VECTOR', prompt: "Propose 3 concrete strategic actions based on the current data." },
    { name: 'Predictive Compliance Scan', icon: ShieldAlert, desc: 'PROBABILISTIC_DRIFT_SCAN', prompt: "Execute a predictive compliance scan using stochastic drift analysis. Project potential regulatory drift over the next 12 months based on current operational anomalies." },
    { name: 'Financial Anomaly Detector', icon: Database, desc: 'FINANCIAL_FRAUD_HEURISTIC', prompt: "Run the financial anomaly detector using Benford's Law and statistical outlier analysis. Identify nodes with abnormal financial signatures or reporting irregularities." },
    { name: 'Strategic Risk Forecaster', icon: Zap, desc: 'STRATEGIC_RESILIENCY_PROJECTION', prompt: "Project strategic risk posture using Markov chain simulations. Analyze how current risk-to-resource allocations impact long-term enterprise resiliency." },
  ];

  return (
    <div id="karma3-ai-view" className="flex flex-col lg:flex-row gap-0 h-screen w-screen bg-slate-50 overflow-hidden rounded-none border-none shadow-none">
      {/* Power BI Left Sidebar: Data Pane */}
      <div className="w-full lg:w-64 flex flex-col shrink-0 bg-white border-r border-slate-200">
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <Database className="w-3.5 h-3.5 text-slate-500" />
                     <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Data Pane</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                  </div>
               </div>
               <div className="electric-border-container shadow-sm h-10">
                  <div className="electric-border-glow opacity-20" />
                  <div className="electric-border-inner bg-white">
                    <div className="relative flex items-center h-full px-3">
                       <Search className="w-3.5 h-3.5 text-slate-300 mr-2" />
                       <input 
                         placeholder="Search fields..." 
                         className="w-full bg-transparent border-none text-[10px] font-bold italic outline-none text-slate-700 placeholder:text-slate-300"
                       />
                    </div>
                  </div>
               </div>
            </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
             <div className="space-y-1">
                {/* Expandable Field Groups */}
                {fieldGroups.map((group) => (
                  <div key={group.name} className="space-y-1">
                    <div 
                      onClick={() => toggleGroup(group.name)}
                      className={cn(
                        "flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group",
                        activeGroup === group.name && "bg-slate-50/50"
                      )}
                    >
                       <ChevronRight className={cn("w-3 h-3 text-slate-400 group-hover:text-slate-900 transition-transform", expandedGroups.includes(group.name) ? "rotate-90" : "-rotate-0")} />
                       <span className={cn(
                         "text-[10px] font-bold uppercase tracking-tight italic",
                         activeGroup === group.name ? "text-slate-900" : "text-slate-700"
                        )}>{group.name}</span>
                    </div>
                    <AnimatePresence>
                      {expandedGroups.includes(group.name) && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="pl-6 space-y-1 overflow-hidden"
                         >
                            {group.fields.map(field => {
                              const isGlowing = glowingFields.includes(field);
                              const isHovered = hoveredField === field;
                              return (
                                <div 
                                  key={field} 
                                  onMouseEnter={() => setHoveredField(field)}
                                  onMouseLeave={() => setHoveredField(null)}
                                  onClick={() => toggleField(field)}
                                  className={cn(
                                    "flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-all relative overflow-hidden group/field",
                                    selectedFields.includes(field) 
                                      ? "bg-sunset-orange/15 text-sunset-orange shadow-sm font-bold" 
                                      : "hover:bg-slate-50 text-slate-500",
                                    isGlowing && "animate-pulse ring-2 ring-sunset-orange bg-sunset-orange/10 z-10"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={cn(
                                      "w-3 h-3 flex items-center justify-center rounded text-[8px] font-black transition-colors",
                                      selectedFields.includes(field) ? "bg-sunset-orange text-white" : "bg-slate-100 text-slate-400"
                                    )}>
                                      {selectedFields.includes(field) ? <CheckCircle2 className="w-2 h-2" /> : "∑"}
                                    </div>
                                    <span className="text-[9px] font-medium">{field}</span>
                                  </div>

                                  {/* Hover Floating Analyzer Pill */}
                                  {isHovered && (
                                    <motion.button
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        sendMessage(`Analyze the field ${field} and show me its relationship with risks.`);
                                      }}
                                      className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[7px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow shadow-black/20"
                                    >
                                      ⚡ Analyze?
                                    </motion.button>
                                  )}

                                  {/* Glow pulse dot */}
                                  {isGlowing && (
                                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunset-orange opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sunset-orange"></span>
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                         </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
             </div>
           </div>

           <div className="p-4 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Neural Sync</span>
                <div className="flex gap-1">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full sunset-gradient" />
              </div>
              <div className="text-[7px] font-black text-white/60 uppercase italic">AX-CORE-VERIFIED</div>
           </div>
        </div>
      </div>

      {/* Main Analysis Canvas */}
      <div className="flex-1 flex flex-col bg-[#fdfdfd] relative overflow-hidden group">
        {/* Power BI Ribbon */}
        <div className="bg-white border-b border-slate-200 p-1 flex items-center gap-1 z-20">
           {['File', 'Home', 'Insert', 'Modeling', 'View', 'Optimize'].map((tab, i) => (
             <button 
               key={tab} 
               onClick={() => onNotify(`Context switched to ${tab} ribbon.`)}
               className={cn(
                 "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                 i === 1 ? "bg-slate-900 text-white rounded-lg shadow-lg" : "text-slate-400 hover:text-slate-900"
               )}
             >
               {tab}
             </button>
           ))}
           <div className="ml-auto flex items-center gap-2 px-4 border-l border-slate-200">
              <DownloadPDFButton targetId="karma3-ai-view" fileName="Karma3-Intelligence-Analysis" iconOnly className="px-0" onEmailSent={onNotify} />
              <button 
                onClick={() => onNotify("Data nodes synchronized. Cache purged.")}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest italic"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
              <button 
                onClick={() => onNotify("AI Synthesis results persisted to Vault.")}
                className="flex items-center gap-2 px-4 py-2 bg-sunset-orange text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all shadow-sunset-orange/20"
              >
                <Save className="w-3 h-3" /> Save Result
              </button>
              {onExit && (
                <button 
                  onClick={onExit}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 hover:shadow-lg transition-all border border-slate-800"
                  title="Retourner au tableau de bord"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Retour au Dashboard
                </button>
              )}
           </div>
        </div>

        {/* Canvas Path Breadcrumbs */}
        <div className="bg-white border-b border-slate-100 p-2 px-6 flex items-center gap-4 z-10">
           <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
              <span>Karma3 Root</span>
              <ChevronRight className="w-3 h-3" />
              <span>Intelligence Layer</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-sunset-orange italic">Active Analysis</span>
           </div>
           <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">12 Nodes Connected</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">RAG Optimized</span>
              </div>
           </div>
        </div>

        {/* The Dashboard Workspace */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] custom-scrollbar relative z-10">
          
          {selectedFields.length > 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Analysis Output</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Karma3 Node ID: AX-SYNC-44</p>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => onNotify("Advanced filtering engine engaged.")}
                       className="px-4 py-2 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all bg-slate-50"
                     >
                       Filter Options
                     </button>
                     <button 
                       onClick={() => onNotify("Neural drill-down executed. Exploring sub-nodes.")}
                       className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl"
                     >
                       Drill Down
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div layout className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                     <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                          {selectedVis === 0 ? 'Metric Variance' : 
                           selectedVis === 2 ? 'Temporal Flow' : 
                           selectedVis === 4 ? 'Risk Saturation' : 'Data Distribution'}
                        </span>
                        {selectedVis === 0 ? <BarChart3 className="w-4 h-4 text-sunset-orange" /> :
                         selectedVis === 2 ? <LineChart className="w-4 h-4 text-blue-500" /> :
                         selectedVis === 4 ? <AreaChart className="w-4 h-4 text-emerald-500" /> :
                         <Layout className="w-4 h-4 text-slate-400" />}
                     </div>
                     
                     {selectedVis === 2 ? (
                       <div className="h-48 flex items-center justify-center">
                          <div className="w-full h-px bg-slate-100 relative">
                             {selectedFields.map((f, i) => (
                               <motion.div 
                                 key={f}
                                 initial={{ left: 0 }}
                                 animate={{ left: `${(i / selectedFields.length) * 100}%` }}
                                 className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                               >
                                  <div className="w-3 h-3 rounded-full sunset-gradient shadow-lg" />
                                  <div className="mt-2 text-[6px] font-black text-slate-400 uppercase tracking-tighter">{f}</div>
                               </motion.div>
                             ))}
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: '100%' }}
                               className="absolute top-1/2 -translate-y-1/2 h-0.5 sunset-gradient opacity-20"
                             />
                          </div>
                       </div>
                     ) : selectedVis === 4 ? (
                       <div className="h-48 relative overflow-hidden flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <motion.path 
                               initial={{ d: "M0 100 L100 100 L100 100 L0 100 Z" }}
                               animate={{ d: "M0 80 Q25 40 50 60 T100 20 L100 100 L0 100 Z" }}
                               transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                               className="fill-sunset-orange/10 stroke-sunset-orange stroke-2"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <span className="text-4xl font-black italic tracking-tighter text-slate-900/10 uppercase">H-SYNC</span>
                          </div>
                       </div>
                     ) : (
                       <div className="h-48 flex items-end gap-3 justify-between px-4">
                          {selectedFields.map((f, i) => (
                             <motion.div 
                                key={f}
                                initial={{ height: 0 }}
                                animate={{ height: `${20 + (i * 25)}%` }}
                                className="w-full bg-slate-50 rounded-t-xl relative group-hover:bg-slate-100 transition-colors border-x border-t border-slate-200/50"
                             >
                                <div className="absolute top-0 left-0 w-full h-1 sunset-gradient rounded-t-xl" />
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{(20 + (i * 25))}%</div>
                             </motion.div>
                          ))}
                       </div>
                     )}
                     
                     <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Correlation Map</span>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Stable</span>
                     </div>
                  </motion.div>

                  <motion.div layout className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                     <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                          {selectedVis === 1 ? 'Neural Distribution' : 
                           selectedVis === 3 ? 'Tabular Registry' : 
                           selectedVis === 5 ? 'System Pulse' : 'Node Topology'}
                        </span>
                        {selectedVis === 1 ? <PieChart className="w-4 h-4 text-blue-500" /> :
                         selectedVis === 3 ? <TableProperties className="w-4 h-4 text-emerald-500" /> :
                         selectedVis === 5 ? <Zap className="w-4 h-4 text-sunset-orange" /> :
                         <Brain className="w-4 h-4 text-slate-400" />}
                     </div>

                     {selectedVis === 3 ? (
                        <div className="h-48 overflow-y-auto no-scrollbar space-y-2">
                           {selectedFields.map((f, i) => (
                              <div key={f} className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                                 <span className="text-[8px] font-black text-slate-500 uppercase">{f}</span>
                                 <span className="text-[8px] font-mono text-emerald-500">{(0.992 + (i * 0.001)).toFixed(3)}</span>
                              </div>
                           ))}
                        </div>
                     ) : selectedVis === 5 ? (
                        <div className="h-48 flex items-center justify-center">
                           <motion.div 
                             animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                             transition={{ duration: 4, repeat: Infinity }}
                             className="w-24 h-24 rounded-full sunset-gradient flex items-center justify-center shadow-2xl shadow-sunset-orange/30"
                           >
                              <Zap className="w-10 h-10 text-white" />
                           </motion.div>
                        </div>
                     ) : (
                        <div className="flex items-center justify-center h-48">
                           <div className="w-32 h-32 rounded-full border-[12px] border-slate-50 relative flex items-center justify-center">
                              <div className={cn(
                                "absolute inset-0 rounded-full border-[12px] border-sunset-orange border-t-transparent border-l-transparent",
                                selectedVis === 1 ? "" : "border-emerald-500 rotate-90"
                              )} />
                              <span className="text-xl font-black italic tracking-tighter text-slate-900">{selectedFields.length}</span>
                           </div>
                        </div>
                     )}

                     <div className="flex flex-wrap gap-2 mt-6 justify-center">
                        {selectedFields.map(f => (
                           <div key={f} className={cn(
                             "w-1.5 h-1.5 rounded-full",
                             selectedVis === 5 ? "bg-sunset-orange animate-ping" : "sunset-gradient"
                           )} />
                        ))}
                     </div>
                  </motion.div>
               </div>
            </div>
          )}

          {messages.length === 0 && selectedFields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
               <div className="relative">
                  <div className="absolute inset-0 bg-sunset-orange/20 blur-[100px] rounded-full scale-150 opacity-30 animate-pulse" />
                  <div className="w-24 h-24 rounded-[3rem] bg-white shadow-2xl flex items-center justify-center relative overflow-hidden group border border-slate-100">
                    <Sparkles className="w-10 h-10 text-sunset-orange relative z-10" />
                  </div>
               </div>
               <div className="space-y-4 relative z-10">
                 <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Karma3 Report Builder</h2>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-[320px] mx-auto leading-relaxed italic border-t border-slate-100 pt-3 mb-4">Awaiting neural injection. Select a visualization or analysis model to begin.</p>
                    <div className="flex justify-center gap-3">
                       <button onClick={() => sendMessage(aiTools[0].prompt)} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[8px] font-black text-slate-500 uppercase tracking-widest hover:border-sunset-orange/30 transition-all">Quick Synthesis</button>
                       <button onClick={() => sendMessage(aiTools[5].prompt)} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[8px] font-black text-slate-500 uppercase tracking-widest hover:border-sunset-orange/30 transition-all">Strategic Roadmap</button>
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto w-full space-y-6 pb-20">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "w-full rounded-2xl border p-8 shadow-md transition-all relative overflow-hidden group bg-white",
                    msg.role === 'user' ? "border-slate-200 ml-auto max-w-[85%]" : "border-slate-100"
                  )}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg", msg.role === 'user' ? "bg-slate-900" : "sunset-gradient shadow-sunset-orange/20")}>
                        {msg.role === 'user' ? <Users className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] italic">
                          {msg.role === 'user' ? 'Operator' : 'Karma3 Engine'}
                        </span>
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">NODE_ID: AX-SYNC-04</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 text-[7px] font-black text-slate-300 uppercase tracking-widest italic bg-slate-50 px-2 py-1 rounded">
                          <Zap className="w-2.5 h-2.5 text-sunset-orange" />
                          Validated
                       </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-4">
                    {msg.role === 'ai' ? (
                      i === messages.length - 1 && loading === false ? (
                        <TypewriterText 
                          text={msg.content} 
                          onComplete={() => onNotify("Neural stream complete.")} 
                          onActionsDetected={handleActionsDetected} 
                        />
                      ) : (
                        <div className="markdown-body prose prose-slate max-w-none prose-sm prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-widest prose-p:italic prose-strong:text-sunset-orange text-slate-700">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {parseUIResponse(msg.content).cleanText}
                          </ReactMarkdown>
                        </div>
                      )
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 text-sm tracking-tight italic">"{msg.content}"</span>
                      </div>
                    )}

                    {/* Generative widgets section */}
                    {msg.role === 'ai' && (
                      <div className="mt-4 space-y-4">
                        {parseUIResponse(msg.content).actions.map((act, actIdx) => (
                          <GenerativeWidget 
                            key={actIdx} 
                            action={act} 
                            onNotify={onNotify} 
                            onSelectField={selectFieldExplicitly} 
                            onSendMessage={sendMessage} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'ai' && (
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => onNotify("Node property manifest retrieved.")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest hover:border-sunset-orange/30 transition-all"
                          >
                            <Settings className="w-3 h-3" /> Properties
                          </button>
                          <button 
                            onClick={() => onNotify("Verifying data lineage across nodes...")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest hover:border-sunset-orange/30 transition-all"
                          >
                            <BarChart3 className="w-3 h-3" /> Data Lineage
                          </button>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">Confidence: 98.4%</span>
                         <Badge variant="blue" className="bg-emerald-50 text-emerald-600 border-emerald-100">Live Sync</Badge>
                       </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
          {loading && (
            <div className="flex gap-4 items-start animate-pulse max-w-3xl">
              <div className="w-10 h-10 rounded-xl sunset-gradient flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                 <div className="h-2 w-3/4 bg-slate-100 rounded-full mb-4 animate-pulse" />
                 <div className="h-2 w-1/2 bg-slate-100 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* AI Input Area with ELECTRIC ROTATING BORDER */}
        <div className="p-6 bg-white border-t border-slate-200 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="electric-border-container shadow-2xl">
              <div className="electric-border-glow" />
              <div className="electric-border-inner bg-white">
                <div className="relative group">
                  <input 
                    placeholder="Ask Pegasus for automated cross-sector analysis..."
                    className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-16 py-6 text-base font-bold italic outline-none focus:bg-white transition-all"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                     <Brain className="w-5 h-5 text-sunset-orange animate-pulse" />
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button 
                      onClick={() => sendMessage()}
                      disabled={loading || !input}
                      className="w-12 h-12 rounded-xl sunset-gradient flex items-center justify-center text-white shadow-lg disabled:opacity-50 transition-all hover:scale-105"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center px-4">
               <div className="flex gap-8">
                  <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synthesis Active
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Neural Context Buffer: OK
                  </div>
               </div>
               <div className="text-[7px] font-mono font-black text-slate-300 uppercase tracking-widest">
                  Build: v4.1.0-NEXUS-A1
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Page Tabs */}
        <div className="bg-slate-900 text-white/50 border-t border-slate-700 p-1 flex items-center gap-1 z-20">
           {['Global Hub', 'Risk Insights', 'Modeling Layer', 'Compliance Audit'].map((page, i) => (
             <button 
               key={page}
               onClick={() => {
                 setActivePage(`page${i+1}`);
                 onNotify(`${page} projection active.`);
               }}
               className={cn(
                 "px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                 activePage === `page${i+1}` ? "bg-white text-slate-900 shadow-xl" : "hover:text-white"
               )}
             >
               {page}
             </button>
           ))}
           <div className="ml-auto flex items-center gap-4 px-4 border-l border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-white/30">PAGE</span>
                <span className="text-[8px] font-black text-white">{activePage.replace('page', '')} OF 4</span>
              </div>
              <div className="flex gap-2">
                 <button className="p-1 hover:text-white transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                 <button className="p-1 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
           </div>
        </div>
      </div>

      {/* Right Sidebar: Visualizations & Analysis Models */}
      <div className="w-full lg:w-72 flex flex-col shrink-0 bg-white border-l border-slate-200">
        <div className="flex flex-col h-full overflow-hidden">
           {/* Visualizations Tabbed Panel */}
           <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Visualizations</span>
                 <Sparkles className="w-3.5 h-3.5 text-sunset-orange" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[BarChart3, PieChart, LineChart, TableProperties, AreaChart, Zap, Brain, Layout].map((Icon, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedVis(i)}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center transition-all shadow-sm",
                      selectedVis === i 
                        ? "sunset-gradient text-white shadow-sunset-orange/20 scale-105" 
                        : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                    )}
                  >
                     <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Group Metrics: <span className="text-sunset-orange italic">{activeGroup}</span></span>
                     </div>
                     <div className="space-y-2">
                        {groupMetrics[activeGroup]?.map((m, i) => (
                           <motion.div 
                             key={`${activeGroup}-${m.label}`}
                             initial={{ opacity: 0, x: 10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="bg-slate-50 rounded border border-slate-100/50 overflow-hidden"
                           >
                              <div className="p-2 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500">{m.label}</span>
                                <span className={cn("text-[9px] font-black uppercase", m.color)}>{m.value}</span>
                              </div>
                              <div className="h-6 w-full opacity-30 grayscale hover:grayscale-0 transition-all">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={SPARK_DATA}>
                                    <Area type="monotone" dataKey="val" stroke={m.color === 'text-emerald-500' ? '#10b981' : '#ff4d00'} fill={m.color === 'text-emerald-500' ? '#10b981' : '#ff4d00'} fillOpacity={0.1} strokeWidth={1} dot={false} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Legend Items</span>
                       <Plus 
                         onClick={() => onNotify("Custom metrics engine requires higher clearance.")}
                         className="w-3 h-3 cursor-pointer hover:text-sunset-orange transition-colors" 
                       />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                       {selectedFields.length > 0 ? (
                         selectedFields.map(f => (
                           <div key={f} className="px-2 py-1 bg-slate-100 rounded-md text-[7px] font-black text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                              <span>{f}</span>
                              <Trash2 onClick={(e) => { e.stopPropagation(); toggleField(f); }} className="w-2 h-2 text-slate-400 hover:text-red-500 cursor-pointer" />
                           </div>
                         ))
                       ) : (
                         <div className="p-4 w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                            <div className="text-[8px] font-bold text-slate-400 italic text-center">Drag data fields here...</div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* Analysis Models Pane */}
           <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest italic">Analysis Tools</span>
                <Brain className="w-4 h-4 text-slate-200" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {aiTools.map((tool) => (
                  <motion.button
                    key={tool.name}
                    whileHover={{ x: 2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => sendMessage(tool.prompt, tool.name)}
                    disabled={loading}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group relative",
                      activeAnalysis === tool.name 
                        ? "border-emerald-500 bg-emerald-50/50 shadow-inner" 
                        : "bg-white border-slate-100 hover:border-sunset-orange/10"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all shadow-sm border border-slate-100",
                      activeAnalysis === tool.name 
                        ? "bg-emerald-500 text-white border-emerald-400" 
                        : "bg-white text-slate-300 group-hover:text-slate-600"
                    )}>
                      {activeAnalysis === tool.name ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <tool.icon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                       <div className="text-[9px] font-black uppercase tracking-tight text-slate-700 leading-tight block">{tool.name}</div>
                       <div className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">{(tool as any).desc || "Karma3 Algorithm"}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
           </div>

           {/* Synthesis State Summary (Knowledge Panel) */}
           <div className="p-6 bg-slate-900 mt-auto border-t border-white/5">
              <div className="relative z-10 space-y-5 text-white">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block italic">Report Integrity</span>
                      <span className="text-xl font-black italic tracking-tighter">99.2<span className="text-[10px] text-emerald-400 ml-1 font-mono">%</span></span>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-emerald-500/10 shadow-2xl">
                     <ShieldAlert className="w-6 h-6 text-sunset-orange" />
                   </div>
                </div>
                
                <div className="space-y-3">
                   <div className="flex justify-between text-[7px] font-black uppercase text-white/30 tracking-widest">
                      <span>Neural Entropy</span>
                      <span>0.004</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden p-[1px]">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92.8%' }} className="h-full rounded-full sunset-gradient shadow-[0_0_10px_rgba(255,80,0,0.4)]" />
                   </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <span className="text-[7px] font-black text-white/50 uppercase tracking-widest italic">SOC 2 / ISO 27001 ACTIVE</span>
                </div>
              </div>
           </div>
        </div>
      </div>
      <AnimatePresence>
        {isPaletteOpen && (
          <CommandPalette 
            isOpen={isPaletteOpen} 
            onClose={() => setIsPaletteOpen(false)} 
            fieldGroups={fieldGroups}
            onSelect={(f) => {
              toggleField(f);
              onNotify(`Focus shifted to ${f} node.`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileSection = ({ user, onNotify }: { user: any; onNotify: (m: string) => void }) => {
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || '??';

  return (
    <div id="profile-view" className="space-y-8">
      <div className="flex justify-end">
        <DownloadPDFButton targetId="profile-view" fileName="Karma3-Profile-Officer" iconOnly onEmailSent={onNotify} />
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
                    <div className="text-[8px] font-black text-sunset-orange uppercase tracking-[0.4em] mb-2">Karma3 Certificate</div>
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

const ServicesSection = ({ data, updateService, removeService, onNotify }: { data: DashboardData; updateService: any; removeService: any; onNotify: (m: string) => void }) => {
  const [newServiceName, setNewServiceName] = useState('');

  const addService = () => {
    if (!newServiceName) return;
    const newService: Service = {
      id: `NODE-${Math.floor(Math.random() * 1000)}`,
      name: newServiceName,
      status: 'Active',
      efficiency: 100,
      lastUpdate: 'Just now'
    };
    updateService(newService.id, newService);
    setNewServiceName('');
  };

  return (
    <div id="services-view" className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="space-y-4">
           <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest italic inline-block">
              INFRASTRUCTURE::NET_TOPOLOGY
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.85]">
             Neural <br/><span className="text-sunset-orange">Nodes</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">REDAL Platform Integration & Distributed Control</p>
        </div>
        <div className="flex gap-4">
           <DownloadPDFButton targetId="services-view" fileName="Karma3-Services-Infrastructure" iconOnly onEmailSent={onNotify} />
        </div>
      </div>

      <Card title="Provision New Neural Node" icon={Plus} className="bg-slate-900 border-slate-800 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-6 p-4">
          <div className="flex-1 relative">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-sunset-orange">
                <Terminal className="w-5 h-5" />
             </div>
             <input 
               value={newServiceName}
               onChange={e => setNewServiceName(e.target.value)}
               placeholder="System Vector ID..."
               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-lg font-black italic outline-none focus:border-sunset-orange transition-all text-white placeholder:text-white/20"
             />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addService}
            className="sunset-gradient text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-sunset-orange/30 flex items-center gap-3"
          >
            Authorize Deployment <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.services.map((service) => (
            <motion.div 
              layout
              key={service.id}
              className="glass-hub border border-slate-100 rounded-3xl md:rounded-[3rem] p-5 md:p-10 group relative overflow-hidden hover:shadow-2xl hover:shadow-sunset-orange/10 transition-all duration-700 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 sunset-gradient opacity-[0.05] blur-3xl" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic">{service.id}</div>
                  <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">{service.name}</h3>
                </div>
                <Badge variant={service.status === 'Active' ? 'green' : service.status === 'Warning' ? 'orange' : 'red'}>{service.status}</Badge>
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Signal Efficiency</span>
                    <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{service.efficiency}%</span>
                  </div>
                  <div className="flex items-center gap-1 pb-1">
                     {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn("w-1 h-4 rounded-full", i < 4 ? "bg-sunset-orange" : "bg-slate-200")} />
                     ))}
                  </div>
                </div>
                <div className="h-4 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${service.efficiency}%` }}
                    className="h-full rounded-full sunset-gradient shadow-lg"
                  />
                </div>
                
                <div className="flex justify-between items-center pt-8 border-t border-slate-100/50">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Last Sync: {service.lastUpdate}</span>
                  </div>
                  <button onClick={() => removeService(service.id)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 transition-all hover:shadow-xl">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="space-y-8">
           <Card title="REDAL Sync Control" icon={Database}>
              <div className="space-y-6 pt-4">
                 <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                       <RefreshCw className="w-20 h-20 text-white animate-spin-slow" />
                    </div>
                    <div className="relative z-10 space-y-4">
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">Continuous Sync Enabled</span>
                       <div className="text-2xl font-black text-white italic tracking-tighter uppercase">AUTO_ARCHIVING</div>
                       <p className="text-[10px] text-white/40 italic leading-relaxed uppercase tracking-tighter">REDAL Platform Version 8.24 established.</p>
                       <div className="pt-2">
                          <Badge variant="blue" className="bg-blue-500/20 border-blue-500/40 text-blue-400">99.9% Uptime</Badge>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Active Handshakes</span>
                    {[
                      { node: 'CORE_GATEWAY', status: 'Established' },
                      { node: 'FIELD_RELAY_01', status: 'Established' },
                      { node: 'MOBILE_PROXY_X', status: 'Awaiting Auth' },
                    ].map((h, i) => (
                       <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-600">{h.node}</span>
                          <span className={cn("text-[8px] font-black uppercase tracking-widest", h.status === 'Established' ? 'text-emerald-500' : 'text-sunset-orange animate-pulse')}>{h.status}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

interface SovereignDashboardViewProps {
  data: DashboardData;
  user: any;
  onNotify: (m: string) => void;
  theme?: 'dark' | 'light' | 'high-contrast';
  toggleTheme?: () => void;
}

const SovereignDashboardView = ({ data, user, onNotify, theme, toggleTheme }: SovereignDashboardViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDots, setActiveDots] = useState(0);

  // Default active agents list from screenshot/system state
  const allAgents = [
    { id: "Agent-K3-Alpha", status: "Running", type: "running" },
    { id: "Agent-K3-Beta", status: "Training", type: "training" },
    { id: "Agent-K3-Gamma", status: "Running", type: "running" },
    { id: "Agent-K3-Delta", status: "Running", type: "running" },
    { id: "Agent-K3-Epsilon", status: "Running", type: "running" },
    { id: "Agent-K3-Zeta", status: "Training", type: "training" },
    { id: "Agent-K3-Eta", status: "Training", type: "training" },
  ];

  // Filter agents live based on top search bar
  const filteredAgents = allAgents.filter(agent => 
    agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gemini API Usage wave matching image
  const usageData = [
    { name: "Last", rpm: 35 },
    { name: "1am", rpm: 155 },
    { name: "2am", rpm: 135 },
    { name: "3am", rpm: 220 },
    { name: "3pm", rpm: 190 },
    { name: "3pm ", rpm: 450 }, // The high-peak shown in screenshot
    { name: "3pm  ", rpm: 230 },
    { name: "4pm", rpm: 260 },
    { name: "Now", rpm: 320 }, // The end point shown in screenshot
  ];

  // Collaborative activities matching screenshot at bottom of graph
  const recentActivities = [
    { name: "Alice", avatar: "A", colors: "from-[#ef4444] to-[#ff4d00]", action: "deployed", target: "Agent-K3-Gamma", context: "to Staging", time: "2 min ago" },
    { name: "Bob", avatar: "B", colors: "from-[#3b82f6] to-[#0ea5e9]", action: "updated", target: "Data Processing", context: "workflow", time: "1 hour ago" },
    { name: "Bob", avatar: "B", colors: "from-[#3b82f6] to-[#0ea5e9]", action: "updated", target: "Data Processing", context: "workflow", time: "1 hour ago" },
    { name: "Nice", avatar: "N", colors: "from-[#10b981] to-[#14b8a6]", action: "updated", target: "Data Processing", context: "workflow", time: "1 hour ago" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDots((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 select-none font-sans text-slate-200">
      
      {/* 1. CUSTOM TOP HUB HEADER (AS IN SCREENSHOT) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#1c2e46]/40">
        
        {/* Left Side: Brand & Intelligent Subtitle */}
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {/* Pulsing neon backing shadow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-2xl blur-md opacity-45 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-12 h-12 bg-slate-900/95 border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg cursor-default">
              <span className="text-xl font-extrabold bg-gradient-to-tr from-purple-400 to-cyan-300 bg-clip-text text-transparent italic tracking-tighter">K</span>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">Karma3 AI Studio</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-mono mt-1.5">Intelligent Ecosystem Dashboard</p>
          </div>
        </div>

        {/* Right Side: Search bar, theme toggle and Current user avatar badge */}
        <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto">
          {/* Dynamic Search Box */}
          <div className="relative group flex-grow md:flex-grow-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-full md:w-64 bg-slate-950/60 border border-slate-800 text-xs rounded-full pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-all text-slate-300 placeholder-slate-500 font-medium"
            />
          </div>

          {/* Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Passer au thème clair (Slate Minimal)" : theme === "light" ? "Passer au thème haute accessibilité (WCAG AAA)" : "Passer au thème Cyber Obsidian"}
              className="p-2.5 rounded-full bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center shrink-0"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-indigo-400 animate-pulse" />
              ) : theme === "high-contrast" ? (
                <Eye className="w-4 h-4 text-emerald-500 animate-pulse" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>
          )}

          {/* User profile dropdown avatar with status glow */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="relative">
              <div 
                onClick={() => onNotify("Paramètres du compte ouverts via le profil.")}
                className="w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-400/40 p-0.5 overflow-hidden shadow-lg hover:border-cyan-400 transition-all cursor-pointer shrink-0"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-xs uppercase bg-[#0ea5e9]/25 rounded-full">{user?.displayName?.charAt(0) || "U"}</div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-950 rounded-full shadow-[0_0_8px_#10b981]" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. MAIN BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* A. LEFT SIDE COLUMN (lg:col-span-1): ACTIVE AI AGENTS */}
        <div className="lg:col-span-1 bg-[#090d16]/75 border border-slate-800/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">Active AI Agents</h3>
              <button 
                onClick={() => onNotify("Affichage des options d'agent.")}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <span className="text-xl leading-none">•••</span>
              </button>
            </div>
            
            <div className="space-y-0.5 text-left border-b border-slate-900/80 pb-2">
              <div className="text-xs text-slate-400 font-bold">Total: <span className="text-cyan-400 font-mono font-black text-[13px]">15</span></div>
              <div className="text-[10px] uppercase text-slate-500 tracking-widest font-mono font-black mt-3">Recents</div>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar pt-1">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, i) => (
                  <motion.div 
                    whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    key={i} 
                    className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-900/65 rounded-2xl hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${agent.type === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#a78bfa]/10 text-[#a78bfa]'}`}>
                        {agent.type === 'running' ? (
                          <span className="relative flex h-20 w-20 items-center justify-center">
                            <span className="animate-pulse absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        ) : (
                          <span className="relative flex h-20 w-20 items-center justify-center text-[#a78bfa]">
                            <Brain className="w-3.5 h-3.5 animate-pulse" />
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-extrabold text-slate-100 group-hover:text-white transition-colors">{agent.id}</span>
                        <span className={`text-[9px] font-black font-mono tracking-wide ${agent.type === 'running' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          ({agent.status})
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </motion.div>
                ))
              ) : (
                <div className="py-8 text-center text-[11px] text-slate-500 font-medium italic"> Aucun agent trouvé </div>
              )}
            </div>

          </div>
        </div>

        {/* B. RIGHT BENTO CARDS AREA (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          
          {/* TOP ROW: DEPLOYMENT STATUS + SYSTEM HEALTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. DEPLOYMENT STATUS */}
            <div className="bg-[#090d16]/75 border border-slate-800/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between h-[240px]">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">Deployment Status</h3>
                <button 
                  onClick={() => onNotify("Dossier de déploiements ouvert.")}
                  className="text-slate-500 hover:text-white transition-colors p-1"
                >
                  <span className="text-xl leading-none font-black">•••</span>
                </button>
              </div>

              {/* Connected deployment flow */}
              <div className="flex items-center justify-between py-2 relative w-full px-2">
                {/* Horizontal flow connection vectors */}
                <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-slate-900 z-0 flex items-center justify-between pointer-events-none">
                  <div className="w-[45%] h-px bg-gradient-to-r from-emerald-500/80 to-amber-500/80" />
                  <div className="w-[45%] h-px bg-gradient-to-r from-amber-500/80 to-emerald-500/80" />
                </div>

                {/* Node A: DEV */}
                <div className="flex flex-col items-center gap-1 z-10 w-24 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/95 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black text-white font-sans mt-2">DEV</span>
                  <span className="text-[9px] font-mono font-bold text-slate-500 leading-none mt-0.5">(Active - v2.1.4)</span>
                </div>

                {/* Node B: STAGING */}
                <div className="flex flex-col items-center gap-1 z-10 w-24 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/95 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] relative">
                    <div className="absolute inset-0.5 border border-dashed border-amber-500/50 rounded-[10px] animate-spin" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-black text-white font-sans mt-2">STAGING</span>
                  <span className="text-[9px] font-mono font-bold text-slate-500 leading-none mt-0.5">(Deploying - v2.2.0)</span>
                </div>

                {/* Node C: PROD */}
                <div className="flex flex-col items-center gap-1 z-10 w-24 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/95 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black text-white font-sans mt-2">PROD</span>
                  <span className="text-[9px] font-mono font-bold text-slate-500 leading-none mt-0.5">(Stable - v2.1.3)</span>
                </div>
              </div>

              {/* Dots pager indicator */}
              <div className="flex justify-center gap-1.5 pt-2">
                <div className={`w-3.5 h-1.5 rounded-full transition-colors duration-400 ${activeDots === 0 ? 'bg-[#0ea5e9]' : 'bg-slate-800'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeDots === 1 ? 'bg-[#0ea5e9]' : 'bg-slate-800'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeDots === 2 ? 'bg-[#0ea5e9]' : 'bg-slate-800'}`} />
              </div>
            </div>

            {/* 2. SYSTEM HEALTH */}
            <div className="bg-[#090d16]/75 border border-slate-800/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between h-[240px]">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">System Health</h3>
                <button 
                  onClick={() => onNotify("Détails de diagnostic système ouverts.")}
                  className="text-slate-500 hover:text-white transition-colors p-1"
                >
                  <span className="text-xl leading-none font-black">•••</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center flex-grow py-2">
                {/* SVG Radial Gauge Ring */}
                <div className="flex items-center justify-center relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="36" 
                      className="stroke-slate-900" 
                      strokeWidth="5" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="36" 
                      className="stroke-[#10b981]" 
                      strokeWidth="5" 
                      fill="transparent" 
                      strokeDasharray="226" 
                      strokeDashoffset="4" // represents 98%
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest font-black leading-none">Overall Status</span>
                    <span className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-tighter leading-none">HEALTHY</span>
                    <span className="text-xs font-black font-mono text-white mt-1 leading-none">(98%)</span>
                  </div>
                </div>

                {/* Right side colored KPI bullet indicators */}
                <div className="space-y-2 flex-grow flex flex-col justify-center">
                  {/* Compute */}
                  <div className="flex items-center justify-between p-1.5 bg-slate-950/30 border border-slate-900 rounded-xl px-3 hover:bg-slate-950/60 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      <span className="text-[10px] font-bold text-slate-300">Compute</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 font-mono">98%</span>
                  </div>

                  {/* Storage */}
                  <div className="flex items-center justify-between p-1.5 bg-slate-950/30 border border-slate-900 rounded-xl px-3 hover:bg-slate-950/60 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                      <span className="text-[10px] font-bold text-slate-300">Storage</span>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 font-mono">82%</span>
                  </div>

                  {/* Network */}
                  <div className="flex items-center justify-between p-1.5 bg-slate-950/30 border border-slate-900 rounded-xl px-3 hover:bg-slate-950/60 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#8b5cf6]" />
                      <span className="text-[10px] font-bold text-slate-300">Network</span>
                    </div>
                    <span className="text-[10px] font-black text-purple-400 font-mono">100%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SYSTEM WIDE GRAPH ROW: GEMINI API USAGE */}
          <div className="bg-[#090d16]/75 border border-slate-800/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">Gemini API Real-Time Usage</h3>
              <button 
                onClick={() => onNotify("Détail de consommation de l'API Gemini configuré.")}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <span className="text-xl leading-none font-black">•••</span>
              </button>
            </div>

            {/* Timeline graphs area */}
            <div className="h-52 relative w-full pt-4">
              
              {/* Highlight Peak Badge 1 - at 3pm */}
              <div className="absolute top-[2%] left-[58%] md:left-[61%] -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/50 backdrop-blur-md text-[9px] font-black font-mono text-purple-400 rounded-md tracking-wider shadow-lg">
                  450 RPM
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-white animate-ping mt-1 shadow-[0_0_8px_#c084fc]" />
              </div>

              {/* Highlight Peak Badge 2 - on Far Right (Now) */}
              <div className="absolute top-[22%] right-[2%] md:right-[3%] -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/50 backdrop-blur-md text-[9px] font-black font-mono text-cyan-400 rounded-md tracking-wider shadow-lg">
                  320 RPM
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white animate-ping mt-1 shadow-[0_0_8px_#22d3ee]" />
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="glowingCyber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#cbd5e1" : "#0f172a"} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme === "light" ? "#475569" : "#64748b", fontSize: 9, fontWeight: 700 }} 
                  />
                  <YAxis 
                    domain={[0, 500]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme === "light" ? "#475569" : "#64748b", fontSize: 9, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === "light" ? "#ffffff" : "#060913", 
                      borderColor: theme === "light" ? "#94a3b8" : "#1e3454", 
                      borderRadius: 12,
                      boxShadow: theme === "light" ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "none"
                    }}
                    labelStyle={{ color: theme === "light" ? "#0f172a" : "#94a3b8", fontWeight: 700, fontSize: 10 }}
                    itemStyle={{ color: theme === "light" ? "#7c3aed" : "#a78bfa", fontWeight: 900, fontSize: 11 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rpm" 
                    stroke="url(#glowingCyber)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#glowingCyber)" 
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Collaborative logs embedded in chart */}
            <div className="mt-6 pt-6 border-t border-slate-900 text-left">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black mb-3">Recent Collaborative Activities</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-8">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6.5 h-6.5 rounded-full bg-gradient-to-br ${act.colors} flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-lg`}>
                      {act.avatar}
                    </div>
                    <div className="text-[11px] font-sans leading-none text-slate-300">
                      <span className="font-extrabold text-white pr-1">{act.name}</span>
                      <span className="text-slate-400 font-medium pr-1">{act.action}</span>
                      <span className="font-black pr-1 text-slate-200">{act.target}</span>
                      <span className="text-slate-400 font-medium pr-1">{act.context}</span>
                      <span className="text-[9px] font-mono pr-1 text-slate-500 italic pl-1">({act.time})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

const SummarySection = ({ data, onNotify, onSettings }: { data: DashboardData; onNotify: (m: string) => void; onSettings: () => void }) => {
  return (
    <div id="summary-view" className="space-y-12">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[300px] sunset-gradient opacity-[0.02] blur-[150px] pointer-events-none" />
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
             <div className="px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-sunset-orange animate-ping" />
                STRATÉGIE::EXCELLENCE::OPÉRATIONNELLE
             </div>
             <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest italic">
                RÉF: RSO-DEP-2026-001
             </div>
          </div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-2"
          >
            <h1 className="text-6xl md:text-8xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.8]">
              Diagnostic <br/><span className="text-sunset-orange">& Risques</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] italic pt-4">Pilotage de la Mutation Technique – Équipes Dépannage</p>
          </motion.div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNotify("Démarrage de la phase pilote demandé...")}
              className="px-10 py-5 sunset-gradient text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-sunset-orange/30 transition-all flex items-center gap-3 italic"
            >
              <Zap className="w-5 h-5" /> VALIDATION_IMMÉDIATE
            </motion.button>

           <div className="flex items-center gap-3">
              <DownloadPDFButton targetId="summary-view" fileName="Karma3-Diagnostic-Risques" iconOnly onEmailSent={onNotify} />
              <button 
                onClick={onSettings}
                className="p-5 text-slate-400 hover:text-slate-900 transition-colors bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl"
              >
                 <Settings className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>



      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Critical Risks', value: data.risks.filter(r => r.crit === 'Critical' || (r.crit as any) === 'Critique').length, sub: 'Legal / Security', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/5' },
          { label: 'High Risks', value: data.risks.filter(r => r.crit === 'High' || (r.crit as any) === 'Élevé').length, sub: 'HR / Operational', icon: AlertTriangle, color: 'text-sunset-orange', bg: 'bg-sunset-orange/5' },
          { label: 'Compliance Target', value: '100%', sub: 'CSR Objective', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/5' },
          { label: 'Accident Target', value: '0', sub: 'Total Safety', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 md:p-10 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity", kpi.color)}>
              <kpi.icon className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{kpi.label}</span>
                   <h4 className={cn("text-5xl font-black italic tracking-tighter leading-none", kpi.color)}>{kpi.value}</h4>
                </div>
                <HighFidelityIcon 
                  variant={
                    kpi.color.includes('text-red-500') ? 'danger' : 
                    kpi.color.includes('orange') ? 'warning' :
                    kpi.color.includes('blue') ? 'info' : 'success'
                  } 
                  size="md"
                  className="mt-1 shadow-sm"
                >
                  <kpi.icon />
                </HighFidelityIcon>
              </div>
              <div className="flex items-center gap-2">
                 <div className={cn("w-1.5 h-1.5 rounded-full", kpi.color)} />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{kpi.sub}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2">
          <Card title="Performance Gap Analysis" icon={BarChart3}>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-900 text-white">
                     {['Domain', 'Identified Non-conformity', 'Severity', 'Organizational Impact'].map(header => (
                       <th key={header} className="p-8 text-[11px] font-black uppercase tracking-[0.3em] italic">{header}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {data.risks.map((risk, i) => (
                     <motion.tr 
                       key={risk.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="group hover:bg-slate-50/80 transition-all"
                     >
                       <td className="p-8">
                         <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{risk.domain}</span>
                       </td>
                       <td className="p-8">
                         <span className="text-sm font-medium text-slate-600 italic tracking-tight leading-tight block max-w-xs">{risk.desc}</span>
                       </td>
                       <td className="p-8">
                         <Badge variant={risk.crit === 'Critical' ? 'crit' : risk.crit === 'High' ? 'orange' : 'default'}>{risk.crit}</Badge>
                       </td>
                       <td className="p-8 text-[10px] font-black uppercase italic text-slate-400 tracking-tighter leading-none max-w-[200px]">{risk.impact}</td>
                     </motion.tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </Card>
        </div>
        <div className="xl:col-span-1">
          <Card title="Transformation Target" icon={RefreshCw}>
            <div className="space-y-8">
              {[
                { label: 'Technical Diagnosis', current: 'Awaiting instructions', target: 'Self-analyze and propose', color: 'blue' },
                { label: 'Security Protection', current: 'Partial application', target: 'Total and rigorous control', color: 'orange' },
                { label: 'Reporting', current: 'Incomplete or verbal', target: 'Structured and traceable', color: 'blue' },
                { label: 'Autonomy', current: 'Critical dependency', target: 'Full field execution steering', color: 'orange' },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block italic">{item.label}</span>
                  <div className="grid grid-cols-2 gap-6 relative">
                    <div className="space-y-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60 italic">Modèle Actuel</span>
                       <div className="text-[10px] font-bold text-slate-500 italic line-through opacity-30 leading-tight">{item.current}</div>
                    </div>
                    <div className="space-y-2 text-right">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-lg z-10 group-hover:scale-125 transition-transform">
                          <ArrowRight className="w-4 h-4 text-sunset-orange" />
                       </div>
                      <span className="text-[9px] font-black text-sunset-orange uppercase tracking-[0.2em] italic">Cible Expert</span>
                      <div className="text-xs font-black text-slate-900 italic uppercase leading-tight tracking-tight">{item.target}</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: '0%' }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + (i * 0.2), duration: 1.5, ease: "circOut" }}
                      className={item.color === 'blue' ? 'h-full bg-blue-500' : 'h-full bg-sunset-orange'} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const OrgChartSection = ({ data, onNotify }: { data: DashboardData; onNotify: (m: string) => void }) => {
  const { director, intermediates, supervisors, teams } = data.orgChart;
  
  return (
    <div id="org-chart-view" className="space-y-8">
      <div className="flex justify-end">
        <DownloadPDFButton targetId="org-chart-view" fileName="Karma3-Organizational-Structure" iconOnly onEmailSent={onNotify} />
      </div>
      <Card title="Hierarchical Structure – Solar Nodes" icon={Users}>
        <div className="flex flex-col items-center py-12">
          {/* Director */}
          <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-slate-950 border-2 border-sunset-orange rounded-3xl px-8 md:px-12 py-6 text-center w-full sm:w-auto sm:min-w-[300px] shadow-2xl shadow-sunset-orange/20 relative"
            >
              <div className="absolute inset-0 bg-sunset-orange/5 rounded-3xl animate-pulse" />
              <span className="text-[10px] text-sunset-orange font-black uppercase tracking-[0.25em] mb-2 block relative z-10">{director.role}</span>
              <span className="text-white font-black text-lg block relative z-10 italic uppercase tracking-tighter">{director.name}</span>
              {director.sub && <span className="text-white/40 text-[9px] block mt-1 italic font-medium relative z-10 tracking-[0.1em]">{director.sub}</span>}
            </motion.div>
            
            {/* Intermediate Layer */}
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 relative w-full justify-center items-center sm:items-start before:hidden sm:before:block before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-120px)] before:h-px before:bg-slate-200">
              {intermediates.map((node) => (
                <div key={node.id} className="flex flex-col items-center pt-px w-full sm:w-auto">
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="glass-card border border-slate-100 rounded-2xl px-6 py-4 text-center w-full sm:min-w-[180px] hover:shadow-lg transition-all duration-300">
                    <span className="text-[9px] text-slate-400 font-black uppercase block mb-1 tracking-widest">{node.role}</span>
                    <span className="text-slate-800 text-[10px] font-bold block">{node.name}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Supervisors Layer */}
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 relative w-full justify-center items-center sm:items-start before:hidden sm:before:block before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-80px)] before:h-px before:bg-slate-200">
              {supervisors.map((sup) => (
                <div key={sup.id} className="flex flex-col items-center pt-px w-full sm:w-auto group">
                  <div className={cn("w-px h-10 transition-colors", sup.isProblematic ? "bg-red-300" : "bg-slate-200")} />
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className={cn(
                      "rounded-3xl px-8 py-5 text-center w-full sm:min-w-[240px] transition-all duration-500 shadow-xl border relative",
                      sup.isProblematic ? "bg-red-50/50 border-red-200" : "bg-white border-slate-100"
                    )}
                  >
                    <span className={cn("text-[8px] font-black uppercase block mb-2 tracking-[0.2em]", sup.isProblematic ? "text-red-600" : "text-slate-400")}>
                      {sup.role}
                    </span>
                    <span className="text-slate-900 font-black text-xs block italic tracking-tight">{sup.name.toUpperCase()}</span>
                    {(sup.teamName || sup.autonomyLevel) && (
                      <div className="mt-2 flex flex-col items-center gap-1">
                        {sup.teamName && <span className="text-[9px] text-sunset-orange font-bold uppercase block">{sup.teamName}</span>}
                        {sup.autonomyLevel && (
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${sup.autonomyLevel}%` }} />
                             </div>
                             <span className="text-[7px] font-black text-emerald-600">{sup.autonomyLevel}%</span>
                          </div>
                        )}
                      </div>
                    )}
                    {sup.isProblematic && (
                      <div className="mt-4 flex flex-col gap-2">
                         <div className="h-0.5 bg-red-100 w-full rounded-full" />
                         <span className="inline-block text-red-600 text-[8px] font-black px-3 py-1 bg-white border border-red-200 rounded-full shadow-sm tracking-[0.1em] uppercase">
                           Integrity Alert
                         </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Teams Layer */}
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 relative w-full justify-center items-center sm:items-start before:hidden sm:before:block before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-80px)] before:h-px before:bg-slate-200">
              {teams.map((team) => (
                <div key={team.id} className="flex flex-col items-center pt-px w-full sm:w-auto">
                  <div className="w-px h-8 bg-slate-200" />
                  <div className={cn(
                    "rounded-2xl px-6 py-4 text-center w-full sm:min-w-[160px] transition-all relative overflow-hidden group",
                    team.role === 'Troubleshooting' ? "sunset-gradient text-white shadow-xl shadow-sunset-orange/20" : "bg-slate-50 border border-slate-200 text-slate-500"
                  )}>
                    <div className="absolute top-0 right-0 w-8 h-8 opacity-[0.05] group-hover:scale-150 transition-transform">
                       <ShieldCheck className="w-full h-full" />
                    </div>
                    <span className={cn(
                      "text-[9px] font-black uppercase block mb-1 tracking-widest",
                      team.role === 'Troubleshooting' ? "text-white/70" : "text-slate-400"
                    )}>{team.role}</span>
                    <span className="text-[10px] font-bold block uppercase tracking-tighter">{team.name}</span>
                    {team.autonomyLevel && (
                       <div className="mt-3 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-widest px-1">
                             <span className="opacity-60">Autonomy</span>
                             <span>{team.autonomyLevel}%</span>
                          </div>
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                             <div className="h-full bg-white transition-all duration-1000" style={{ width: `${team.autonomyLevel}%` }} />
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ActionPlanSection = ({ data, onManageData, onNotify }: { data: DashboardData; onManageData: () => void; onNotify: (m: string) => void }) => {
  const recommendations = data.recommendations;
  const zones = data.zones;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'Clock': return Clock;
      case 'BarChart3': return BarChart3;
      case 'ShieldAlert': return ShieldAlert;
      default: return Info;
    }
  };

  return (
    <div id="action-plan-view" className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">Action Plan & Risk Info</h2>
           <p className="text-slate-500 font-medium italic">Operational directives and spatial risk distribution</p>
        </div>
        <div className="flex gap-4">
          <DownloadPDFButton targetId="action-plan-view" fileName="Karma3-Action-Plan" iconOnly onEmailSent={onNotify} />
          <button 
            onClick={onManageData}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sunset-orange transition-all shadow-xl"
          >
            <Settings className="w-4 h-4" /> Manage Data Nodes
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations.map((rec) => {
          const IconComponent = getIcon(rec.icon);
          return (
            <Card key={rec.id} className="relative group overflow-hidden">
              <div className="absolute -top-6 -right-6 text-8xl font-black text-slate-100/50 select-none group-hover:text-sunset-orange/10 transition-colors duration-700 italic">{rec.id}</div>
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "p-3 rounded-2xl shadow-inner",
                  rec.color === 'red' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest italic">{rec.title}</h3>
              </div>
              <ul className="space-y-4">
                {rec.list.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-xs text-slate-500 font-medium group-hover:text-slate-800 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full sunset-gradient mt-1.5 shadow-lg shadow-sunset-orange/50 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card title="Solar Expansion Grid – Network Hubs" icon={Zap} tag={<Badge variant="crit">Urgent Action</Badge>}>
        <div className="overflow-x-auto no-scrollbar custom-scrollbar">
          <table className="w-full text-left text-xs uppercase tracking-[0.15em] border-collapse">
                <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 font-black">Region / Sector</th>
                    <th className="px-8 py-5 font-black text-center">Vol. Delta</th>
                    <th className="px-8 py-5 font-black">Legacy Issues / Solar Roadmap</th>
                    <th className="px-8 py-5 font-black text-right">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {zones.map((zone, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="px-8 py-5 text-slate-900 font-extrabold italic group-hover:text-sunset-orange transition-colors">{zone.name}</td>
                      <td className="px-8 py-5 text-center text-red-600 font-black text-xl italic">{zone.claims}</td>
                      <td className="px-8 py-5">
                        <div className="text-slate-500 font-medium mb-1 lowercase italic first-letter:uppercase">{zone.cause}</div>
                        <div className="text-sunset-orange text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                           <div className="w-1.5 h-px bg-sunset-orange" /> {zone.solution}
                        </div>
                      </td>
                  <td className="px-8 py-5 text-right">
                    <Badge variant={zone.prio === 'Critical' ? 'crit' : 'orange'}>{zone.prio}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <CalendarSection />
    </div>
  );
};

const CalendarSection = () => {
  const steps = [
    { label: 'R1 – Core Integrity', sub: 'IMMEDIATE', bar: { start: 0, width: 15, color: '#ff4d00' }, text: 'Urg.' },
    { label: 'R2 – Sync Operations', sub: 'IMMEDIATE', bar: { start: 0, width: 30, color: '#ff9e00' }, text: 'Sync' },
    { label: 'R7 – Directive Compliance', sub: 'IMMEDIATE', bar: { start: 0, width: 15, color: '#ff4d00' }, text: 'Ref.' },
    { label: 'R5 – Visual Roadmap', sub: 'SHORT TERM', bar: { start: 15, width: 15, color: '#ffbd00' }, text: 'Setup' },
    { label: 'R6 – AI dedicated HUB', sub: 'SHORT TERM', bar: { start: 15, width: 35, color: '#1a1510' }, text: 'OS' },
    { label: 'R4 – Management Karma3', sub: 'MEDIUM TERM', bar: { start: 30, width: 35, color: '#ff4d00' }, text: 'Fiches' },
    { label: 'Solar Network Grid', sub: 'LONG TERM', bar: { start: 35, width: 65, color: '#10b981' }, text: 'Audit+Int' },
  ];

  return (
    <div className="space-y-12">
      <Card title="Karma3 Execution Calendar" icon={CalendarIcon}>
        <div className="overflow-x-auto no-scrollbar custom-scrollbar">
          <div className="min-w-[700px] pb-4 px-2">
            <div className="grid grid-cols-[250px_1fr] gap-8 mb-8 border-b border-slate-100 pb-5">
              <div />
              <div className="grid grid-cols-6 gap-2 px-2 uppercase tracking-[0.3em] font-black text-[10px] text-slate-300">
                {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Final'].map(m => (
                  <span key={m} className="text-center">{m}</span>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="grid grid-cols-[250px_1fr] gap-8 items-center group">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic group-hover:text-sunset-orange transition-colors">{step.label}</span>
                    <span className="text-[9px] text-slate-300 uppercase font-bold tracking-[0.2em]">{step.sub}</span>
                  </div>
                  <div className="h-8 bg-slate-50 rounded-2xl relative overflow-hidden border border-slate-100 shadow-inner">
                    <motion.div 
                      className="absolute inset-y-0 flex items-center justify-center text-[9px] font-black text-white px-4 rounded-2xl shadow-xl"
                      style={{ 
                        left: `${step.bar.start}%`, 
                        width: `${step.bar.width}%`, 
                        background: step.bar.color.startsWith('#') ? step.bar.color : `var(--color-sunset-orange)`
                      }}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      <span className="relative z-10">{step.text}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      <Card title="Indicator Tracking" icon={BarChart3} tag={<Badge variant="blue">Performance KPIs</Badge>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] uppercase tracking-wider">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black">Action</th>
                <th className="px-6 py-4 font-black text-center">Responsible</th>
                <th className="px-6 py-4 font-black text-center">Deadline</th>
                <th className="px-6 py-4 font-black text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: 'PPE & Ladders', resp: 'HSE / Direction', date: 'Week 1', status: 'Pending', v: 'red' },
                { label: 'Schedule Revision', resp: 'Operations Chief', date: 'Week 1', status: 'Pending', v: 'red' },
                { label: 'Staff PC & Network Hub', resp: 'IT / Direction', date: 'Week 4', status: 'Pending', v: 'blue' },
                { label: 'Zones A-E Network Plan', resp: 'Operations Chief', date: 'Months 2-6', status: 'Pending', v: 'yellow' },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-bold">{item.label}</td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{item.resp}</td>
                  <td className="px-6 py-4 text-center text-amber-600 font-mono font-black italic">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={item.v as any}>{item.status}</Badge>
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

const DocumentsSection = ({ data, onNotify }: { data: DashboardData; onNotify: (m: string) => void }) => {
  const docs = data.complianceDocs;
  const [expandedRef, setExpandedRef] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = docs.filter(doc => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (doc.title && doc.title.toLowerCase().includes(query)) ||
      (doc.ref && doc.ref.toLowerCase().includes(query)) ||
      (doc.obj && doc.obj.toLowerCase().includes(query))
    );
  });

  const docDetails: Record<string, { desc: string; hash: string; registeredAt: string }> = {
    'RSO-001': {
      desc: "Comprehensive audit report establishing managerial alerts and compliance of site personnel. Indicates the criminal liability of the executive in case of non-compliance with security guidelines.",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      registeredAt: "2026-05-12 10:30 UTC"
    },
    'PROF-002': {
      desc: "Skills enhancement strategy of our field technicians towards a certified Karma3 approved expert status, maximizing service quality and operational safety.",
      hash: "822709a32c4e36504a7428f64522955f8eb899b800e843efc6bc36dd165ff3ca",
      registeredAt: "2026-05-15 14:45 UTC"
    },
    'LT-01': {
      desc: "Priority procurement demand for higher compliance personal protective equipment. Relates to the full renewal of insulating helmets, high-voltage gloves, and puncture-resistant shoes.",
      hash: "81e3a4ba8fca7a8c3e66699fb924151a6ee841e4ba6dca49e69fb9166da2b801",
      registeredAt: "2026-05-20 09:12 UTC"
    },
    'LT-04': {
      desc: "Global scheduling aiming at the redistribution of jobs and responsibilities within field teams. Helps match actual technical profiles with legal job descriptions.",
      hash: "c28fa4ea7b6b3e6c9a72dfab9a8e9e2418e27ca36b2eecca8a7cba8b39dd16ba",
      registeredAt: "2026-05-21 17:00 UTC"
    },
    'LT-09': {
      desc: "Methodological guide designed to educate the entire response team about electrical overvoltage risks and to share best environmental prevention practices.",
      hash: "4fc28b8a012d4d3a6c76dbfb9b2f210d322b7ca36e2fca590ee85cb990de85fa",
      registeredAt: "2026-05-24 11:20 UTC"
    }
  };

  const handleExportToCSV = async () => {
    if (isExporting) return;
    setIsExporting(true);

    // Simulate compilation delay for high-end visual feedback
    await new Promise(resolve => setTimeout(resolve, 1000));

    const formatCSVValue = (val: string) => {
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const headers = ["ID", "Référence", "Titre", "Objectif/Sujet", "Nature", "Priorité"];
    const rows = docs.map(doc => [
      doc.id || '',
      doc.ref || '',
      doc.title || '',
      doc.obj || '',
      doc.nature || '',
      doc.priority || ''
    ]);

    const csvContent = [
      headers.map(formatCSVValue).join(","),
      ...rows.map(row => row.map(formatCSVValue).join(","))
    ].join("\n");

    try {
      // Add UTF-8 BOM to ensure Excel reads french accent letters properly
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Karma3-Document-Registry-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify("Registre de documents exporté au format CSV !");
    } catch (err) {
      console.error("CSV Export Error:", err);
      onNotify("Erreur lors de l'exportation CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="docs-registry-view" className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="space-y-4">
           <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest italic inline-block">
              VAULT::REGULATORY_ARCHIVE
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.85]">
             Strategic <br/><span className="text-sunset-orange">Vault</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Cryptographically Signed Compliance Registry</p>
        </div>
        <div className="flex gap-1.5 items-center">
           <DownloadPDFButton targetId="docs-registry-view" fileName="Karma3-Document-Registry" iconOnly onEmailSent={onNotify} />
           <button 
              onClick={handleExportToCSV}
              disabled={isExporting}
              title="Exporter au format CSV"
              className={cn(
                "p-2 bg-slate-900 text-white rounded-lg hover:bg-sunset-orange transition-all shadow-md flex items-center justify-center cursor-pointer disabled:bg-slate-850 disabled:text-slate-500 disabled:pointer-events-none"
              )}
           >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card 
            title="Operational Registry" 
            icon={Lock} 
            tag={<Badge variant="orange">{searchQuery ? `${filteredDocs.length} / ${docs.length}` : docs.length} SECURED OBJECTS</Badge>}
          >
            {/* Real-time Document Registry Search Bar */}
            <div className="relative mt-2 mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="RECHERCHER PAR TITRE, RÉFÉRENCE OU SUJET/OBJECTIF..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-855 placeholder-slate-400 outline-none focus:bg-white focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/10 transition-all uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-sunset-orange transition-colors uppercase text-[9px] font-black tracking-widest cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>

            <div className="overflow-x-auto no-scrollbar custom-scrollbar">
              <table className="w-full text-left text-xs uppercase tracking-wider border-collapse select-none">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-black italic">
                    <th className="pb-3 px-4 font-black">Référence / ID</th>
                    <th className="pb-3 px-4 font-black">Titre</th>
                    <th className="pb-3 px-4 font-black">Priorité</th>
                    <th className="pb-3 px-4 font-black">Sujet</th>
                    <th className="pb-3 px-4 font-black text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-bold italic uppercase tracking-wider">
                        No document found for "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => {
                    const isExpanded = expandedRef === doc.ref;
                    const details = docDetails[doc.ref] || {
                      desc: `${doc.title} - Official audit document cryptographically registered and sealed for Karma3 regulatory compliance.`,
                      hash: `0x${Array.from(doc.ref).map(c => c.charCodeAt(0).toString(16)).join('').padEnd(52, 'f')}`,
                      registeredAt: "2026-05-25 10:00 UTC"
                    };

                    return (
                      <React.Fragment key={doc.ref}>
                        <tr 
                          onClick={() => setExpandedRef(isExpanded ? null : doc.ref)}
                          className={cn(
                            "group hover:bg-slate-50 transition-colors cursor-pointer text-left font-sans text-xs",
                            isExpanded ? "bg-slate-50/50" : ""
                          )}
                        >
                          <td className="py-4 px-4 font-mono font-bold text-slate-500 text-[10px] tracking-widest">
                            <span className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-sunset-orange shrink-0 animate-pulse" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sunset-orange transition-colors shrink-0" />
                              )}
                              {doc.ref}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-900 font-black italic text-[11px] uppercase tracking-widest">
                            {doc.title}
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={doc.priority === 'Critical' ? 'crit' : 'orange'}>
                              {doc.priority || 'Medium'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-slate-400 font-bold italic text-[9px] tracking-tight truncate max-w-[150px] uppercase">
                            {doc.obj}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1 justify-end italic">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> SCELLÉ
                            </span>
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        <tr>
                          <td colSpan={5} className="p-0 border-none">
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden bg-slate-50/50 border-t border-b border-slate-100/80"
                                >
                                  <div className="p-6 text-left font-sans text-xs flex flex-col lg:flex-row gap-6">
                                    <div className="flex-grow space-y-4">
                                      <div className="space-y-1.5">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Description & Objectif</span>
                                        <p className="text-[11px] text-slate-600 font-semibold normal-case leading-relaxed">
                                          {details.desc}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                        <div>
                                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">ID d'enregistrement</span>
                                          <span className="text-[10px] font-mono font-bold text-slate-800 block">{doc.id}</span>
                                        </div>
                                        <div>
                                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Type de document</span>
                                          <span className="text-[10px] font-extrabold text-sunset-orange uppercase tracking-wider block">{doc.nature}</span>
                                        </div>
                                        <div>
                                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Gravité / Priorité</span>
                                          <span className="text-[10px] font-extrabold text-slate-850 uppercase tracking-wider block">{doc.priority}</span>
                                        </div>
                                        <div>
                                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Validation</span>
                                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">REDAL LEDGER ACCR.</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="w-full lg:w-80 p-5 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between space-y-4 shrink-0 shadow-sm">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-slate-800">
                                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                          <span className="text-[10px] font-black uppercase tracking-wider">Scellé Cryptographique</span>
                                        </div>
                                        
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 font-mono">
                                          <div>
                                            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block">SHA-256 SIGNATURE</span>
                                            <span className="text-[8.5px] font-medium text-slate-500 break-all block leading-tight">{details.hash}</span>
                                          </div>
                                          <div className="border-t border-slate-100 pt-1.5">
                                            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block font-sans">Enregistrement Système</span>
                                            <span className="text-[9px] font-semibold text-slate-600 block">{details.registeredAt}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                                        <span className="text-[8.5px] font-black text-emerald-700 uppercase tracking-widest">Preuve d'intégrité</span>
                                        <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-mono font-black">VALABLE</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
           <Card title="Compliance Integrity" icon={ShieldCheck} className="bg-slate-900 border-slate-800 text-white">
              <div className="space-y-8 pt-4">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Integrity Score</span>
                    <div className="text-5xl font-black italic text-emerald-500 tracking-tighter">99.4%</div>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Signed by REDAL</span>
                       </div>
                       <p className="text-[9px] text-white/40 italic leading-relaxed">
                         All operational acts and interventions are timestamped and immutable within the REDAL Ledger.
                       </p>
                    </div>

                    <div className="space-y-4">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regulatory Checklist</span>
                       {[
                         { label: 'PPE Compliance Art. 184', status: true },
                         { label: 'Work Amplitude Regulation', status: true },
                         { label: 'HSE Field Audits (W21)', status: false },
                         { label: 'Legal Liability Shield', status: true },
                       ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center px-2">
                             <span className="text-[10px] font-bold text-slate-300 italic">{item.label}</span>
                             {item.status ? <Check className="w-4 h-4 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-sunset-orange animate-ping" />}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </Card>

           <Card title="Expert Signature" icon={Award}>
              <div className="p-6 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200 text-center">
                 <p className="text-[10px] font-bold text-slate-400 italic mb-4 uppercase tracking-tighter">Authorized Official Delegate</p>
                 <div className="h-12 flex items-center justify-center opacity-40 grayscale mb-4">
                    <div className="text-2xl font-serif italic text-slate-900">Karma3 Security Council</div>
                 </div>
                 <Badge variant="blue">Valid until 12/2026</Badge>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

// --- Config Section ---

const ConfigSection = ({ data, actions, onNotify }: { data: DashboardData; actions: any; onNotify: (m: string) => void }) => {
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
      email: 'new@karma3.com',
      phone: '+1 555-0000'
    };
    updateEmployee(newEmployee.id, newEmployee);
  };

  return (
    <div id="config-hub-view" className="space-y-8 pb-16">
      <div className="flex justify-end">
        <DownloadPDFButton targetId="config-hub-view" fileName="Karma3-Setup-Configuration" iconOnly onEmailSent={onNotify} />
      </div>
      <Card title="Employee Directory Management" icon={Users}>
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Karma3 Personnel Hub</span>
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

      <Card title="Karma3 Node Management" icon={Users}>
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

      <Card title="Karma3 Performance Core Editor" icon={BarChart3}>
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
                <th className="px-6 py-4 font-black">Karma3 Vector</th>
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

const GuideSection = ({ onNotify }: { onNotify: (m: string) => void }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "The Karma3 Architecture",
      subtitle: "Foundational Intelligence Layers",
      content: "Karma3 is built upon a multi-layered neural architecture that synchronizes financial telemetry with global compliance frameworks. By interpreting raw system logs through the lens of SOC 2 Trust Services Criteria, we transform passive data into active defense protocols. This layer ensures that every transaction is matched against a security heuristic in real-time.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      stats: { label: "Synaptic Sync", value: "0.4ms" }
    },
    {
      title: "Risk Topology Mapping",
      subtitle: "Visualizing Hidden Vulnerabilities",
      content: "The 'Intelligence' module employs a proprietary Topology Engine to map dependencies between critical operational nodes. When a vulnerability is detected in a peripheral service (e.g., a specific cloud region or personnel cluster), Karma3 automatically propagates' Exposure Scores' throughout the network, allowing officers to visualize the blast radius of potential failures.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
      stats: { label: "Graph Nodes", value: "4.2k" }
    },
    {
      title: "Harmonized Compliance",
      subtitle: "SOC 2 & ISO 27001 Convergence",
      content: "Traditional auditing is reactive and retrospective. Karma3 harmonizes frameworks like ISO 27001 and SOC 2 into a single unified control matrix. Our 'Compliance' module utilizes automated evidence collection to keep audit trails warm, reducing the time to certification by up to 85% while maintaining a state of 'Continuous Readiness'.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      stats: { label: "Evidence Gen", value: "Auto" }
    },
    {
      title: "Neural Financial Audit",
      subtitle: "Predictive Capital Protection",
      content: "Beyond security, Karma3 utilizes advanced LLMs to identify financial anomalies before they manifest in ledgers. By correlating spend patterns with risk heuristics, we provide the CFO with a 'Neural Projection' of potential capital leaks, enabling preemptive reallocation of resources to high-growth sectors.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      stats: { label: "Leak Detection", value: ">99%" }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 sunset-gradient rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-sunset-orange/20 animate-bounce-slow">
           <BookOpen className="w-8 h-8 text-white -rotate-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl font-black italic text-slate-900 uppercase tracking-tighter">Karma3 <span className="text-slate-300">Handbook</span></h1>
          <div className="flex items-center justify-center gap-6">
             <div className="h-px w-12 bg-slate-200" />
             <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] italic underline decoration-sunset-orange/30 decoration-4 underline-offset-8">The Definitive Operating Manual • v4.2</p>
             <div className="h-px w-12 bg-slate-200" />
          </div>
          
          <div className="pt-4">
            <DownloadPDFButton targetId="handbook-content" fileName="Karma3-Karma3-Handbook" iconOnly onEmailSent={onNotify} />
          </div>
        </div>
      </div>

      {/* The Book Interface */}
      <div id="handbook-content" className="relative">
         {/* Decorative Shadow/Depth */}
         <div className="absolute inset-x-8 -bottom-8 h-32 bg-slate-200/50 blur-[80px] rounded-full -z-10" />
         
         <div className="bg-white rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row min-h-[700px] group">
            {/* Left Page (Image & Dynamic Stats) */}
            <div className="w-full lg:w-1/2 relative bg-slate-50 overflow-hidden border-r border-slate-50">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, scale: 1.1, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={pages[currentPage].image} 
                      className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      alt="Guide illustration"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/20 to-transparent" />
                  </motion.div>
               </AnimatePresence>

               {/* Overlaid Metadata */}
               <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between text-white z-10">
                  <div className="space-y-4">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full inline-block"
                     >
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Section 0{currentPage + 1}</span>
                     </motion.div>
                     <div className="space-y-1">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">{pages[currentPage].title}</h2>
                        <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] italic">{pages[currentPage].subtitle}</p>
                     </div>
                  </div>

                  <div className="text-right hidden sm:block">
                     <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 italic">{pages[currentPage].stats.label}</div>
                     <div className="text-3xl font-black italic tracking-tighter text-sunset-orange">{pages[currentPage].stats.value}</div>
                  </div>
               </div>
            </div>

            {/* Right Page (Content & Navigation) */}
            <div className="w-full lg:w-1/2 p-20 flex flex-col justify-between bg-white relative">
               {/* Watermark */}
               <div className="absolute top-20 right-20 text-slate-50 font-black text-9xl select-none italic tracking-tighter leading-none -rotate-12 pointer-events-none">
                  INDEX
               </div>

               <div className="space-y-12 relative z-10">
                  <div className="w-20 h-1.5 sunset-gradient rounded-full" />
                  
                  <div className="space-y-8">
                     <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPage}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.6, ease: "circOut" }}
                          className="prose prose-slate lg:prose-xl max-w-none"
                        >
                           <p className="text-2xl leading-relaxed font-serif italic text-slate-700 first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-sunset-orange">
                              {pages[currentPage].content}
                           </p>
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </div>

               <div className="flex items-center justify-between border-t border-slate-50 pt-12 relative z-10">
                  <div className="flex gap-3">
                     {pages.map((_, i) => (
                        <button 
                           key={i} 
                           onClick={() => setCurrentPage(i)}
                           className={cn(
                              "h-1.5 rounded-full transition-all duration-700", 
                              currentPage === i ? "w-12 bg-sunset-orange" : "w-1.5 bg-slate-100 hover:bg-slate-300"
                           )} 
                        />
                     ))}
                  </div>

                  <div className="flex gap-6">
                     <button 
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all disabled:opacity-0"
                     >
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                           <ChevronRight className="w-4 h-4 rotate-180" />
                        </div>
                        Prev
                     </button>
                     <button 
                        disabled={currentPage === pages.length - 1}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-sunset-orange transition-all disabled:opacity-0"
                     >
                        Next
                        <div className="w-10 h-10 rounded-2xl sunset-gradient flex items-center justify-center text-white shadow-xl shadow-sunset-orange/20 group-hover:scale-110 transition-transform">
                           <ChevronRight className="w-4 h-4" />
                        </div>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Lexicon / Definitive Terms Grid */}
      <div className="space-y-8">
         <div className="flex items-center gap-4">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">The Karma3 Lexicon</h3>
            <div className="flex-1 h-px bg-slate-100" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { icon: Info, term: "Karma3 Hub", def: "The centralized command post where all risk data is aggregated. It acts as the 'Single Source of Truth' for senior financial officers." },
               { icon: Zap, term: "Karma3 Vector", def: "A unidirectional data path linking an operational incident to its estimated financial impact within the dashboard." },
               { icon: ShieldAlert, term: "Trust Services", def: "The five SOC 2 principles (Security, Availability, Processing Integrity, Confidentiality, Privacy) that the system monitors continuously." }
            ].map((item, i) => (
               <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="p-6 md:p-10 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] space-y-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
               >
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-sunset-orange/5 transition-colors">
                     <item.icon className="w-6 h-6 text-slate-400 group-hover:text-sunset-orange transition-colors" />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-lg font-black italic tracking-tight uppercase text-slate-900">{item.term}</h4>
                     <p className="text-slate-400 text-sm leading-relaxed italic">{item.def}</p>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

const BastionAccessSection = ({ onNotify }: { onNotify: (m: string) => void }) => {
  const [intent, setIntent] = useState('');
  const [sessions, setSessions] = useState([
    { id: 'SES-912', user: 'admin', asset: 'Karma3-Core-DB-01', protocol: 'SSH', status: 'active', time: '12m 44s', risk: 12, behavior: 'Normal' },
    { id: 'SES-915', user: 'j.dupont', asset: 'Audit-Relay-Alpha', protocol: 'RDP', status: 'idle', time: '05m 12s', risk: 8, behavior: 'Normal' },
    { id: 'SES-918', user: 'system', asset: 'Cloud-Gateway-04', protocol: 'SSH', status: 'active', time: '01m 02s', risk: 42, behavior: 'Anomalous Cmd' },
  ]);

  const statistics = [
    { label: 'Neural Watch', value: 'Active', icon: Brain, color: 'text-sunset-orange' },
    { label: 'Active Sessions', value: sessions.length.toString(), icon: Zap, color: 'text-emerald-500' },
    { label: 'Risk Anomalies', value: sessions.filter(s => s.risk > 30).length.toString(), icon: AlertTriangle, color: 'text-sunset-red' },
    { label: 'Sovereignty', value: '99.9%', icon: ShieldCheck, color: 'text-blue-500' },
  ];

  const capabilities = [
    { title: 'Unified Gateway', desc: 'SSH, RDP, K8s, Database', icon: Globe, detail: 'Unified Access Gateway' },
    { title: 'Neural Playback', desc: 'Full Session Recording', icon: Play, detail: 'Session Recording' },
    { title: 'Neural Vault', desc: 'Credential Rotation', icon: Lock, detail: 'Credential Vault' },
    { title: 'JIT Bridge', desc: 'Ephemeral Access', icon: Zap, detail: 'JIT Immediate Access' },
    { title: 'Identity Link', desc: 'MFA / SSO Integration', icon: Key, detail: 'Multi-Factor Auth' },
    { title: 'Asset Scan', desc: 'Auto-Discovery Engine', icon: Search, detail: 'Asset Discovery' },
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                <Globe className="w-3 h-3 text-sunset-orange" /> Neural Operating System
             </div>
             <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest italic">
                Karma3-Bastion Synergy v1.0
             </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-[0.85]">
            Access <br/><span className="text-sunset-orange">Orchestrator</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium italic tracking-wide max-w-xl leading-relaxed">
            Collaborative security layer where Karma3 AI proactively monitors JumpServer sessions using cognitive UBA and intent-based orchestration.
          </p>
        </div>

        <div className="space-y-4 w-full md:w-96">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-sunset-orange" /> AI Intent Access Command
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Terminal className="w-4 h-4 text-slate-400 group-focus-within:text-sunset-orange transition-colors" />
            </div>
            <input 
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && intent) {
                  const lower = intent.toLowerCase();
                  if (lower.includes('add') || lower.includes('créer') || lower.includes('grant') || lower.includes('ssh') || lower.includes('rdp')) {
                    const newSesId = `SES-${Math.floor(100 + Math.random() * 900)}`;
                    const newUser = lower.match(/(?:for|to|user|officier)\s+(\w+)/)?.[1] || 'officier';
                    const newAsset = lower.match(/(?:on|target|asset|core)\s+([\w-]+)/)?.[1] || 'Karma3-Cloud-02';
                    const newSession = {
                      id: newSesId,
                      user: newUser,
                      asset: newAsset.toUpperCase(),
                      protocol: lower.includes('rdp') ? 'RDP' : 'SSH',
                      status: 'active',
                      time: '01s',
                      risk: Math.floor(Math.random() * 30 + 5),
                      behavior: 'Normal'
                    };
                    setSessions(p => [newSession, ...p]);
                    onNotify(`Karma3 AI: Command interpreted. Session ${newSesId} successfully granted for ${newUser} on ${newAsset}.`);
                  } else {
                    onNotify(`Karma3 AI: Command "${intent}" analyzed. Remediation strategy parameters applied.`);
                  }
                  setIntent('');
                }
              }}
              placeholder="Ex: 'Grant SSH to John for Core-v1'..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold italic shadow-xl focus:border-sunset-orange transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Neural Capabilities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 bg-white border border-slate-100 rounded-3xl hover:border-sunset-orange/30 transition-all group"
          >
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-sunset-orange/10 transition-colors">
              <cap.icon className="w-4 h-4 text-slate-400 group-hover:text-sunset-orange transition-colors" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black italic tracking-tight text-slate-900 uppercase leading-none">{cap.title}</h4>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{cap.desc}</p>
              <div className="pt-2">
                <span className="text-[7px] font-black text-sunset-orange uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 transition-opacity">{cap.detail}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statistics.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-sunset-orange/5 transition-colors">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic leading-none">Synergistic Session Stream</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Monitoring Powered by JumpServer + Karma3 AI</p>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => onNotify("AI behavioral sentry scan triggered across all sessions.")}
                   className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-sunset-orange transition-colors"
                   title="Trigger AI Behavioral Scan"
                 >
                   <Brain className="w-4 h-4" />
                 </button>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Neural Sync Active</span>
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50">
                    {['Operator', 'Asset Target', 'Protocol', 'Risk Score', 'Behavior', 'Actions'].map(h => (
                      <th key={h} className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{h}</th>
                    ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {sessions.map(s => (
                   <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">{s.user[0].toUpperCase()}</div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 italic leading-none">{s.user}</span>
                              <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-widest">{s.id}</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-6 text-xs font-black text-slate-900 italic uppercase">{s.asset}</td>
                      <td className="p-6">
                         <span className="px-2 py-1 bg-slate-900 text-white text-[8px] font-black rounded uppercase">{s.protocol}</span>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center gap-2">
                           <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[40px]">
                              <div className={cn("h-full", s.risk > 30 ? "bg-sunset-red" : "bg-emerald-500")} style={{ width: `${s.risk}%` }} />
                           </div>
                           <span className={cn("text-[10px] font-black italic", s.risk > 30 ? "text-sunset-red" : "text-slate-900")}>{s.risk}</span>
                         </div>
                      </td>
                      <td className="p-6">
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest italic",
                           s.behavior === 'Normal' ? "text-emerald-500" : "text-sunset-red animate-pulse"
                         )}>{s.behavior}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button 
                             onClick={() => onNotify(`Karma3 AI generated forensic brief for session ${s.id}.`)}
                             className="p-2.5 text-slate-400 hover:text-sunset-orange transition-colors bg-white border border-slate-100 rounded-xl shadow-sm"
                             title="Generate AI Audit Brief"
                          >
                             <FileText className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => onNotify(`TERMINATING session ${s.id} via local bastion protocol.`)}
                             className="p-2.5 text-slate-400 hover:text-sunset-red transition-colors bg-white border border-slate-100 rounded-xl shadow-sm"
                             title="Terminate Session"
                          >
                             <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="space-y-6">
           <div className="p-5 md:p-8 bg-slate-900 rounded-3xl md:rounded-[3rem] text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck className="w-24 h-24 text-sunset-orange" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Synergy Controls</h3>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Neural Hardening Status</p>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Auto-Closing Intent', status: 'Active', color: 'text-emerald-400' },
                   { label: 'Acoustic UBA Scan', status: 'Enabled', color: 'text-emerald-400' },
                   { label: 'Hardware MFA link', status: 'Pending', color: 'text-amber-400' },
                   { label: 'Compliance Relay', status: 'Real-time', color: 'text-emerald-400' },
                 ].map(item => (
                   <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => onNotify("One-Click Audit Report (AI + JumpServer) generated.")}
                className="w-full py-5 bg-sunset-orange text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:shadow-sunset-orange/40 transition-all flex items-center justify-center gap-2"
              >
                 <Download className="w-4 h-4" /> One-Click Audit
              </button>
           </div>

           <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Collective Risk Pulse</h3>
              <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '00:00', risk: 12 },
                      { time: '04:00', risk: 18 },
                      { time: '08:00', risk: 45 },
                      { time: '12:00', risk: 32 },
                      { time: '16:00', risk: 28 },
                      { time: '20:00', risk: 55 },
                      { time: '23:59', risk: 30 },
                    ]}>
                       <defs>
                         <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ff4d00" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <Area type="monotone" dataKey="risk" stroke="#ff4d00" strokeWidth={3} fillOpacity={1} fill="url(#riskGradient)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Neural Verdict</span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Caution</span>
                 </div>
                 <p className="text-[10px] font-medium text-slate-600 italic leading-relaxed">
                   Risk spike detected at 20:00 due to anomalous command stream in SES-918. Behavioral sentry has flagged the operator for secondary MFA validation.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const PAMRoadmapSection = ({ onNotify }: { onNotify: (m: string) => void }) => {
  const phases = [
    {
      id: 'P1',
      title: 'Phase 1: Audit & Mapping',
      subtitle: 'Environmental Survey',
      description: 'Targeting critical assets and identification of privileged access flows.',
      tasks: [
        'Inventory of high-privilege accounts (Admin, Root, Super-user)',
        'Access flow analysis (VPN, SSH, RDP)',
        'Vulnerability assessment (shared passwords, generic accounts)'
      ],
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      id: 'P2',
      title: 'Phase 2: Technical Specifications',
      subtitle: 'Technical Requirements',
      description: 'Defining functional pillars of the future PAM system.',
      tasks: [
        'Vaulting & Auto-rotation (Password Vaulting)',
        'Access Control & Least Privilege',
        'Just-in-Time (JIT) Access implementation',
        'Traceability & Session Monitoring'
      ],
      icon: ClipboardList,
      color: 'bg-sunset-orange'
    },
    {
      id: 'P3',
      title: 'Phase 3: Benchmark & Selection',
      subtitle: 'Solution Selection',
      description: 'Comparative evaluation of market leaders via POC.',
      tasks: [
        'Market leader comparison (CyberArk, BeyondTrust, Delinea)',
        'MFA Validation & AD/LDAP Integration',
        'User Experience (UX) Audit',
        'Deployment capability analysis (Cloud/Hybrid)'
      ],
      icon: Filter,
      color: 'bg-purple-500'
    },
    {
      id: 'P4',
      title: 'Phase 4: Progressive Roll-out',
      subtitle: 'Implementation',
      description: 'Staged deployment to ensure service continuity.',
      tasks: [
        'Pilot on restricted scope (e.g., DB Servers)',
        'Integration of external providers',
        'Infrastructural-wide generalization'
      ],
      icon: RefreshCw,
      color: 'bg-emerald-500'
    },
    {
      id: 'P5',
      title: 'Phase 5: Governance',
      subtitle: 'Maintenance & Continuous Audit',
      description: 'Maintaining security posture over the long term.',
      tasks: [
        'Quarterly review of access rights',
        'Log analysis via SIEM integration',
        'Annual compliance review (ISO 27001 / GDPR)'
      ],
      icon: ShieldCheck,
      color: 'bg-slate-900'
    }
  ];

  return (
    <div className="space-y-16 py-8">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest italic flex items-center gap-2 mx-auto">
          <ShieldAlert className="w-3 h-3" /> Strategic Cyber Roadmap
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-[0.9]">
          PAM Deployment <br /><span className="text-sunset-orange">Framework</span>
        </h2>
        <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
          A structured approach to moving from vulnerability to digital sovereignty through the mastery of privileged access.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-16 bottom-16 w-px bg-slate-100 hidden md:block" />

        <div className="space-y-12">
          {phases.map((phase, i) => (
            <motion.div 
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-0 md:pl-24"
            >
              {/* Timeline Node */}
              <div className={cn(
                "absolute left-0 top-0 w-16 h-16 rounded-3xl hidden md:flex items-center justify-center text-white shadow-2xl transition-all duration-500 z-10",
                phase.color
              )}>
                <phase.icon className="w-8 h-8" />
              </div>

              <div className="bg-white p-5 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-sunset-orange/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <phase.icon className="w-32 h-32" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                   <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <span className={cn("px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest", phase.color)}>Step {i + 1}</span>
                           <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">{phase.title}</h3>
                        </div>
                        <p className="text-[12px] text-slate-400 font-black uppercase tracking-widest italic">{phase.subtitle}</p>
                      </div>
                      
                      <p className="text-slate-600 font-medium italic leading-relaxed max-w-xl">
                        {phase.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                         {phase.tasks.map((task, j) => (
                           <div key={j} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-sunset-orange transition-colors shrink-0" />
                              <span className="text-[11px] font-bold text-slate-600 italic leading-snug">{task}</span>
                           </div>
                         ))}
                      </div>
                      
                      <button 
                        onClick={() => onNotify(`Module ${phase.id} integration initiated.`)}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-sunset-orange transition-colors"
                      >
                         Configure Module <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>

                   <div className="w-full md:w-64 space-y-6 shrink-0">
                      <div className="p-4 md:p-6 bg-slate-900 rounded-2xl md:rounded-[2.5rem] text-white space-y-4">
                         <div className="text-[8px] font-black text-white/40 uppercase tracking-widest italic">Critical Output</div>
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black italic tracking-tight uppercase">Deliverable Ready</span>
                         </div>
                         <div className="text-xs font-bold italic leading-relaxed text-white/80">
                            {phase.id === 'P1' && "Critical asset mapping (Discovery Engine) validated."}
                            {phase.id === 'P2' && "Matrice JIT & Vaulting (خزنة بيانات اعتماد) approuvée."}
                            {phase.id === 'P3' && "Benchmark MFA/SSO (المصادقة متعددة العوامل) finalisé."}
                            {phase.id === 'P4' && "Accès unifié SSH/RDP (بوابة وصول موحدة) établi."}
                            {phase.id === 'P5' && "Automated Audit Export (تصدير ملفات التدقيق) actité."}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-12 bg-sunset-orange text-white rounded-3xl md:rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-2xl shadow-sunset-orange/30">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="relative z-10 space-y-6">
          <h4 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Ready for Cyber Sovereignty?</h4>
          <p className="text-white/80 text-lg max-w-2xl mx-auto italic font-medium">
            Contact our team of experts to transform this methodology into a real competitive advantage for your organization.
          </p>
          <button 
            onClick={() => onNotify("Consultation request logged.")}
            className="px-12 py-5 bg-white text-sunset-orange rounded-3xl font-black uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all"
          >
            Launch Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

const PricingSection = ({ onNotify }: { onNotify: (m: string) => void }) => {
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
          Karma3 AI is not a tool; it is an instrument of decision. We don't sell code; we sell time, clarity, and the power of immediate insight.
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

const SubscribersManagementSection = ({ 
  data, 
  onNotify,
  onAddSubscriber,
  onRemoveSubscriber,
  onUpdateSubscriber,
  theme
}: { 
  data: DashboardData; 
  onNotify: (m: string) => void;
  onAddSubscriber?: (s: Subscriber) => Promise<void>;
  onRemoveSubscriber?: (id: string) => Promise<void>;
  onUpdateSubscriber?: (id: string, updates: Partial<Subscriber>) => Promise<void>;
  theme?: 'dark' | 'light' | 'high-contrast';
}) => {
  return (
    <SovereignSubscribersRegistry
      data={data}
      onNotify={onNotify}
      onAddSubscriber={onAddSubscriber}
      onRemoveSubscriber={onRemoveSubscriber}
      onUpdateSubscriber={onUpdateSubscriber}
      theme={theme}
    />
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isLandingPortal, setIsLandingPortal] = useState(true);
  const [portalTab, setPortalTab] = useState<'home' | 'solutions' | 'orchestration' | 'architecture' | 'compliance' | 'fleet' | 'security' | 'tarifs' | 'rapports'>('home');
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');
  const [theme, setTheme] = useState<'dark' | 'light' | 'high-contrast'>(() => {
    return (localStorage.getItem('karma3-theme') as 'dark' | 'light' | 'high-contrast') || 'dark';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSolutionsMenuOpen, setIsSolutionsMenuOpen] = useState(false);

  // New States for secure Credentials Authentication & Registration
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!authEmail || !authPassword || !authConfirmPassword) {
      setAuthError(language === 'FR' ? "Veuillez remplir tous les champs." : "Please fill in all fields.");
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError(language === 'FR' ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError(language === 'FR' ? "Le mot de passe doit comporter au moins 6 caractères." : "Password should be at least 6 characters.");
      return;
    }
    setAuthLoading(true);
    try {
      const { createUserWithEmailAndPassword } = await import('./firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      if (authName && userCredential.user) {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(userCredential.user, { displayName: authName });
      }
      setAuthSuccess(language === 'FR' ? "Compte créé avec succès ! Connexion de session en cours..." : "Account successfully created! Connecting session...");
      showToast(language === 'FR' ? "Enregistrement Karma3 réussi" : "Karma3 registration success", 'success');
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
      setAuthName('');
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errMsg = language === 'FR' ? "Cet e-mail est déjà associé à un compte." : "This email is already in use.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = language === 'FR' ? "Adresse e-mail invalide." : "Invalid email address.";
      } else if (err.code === 'auth/weak-password') {
        errMsg = language === 'FR' ? "Le mot de passe choisi est trop faible." : "Password is too weak.";
      }
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!authEmail || !authPassword) {
      setAuthError(language === 'FR' ? "Veuillez remplir tous les champs." : "Please fill in all fields.");
      return;
    }
    setAuthLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('./firebase');
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      showToast(language === 'FR' ? "Session Karma3 établie avec succès" : "Karma3 session established successfully", 'success');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = language === 'FR' ? "Identifiants ou mot de passe incorrects." : "Incorrect credentials or password.";
      }
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const selectTheme = (next: 'dark' | 'light' | 'high-contrast') => {
    setTheme(next);
    localStorage.setItem('karma3-theme', next);
    const themeNames = {
      'dark': 'Thème sombre (Cyber Obsidian) activé',
      'light': 'Thème clair (Slate Minimal) activé',
      'high-contrast': 'Thème haute accessibilité (WCAG AAA) activé'
    };
    showToast(themeNames[next], 'success');
    setIsThemeMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      let next: 'dark' | 'light' | 'high-contrast';
      if (prev === 'dark') next = 'light';
      else if (prev === 'light') next = 'high-contrast';
      else next = 'dark';
      localStorage.setItem('karma3-theme', next);
      const themeNames = {
        'dark': 'Thème sombre (Cyber Obsidian) activé',
        'light': 'Thème clair (Slate Minimal) activé',
        'high-contrast': 'Thème haute accessibilité (WCAG AAA) activé'
      };
      showToast(themeNames[next], 'success');
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-sovereign-primary', '#080216');
      root.style.setProperty('--bg-sovereign-secondary', '#0c041f');
      root.style.setProperty('--bg-sovereign-card', 'rgba(18, 8, 38, 0.8)');
      root.style.setProperty('--bg-sovereign-card-solid', '#120826');
      root.style.setProperty('--text-sovereign-primary', '#ffffff');
      root.style.setProperty('--text-sovereign-secondary', '#d4e4fa');
      root.style.setProperty('--text-sovereign-muted', '#909096');
      root.style.setProperty('--border-sovereign-primary', 'rgba(144, 144, 150, 0.40)');
      root.style.setProperty('--border-sovereign-secondary', 'rgba(69, 71, 76, 0.35)');
      root.style.setProperty('--shadow-sovereign', '0 20px 40px -15px rgba(1, 15, 31, 0.7)');
      root.style.setProperty('--glow-sovereign-opacity', '0.35');
    } else if (theme === 'light') {
      root.style.setProperty('--bg-sovereign-primary', '#f8fafc');
      root.style.setProperty('--bg-sovereign-secondary', '#ffffff');
      root.style.setProperty('--bg-sovereign-card', '#ffffff');
      root.style.setProperty('--bg-sovereign-card-solid', '#ffffff');
      root.style.setProperty('--text-sovereign-primary', '#0f172a');
      root.style.setProperty('--text-sovereign-secondary', '#334155');
      root.style.setProperty('--text-sovereign-muted', '#475569');
      root.style.setProperty('--border-sovereign-primary', '#94a3b8');
      root.style.setProperty('--border-sovereign-secondary', '#cbd5e1');
      root.style.setProperty('--shadow-sovereign', '0 10px 25px -5px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--glow-sovereign-opacity', '0.1');
    } else if (theme === 'high-contrast') {
      root.style.setProperty('--bg-sovereign-primary', '#ffffff');
      root.style.setProperty('--bg-sovereign-secondary', '#f8fafc');
      root.style.setProperty('--bg-sovereign-card', '#ffffff');
      root.style.setProperty('--bg-sovereign-card-solid', '#ffffff');
      root.style.setProperty('--text-sovereign-primary', '#000000');
      root.style.setProperty('--text-sovereign-secondary', '#000000');
      root.style.setProperty('--text-sovereign-muted', '#121212');
      root.style.setProperty('--border-sovereign-primary', '#000000');
      root.style.setProperty('--border-sovereign-secondary', '#000000');
      root.style.setProperty('--shadow-sovereign', 'none');
      root.style.setProperty('--glow-sovereign-opacity', '0');
    }
  }, [theme]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isInitialized, setIsInitialized] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

  const { 
    data, 
    loading, 
    user, 
    syncInitialData, 
    enableDemoMode,
    updateRisk, 
    addRisk, 
    removeRisk, 
    updateZone, 
    updateService, 
    removeService, 
    updateEmployee, 
    removeEmployee, 
    updateConfig,
    updateRecommendation,
    updateDocument,
    addDocument,
    removeDocument,
    addSubscriber,
    removeSubscriber,
    updateSubscriber
  } = useFirebaseDashboard();

  const { isConnected: isSocketConnected } = useSocket(user?.uid);

  const actions = { 
    updateRisk, 
    addRisk, 
    removeRisk, 
    updateZone, 
    updateService, 
    removeService, 
    updateEmployee, 
    removeEmployee, 
    updateConfig,
    updateRecommendation,
    updateDocument,
    addDocument,
    removeDocument,
    addSubscriber,
    removeSubscriber,
    updateSubscriber
  };

  const tabs = [
    { id: 'summary', label: 'Global Terminal Dashboard', icon: Layout },
    { id: 'fleet', label: 'Real-time Fleet Telemetry', icon: Truck },
    { id: 'inventory', label: 'Equipment Inventory', icon: Cpu },
    { id: 'security', label: 'Security & Compliance', icon: ShieldCheck },
    { id: 'scripts', label: 'Automation & Scripts', icon: Code },
    { id: 'support', label: 'Expert Chat & Helpdesk', icon: HelpCircle },
    { id: 'profile', label: 'System Customization', icon: User },
    
    // Previous routes
    { id: 'sante', label: 'Santé Connect V2', icon: HeartPulse },
    { id: 'services', label: 'Plan Chirurgical', icon: Zap },
    { id: 'multitenancy', label: 'Sprint 1: Multi-Tenancy', icon: Key },
    { id: 'monetization', label: 'Sprint 2: Monétisation', icon: CreditCard },
    { id: 'dirtydozen', label: 'Sprint 3: Suite Anti-Abus', icon: ShieldAlert },
    { id: 'integrations', label: 'Sprint 4: Hub d\'Intégration', icon: Workflow },
    { id: 'gmail', label: 'Sprint 5: Sentinel Gmail', icon: Mail },
    { id: 'sheets', label: 'Sprint 6: Ledgers Sheets', icon: FileSpreadsheet },
    { id: 'karma3', label: 'Sprint 7: Sovereign Analytics', icon: Cpu },
    { id: 'connect', label: 'Sprint 8: Full-Stack Connect', icon: Wifi },
    { id: 'academy', label: 'Académie', icon: GraduationCap },
    { id: 'config', label: 'Gouvernance', icon: FileText },
    { id: 'org', label: 'Organigramme', icon: Users },
    { id: 'bastion', label: 'Bastion SSH', icon: ShieldAlert },
    { id: 'subscribers', label: 'Abonnés', icon: Database },
    { id: 'admin', label: 'Configuration', icon: Settings },
  ];

  const categories = [
    {
      title: "Sovereign Device Karma3 V2",
      items: [
        { id: 'summary', label: 'Global Terminal Dashboard', icon: Layout },
        { id: 'fleet', label: 'Real-time Fleet Telemetry', icon: Truck },
        { id: 'inventory', label: 'Equipment Inventory', icon: Cpu },
        { id: 'security', label: 'Security & Compliance', icon: ShieldCheck },
        { id: 'scripts', label: 'Automation & Scripts', icon: Code },
        { id: 'support', label: 'Expert Chat & Helpdesk', icon: HelpCircle },
        { id: 'profile', label: 'System Customization', icon: User },
      ]
    },
    {
      title: "Karma3 Lab & Sprints",
      items: [
        { id: 'sante', label: 'Santé Connect V2', icon: HeartPulse },
        { id: 'services', label: 'Plan Chirurgical', icon: Zap },
        { id: 'multitenancy', label: 'Sprint 1: Multi-Tenancy', icon: Key },
        { id: 'monetization', label: 'Sprint 2: Monétisation', icon: CreditCard },
        { id: 'dirtydozen', label: 'Sprint 3: Suite Anti-Abus', icon: ShieldAlert },
        { id: 'integrations', label: 'Sprint 4: Hub d\'Intégration', icon: Workflow },
        { id: 'gmail', label: 'Sprint 5: Sentinel Gmail', icon: Mail },
        { id: 'sheets', label: 'Sprint 6: Ledgers Sheets', icon: FileSpreadsheet },
        { id: 'karma3', label: 'Sprint 7: Sovereign Analytics', icon: Cpu },
        { id: 'connect', label: 'Sprint 8: Full-Stack Connect', icon: Wifi },
        { id: 'bastion', label: 'Bastion SSH', icon: ShieldAlert },
        { id: 'academy', label: 'Académie', icon: GraduationCap },
        { id: 'subscribers', label: 'Abonnés', icon: Database },
        { id: 'config', label: 'Gouvernance', icon: FileText },
        { id: 'org', label: 'Organigramme', icon: Users },
        { id: 'admin', label: 'Configuration', icon: Settings },
      ]
    }
  ];

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sunset-orange to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sunset-orange to-transparent" />
          <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-sunset-orange to-transparent" />
          <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-sunset-orange to-transparent" />
        </div>
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,77,0,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center space-y-12 max-w-4xl"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto bg-sunset-dark rounded-2xl rotate-45 flex items-center justify-center border border-sunset-orange/30 shadow-[0_0_50px_rgba(255,77,0,0.2)]"
            >
              <ShieldAlert className="w-8 h-8 text-sunset-orange -rotate-45" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
              The Neural <br/>
              <span className="text-sunset-orange">Operating System</span> <br/>
              for Data Experts
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto italic tracking-wide leading-relaxed">
              Karma3 AI: A high-density Cognitive Command Center designed to synchronize risk intelligence, financial heuristics, and operational integrity into a single instrument of decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: "Precision", label: "Industrial Minimalist", desc: "A UI built for clarity, stripping away distraction to focus on the signal." },
              { title: "Velocity", label: "Omni-Navigation", desc: "Command Palette architecture for zero-friction movement across data nodes." },
              { title: "Intelligence", label: "Neural RAG Engine", prompt: "Deep contextual analysis powered by Gemini 2.0 specialized for audit logic." }
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors group cursor-default"
              >
                <div className="text-xs font-black text-sunset-orange uppercase tracking-widest mb-1 italic">{feature.title}</div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest mb-3 opacity-60">{feature.label}</div>
                <p className="text-[11px] text-slate-400 italic leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,77,0,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsInitialized(true)}
            className="px-16 py-6 bg-sunset-orange text-white rounded-3xl font-black uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center gap-4 mx-auto"
          >
            Initialize Karma3 OS <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Nodes Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">TLS 1.3 Secure</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Code Snippets for "Tech" vibe */}
        <div className="absolute bottom-10 left-10 text-[9px] font-mono text-slate-700 hidden lg:block opacity-40 italic">
          [SYSTEM_LOG]: BOOTING AX-CORE_v2.0<br/>
          [SYSTEM_LOG]: LATENCY::22ms<br/>
          [SYSTEM_LOG]: NEURAL_WEIGHTS::INITIALIZED
        </div>
        <div className="absolute top-10 right-10 text-[9px] font-mono text-slate-700 hidden lg:block opacity-40 italic">
          DEPLOYMENT::RELAY_04<br/>
          SYNC::HEURISTICS_ENGINE<br/>
          STATUS::READY
        </div>
      </div>
    );
  }

  if (isLandingPortal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c041f] via-[#080216] to-[#120732] font-sans text-slate-300 select-none relative overflow-x-hidden flex flex-col justify-between">
        {/* Ambient celestial lights - precisely matching image background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-orange-500/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-[#ec4899]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#8b5cf6]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(249,115,22,0.02)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

          {/* Constellation Mesh Graphic on the Left - matching screenshot style */}
          <svg className="absolute left-[-100px] sm:left-[-50px] top-[15%] w-[380px] h-[750px] text-purple-600/15" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="10" y1="12" x2="35" y2="28" stroke="currentColor" strokeWidth="0.15" />
            <line x1="35" y1="28" x2="18" y2="58" stroke="currentColor" strokeWidth="0.15" />
            <line x1="18" y1="58" x2="55" y2="78" stroke="currentColor" strokeWidth="0.15" />
            <line x1="55" y1="78" x2="75" y2="38" stroke="currentColor" strokeWidth="0.15" />
            <line x1="75" y1="38" x2="35" y2="28" stroke="currentColor" strokeWidth="0.15" />
            <line x1="10" y1="12" x2="18" y2="58" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,1" />
            
            <circle cx="10" cy="12" r="1" className="fill-purple-500/40" />
            <circle cx="35" cy="28" r="1.3" className="fill-orange-500/35 animate-ping" />
            <circle cx="18" cy="58" r="1" className="fill-purple-600/40" />
            <circle cx="55" cy="78" r="1.5" className="fill-pink-500/30" />
            <circle cx="75" cy="38" r="1" className="fill-purple-500/40 animate-pulse" />
          </svg>

          {/* Constellation Mesh Graphic on the Right - matching screenshot style */}
          <svg className="absolute right-[-120px] sm:right-[-60px] top-[10%] w-[420px] h-[800px] text-purple-600/15" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="90" y1="18" x2="58" y2="42" stroke="currentColor" strokeWidth="0.15" strokeDasharray="1,1" />
            <line x1="58" y1="42" x2="82" y2="68" stroke="currentColor" strokeWidth="0.15" />
            <line x1="82" y1="68" x2="48" y2="82" stroke="currentColor" strokeWidth="0.15" />
            <line x1="48" y1="82" x2="28" y2="52" stroke="currentColor" strokeWidth="0.15" />
            <line x1="28" y1="52" x2="58" y2="42" stroke="currentColor" strokeWidth="0.15" />
            <line x1="90" y1="18" x2="82" y2="68" stroke="currentColor" strokeWidth="0.15" />

            <circle cx="90" cy="18" r="1.3" className="fill-purple-500/40 animate-pulse" />
            <circle cx="58" cy="42" r="1" className="fill-pink-500/40" />
            <circle cx="82" cy="68" r="1.5" className="fill-orange-500/35 animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="48" cy="82" r="1" className="fill-purple-600/40" />
            <circle cx="28" cy="52" r="1.3" className="fill-purple-500/40" />
          </svg>
        </div>

        {/* 1. Header Navigation Bar (Screenshot 3, 1, 12 exactly matched) */}
        <header className="relative z-50 w-full max-w-7xl mx-auto px-4 pt-6 shrink-0">
          <div className="w-full bg-[#0e041d]/95 border border-[#251545]/80 rounded-[2rem] px-6 sm:px-8 py-5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
            {/* Left Brand Logo */}
            <div 
              onClick={() => setPortalTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 bg-orange-600/15 border border-orange-500/40 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <Zap className="w-5 h-5 text-orange-500 -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <span className="text-sm sm:text-base font-black tracking-widest text-white italic uppercase flex items-center gap-1.5 leading-none animate__animated animate__fadeIn">
                AUDITAX <span className="text-orange-500 not-italic font-medium">Karma3</span>
              </span>
            </div>

            {/* Center Menu links */}
            <div className="hidden xl:flex items-center gap-6 lg:gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
              <div 
                className="relative"
                onMouseEnter={() => setIsSolutionsMenuOpen(true)}
                onMouseLeave={() => setIsSolutionsMenuOpen(false)}
              >
                <button 
                  type="button"
                  onClick={() => setIsSolutionsMenuOpen(!isSolutionsMenuOpen)}
                  className={cn(
                    "hover:text-orange-400 transition-all cursor-pointer bg-transparent border-none pb-2 pt-1 font-bold tracking-widest flex items-center gap-1",
                    ['solutions', 'orchestration', 'compliance', 'security', 'fleet'].includes(portalTab) ? "text-orange-500 border-b-2 border-orange-500/70" : "text-slate-350"
                  )}
                >
                  {language === 'FR' ? 'SOLUTIONS AI' : 'SOLUTIONS AI'} <span className="text-[8px] text-orange-500 opacity-80 select-none">▼</span>
                </button>

                {isSolutionsMenuOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-[#0e041d]/95 border border-[#251545]/80 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 text-left backdrop-blur-lg">
                    {[
                      { tab: 'solutions', fr: 'AI Analysis Studio', en: 'AI Analysis Studio', descFr: 'Intelligence prédictive', descEn: 'Predictive intelligence' },
                      { tab: 'orchestration', fr: 'Tactical Rule Engine', en: 'Tactical Rule Engine', descFr: 'Flux tactiques de réponse & Playbooks', descEn: 'Tactical playbooks & response graphs' },
                      { tab: 'compliance', fr: 'Cartographie Conformité', en: 'Compliance Mapping', descFr: 'Contrôles réglementaires', descEn: 'Regulatory controls map' },
                      { tab: 'security', fr: 'SecOps Command Center', en: 'SecOps Command Center', descFr: 'Suivi des vulnérabilités & menaces', descEn: 'Active threat surveillance' },
                      { tab: 'fleet', fr: 'Télémétrie Équipements', en: 'Global Fleet Telemetry', descFr: 'Cartographies mondiales direct",', descEn: 'Live devices maps & tracking' },
                    ].map((item) => (
                      <button
                        key={item.tab}
                        type="button"
                        onClick={() => {
                          setPortalTab(item.tab as any);
                          setIsSolutionsMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left p-2 rounded-xl border border-transparent transition-all hover:bg-orange-500/10 hover:border-orange-500/25 flex flex-col cursor-pointer bg-transparent",
                          portalTab === item.tab ? "bg-orange-500/5 border-orange-500/20" : ""
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-wider",
                          portalTab === item.tab ? "text-orange-400" : "text-white"
                        )}>
                          {language === 'FR' ? item.fr : item.en}
                        </span>
                        <span className="text-[8.5px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider font-bold">
                          {language === 'FR' ? item.descFr : item.descEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="button"
                onClick={() => setPortalTab('tarifs')}
                className={cn(
                  "hover:text-orange-400 transition-all cursor-pointer bg-transparent border-none pb-0.5 font-bold tracking-widest",
                  portalTab === 'tarifs' ? "text-orange-500 border-b-2 border-orange-500/70" : "text-slate-350"
                )}
              >
                {language === 'FR' ? 'TARIFS PRO' : 'PRO PRICING'}
              </button>
              
              <button 
                type="button"
                onClick={() => setPortalTab('architecture')}
                className={cn(
                  "hover:text-orange-400 transition-all cursor-pointer bg-transparent border-none pb-0.5 font-bold tracking-widest",
                  portalTab === 'architecture' ? "text-orange-500 border-b-2 border-orange-500/70" : "text-slate-350"
                )}
              >
                ARCHITECTURE
              </button>

              <button 
                type="button"
                onClick={() => setPortalTab('rapports')}
                className={cn(
                  "hover:text-orange-400 transition-all cursor-pointer bg-transparent border-none pb-0.5 font-bold tracking-widest",
                  portalTab === 'rapports' ? "text-orange-500 border-b-2 border-orange-500/70" : "text-slate-350"
                )}
              >
                {language === 'FR' ? 'RAPPORTS' : 'REPORTS'}
              </button>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Language toggle */}
              <button 
                type="button"
                onClick={() => {
                  const nextLang = language === 'FR' ? 'EN' : 'FR';
                  setLanguage(nextLang);
                  showToast(nextLang === 'FR' ? "Portail basculé en Français" : "Portal switched to English", 'success');
                }}
                className="text-[10px] font-bold text-slate-500 tracking-wider hover:text-slate-300 transition-colors uppercase bg-transparent border-none cursor-pointer"
              >
                {language === 'FR' ? <>FR/<span className="text-slate-300">EN</span></> : <><span className="text-slate-300">FR</span>/EN</>}
              </button>

              <button 
                type="button"
                onClick={() => {
                  setIsLandingPortal(false);
                  showToast(language === 'FR' ? "Connexion établie au terminal" : "Connection established to main panel", 'success');
                }}
                className="hidden sm:block text-[10px] font-black uppercase tracking-wider text-white hover:text-orange-400 hover:border-orange-500/30 transition-all cursor-pointer bg-[#05111b] border border-slate-800 px-4 py-2.5 rounded-xl text-center font-bold"
              >
                CONNEXION
              </button>

              <button 
                type="button"
                onClick={() => {
                  setIsLandingPortal(false);
                  showToast(language === 'FR' ? "Démarrage de l'interface d'administration" : "Launching core admin interface", 'success');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-[#051424] bg-orange-500 hover:bg-orange-450 border-none transition-all px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-95 leading-none font-bold"
              >
                {language === 'FR' ? 'DÉMARRER' : 'LAUNCH'}
              </button>
            </div>
          </div>
        </header>

        {/* 2. Main Portal Body view container with AnimatePresence */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex-grow">
          <AnimatePresence mode="wait">
            {portalTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-16 py-8"
              >
                {/* HERO TITLE & TEXT */}
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.1] font-sans"
                  >
                    {language === 'FR' ? (
                      <>
                        Sécurité Militaire. <br />
                        <span className="text-orange-500">Intelligence Artificielle.</span>
                      </>
                    ) : (
                      <>
                        Military Security. <br />
                        <span className="text-orange-500">Artificial Intelligence.</span>
                      </>
                    )}
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm md:text-base text-slate-350 font-medium tracking-wide max-w-2xl mx-auto leading-relaxed"
                  >
                    {language === 'FR' ? (
                      "Karma3: L'avenir de l'intelligence opérationnelle, sécurisé par une technologie de pointe."
                    ) : (
                      "Karma3: The future of operational intelligence, protected by state-of-the-art technology."
                    )}
                  </motion.p>
                </div>

                {/* THE 3 GLOWING GLASS CARDS (Exactly aligned with Image 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 max-w-5xl mx-auto select-none">
                  {[
                    {
                      val: "99.9%",
                      sub: "UPTIME",
                      desc: language === 'FR' ? "Fiabilité Maximale" : "Maximum Reliability",
                    },
                    {
                      val: "ACTIVE",
                      sub: "ENCLAVES",
                      desc: language === 'FR' ? "Isolation & Protection" : "Isolation & Protection",
                    },
                    {
                      val: "AI-DRIVEN",
                      sub: "INSIGHTS",
                      desc: language === 'FR' ? "Analyse Prédictive" : "Predictive Analysis",
                    }
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                      onClick={() => {
                        if (idx === 0) setPortalTab('architecture');
                        else if (idx === 1) setPortalTab('orchestration');
                        else setPortalTab('solutions');
                      }}
                      className="bg-[#0f041f]/75 border border-[#251545]/60 rounded-[2.2rem] p-8 text-center relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-2xl backdrop-blur-md group cursor-pointer"
                    >
                      {/* Left and right thin pulse outline on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Big display metrics */}
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">{card.sub}</span>
                        <div className="text-4xl font-extrabold text-white tracking-tight leading-none group-hover:text-orange-400 transition-colors mt-2 font-black">
                          {card.val}
                        </div>
                      </div>

                      {/* Small status line with Orange indicator line at the bottom */}
                      <div className="space-y-4 text-center">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-350 font-sans italic">{card.desc}</div>
                        <div className="w-16 h-[3px] bg-orange-500 mx-auto rounded-full group-hover:w-28 transition-all duration-300 shadow-[0_0_8px_#f97316]" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sovereign Security Services Overview Section (Image 3 exact match) */}
                <div className="space-y-12 pt-12 pb-6 select-none max-w-6xl mx-auto">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white font-sans">
                      {language === 'FR' ? 'Sovereign Security Services Overview' : 'Sovereign Security Services Overview'}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    {/* CARD 1: COMPLIANCE */}
                    <motion.div
                      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(249,115,22,0.15)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-[#150a29]/90 hover:bg-[#20103b]/95 border border-orange-500/30 hover:border-orange-500 rounded-[2rem] p-8 text-center flex flex-col justify-between min-h-[380px] shadow-2xl relative group overflow-hidden"
                    >
                      {/* Ambient background glow */}
                      <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="space-y-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:text-orange-400 group-hover:bg-orange-500/20 transition-all duration-300">
                          <ShieldCheck className="w-9 h-9" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-[0.25em] text-orange-500 group-hover:text-orange-400 transition-colors">
                          COMPLIANCE
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans text-center max-w-xs">
                          {language === 'FR' 
                            ? "Garantir la conformité réglementaire et la sécurité des données avec des audits automatisés et une surveillance continue."
                            : "Guarantee regulatory compliance and data security with automated audits and continuous round-the-clock monitoring."}
                        </p>
                      </div>

                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setPortalTab('compliance');
                            showToast(language === 'FR' ? "Ouverture de la Cartographie de Conformité" : "Opening Regulatory Compliance Map", 'success');
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-450 active:scale-95 text-[#051424] font-black tracking-widest text-[10px] py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all text-center border-none cursor-pointer leading-none uppercase font-bold"
                        >
                          {language === 'FR' ? 'EN SAVOIR PLUS' : 'LEARN MORE'}
                        </button>
                      </div>
                    </motion.div>

                    {/* CARD 2: ORCHESTRATION */}
                    <motion.div
                      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(249,115,22,0.15)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-[#150a29]/90 hover:bg-[#20103b]/95 border border-orange-500/30 hover:border-orange-500 rounded-[2rem] p-8 text-center flex flex-col justify-between min-h-[380px] shadow-2xl relative group overflow-hidden"
                    >
                      {/* Ambient background glow */}
                      <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="space-y-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:text-orange-400 group-hover:bg-orange-500/20 transition-all duration-300">
                          <Workflow className="w-9 h-9" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-[0.25em] text-orange-500 group-hover:text-orange-400 transition-colors">
                          ORCHESTRATION
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans text-center max-w-xs">
                          {language === 'FR'
                            ? "Optimiser les opérations de sécurité grâce à l'orchestration automatisée des flux de travail et à la réponse aux incidents."
                            : "Optimize security operations through automated workflow orchestration and incident playbook response actions."}
                        </p>
                      </div>

                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setPortalTab('orchestration');
                            showToast(language === 'FR' ? "Ouverture de l'Engin d'Orchestration" : "Opening Orchestration Rule Engine", 'success');
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-450 active:scale-95 text-[#051424] font-black tracking-widest text-[10px] py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all text-center border-none cursor-pointer leading-none uppercase font-bold"
                        >
                          {language === 'FR' ? 'EN SAVOIR PLUS' : 'LEARN MORE'}
                        </button>
                      </div>
                    </motion.div>

                    {/* CARD 3: AI */}
                    <motion.div
                      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(249,115,22,0.15)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-[#150a29]/90 hover:bg-[#20103b]/95 border border-orange-500/30 hover:border-orange-500 rounded-[2rem] p-8 text-center flex flex-col justify-between min-h-[380px] shadow-2xl relative group overflow-hidden"
                    >
                      {/* Ambient background glow */}
                      <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="space-y-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:text-orange-400 group-hover:bg-orange-500/20 transition-all duration-300">
                          <Brain className="w-9 h-9 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-[0.25em] text-orange-500 group-hover:text-orange-400 transition-colors">
                          AI
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans text-center max-w-xs">
                          {language === 'FR'
                            ? "Utiliser l'intelligence artificielle pour la détection proactive des menaces et l'analyse prédictive des risques."
                            : "Leverage artificial intelligence for proactive threat detection and advanced predictive risk analysis."}
                        </p>
                      </div>

                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setPortalTab('solutions');
                            showToast(language === 'FR' ? "Lancement du Studio de Décision Cognitive AI" : "Launching AI Analysis Studio", 'success');
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-450 active:scale-95 text-[#051424] font-black tracking-widest text-[10px] py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all text-center border-none cursor-pointer leading-none uppercase font-bold"
                        >
                          {language === 'FR' ? 'EN SAVOIR PLUS' : 'LEARN MORE'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* DYNAMIC METRIC ACCELERATION CARD */}
                <div className="max-w-4xl mx-auto mt-6 bg-slate-950/40 p-6 rounded-[2rem] border border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0 select-none">
                      <Brain className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        {language === 'FR' ? "Passerelle Cognitive Intelligente" : "Cognitive Intelligence Gateway"}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {language === 'FR' ? (
                          "Naviguez vers les enclaves sécurisées de calcul et explorez nos modèles prédictifs haute-densité."
                        ) : (
                          "Navigate toward secure processing enclaves and explore our high-density predictive models."
                        )}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPortalTab('solutions')}
                    className="sunset-gradient text-white px-6 py-3 rounded-2xl font-black text-[10px] bg-orange-500 hover:bg-orange-450 uppercase tracking-widest flex items-center gap-2 hover:scale-102 transition-transform shadow-lg shadow-orange-500/20 border-none cursor-pointer"
                  >
                    {language === 'FR' ? "LANCER L'ANALYSE" : "START ANALYSIS STUDIO"} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {portalTab === 'solutions' && (
              <motion.div 
                key="solutions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                {/* Header specifically for solutions page matching Image 1 */}
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight flex items-center justify-center gap-3">
                    <span className="text-white">Karma3 </span>
                    <span className="text-orange-500">AI</span>
                    <span className="text-white"> Analysis Studio</span>
                  </h2>
                </div>
                <Karma3AIAnalysisStudio onNotify={(m, t) => showToast(m, t === 'warn' ? 'error' : 'success')} />
              </motion.div>
            )}

            {portalTab === 'orchestration' && (
              <motion.div 
                key="orchestration"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                {/* Header specifically for Tactical Response / Orchestration page matching screenshot */}
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight flex items-center justify-center gap-3">
                    <span className="text-white">Tactical Response </span>
                    <span className="text-orange-500">Rule Engine</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium max-w-2xl mx-auto">
                    {language === 'FR' ? "Définir des réponses tactiques automatisées en cas de violations de politique souveraine." : "Define automated tactical responses to sovereign policy breaches."}
                  </p>
                </div>
                <TacticalResponseRuleEngine onNotify={(m) => showToast(m, 'success')} />
              </motion.div>
            )}

            {portalTab === 'tarifs' && (
              <motion.div 
                key="tarifs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                {/* Header for Tarifs page */}
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight flex items-center justify-center gap-3">
                    <span className="text-white">Tarifs </span>
                    <span className="text-orange-500">PRO</span>
                    <span className="text-white"> & Sovereign Licensing</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium max-w-2xl mx-auto">
                    Configurez vos quotas de tokens, activez des abonnements mensuels réutilisables ou simulez des flux de facturation sécurisés par Stripe.
                  </p>
                </div>
                <StripeMonetizationSection onNotify={(m) => showToast(m, 'success')} theme={theme} />
              </motion.div>
            )}

            {portalTab === 'rapports' && (
              <motion.div 
                key="rapports"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                {/* Header for Rapports page */}
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight flex items-center justify-center gap-3">
                    <span className="text-white">Rapports </span>
                    <span className="text-orange-500">Souverains</span>
                    <span className="text-white"> d&apos;Audit</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium max-w-2xl mx-auto">
                    Consultez, filtrez et exportez au format sécurisé les audits d&apos;intégrité, de conformité et de rotation de clés de sécurité.
                  </p>
                </div>
                <SovereignReportsSection onNotify={(m, t) => showToast(m, t === 'warn' ? 'error' : 'success')} />
              </motion.div>
            )}

            {portalTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-sans flex items-center justify-center gap-3">
                    <Activity className="w-8 h-8 text-orange-500 animate-pulse" />
                    Technical System Map
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">Visualizing cryptographic nodes, database layers and container routing parameters.</p>
                </div>
                <Karma3ArchitectureOverview onNotify={(m) => showToast(m, 'success')} />
              </motion.div>
            )}

            {portalTab === 'compliance' && (
              <motion.div 
                key="compliance"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-sans flex items-center justify-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-orange-500 animate-pulse" />
                    {language === 'FR' ? "Cartographie de Conformité Réglementaire" : "Regulatory Compliance Mapping"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'FR' 
                      ? "Visualisation et administration en temps réel des règles souveraines de sécurité et cadres réglementaires militarisés."
                      : "Real-time visualization and management of sovereign security rules and militarized regulatory frameworks."
                    }
                  </p>
                </div>
                <ComplianceMappingSection onNotify={(m) => showToast(m, 'success')} />
              </motion.div>
            )}

            {portalTab === 'fleet' && (
              <motion.div 
                key="fleet"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-sans flex items-center justify-center gap-3">
                    <Truck className="w-8 h-8 text-orange-500 animate-pulse" />
                    {language === 'FR' ? "Télémétrie Globale des Équipements" : "Global Equipment Fleet Telemetry"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'FR'
                      ? "Cartographies géographiques et visualisations 3D orbitale du statut de sécurité des terminaux mondiaux."
                      : "Geographic mappings and orbital 3D visualizations of global endpoint security metrics."
                    }
                  </p>
                </div>
                <FleetMonitoring onNotify={(m) => showToast(m, 'success')} />
              </motion.div>
            )}

            {portalTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                <div className="text-center space-y-3 pb-6">
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-sans flex items-center justify-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-orange-500 animate-pulse" />
                    {language === 'FR' ? "Sovereign SecOps Command Center" : "Sovereign SecOps Command Center"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'FR'
                      ? "Surveillance en temps réel des menaces actives, scores de conformité instantanés et gestion des menaces."
                      : "Real-time surveillance of active threats, live compliance metrics and incident response tracking."
                    }
                  </p>
                </div>
                <SecurityCommandCenter onNotify={(m) => showToast(m, 'success')} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="relative z-10 select-none pb-12 mt-20 border-t border-slate-900/60 max-w-7xl mx-auto px-4 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center shrink-0">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 font-mono">
            Karma3 PLATFORM • CELESTIAL PORTAL
          </div>
          <div className="text-[10px] text-slate-600 font-medium">
            © {new Date().getFullYear()} CELESTIAL RISK INC. SECURE ENCLAVE INFRASTRUCTURE LABS.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen font-sans selection:bg-sunset-orange selection:text-white relative", 
      !!user 
        ? (theme === 'dark' 
            ? "theme-dark bg-gradient-to-br from-[#0c041f] via-[#080216] to-[#120732] text-slate-100" 
            : theme === 'high-contrast'
              ? "theme-light theme-high-contrast bg-white text-black font-semibold"
              : "theme-light bg-[#f8fafc] text-slate-900") 
        : "bg-sunset-surface text-[#2d2d2d]"
    )}>
      {/* Strategic Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sunset-orange/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      {/* PC Fixed Left Sidebar (Only visible when user is Authenticated & on screens >= xl) */}
      {user && !loading && activeTab !== 'intelligence' && (
        <aside style={{ width: '200px' }} className="hidden xl:flex fixed inset-y-0 left-0 bg-[#080d16] border-r border-[#1c2e46]/60 flex-col py-8 px-6 z-50 justify-between shadow-2xl backdrop-blur-md">
          <div className="space-y-8 overflow-y-auto no-scrollbar pb-6 flex-1">
            {/* Sidebar Logo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 shrink-0 cursor-pointer px-2"
              onClick={() => setActiveTab('summary')}
            >
               <div className="w-10 h-10 bg-blue-500/10 border border-[#0ea5e9]/30 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10 rotate-12 transition-all hover:rotate-0">
                  <ShieldCheck className="w-6 h-6 text-[#0ea5e9] -rotate-12" />
               </div>
               <div className="flex flex-col text-left">
                  <span className="text-xl font-black italic text-white tracking-tighter leading-none">Karma3</span>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[7.5px] font-black text-[#0ea5e9] uppercase tracking-[0.2em]">Sovereign Elite</span>
                  </div>
               </div>
            </motion.div>

            {/* Back to Public Portal Shortcut */}
            <div className="px-2">
              <button
                type="button"
                onClick={() => setIsLandingPortal(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-orange-600/10 border border-orange-500/20 text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-slate-950 hover:border-orange-400 transition-all shadow-md cursor-pointer select-none"
              >
                <ArrowLeft className="w-3.5 h-3.5 animate-pulse" /> REVENIR AU PORTAIL
              </button>
            </div>

            {/* Sidebar Menu Links - Grouped & Highly Structured */}
            <div className="space-y-6">
              {categories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-1.5">
                  <span className="text-[8.5px] font-black text-slate-400 tracking-[0.25em] uppercase pl-5 block leading-none">
                    {cat.title}
                  </span>
                  <nav className="flex flex-col gap-0.5">
                    {cat.items.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={cn(
                          "relative flex items-center gap-3.5 px-5 py-2.5 rounded-[1.2rem] text-[9.5px] font-black uppercase tracking-[0.12em] transition-all overflow-hidden group w-full text-left select-none outline-none",
                          activeTab === tab.id ? "text-slate-950 font-black" : "text-slate-400 hover:text-slate-200 font-medium"
                        )}
                      >
                        {activeTab === tab.id && (
                           <motion.div 
                             layoutId="nav-pill-sidebar"
                             className="absolute inset-0 border border-blue-400/30 rounded-[1.2rem] shadow-lg shadow-blue-500/10"
                             style={{ backgroundColor: '#bad1ff' }}
                           />
                        )}
                        <tab.icon className={cn("w-4 h-4 relative z-10 transition-colors", activeTab === tab.id ? "text-slate-950" : "text-slate-500 group-hover:text-slate-300")} />
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer User Area */}
          <div className="border-t border-[#1c2e46]/60 pt-4 pb-1 shrink-0 flex flex-col gap-3 w-full">
             <div className="flex items-center gap-3 px-2 cursor-pointer group w-full" onClick={handleProfileClick}>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-[#1c2e46]/60 p-0.5 overflow-hidden shadow-md group-hover:border-[#0ea5e9]/40 transition-all shrink-0">
                  {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-[10px]" referrerPolicy="no-referrer" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-black text-xs uppercase italic bg-[#0ea5e9]/25">{user?.displayName?.charAt(0) || "JD"}</div>
                  )}
                </div>
                <div className="flex flex-col truncate text-left min-w-0 flex-grow">
                  <span className="text-[10px] font-black italic text-white leading-tight truncate group-hover:text-[#0ea5e9] transition-colors">{user?.displayName?.toUpperCase() || "JANE DOE"}</span>
                  <span className="text-[7.5px] font-black text-[#0ea5e9] uppercase tracking-[0.15em] mt-0.5">Compliance_Officer</span>
                </div>
             </div>

             <button
               onClick={() => setIsDiagnosticModalOpen(true)}
               type="button"
               title={language === 'FR' ? "Lancer le diagnostic d'intégrité" : "Run system integrity diagnostic"}
               className="mx-2 py-2 px-3 text-slate-350 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9]/45 transition-all bg-[#090e17] border border-[#1e2f47] rounded-xl flex items-center justify-center gap-2 font-black text-[8px] uppercase tracking-[0.16em] cursor-pointer"
             >
               <ShieldAlert className="w-3.5 h-3.5 text-emerald-450 animate-pulse" />
               SYSTEM INTEGRITY
             </button>

             <div className="grid grid-cols-2 gap-2 px-2 w-full mt-2">
                <div className="relative w-full">
                  <button 
                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                    type="button"
                    title="Choisir Thème"
                    className="w-full py-2 px-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9]/30 transition-all bg-[#0d1520] border border-[#1c2e46]/60 rounded-xl flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    {theme === 'dark' ? (
                       <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    ) : theme === 'high-contrast' ? (
                       <Eye className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    ) : (
                       <Sun className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="text-[8px] font-mono font-bold tracking-wider uppercase">THEME</span>
                  </button>
                  {isThemeMenuOpen && (
                    <div className="absolute bottom-11 left-0 w-48 bg-[#090d16] border border-[#1c2e46]/80 rounded-xl shadow-2xl p-1.5 z-[999] flex flex-col gap-0.5 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <span className="text-[7.5px] font-black uppercase text-[#0ea5e9] tracking-[0.15em] opacity-80 px-2 py-1 block">Sélecteur de Thème</span>
                      <button
                        onClick={() => selectTheme('dark')}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all hover:bg-slate-80/50",
                          theme === 'dark' ? "text-blue-400 bg-blue-500/10" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Cyber Obsidian</span>
                      </button>
                      <button
                        onClick={() => selectTheme('light')}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all hover:bg-slate-80/50",
                          theme === 'light' ? "text-amber-500 bg-amber-500/10" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Slate Minimal</span>
                      </button>
                      <button
                        onClick={() => selectTheme('high-contrast')}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all hover:bg-slate-80/50",
                          theme === 'high-contrast' ? "text-emerald-500 bg-emerald-500/10 font-bold" : "text-slate-500 hover:text-white"
                        )}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>WCAG Contrast</span>
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => signOut(auth)}
                  type="button"
                  title="Sign Out"
                  className="py-2 px-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all bg-[#0d1520] border border-[#1c2e46]/60 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">EXIT</span>
                </button>
             </div>
          </div>
        </aside>
      )}

      {/* Top Navbar */}
      <nav className={cn(
        "fixed top-0 inset-x-0 h-20 md:h-24 bg-[#080d16]/95 border-b border-[#1c2e46]/60 z-50 px-4 md:px-8 flex items-center justify-between shadow-2xl",
        activeTab === 'intelligence' ? "hidden" : (user ? "xl:hidden" : "")
      )}>
        <div className="flex items-center gap-12 overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 shrink-0 cursor-pointer"
            onClick={() => setActiveTab('summary')}
          >
             <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 border border-[#0ea5e9]/30 rounded-2xl flex items-center justify-center shadow-lg rotate-12 transition-all hover:rotate-0">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#0ea5e9] -rotate-12" />
             </div>
             <div className="flex flex-col text-left">
                <span className="text-xl md:text-2xl font-black italic text-white tracking-tighter leading-none">Karma3</span>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[8px] md:text-[10px] font-black text-[#0ea5e9] uppercase tracking-[0.3em] font-mono">Sovereign Elite</span>
                </div>
             </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
           {user ? (
              <>
                <div className="hidden md:flex items-center gap-4 pr-6 border-r border-[#1c2e46]/60">
                    <div className="text-right flex flex-col">
                      <span className="text-[10px] font-black italic text-white leading-none uppercase">{user.displayName?.toUpperCase()}</span>
                      <span className="text-[8px] font-black text-[#0ea5e9] uppercase tracking-[1.5px] mt-1.5 font-mono">Compliance_Officer</span>
                    </div>
                    <motion.div 
                      onClick={handleProfileClick}
                      whileHover={{ scale: 1.05 }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-900 border border-[#1c2e46]/60 p-0.5 overflow-hidden shadow-2xl cursor-pointer"
                    >
                      {user.photoURL ? (
                          <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-[14px]" referrerPolicy="no-referrer" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-black text-xs uppercase bg-[#0ea5e9]/25">{user.displayName?.charAt(0) || "JD"}</div>
                      )}
                    </motion.div>
                </div>
                <button 
                  onClick={() => setIsDiagnosticModalOpen(true)}
                  title={language === 'FR' ? "Diagnostic d'Intégrité Système" : "System Integrity Diagnostics"}
                  className="p-3 text-slate-350 hover:text-emerald-400 transition-colors bg-[#0d1520] border border-[#1c2e46]/60 rounded-2xl mr-1 flex items-center justify-center shrink-0"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-450 animate-pulse" />
                </button>
                <button 
                  onClick={toggleTheme}
                  title={theme === "dark" ? "Passer au thème clair (Slate Minimal)" : theme === "light" ? "Passer au thème haute accessibilité (WCAG AAA)" : "Passer au thème Cyber Obsidian"}
                  className="p-3 text-slate-300 hover:text-blue-400 transition-colors bg-[#0d1520] border border-[#1c2e46]/60 rounded-2xl mr-1 flex items-center justify-center shrink-0"
                >
                  {theme === 'dark' ? (
                     <Moon className="w-5 h-5 text-indigo-400" />
                  ) : theme === 'high-contrast' ? (
                     <Eye className="w-5 h-5 text-emerald-500 animate-pulse" />
                  ) : (
                     <Sun className="w-5 h-5 text-amber-500" />
                  )}
                </button>
                <button 
                  onClick={() => signOut(auth)}
                  className="p-3 text-slate-450 hover:text-red-500 transition-colors bg-[#0d1520] border border-[#1c2e46]/60 rounded-2xl hover:bg-red-502/10"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-3 text-slate-350 hover:text-[#0ea5e9] transition-colors bg-[#0d1520] border border-[#1c2e46]/60 rounded-2xl xl:hidden flex items-center justify-center shrink-0"
                  title="Menu de navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </>
           ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={signInWithGoogle}
                className="px-8 py-4 bg-[#0ea5e9]/10 border border-[#0ea5e9]/40 text-[#0ea5e9] hover:bg-[#0ea5e9]/20 font-black text-[10px] uppercase tracking-[0.3em] italic rounded-3xl shadow-2xl shadow-blue-500/5 flex items-center gap-3 transition-all"
              >
                <LogIn className="w-4 h-4" /> Initialize_Session
              </motion.button>
           )}
        </div>
      </nav>

      <main 
        style={user && activeTab !== 'intelligence' ? { paddingLeft: '240px' } : undefined}
        className={cn(
          "transition-all duration-300",
          activeTab === 'intelligence' 
            ? "p-0 max-w-none w-screen h-screen overflow-hidden fixed inset-0 z-50 bg-[#070b13]" 
            : cn(
                "pb-20 mx-auto min-h-screen px-8 md:px-12",
                user ? "pt-24 xl:pt-12 max-w-[1700px]" : "pt-24 max-w-[1400px]"
              )
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className={cn("w-full", activeTab === 'intelligence' && "h-full")}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-20 h-20 sunset-gradient rounded-[2rem] rotate-45 animate-spin flex items-center justify-center">
                   <ShieldAlert className="w-10 h-10 text-white -rotate-45" />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Synchronizing Karma3...</div>
              </div>
            ) : !user ? (
               <div className="w-full max-w-lg mx-auto bg-[#090d16]/95 border border-[#1b314e]/80 rounded-[2.5rem] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-slate-200 backdrop-blur-3xl">
                  <div className="text-center space-y-3 mb-6">
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-500 rounded-full text-[9px] font-black uppercase tracking-[0.2em] font-mono">
                       <ShieldCheck className="w-3 h-3" /> Secure Gateway Connection
                     </div>
                     <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase italic">Karma3 Sovereign Hub</h2>
                     <p className="text-xs text-slate-400 font-medium font-mono">
                       {language === 'FR' ? "AUTHENTIFICATION DIRECTE SUR CLOUD SOUVERAIN" : "SOVEREIGN CLOUD DIRECT AUTHENTICATION"}
                     </p>
                  </div>

                  {/* Dual Tab Controller */}
                  <div className="grid grid-cols-2 gap-1 bg-[#05080e] p-1 rounded-2xl border border-[#1b2d45] mb-6">
                    <button
                      type="button"
                      onClick={() => { setAuthTab('login'); setAuthError(null); setAuthSuccess(null); }}
                      className={cn(
                        "py-3 rounded-xl font-black text-[10.5px] uppercase tracking-wider transition-all cursor-pointer bg-transparent border-0",
                        authTab === 'login' ? "bg-amber-500 text-black shadow-lg font-bold" : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {language === 'FR' ? 'Connexion' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthTab('register'); setAuthError(null); setAuthSuccess(null); }}
                      className={cn(
                        "py-3 rounded-xl font-black text-[10.5px] uppercase tracking-wider transition-all cursor-pointer bg-transparent border-0",
                        authTab === 'register' ? "bg-amber-500 text-black shadow-lg font-bold" : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {language === 'FR' ? 'Créer un Compte' : 'Register'}
                    </button>
                  </div>

                  {/* Forms */}
                  <form onSubmit={authTab === 'login' ? handleEmailLogin : handleEmailRegister} className="space-y-4">
                    {authTab === 'register' && (
                      <div className="space-y-1 text-left">
                        <label className="block text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono">
                          {language === 'FR' ? "Nom Complet (Optionnel)" : "Full Name (Optional)"}
                        </label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Admiral Vance"
                          className="w-full bg-[#05080e] border border-[#121f31] focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    )}

                    <div className="space-y-1 text-left">
                      <label className="block text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono">
                        {language === 'FR' ? "Adresse E-mail" : "Email Address"}
                      </label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="operator@karma3.internal"
                        required
                        className="w-full bg-[#05080e] border border-[#121f31] focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono">
                        {language === 'FR' ? "Mot de Passe (min 6)" : "Password (min 6)"}
                      </label>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#05080e] border border-[#121f31] focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono"
                      />
                    </div>

                    {authTab === 'register' && (
                      <div className="space-y-1 text-left">
                        <label className="block text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono">
                          {language === 'FR' ? "Confirmer le Mot de Passe" : "Confirm Password"}
                        </label>
                        <input
                          type="password"
                          value={authConfirmPassword}
                          onChange={(e) => setAuthConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required={authTab === 'register'}
                          className="w-full bg-[#05080e] border border-[#121f31] focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    )}

                    {authError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] tracking-wide font-mono rounded-xl text-left">
                        ⚠️ [AUTHENTICATION_DRIP] - {authError}
                      </div>
                    )}

                    {authSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] tracking-wide font-mono rounded-xl text-left">
                        ✓ [SESSION_AUTHORIZED] - {authSuccess}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-amber-500 text-black py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-amber-400 transition-all cursor-pointer flex items-center justify-center gap-2 border-0"
                    >
                      {authLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" /> {authTab === 'login' ? (language === 'FR' ? 'ÉTABLIR LA SESSION' : 'ESTABLISH SESSION') : (language === 'FR' ? 'CRÉER ET INITIALISER LE COMPTE' : 'REGISTER & PROCEED')}
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-5">
                    <div className="absolute w-full border-t border-slate-800"></div>
                    <span className="relative px-3 bg-[#090d16] text-[8.5px] uppercase font-black text-slate-500 tracking-[0.2em] select-none">OR</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="flex items-center justify-center gap-2 p-3 bg-[#05080e] border border-[#121f31] hover:bg-slate-900/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#cbd5e1] cursor-pointer transition-all"
                    >
                      <svg className="w-3.5 h-3.5 mr-0.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" strokeWidth="0" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Google Sync
                    </button>

                    <button
                      type="button"
                      onClick={enableDemoMode}
                      className="flex items-center justify-center gap-2 p-3 bg-[#05080e] border border-[#121f31] hover:bg-slate-900/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#cbd5e1] cursor-pointer transition-all"
                    >
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      {language === 'FR' ? 'Accès Démo' : 'Demo State'}
                    </button>
                  </div>

                  {/* Diagnostic Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-900/50 text-[8.5px] font-mono text-slate-500 flex flex-col gap-0.5 text-left select-none uppercase tracking-widest">
                     <div>● FIREBASE CONFIG STAT: STABLE</div>
                     <div>● PROTOCOL ENGINE: V2 ACTIVE</div>
                  </div>
               </div>
            ) : (
              <>
                <AnimatePresence>
                  {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </AnimatePresence>

                {/* Mobile / Tablet Navigation Drawer with AnimatePresence */}
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 z-[100] xl:hidden pointer-events-auto"
                      />
                      <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 w-[290px] sm:w-[325px] bg-[#080d16]/95 border-r border-[#1c2e46]/60 text-slate-200 z-[101] flex flex-col py-8 px-6 justify-between shadow-2xl xl:hidden"
                      >
                         <div className="space-y-8 overflow-y-auto no-scrollbar pb-6 flex-1">
                             {/* Logo / Header */}
                             <div className="flex items-center justify-between">
                                <div 
                                  className="flex items-center gap-3 cursor-pointer text-left"
                                  onClick={() => { setActiveTab('summary'); setIsMobileMenuOpen(false); }}
                                >
                                   <div className="w-9 h-9 bg-blue-500/10 border border-[#0ea5e9]/30 rounded-xl flex items-center justify-center shadow-md rotate-12">
                                      <ShieldCheck className="w-5 h-5 text-[#0ea5e9] -rotate-12" />
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-lg font-black italic text-white tracking-tighter leading-none">Karma3</span>
                                      <span className="text-[6.5px] font-black text-[#0ea5e9] uppercase tracking-[0.3em] mt-0.5 font-mono">Sovereign Elite</span>
                                   </div>
                                </div>
                                <button 
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="p-2 text-slate-400 hover:text-white transition-all bg-[#111a27] border border-[#1c2e46]/60 rounded-xl"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                             </div>

                             {/* Grouped Links */}
                             <div className="space-y-6">
                                {categories.map((cat, catIdx) => (
                                  <div key={catIdx} className="space-y-2">
                                     <span className="text-[8.5px] font-black text-[#0ea5e9]/70 tracking-[0.2em] uppercase pl-2 block leading-none text-left font-mono">{cat.title}</span>
                                     <nav className="flex flex-col gap-1">
                                       {cat.items.map((tab) => {
                                         const isActive = activeTab === tab.id;
                                         return (
                                           <button
                                             key={tab.id}
                                             onClick={() => {
                                               setActiveTab(tab.id as TabType);
                                               setIsMobileMenuOpen(false);
                                             }}
                                             className={cn(
                                               "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-[0.12em] transition-all w-full text-left select-none",
                                               isActive ? "text-slate-950 bg-[#bad1ff] border border-blue-400/30 shadow-md font-black" : "text-slate-400 hover:text-slate-205 font-medium"
                                             )}
                                           >
                                             <tab.icon className={cn("w-3.5 h-3.5", isActive ? "text-slate-950" : "text-slate-500")} />
                                             <span>{tab.label}</span>
                                           </button>
                                         );
                                       })}
                                     </nav>
                                  </div>
                                ))}
                             </div>
                         </div>

                         {/* Mobile User Profile Footer inside Drawer */}
                         <div className="border-t border-[#1c2e46]/60 pt-6 shrink-0">
                             <div className="flex items-center justify-between gap-2 px-2 flex-wrap">
                                <div 
                                  onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}
                                  className="flex items-center gap-3 cursor-pointer group flex-grow min-w-0"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-[#1c2e46]/60 p-0.5 overflow-hidden shadow-md shrink-0">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-[8px]" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-black text-xs">{user.displayName?.charAt(0)}</div>
                                    )}
                                  </div>
                                  <div className="flex flex-col truncate">
                                    <span className="text-[10px] font-black italic text-white leading-none truncate">{user.displayName?.toUpperCase()}</span>
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 truncate">Compliance_Officer</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => { signOut(auth); setIsMobileMenuOpen(false); }}
                                  title="Sign Out"
                                  className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-[#0d1520] border border-[#1c2e46]/60 rounded-xl hover:bg-red-500/10"
                                >
                                  <LogOut className="w-3.5 h-3.5" />
                                </button>
                             </div>
                          </div>
                      </motion.aside>
                    </>
                  )}
                </AnimatePresence>

                {/* Active Section Header bar on Mobile and Tablet (< xl) */}
                {activeTab !== 'intelligence' && (() => {
                  const activeTabObj = tabs.find(t => t.id === activeTab);
                  return (
                    <div className="xl:hidden mb-8 p-5 bg-[#0d1520]/80 border border-[#1c2e46]/60 rounded-[2rem] shadow-2xl flex items-center justify-between select-none">
                      <div className="space-y-1 text-left">
                        <span className="text-[8px] font-black text-[#0ea5e9] tracking-[0.2em] uppercase block leading-none font-mono">Module Actuel</span>
                        <div className="flex items-center gap-2 pt-0.5">
                          {activeTabObj && <activeTabObj.icon className="w-4 h-4 text-[#0ea5e9]" />}
                          <h2 className="text-xs font-black italic uppercase tracking-wider text-white leading-none">
                            {activeTabObj?.label}
                          </h2>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="px-4 py-2 bg-blue-500/10 border border-[#0ea5e9]/50 hover:bg-[#0ea5e9]/25 text-[#0ea5e9] text-[9px] font-black uppercase tracking-[0.14em] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Menu className="w-3.5 h-3.5" /> Choisir Rubrique
                      </button>
                    </div>
                  );
                })()}

                {/* Sovereign Device Karma3 V2 High-Stature Components */}
                {activeTab === 'summary' && <Karma3MainDashboard onNotify={showToast} theme={theme} />}
                {activeTab === 'fleet' && <FleetMonitoring onNotify={showToast} />}
                {activeTab === 'inventory' && <DeviceInventoryList onNotify={showToast} />}
                {activeTab === 'security' && <SecurityCommandCenter onNotify={showToast} />}
                {activeTab === 'rule-engine' && <TacticalResponseRuleEngine onNotify={showToast} />}
                {activeTab === 'scripts' && <Karma3ScriptLibrary onNotify={showToast} theme={theme} />}
                {activeTab === 'architecture' && <Karma3ArchitectureOverview onNotify={showToast} />}
                {activeTab === 'support' && <Karma3SupportCenter onNotify={showToast} />}
                {activeTab === 'profile' && <Karma3ProfileSettings onNotify={showToast} theme={theme} />}

                {/* AuditLab Support Routes */}
                {activeTab === 'sante' && <SanteConnectSection onNotify={showToast} />}
                {activeTab === 'services' && <PlanChirurgicalSection data={data} onNotify={showToast} />}
                {activeTab === 'multitenancy' && <MultiTenancySection onNotify={showToast} />}
                {activeTab === 'monetization' && <StripeMonetizationSection onNotify={showToast} theme={theme} />}
                {activeTab === 'dirtydozen' && <DirtyDozenSection onNotify={showToast} theme={theme} />}
                {activeTab === 'integrations' && <IntegrationHubSection onNotify={showToast} />}
                {activeTab === 'gmail' && <GmailSentinelSection onNotify={showToast} />}
                {activeTab === 'sheets' && <SheetsSentinelSection onNotify={showToast} theme={theme} />}
                {activeTab === 'karma3' && <Karma3Hub onNotify={showToast} theme={theme} />}
                {activeTab === 'connect' && <BackendConnectSection onNotify={showToast} />}
                {activeTab === 'academy' && <TechnicalAcademySection onNotify={showToast} />}
                {activeTab === 'config' && <GovernanceSection data={data} onNotify={showToast} onAddDocument={addDocument} onRemoveDocument={removeDocument} />}
                {activeTab === 'org' && <ComplianceMappingSection onNotify={showToast} />}
                {activeTab === 'bastion' && <BastionAccessSection onNotify={showToast} />}
                {activeTab === 'subscribers' && (
                  <SubscribersManagementSection 
                    data={data} 
                    onNotify={showToast} 
                    onAddSubscriber={addSubscriber} 
                    onRemoveSubscriber={removeSubscriber} 
                    onUpdateSubscriber={updateSubscriber} 
                    theme={theme}
                  />
                )}
                {activeTab === 'admin' && <ConfigSection data={data} actions={actions} onNotify={showToast} />}
                {activeTab === 'intelligence' && <Karma3AISection data={data} onNotify={showToast} onExit={() => setActiveTab('summary')} />}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {activeTab !== 'intelligence' && (
          <footer className="mt-32 pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
             <div className="flex flex-col gap-2">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 italic">Karma3 – SOLAR GLOW OS</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">© {new Date().getFullYear()} ELITE COMPLIANCE & FINANCIAL RISK SYSTEMS</div>
             </div>
             <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                <a href="#" className="hover:text-sunset-orange transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-sunset-orange transition-colors">Digital Integrity</a>
                <a href="#" className="hover:text-sunset-orange transition-colors">Core Nodes</a>
             </div>
          </footer>
        )}
      </main>

      <SystemIntegrityModal 
        isOpen={isDiagnosticModalOpen} 
        onClose={() => setIsDiagnosticModalOpen(false)} 
        socketConnected={isSocketConnected} 
        language={language}
      />
    </div>
  );
}

const TechnicalAcademySection = ({ onNotify }: { onNotify: (m: string) => void }) => {
  const modules = [
    {
      id: 'M1',
      title: 'Security & Field Mastery',
      icon: ShieldCheck,
      color: 'bg-emerald-500',
      points: ['Civil & Criminal Liability', 'HSE On-site standards', 'PPE/EPC rigorous compliance']
    },
    {
      id: 'M2',
      title: 'Consignment Expertise',
      icon: Zap,
      color: 'bg-sunset-orange',
      points: ['Separation & Condamnation', 'VAT (Absence of Tension) Protocol', 'Legal signing authority']
    },
    {
      id: 'M3',
      title: 'Operations & Quality',
      icon: Clock,
      color: 'bg-blue-500',
      points: ['Time-to-fix optimization', 'Customer comms protocol', 'Site restoration excellence']
    },
    {
      id: 'M4',
      title: 'Reporting & Data Sync',
      icon: FileText,
      color: 'bg-slate-900',
      points: ['Facts → Causes → Results', 'REDAL Platform Integration', 'Regulatory Archiving']
    }
  ];

  const roadmap = [
    { step: 'Evaluation', duration: 'W1', desc: 'Skills mapping & individual gaps test.', icon: Search, color: 'bg-blue-500' },
    { step: 'Workshops', duration: 'W2-4', desc: 'Practical coaching & field immersion.', icon: Brain, color: 'bg-sunset-orange' },
    { step: 'Certification', duration: 'Final', desc: 'Technical jury & autonomy validation.', icon: Award, color: 'bg-emerald-500' }
  ];

  return (
    <div id="academy-view" className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
           <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest italic inline-block">
              REF: PRDF-TEC-2026-002
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.85]">
             Technical <br/><span className="text-sunset-orange">Academy</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic underline decoration-sunset-orange/30 decoration-4 underline-offset-8">Strategic Professionalization & Autonomy Program</p>
        </div>
        <div className="flex gap-4">
           <DownloadPDFButton targetId="academy-view" fileName="Karma3-Professionalization-Program" iconOnly onEmailSent={onNotify} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-12">
            <div className="p-6 md:p-12 bg-slate-900 rounded-3xl md:rounded-[4rem] relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-12">
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,77,0,0.1),transparent_70%)] pointer-events-none" />
               <div className="flex-1 space-y-8 relative z-10">
                  <div className="space-y-2">
                     <span className="text-[10px] font-black text-sunset-orange uppercase tracking-[0.5em] italic">Institutional Directive</span>
                     <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                       The Shift: <br/><span className="text-sunset-orange">Executor to Expert</span>
                     </h2>
                  </div>
                  <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-2xl">
                    "To ensure operational excellence, we must delegate decision-making power back to the field experts. This professionalization program is the shield protecting both the agent and the organization."
                  </p>
                  <div className="flex items-center gap-6">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white italic">
                              {i}
                           </div>
                        ))}
                     </div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Modules Validated</span>
                  </div>
               </div>
               <div className="w-full md:w-80 grid grid-cols-1 gap-4 relative z-10">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                     <div className="text-[10px] font-black text-sunset-orange uppercase tracking-widest mb-2">Target Integrity</div>
                     <div className="text-3xl font-black text-white italic tracking-tighter">99.8%</div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                     <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Autonomy Delta</div>
                     <div className="text-3xl font-black text-white italic tracking-tighter">+45%</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="xl:col-span-8">
            <div className="p-6 md:p-12 bg-white border border-slate-100 rounded-3xl md:rounded-[4rem] shadow-2xl space-y-12 h-full relative overflow-hidden">
               <div className="flex items-center justify-between relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase leading-none">Excellence Gear: The 4 Modules</h3>
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                     <Cpu className="w-6 h-6" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {modules.map((m) => (
                     <motion.div 
                        key={m.id} 
                        whileHover={{ y: -5 }}
                        className="p-5 md:p-8 bg-slate-50 rounded-3xl md:rounded-[3rem] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:border-sunset-orange/20 transition-all duration-500"
                     >
                        <div className="flex items-center justify-between mb-6">
                           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-current/10", m.color)}>
                              <m.icon className="w-7 h-7" />
                           </div>
                           <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">{m.id}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 italic leading-tight group-hover:text-sunset-orange transition-colors">{m.title}</h4>
                        <div className="space-y-3">
                           {m.points.map((p, i) => (
                              <div key={i} className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-sunset-orange transition-colors" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase italic leading-tight tracking-wide">{p}</span>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>

         <div className="xl:col-span-4">
            <div className="p-6 md:p-12 sunset-gradient rounded-3xl md:rounded-[4rem] shadow-2xl space-y-12 text-white h-full relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.2),transparent_70%)] pointer-events-none" />
               <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl font-black italic tracking-tight uppercase leading-none">OS Roadmap</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Sequential Lifecycle</span>
               </div>
               
               <div className="space-y-8 relative z-10">
                  {roadmap.map((step, i) => (
                     <div key={i} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                           <div className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-sunset-orange transition-all duration-500">
                              <step.icon className="w-6 h-6" />
                           </div>
                           {i !== roadmap.length - 1 && <div className="w-0.5 flex-1 bg-white/20 my-2" />}
                        </div>
                        <div className="space-y-2 py-1">
                           <div className="flex items-center gap-3">
                              <span className="text-sm font-black italic tracking-tight uppercase">{step.step}</span>
                              <span className="px-3 py-0.5 bg-black/20 rounded-lg text-[9px] font-black italic">{step.duration}</span>
                           </div>
                           <p className="text-xs font-medium text-white/70 italic leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <button className="w-full py-6 bg-white text-sunset-orange rounded-[2rem] font-black uppercase tracking-[0.4em] italic text-[11px] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all relative z-10">
                  START_ENROLLMENT
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Roadmap & Mode de Fonctionnement data ---
const sprintRoadmap = [
  {
    id: 1,
    sprint: 'Sprint 1',
    name: 'Horlogerie Multi-Tenancy Souveraine',
    tag: 'Sécurité & Isolation',
    icon: Key,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Système d\'isolation cryptographique strict par locataire (Tenant) garantissant l\'étanchéité totale des données privées.',
    modeDeFonctionnement: 'Chaque requête applicative est interceptée par un middleware de routage régional. Le jeton d\'identité du Tenant est vérifié pour extraire une clé d\'encryption éphémère spécifique à ce tenant. Toutes les lectures/écritures sur la base de données Firestore sont filtrées à la racine en injectant le Tenant ID. Impossible pour un locataire de visualiser ou d\'altérer les données d\'un autre.',
    components: [
      { name: 'Régulateur de Clefs Symétriques', desc: 'Génération de clefs AES-256 uniques par namespace de locataire.' },
      { name: 'Middleware de Routage Hermétique', desc: 'Contrôle à l\'entrée des requêtes et validation des en-têtes d\'isolation.' },
      { name: 'Database Namespacing Rules', desc: 'Règles de sécurité Firestore renforcées interdisant le cross-tenanting.' }
    ],
    architecture: 'Client Secure Edge -> Middlewares Token Decrypt -> Multi-Region Sharded DB -> Client Payload Isolation',
    inputLabel: 'Identifiant Tenant à Tester',
    defaultInputValue: 'FR-SOV-01',
    simulationTrace: (val: string) => [
      `[INGRESS] Requête reçue pour le Tenant ID : "${val || 'FR-SOV-01'}"`,
      `[MIDDLEWARE] Résolution du Tenant dans la zone souveraine (Gravelines)`,
      `[SECURITY] Clé d'encryption AES-256 validée pour "${val || 'FR-SOV-01'}"`,
      `[FIRESTORE] Requête de données filtrée avec la clause WHERE tenantId === "${val || 'FR-SOV-01'}"`,
      `[STATUS] 200 OK - Isolation cryptographique garantie à 100% (Aucun rayonnement inter-tenant).`
    ]
  },
  {
    id: 2,
    sprint: 'Sprint 2',
    name: 'Moteur de Monétisation Hybride & Transactions',
    tag: 'Finance & Tiers d\'Accès',
    icon: CreditCard,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Passerelle de facturation automatisée via Stripe reliant les abonnements énergétiques aux droits système applicatifs.',
    modeDeFonctionnement: 'Synchronisation par Webhook avec Stripe. En fonction du niveau de paiement souscrit (Sovereign Premium, Apex Core, Public Trial), le système ajuste dynamiquement les quotas d\'appels API du Tenant et débloque les rapports d\'intelligence de point noir.',
    components: [
      { name: 'Synchroniseur Webhook Stripe', desc: 'Écouteur asynchrone des événements de cycle de vie (invoice.paid, etc.). font-mono' },
      { name: 'Droit d\'Accès (RBAC Grid)', desc: 'Service de mapping liant le Product ID Stripe aux fonctionnalités du dashboard.' },
      { name: 'Régulateur de Facturation', desc: 'Mécanisme d\'alerte ou de restrictions en cas d\'échec de paiement.' }
    ],
    architecture: 'Stripe Gateway -> Webhook Listener -> Subscription State Cache -> RBAC Permission Engine',
    inputLabel: 'Montant de Transaction à Simuler (€)',
    defaultInputValue: '299',
    simulationTrace: (val: string) => [
      `[WEBHOOK] Événement stripe: customer.subscription.updated reçu`,
      `[DB] Mise à jour du tier applicatif vers "Expert Tiers" d'une valeur équivalente à ${val || '299'} € / mois`,
      `[RBAC] Attribution des privilèges additionnels de moniteur de métriques unifié`,
      `[CACHING] Invalidation du cache de droits locaux pour le tenant`,
      `[STATUS] Succès - Nouveaux quotas de requêtes débloqués pour le Tenant.`
    ]
  },
  {
    id: 3,
    sprint: 'Sprint 3',
    name: 'Suite de Sécurité Anti-Abus (The Dirty Dozen)',
    tag: 'Protection Cyber',
    icon: ShieldAlert,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Sentinelle cyber active détectant les mutations IP suspectes et limitant les débits de requêtes abusifs.',
    modeDeFonctionnement: 'Un filtre dynamique maintient en mémoire glissante (Rate-Limiter) le nombre de requêtes par seconde par IP et par Tenant. Si le seuil critique (les "Règles Sombres") est franchi, l\'IP est interceptée et placée en quarantaine IP ("Bastion Block") avec journalisation immédiate.',
    components: [
      { name: 'Rate-Limiter à Fenêtre Glissante', desc: 'Comptabiliseur de requêtes ultra-rapide en mémoire tampon.' },
      { name: 'Analyseur de Suspicion IP', desc: 'Calculateur du score de risque basé sur la rapidité des changements de pays de requêtes.' },
      { name: 'Quarantine Firewall', desc: 'Blocage automatique des requêtes provenant d\'adresses blacklistées.' }
    ],
    architecture: 'Incoming Traffic -> Rate Limiter Shield -> Risk Scoring Processor -> IP Quarantine Registry',
    inputLabel: 'Nombre de requêtes d\'IP suspecte',
    defaultInputValue: '120',
    simulationTrace: (val: string) => [
      `[FILTRE TRAFIC] Débit mesuré : ${val || '120'} requêtes/sec (Seuil max autorisé : 60)`,
      `[COMPORTEMENT] Alerte de Brute-Force déclenchée sur l'adresse IP 194.12.87.16`,
      `[RISK SCORE] Score de suspicion recalculé à 92/100 (Critique)`,
      `[FIREWALL] Inscription automatique de l'IP en liste noire (Quarantaine active)`,
      `[STATUS] Attaque mitigée - Trafic malveillant redirigé avec l'erreur 429 Too Many Requests.`
    ]
  },
  {
    id: 4,
    sprint: 'Sprint 4',
    name: 'Hub d\'Intégration d\'Adaptateurs & Banc d\'Essai',
    tag: 'Connectivité APIs',
    icon: Workflow,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Banc d\'essai pour tester l\'intégration et la réplication unifiée des métriques d\'un adaptateur de communication externe.',
    modeDeFonctionnement: 'Le service permet d\'interagir avec des mock-ups réalistes d\'adaptateurs (Banc d\'Essai d\'Adaptateur et EncryptionService Sandbox) pour simuler la conformité des flux d\'informations techniques et physiques du réseau.',
    components: [
      { name: 'Banc d\'Essai Adaptateur', desc: 'Interface de simulation de défaillance réseau d\'un adaptateur.' },
      { name: 'EncryptionService Wrapper', desc: 'Validation cryptographique de l\'intégrité des données reçues.' },
      { name: 'Unified Metrics Collector', desc: 'Agrégateur de télémétries réseau pour le moniteur souverain.' }
    ],
    architecture: 'Source Adapter -> Sandbox Environment -> Payload Encryptor -> Unified Metrics Dashboard',
    inputLabel: 'Donnée Réseau Moguée (JSON/Text)',
    defaultInputValue: '{"temp": 72, "flow": 105}',
    simulationTrace: (val: string) => [
      `[MOCK CLIENT] Émission de la charge utile simulée : ${val || '{"temp": 72, "flow": 105}'}`,
      `[SANDBOX] Capture par l'adaptateur de test réseau`,
      `[ENCRYPTION] Signature numérique SHA256 validée`,
      `[COLLECTOR] Injection directe dans le registre des Métriques de Santé`,
      `[STATUS] 201 Created - Donnée formatée et synchrone sauvegardée.`
    ]
  },
  {
    id: 5,
    sprint: 'Sprint 5',
    name: 'Sentinel de Sécurité Gmail DLP',
    tag: 'Emails & Fuites de Données',
    icon: Mail,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Scanner intelligent des correspondances électroniques pour interdire la fuite d\'informations de sécurité réseau.',
    modeDeFonctionnement: 'Audit automatique de tous les emails du personnel. Une politique de Data Loss Prevention (DLP) analyse le contenu et bloque instantanément les emails contenant des numéros de compte confidentiels, des schémas de transformateurs ou des mots-clés "Secret Défense".',
    components: [
      { name: 'Analyseur de Contenu DLP', desc: 'Moteur de parsing de texte recherchant des expressions régulières sensibles.' },
      { name: 'Interface d\'Audit Admin', desc: 'Dashboard central listant les tentatives d\'envoi frauduleuses.' },
      { name: 'Injecteur d\'Alerte Rouge', desc: 'Déclencheur d\'alerte SMS/Slack de sécurité en cas de menace réelle.' }
    ],
    architecture: 'Gmail Draft Outbox -> DLP Parser Hub -> Sensitivity Analysis -> Safe-Sent/Block Decision',
    inputLabel: 'Sujet/Contenu de l\'Email à Scanner',
    defaultInputValue: 'Rapport confidentiel transformateur Blaye',
    simulationTrace: (val: string) => [
      `[SENTINEL] Détection de l'événement d'envoi d'email : "${val || 'Rapport confidentiel transformateur Blaye'}"`,
      `[CONTENT SCAN] Analyse sémantique heuristique lancée`,
      `[DLP THREAT] Alerte détectée : Mot-clé sensible "transformateur Blaye" identifié`,
      `[DECISION] Envoi SUSPENDU - Violation de la politique de sécurité des données du réseau`,
      `[STATUS] Bloqué - Notification de sécurité envoyée à l'administrateur.`
    ]
  },
  {
    id: 6,
    sprint: 'Sprint 6',
    name: 'Ledgers de Synchronisation Sheets Immutables',
    tag: 'Registre d\'Audit',
    icon: FileSpreadsheet,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Journal de sécurité infalsifiable répliqué asynchroniquement sur des registres partagés Google Sheets.',
    modeDeFonctionnement: 'Pour chaque événement système sensible (validation de document, bannissement d\'IP, ajustement de droits), un worker lance une écriture asynchrone sécurisée sur un Ledger Google Sheets, assurant une double trace auditable externe immédiate.',
    components: [
      { name: 'Worker de File d\'Attente', desc: 'Queue asynchrone amortissant les écritures pour éviter le dépassement de quota API Sheets.' },
      { name: 'Générateur de Preuve Numérique', desc: 'Génération de signatures cryptographiques pour chaque ligne écrite.' },
      { name: 'Ledger Audit Connection', desc: 'Interface de synchronisation avec l\'API de Google Workspace.' }
    ],
    architecture: 'System Audit Event -> Async Queue Worker -> Secure Auth Sheets Client -> Immutable Ledger Write',
    inputLabel: 'Événement d\'audit à consigner',
    defaultInputValue: 'Utilisateur beniich.contact@gmail.com - Connexion Bastion',
    simulationTrace: (val: string) => [
      `[AUDIT EVENT] Nouvel événement capturé : "${val || 'Connexion Bastion'}"`,
      `[QUEUE WORKER] Ajout de la ligne dans la file de réplication Sheets`,
      `[OAUTH CLIENT] Authentification sécurisée auprès de l'API Google Workspace`,
      `[LEDGER WRITE] Écriture de la ligne dans l'onglet "Security_Ledger" du classeur de gouvernance`,
      `[STATUS] Enregistré - Synchronisation Sheets réussie avec signature cryptographique.`
    ]
  },
  {
    id: 7,
    sprint: 'Sprint 7',
    name: 'Karma3 Sovereign Analytics & Karma3',
    tag: 'Télémétrie Globale',
    icon: Cpu,
    status: 'Opérationnel',
    statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-100',
    shortDesc: 'Tableau de corrélation unifié à micro-latence pour surveiller la santé des transformateurs et l\'état de la grille.',
    modeDeFonctionnement: 'Agrège et corrèle en temps réel tous les flux de données provenant de la Multi-Tenancy, de la Suite Anti-Abus et des adaptateurs d\'intégration pour émettre un diagnostic global de sécurité du réseau sous forme de "Sovereign Health Metric".',
    components: [
      { name: 'Moteur de Corrélation d\'Événements', desc: "Algorithme d'analyse temporelle croisant les incidents d'abus et les surcharges thermiques physiques." },
      { name: 'Sovereign Ratio Dashboard', desc: 'Indicateur clé en temps réel pour le pilotage de crise de la direction.' },
      { name: 'Central Logic Dispatcher', desc: 'Gestionnaire de routage pour acheminer les contre-mesures urgentes.' }
    ],
    architecture: 'Multi-stream Feeds -> Event Correlation Engine -> Core Latency Metric -> Karma3 UI Dashboard',
    inputLabel: 'Niveau thermique du transformateur (°C)',
    defaultInputValue: '87.4',
    simulationTrace: (val: string) => [
      `[TELEMETRY] Donnée de capteur reçue : température de ${val || '87.4'} °C`,
      `[CORRELATEUR] Croisement des données physiques de charge avec les logs du Bastion`,
      `[ALGORITHME] Prédiction de fin de vie de pièce : marge de sécurité de 12%`,
      `[DISPATCHER] Ajustement automatique de la consigne d'alerte à "High alert"`,
      `[STATUS] Ok - Tableau de bord Karma3 mis à jour à 10ms de latence.`
    ]
  }
];

const PlanChirurgicalSection = ({ data, onNotify }: { data: DashboardData; onNotify: (m: string) => void }) => {
  const [selectedSprintId, setSelectedSprintId] = useState(1);
  const [inputVal, setInputVal] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  const activeSprint = sprintRoadmap.find(s => s.id === selectedSprintId) || sprintRoadmap[0];

  useEffect(() => {
    setInputVal(activeSprint.defaultInputValue);
    setSimulationLogs([]);
    setIsSimulating(false);
  }, [selectedSprintId]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    const logs = activeSprint.simulationTrace(inputVal);
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsSimulating(false);
          onNotify(`Simulation du ${activeSprint.sprint} exécutée !`);
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <div id="surgical-plan-view" className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 relative">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
             <div className="px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                PLAN::CHIRURGICAL::RÉSEAU
             </div>
             <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest italic">
                ACTION IMMÉDIATE
             </div>
          </div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-2"
          >
            <h1 className="text-6xl md:text-8xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.8]">
              Ciblage <br/><span className="text-blue-500">Points Noirs</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] italic pt-4">Loi des 20/80 : 100% des ressources sur les 20% de causes racines</p>
          </motion.div>
        </div>
        <div className="flex gap-4">
           <DownloadPDFButton targetId="surgical-plan-view" fileName="Karma3-Plan-Surgical" iconOnly onEmailSent={onNotify} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 md:p-10 bg-blue-50 border border-blue-100 rounded-3xl md:rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-blue-500/5 relative overflow-hidden group"
      >
        <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 shrink-0 rotate-12 group-hover:rotate-0 transition-transform">
          <Zap className="w-10 h-10" />
        </div>
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <span className="text-blue-900 font-black uppercase tracking-[0.5em] italic text-[11px] bg-blue-100 px-4 py-1 rounded-full">Loi de Pareto (20/80)</span>
          <p className="text-blue-700/80 text-xl font-medium italic leading-[1.2] max-w-4xl">
            Nous concentrons 100% de nos ressources sur les 20% de causes racines qui génèrent 80% des réclamations clients.
          </p>
        </div>
      </motion.div>

      <Card title="Interventions Prioritaires" icon={Zap}>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                {['Zone Cible', 'Réclamations / Mois', 'Cause Racine', 'Solution Chirurgicale', 'Résultat Attendu'].map(header => (
                  <th key={header} className="p-8 text-[11px] font-black uppercase tracking-[0.3em] italic">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { zone: 'Zone A (Centre)', req: 47, cause: 'Câblage BT vétuste', solution: 'Remplacement complet prioritaire', result: '-70% Réclamations', color: 'text-red-500' },
                { zone: 'Zone B (Nord)', req: 31, cause: 'Surcharge Transformateurs', solution: 'Ajout transformateur + équilibrage', result: '-60% Pannes', color: 'text-sunset-orange' },
                { zone: 'Zone C (Industrie)', req: 28, cause: 'Pics de charge', solution: 'Programme délestage préventif', result: '-50% Coupures', color: 'text-sunset-orange' },
              ].map((item, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group hover:bg-slate-50 transition-all"
                >
                  <td className="p-8 font-black text-slate-900 uppercase italic tracking-tight">{item.zone}</td>
                  <td className={cn("p-8 text-2xl font-black italic", item.color)}>{item.req}</td>
                  <td className="p-8 text-slate-600 font-medium italic leading-snug max-w-xs">{item.cause}</td>
                  <td className="p-8 font-black text-blue-500 uppercase italic text-xs tracking-[0.1em]">{item.solution}</td>
                  <td className="p-8">
                     <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-[10px] font-black uppercase italic tracking-widest w-fit">
                       {item.result}
                     </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- Upgraded Roadmap and Operation Mode Section --- */}
      <div className="pt-8 border-t border-slate-100 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                PILIER::STRATÉGIQUE::ROADMAP
             </div>
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
               SPHÈRE OPÉRATIONNELLE SOUVERAINE
             </span>
          </div>
          <h2 className="text-4xl font-black text-slate-950 uppercase italic tracking-tight leading-[0.9]">
            Roadmap & Modes de Fonctionnement des Services
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic max-w-2xl">
            Découvrez la dynamique interne, la topographie technique et simulez en temps réel le flux opérationnel unifié de chaque sprint.
          </p>
        </div>

        {/* Navigation & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vertical Navigation list of Sprints */}
          <div className="lg:col-span-4 space-y-2.5">
            {sprintRoadmap.map((item) => {
              const isSelected = selectedSprintId === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSprintId(item.id)}
                  className={cn(
                    "w-full p-4 text-left rounded-3xl border transition-all flex items-center gap-4 relative group",
                    isSelected 
                      ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10 translate-x-1" 
                      : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50/80 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6",
                    isSelected ? "bg-white/10 text-white" : "bg-slate-50 border border-slate-100 text-slate-950"
                  )}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex justify-between items-center gap-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        isSelected ? "text-indigo-300" : "text-slate-400"
                      )}>
                        {item.sprint}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <h3 className={cn(
                      "text-xs font-black uppercase italic tracking-tight truncate",
                      isSelected ? "text-white" : "text-slate-800"
                    )}>
                      {item.name}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Large Detail panel for the selected Sprint */}
          <div className="lg:col-span-8 p-6 md:p-10 bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] shadow-xl space-y-8 min-h-[500px]">
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-mono rounded-full uppercase tracking-wider">
                    {activeSprint.sprint}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-wider rounded-full">
                    {activeSprint.tag}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {activeSprint.status}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic text-slate-950 uppercase tracking-tight leading-none mt-2">
                  {activeSprint.name}
                </h3>
              </div>
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-950 shrink-0 shadow-inner">
                {React.createElement(activeSprint.icon, { className: 'w-7 h-7' })}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                Mode de Fonctionnement Interne
              </h4>
              <p className="text-slate-700 font-medium italic text-sm leading-relaxed bg-slate-50/50 p-5 border border-slate-100/60 rounded-2xl">
                {activeSprint.modeDeFonctionnement}
              </p>
            </div>

            {/* Key Sub-Components Table/Grid */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                Composants Clés du Service
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeSprint.components.map((comp, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-100 hover:border-slate-200 rounded-2xl space-y-1.5 transition-all">
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest font-mono">
                      [0{idx + 1}] {comp.name}
                    </span>
                    <p className="text-slate-500 font-medium text-[10px] leading-normal italic">
                      {comp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Architecture */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                Topographie de Flux (Data Pipeline)
              </h4>
              <div className="p-4 bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[9px] uppercase tracking-wider rounded-2xl flex flex-wrap items-center gap-3">
                {activeSprint.architecture.split('->').map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    {sIdx > 0 && <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0 animate-pulse" />}
                    <span className={cn(
                      "px-2 py-1 rounded",
                      sIdx === 0 ? "bg-indigo-950 text-indigo-300 font-bold" : sIdx === 3 ? "bg-emerald-950 text-emerald-300 font-bold" : "bg-slate-900 border border-slate-800 text-slate-300"
                    )}>
                      {step.trim()}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Micro Live Simulator (Banc d'Essai) */}
            <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100/50 rounded-2xl space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest italic">
                    Banc d'Essai & Simulateur Émulateur
                  </h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    Déclenchez pas-à-pas le flux logique pour éprouver la sécurité de l'architecture.
                  </p>
                </div>
                <div className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 rounded text-[9px] font-mono font-bold uppercase">
                  SIMULATEUR CONNECTÉ
                </div>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-700 uppercase tracking-wider block">
                    {activeSprint.inputLabel}
                  </label>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Saisissez une valeur..."
                    disabled={isSimulating}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-300 transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider italic shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      Encours...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-indigo-400" />
                      Lancer Flux
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Sequence Log Trace */}
              {(simulationLogs.length > 0 || isSimulating) && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[9.5px]/[1.4] text-slate-400 shadow-inner">
                  <div className="flex justify-between items-center text-[8px] text-slate-500 border-b border-slate-900 pb-1.5 mb-1.5 uppercase tracking-widest font-black">
                    <span>Console de Trace d'Événements</span>
                    <span>Latence : 8ms</span>
                  </div>
                  {simulationLogs.map((log, lIdx) => {
                    const isStatus = log.includes('[STATUS]');
                    const isError = log.includes('Critique') || log.includes('Bloqué') || log.includes('SUSPENDU');
                    return (
                      <motion.div
                        key={lIdx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "whitespace-pre-wrap leading-relaxed",
                          isStatus ? "text-emerald-400 font-bold pt-1 border-t border-slate-900/40 mt-1" : 
                          isError ? "text-rose-400" : "text-slate-300"
                        )}
                      >
                        {log}
                      </motion.div>
                    );
                  })}
                  {isSimulating && (
                    <div className="flex items-center gap-2 text-indigo-400 text-[9px] animate-pulse italic pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                      Calcul et routage du segment réseau de sécurité...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GovernanceSection = ({ 
  data, 
  onNotify,
  onAddDocument,
  onRemoveDocument
}: { 
  data: DashboardData; 
  onNotify: (m: string) => void;
  onAddDocument?: (d: Document) => Promise<void>;
  onRemoveDocument?: (ref: string) => Promise<void>;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Create new document structure
    const ref = `LT-${Math.floor(10 + Math.random() * 90)}`;
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      ref: ref,
      title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
      obj: 'Système Sécure - Certification Karma3 ' + (file.size / 1024).toFixed(1) + ' KB',
      nature: file.type || 'Document Local',
      priority: file.size > 1024 * 500 ? 'Critical' : 'High'
    };

    if (onAddDocument) {
      await onAddDocument(newDoc);
      onNotify(`Document "${file.name}" importé avec succès. Référence générée: ${ref}`);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="governance-view" className="space-y-12">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.txt"
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 relative">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
             <div className="px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                GOUVERNANCE::TRAÇABILITÉ
             </div>
             <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">
                RÉFÉRENTIEL STRATÉGIQUE
             </div>
          </div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-2"
          >
            <h1 className="text-6xl md:text-8xl font-black italic text-slate-900 tracking-tighter uppercase leading-[0.8]">
              Référentiel <br/><span className="text-emerald-500">Documentaire</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] italic pt-4">Traçabilité Totale & Documents de Pilotage</p>
          </motion.div>
        </div>
        <div className="flex gap-4">
           <DownloadPDFButton targetId="governance-view" fileName="Karma3-Governance-Docs" iconOnly onEmailSent={onNotify} />
        </div>
      </div>

      <Card title="Documents de Pilotage" icon={FileText}>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                {['Réf.', 'Document', 'Nature', 'Priorité', 'Actions'].map(header => (
                  <th key={header} className="p-8 text-[11px] font-black uppercase tracking-[0.3em] italic">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.complianceDocs.map((docEntity, i) => (
                <motion.tr 
                  key={docEntity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group hover:bg-slate-50 transition-all"
                >
                  <td 
                    style={i < 4 ? { backgroundColor: '#3abc98' } : undefined}
                    className="p-8 font-black text-slate-900 uppercase italic tracking-tight"
                  >
                    {i === 1 || i === 2 ? (
                      <span>{docEntity.ref}</span>
                    ) : (
                      docEntity.ref
                    )}
                  </td>
                  <td 
                    style={i < 4 ? { backgroundColor: '#3abc98' } : undefined}
                    className="p-12 font-black text-slate-700 italic uppercase text-xs tracking-tight"
                  >
                    <div className="flex flex-col animate-none">
                      <span className="text-slate-900">{docEntity.title}</span>
                      {i === 3 ? (
                        <p className="text-[10px] font-medium text-slate-400 mt-1 lowercase font-mono animate-none">{docEntity.obj}</p>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 mt-1 lowercase font-mono animate-none">{docEntity.obj}</span>
                      )}
                    </div>
                  </td>
                  <td 
                    style={i < 4 ? { backgroundColor: '#3abc98' } : undefined}
                    className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic"
                  >
                    <span style={i < 4 ? { color: '#0a1c72' } : undefined}>{docEntity.nature}</span>
                  </td>
                  <td 
                    style={i < 4 ? { backgroundColor: '#3abc98' } : undefined}
                    className="p-8"
                  >
                     <Badge variant={docEntity.priority === 'Critical' ? 'crit' : docEntity.priority === 'High' ? 'orange' : 'default'}>
                       {docEntity.priority}
                     </Badge>
                  </td>
                  <td 
                    style={i < 4 ? { backgroundColor: '#3abc98' } : undefined}
                    className="p-8"
                  >
                     <button 
                       onClick={async () => {
                         if (onRemoveDocument) {
                           await onRemoveDocument(docEntity.ref);
                           onNotify(`Document ${docEntity.ref} supprimé du référentiel.`);
                         }
                       }}
                       className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:shadow-lg transition-all"
                       title="Supprimer"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        onClick={triggerFileBrowser}
        className="p-6 md:p-16 bg-white border border-slate-100 rounded-3xl md:rounded-[4rem] flex flex-col items-center gap-10 text-center italic group hover:shadow-2xl hover:border-sunset-orange/30 transition-all cursor-pointer"
      >
         <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-200 group-hover:text-sunset-orange group-hover:scale-110 transition-all group-hover:rotate-12">
            <Plus className="w-12 h-12" />
         </div>
         <div className="space-y-4">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.4em] text-lg italic">Ajouter un Document</h4>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">Format supporté : PDF, DOCX, XLSX <br/>(Faites glisser un fichier ou cliquez ici)</p>
         </div>
         <button className="px-12 py-6 bg-slate-950 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-sunset-orange hover:shadow-2xl hover:shadow-sunset-orange/20 transition-all">
            Parcourir les fichiers
         </button>
      </motion.div>
    </div>
  );
};
