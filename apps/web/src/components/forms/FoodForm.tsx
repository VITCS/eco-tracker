import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function FoodForm() {
  const [mealType, setMealType] = useState<'beef'|'pork'|'chicken'|'veg'|'vegetarian'|'vegan'>('veg');
  const [meals, setMeals] = useState<string>('1');
  const [error, setError] = useState('');
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async () => {
      const count = Number(meals);
      if (!count || count <= 0) throw new Error('Meals must be at least 1');
      return (await api.post('/api/v1/activities', { type: 'food', data: { mealType, meals: count } })).data;
    },
    onSuccess: () => { setMeals('1'); setError(''); qc.invalidateQueries({ queryKey: ['activities'] }); },
    onError: (e:any) => setError(e?.message || 'Failed to add'),
  });

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); create.mutate(); }} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">Meal type
          <select value={mealType} onChange={(e)=>setMealType(e.target.value as any)} className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900">
            <option value="beef">Beef</option>
            <option value="pork">Pork</option>
            <option value="chicken">Chicken</option>
            <option value="veg">Vegetarian</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </label>
        <label className="text-sm">Meals
          <input value={meals} onChange={(e)=>setMeals(e.target.value)} type="number" min="1" step="1" className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900" />
        </label>
      </div>
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-3 py-2">Add Food</button>
    </form>
  );
}

