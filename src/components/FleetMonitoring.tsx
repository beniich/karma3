import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Activity, 
  Gauge, 
  Cpu, 
  Battery, 
  MapPin, 
  AlertOctagon, 
  Wrench, 
  Check, 
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FleetVehicle {
  id: string;
  name: string;
  status: 'Critical' | 'Warning' | 'Optimal';
  alert: string;
  time: string;
  cpu: number;
  ram: number;
  battery: number;
  license: string;
}

const INITIAL_VEHICLES: FleetVehicle[] = [
  { id: 'Truck-452', name: 'Volvo Heavy Hauler 452', status: 'Critical', alert: 'High CPU Temp (92°C)', time: '10:05 AM', cpu: 89, ram: 78, battery: 12, license: 'MA-904-RT' },
  { id: 'Van-789', name: 'Mercedes Sprinter Van 789', status: 'Warning', alert: 'Low Battery State', time: '09:58 AM', cpu: 67, ram: 82, battery: 18, license: 'BA-205-XP' },
  { id: 'Car-112', name: 'Tesla Logistics Patrol 112', status: 'Critical', alert: 'Connection Lost with Satellite S-1', time: '09:45 AM', cpu: 95, ram: 91, battery: 4, license: 'TE-512-NX' },
  { id: 'Trailer-88', name: 'Krone Temp Refrigerator 88', status: 'Optimal', alert: 'Diagnostics Healthy', time: '09:30 AM', cpu: 32, ram: 45, battery: 94, license: 'KR-303-SL' },
  { id: 'Tractor-10', name: 'John Deere Autonomous unit 10', status: 'Optimal', alert: 'Diagnostics Healthy', time: '08:15 AM', cpu: 14, ram: 38, battery: 88, license: 'JD-404-EL' },
];

const TELEMETRY_STREAM = [
  { time: '0', throughput: 15, latency: 45 },
  { time: '5', throughput: 28, latency: 32 },
  { time: '10', throughput: 21, latency: 38 },
  { time: '15', throughput: 42, latency: 30 },
  { time: '20', throughput: 35, latency: 40 },
  { time: '25', throughput: 48, latency: 28 }, // Peak matched annotations
  { time: '30', throughput: 31, latency: 35 },
  { time: '35', throughput: 38, latency: 31 },
  { time: '40', throughput: 44, latency: 22 },
  { time: '45', throughput: 32, latency: 28 },
  { time: '50', throughput: 55, latency: 15 },
  { time: '55', throughput: 45, latency: 18 },
  { time: '60', throughput: 49, latency: 20 },
];

const CPU_DRAIN_STREAM = [
  { time: '0', cpu: 45, battery: 95 },
  { time: '10', cpu: 62, battery: 90 },
  { time: '20', cpu: 85, battery: 82 },
  { time: '30', cpu: 74, battery: 74 },
  { time: '40', cpu: 92, battery: 60 },
  { time: '50', cpu: 81, battery: 45 },
  { time: '60', cpu: 88, battery: 32 },
];

