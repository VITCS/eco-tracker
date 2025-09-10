import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function EnergyForm() {
  const [kwh, setKwh] = useState<string>('');
  const [error, setError] = useState('');
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async () => {
      const val = Number(kwh);
      if (!val || val <= 0) throw new Error('kWh must be greater than 0');
      return (await api.post('/api/v1/activities', { type: 'energy', data: { kwh: val } })).data;
    },
    onSuccess: () => { setKwh(''); setError(''); qc.invalidateQueries({ queryKey: ['activities'] }); },
    onError: (e:any) => setError(e?.message || 'Failed to add'),
  });

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); create.mutate(); }} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <label className="text-sm">Energy usage (kWh)
        <input value={kwh} onChange={(e)=>setKwh(e.target.value)} type="number" min="0" step="0.1" className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900" />
      </label>
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-3 py-2">Add Energy</button>
    </form>
  );
}

