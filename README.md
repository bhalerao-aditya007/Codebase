# GravityDesk: 3D Autonomous Multi-Agent Software Engineering Floor

## 1. Project Name
**GravityDesk** (Autonomous Multi-Agent Engineering Floor with Heterogeneous Open-Source Model Routing)

---

## 2. Problem Statement
Current generative AI coding tools predominantly function as isolated, single-turn text interfaces or linear pair-programming chat widgets. While suitable for localized code completions, this paradigm breaks down on complex software engineering objectives that require:
1. **Multi-Disciplinary Division of Labor:** Real engineering tasks demand simultaneous planning, architectural design, dependency resolution, API development, test writing, and technical documentation. A single model prompt attempting to handle all roles simultaneously suffers from severe context dilution, hallucination, and instruction drift.
2. **Provider Bottlenecks and Rate Limits:** Relying on a single model or endpoint creates critical throughput bottlenecks. When multiple autonomous agent loops execute concurrent file reads, tool executions, and tests, they rapidly exhaust provider Rate Limits (Requests Per Minute - RPM, and Tokens Per Minute - TPM).
3. **Opacity in Autonomous Execution:** In terminal-only or text-only agent runners, users cannot intuitively inspect which agent is blocked on dependencies, which model is generating code, where inter-agent reviews fail, or what safety permissions are pending. The lack of spatial and structural visibility leads to distrust and premature termination of long-running tasks.

---

## 3. Project Overview
GravityDesk is a proposed multi-agent autonomous engineering system that models software development as a collaborative, physical office environment rendered in an interactive 3D canvas (Three.js / React Three Fiber) backed by a local Provider Gateway and terminal-level execution runtime. 

Instead of routing an entire task to a single LLM, GravityDesk decomposes the objective across specialized department leads and workers. Each agent operates under a designated role profile, context quota, and toolset, powered by an optimized open-source / open-weight model suited specifically to that role. All activities—code generation, code review, inter-agent chats, dependency handoffs, test executions, and coffee breaks during context compaction—are driven deterministically by an event stream and visualized in real time.

---

## 4. Proposed Solution
GravityDesk proposes an integrated, three-tier architecture:
1. **The 3D Virtual Floor (Frontend Observer):** An isometric 3D workplace interface where agents physically sit at workstations, move between department bays (Frontend, Backend, Research, QA, Data, Content), access meeting rooms for synchronous reviews, and visit the coffee pantry during token compaction phases.
2. **The Provider Gateway and Mediation Bridge:** An asynchronous gateway that performs context-aware routing across heterogeneous open-weight models, token-bucket rate limiting, priority queuing with queue aging, circuit breaking, and streaming WebSocket event fanout.
3. **The Execution Engine (RealGravity Runtime):** A headless terminal runtime enforcing isolated Git worktrees, AST-level code diffs, command sandboxing, and strict permission escalation gates before any destructive action is executed on the host filesystem.

---

## 5. Objectives
- **Role-Based Task Decomposition:** Automatically triage user goals and decompose them into an acyclic task graph (DAG) executed by specialized agents rather than a monolithic prompt.
- **Heterogeneous Model Orchestration:** Distribute distinct roles (Triage Manager, Department Lead, Code Generation Worker, Documentation Specialist) across specialized open-weight models (Qwen 3.8 27B, Nemotron 70B / 3.5, GPT-OSS, Gemma 31B, DeepSeek) to maximize inference efficiency and prevent single-provider rate-limit starvation.
- **Spatial Observability:** Replace opaque terminal logs with an interactive 3D spatial interface where users can inspect agent memory, context pressure, active tool executions, and token consumption at a glance.
- **Safe Host Integration:** Ensure all terminal and file modifications remain strictly sandboxed with one-click permission gating and instantaneous Git rollback capabilities.

---

## 6. Target Users / Use Cases
### Target Users
- **Software Engineering Teams & Tech Leads:** Overseeing complex refactors, multi-package library migrations, or full-stack feature implementations.
- **Autonomous Systems Researchers:** Studying multi-agent coordination dynamics, inter-agent communication protocols, and context degradation.
- **Open-Source AI Developers:** Seeking a production-grade local orchestration harness that runs on free open-weight model tiers without expensive proprietary API lock-in.

### Primary Use Cases
1. **Full-Stack Feature Development:** From one prompt, Frontend workers write React/TypeScript components, Backend workers build REST/WebSocket endpoints, and QA workers draft automated test suites.
2. **Competitive Benchmark & Tech Evaluation:** Research agents query local or web search indexes, analyze library repositories, and synthesize comparative technical whitepapers.
3. **Systematic Code Refactoring & Test Hardening:** Autonomous scanning of existing codebases, identifying untested branches, writing test harnesses, and incrementally applying validated patches.

