import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center">
      <div className="flex justify-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full" />
        </div>
        <span className="text-lg font-bold text-slate-900">EcoLink AI</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
      <p className="text-sm text-slate-400 mb-8">Sign in as a restaurant, NGO, volunteer, or administrator.</p>
      
      <div className="flex flex-col gap-3">
        <button onClick={() => handleLogin('restaurant')} className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl font-semibold transition-colors">
          Sign In as Restaurant
        </button>
        <button onClick={() => handleLogin('ngo')} className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-semibold transition-colors">
          Sign In as NGO
        </button>
        <button onClick={() => handleLogin('volunteer')} className="w-full py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold transition-colors">
          Sign In as Volunteer
        </button>
        <button onClick={() => handleLogin('admin')} className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-semibold transition-colors">
          Sign In as Administrator
        </button>
      </div>
    </div>
  );
};

export default Login;
