export interface Risk {
  id: string;
  domain: string;
  desc: string;
  crit: 'Critical' | 'High' | 'Medium';
  impact: string;
}

export interface Zone {
  name: string;
  claims: number;
  cause: string;
  solution: string;
  prio: 'Critical' | 'High' | 'Medium';
}

export interface Recommendation {
  id: string;
  title: string;
  icon: string;
  color: 'red' | 'orange' | 'blue';
  list: string[];
}

export interface Document {
  id: string;
  ref: string;
  title: string;
  obj: string;
  nature: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface OrgNode {
  id: string;
  role: string;
  name: string;
  sub?: string;
  teamName?: string;
  isProblematic?: boolean;
  autonomyLevel?: number; // 0 to 100
}

export interface Service {
  id: string;
  name: string;
  status: 'Active' | 'Warning' | 'Maintenance';
  efficiency: number;
  lastUpdate: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Subscriber {
  id: string;
  name: string;
  organization: string;
  email: string;
  plan: 'Expert' | 'Corporate' | 'Enterprise';
  status: 'Active' | 'Pending' | 'Expired';
  joinedDate: string;
}

export interface DashboardData {
  risks: Risk[];
  zones: Zone[];
  recommendations: Recommendation[];
  complianceDocs: Document[];
  services: Service[];
  employees: Employee[];
  subscribers: Subscriber[];
  performance: {
    security: number;
    material: number;
    legal: number;
    management: number;
    digital: number;
    delay: number;
  };
  orgChart: {
    director: OrgNode;
    intermediates: OrgNode[];
    supervisors: OrgNode[];
    teams: OrgNode[];
  };
}

export const INITIAL_DATA: DashboardData = {
  risks: [
    { id: 'R1', domain: 'Matériel', desc: 'Équipements ÉPI hors-normes / Échelles vétustes', crit: 'Critical', impact: 'Accidents corporels / Sanctions légales' },
    { id: 'R2', domain: 'Réglementaire', desc: 'Amplitudes horaires non conformes (Transitions T2/T3)', crit: 'Critical', impact: 'Non-conformité Art. 184 – fatigue extrême' },
    { id: 'R3', domain: 'Management', desc: 'Directives contraires aux protocoles de sécurité', crit: 'Critical', impact: 'Responsabilité pénale / Culture sécurité dégradée' },
    { id: 'R4', domain: 'Logistique', desc: 'Vétusté du parc automobile et manque d\'outillage', crit: 'High', impact: 'Rupture de service / Perte de productivité' },
    { id: 'R5', domain: 'RH', desc: 'Décalage Habilitations ≠ Postes officiels', crit: 'High', impact: 'Démotivation / Erreurs d\'affectation technique' },
  ],
  zones: [
    { name: 'Zone A (Centre)', claims: 47, cause: 'Câblage BT vétuste', solution: 'Remplacement complet prioritaire', prio: 'Critical' },
    { name: 'Zone B (Nord)', claims: 31, cause: 'Surcharge Transformateurs', solution: 'Ajout transformateur + équilibrage', prio: 'Critical' },
    { name: 'Zone C (Industrie)', claims: 28, cause: 'Pics de charge', solution: 'Programme délestage préventif', prio: 'High' },
  ],
  recommendations: [
    { id: 'RE1', title: 'Pilier 1 : Risques & Sécurité', icon: 'ShieldAlert', color: 'red', list: ['Analyse exhaustive avant travaux', 'Balisage et sanctuarisation zone', 'Maîtrise totale des EPI/EPC'] },
    { id: 'RE2', title: 'Pilier 2 : Consignation Électrique', icon: 'Zap', color: 'red', list: ['Cycle complet : Séparation, Condamnation, Identification', 'Application stricte du protocole VAT', 'Responsabilité juridique de signature'] },
    { id: 'RE3', title: 'Pilier 3 : Qualité & Gestion Chantier', icon: 'Settings', color: 'orange', list: ['Optimisation des flux d\'intervention', 'Standardisation de la communication client', 'Remise en état systématique du site'] },
    { id: 'RE4', title: 'Pilier 4 : Reporting Digital', icon: 'FileText', color: 'blue', list: ['Méthode : Faits → Causes → Actions → Résultats', 'Traçabilité via plateforme REDAL', 'Archivage réglementaire et protection légale'] },
  ],
  complianceDocs: [
    { id: 'D1', ref: 'RSO-001', title: 'Rapport de Pilotage Managérial', obj: 'Cadre Officiel - Alerte de Responsabilité', nature: 'Official Framework', priority: 'Critical' },
    { id: 'D2', ref: 'PROF-002', title: 'Programme de Professionnalisation', obj: 'Stratégie Avenir - Mutation enExpert', nature: 'Strategic Roadmap', priority: 'High' },
    { id: 'D3', ref: 'LT-01', title: 'Demande Renouvellement EPI', obj: 'Urgence Légale - Casques/Chaussures/Outillage', nature: 'Legal Urgency', priority: 'Critical' },
    { id: 'D4', ref: 'LT-04', title: 'Plan de Repositionnement RH', obj: 'Optimisation des compétences terrain', nature: 'Optimization', priority: 'High' },
    { id: 'D5', ref: 'LT-09', title: 'Plan de Sensibilisation Sécurité', obj: 'Prévention proactive des accidents', nature: 'Prevention Plan', priority: 'Medium' },
  ],
  services: [
    { id: 'S1', name: 'Network Maintenance', status: 'Active', efficiency: 88, lastUpdate: '1h ago' },
    { id: 'S2', name: 'Technical Support', status: 'Active', efficiency: 95, lastUpdate: '30m ago' },
    { id: 'S3', name: 'Logistics & Fleet', status: 'Warning', efficiency: 62, lastUpdate: '5m ago' },
    { id: 'S4', name: 'Solar Deployment', status: 'Maintenance', efficiency: 45, lastUpdate: '2h ago' },
  ],
  employees: [
    { id: 'E1', name: 'Alice Smith', role: 'Compliance Officer', email: 'alice.smith@karma3.com', phone: '+1 555-0101' },
    { id: 'E2', name: 'Bob Jones', role: 'Security Specialist', email: 'bob.jones@karma3.com', phone: '+1 555-0202' },
    { id: 'E3', name: 'Charlie Davis', role: 'Technical Lead', email: 'charlie.davis@karma3.com', phone: '+1 555-0303' },
  ],
  subscribers: [
    { id: 'SUB-001', name: 'Jean Dupont', organization: 'Electro-Plus Solutions', email: 'j.dupont@electroplus.fr', plan: 'Enterprise', status: 'Active', joinedDate: '2026-01-12' },
    { id: 'SUB-002', name: 'Marie Curie', organization: 'Radon Analytics', email: 'marie@radon.tech', plan: 'Expert', status: 'Active', joinedDate: '2026-03-05' },
    { id: 'SUB-003', name: 'Thomas Edison', organization: 'Lumen Group', email: 't.edison@lumen.com', plan: 'Corporate', status: 'Pending', joinedDate: '2026-05-10' },
    { id: 'SUB-004', name: 'Nikola Tesla', organization: 'Volt Systems', email: 'tesla@volt.io', plan: 'Enterprise', status: 'Active', joinedDate: '2026-02-28' },
    { id: 'SUB-005', name: 'Grace Hopper', organization: 'Logic Corp', email: 'grace@logic.co', plan: 'Corporate', status: 'Expired', joinedDate: '2025-11-15' },
  ],
  performance: {
    security: 22,
    material: 35,
    legal: 28,
    management: 20,
    digital: 10,
    delay: 45
  },
  orgChart: {
    director: { id: 'dir', role: 'General Direction', name: 'DIRECTOR GENERAL', sub: 'Decision-making Authority' },
    intermediates: [
      { id: 'rs', role: 'Service Manager', name: 'General Coordination' },
      { id: 'ce', role: 'Operations Chief', name: 'Operational Steering' },
    ],
    supervisors: [
      { id: 's1', role: 'Supervisor', name: 'Operational Supervisor A', teamName: 'Alpha Squad', autonomyLevel: 85 },
      { id: 's2', role: 'Supervisor', name: 'Operational Supervisor B', teamName: 'Beta Unit', autonomyLevel: 42 },
    ],
    teams: [
      { id: 't1', role: 'Troubleshooting', name: 'Network Emergencies', autonomyLevel: 92 },
      { id: 't2', role: 'Connections', name: 'Standard Connections', autonomyLevel: 65 },
      { id: 't3', role: 'Works', name: 'Planned Interventions', autonomyLevel: 30 },
    ]
  }
};
