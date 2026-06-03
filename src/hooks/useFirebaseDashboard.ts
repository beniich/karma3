import { useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  serverTimestamp,
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { DashboardData, INITIAL_DATA, Risk, Zone, Recommendation, Document, Service, Employee, OrgNode, Subscriber } from '../types';

export function useFirebaseDashboard() {
  const [data, setData] = useState<DashboardData>(() => {
    const saved = localStorage.getItem('auditax_local_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeJob, setActiveJob] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setActiveJob(null);
      return;
    }
    const jobRef = doc(db, 'audit_jobs', user.uid);
    const unsub = onSnapshot(jobRef, (docSnap) => {
      if (docSnap.exists()) {
        setActiveJob(docSnap.data());
      } else {
        setActiveJob(null);
      }
    }, (err) => {
      console.error("Error listening to audit job:", err);
    });
    return () => unsub();
  }, [user]);

  // Helper helper to update local storage
  const updateLocalStateAndStorage = useCallback((updater: (prev: DashboardData) => DashboardData) => {
    setData(prev => {
      const next = updater(prev);
      localStorage.setItem('auditax_local_data', JSON.stringify(next));
      return next;
    });
  }, []);

  const syncInitialData = useCallback(async () => {
    if (!user) return;
    try {
      const batch = writeBatch(db);
      
      const riskCheck = await getDocs(query(collection(db, 'risks'), where('adminId', '==', user.uid)));
      if (riskCheck.empty) {
        INITIAL_DATA.risks.forEach(r => batch.set(doc(db, 'risks', r.id), { ...r, adminId: user.uid }));
        INITIAL_DATA.zones.forEach(z => batch.set(doc(db, 'zones', z.name), { ...z, adminId: user.uid }));
        INITIAL_DATA.recommendations.forEach(r => batch.set(doc(db, 'recommendations', r.id), { ...r, adminId: user.uid }));
        INITIAL_DATA.complianceDocs.forEach(d => batch.set(doc(db, 'docs', d.ref), { ...d, adminId: user.uid }));
        INITIAL_DATA.services.forEach(s => batch.set(doc(db, 'services', s.id), { ...s, adminId: user.uid }));
        INITIAL_DATA.employees.forEach(e => batch.set(doc(db, 'employees', e.id), { ...e, adminId: user.uid }));
        INITIAL_DATA.subscribers.forEach(s => batch.set(doc(db, 'subscribers', s.id), { ...s, adminId: user.uid }));
        batch.set(doc(db, 'configs', user.uid), {
          adminId: user.uid,
          performance: INITIAL_DATA.performance,
          orgChart: INITIAL_DATA.orgChart
        });
        await batch.commit();
      }
    } catch (err) {
      console.error("Initial sync failed:", err);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        // Auto sign-in to Demo Guest Mode to show the application immediately with zero barriers
        setUser({
          uid: 'demo_user_123',
          displayName: 'Sovereign Auditor',
          email: 'auditor-guest@auditax.internal',
          photoURL: null,
        } as any);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const enableDemoMode = useCallback(() => {
    setUser({
      uid: 'demo_user_123',
      displayName: 'Sovereign Auditor',
      email: 'auditor-guest@auditax.internal',
      photoURL: null,
    } as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    if (user) {
      if (user.uid === 'demo_user_123') {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      const initAndListen = async () => {
        await syncInitialData();

        // --- 1. CHARGEMENT PONCTUEL (Données Statiques) ---
        // On récupère tout d'un coup pour éviter 5 listeners inutiles
        try {
          const staticCollections = [
            { col: 'zones', key: 'zones' },
            { col: 'docs', key: 'complianceDocs' },
            { col: 'services', key: 'services' },
            { col: 'employees', key: 'employees' },
          ];

          const staticDataUpdates: any = {};

          await Promise.all(staticCollections.map(async ({ col, key }) => {
            const q = query(collection(db, col), where('adminId', '==', user.uid));
            const snap = await getDocs(q);
            staticDataUpdates[key] = snap.docs.map(d => ({ ...d.data() } as any));
          }));

          // On récupère aussi la config (un seul document)
          const configSnap = await getDoc(doc(db, 'configs', user.uid));
          if (configSnap.exists()) {
            const config = configSnap.data();
            staticDataUpdates.performance = config.performance;
            staticDataUpdates.orgChart = config.orgChart;
          }

          // On met à jour le state UNE SEULE FOIS pour toutes les données statiques
          setData(prev => ({ ...prev, ...staticDataUpdates }));

        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'static-data-fetch');
        }

        // --- 2. LISTENERS TEMPS RÉEL (Données Critiques) ---
        // On ne garde que le strict nécessaire pour la réactivité
        
        const liveCollections = [
          { col: 'risks', key: 'risks' },
          { col: 'recommendations', key: 'recommendations' },
          { col: 'subscribers', key: 'subscribers' },
        ];

        liveCollections.forEach(({ col, key }) => {
          const q = query(collection(db, col), where('adminId', '==', user.uid));
          const unsub = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(d => ({ ...d.data() } as any));
            setData(prev => ({ ...prev, [key]: items }));
          }, (err) => handleFirestoreError(err, OperationType.LIST, col));
          
          unsubscribes.push(unsub);
        });

        setLoading(false);
      };

      initAndListen();
    } else {
      setLoading(false);
    }

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [user, syncInitialData]);

  // Update Actions
  const updateRisk = async (id: string, updates: Partial<Risk>) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'risks', id), { ...updates, updatedAt: serverTimestamp() });
      } catch (err) { handleFirestoreError(err, OperationType.UPDATE, `risks/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        risks: prev.risks.map(r => r.id === id ? { ...r, ...updates } : r)
      }));
    }
  };

  const addRisk = async (risk: Risk) => {
    if (user) {
      try {
        await setDoc(doc(db, 'risks', risk.id), { ...risk, adminId: user.uid, updatedAt: serverTimestamp() });
      } catch (err) { handleFirestoreError(err, OperationType.CREATE, `risks/${risk.id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        risks: [...prev.risks, risk]
      }));
    }
  };

  const removeRisk = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'risks', id));
      } catch (err) { handleFirestoreError(err, OperationType.DELETE, `risks/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        risks: prev.risks.filter(r => r.id !== id)
      }));
    }
  };

  const updateZone = async (name: string, updates: Partial<Zone>) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'zones', name), { ...updates, updatedAt: serverTimestamp() });
      } catch (err) { handleFirestoreError(err, OperationType.UPDATE, `zones/${name}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        zones: prev.zones.map(z => z.name === name ? { ...z, ...updates } : z)
      }));
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    if (user) {
      try {
        await setDoc(doc(db, 'services', id), { ...updates, adminId: user.uid }, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `services/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    }
  };

  const removeService = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch (err) { handleFirestoreError(err, OperationType.DELETE, `services/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== id)
      }));
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    if (user) {
      try {
        await setDoc(doc(db, 'employees', id), { ...updates, adminId: user.uid }, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `employees/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        employees: prev.employees.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  };

  const removeEmployee = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'employees', id));
      } catch (err) { handleFirestoreError(err, OperationType.DELETE, `employees/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        employees: prev.employees.filter(e => e.id !== id)
      }));
    }
  };

  const updateConfig = async (updates: any) => {
    if (user) {
      try {
        await setDoc(doc(db, 'configs', user.uid), { ...updates, adminId: user.uid }, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `configs/${user.uid}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        ...updates
      }));
    }
  };

  const updateRecommendation = async (id: string, updates: Partial<Recommendation>) => {
    if (user) {
      try {
        await setDoc(doc(db, 'recommendations', id), { ...updates, adminId: user.uid }, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `recommendations/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        recommendations: prev.recommendations.map(r => r.id === id ? { ...r, ...updates } : r)
      }));
    }
  };

  const updateDocument = async (ref: string, updates: Partial<Document>) => {
    if (user) {
      try {
        await setDoc(doc(db, 'docs', ref), { ...updates, adminId: user.uid }, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `docs/${ref}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        complianceDocs: prev.complianceDocs.map(d => d.ref === ref ? { ...d, ...updates } : d)
      }));
    }
  };

  const addDocument = async (docObj: Document) => {
    if (user) {
      try {
        await setDoc(doc(db, 'docs', docObj.ref), { ...docObj, adminId: user.uid });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `docs/${docObj.ref}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        complianceDocs: [...(prev.complianceDocs || []), docObj]
      }));
    }
  };

  const removeDocument = async (ref: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'docs', ref));
      } catch (err) { handleFirestoreError(err, OperationType.DELETE, `docs/${ref}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        complianceDocs: (prev.complianceDocs || []).filter(d => d.ref !== ref)
      }));
    }
  };

  const addSubscriber = async (sub: Subscriber) => {
    if (user) {
      try {
        await setDoc(doc(db, 'subscribers', sub.id), { ...sub, adminId: user.uid });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `subscribers/${sub.id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        subscribers: [...(prev.subscribers || []), sub]
      }));
    }
  };

  const removeSubscriber = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'subscribers', id));
      } catch (err) { handleFirestoreError(err, OperationType.DELETE, `subscribers/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        subscribers: (prev.subscribers || []).filter(s => s.id !== id)
      }));
    }
  };

  const updateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    if (user) {
      try {
         await setDoc(doc(db, 'subscribers', id), { ...updates }, { merge: true });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `subscribers/${id}`); }
    } else {
      updateLocalStateAndStorage(prev => ({
        ...prev,
        subscribers: (prev.subscribers || []).map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    }
  };

  return { 
    data, 
    loading, 
    user, 
    activeJob,
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
  };
}
