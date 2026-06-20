import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, FolderKanban } from 'lucide-react';
import api from '../api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An unexpected error occurred during login. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800/80 space-y-6 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg shadow-indigo-500/25 transform hover:scale-[1.03] transition-transform duration-300">
            <FolderKanban size={22} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to access your project workspace.</p>
        </div>
        
        {errorMsg && (
          <div className="flex items-start gap-3 p-3.5 text-xs text-rose-700 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="name@company.com"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-900 dark:text-white transition-all text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-900 dark:text-white transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-all text-sm shadow-md shadow-indigo-500/10 active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-slate-500 dark:text-slate-400 text-xs">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-colors">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
