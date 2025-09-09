import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const register = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/v1/auth/register', { email, password, name });
      return res.data;
    },
    onSuccess: () => nav('/login'),
    onError: () => setError('Registration failed')
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full bg-emerald-600 text-white rounded py-2" onClick={()=>register.mutate()} disabled={register.isPending}>
          {register.isPending ? 'Creating...' : 'Register'}
        </button>
        <p className="text-sm text-gray-600">Have an account? <Link to="/login" className="text-emerald-700">Sign in</Link></p>
      </div>
    </div>
  );
}

