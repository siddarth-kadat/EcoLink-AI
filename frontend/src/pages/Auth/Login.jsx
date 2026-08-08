import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShortcut = (role) => {
    setPassword('Password@123');
    if (role === 'restaurant') setEmail('demo.restaurant@example.com');
    else if (role === 'ngo') setEmail('demo.ngo@example.com');
    else if (role === 'volunteer') setEmail('demo.volunteer@example.com');
    else if (role === 'admin') setEmail('demo.admin@example.com');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and Password are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-[32px] border border-slate-100 shadow-xl text-center">
      <div className="flex justify-center gap-3 mb-6">
        <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full animate-pulse" />
        </div>
        <span className="text-lg font-bold text-slate-900">EcoLink AI</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back</h2>
      <p className="text-xs text-slate-400 mb-6">Sign in with credentials or select a demo role shortcut below.</p>
      
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left font-sans">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo.restaurant@example.com"
              required
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-slate-950/10"
            />
            <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-slate-950/10"
            />
            <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 my-4 select-none">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded text-slate-950 focus:ring-slate-950 border-slate-200" />
            <span>Remember Me</span>
          </label>
          <button type="button" className="hover:text-slate-950 transition-colors hover:underline">Forgot Password?</button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-slate-950/10 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Demo Shortcuts</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => handleShortcut('restaurant')} className="py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs rounded-xl font-semibold transition-colors">
          Restaurant
        </button>
        <button onClick={() => handleShortcut('ngo')} className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs rounded-xl font-semibold transition-colors">
          NGO
        </button>
        <button onClick={() => handleShortcut('volunteer')} className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-xl font-semibold transition-colors">
          Volunteer
        </button>
        <button onClick={() => handleShortcut('admin')} className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs rounded-xl font-semibold transition-colors">
          Admin
        </button>
      </div>
    </div>
  );
};

export default Login;
