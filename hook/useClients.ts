'use client'
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client } from '@/lib/types';
import { DUMMY_CLIENTS } from '@/lib/constants';

export const useClients = (user: any) => {
  const [clients, setClients] = useState<Client[]>(
    DUMMY_CLIENTS.map(c => ({ ...c, id: c.phone }))
  );

  const setupClients = async () => {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef);
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("Setting up initial client list in Firestore...");
        const promises = DUMMY_CLIENTS.map(client => addDoc(clientsRef, client));
        await Promise.all(promises);
        console.log("Dummy clients successfully added.");
      } else {
        console.log("Client list already exists in Firestore.");
      }
    } catch (error) {
      console.error("Error setting up clients in Firestore. Please check your security rules.", error);
    }
  };

  useEffect(() => {
    if (user) {
      setupClients();
    }
  }, [user]);

  // Effect to fetch and listen for real-time client updates from Firestore
  useEffect(() => {
    const clientsUnsub = onSnapshot(collection(db, 'clients'), (snapshot) => {
      if (!snapshot.empty) {
        const clientData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Client));
        setClients(clientData);
        console.log("Client list updated from Firestore.");
      } else {
        console.log("Firestore 'clients' collection is empty. Using local dummy data.");
      }
    }, (error) => {
      console.error("Error fetching clients from Firestore. Using local dummy data. Error:", error);
    });

    return () => clientsUnsub();
  }, []);

  return { clients };
};