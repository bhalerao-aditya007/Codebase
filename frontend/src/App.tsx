import { useEffect } from 'react';
import { useStore } from '@/state/store';
import { Landing } from '@/ui/Landing';
import { Workspace } from '@/ui/Workspace';
import { MODELS } from '@/mock/data';
import { USE_MOCK } from '@/api/client';
import { setAccent, resetAccentBlend } from '@/three/materials';
import { engine, GOLDEN_GOAL } from '@/state/engine';
import { validateLayout } from '@/nav/validate';
import { GRID } from '@/nav/grid';

export default function App() {
  const phase = useStore((s) => s.phase);

  useEffect(() => {
    // startup validator — the app refuses to run on an invalid layout
    const errs = validateLayout(GRID);
    if (errs.length) throw new Error('Layout validation failed:\n' + errs.join('\n'));
  }, []);

  useEffect(() => {
    // brand color -> materials + CSS vars
    const hex = useStore.getState().accent;
    document.documentElement.style.setProperty('--accent', hex);
    setAccent(hex); resetAccentBlend();
    if (USE_MOCK) useStore.setState({ models: MODELS });
    else {
      fetch(((import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000') + '/api/models')
        .then((r) => r.json())
        .then((models) => useStore.setState({ models, demoMode: false }))
        .catch(() => useStore.setState({ offline: true, models: MODELS }));
    }
  }, []);

  // landing: loop the golden run in the background
  useEffect(() => {
    if (phase === 'landing') {
      engine.start(GOLDEN_GOAL);
      engine.setSpeed(2);
    }
  }, [phase]);

  return <div className="h-full w-full">{phase === 'landing' ? <Landing /> : <Workspace />}</div>;
}
