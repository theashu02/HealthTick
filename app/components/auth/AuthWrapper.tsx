'use client'
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hook/useAuth";
import Login from "../../(auth)/login/Login";
import CalendarView from "@/app/components/common/CalendarView";
import { Loader } from "@/app/common/Loder";
import Welcome from "@/app/common/Welcome";
import { toast } from "sonner";

const AuthWrapper: React.FC = () => {

  const { user, loading, authError, handleGoogleSignIn, handleSignOut } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeShownForThisSession, setWelcomeShownForThisSession] = useState(false);

  useEffect(() => {
    if (user && !welcomeShownForThisSession) {
      setShowWelcome(true);
      setWelcomeShownForThisSession(true);
    } 
    else if (!user) {
      setWelcomeShownForThisSession(false);
    }
  }, [user, welcomeShownForThisSession]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    toast("Logged in Successfully.")
  };

  if (loading) {
    return <Loader />;
  }

  if (user) {
    if (showWelcome) {
      return <Welcome userName={user.displayName || 'User'} onComplete={handleWelcomeComplete} />;
    }
    return <CalendarView user={user} onSignOut={handleSignOut} />;
  }
  
  return <Login onSignIn={handleGoogleSignIn} authError={authError} />;
};

export default AuthWrapper;