---

## 7. Open-Source AI Technology Selected
GravityDesk strategically selects a heterogeneous ensemble of top-tier open-source and open-weight foundation models:

| Role | Primary Selected Model | Secondary / Fallback Model | Provider Infrastructure |
| :--- | :--- | :--- | :--- |
| **Orchestration Manager (Diya)** | `openrouter/google/gemma-4-31b-it:free` | `nvidia/llama-3.1-nemotron-70b-instruct` | OpenRouter / NVIDIA NIM |
| **Department Leads (Review & DAG)** | `openrouter/qwen/qwen3.8-27b:free` | `nvidia/deepseek-ai/deepseek-v4.1-flash` | OpenRouter / NVIDIA NIM |
| **Code Workers (Frontend/Backend)** | `groq/qwen/qwen3.8-27b` | `groq/openai/gpt-oss-120b` | Groq LPU |
| **Fast Edits & Terminal Workers** | `groq/openai/gpt-oss-20b` | `openrouter/cohere/north-mini-code:free` | Groq LPU / OpenRouter |
| **Evaluation & QA Agents** | `openrouter/nvidia/nemotron-3.5-lightning:free` | `nvidia/llama-3.1-nemotron-70b-instruct` | OpenRouter / NVIDIA NIM |
| **Documentation & Synthesis** | `go/glm-5.3-flash` | `openrouter/google/gemma-4-31b-it:free` | OpenCode Go / OpenRouter |

---

## 8. Why This Technology Was Selected
1. **Avoiding Single-Model Failure Modes:** Generalist models compromise between deep reasoning and low latency. By assigning `Qwen 3.8 27B` and `DeepSeek` to core coding, and `Gemma 31B` or `Nemotron 70B` to architectural planning and review, each stage uses the strongest model for that specific cognitive domain.
2. **Rate Limit Diversification Across Free Tiers:** Free provider tiers strictly enforce quotas (e.g., Groq caps at 7,000 ITPM and 30 RPM; OpenRouter free models have individual rate buckets; NVIDIA NIM provides dedicated prototyping credits). Distributing roles across separate providers allows the system to sustain 10+ concurrent agents without triggering HTTP 429 rate limit exceptions.
3. **Data Privacy and Sovereignty:** Open-weight models can be hosted locally via Ollama/vLLM or consumed through privacy-first inference APIs without granting proprietary vendors rights to train on user codebases.

---

## 9. AI's Role in the System
AI operates at every tier of the lifecycle:
- **Triage & Classification:** Classifies incoming requests by complexity (`light`, `standard`, `heavy`), required departments, estimated execution seconds, and assigns the appropriate break/compaction policy.
- **Hierarchical Planning:** The Manager generates a directed acyclic graph (DAG) of interdependent tasks.
- **Autonomous Coding & Reasoning:** Workers run in autonomous tool loops executing file reads, syntax analysis, code edits, and command invocations.
- **Peer & Lead Review:** Upon completing subtasks, worker agents submit diffs to their Department Lead for review. The lead validates the output, requests rework if tests fail, and delivers the consolidated branch to the Manager.

---

