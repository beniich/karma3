import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  Send,
  RefreshCw,
  Search,
  Inbox,
  AlertTriangle,
  ShieldCheck,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  SendHorizontal,
  LogOut,
  Sliders,
  Sparkles,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessageDetails {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  headers: {
    subject: string;
    from: string;
    date: string;
  };
  riskRating: 'Critical' | 'Warning' | 'Secure' | 'Informational';
  category: string;
}

export const GmailSentinelSection = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  // Auth & Token state
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // App States
  const [messages, setMessages] = useState<GmailMessageDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('category:primary security OR login OR alert OR incident');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetails | null>(null);
  
  // Send state
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('AuditAX Security report: Continuous Readiness Status');
  const [emailBody, setEmailBody] = useState('<p>Hello,</p><p>This is an automated <strong>AuditAX Readiness Assessment Report</strong>.</p><p>Our active diagnostics show SOC 2 and ISO-27001 continuous alignment is currently healthy at <strong>94% remediation index</strong>.</p><p>Best regards,<br/>Compliance Officer</p>');
  const [isSending, setIsSending] = useState(false);
  const [emailType, setEmailType] = useState<'custom' | 'iso' | 'risk'>('iso');
  
  // Mock previews for non-connected demo mode
  const MOCK_MESSAGES: GmailMessageDetails[] = [
    {
      id: "mock-1",
      threadId: "t-1",
      snippet: "Nous avons détecté une nouvelle connexion suspecte à votre serveur Bastion SSH depuis une adresse IP inhabituelle en Europe centrale. Veuillez vérifier la clé d'activation.",
      internalDate: String(Date.now() - 3600000),
      headers: {
        subject: "[AuditAX-Bastion] Alerte de connexion SSH critique détectée",
        from: "securite@bastion-prod.internal",
        date: new Date(Date.now() - 3600000).toLocaleString()
      },
      riskRating: 'Critical',
      category: 'Bastion Security'
    },
    {
      id: "mock-2",
      threadId: "t-2",
      snippet: "Your monthly security scan reports 0 new vulnerabilities detected in multi-tenant environments. 3 informational recommendations are available to inspect.",
      internalDate: String(Date.now() - 12000000),
      headers: {
        subject: "[CloudSec] Compliance scan SOC 2 summary Report",
        from: "noreply@cloudsec-assessment.com",
        date: new Date(Date.now() - 12000000).toLocaleString()
      },
      riskRating: 'Secure',
      category: 'Compliance'
    },
    {
      id: "mock-3",
      threadId: "t-3",
      snippet: "Ancienne API Key Stripe expirant dans 15 jours. Veuillez procéder au renouvellement automatique depuis votre portail de monétisation pour préserver vos encaissements.",
      internalDate: String(Date.now() - 86400000),
      headers: {
        subject: "[Stripe-Sovereign] Action requise : Clé d'API obsolète",
        from: "billing-services@stripe.com",
        date: new Date(Date.now() - 86400000).toLocaleString()
      },
      riskRating: 'Warning',
      category: 'Financial API'
    }
  ];

  // Sync auth state on mount
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Preset report generators
  useEffect(() => {
    if (emailType === 'iso') {
      setEmailSubject('Rapport d\'Alignement Continu ISO 27001 - AuditAX');
      setEmailBody(`
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">AuditAX : Alignement ISO 27001</h2>
          <p>Bonjour,</p>
          <p>Voici l'état d'alignement continu de nos politiques et infrastructures aux normes de sécurité <strong>ISO 27001:2022</strong> :</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
            <tr style="background-color: #f8fafc;">
              <th style="text-align: left; padding: 8px; border: 1px solid #cbd5e1;">Contrôle Annexe A</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #cbd5e1;">Statut</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #cbd5e1;">A.5 Politiques de sécurité de l'info</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: bold;">✔ Conforme (100%)</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #cbd5e1;">A.8 Gestion des actifs d'info</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; color: #ca8a04; font-weight: bold;">⚠️ Attention (85%)</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #cbd5e1;">A.12 Sécurité d'exploitation (Bastion SSH)</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: bold;">✔ Optimal (98%)</td>
            </tr>
          </table>
          <p>Le score de préparation consolidé est estimé à <strong>94.3%</strong>. Aucune non-conformité majeure n'a été détectée.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 20px; margin-bottom: 20px;" />
          <p style="font-size: 11px; color: #64748b;">Rapport généré automatiquement depuis le module AuditAX Gmail Sentinel.</p>
        </div>
      `);
    } else if (emailType === 'risk') {
      setEmailSubject('Rapport d\'Analyse des Risques SecOps & Mitigations');
      setEmailBody(`
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">AuditAX : Rapport d'Analyse des Risques</h2>
          <p>Bonjour,</p>
          <p>Nous avons identifié les éléments ci-dessous nécessitant une mitigation prioritaire dans notre plan SecOps :</p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
            <strong style="color: #991b1b;">⚠️ Alerte Active : Risque Élevé de Double Spending / Anti-Abus</strong>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #7f1d1d;">Un comportement anomalique a été enregistré d'après la Suite Anti-Abus (Sprint 3) sur plusieurs API Keys tierces.</p>
          </div>
          <p>Recommandations immédiates :</p>
          <ul style="padding-left: 20px;">
            <li>Révoquer la clé API ID: "stripe-sovereign-live" sous 15h.</li>
            <li>Restreindre les ports ouverts sur le Bastion SSH aux adresses IP autorisées.</li>
            <li>Déployer le filtre d'intelligence artificielle de Nexus AI.</li>
          </ul>
          <p>Merci de coordonner ces opérations au plus vite.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 20px;" />
          <p style="font-size: 11px; color: #64748b;">SecOps Sentinel Engine - AuditAX Portal</p>
        </div>
      `);
    } else {
      // Retain manual content or clear it
    }
  }, [emailType]);

  // Connect Google account and fetch Gmail Scopes
  const handleConnectGmail = async () => {
    setIsConnecting(true);
    try {
      const provider = new GoogleAuthProvider();
      // Explicitly ask for Gmail scopes
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        setAccessToken(token);
        setUser(result.user);
        onNotify('Connexion réussie à Google Gmail !');
        // Automatically fetch mails
        fetchEmails(token);
      } else {
        throw new Error('Aucun token d\'accès renvoyé par le fournisseur Google.');
      }
    } catch (error: any) {
      console.error('Gmail OAuth Connection Error:', error);
      onNotify(`Erreur d'authentification : ${error.message || error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    setMessages([]);
    setSelectedMessage(null);
    onNotify('Déconnexion de Gmail Sentinel effectuée.');
  };

  // Analyze subject risk rating
  const analyzeRisk = (subject: string, snippet: string): { rating: 'Critical' | 'Warning' | 'Secure' | 'Informational', cat: string } => {
    const fullText = (subject + ' ' + snippet).toLowerCase();
    
    let rating: 'Critical' | 'Warning' | 'Secure' | 'Informational' = 'Informational';
    let cat = 'Général';

    if (fullText.includes('critical') || fullText.includes('critique') || fullText.includes('incident') || fullText.includes('phishing') || fullText.includes('intrusion') || fullText.includes('abuse')) {
      rating = 'Critical';
      cat = 'Alerte Critique';
    } else if (fullText.includes('warning') || fullText.includes('alerte') || fullText.includes('expir') || fullText.includes('action requise') || fullText.includes('suspect')) {
      rating = 'Warning';
      cat = 'Alerte Spectre';
    } else if (fullText.includes('iso') || fullText.includes('compliance') || fullText.includes('soc 2') || fullText.includes('audit') || fullText.includes('conform')) {
      rating = 'Secure';
      cat = 'Conformité';
    } else {
      rating = 'Informational';
      cat = 'Information';
    }

    return { rating, cat };
  };

  // Real API integration: Fetch emails from inbox
  const fetchEmails = async (tokenString: string) => {
    const activeToken = tokenString || accessToken;
    if (!activeToken) return;

    setIsLoading(true);
    try {
      const qEncoded = encodeURIComponent(searchQuery);
      const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${qEncoded}&maxResults=10`;
      
      const response = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (!response.ok) {
        throw new Error(`La requête API Gmail a échoué (${response.status} ${response.statusText})`);
      }

      const listData = await response.json();
      
      if (!listData.messages || listData.messages.length === 0) {
        setMessages([]);
        onNotify('Aucun email de sécurité correspondant à vos filtres.');
        setIsLoading(false);
        return;
      }

      // Fetch details of each email in parallel
      const detailedMessages = await Promise.all(
        listData.messages.map(async (msg: { id: string, threadId: string }) => {
          const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`;
          const detailRes = await fetch(detailUrl, {
            headers: { Authorization: `Bearer ${activeToken}` }
          });
          
          if (!detailRes.ok) return null;
          const details = await detailRes.json();
          
          // Parse headers
          const headersList: GmailMessageHeader[] = details.payload.headers || [];
          const getHeader = (name: string) => headersList.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || 'Inconnu';
          
          const subject = getHeader('subject');
          const from = getHeader('from');
          const date = getHeader('date');

          const analysis = analyzeRisk(subject, details.snippet);

          return {
            id: details.id,
            threadId: details.threadId,
            snippet: details.snippet,
            internalDate: details.internalDate,
            headers: {
              subject,
              from,
              date
            },
            riskRating: analysis.rating,
            category: analysis.cat
          } as GmailMessageDetails;
        })
      );

      // Filter out failures
      const finalMsg = detailedMessages.filter((m): m is GmailMessageDetails => m !== null);
      setMessages(finalMsg);
      onNotify(`${finalMsg.length} messages de sécurité synchronisés.`);
    } catch (err: any) {
      console.error('Error fetching Gmail messages:', err);
      onNotify(`Erreur lors du chargement : ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Real API integration: Send emails via user's mailbox
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onNotify('Veuillez d\'abord connecter votre compte Gmail.');
      return;
    }

    if (!emailTo.trim() || !emailSubject.trim()) {
      onNotify('Veuillez remplir les champs Destinataire et Objet.');
      return;
    }

    // MANDATORY USER CONFIRMATION GUARD
    const isConfirmed = window.confirm(
      `Confirmez-vous l'envoi de cet email de sécurité à "${emailTo}" ?\n\nSujet : ${emailSubject}\n\nCette action utilisera votre propre compte Gmail AuditAX.`
    );
    if (!isConfirmed) return;

    setIsSending(true);
    try {
      // Build MIME base64 text
      const emailContent = [
        `To: ${emailTo.trim()}`,
        `From: ${user?.email || 'me'}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(emailSubject)))}?=`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        emailBody
      ].join('\r\n');

      const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedEmail })
      });

      if (!response.ok) {
        throw new Error(`Échec de l'envoi (${response.status} ${response.statusText})`);
      }

      onNotify(`Email envoyé avec succès à ${emailTo} !`);
      
      // Clear forms
      setEmailTo('');
      if (emailType === 'custom') {
        setEmailSubject('');
        setEmailBody('');
      }
    } catch (error: any) {
      console.error('Error sending GMail message:', error);
      onNotify(`Erreur lors de l'envoi : ${error.message || error}`);
    } finally {
      setIsSending(false);
    }
  };

  // Safe visual representations of risk severity
  const getRiskBadge = (rating: string) => {
    switch (rating) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/20">Critical</span>;
      case 'Warning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Warning</span>;
      case 'Secure':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SecOps Check</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">Audit Trail</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sentinel Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-medium border border-blue-500/20">
              Sprint 5 — Workspace
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-sans font-semibold tracking-tight text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-400" /> Sentinel Gmail Audit & Dispatcher
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Validez votre alignement continu et centralisez la recherche d'incidents par scans d'inbox OAuth de sécurité. Envoyez des rapports certifiés de conformité SecOps.
          </p>
        </div>

        {/* Connection Widget */}
        <div className="flex items-center gap-3">
          {accessToken ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 pl-4 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-mono font-medium text-slate-200">{user?.email}</p>
                  <p className="text-[10px] font-mono text-emerald-400/90">Connecté par Hub OAuth</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-red-400 text-slate-400 transition-colors"
                title="Déconnecter Gmail Sentinel"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGmail}
              disabled={isConnecting}
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-medium font-sans px-4 py-2.5 rounded-xl border border-blue-400/20 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 transition-all select-none"
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
                  <span>Connecter Gmail Sentinel</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inbox / Scans Side */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
            
            {/* Inbox Title & Operations Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-sans font-semibold text-slate-100">
                  Inbox Scanner {accessToken ? <span className="text-emerald-400 font-mono text-[10px] ml-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Live Synchronized</span> : <span className="text-slate-500 font-mono text-[10px] ml-1 bg-slate-800 px-1.5 py-0.5 rounded-full">Demo Simulation</span>}
                </h3>
              </div>
              
              {accessToken && (
                <button
                  onClick={() => fetchEmails(accessToken)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  Re-scanner la boîte
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="space-y-2">
              <label className="text-xs font-sans text-slate-400 block font-medium">Filtre et Requête d'Ingestion Google</label>
              <div className="text-[10px] text-slate-500">
                Vous pouvez formater votre recherche selon la syntaxe officielle de recherche Gmail.
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. category:primary security OR alert..."
                    className="w-full bg-slate-950 font-mono text-xs pl-9 pr-4 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
                {accessToken && (
                  <button
                    onClick={() => fetchEmails(accessToken)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                    title="Rechercher"
                  >
                    <Search className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "Scan SecOps complet", q: "category:primary security OR login OR alert OR incident" },
                  { label: "Alertes d'accès", q: "subject:(access OR auth OR connexion OR login)" },
                  { label: "Remédiation ISO/SOC", q: "subject:(audit OR compliance OR continuous OR compliance)" },
                  { label: "Tout", q: "category:primary text" }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item.q);
                      if (accessToken) fetchEmails(accessToken);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-colors border select-none ${
                      searchQuery === item.q
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mail Container */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
                  <p className="mt-3 text-sm text-slate-400 font-sans">Indexation de votre messagerie Gmail...</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">Requête sécurisée OAuth en cours</p>
                </div>
              ) : (messages.length > 0 ? messages : MOCK_MESSAGES).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-950/30 border border-slate-800 rounded-xl">
                  <Inbox className="h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm text-slate-400 font-semibold font-sans">Aucun email filtré n'a été détecté</p>
                  <p className="text-xs text-slate-500 text-center max-w-sm px-4 mt-1">Votre messagerie semble saine ! Essayez de filtrer plus largement avec le bouton "Tout" ci-dessus.</p>
                </div>
              ) : (
                (messages.length > 0 ? messages : MOCK_MESSAGES).map((msg) => (
                  <motion.div
                    key={msg.id}
                    layoutId={`msg-${msg.id}`}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3.5 bg-slate-950/90 rounded-xl border transition-all text-left cursor-pointer group hover:border-slate-600 ${
                      selectedMessage?.id === msg.id 
                        ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/35' 
                        : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10.5px] font-mono font-medium text-blue-400 tracking-tight truncate max-w-[160px] sm:max-w-xs block">
                            {msg.headers.from.replace(/<.*>/, '')}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">•</span>
                          <span className="text-[9px] font-mono text-slate-400">{msg.headers.date}</span>
                        </div>
                        <h4 className="text-xs font-sans font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mt-1 line-clamp-1">
                          {msg.headers.subject || '(Sujet absent)'}
                        </h4>
                      </div>
                      <div className="shrink-0 flex items-center gap-1">
                        {getRiskBadge(msg.riskRating)}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2 mt-2 leading-relaxed">
                      {msg.snippet}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[9px] font-mono text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {msg.category}
                      </span>
                      <span>ID Google: {msg.id.substring(0, 8)}...</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {!accessToken && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2.5 text-left text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Mode Prévisualisation Démo :</strong> Vous visualisez actuellement des flux d'audits simulés. Cliquez sur "Connecter Gmail Sentinel" pour charger de vrais signaux de SecOps depuis votre boîte Google.
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Console / Compose Email Side */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Email Body Detail Viewer if select */}
          <AnimatePresence mode="wait">
            {selectedMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full mb-1 inline-block">
                      Email d'Audit Sélectionné
                    </span>
                    <h3 className="text-sm font-sans font-semibold text-white">
                      {selectedMessage.headers.subject}
                    </h3>
                    <p className="text-[10.5px] font-mono text-slate-400 mt-1">
                      De : {selectedMessage.headers.from}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Fermer
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl min-h-24">
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                    {selectedMessage.snippet}... (contenu complet chargé)
                  </p>
                </div>
                
                <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-500">
                    <Clock className="h-3.5 w-3.5 inline mr-1 text-slate-500" />
                    Reçu le : {selectedMessage.headers.date}
                  </div>
                  
                  <button
                    onClick={() => {
                      setEmailTo(selectedMessage.headers.from.match(/<([^>]+)>/)?.[1] || selectedMessage.headers.from);
                      setEmailSubject(`RE: ${selectedMessage.headers.subject}`);
                      setEmailBody(`<p>In response to security notice:</p><blockquote style="border-left:2px solid #ccc; padding-left:10px;">${selectedMessage.snippet}</blockquote><p>We are executing active compliance controls on the affected resources.</p>`);
                      setEmailType('custom');
                      onNotify('Champs pré-remplis pour répondre à l\'émetteur !');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors"
                  >
                    Répondre à l'alerte
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secure Report Dispatcher Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm text-left">
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-800">
              <Send className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-sans font-semibold text-slate-100">
                Email Dispatcher & Rapporteur
              </h3>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'iso', label: 'Rapport ISO' },
                  { id: 'risk', label: 'Plan SecOps' },
                  { id: 'custom', label: 'Manuel / Perso' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEmailType(type.id as any)}
                    className={`py-1.5 text-[10.5px] font-sans font-medium rounded-lg border transition-colors select-none ${
                      emailType === type.id
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Destinataire (Auditeur, RSSI...)</label>
                <input
                  type="email"
                  required
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="E.g. russi@enterprise.com"
                  className="w-full bg-slate-950 text-xs font-mono px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Objet de la notification Gmail</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="E.g. Security Audit AX status report"
                  className="w-full bg-slate-950 text-xs font-mono px-3 py-2 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400 font-sans block">Contenu HTML du message</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={6}
                  placeholder="Saisissez ou modifiez le contenu du message à envoyer..."
                  className="w-full bg-slate-950 text-xs font-mono p-3 text-white border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                />
              </div>

              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
                <p className="text-[10px] font-sans text-slate-400 leading-normal">
                  <Lock className="h-3 w-3 text-emerald-400 inline mr-1" />
                  Secured dispatch validation applies. En cliquant sur Envoyer, une requête client sécurisée à l'API Gmail Google de votre boîte active sera déclenchée après confirmation.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSending || !accessToken}
                className="w-full relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold font-sans py-2.5 px-4 rounded-xl border border-blue-400/20 shadow-lg cursor-pointer transition-all disabled:opacity-50 select-none"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Distribution en cours...</span>
                  </>
                ) : (
                  <>
                    <SendHorizontal className="h-3.5 w-3.5" />
                    <span>{accessToken ? 'Envoyer le rapport par Gmail' : 'Connectez Gmail pour Envoyer'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
