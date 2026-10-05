/**
 * Deskmates MOCK BRIDGE — a contract-compliant fake backend.
 *
 * Purpose: let the frontend (VITE_USE_MOCK=false) and the real Bridge developer test against the exact
 * REST + WebSocket contract in docs/api-contract.md BEFORE the real Bridge exists. It replays the same scripted
 * runs as the in-browser simulator, but over real HTTP/WS with monotonic seq, heartbeats, since_seq resume,
 * permission round-trips and the set_speed / run.control control messages.
 *
 *   npm run bridge:mock            # http://localhost:8000
 *   PORT=8001 npm run bridge:mock
 */
import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { buildScript, RawEv } from '../../src/mock/simulator';
import { MODELS } from '../../src/mock/data';
import { triage } from '../../src/mock/triage';

interface Run {
  id: string; goal: string; startedAt: number; script: RawEv[]; idx: number; vt: number; speed: number;
  events: any[]; seq: number; nextTick: number; clients: Set<WebSocket>; timer?: NodeJS.Timeout; done: boolean;
  pending: Map<string, { agent_id: string }>;
}
const runs = new Map<string, Run>();
let config = { model_id: MODELS[0].id, concurrency_limit: 4, speed_factor: 1, break_policy: { enabled: true, energy_threshold: 30 } };
const HEARTBEAT_MS = 15_000;