export const FleetMonitoring = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle>(INITIAL_VEHICLES[0]);
  const [ticker, setTicker] = useState(0);

  // Fluctuating ticker for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
      
      // Slightly fluctuate main metrics of selected vehicle
      setSelectedVehicle(prev => {
        const cpuDelta = Math.floor(Math.random() * 6) - 3;
        const ramDelta = Math.floor(Math.random() * 4) - 2;
        const battDelta = Math.random() > 0.8 ? -1 : 0;
        return {
          ...prev,
          cpu: Math.max(10, Math.min(99, prev.cpu + cpuDelta)),
          ram: Math.max(20, Math.min(95, prev.ram + ramDelta)),
          battery: Math.max(0, Math.min(100, prev.battery + battDelta))
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = (id: string, name: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    onNotify(`🔧 Alerte résolue pour ${name}. Tunnel de diagnostic fermé.`);
  };

  // Helper to draw a sleek semi-circular arc matching Screenshot 7 exactly
  const renderSemiGauge = (percentage: number, label: string, info: string, color: string) => {
    // Math for SVG semicircular path
    const radius = 50;
    const strokeWidth = 8;
    const circumference = Math.PI * radius; // Half circle
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="bg-[#1b103c]/45 border border-[#372375]/50 rounded-[2rem] p-6 flex flex-col items-center justify-between text-center min-h-[220px] shadow-lg relative hover:border-[#4e31a1]/70 transition-all">
        
        <span className="text-[9.5px] font-black tracking-widest text-[#94a3b8] uppercase font-mono mb-2">
          {label}
        </span>

        {/* Dynamic semi-circle matching orange neon layout perfectly */}
        <div className="relative w-36 h-20 flex items-end justify-center overflow-hidden">
          <svg className="w-full h-full transform translate-y-3">
            {/* Gray backing arc */}
            <path
              d="M 18,75 A 50,50 0 0,1 122,75"
              fill="none"
              stroke="#1e0f47"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Active glowing color arc */}
            <path
              d="M 18,75 A 50,50 0 0,1 122,75"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 6px ${color})`
              }}
            />
          </svg>

          {/* Sizable core percentage text matching image */}
          <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
            <span className="text-3xl font-black italic text-white leading-none font-sans">
              {percentage}%
            </span>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-bold block leading-relaxed font-mono mt-3">
          {info}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans text-[#cbd5e1] p-1 md:p-4 text-left select-none relative">
      
      {/* Background Decor */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top control header matching Screenshot 7 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
            <span className="w-2.5 h-7 bg-orange-500 rounded-full inline-block" />
            HIGH-IMPACT FLEET MONITORING
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Sovereign Device Nexus - Real-time fleet monitoring.
          </p>
        </div>

        {/* Selected Vehicle details */}
        <div className="flex items-center gap-2 bg-[#0c0525] p-2 px-4 border border-[#3e238f]/60 rounded-xl font-mono text-[10.5px]">
          <span className="text-slate-400">ACTIVE INTENSITY:</span>
          <strong className="text-orange-400 font-black">{selectedVehicle.id}</strong>
        </div>
      </div>

      {/* THREE GLOWING ARC GAUGES PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderSemiGauge(selectedVehicle.cpu, 'CPU USAGE', 'Avg of 450 devices', '#f97316')}
        {renderSemiGauge(selectedVehicle.ram, 'RAM USAGE', '16GB Total / 11.5GB Used', '#ea580c')}
        {renderSemiGauge(selectedVehicle.battery, 'BATTERY LEVEL', 'Time Remaining: 8h 20m', '#ff4d00')}
      </div>

      {/* Real-time split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Dual Area plots showing Telemetry values and comparative analytics */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Chart Card 1: Real-time Fleet Telemetry (Last 60 mins) */}
          <div className="bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Real-time Fleet Telemetry (Last 60 mins)</h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Satellite throughput (Mbps) compared live against round-trip latency (ms).</p>
              </div>
              
              {/* Legends matched color layout */}
              <div className="flex items-center gap-4 text-[9.5px] font-mono font-black">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 bg-orange-500 inline-block rounded-full" />
                  <span className="text-orange-400">Data Throughput (Mbps)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 bg-indigo-400 inline-block rounded-full" />
                  <span className="text-indigo-400">Latency (ms)</span>
                </span>
              </div>
            </div>

            {/* Recharts responsive block */}
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TELEMETRY_STREAM} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorThr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#090518', borderColor: '#4c2d96', borderRadius: '1rem', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="throughput" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorThr)" />
                  <Area type="monotone" dataKey="latency" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Card 2: CPU Load vs. Battery Drain */}
          <div className="bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">CPU Load vs. Battery Drain</h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Cross-referencing telemetry system CPU peak usage cycles against physical battery discharge cycles.</p>
              </div>
            </div>

            {/* CPU drain charts plotting stream */}
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CPU_DRAIN_STREAM} margin={{ top: 11, right: 11, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#090518', borderColor: '#4c2d96', borderRadius: '1rem', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#ea580c" strokeWidth={2} fill="#ea580c" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="battery" stroke="#ff4d00" strokeWidth={2} fill="#ff4d00" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CRITICAL DEVICE ALERTS LISTS */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#1b103c]/45 border border-[#372375]/50 rounded-[2rem] p-6 flex flex-col justify-between shadow-lg relative">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest font-mono mb-5">CRITICAL DEVICE ALERTS</h3>
            
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {vehicles.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${selectedVehicle.id === v.id ? 'bg-[#21114b] border-orange-500 shadow-md' : 'bg-[#120930]/80 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <Truck className={`w-4 h-4 ${v.status === 'Critical' ? 'text-red-500' : 'text-amber-500'}`} />
                      <span className="text-xs font-black text-white">{v.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({v.license})</span>
                    </div>
                    <p className="text-[10.5px] font-semibold text-slate-300 leading-snug">{v.name}</p>
                    <div className="text-[9px] font-bold text-red-400 uppercase font-mono tracking-wider">{v.alert}</div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {v.time}
                    </span>
                    {v.status !== 'Optimal' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveAlert(v.id, v.name);
                        }}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider"
                      >
                        Solve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {vehicles.length === 0 && (
                <div className="text-center py-8 text-emerald-400 font-black text-xs uppercase flex flex-col items-center gap-2">
                  <Check className="w-8 h-8 text-emerald-500" />
                  Tous les terminaux mobiles sont sains !
                </div>
              )}
            </div>
          </div>

          {/* Interactive simulator details block */}
          <div className="bg-[#09041a] border border-[#3e238f]/50 rounded-2xl p-5.5 text-xs text-left">
            <h4 className="text-white font-extrabold uppercase mb-2">INTELLIGENT DIAGNOSTICS</h4>
            <p className="text-slate-400 leading-relaxed font-semibold">
              Sélectionnez un véhicule dans la liste des alertes critiques pour focaliser la liaison radio-satellite sur ses capteurs et remonter ses graphes d'admission à la seconde près.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