## 10. System Architecture
```
                                 [ USER ]
                                    │
                                    ▼ (Goal Input / Approvals)
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 GRAVITYDESK 3D VIRTUAL OFFICE                          │
  │  Three.js Scene · Agent Rigs · Furniture · Minimap · Task DAG · Logs   │
  └───────────────────────────────▲────────────────────────────────────────┘
                                  │ WebSocket Events & HTTP REST (:8000)
                                  ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 GRAVITYDESK BRIDGE & GATEWAY                           │
  │  ┌──────────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
  │  │  Triage & DAG Engine │  │ Event Bus & Tape │  │ Permission Gate  │  │
  │  └──────────┬───────────┘  └────────┬─────────┘  └────────┬─────────┘  │
  │             │                       │                     │            │
  │             ▼                       ▼                     ▼            │
  │  ┌──────────────────────────────────────────────────────────────────┐  │
  │  │             HETEROGENEOUS MODEL ROUTING MATRIX                   │  │
  │  │  Token-Bucket Limiter · Concurrency Lanes · AIMD Retry Backoff   │  │
  │  └──────────────────┬───────────────┬──────────────┬────────────────┘  │
  └─────────────────────┼───────────────┼──────────────┼───────────────────┘
                        ▼               ▼              ▼
               ┌────────────────┐┌─────────────┐┌──────────────┐
               │   GROQ LPU     ││ NVIDIA NIM  ││  OPENROUTER  │
               │ Fast Coder/Edit││ Architect/QA││ Manager/Lead │
               └────────────────┘└─────────────┘└──────────────┘
                        │
                        ▼ (Tool & Shell Executions)
  ┌────────────────────────────────────────────────────────────────────────┐
  │                     REALGRAVITY EXECUTION ENGINE                       │
  │  Git Worktrees · Sandboxed CLI Execution · AST Diffs · Host Rollback   │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Component-Level Architecture
1. **`frontend/src/three/` (Spatial Rendering Engine):**
   - `OfficeCanvas.tsx` & `StaticOffice.tsx`: Renders physical room geometry, desks, chairs, meeting rooms, glass partitions, and lighting.
   - `AgentRig.ts`: Procedural humanoid character rig with walking kinematics, sitting postures, nodding/thinking gestures, and typing animations.
   - `director.ts`: Pathfinding and action coordinator translating abstract lifecycle events (`task.started`, `agent.chat`, `break_start`) into physical 3D movements.
2. **`frontend/src/ui/` (Observer & Control Interface):**
   - `Toolbar.tsx`: Compact header providing sim clock controls, speed factors (1x, 10x, 60x), mode toggles, model selector, and zone jumps.
   - `LeftPanel.tsx` & `DagView.tsx`: Displays hierarchical Org progress and interactive SVG Task DAG with smooth Bézier splines and live pulse animation.
   - `Inspector.tsx`: Deep-dive inspector displaying selected agent status, assigned model, active tool terminal stream, and token energy meter.
3. **`bridge/` (Mediation & Gateway Services):**
   - `router.py`: Selects optimal provider and model based on role alias, required context length, and live provider health.
   - `lane.py`: Manages per-provider token bucket rates and concurrency caps.
   - `breaker.py`: Circuit breaker isolating failing providers without crashing the session.
4. **`backend/` (Execution Core):**
   - `pag.ps1` & `opencode.exe`: Lightweight Windows/Linux execution runtime supporting native mode (~80MB RAM) or Docker sandbox mode.

---

## 12. Data / Information Flow
```
1. Goal Submitted ──► Triage Engine classifies task & generates DAG nodes
2. Plan Emitted   ──► WebSocket broadcasts plan.ready to 3D Floor & DAG View
3. Team Hired     ──► Director navigates agents from Reception to Department Desks
4. Task Running   ──► Worker calls Gateway ──► Groq/NVIDIA/OpenRouter LLM API
5. Terminal Exec  ──► RealGravity executes test/build in isolated Git branch
6. Review Gate    ──► Worker submits output to Department Lead for review
7. Lead Synthesis ──► Lead merges branch & reports milestone to Manager Diya
8. Final Report   ──► Manager compiles findings & delivers Markdown deliverable
```

---

## 13. Agentic Workflow
The system utilizes a structured, hierarchical agent workflow:
1. **Manager (Diya):** Deconstructs goals into isolated milestones, determines department participation, and resolves cross-department blockers.
2. **Department Leads (Aanya, Kabir, Nisha, Dev):** Own department-specific subgraphs. They assign work to team members, perform code and architectural reviews on completed tasks, and ensure unit tests pass.
3. **Workers (Rohan, Meera, Isha, Vikram, Arjun, Tara):** Dedicated executors. They run code edits, tool invocations, and test suites. When task context exceeds 60%, they trigger compaction and move to the pantry for a coffee break, preventing context overflow.
4. **Synchronous Meeting Protocol:** When two agents must resolve architectural dependencies, they physically walk to Meeting Rooms (M1/M2/M3) and initiate a structured chat sequence that pins findings to the shared Blackboard.

---

## 14. Technology Stack
- **Frontend & 3D Visualization:** React 18, Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Tailwind CSS, Framer Motion.
- **State Management & Graph Layout:** Zustand, Dagre Graphlib (`@dagrejs/dagre`).
- **Bridge & Gateway Server:** Node.js / TypeScript (`tsx`), Python 3.11+, WebSockets (`ws`), PyYAML, Pytest.
- **AI Models & Providers:** Groq LPU API, NVIDIA NIM API, OpenRouter API, OpenCode Go.
- **System Runtime & Tooling:** Windows PowerShell / Bash, Git worktree isolation, Vite build pipeline.

---

## 15. Expected Features
- **Deterministic 3D Office Simulation:** Complete spatial representation of office bays, conference rooms, manager cabin, server room, and cafeteria.
- **Dynamic Task DAG Visualization:** Live graph updating in real time with animated data flows, status pills, and direct agent camera-focus on click.
- **Hierarchical Team Reporting:** Workers report to Leads; Leads validate deliverables and report upward to the Manager, with accurate progress rollups.
- **Adaptive Context Compaction:** Visual representation of agent token consumption; agents take visual breaks when context limits approach threshold.
- **Human-in-the-Loop Permission Console:** Sensitive file deletions or terminal commands pause execution until user approval is granted.
- **Multi-Model Provider Failover:** Automatic fallback to secondary open-weight models upon encountering rate limits or provider downtime.

---

## 16. Implementation Approach
The project follows a modular, incremental engineering implementation:
1. **Phase 1: Environment & Floor Geometry:** Construct coordinate-accurate office layouts, collision boundaries, and chair orientations.
2. **Phase 2: Rigging & Agent Kinematics:** Implement procedural walking, sitting, typing, and gestural state transitions in Three.js.
3. **Phase 3: Gateway & Model Layer:** Configure rate-limiting token buckets and wire API keys for Groq, NVIDIA NIM, and OpenRouter.
4. **Phase 4: Agentic Protocol & Real Hierarchy:** Establish structured communication pipelines where worker deliverables pass through lead validation before manager aggregation.
5. **Phase 5: Real Execution & Host Bridge:** Connect the 3D office to the RealGravity execution engine for live repository editing and test verification.

---

## 17. Expected Final Output
The completed project will produce:
- A responsive, low-latency 3D web application running on `http://localhost:5173`.
- A fully operational mediation server on `http://localhost:8000` exposing REST endpoints and WebSocket feeds.
- Verified autonomous code generation where real user prompts produce actual, tested software artifacts in repository branches.
- Exportable structured run reports including complete execution timelines, model call latencies, token expenditures, and git commit hashes.

