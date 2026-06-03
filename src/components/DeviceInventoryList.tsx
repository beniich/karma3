import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Cpu, 
  FileSpreadsheet, 
  ArrowRight, 
  ArrowLeft,
  ChevronsUpDown,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';

interface InventoryItem {
  name: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'ACTIVE' | 'WARNING' | 'OFFLINE';
  lastActive: string;
}

const INVENTORY_DATA: InventoryItem[] = [
  // Page 1
  { name: 'Server Rack A1', model: 'Dell PowerEdge R750', serialNumber: 'SN-DELL-123456', location: 'Data Center - Zone B', status: 'ACTIVE', lastActive: '10:45 AM Today' },
  { name: 'Network Switch B2', model: 'Cisco Catalyst 9300', serialNumber: 'SN-CISCO-789012', location: 'Office Floor 3', status: 'WARNING', lastActive: '09:30 AM Today' },
  { name: 'Storage Array C3', model: 'NetApp AFF A400', serialNumber: 'SN-NETAPP-345678', location: 'Data Center - Zone C', status: 'OFFLINE', lastActive: 'Yesterday 18:00 PM' },
  { name: 'Storage Array C4', model: 'NetApp AFF A400', serialNumber: 'SN-NETAPP-345678', location: 'Data Center - Zone C', status: 'OFFLINE', lastActive: 'Yesterday 18:00 PM' },
  { name: 'Network Switch B2', model: 'Cisco Catalyst 9300', serialNumber: 'SN-CISCO-789012', location: 'Office Floor 3', status: 'WARNING', lastActive: '09:30 AM Today' },
  { name: 'Storage Array B2', model: 'Cisco Catalyst 9300', serialNumber: 'SN-DELL-123456', location: 'Data Center - Zone B', status: 'ACTIVE', lastActive: '10:45 AM Today' },
  { name: 'Server Rack A1', model: 'Dell PowerEdge R750', serialNumber: 'SN-CISCO-789012', location: 'Office Floor 3', status: 'WARNING', lastActive: '09:30 AM Today' },
  { name: 'Storage Array C3', model: 'Dell PowerEdge R750', serialNumber: 'SN-NETAPP-345678', location: 'Data Center - Zone C', status: 'OFFLINE', lastActive: 'Yesterday 18:00 PM' },
  
  // Page 2
  { name: 'Database Node Alpha', model: 'HP ProLiant DL380', serialNumber: 'SN-HP-901412', location: 'Data Center - Zone B', status: 'ACTIVE', lastActive: '11:15 AM Today' },
  { name: 'Core Firewall Guard', model: 'Fortinet FortiGate 300', serialNumber: 'SN-FORT-512140', location: 'Data Center - Zone A', status: 'ACTIVE', lastActive: '10:12 AM Today' },
  { name: 'Edge Router Terminal', model: 'Juniper MX240', serialNumber: 'SN-JUN-304192', location: 'Office Floor 1', status: 'WARNING', lastActive: '08:42 AM Today' },
  { name: 'UPS Reserve Pack', model: 'APC Symmetra 30kW', serialNumber: 'SN-APC-801241', location: 'Power Plant Sub', status: 'OFFLINE', lastActive: '2 days ago' },
];

export const DeviceInventoryList = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const locations = ['All', ...Array.from(new Set(INVENTORY_DATA.map(item => item.location)))];

  // Filters
  const filteredData = INVENTORY_DATA.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLoc = selectedLocation === 'All' || item.location === selectedLocation;

    return matchesSearch && matchesLoc;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#cbd5e1] p-1 md:p-4 text-left select-none relative">
      
      {/* Decorative Aura Spot */}
      <div className="absolute right-20 top-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header matched layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
            <span className="w-2.5 h-7 bg-orange-500 rounded-full inline-block" />
            DEVICE INVENTORY LIST
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Sovereign Device Nexus - Comprehensive Device Management.
          </p>
        </div>

        {/* Sync telemetry notice */}
        <div className="text-xs bg-[#0c0525] p-2 border border-[#3e238f]/60 rounded-xl px-4 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-orange-400 animate-spin" />
          <span className="text-[10px] uppercase font-black tracking-wider">SECURE LEDGER: REGISTERED</span>
        </div>
      </div>

      {/* Structured Filter Toolbars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Input bar */}
        <div className="md:col-span-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher par équipement, modèle, numéro de série..."
            className="w-full bg-[#1b103c]/45 border border-[#372375]/50 px-5 py-3.5 pl-12 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 shadow-md"
          />
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Location Dropdown selector */}
        <div className="md:col-span-4 relative">
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
              onNotify(`📍 Filtre de zone appliqué : ${e.target.value}`);
            }}
            className="w-full bg-[#1b103c]/45 border border-[#372375]/50 px-5 py-3.5 pr-10 rounded-2xl text-xs text-[#cbd5e1] outline-none appearance-none focus:border-orange-500 shadow-md cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc === 'All' ? 'Toutes les Zones' : loc}</option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

      </div>

      {/* Main Grid Content - High Fidelity Table represented in Screenshot 8 */}
      <div className="bg-[#1b103c]/30 border border-[#372375]/40 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3e238f]/30 text-[#94a3b8] uppercase font-sans font-black text-[9.5px] tracking-widest py-4">
                <th className="py-5 px-4">DEVICE NAME</th>
                <th className="py-5 px-4">MODEL</th>
                <th className="py-5 px-4 font-mono">SERIAL NUMBER</th>
                <th className="py-5 px-4">LOCATION</th>
                <th className="py-5 px-4">STATUS</th>
                <th className="py-5 px-4 text-right">LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3e238f]/20">
              {paginatedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-indigo-950/20 transition-all font-sans">
                  
                  <td className="py-4.5 px-4 font-black text-white uppercase group-hover:text-orange-400">
                    {item.name}
                  </td>
                  
                  <td className="py-4.5 px-4 text-slate-300 font-semibold italic">
                    {item.model}
                  </td>
                  
                  <td className="py-4.5 px-4 text-slate-400 font-bold font-mono text-[10.5px]">
                    {item.serialNumber}
                  </td>
                  
                  <td className="py-4.5 px-4 text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>{item.location}</span>
                  </td>
                  
                  <td className="py-4.5 px-4">
                    {item.status === 'ACTIVE' && (
                      <span className="inline-block bg-orange-600 text-white font-black text-[9px] tracking-wider py-1 px-3 rounded-md shadow-sm">
                        ACTIVE
                      </span>
                    )}

                    {item.status === 'WARNING' && (
                      <span className="inline-block border-2 border-orange-500 text-orange-400 font-mono font-black text-[9px] tracking-wider py-0.5 px-2.5 rounded-md">
                        WARNING
                      </span>
                    )}

                    {item.status === 'OFFLINE' && (
                      <span className="inline-block bg-transparent border border-slate-700/80 text-orange-500/85 font-mono font-black text-[9px] tracking-wider py-0.5 px-2.5 rounded-md">
                        OFFLINE
                      </span>
                    )}
                  </td>

                  <td className="py-4.5 px-4 text-right text-slate-400 font-bold font-mono">
                    {item.lastActive}
                  </td>

                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 italic text-xs">
                    Aucun équipement d'inventaire ne répond à votre filtrage de sécurité.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination controls matches layout pagination footer exactly */}
        <div className="flex justify-between items-center pt-6 mt-4 border-t border-[#3e238f]/30">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 font-black uppercase">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className="p-2 border border-[#3e238f]/60 hover:border-orange-500 hover:text-white rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
            </button>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#3e238f]/60 hover:border-orange-500 hover:text-white rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
