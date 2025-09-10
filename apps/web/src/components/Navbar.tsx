import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toggleTheme } from '../lib/theme';
import { clearToken } from '../lib/auth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-emerald-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          <Link to="/dashboard" className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">EcoTracker</Link>
          <div className="flex items-center gap-2">
            <button aria-label="Toggle theme" onClick={()=>toggleTheme()} className="h-9 w-9 rounded-full border border-emerald-100 dark:border-gray-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-800 transition">🌓</button>
            <div className="relative">
              <button onClick={()=>setOpen((v)=>!v)} className="h-9 w-9 rounded-full bg-emerald-600 text-white font-semibold">U</button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <button onClick={()=>{ setOpen(false); nav('/dashboard'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-gray-800">Dashboard</button>
                  <button onClick={()=>{ setOpen(false); clearToken(); nav('/login'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