function emit(run: Run, type: string, agent_id: string | undefined, task_id: string | undefined, payload: any) {
  const mins = 9 * 60 + (run.vt * 30) / 60;
  const ts_sim = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(Math.floor(mins % 60)).padStart(2, '0')}`;
  const ev = { seq: ++run.seq, run_id: run.id, ts_real: new Date().toISOString(), ts_sim, type, agent_id, task_id, payload };
  run.events.push(ev);
  const msg = JSON.stringify(ev);
  for (const c of run.clients) if (c.readyState === WebSocket.OPEN) c.send(msg);
  return ev;
}

function startRun(goal: string): Run {
  const id = `run_${Date.now().toString(36)}`;
  const run: Run = { id, goal, startedAt: Date.now(), script: buildScript(goal), idx: 0, vt: 0, speed: 1,
    events: [], seq: 0, nextTick: 5, clients: new Set(), done: false, pending: new Map() };
  runs.set(id, run);
  let last = Date.now();
  run.timer = setInterval(() => {
    const now = Date.now(); run.vt += ((now - last) / 1000) * run.speed; last = now;
    while (run.idx < run.script.length && run.script[run.idx].t <= run.vt) {
      const s = run.script[run.idx++];
      emit(run, s.type, s.agent_id, s.task_id, s.payload);
      if (s.type === 'permission.requested') run.pending.set(s.payload.request_id, { agent_id: s.payload.agent_id });
    }
    // a live backend must emit clock.tick itself (the frontend only fakes it in mock mode)
    if (run.vt >= run.nextTick) {
      run.nextTick = run.vt + 5;
      const m = 9 * 60 + (run.vt * 30) / 60;
      emit(run, 'clock.tick', undefined, undefined, { sim_time: `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`, real_elapsed_s: Math.round((Date.now() - run.startedAt) / 1000) });
    }
    if (run.idx >= run.script.length && !run.done) { run.done = true; }
  }, 100);
  return run;
}

const json = (res: http.ServerResponse, code: number, body: unknown) => {
  res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS' });
  res.end(JSON.stringify(body));
};
const readBody = (req: http.IncomingMessage) => new Promise<any>((ok) => {
  let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch { ok({}); } });
});

export function createServer(port = Number(process.env.PORT ?? 8000)) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    const p = url.pathname;
    if (req.method === 'OPTIONS') return json(res, 204, {});
    try {
            if (p === '/' || p === '') {
        return json(res, 200, {
          name: 'GravityDesk Bridge & Gateway Server',
          status: 'online',
          version: '1.0.0',
          mode: 'bridge',
          providers: {
            groq: !!process.env.GROQ_API_KEY,
            nvidia_nim: !!process.env.NVIDIA_API_KEY,
            openrouter: !!process.env.OPENROUTER_API_KEY,
          },
          active_runs: runs.size,
          endpoints: {
            health: '/api/health',
            models: '/api/models',
            runs: '/api/runs',
            tasks: '/api/tasks',
            ws: 'ws://localhost:8000/ws',
          },
        });
      }
      if (p === '/api/health') return json(res, 200, { status: 'ok', system: 'GravityDesk', model_loaded: true, queue_depth: 0, providers: { groq: !!process.env.GROQ_API_KEY, nvidia: !!process.env.NVIDIA_API_KEY, openrouter: !!process.env.OPENROUTER_API_KEY } });
      if (p === '/api/models') return json(res, 200, MODELS);
      if (p === '/api/config' && req.method === 'GET') return json(res, 200, config);
      if (p === '/api/config' && req.method === 'PATCH') { config = { ...config, ...(await readBody(req)) }; return json(res, 200, config); }
      if (p === '/api/runs') return json(res, 200, [...runs.values()].map((r) => ({
        run_id: r.id, goal: r.goal, started_at: new Date(r.startedAt).toISOString(),
        duration_s: Math.round((Date.now() - r.startedAt) / 1000), status: r.done ? 'done' : 'running' })));
      if (p === '/api/tasks' && req.method === 'POST') {
        const b = await readBody(req);
        if (!b.goal || typeof b.goal !== 'string') return json(res, 422, { error: 'goal is required' });
        const run = startRun(b.goal);
        return json(res, 200, { task_id: run.id.replace('run_', 'task_'), run_id: run.id });
      }
      let m = p.match(/^\/api\/runs\/([^/]+)\/events$/);
      if (m) {
        const run = runs.get(m[1]); if (!run) return json(res, 404, { error: 'unknown run' });
        const since = Number(url.searchParams.get('since_seq') ?? 0), limit = Number(url.searchParams.get('limit') ?? 500);
        const events = run.events.filter((e) => e.seq > since).slice(0, limit);
        return json(res, 200, { events, next_seq: events.length ? events[events.length - 1].seq : since });
      }
      m = p.match(/^\/api\/tasks\/([^/]+)\/cancel$/);
      if (m && req.method === 'POST') { for (const r of runs.values()) if (r.id.replace('run_', 'task_') === m[1]) { clearInterval(r.timer); r.done = true; } return json(res, 200, { ok: true }); }
      if (p === '/api/org') return json(res, 200, { manager: null, leads: [], workers: [], desks: [], zones: [] });
      return json(res, 404, { error: 'not found', path: p });
    } catch (e: any) { return json(res, 500, { error: String(e?.message ?? e) }); }
  });

  const wss = new WebSocketServer({ server, path: '/ws/events' });
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url ?? '', 'http://x');
    const run = runs.get(url.searchParams.get('run_id') ?? '');
    if (!run) { ws.send(JSON.stringify({ type: 'error', message: 'unknown run' })); return ws.close(); }
    const since = Number(url.searchParams.get('since_seq') ?? 0);
    for (const e of run.events) if (e.seq > since) ws.send(JSON.stringify(e)); // resume: replay what the client missed
    run.clients.add(ws);
    const hb = setInterval(() => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ type: 'heartbeat' })), HEARTBEAT_MS);
    ws.on('message', (raw) => {
      let m: any; try { m = JSON.parse(String(raw)); } catch { return; }
      if (m.type === 'set_speed') run.speed = Math.max(0.1, Math.min(60, Number(m.factor) || 1)); // advisory: pacing only
      else if (m.type === 'ping') ws.send(JSON.stringify({ type: 'heartbeat' }));
      else if (m.type === 'permission.respond') {
        const req = run.pending.get(m.request_id);
        if (req) { run.pending.delete(m.request_id); emit(run, 'permission.resolved', req.agent_id, undefined, { request_id: m.request_id, decision: m.decision }); }
      } else if (m.type === 'run.control') {
        // the real bridge performs `git merge` / `git branch -D`; the mock just logs it as a blackboard note
        emit(run, 'blackboard.note', 'M0', undefined, { id: `ctl_${run.seq}`, author_agent_id: 'M0', topic: 'git',
          note: `${m.action === 'merge_branch' ? 'Merged' : 'Discarded'} ${m.branch}`, ts: '' });
      }
    });
    ws.on('close', () => { clearInterval(hb); run.clients.delete(ws); });
  });
  return new Promise<{ server: http.Server; port: number; close: () => void }>((ok) => {
    server.listen(port, () => {
      const addr = server.address(); const actual = typeof addr === 'object' && addr ? addr.port : port;
      ok({ server, port: actual, close: () => { for (const r of runs.values()) clearInterval(r.timer); wss.close(); server.close(); } });
    });
  });
}

if (process.argv[1] && /server\.ts$/.test(process.argv[1])) {
  createServer().then(({ port }) => console.log(`[mock-bridge] contract server on http://localhost:${port}  (ws: /ws/events)`));
}
export { triage };

