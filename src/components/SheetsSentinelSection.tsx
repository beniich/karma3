import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

export const SheetsSentinelSection = ({ onNotify }: { onNotify: (msg: string) => void }) => {
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
  const [newRowPolicy, setNewRowPolicy] = useState('Gestion des accès SSH au Bastion centralisé');
  const [newRowPriority, setNewRowPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [newRowStatus, setNewRowStatus] = useState<'Validated' | 'Pending Mitigation' | 'Under Audit' | 'Failed'>('Validated');
  const [newRowRemarks, setNewRowRemarks] = useState('Configuration de la clé SSH et authentification à deux facteurs validée via Sprint 4.');

  // Mock ledger data for preview (when disconnected)
  const MOCK_ROWS = [
    ["Date de Contrôle", "ID Contrôle", "Référentiel", "Politique de Sécurité", "Criticité", "Statut Remédiation", "Remarques & Auditeur"],
    ["2026-05-25 09:30", "A.8.20", "ISO 27001:2022", "Classification des informations d'entreprise", "High", "Validated", "Fichier config indexé avec succès par le module de Gouvernance."],
    ["2026-05-25 10:15", "CC6.1", "SOC 2 Type II", "Contrôles d'accès logiques et physiques", "Critical", "Pending Mitigation", "Bastion SSH activé. Clés privées en cours d'audit d'intégrité."],
    ["2026-05-25 11:00", "A.12.6", "ISO 27001:2022", "Gestion des vulnérabilités techniques", "Medium", "Validated", "Suite Anti-Abus (Sprint 3) déployée avec détection de double-spending."],
    ["2026-05-25 12:40", "CC7.3", "SOC 2 Type II", "Détection de comportements malveillants", "Critical", "Under Audit", "Lancement du filtre de détection active sur le port 3000."],
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
        onNotify('Connecté avec succès à l\'API Google Sheets !');
        
        // Check if there is a previously cached spreadsheet or load demo
      } else {
        throw new Error('Aucun token d\'accès reçu lors de la connexion.');
      }
    } catch (err: any) {
      console.error('Sheets OAuth Connection Error:', err);
      onNotify(`Échec de connexion Google Sheets : ${err.message || err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    setLoadedRows([]);
    setSpreadsheetId('');
    setSpreadsheetUrl('');
    onNotify('Déconnecté de l\'API Google Sheets.');
  };

  // CREATE New Spreadsheet document
  const handleCreateEnterpriseLedger = async () => {
    if (!accessToken) {
      onNotify('Veuillez d\'abord connecter votre compte Google Sheets.');
      return;
    }

    // MANDATORY USER CONFIRMATION GUARD
    const isConfirmed = window.confirm(
      "Voulez-vous créer une nouvelle feuille de calcul Microsoft Excel / Google Sheets intitulée 'AuditAX Enterprise Audit Ledger' dans votre compte Google Drive ?"
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
        throw new Error(`La création de la Sheets a échoué (${response.status} ${response.statusText})`);
      }

      const ledger = await response.json();
      const generatedId = ledger.spreadsheetId;
      const generatedUrl = ledger.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${generatedId}/edit`;

      setSpreadsheetId(generatedId);
      setSpreadsheetUrl(generatedUrl);
      onNotify('Nouveau Ledger de sécurité créé sur Google Sheets ! Envoi des en-têtes...');

      // Now populate the headers immediately for each sheet!
      await populateInitialSheetHeaders(generatedId, tokenString => tokenString || accessToken);

    } catch (error: any) {
      console.error('Error creating Spreadsheet:', error);
      onNotify(`Erreur de création : ${error.message || error}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Helper to instantly populate initial headers for a newly created spreadsheet
  const populateInitialSheetHeaders = async (id: string, getToken: (v?: any) => string | null) => {
    const token = getToken();
    if (!token || !id) return;

    try {
      const headers = [
        "Date de Contrôle",
        "ID Contrôle",
        "Référentiel",
        "Politique de Sécurité",
        "Criticité",
        "Statut Remédiation",
        "Remarques & Auditeur"
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
        onNotify('En-têtes de conformité injectées avec succès.');
        // Initial load of content
        handleReadLedgerData(id, token);
      } else {
        console.warn('Batch header population returned status:', response.status);
      }

    } catch (err) {
      console.error('Failed to populate headers:', err);
    }
  };

  // READ ledger records from a Spreadsheet
  const handleReadLedgerData = async (targetId?: string, forceToken?: string) => {
    const activeId = targetId || spreadsheetId;
    const activeToken = forceToken || accessToken;

    if (!activeToken) {
      onNotify('Veuillez d\'abord connecter votre compte Google Sheets.');
      return;
    }

    if (!activeId.trim()) {
      onNotify('Veuillez saisir un ID de feuille de calcul valide ou en créer une nouvelle.');
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
        throw new Error(`Échec de la lecture (${response.status} ${response.statusText})`);
      }

      const payload = await response.json();
      
      if (payload.values && payload.values.length > 0) {
        setLoadedRows(payload.values);
        onNotify(`${payload.values.length - 1} entrées de conformité chargées.`);
        
        // Auto update state
        if (!spreadsheetId) {
          setSpreadsheetId(activeId.trim());
          setSpreadsheetUrl(`https://docs.google.com/spreadsheets/d/${activeId.trim()}/edit`);
        }
      } else {
        setLoadedRows([]);
        onNotify('La feuille sélectionnée est vide ou ne possède pas la bonne structure.');
      }
    } catch (error: any) {
      console.error('Error reading details from Sheets:', error);
      onNotify(`Erreur lors de la synchronisation : ${error.message || error}`);
    } finally {
      setIsLoadingRows(false);
    }
  };

  // APPEND row (Write Compliance Ledger Record)
  const handleExportControlRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onNotify('Veuillez d\'abord connecter votre compte Google Sheets.');
      return;
    }

    if (!spreadsheetId.trim()) {
      onNotify('Veuillez d\'abord créer un Ledger ou fournir un ID existant.');
      return;
    }

    // MANDATORY USER CONFIRMATION GUARD
    const isConfirmed = window.confirm(
      `Confirmez-vous l'écriture d'une nouvelle ligne d'audit sur votre feuille Google Sheets ?\n\nContrôle : ${newRowControlId}\nFiltre : ${newRowPolicy}\nStatut : ${newRowStatus}`
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
          `${newRowRemarks} (RSSI: ${user?.email || 'System'})`
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
        throw new Error(`Échec d'écriture (${response.status} ${response.statusText})`);
      }

      onNotify(`Contrôle ${newRowControlId} exporté et consolidé !`);
      
      // Clear specific form elements
      setNewRowControlId('');
      setNewRowPolicy('');
      setNewRowRemarks('');

      // Refresh sheets log
      handleReadLedgerData(spreadsheetId, accessToken);
    } catch (error: any) {
      console.error('Error exporting control row:', error);
      onNotify(`Erreur d'exportation : ${error.message || error}`);
    } finally {
      setIsExportingRecord(false);
    }
  };

  // Format cell based on risk status
  const getSeverityBadgeClass = (val: string) => {
    switch (val?.trim()?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'validated':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border border-red-500/35';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
              Sprint 6 — Workspace Sheets Ledgers
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-sans font-semibold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" /> Sheets Sentinel & Co-Ledger Auditor
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Exportez de vrais rapports d'alignement SOC 2 et ISO 27001 dans des feuilles Google Sheets interactives. Consolidez vos audits de conformité via l'API officielle de Workspace.
          </p>
        </div>

        {/* Authentication Panel */}
        <div className="flex items-center gap-3">
          {accessToken ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 pl-4 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-mono font-medium text-slate-200">{user?.email}</p>
                  <p className="text-[10px] font-mono text-emerald-400">Hub Sheets Modulaire</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                title="Déconnecter Google Sheets"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectSheets}
              disabled={isConnecting}
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-medium font-sans px-4 py-2.5 rounded-xl border border-emerald-400/20 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50 transition-all select-none"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Activation du canal OAuth...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 48 48">
                    <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Connecter Google Sheets API</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create / Configuration Section */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Database className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-sans font-semibold text-slate-100">
                Liaison d'Audit Ledger
              </h3>
            </div>

            {/* Document Creation Panel */}
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Générez un registre d'audit centralisé contenant automatiquement des en-têtes pré-configurées pour notre grille de gouvernance :
              </p>
              
              <button
                type="button"
                onClick={handleCreateEnterpriseLedger}
                disabled={isCreatingSheet || !accessToken}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-emerald-400/20 shadow-md cursor-pointer transition-all disabled:opacity-50 select-none"
              >
                {isCreatingSheet ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Création du Ledger...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    <span>Créer un Ledger Google Sheets</span>
                  </>
                )}
              </button>
            </div>

            {/* Import Existing document input */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block font-sans">
                Ou lier un document existant
              </label>
              <p className="text-[10px] text-slate-500 leading-normal mb-2">
                Insérez l'identifiant extrait de l'adresse de votre feuille Google Sheets.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="ID : 1aB2c3D4e5F6g7..."
                  className="w-full bg-slate-950 font-mono text-xs px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
                
                {accessToken && (
                  <button
                    type="button"
                    onClick={() => handleReadLedgerData(spreadsheetId, accessToken)}
                    disabled={isLoadingRows || !spreadsheetId.trim()}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    Synchroniser les données
                  </button>
                )}
              </div>
            </div>

            {/* Link Preview */}
            {spreadsheetUrl && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                <div className="truncate pr-2">
                  <span className="text-emerald-400 font-mono font-bold block mb-0.5">Statut de livraison</span>
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-300 underline hover:text-white inline-flex items-center gap-1 font-mono truncate max-w-[200px]"
                  >
                    Ouvrir le Ledger externe <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>
            )}
            
            {!accessToken && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2.5 text-left text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Mode Démo Actif :</strong> Authentifiez-vous pour créer et lire de vrais tableaux. Sinon, des données de test simulées sont exposées.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Export controls form and dynamic tables log */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Export compliance row Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-left space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <Send className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-sans font-semibold text-slate-100">
                  Ajouter un Enregistrement de Conformité
                </h3>
              </div>
              
              {/* Active Tab select */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400 mr-1.5">Onglet cible :</span>
                <select
                  value={activeSheetName}
                  onChange={(e) => {
                    setActiveSheetName(e.target.value);
                    if (accessToken && spreadsheetId) handleReadLedgerData(spreadsheetId, accessToken);
                  }}
                  className="bg-slate-950 text-[11px] font-mono text-emerald-400 border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {sheetsNamesList.map((name, i) => (
                    <option key={i} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleExportControlRow} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">ID du Contrôle</label>
                <input
                  type="text"
                  required
                  value={newRowControlId}
                  onChange={(e) => setNewRowControlId(e.target.value)}
                  placeholder="E.g. A.5.15 ou CC6.1"
                  className="w-full bg-slate-950 text-xs font-mono px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Référentiel / Cadre</label>
                <select
                  value={newRowFramework}
                  onChange={(e) => setNewRowFramework(e.target.value)}
                  className="w-full bg-slate-950 text-xs font-mono px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ISO 27001:2022">ISO 27001:2022</option>
                  <option value="SOC 2 Type II">SOC 2 Type II</option>
                  <option value="NIST Cybersecurity Framework">NIST Cybersecurity Framework</option>
                  <option value="Politique Interne SecOps">Politique Interne SecOps</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Assimilé Politique / Remédiation</label>
                <input
                  type="text"
                  required
                  value={newRowPolicy}
                  onChange={(e) => setNewRowPolicy(e.target.value)}
                  placeholder="Rédigez l'action de remédiation ou de gouvernance..."
                  className="w-full bg-slate-950 text-xs font-sans px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Criticité Associée</label>
                <select
                  value={newRowPriority}
                  onChange={(e) => setNewRowPriority(e.target.value as any)}
                  className="w-full bg-slate-950 text-xs font-mono px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Statut de validation d'Audit</label>
                <select
                  value={newRowStatus}
                  onChange={(e) => setNewRowStatus(e.target.value as any)}
                  className="w-full bg-slate-950 text-xs font-mono px-3 py-1.8 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Validated">Validated (Conforme)</option>
                  <option value="Pending Mitigation">Pending Mitigation (En suspens)</option>
                  <option value="Under Audit">Under Audit (Sous Audit)</option>
                  <option value="Failed">Failed (Bloqué / Non-conforme)</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Remarques Annexes, Preuves ou Pièces Jointes</label>
                <textarea
                  value={newRowRemarks}
                  onChange={(e) => setNewRowRemarks(e.target.value)}
                  rows={2}
                  placeholder="Précisez les traces d'audit de l'environnement de production..."
                  className="w-full bg-slate-950 text-xs font-sans p-3 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isExportingRecord || !accessToken}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold py-2.5 px-4 rounded-xl border border-emerald-400/20 shadow-md cursor-pointer transition-all disabled:opacity-50 select-none"
                >
                  {isExportingRecord ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Écriture Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>{accessToken ? "Exporter ce contrôle dans le Ledger" : "Connecter Google Sheets pour Exporter"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Table Ledger live Viewer */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-left space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-sans font-semibold text-slate-100">
                  Vue Live du Registre d'Audit : <span className="font-mono text-emerald-400 text-xs">{activeSheetName}</span>
                </h4>
              </div>

              {accessToken && spreadsheetId && (
                <button
                  onClick={() => handleReadLedgerData(spreadsheetId, accessToken)}
                  disabled={isLoadingRows}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors select-none"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingRows ? 'animate-spin' : ''}`} />
                  Re-télécharger
                </button>
              )}
            </div>

            {/* Display list */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
              {isLoadingRows ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin" />
                  <p className="mt-2 text-xs text-slate-400 font-sans">Récupération des lignes depuis Sheets API...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-[10.5px] font-mono text-slate-400 uppercase tracking-tight">
                      <th className="p-3">Contrôle / Framework</th>
                      <th className="p-3">Politique d'Audit</th>
                      <th className="p-3 text-center">Criticité</th>
                      <th className="p-3 text-center">Statut</th>
                      <th className="p-3 hidden md:table-cell">Date d'audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {(loadedRows.length > 0 ? loadedRows.slice(1) : MOCK_ROWS.slice(1)).map((row, index) => {
                      // Row indexes:
                      // 0: Date
                      // 1: ControlID
                      // 2: Framework
                      // 3: Policy
                      // 4: Priority
                      // 5: Status
                      // 6: Remarks
                      const [date, cid, framework, policy, prio, status, remarks] = row;
                      return (
                        <tr key={index} className="hover:bg-slate-900/30 transition-colors text-xs font-sans">
                          <td className="p-3">
                            <span className="font-mono font-bold text-white block">{cid || "N/A"}</span>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{framework || "Inconnu"}</span>
                          </td>
                          <td className="p-3 max-w-[200px] md:max-w-xs">
                            <p className="text-slate-200 font-medium truncate" title={policy}>{policy || "Sans objet"}</p>
                            <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5" title={remarks}>{remarks || ""}</span>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${getSeverityBadgeClass(prio)}`}>
                              {prio || "Medium"}
                            </span>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${getSeverityBadgeClass(status)}`}>
                              {status || "Validated"}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[10px] font-mono whitespace-nowrap hidden md:table-cell">
                            {date || "2026-05-25"}
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
