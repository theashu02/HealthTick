import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">HealthTick Calendar</h1>
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Coach" 
            className="w-10 h-10 rounded-full" 
          />
        )}
        <span className="text-sm text-gray-600 hidden sm:block">
          {user.displayName}
        </span>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </header>
  );
};

export default Header;