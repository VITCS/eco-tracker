import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { setToken } from '../lib/auth';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/v1/auth/login', { email, password });
      return res.data as { token: string };
    },
    onSuccess: (data) => {
      setToken(data.token);
      nav('/dashboard');
    },
    onError: () => setError('Invalid credentials'),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">EcoTracker Login</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full bg-emerald-600 text-white rounded py-2" onClick={()=>login.mutate()} disabled={login.isPending}>
          {login.isPending ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-gray-600">No account? <Link to="/register" className="text-emerald-700">Register</Link></p>
      </div>
    </div>
  );
}

