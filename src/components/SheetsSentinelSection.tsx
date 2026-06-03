import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Lock,
  PlusCircle,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  LogOut,
  ExternalLink,
  ChevronDown,
  Database,
  ArrowRightLeft,
  Settings,
  ShieldCheck,
  Send,
  HelpCircle,
  Table,
  Sparkles
} from 'lucide-react';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';

interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
}

interface ComplianceRow {
  date: string;
  controlId: string;
  framework: string;
  policyName: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  remediationStatus: 'Validated' | 'Pending Mitigation' | 'Under Audit' | 'Failed';
  remarks: string;
}

export const SheetsSentinelSection = ({ onNotify, theme = 'dark' }: { onNotify: (msg: string) => void; theme?: 'dark' | 'light' | 'high-contrast' }) => {
  // Auth & Token states
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Sheets state
  const [spreadsheetId, setSpreadsheetId] = useState<string>('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
  const [activeSheetName, setActiveSheetName] = useState<string>('ISO 27001 Readiness');
  const [sheetsNamesList, setSheetsNamesList] = useState<string[]>(['ISO 27001 Readiness', 'SOC 2 Mitigations', 'Active Vulnerabilities']);

  // Loading States
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [isExportingRecord, setIsExportingRecord] = useState(false);

  // Rows and data list
  const [loadedRows, setLoadedRows] = useState<any[][]>([]);

  // Default export item constructor
  const [newRowControlId, setNewRowControlId] = useState('A.5.15');
  const [newRowFramework, setNewRowFramework] = useState('ISO 27001:2022');
  const [newRowPolicy, setNewRowPolicy] = useState('SSH access management to centralized Bastion');
  const [newRowPriority, setNewRowPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [newRowStatus, setNewRowStatus] = useState<'Validated' | 'Pending Mitigation' | 'Under Audit' | 'Failed'>('Validated');
  const [newRowRemarks, setNewRowRemarks] = useState('SSH key configuration and two-factor authentication validated via Sprint 4.');

  // Mock ledger data for preview (when disconnected)
  const MOCK_ROWS = [
    ["Control Date", "Control ID", "Framework", "Security Policy", "Severity", "Remediation Status", "Remarks & Auditor"],
    ["2026-05-25 09:30", "A.8.20", "ISO 27001:2022", "Classification of company info", "High", "Validated", "Config file successfully indexed by Governance module."],
    ["2026-05-25 10:15", "CC6.1", "SOC 2 Type II", "Logical and physical access controls", "Critical", "Pending Mitigation", "SSH Bastion active. Private keys undergoing integrity audit."],
    ["2026-05-25 11:00", "A.12.6", "ISO 27001:2022", "Technical vulnerability management", "Medium", "Validated", "Anti-Abuse Suite (Sprint 3) deployed with tracking validation."],
    ["2026-05-25 12:40", "CC7.3", "SOC 2 Type II", "Malicious behavior detection", "Critical", "Under Audit", "Launch of active detection filter on port 3000."],
  ];

  // Monitor auth state
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Sync / Connect with Sheets Scopes
  const handleConnectSheets = async () => {
    setIsConnecting(true);
    try {
      const provider = new GoogleAuthProvider();
      // Explicit workspace sheets scope
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        setAccessToken(token);
        setUser(result.user);
        onNotify('Successfully connected to Google Sheets API!');
      } else {
        throw new Error('No access token received during connection.');
      }
    } catch (err: any) {
      console.error('Sheets OAuth Connection Error:', err);
      onNotify(`Google Sheets connection failed: ${err.message || err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    setLoadedRows([]);
    setSpreadsheetId('');
    setSpreadsheetUrl('');
    onNotify('Disconnected from the Google Sheets API.');
  };

  // CREATE New Spreadsheet document
  const handleCreateEnterpriseLedger = async () => {
    if (!accessToken) {
      onNotify('Please connect your Google Sheets account first.');
      return;
    }

    // MANDATORY USER CONFIRMATION GUARD
    const isConfirmed = window.confirm(
      "Do you want to create a new spreadsheet named 'AuditAX Enterprise Audit Ledger' in your Google Drive account?"
    );
    if (!isConfirmed) return;

    setIsCreatingSheet(true);
    try {
      const createBody = {
        properties: {
          title: "AuditAX Enterprise Audit Ledger"
        },
        sheets: [
          {
            properties: {
              title: "ISO 27001 Readiness",
              gridProperties: {
                rowCount: 100,
                columnCount: 8
              }
            }
          },
          {
            properties: {
              title: "SOC 2 Mitigations",
              gridProperties: {
                rowCount: 100,
                columnCount: 8
              }
            }
          },
          {
            properties: {
              title: "Active Vulnerabilities",
              gridProperties: {
                rowCount: 100,
                columnCount: 8
              }
            }
          }
        ]
      };

      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createBody)
      });

      if (!response.ok) {
        throw new Error(`Sheets creation failed (${response.status} ${response.statusText})`);
      }

      const ledger = await response.json();
      const generatedId = ledger.spreadsheetId;
      const generatedUrl = ledger.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${generatedId}/edit`;

      setSpreadsheetId(generatedId);
      setSpreadsheetUrl(generatedUrl);
      onNotify('New security Ledger created on Google Sheets!');

      // Populate headers
      await populateInitialSheetHeaders(generatedId, tokenString => tokenString || accessToken);

    } catch (error: any) {
      console.error('Error creating Spreadsheet:', error);
      onNotify(`Creation error: ${error.message || error}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Helper to instantly populate initial headers
  const populateInitialSheetHeaders = async (id: string, getToken: (v?: any) => string | null) => {
    const token = getToken();
    if (!token || !id) return;

    try {
      const headers = [
        "Control Date",
        "Control ID",
        "Framework",
        "Security Policy",
        "Severity",
        "Remediation Status",
        "Remarks & Auditor"
      ];

      const rangePayload = {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: "'ISO 27001 Readiness'!A1:G1",
            values: [headers]
          },
          {
            range: "'SOC 2 Mitigations'!A1:G1",
            values: [headers]
          },
          {
            range: "'Active Vulnerabilities'!A1:G1",
            values: [headers]
          }
        ]
      };

      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rangePayload)
      });

      if (response.ok) {
        onNotify('Compliance headers successfully injected.');
        handleReadLedgerData(id, token);
      } else {
        console.warn('Batch header population returned status:', response.status);
      }

    } catch (err) {
      console.error('Failed to populate headers:', err);
    }
  };

  // READ ledger records
  const handleReadLedgerData = async (targetId?: string, forceToken?: string) => {
    const activeId = targetId || spreadsheetId;
    const activeToken = forceToken || accessToken;

    if (!activeToken) {
      onNotify('Please connect your Google Sheets account first.');
      return;
    }

    if (!activeId.trim()) {
      onNotify('Please enter a valid spreadsheet ID or create a new one.');
      return;
    }

    setIsLoadingRows(true);
    try {
      const range = `${activeSheetName}!A1:G50`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${activeId.trim()}/values/${encodeURIComponent(range)}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (!response.ok) {
        throw new Error(`Reading failed (${response.status} ${response.statusText})`);
      }

      const payload = await response.json();
      
      if (payload.values && payload.values.length > 0) {
        setLoadedRows(payload.values);
        onNotify(`${payload.values.length - 1} entries sync loaded.`);
        
        if (!spreadsheetId) {
          setSpreadsheetId(activeId.trim());
          setSpreadsheetUrl(`https://docs.google.com/spreadsheets/d/${activeId.trim()}/edit`);
        }
      } else {
        setLoadedRows([]);
        onNotify('The selected sheet is empty or has a clean new structure.');
      }
    } catch (error: any) {
      console.error('Error reading details from Sheets:', error);
      onNotify(`Error during synchronization: ${error.message || error}`);
    } finally {
      setIsLoadingRows(false);
    }
  };

  // APPEND row
  const handleExportControlRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onNotify('Please connect your Google Sheets account first.');
      return;
    }

    if (!spreadsheetId.trim()) {
      onNotify('Please create a Ledger or provide an existing ID first.');
      return;
    }

    // MANDATORY USER CONFIRMATION GUARD
    const isConfirmed = window.confirm(
      `Do you confirm writing a new audit row to your Google Sheets document?\n\nControl: ${newRowControlId}\nPolicy: ${newRowPolicy}\nStatus: ${newRowStatus}`
    );
    if (!isConfirmed) return;

    setIsExportingRecord(true);
    try {
      const dateFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const values = [
        [
          dateFormatted,
          newRowControlId,
          newRowFramework,
          newRowPolicy,
          newRowPriority,
          newRowStatus,
          `${newRowRemarks} (CISO: ${user?.email || 'System'})`
        ]
      ];

      const range = `'${activeSheetName}'!A:G`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });

      if (!response.ok) {
        throw new Error(`Writing failed (${response.status} ${response.statusText})`);
      }

      onNotify(`Control ${newRowControlId} successfully exported to Google Sheets.`);
      
      // Clear specific form elements
      setNewRowControlId('');
      setNewRowPolicy('');
      setNewRowRemarks('');

      // Refresh sheets log
      handleReadLedgerData(spreadsheetId, accessToken);
    } catch (error: any) {
      console.error('Error exporting control row:', error);
      onNotify(`Export error: ${error.message || error}`);
    } finally {
      setIsExportingRecord(false);
    }
  };

  // Color utilities for badges
  const getSeverityBadgeClass = (val: string) => {
    switch (val?.trim()?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20';
      case 'high':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
      case 'validated':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20';
      case 'failed':
        return 'bg-red-200 text-red-900 dark:bg-red-500/20 dark:text-red-400 border border-red-300 dark:border-red-500/35';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border border-slate-200 dark:border-slate-700';
    }
  };

  const isLight = theme === 'light' || theme === 'high-contrast';

  return (
    <div id="sheets-sentinel-view" className="space-y-8 w-full text-left font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2.5 shadow-sm ${
              isLight ? 'bg-slate-100 border border-slate-200 text-slate-800' : 'bg-slate-900/60 border border-slate-800 text-white'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
              Sprint 6 — Workspace Sheets Ledgers
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight uppercase leading-[0.95] ${
             isLight ? 'text-slate-900' : 'text-white'
           }`}>
            Sheets Sentinel <span className="text-emerald-600 dark:text-emerald-400">&amp; Co-Ledger</span>
          </h1>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-555' : 'text-slate-400'}`}>
            Export live SOC 2 and ISO 27001 readiness checklists directly to actual Google Sheets ledgers.
          </p>
        </div>

        {/* Authentication Panel */}
        <div className="flex items-center gap-3">
          {accessToken ? (
            <div className={`flex items-center gap-3 border p-2 pl-4 rounded-xl shadow-sm ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-[#0d211a]/40 border-emerald-800/45'
            }`}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <p className={`text-xs font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{user?.email}</p>
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Sheets Canal Live</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-650 dark:text-red-400 transition-colors cursor-pointer"
                title="Disconnect Google Sheets"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectSheets}
              disabled={isConnecting}
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-550 hover:to-emerald-450 hover:scale-[1.01] text-white text-xs font-bold font-sans px-5 py-3 rounded-xl border border-emerald-400/20 shadow-md cursor-pointer disabled:opacity-50 transition-all select-none"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Activating OAuth Canal...</span>
                </>
              ) : (
                <>
                  <svg className="h-4.5 w-4.5 fill-white" viewBox="0 0 48 48">
                    <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Connect Google Sheets API</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Link & Registry Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 border rounded-2xl shadow-sm space-y-6 transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#15122c]/40 border-slate-800/80'
          }`}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Database className="h-4 h-4 text-emerald-500" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Audit Ledger Link
              </h3>
            </div>

            {/* Document Creation Panel */}
            <div className="space-y-3">
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Generate a decentralized compliance ledger instantly inside your Drive containing strict auditor matrices:
              </p>
              
              <button
                type="button"
                onClick={handleCreateEnterpriseLedger}
                disabled={isCreatingSheet || !accessToken}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl border border-emerald-500/20 shadow-sm cursor-pointer transition-all disabled:opacity-50 select-none"
              >
                {isCreatingSheet ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Inscribing Ledger...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Enterprise Sheets Ledger</span>
                  </>
                )}
              </button>
            </div>

            {/* Link Existing document input */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Link Existing Spreadsheet ID
              </label>
              <p className={`text-[10px] leading-relaxed ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                Extract the unique key from the spreadsheet's URL address bar to bind records manually.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="E.g. 1aB2c3D4e5F6g7..."
                  className={`w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                />
                
                {accessToken && (
                  <button
                    type="button"
                    onClick={() => handleReadLedgerData(spreadsheetId, accessToken)}
                    disabled={isLoadingRows || !spreadsheetId.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Fetch &amp; Align Records
                  </button>
                )}
              </div>
            </div>

            {/* Open External Sheet Link */}
            {spreadsheetUrl && (
              <div className={`pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs p-3.5 rounded-xl border ${
                isLight ? 'bg-emerald-50/50 border-emerald-200 text-slate-850' : 'bg-emerald-950/10 border-emerald-900/40 text-emerald-200'
              }`}>
                <div className="truncate pr-2">
                  <span className="font-bold text-[10px] font-mono block mb-1 uppercase tracking-wider text-emerald-650 dark:text-emerald-400">Ledger Integrated</span>
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold underline hover:text-emerald-700 dark:hover:text-white inline-flex items-center gap-1 font-mono truncate max-w-[200px]"
                  >
                    Launch Google Spreadsheet <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>
            )}
            
            {!accessToken && (
              <div className={`p-3 border rounded-xl flex items-start gap-2.5 text-left text-xs ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/10 border-amber-900/40 text-amber-350'
              }`}>
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Audit Sandbox:</strong> Real-time modifications are simulated locally. Log in to export data securely into your official Google Workspace files.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Create log entry Form and Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Add entry form card */}
          <div className={`p-6 border rounded-2xl shadow-sm space-y-5 transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#15122c]/40 border-slate-800/80'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5 gap-4">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-emerald-500" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  Export Compliance Audit Row
                </h3>
              </div>
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Target Tab:</span>
                <select
                  value={activeSheetName}
                  onChange={(e) => {
                    setActiveSheetName(e.target.value);
                    if (accessToken && spreadsheetId) handleReadLedgerData(spreadsheetId, accessToken);
                  }}
                  className={`text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                    isLight 
                      ? 'bg-slate-100 text-slate-800 border border-slate-300' 
                      : 'bg-slate-900 text-emerald-400 border border-slate-800'
                  }`}
                >
                  {sheetsNamesList.map((name, i) => (
                    <option key={i} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleExportControlRow} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="space-y-1.5 text-left">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Control ID</label>
                <input
                  type="text"
                  required
                  value={newRowControlId}
                  onChange={(e) => setNewRowControlId(e.target.value)}
                  placeholder="E.g. A.5.15 or CC6.1"
                  className={`w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Framework Scope</label>
                <select
                  value={newRowFramework}
                  onChange={(e) => setNewRowFramework(e.target.value)}
                  className={`w-full font-sans text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                >
                  <option value="ISO 27001:2022">ISO 27001:2022</option>
                  <option value="SOC 2 Type II">SOC 2 Type II</option>
                  <option value="NIST Cybersecurity Framework">NIST Cybersecurity Framework</option>
                  <option value="SecOps Internal Policy">SecOps Alignment</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2 text-left">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Security Policy / Remediation Criteria</label>
                <input
                  type="text"
                  required
                  value={newRowPolicy}
                  onChange={(e) => setNewRowPolicy(e.target.value)}
                  placeholder="E.g. Secure administrative credentials over active SSH keys"
                  className={`w-full font-sans text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Severity Associated</label>
                <select
                  value={newRowPriority}
                  onChange={(e) => setNewRowPriority(e.target.value as any)}
                  className={`w-full font-sans text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Audit Validation Status</label>
                <select
                  value={newRowStatus}
                  onChange={(e) => setNewRowStatus(e.target.value as any)}
                  className={`w-full font-sans text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                >
                  <option value="Validated">Validated (Compliant)</option>
                  <option value="Pending Mitigation">Pending Mitigation</option>
                  <option value="Under Audit">Under Audit</option>
                  <option value="Failed">Failed (Non-compliant)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2 text-left">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Auditor Validation Remarks / Metadata Evidence</label>
                <textarea
                  value={newRowRemarks}
                  onChange={(e) => setNewRowRemarks(e.target.value)}
                  rows={2}
                  placeholder="Specify the active secure artifacts linked to this evidence..."
                  className={`w-full font-sans text-xs p-3 rounded-xl border outline-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500/80 focus:bg-white' 
                      : 'bg-slate-950/60 border-slate-800 text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isExportingRecord || !accessToken}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50 select-none"
                >
                  {isExportingRecord ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Writing Google Sheets Register...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4.5 w-4.5" />
                      <span>{accessToken ? "Export Record to Google Sheets Ledger" : "OAuth Authentication Required to Export"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Table display */}
          <div className={`p-6 border rounded-2xl shadow-sm space-y-4 transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#15122c]/40 border-slate-800/80'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-left">
                <Table className="h-4 w-4 text-emerald-500" />
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  Ledger Register: <span className="font-mono text-emerald-600 dark:text-emerald-400">{activeSheetName}</span>
                </h4>
              </div>

              {accessToken && spreadsheetId && (
                <button
                  onClick={() => handleReadLedgerData(spreadsheetId, accessToken)}
                  disabled={isLoadingRows}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 disabled:opacity-50 transition-colors select-none cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingRows ? 'animate-spin' : ''}`} />
                  Sync Align
                </button>
              )}
            </div>

            {/* Structured responsive grid layout tables */}
            <div className={`overflow-x-auto rounded-xl border ${
              isLight ? 'border-slate-200' : 'border-slate-800 bg-slate-950/40'
            }`}>
              {isLoadingRows ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <RefreshCw className="h-7 w-7 text-emerald-500 animate-spin" />
                  <p className="mt-2.5 text-xs text-slate-400 font-sans font-medium">Downloading latest Google Sheets ledger rows...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className={`border-b text-[10px] font-mono uppercase tracking-wider ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}>
                      <th className="p-4 font-bold text-left">Control &amp; Scope</th>
                      <th className="p-4 font-bold text-left">Audit Policy Description</th>
                      <th className="p-4 font-bold text-center">Severity</th>
                      <th className="p-4 font-bold text-center">Status</th>
                      <th className="p-4 font-bold text-left">Check Date</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isLight ? 'divide-slate-200/60' : 'divide-slate-850'
                  }`}>
                    {(loadedRows.length > 0 ? loadedRows.slice(1) : MOCK_ROWS.slice(1)).map((row, index) => {
                      const [date, cid, framework, policy, prio, status, remarks] = row;
                      return (
                        <tr key={index} className={`transition-colors text-xs ${
                          isLight ? 'hover:bg-slate-50/75' : 'hover:bg-slate-900/30'
                        }`}>
                          <td className="p-4 align-top">
                            <span className={`font-mono font-bold block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                              {cid || "N/A"}
                            </span>
                            <span className="text-[10px] text-slate-450 font-mono block mt-0.5">{framework || "Unknown"}</span>
                          </td>
                          <td className="p-4 align-top max-w-[280px]">
                            <p className={`font-semibold truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`} title={policy}>
                              {policy || "N/A"}
                            </p>
                            <span className={`text-[10.5px] line-clamp-1 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} title={remarks}>
                              {remarks || ""}
                            </span>
                          </td>
                          <td className="p-4 align-top text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${getSeverityBadgeClass(prio)}`}>
                              {prio || "Medium"}
                            </span>
                          </td>
                          <td className="p-4 align-top text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold ${getSeverityBadgeClass(status)}`}>
                              {status || "Validated"}
                            </span>
                          </td>
                          <td className={`p-4 align-top text-[10.5px] font-mono whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {date || "2026-05-25 12:00"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};
