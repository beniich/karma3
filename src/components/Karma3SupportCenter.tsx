import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  PhoneCall, 
  ExternalLink, 
  ChevronRight, 
  Send, 
  MessageSquare,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

export const Karma3SupportCenter = ({ onNotify }: { onNotify: (msg: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [showExpertChat, setShowExpertChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'expert', text: 'Bonjour ! Je suis un expert de Sovereign Device Karma3. Comment puis-je vous aider aujourd\'hui sur ReclamTrack Pro ?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    { q: "Comment configurer 2FA (Two-Factor Authentication) ?", a: "Allez sur la page de configuration ou de profil, puis activez le bouton à bascule 'Two-Factor Authentication (2FA)'. Un code SMS/OTP de validation sera automatiquement généré lors de la prochaine connexion." },
    { q: "Qu'est-ce que la tension d'admission par ambulance ?", a: "Il s'agit de la métrique en direct de l'algorithme Santé Connect v2 calculant la capacité des lits de traumatologie urgents restants par rapport au flux des ambulances approchantes." },
    { q: "Comment modifier ou exécuter un automatisme de script ?", a: "Naviguez vers notre Bibliothèque de scripts (Script Library), éditez la fonction 'executeScript' ou cliquez sur 'EXECUTER SCRIPT' pour simuler son empreinte numérique satellite sécurisée." },
    { q: "Où se trouvent les clés d'API cryptées ?", a: "Nos clés de sécurité sont confinées dans le service de micro-traitement local chiffré AES-256 sans transfert cloud pour garantir la souveraineté complète de vos données." }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const userQuery = chatInput;
    setChatInput('');

    setTimeout(() => {
      let reply = "Je transmets votre demande : '" + userQuery + "' à nos ingénieurs de niveau 3. Nous vous recontactons d'ici 5 minutes.";
      if (userQuery.toLowerCase().includes('erreur') || userQuery.toLowerCase().includes('panne')) {
        reply = "⚠️ Signal d'anomalie détecté. Notre passerelle de résilience a ouvert un ticket prioritaire. Un diagnostic SSH automatisé est en cours.";
      } else if (userQuery.toLowerCase().includes('pay') || userQuery.toLowerCase().includes('tarif') || userQuery.toLowerCase().includes('abonner')) {
        reply = "💳 Service de mise à niveau détecté. Nos forfaits (Starter à 99€, Pro à 299€ ou Enterprise à 599€) sont gérés de manière sécurisée sous conformité PCI-DSS.";
      }
      setChatMessages(prev => [...prev, { sender: 'expert', text: reply }]);
      onNotify("💬 Message reçu par le centre d'assistance expert.");
    }, 1200);
  };

  return (
    <div className="min-h-screen text-[#cbd5e1] font-sans text-left relative p-1 md:p-4 select-none">
      
      {/* Background Ornate Aura Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[120px] bg-indigo-900/10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] bg-orange-600/5 pointer-events-none" />

      {/* Hero header title area */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-8 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-[10px] tracking-widest font-black uppercase">
          <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" /> ReclamTrack Pro Suite
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
          Karma3 Support & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Help Center</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide max-w-2xl mx-auto">
          Sovereign Device Karma3 - Support and technical assistance portal. Retrouvez des réponses immédiates ou discutez avec l'ingénierie globale de garde.
        </p>

        {/* Giant search box matched image */}
        <div className="max-w-2xl mx-auto relative group mt-6">
          <div className="absolute inset-0 bg-orange-500/15 rounded-3xl blur-md group-hover:bg-orange-500/20 transition-all pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher dans le centre d'aide..."
            className="w-full relative z-10 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-550 placeholder-orange-100/70 border border-orange-405/40 text-white font-semibold text-sm md:text-md px-7 py-4.5 rounded-3xl outline-none focus:ring-2 focus:ring-orange-300 transition-all shadow-[0_0_40px_rgba(249,115,22,0.30)]"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <Search className="w-5 h-5 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Core image elements: Three White rounded cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto py-8">
        
        {/* Card 1: FAQ */}
        <motion.div 
          whileHover={{ y: -6 }}
          className="bg-white scroll-py-8 text-slate-900 rounded-[2.2rem] p-8 border-r-8 border-b-8 border-orange-600 flex flex-col justify-between shadow-2xl relative min-h-[380px]"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black uppercase text-orange-600 tracking-tighter italic">FAQ</h2>
            </div>

            <ul className="space-y-3.5 text-left text-sm font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Questions fréquentes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Résolution de problèmes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Guides de base</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => {
              onNotify("Affichage de la base de FAQ dynamique sous le formulaire.");
              const faqEl = document.getElementById('base-faq');
              faqEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-4.5 mt-8 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95"
          >
            Voir la FAQ
          </button>
        </motion.div>

        {/* Card 2: Tutoriels */}
        <motion.div 
          whileHover={{ y: -6 }}
          className="bg-white text-slate-900 rounded-[2.2rem] p-8 border-r-8 border-b-8 border-orange-600 flex flex-col justify-between shadow-2xl relative min-h-[380px]"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black uppercase text-orange-600 tracking-tighter italic">Tutoriels</h2>
            </div>

            <ul className="space-y-3.5 text-left text-sm font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Vidéos de formation</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Documents techniques</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Meilleures pratiques</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => onNotify("🎬 Accès au répertoire vidéo de formation certifiée (Abonnement requis).")}
            className="w-full py-4.5 mt-8 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95"
          >
            Accéder aux Tutoriels
          </button>
        </motion.div>

        {/* Card 3: Contact */}
        <motion.div 
          whileHover={{ y: -6 }}
          className="bg-white text-slate-900 rounded-[2.2rem] p-8 border-r-8 border-b-8 border-orange-600 flex flex-col justify-between shadow-2xl relative min-h-[380px]"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black uppercase text-orange-600 tracking-tighter italic">Contact</h2>
            </div>

            <ul className="space-y-3.5 text-left text-sm font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Support technique</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Service client</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Partenariats</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => {
              setShowExpertChat(true);
              onNotify("📱 Console d'assistance instantanée ouverte.");
            }}
            className="w-full py-4.5 mt-8 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95"
          >
            Nous Contacter
          </button>
        </motion.div>

      </div>

      {/* Footer support notice matching image */}
      <div className="text-center max-w-md mx-auto space-y-4 pt-10 pb-12">
        <p className="text-orange-400 font-extrabold text-md md:text-lg tracking-tight">
          Besoin d'aide supplémentaire ? Contactez notre équipe.
        </p>

        {/* Centered big white pill button */}
        <button
          onClick={() => setShowExpertChat(true)}
          className="inline-flex items-center gap-2 px-10 py-4.5 bg-white hover:bg-orange-50 border border-slate-100 rounded-full text-slate-900 font-black tracking-wide text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-orange-500" /> Discuter avec un expert
        </button>
      </div>

      {/* FAQ Base section underneath */}
      <div id="base-faq" className="max-w-4xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] mt-6 scroll-mt-6 text-left">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          Base de Connaissances - FAQ
        </h3>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-800/60 pb-3">
              <button 
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full py-3 flex justify-between items-center text-left hover:text-white font-semibold text-xs"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${activeFAQ === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeFAQ === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-slate-400 text-[11px] leading-relaxed pl-1 pb-2 font-medium"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-6 text-slate-500 italic text-xs">
              Aucune FAQ ne correspond à votre recherche. Saisissez une autre requête.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Expert chat screen drawer/modal */}
      <AnimatePresence>
        {showExpertChat && (
          <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="bg-[#0f0827] border border-orange-500/30 rounded-[2rem] shadow-24 overflow-hidden flex flex-col max-h-[480px]"
            >
              <div className="bg-[#1c0e3e] px-5 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Expert Support en Direct</span>
                </div>
                <button 
                  onClick={() => setShowExpertChat(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[220px]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-[85%] rounded-2xl text-[10.5px] leading-relaxed font-semibold font-sans ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-[#1e1346] text-slate-200 rounded-tl-none border border-slate-800/80'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action input bar */}
              <form onSubmit={sendChatMessage} className="p-3 border-t border-slate-800 bg-black/40 flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez votre question technique ici..."
                  className="flex-1 bg-[#150a30] border border-[#3e248b]/50 px-3 py-2.5 rounded-xl text-[11px] text-white outline-none focus:border-orange-500"
                />
                <button 
                  type="submit"
                  className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
