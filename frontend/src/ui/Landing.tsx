import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { Icon, I } from './Icons';
import { OfficeCanvas } from '@/three/OfficeCanvas';
import { GOLDEN_GOAL, engine } from '@/state/engine';
import { USE_MOCK } from '@/api/client';
import { setAccent, resetAccentBlend } from '@/three/materials';
import { sfx } from '@/sim/sound';
import { triage } from '@/mock/triage';

const CHIPS = [
  'Compare top 3 open-weight coding models and build a tiny CLI that benchmarks one', // hybrid · heavy
  'Add dark mode to the dashboard',        // code_frontend · standard
  'Summarize this repo README in one paragraph', // text_gen · light — manager solo
  'Build a REST API with auth and tests',  // code_backend · standard
];

const PROFILES = [
  { id: 'strict', label: 'Strict', hint: 'Ask before every edit — for new/untrusted repos' },
  { id: 'assist', label: 'Assist', hint: 'Auto-approve edits, ask for risky shell — recommended' },
  { id: 'turbo', label: 'Turbo', hint: 'Full auto-pilot — requires a clean git repo' },
] as const;

export function Landing() {
  const models = useStore((s) => s.models);
  const modelId = useStore((s) => s.modelId);
  const accent = useStore((s) => s.accent);
  const profile = useStore((s) => s.profile);
  const [goal, setGoal] = useState('');
  const [mode, setMode] = useState<'live' | 'replay'>('live');

  const preview = useMemo(() => (goal.trim().length > 12 ? triage(goal) : null), [goal]);

  const open = () => {
    const g = goal.trim() || CHIPS[0];
    useStore.setState({ phase: 'workspace', mode });
    sfx.setEnabled(useStore.getState().settings.sound);
    engine.start(mode === 'replay' ? GOLDEN_GOAL : g);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0"><OfficeCanvas ambient /></div>
      <div className="absolute inset-0 blueprint-grid pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/70 to-transparent" />
      <div className="relative h-full flex items-center">
        <div className="max-w-xl px-8 lg:px-16 py-12">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span className="font-heading font-bold text-white text-sm">G</span>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">GravityDesk</span>
              {USE_MOCK && <span className="ml-2 text-[10px] font-mono uppercase tracking-wider rounded-full border border-ink/20 px-2 py-0.5">Demo mode</span>}
            </div>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl leading-tight tracking-tight mb-4">
              Hand one manager a task.<br />
              <span style={{ color: 'var(--accent)' }}>Watch a whole team</span> sit down, argue, grab coffee, and ship it.
            </h1>
            <p className="font-body text-ink/70 mb-7 max-w-md">
              The manager triages your task herself — a quick summary gets done solo before the coffee cools;
              a full build hires a team for a whole workday, breaks and all.
            </p>
            <div className="flex gap-2 mb-1">
              <input
                id="task-input" value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && open()}
                placeholder="Describe a task for the manager…"
                className="flex-1 rounded-xl border border-ink/15 bg-white/90 px-4 py-3 font-body text-sm outline-none focus:border-ink/40 shadow-sm"
              />
              <button onClick={open}
                className="rounded-xl px-5 py-3 font-heading font-semibold text-sm text-white shadow-md transition-transform hover:scale-[1.02]"
                style={{ background: 'var(--accent)' }}>
                Open the office
              </button>
            </div>

            {/* live triage preview */}
            <div className="h-7 mt-1 text-[11px] font-body text-ink/55 flex items-center gap-2 flex-wrap">
              {preview && (
                <>
                  <span className="font-mono">≈</span>
                  <span className="capitalize font-medium">{preview.task_class.replace(/_/g, ' ')} · {preview.intensity}</span>
                  {preview.intensity === 'light' && <span className="text-ink/40">· sprint, no coffee breaks</span>}
                  {preview.departments.length > 0 && (
                    <span className="text-ink/40">· {preview.departments.map((d) => d.name).join(', ')}</span>
                  )}
                  <span className="text-ink/35">(manager confirms on launch)</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => setGoal(c)}
                  className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-body hover:border-ink/40 transition-colors">
                  {c.length > 44 ? c.slice(0, 43) + '…' : c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-xs font-body text-ink/70">
                Model
                <select value={modelId} onChange={(e) => useStore.setState({ modelId: e.target.value })}
                  className="rounded-lg border border-ink/15 bg-white/90 px-2 py-1 text-xs max-w-[170px]">
                  {models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </label>
              <div className="flex rounded-lg border border-ink/15 overflow-hidden text-xs font-heading">
                {PROFILES.map((p) => (
                  <button key={p.id} title={p.hint} onClick={() => useStore.setState({ profile: p.id })}
                    className={`px-3 py-1 ${profile === p.id ? 'text-white' : 'text-ink/70'}`}
                    style={profile === p.id ? { background: 'var(--accent)' } : {}}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg border border-ink/15 overflow-hidden text-xs font-heading">
                {(['live', 'replay'] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-3 py-1 ${mode === m ? 'text-white' : 'text-ink/70'}`}
                    style={mode === m ? { background: 'var(--accent)' } : {}}>
                    {m === 'live' ? 'Live' : 'Replay'}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-body text-ink/70">
                Company color
                <input type="color" value={accent} onChange={(e) => {
                  useStore.setState({ accent: e.target.value });
                  document.documentElement.style.setProperty('--accent', e.target.value);
                  setAccent(e.target.value); resetAccentBlend();
                }} className="w-7 h-7 rounded-lg" />
              </label>
            </div>
            <p className="mt-3 text-[10px] font-body text-ink/45">
              Profile: {PROFILES.find((p) => p.id === profile)!.hint}
            </p>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-4 right-6 flex items-center gap-3 text-[11px] font-mono text-ink/50">
        <Icon d={I.cube} size={13} /> triage → org → RealGravity workers · {USE_MOCK ? 'mock event stream' : 'live bridge'}
      </div>
    </div>
  );
}

