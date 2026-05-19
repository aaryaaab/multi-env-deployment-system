import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errorMsg) setErrorMsg('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
      }
    } catch (error) {
      // Extract specific backend error messages
      let message = 'An unexpected error occurred. Please try again.';
      
      if (error.response?.data?.message) {
        const rawMessage = error.response.data.message;
        
        // Make Mongoose validation errors more user-friendly
        if (rawMessage.includes('User validation failed')) {
          // Split by commas and remove the "User validation failed:" prefix
          const cleanErrors = rawMessage.replace('User validation failed:', '').split(',').map(err => err.split(':')[1]?.trim() || err.trim());
          message = cleanErrors.join(' • ');
        } 
        // Handle duplicate email error (MongoDB duplicate key E11000)
        else if (rawMessage.includes('E11000') || rawMessage.includes('duplicate key')) {
          message = 'An account with this email address already exists.';
        }
        else {
          message = rawMessage;
        }
      }
      
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.2 0-2 .8-2 2v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400">Join NexusOps to deploy and manage tasks</p>
        </div>
        
        {/* Inline Error Message */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 mb-6 text-sm text-rose-700 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-lg animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Min 6 characters"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-slate-600 dark:text-slate-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold hover:underline transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