---

## 18. Future Scope / Scalability
- **Local On-Premise Worker Deployment:** Direct integration with Ollama and vLLM instances for 100% offline, air-gapped development floors.
- **Multi-Floor Building Scaling:** Adding dedicated floors for larger virtual organizations (e.g., Floor 1: Core Systems, Floor 2: Mobile & Web, Floor 3: Security & Audit).
- **Voice Synthesis for Inter-Agent Discussions:** Integrating open-source text-to-speech (TTS) models to vocalize meeting room debates and standup summaries.
- **IDE Extension Integration:** Embedding the 3D office as a live companion webview inside Visual Studio Code and JetBrains IDEs.

---

## 19. Open-Source Dependencies / Components
- **Three.js (`three`):** MIT License — WebGL 3D graphics rendering.
- **React Three Fiber (`@react-three/fiber`):** MIT License — Declarative React wrapper for Three.js.
- **Dagre (`@dagrejs/dagre`):** MIT License — Directed graph layout optimization.
- **Zustand (`zustand`):** MIT License — Lightweight reactive state management.
- **Framer Motion (`framer-motion`):** MIT License — Physics-based UI animations.
- **Open-Weight Models:** Qwen 2.5/3.8 (Apache 2.0 / Qwen License), Google Gemma (Gemma Terms), Llama 3.1 / Nemotron (Llama 3.1 Community License), DeepSeek (MIT License).

---

## 20. Expected Challenges and Mitigation
| Identified Challenge | Risk Factor | Proposed Engineering Mitigation |
| :--- | :--- | :--- |
| **Provider Rate Limiting (429s)** | High | Token-bucket sliding window with AIMD exponential backoff; automatic role failover across Groq, NVIDIA, and OpenRouter. |
| **Agent Navigation Collisions** | Medium | Vector separation steering algorithms and discrete doorway queueing systems in `director.ts`. |
| **Context Window Exhaustion** | High | Three-tier context compaction discipline; automatic memory summarization and physical visual break cycles. |
| **Hallucinated File Modifications** | High | Git worktree sandboxing with automated validation gates and instant rollback capability before merging. |
| **WebSocket Reconnection Drops** | Low | Monotonic sequence numbering (`seq`) with `since_seq` client replay protocol guaranteeing zero dropped events. |

---

## How to Run the Project

### Prerequisites
- Node.js 18+ & npm
- PowerShell 7+ (Windows) or Bash (Linux/macOS)
- Valid API Keys for at least one provider (Groq, NVIDIA NIM, or OpenRouter)

### Setup & Launch
1. **Configure Environment Variables:**
   ```powershell
   # Ensure .env is populated with your keys in the root directory:
   # GROQ_API_KEY=gsk_...
   # NVIDIA_API_KEY=nvapi-...
   # OPENROUTER_API_KEY=sk-or-v1-...
   ```
2. **Start the Complete System:**
   ```powershell
   # Runs both the Bridge server (:8000) and Frontend (:5173) simultaneously:
   .\scripts\start-all.ps1
   ```
3. **Access the Application:**
   - 3D Virtual Floor: `http://localhost:5173`
   - Bridge Health & API: `http://localhost:8000`
