'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage/localStorage';
import { getTodayString } from '@/lib/utils/date';

type EnergyLevel = 'high' | 'medium' | 'low';
type NervousSystemState = 'calm' | 'wired' | 'anxious' | 'numb';

interface EnergyCheckIn {
  date: string;
  energy: EnergyLevel;
  nervousSystem: NervousSystemState;
  factors: string[];
  note?: string;
}

export default function EnergyCheckin() {
  const [todayCheckin, setTodayCheckin] = useState<EnergyCheckIn | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [energy, setEnergy] = useState<EnergyLevel | ''>('');
  const [nervousSystem, setNervousSystem] = useState<NervousSystemState | ''>('');
  const [factors, setFactors] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const factorOptions = [
    'Sleep',
    'Stress',
    'Food',
    'Social',
    'Movement',
    'Screen Time',
    'Nicotine Cravings',
    'Other',
  ];

  useEffect(() => {
    loadTodayCheckin();
  }, []);

  const loadTodayCheckin = () => {
    const today = getTodayString();
    const allCheckins = storage.get('lifeos_energy_checkins') || [];
    const existing = allCheckins.find((c: EnergyCheckIn) => c.date === today);

    if (existing) {
      setTodayCheckin(existing);
      setEnergy(existing.energy);
      setNervousSystem(existing.nervousSystem);
      setFactors(existing.factors);
      setNote(existing.note || '');
    } else {
      setIsEditing(true);
    }
  };

  const saveCheckin = () => {
    if (!energy || !nervousSystem) return;

    const today = getTodayString();
    const checkin: EnergyCheckIn = {
      date: today,
      energy,
      nervousSystem,
      factors,
      note: note.trim() || undefined,
    };

    const allCheckins = storage.get('lifeos_energy_checkins') || [];
    const filtered = allCheckins.filter((c: EnergyCheckIn) => c.date !== today);
    filtered.push(checkin);

    storage.set('lifeos_energy_checkins', filtered);
    setTodayCheckin(checkin);
    setIsEditing(false);
  };

  const toggleFactor = (factor: string) => {
    setFactors(prev =>
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const energyLevels = [
    { value: 'high' as EnergyLevel, label: 'High', emoji: '⚡', color: 'from-yellow-400 to-orange-400' },
    { value: 'medium' as EnergyLevel, label: 'Medium', emoji: '☀️', color: 'from-blue-400 to-cyan-400' },
    { value: 'low' as EnergyLevel, label: 'Low', emoji: '🔋', color: 'from-gray-400 to-slate-400' },
  ];

  const nervousSystemStates = [
    { value: 'calm' as NervousSystemState, label: 'Calm', emoji: '😌', color: 'from-green-400 to-emerald-400' },
    { value: 'wired' as NervousSystemState, label: 'Wired', emoji: '⚡', color: 'from-purple-400 to-pink-400' },
    { value: 'anxious' as NervousSystemState, label: 'Anxious', emoji: '😰', color: 'from-orange-400 to-red-400' },
    { value: 'numb' as NervousSystemState, label: 'Numb', emoji: '😶', color: 'from-gray-400 to-zinc-400' },
  ];

  if (!isEditing && todayCheckin) {
    const energyData = energyLevels.find(e => e.value === todayCheckin.energy);
    const nsData = nervousSystemStates.find(n => n.value === todayCheckin.nervousSystem);

    return (
      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧠</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Today's Energy Check-in</h2>
              <p className="text-sm text-gray-600">Awareness, not optimization</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`bg-gradient-to-r ${energyData?.color} rounded-xl p-6 text-white shadow-lg`}>
            <div className="text-center">
              <div className="text-5xl mb-2">{energyData?.emoji}</div>
              <p className="font-bold text-xl">{energyData?.label} Energy</p>
            </div>
          </div>
          <div className={`bg-gradient-to-r ${nsData?.color} rounded-xl p-6 text-white shadow-lg`}>
            <div className="text-center">
              <div className="text-5xl mb-2">{nsData?.emoji}</div>
              <p className="font-bold text-xl">{nsData?.label}</p>
            </div>
          </div>
        </div>

        {todayCheckin.factors.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Contributing factors:</p>
            <div className="flex flex-wrap gap-2">
              {todayCheckin.factors.map(factor => (
                <span
                  key={factor}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}

        {todayCheckin.note && (
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Note:</p>
            <p className="text-gray-700">{todayCheckin.note}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🧠</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Energy Check-in</h2>
          <p className="text-sm text-gray-600">How are you feeling right now?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Energy Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Energy Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {energyLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => setEnergy(level.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  energy === level.value
                    ? `border-purple-500 bg-gradient-to-r ${level.color} text-white shadow-lg scale-105`
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">{level.emoji}</div>
                <div className={`font-semibold ${energy === level.value ? 'text-white' : 'text-gray-900'}`}>
                  {level.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Nervous System State */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Nervous System State <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {nervousSystemStates.map(state => (
              <button
                key={state.value}
                type="button"
                onClick={() => setNervousSystem(state.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  nervousSystem === state.value
                    ? `border-purple-500 bg-gradient-to-r ${state.color} text-white shadow-lg scale-105`
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">{state.emoji}</div>
                <div className={`font-semibold ${nervousSystem === state.value ? 'text-white' : 'text-gray-900'}`}>
                  {state.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contributing Factors */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Contributing Factors (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {factorOptions.map(factor => (
              <button
                key={factor}
                type="button"
                onClick={() => toggleFactor(factor)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  factors.includes(factor)
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {factor}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything else you want to remember..."
            maxLength={100}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Keep it short (max 100 characters)</p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveCheckin}
          disabled={!energy || !nervousSystem}
          className="w-full rounded-lg bg-purple-600 px-6 py-4 text-white font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Check-in
        </button>
      </div>
    </div>
  );
}
