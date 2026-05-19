import React from 'react';
import { ShieldCheck, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ user, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 px-6 glass border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            NexusOps
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Task Platform</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center gap-4 border-l border-slate-300 dark:border-slate-700 pl-6">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {user?.name}
          </span>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};
