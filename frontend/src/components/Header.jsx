import React from 'react';
import { FolderKanban, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ user, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 px-6 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-500/10">
          <FolderKanban size={18} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
            Task Workspace
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">DevOps Panel</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
          className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-350 hover:text-white transition-colors"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            {user?.name}
          </span>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};
