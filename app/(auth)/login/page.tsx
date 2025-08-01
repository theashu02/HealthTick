"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { LoginProps } from "@/lib/types";

const Login: React.FC<LoginProps> = ({ onSignIn, authError }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900">HealthTick</h1>
        <p className="text-gray-600">Your client scheduling partner.</p>

        {authError && (
          <div className="p-4 mt-4 text-sm text-red-800 bg-red-100 rounded-lg flex items-start text-left">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Authentication Error:</span>{" "}
              {authError}
            </div>
          </div>
        )}

        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign in with Google
        </button>
      </div>

      <footer className="absolute bottom-0 bg-slate-100 border-t w-full py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600">
            Made by Ashu | © {new Date().getFullYear()} All Rights Reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            <strong>Disclaimer:</strong> This application uses a temporary
            testing database with Firebase login. All data is temporary.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
