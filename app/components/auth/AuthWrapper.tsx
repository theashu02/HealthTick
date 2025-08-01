import React from "react";
import { useAuth } from "@/hook/useAuth";
import Login from "../../(auth)/login/page";
import CalendarView from "@/app/components/common/CalendarView";
import { Loader } from "@/app/common/Loder";

const AuthWrapper: React.FC = () => {
  const { user, loading, authError, handleGoogleSignIn, handleSignOut } =
    useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {user ? (
        <CalendarView user={user} onSignOut={handleSignOut} />
      ) : (
        <Login onSignIn={handleGoogleSignIn} authError={authError} />
      )}
    </div>
  );
};

export default AuthWrapper;
