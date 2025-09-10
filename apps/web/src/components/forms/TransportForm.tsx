import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function TransportForm() {
  const [mode, setMode] = useState<'car'|'public'|'bus'|'train'|'bike'|'walk'>('car');
  const [km, setKm] = useState<string>('');
  const [error, setError] = useState('');
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async () => {
      const dist = Number(km);
      if (!dist || dist <= 0) throw new Error('Distance must be greater than 0');
      return (await api.post('/api/v1/activities', { type: 'transport', data: { mode, km: dist } })).data;
    },
    onSuccess: () => { setKm(''); setError(''); qc.invalidateQueries({ queryKey: ['activities'] }); },
    onError: (e:any) => setError(e?.message || 'Failed to add'),
  });

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); create.mutate(); }} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">Mode
          <select value={mode} onChange={(e)=>setMode(e.target.value as any)} className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900">
            <option value="car">Car</option>
            <option value="public">Public</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="bike">Bike</option>
            <option value="walk">Walk</option>
          </select>
        </label>
        <label className="text-sm">Distance (km)
          <input value={km} onChange={(e)=>setKm(e.target.value)} type="number" min="0" step="0.1" className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900" />
        </label>
      </div>
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-3 py-2">Add Transport</button>
    </form>
  );
}

