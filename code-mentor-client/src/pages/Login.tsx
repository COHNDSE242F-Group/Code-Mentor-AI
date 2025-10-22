// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogInIcon, UserIcon, KeyIcon, GithubIcon } from 'lucide-react';
const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send login request to backend
    try {
      const res = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        // show error
        alert(data.detail || 'Login failed');
        return;
      }

      // store token and role
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      if (data.role) {
        localStorage.setItem('role', data.role);
      }

      // navigate to redirect_url if provided, else Dashboard
      const target = data.redirect_url || '/Dashboard';
      // If redirect_url is absolute and different origin, open in same window
      navigate(target.replace('http://localhost:3000', ''));
    } catch (err) {
      console.error(err);
      alert('Login request failed');
    }
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };
  return <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <span className="text-white font-bold text-xl">CM</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">CodeMentorAI</h1>
          <p className="text-slate-400 mt-2">
            Your personal AI programming tutor
          </p>
        </div>
        <div className="card p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required={!isLogin} />
                </div>
              </div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
            </div>
            {isLogin && <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                    Remember me
                  </label>
                </div>
                <div>
                  <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </Link>
                </div>
              </div>}
            <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
              <LogInIcon size={18} className="mr-2" />
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700">
                <div size={18} className="mr-2" />
                Google
              </button>
              <button type="button" className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700">
                <GithubIcon size={18} className="mr-2" />
                GitHub
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="text-indigo-400 hover:text-indigo-300 text-sm">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>© 2023 CodeMentorAI. All rights reserved.</p>
        </div>
      </div>
    </div>;
};
export default Login;
