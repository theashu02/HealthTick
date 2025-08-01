'use client'
import { useState, useEffect } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error during Google Sign-In:", authError);
      
      if (authError.code === 'auth/unauthorized-domain') {
        setAuthError("This domain is not authorized for authentication. Please add it to the Firebase console's list of authorized domains.");
      } else {
        setAuthError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    loading,
    authError,
    handleGoogleSignIn,
    handleSignOut
  };
};