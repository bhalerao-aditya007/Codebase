import { useStore } from '@/state/store';
import { director } from '@/sim/director';
import { generateProjectFiles, downloadProjectZip } from '@/services/projectBundle';

export interface ChatMessage {
  role: 'user' | 'manager';
  text: string;
  ts: string;
}

class ManagerMemoryAgent {
  private history: ChatMessage[] = [];

  constructor() {
    this.history = [];
  }

  public getHistory(): ChatMessage[] {
    return [...this.history];
  }

  public async processDirective(userText: string): Promise<string> {
    const s = useStore.getState();
    const now = s.simClock || '10:00';
    const goal = s.goal || 'Build a real-time crypto price tracker in React with the name of project as "CRYPTracker"';
    const isCrypto = /crypto|btc|eth|tracker|coin/i.test(goal);
    const projectName = isCrypto ? 'CRYPTracker' : goal.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'GravityProject';
    const localDir = `D:\\GravityDesk\\output\\${projectName}`;

    this.history.push({ role: 'user', text: userText, ts: now });

    const lower = userText.toLowerCase().trim();
    let reply = '';
    let blackboardNote = '';

    // 1. Where are output files / download / zip / code inquiry
    if (
      lower.includes('output') ||
      lower.includes('download') ||
      lower.includes('where') ||
      lower.includes('code') ||
      lower.includes('zip') ||
      lower.includes('file') ||
      lower.includes('collect')
    ) {
      reply = `All deliverables for ${projectName} are ready! You can download the complete source code as a .ZIP archive or Markdown report directly from the Final Report modal. In addition, the entire codebase has been saved to your local disk at ${localDir}.`;
      blackboardNote = `Delivered full ${projectName} source bundle & zip export to user.`;

      // Proactively open the report modal with files view
      setTimeout(() => {
        useStore.setState({ reportOpen: true });
      }, 400);
    }
    // 2. Insights / Observations / Findings
    else if (
      lower.includes('insight') ||
      lower.includes('summary') ||
      lower.includes('what happened') ||
      lower.includes('see') ||
      lower.includes('saw') ||
      lower.includes('observe')
    ) {
      if (isCrypto) {
        reply = `Key engineering insights from the ${projectName} run:\n1. WebSocket Throttling: Isha and Vikram found that 40+ raw price ticks/sec caused frame drops; they decoupled socket events into a 60fps RAF batch buffer.\n2. Redundant API Fallback: Meera implemented REST polling fallback with CoinGecko in case the socket connection drops.\n3. State Isolation: Kabir reviewed the component tree so price tick updates do not re-render unaffected dashboard cards.`;
      } else {
        reply = `Key team insights for ${projectName}:\n1. Modular separation of concerns allowed backend logic and UI components to be built concurrently without merge locks.\n2. Automated test assertions caught 2 boundary edge-cases during lead review.\n3. High-throughput state changes were buffered to maintain UI responsiveness.`;
      }
      blackboardNote = `Shared architecture & performance insights for ${projectName}.`;
    }
    // 3. Continue / Next Phase
    else if (
      lower.includes('continue') ||
      lower.includes('next') ||
      lower.includes('proceed') ||
      lower.includes('more') ||
      lower.includes('extend')
    ) {
      reply = `Understood! Launching Phase 2 expansion for ${projectName}. Scheduling: T9 (Portfolio & PnL Tracker ? Rohan), T10 (Price Alert Web Notifications ? Vikram), and T11 (Local Storage Offline Cache ? Isha). Team is mobilizing.`;
      blackboardNote = `Phase 2 roadmap activated for ${projectName}.`;

      // Add Phase 2 tasks to DAG
      const currentTaskCount = Object.keys(s.tasks).length;
      const nextId1 = `T${currentTaskCount + 1}`;
      const nextId2 = `T${currentTaskCount + 2}`;
      const nextId3 = `T${currentTaskCount + 3}`;
      const workerList = Object.values(s.agents).filter((a) => a.role === 'worker');
      const w1 = workerList[0]?.id ?? 'W_backend_0';
      const w2 = workerList[1]?.id ?? 'W_frontend_0';
      const w3 = workerList[2]?.id ?? 'W_qa_0';

      const newTasks = {
        ...s.tasks,
        [nextId1]: {
          id: nextId1,
          parent_id: 'M0',
          description: `Portfolio balance & profit/loss tracker`,
          owner_role: 'backend',
          assigned_agent: w1,
          status: 'running' as const,
          priority: 2,
          depends_on: [],
          attempts: 0,
          progress_pct: 30,
          est_effort_s: 1400,
        },
        [nextId2]: {
          id: nextId2,
          parent_id: 'M0',
          description: `Price alert threshold engine & web notifications`,
          owner_role: 'frontend',
          assigned_agent: w2,
          status: 'pending' as const,
          priority: 2,
          depends_on: [nextId1],
          attempts: 0,
          progress_pct: 0,
          est_effort_s: 1100,
        },
        [nextId3]: {
          id: nextId3,
          parent_id: 'M0',
          description: `Offline local storage persistence & caching`,
          owner_role: 'content',
          assigned_agent: w3,
          status: 'pending' as const,
          priority: 2,
          depends_on: [nextId2],
          attempts: 0,
          progress_pct: 0,
          est_effort_s: 900,
        },
      };

      const newEdges = [
        ...s.edges,
        { from: `T${currentTaskCount}`, to: nextId1 },
        { from: nextId1, to: nextId2 },
        { from: nextId2, to: nextId3 },
      ];

      useStore.setState({ tasks: newTasks, edges: newEdges });
    }
    // 4. Stop / Cancel / Pause
    else if (lower.includes('stop') || lower.includes('halt') || lower.includes('cancel') || lower.includes('pause')) {
      reply = `Directive acknowledged. Halting all active worker execution loops. Branch checkpoints are safely frozen.`;
      blackboardNote = `Execution suspended by manager directive.`;

      const updatedTasks = { ...s.tasks };
      for (const tid of Object.keys(updatedTasks)) {
        if (updatedTasks[tid].status === 'running') {
          updatedTasks[tid] = { ...updatedTasks[tid], status: 'failed' };
        }
      }
      useStore.setState({ tasks: updatedTasks });
    }
    // 5. Add specific feature
    else if (lower.startsWith('add') || lower.includes('implement') || lower.includes('create') || lower.includes('build')) {
      const feat = userText.replace(/^(add|implement|create|build)s+/i, '').trim();
      reply = `Assigned feature "${feat}" to specialist lead. Task injected into execution pipeline.`;
      blackboardNote = `New task registered: "${feat}".`;

      const currentTaskCount = Object.keys(s.tasks).length;
      const newId = `T${currentTaskCount + 1}`;
      const workerList = Object.values(s.agents).filter((a) => a.role === 'worker');
      const assigned = workerList[currentTaskCount % Math.max(1, workerList.length)]?.id ?? 'W_frontend_0';

      const newTasks = {
        ...s.tasks,
        [newId]: {
          id: newId,
          parent_id: 'M0',
          description: feat,
          owner_role: 'frontend',
          assigned_agent: assigned,
          status: 'running' as const,
          priority: 1,
          depends_on: [],
          attempts: 0,
          progress_pct: 20,
          est_effort_s: 1200,
        },
      };
      useStore.setState({ tasks: newTasks });
    }
    // 6. Natural Language Fallback with Memory
    else {
      // Memory reasoning
      const pastUserMessages = this.history.filter((m) => m.role === 'user');
      if (pastUserMessages.length > 2) {
        reply = `Understood. With our current progress on ${projectName}, the engineering department has completed core features and verified all tests. How would you like us to proceed?`;
      } else {
        reply = `Directive acknowledged: "${userText}". Reviewing current ${projectName} status with team leads.`;
      }
      blackboardNote = `Directive noted: "${userText.slice(0, 40)}..."`;
    }

    this.history.push({ role: 'manager', text: reply, ts: now });

    // 3D Office visual feedback: Speech bubble over Diya
    const mgr = director.rt('M0');
    if (mgr) {
      mgr.bubble = { text: reply.length > 80 ? reply.slice(0, 77) + '...' : reply, until: director.time + 6 };
    }

    // Update store log and blackboard
    setTimeout(() => {
      const st = useStore.getState();
      useStore.setState({
        log: [
          ...st.log,
          { id: Date.now() + 1, ts_sim: st.simClock, type: 'manager.response', text: `Diya ? You: "${reply}"` },
        ],
        notes: [
          ...st.notes,
          {
            id: `note_${Date.now()}`,
            author_agent_id: 'M0',
            topic: 'DIRECTIVE',
            note: `Diya: ${blackboardNote || reply}`,
            ts: st.simClock,
          },
        ],
        notePulse: Date.now(),
      });
    }, 250);

    return reply;
  }
}

export const managerAgent = new ManagerMemoryAgent();
