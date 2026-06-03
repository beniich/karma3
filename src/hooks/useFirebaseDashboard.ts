import { useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
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

        const qRisks = query(collection(db, 'risks'), where('adminId', '==', user.uid));
        const unsubRisks = onSnapshot(qRisks, (snapshot) => {
          const risks = snapshot.docs.map(d => ({ ...d.data() } as Risk));
          setData(prev => ({ ...prev, risks }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'risks'));
        unsubscribes.push(unsubRisks);

        const qZones = query(collection(db, 'zones'), where('adminId', '==', user.uid));
        const unsubZones = onSnapshot(qZones, (snapshot) => {
          const zones = snapshot.docs.map(d => ({ ...d.data() } as Zone));
          setData(prev => ({ ...prev, zones }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'zones'));
        unsubscribes.push(unsubZones);

        const qRecs = query(collection(db, 'recommendations'), where('adminId', '==', user.uid));
        const unsubRecs = onSnapshot(qRecs, (snapshot) => {
          const recommendations = snapshot.docs.map(d => ({ ...d.data() } as Recommendation));
          setData(prev => ({ ...prev, recommendations }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'recommendations'));
        unsubscribes.push(unsubRecs);

        const qDocs = query(collection(db, 'docs'), where('adminId', '==', user.uid));
        const unsubDocs = onSnapshot(qDocs, (snapshot) => {
          const complianceDocs = snapshot.docs.map(d => ({ ...d.data() } as Document));
          setData(prev => ({ ...prev, complianceDocs }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'docs'));
        unsubscribes.push(unsubDocs);

        const qServices = query(collection(db, 'services'), where('adminId', '==', user.uid));
        const unsubServices = onSnapshot(qServices, (snapshot) => {
          const services = snapshot.docs.map(d => ({ ...d.data() } as Service));
          setData(prev => ({ ...prev, services }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'services'));
        unsubscribes.push(unsubServices);

        const qEmployees = query(collection(db, 'employees'), where('adminId', '==', user.uid));
        const unsubEmployees = onSnapshot(qEmployees, (snapshot) => {
          const employees = snapshot.docs.map(d => ({ ...d.data() } as Employee));
          setData(prev => ({ ...prev, employees }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'employees'));
        unsubscribes.push(unsubEmployees);

        const qSubscribers = query(collection(db, 'subscribers'), where('adminId', '==', user.uid));
        const unsubSubscribers = onSnapshot(qSubscribers, (snapshot) => {
          const subscribers = snapshot.docs.map(d => ({ ...d.data() } as Subscriber));
          setData(prev => ({ ...prev, subscribers }));
        }, (err) => handleFirestoreError(err, OperationType.LIST, 'subscribers'));
        unsubscribes.push(unsubSubscribers);

        const unsubConfig = onSnapshot(doc(db, 'configs', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            const config = snapshot.data();
            setData(prev => ({ 
              ...prev, 
              performance: config.performance || prev.performance,
              orgChart: config.orgChart || prev.orgChart
            }));
          }
        }, (err) => handleFirestoreError(err, OperationType.GET, `configs/${user.uid}`));
        unsubscribes.push(unsubConfig);

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
