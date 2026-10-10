# GravityDesk (BenchMates): Autonomous Multi-Agent Software Engineering Floor
## Comprehensive Architecture, Implementation & Technical Reference

**System Name:** GravityDesk (also incorporating BenchMates / Deskmates & RealGravity / PAG)  
**Authors & Contributors:** Atharv (`atharv1909`), Aditya Bhalerao (`bhalerao-aditya007`)  
**Repository:** [https://github.com/atharv1909/BenchMates](https://github.com/atharv1909/BenchMates)  
**Target Environments:** Windows 10/11 (Native PowerShell & Node.js) and Linux / WSL2  
**Primary UI / Simulation Ports:** Frontend (`http://localhost:5173`), Bridge Server (`http://localhost:8000`), Local Gateway (`http://127.0.0.1:8787`)  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Core Problem in Autonomous AI Coding
Contemporary generative AI programming tools operate almost exclusively as linear, single-turn chat interfaces or localized pair-programming autocompletions. When tasked with building or refactoring real-world, production-grade software systems, this traditional paradigm fails due to three fundamental limitations:

1. **Context Saturation & Role Dilution:** A single prompt attempting to simultaneously manage architectural decomposition, dependency resolution, API design, database schema migration, unit testing, and documentation quickly dilutes the model's active context window. The model suffers instruction drift, hallucinates imports, and forgets requirements formulated just a few turns prior.
2. **Provider Bottlenecks & Rate Limiting (HTTP 429s):** Autonomous agent loops execute high-frequency file reads, terminal commands, syntax checks, and test passes. Directing all these calls to a single model provider rapidly exhausts Requests Per Minute (RPM) and Tokens Per Minute (TPM) limits on free and tier-limited accounts.
3. **Execution Opacity & Cognitive Friction:** Terminal-only agent harnesses provide walls of scrolling text where users cannot intuitively see which agent is blocked on an external dependency, which model is generating code, where inter-agent reviews failed, or when a high-risk security permission is stalled.

### 1.2 The GravityDesk Solution
GravityDesk conceptualizes software development as a collaborative, physical engineering floor rendered in a high-performance **3D isometric workspace (Three.js / React Three Fiber / WebGL)**, coordinated by an **Asynchronous Mediation Bridge**, and powered by a dual-engine execution harness (**RealGravity / Personal Antigravity**).

Instead of delegating an objective to a monolithic LLM, GravityDesk triages the request, hires specialized department leads and workers, distributes roles across a **heterogeneous mesh of open-weight models** (Groq LPU, NVIDIA NIM, OpenRouter Free Tier, OpenCode Go), and drives every agent action, pathfinding trajectory, coffee break, peer review, and terminal execution from a strictly validated, monotonic event stream.

---

## 2. High-Level System Architecture

GravityDesk is organized into a modular three-tier architecture:

```
                                    [ USER ]
                                       │
                      (Task Formulation / Safety Approvals)
                                       ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 TIER 1: 3D VIRTUAL FLOOR & OBSERVER UI                 │
  │   React 18 · Three.js · React Three Fiber · Zustand · Tailwind CSS     │
  │   • 96m x 70m Coordinate-Accurate Office Geometry (14 Zones)           │
  │   • Procedural Agent Rigs (Kinematic Walking, Typing, Gestures)        │
  │   • Interactive Task DAG (Dagre Layout with Bézier Particle Flow)      │
  │   • Agent Inspector, Permission Console, Compute & Cost Drawer         │
  │   • Diya Manager Conversational Terminal (Live LLM Reasoning)          │
  └───────────────────────────────▲────────────────────────────────────────┘
                                  │ WebSocket (ws://localhost:8000/ws/events)
                                  │ REST Control (http://localhost:8000/api/*)
                                  ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │             TIER 2: MEDIATION BRIDGE & PROVIDER GATEWAY                │
  │   Node.js / TypeScript Server (:8000) & Python Gateway Engine (:8787)  │
  │   • Heuristic & LLM Sizing / Triage Engine                             │
  │   • Monotonic Sequence Event Bus (`seq`) & SQLite Tape Store           │
  │   • Dynamic 4-Wing Org Allocator & Desk Assignment                     │
  │   • Token-Bucket Limiter (RPM / TPM), Priority Queue & Queue Aging     │
  │   • Circuit Breaker, Exponential Backoff & Provider Fallback Chains    │
  │   • Real-Time Groq LLM Reasoning Proxy (/api/llm/chat)                 │
  └───────────────────────────────▲────────────────────────────────────────┘
                                  │ Subprocess / Pseudo-Key Bearer Tokens
                                  │ Local Filesystem & Git Worktrees
                                  ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │            TIER 3: REALGRAVITY (PAG) EXECUTION ENGINE                  │
  │   Native Windows Runtime (~80 MB RAM) & Hardened Docker Sandbox        │
  │   • Headless OpenCode Agent Loops (`opencode.exe`)                     │
  │   • Isolated Git Worktrees per Worker (`agent/<ts>/<worker>`)          │
  │   • 5-Tier Context Discipline (Masking, Truncation, Token Compaction)  │
  │   • Spliced Permission Engine (Non-Bypassable Denials)                 │
  │   • Live AST Audit Logger (`.agent/audit.jsonl` Line Tracking)         │
  │   • Pre-Flight Privacy Gate (`hosted-allowed.txt`)                     │
  └────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ (Inference Dispatch)
        ┌───────────────────┬───────────────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼
    GROQ LPU            NVIDIA NIM          OPENROUTER          OPENCODE GO
  GPT-OSS 120B / 20B   Nemotron 70B       Qwen 3.8 27B:free   DeepSeek V4 Flash
   Qwen 3.8 27B       DeepSeek V4.1 Flash  Gemma 4 31B:free    GLM 5.3 Flash
```

---

## 3. Detailed Component Architecture & Implementation

### 3.1 Tier 1: 3D Virtual Floor & Spatial Simulation Engine

Located in `frontend/src/three/`, `frontend/src/sim/`, and `frontend/src/nav/`.

#### 3.1.1 Spatial Layout & Environment Geometry (`config/layout.ts`, `config/office.ts`)
- **Floor Coordinates:** The virtual building measures **96 meters wide (East-West, X-axis from -48 to +48) by 70 meters deep (North-South, Z-axis from -35 to +35)** with 3-meter wall heights.
- **Four Distinct Department Wings:**
  - **North-West (NW) Bay:** Standard home for Backend Engineering (`x: -31, z: -9`).
  - **North-East (NE) Bay:** Standard home for Frontend Engineering (`x: 31, z: -9`).
  - **South-West (SW) Bay:** Standard home for Data & QA (`x: -32, z: 29`).
  - **South-East (SE) Bay:** Standard home for Content & Technical Writing (`x: 32, z: 29`).
- **Additional Specialized Spatial Zones:**
  1. **Manager's Executive Cabin (`manager`):** Enclosed by glass partitions (`x: 1, z: -22.5`), executive desk, visitor chairs, large strategy blackboard, and private conference table.
  2. **Meeting Rooms (M1, M2, M3):** Glass-walled conference rooms with central tables and 4 meeting chairs each (`x: -9.5, -0.5, 8.5, z: -9.5`) for synchronous peer reviews and lead alignments.
  3. **The Cafeteria (`cafeteria`):** Food court tables and serving counters (`x: -34, z: 6`) where workers take visual lunch breaks during 50% DAG completion of heavy tasks.
  4. **The Pantry (`pantry`):** Espresso machine, counter, water cooler, and high bar stools (`x: 27, z: 7`) where agents drink coffee when context compactions occur.
  5. **Break Lounge (`lounge`):** Sofas and beanbags (`x: 40, z: 7`) for casual breaks.
  6. **LLM Gateway Server Room (`server`):** Glass-walled datacenter (`x: 0, z: 23`) featuring four server racks equipped with dynamically blinking instanced LEDs.
  7. **Reception & Entrance Lobby (`reception`):** Welcome desk, corporate logo wall, sofas, and entry turnstiles (`x: 12, z: 29`).
  8. **Central Plaza (`plaza`):** Open common area with rugs, water coolers, artwork, and designated standing chat coordinates.
  9. **Restrooms & Storage Service Blocks:** Solid architectural volume blocks.

#### 3.1.2 Procedural Humanoid Rigging (`three/AgentRig.ts`)
Each character is procedurally generated with mathematical kinematics rather than static skeletal meshes:
- **Anatomy & Meshes:** Built from shared geometries: sphere heads, capsule torsos, upper arms, thighs, and shins.
- **Kinematic States & Animations:**
  - `walk`: Natural arm-swing and leg-stride kinematics driven by walk-cycle phase math, with dynamic head bobbing.
  - `seated`: Thighs rotated -1.45 rad, shins bent 1.45 rad, hip height lowered to 0.62m.
  - `type`: Hands elevated over keyboard, rapid finger/hand oscillation (`sin(t * 9)`), subtle head nods.
  - `think`: Right hand raised to chin (`armR: -2.4`), head tilted thoughtfully.
  - `drink`: Coffee cup attached to right hand, arm raised to mouth (`armR: -2.1 + sin(t * 2.2) * 0.3`).
  - `talk`: Gesturing arm movements accompanied by head articulation.
  - `review`: Hands placed forward on table.
  - `celebrate`: Both arms raised triumphantly (`armL, armR: -2.7 + sin(t * 10) * 0.2`).
  - `confuse`: Hands spread wide in confusion.
- **Clothing & Visual Hierarchy:**
  - **Manager (Diya):** Charcoal suit jacket (`#23232a`), crisp white collar, and corporate brand-colored tie.
  - **Department Leads:** Deepened tint of their department's color (`multiplyScalar(0.72)`), official corporate lanyard, and white ID badge.
  - **Workers:** Shirts colored to match their active department's hue, diverse skin tones (6-palette array) and procedural hair styles (buns, ponytails, short cuts, curls).

#### 3.1.3 Furniture Kinematics & Interactive Office Elements
- **Sliding Chairs (`three/Chairs.tsx`):** Desks feature animated chairs that physically slide backward by 0.35m when an agent sits down or stands up, preventing visual clipping through the desktop.
- **Sliding Doors (`three/Doors.tsx`):** Glass doors across meeting rooms, the manager's cabin, and server room smoothly slide open along their axis when agents approach within 1.6m and automatically close upon exit.
- **Dynamic Server LEDs (`three/StaticOffice.tsx`):** Server rack LEDs pulse in green during active LLM streaming calls (`llm.call_started`). If a 429 rate limit is encountered, the LEDs turn warning red (`#d64545`).
- **Interactive Whiteboard (`three/OfficeCanvas.tsx`, `three/textures.ts`):** In the manager's cabin, the whiteboard dynamically renders the current high-level project outline directly onto an HTML canvas texture.

#### 3.1.4 Visual Effects & Particle Layer (`three/FxLayer.tsx`)
- **Flying Envelopes:** When an agent delegates a task or delivers a review locally (< 20m distance), an animated envelope flies on a parabolic arc through the 3D air.
- **Corridor Couriers:** If agents are separated by 20+ meters, the system spawns an autonomous courier messenger that runs along A* corridors to deliver the message.
- **3D Validation Stamps:** When QA or lead reviews pass or fail, a green checkmark or red "REJECTED" stamp physically hovers over the author's desk in 3D space.

#### 3.1.5 Navigation, Collision & A* Pathfinding (`nav/grid.ts`, `nav/astar.ts`, `sim/director.ts`)
- **0.25-Meter Resolution Grid:** The 96x70m floor is discretized into a 384x280 collision matrix where walls, desks, counters, server racks, and plants mark cells as blocked.
- **A\* Pathfinding Algorithm:** Computes optimal paths utilizing Manhattan distance heuristics, allowing 8-directional motion with diagonal corner-cutting prevention.
- **Axis-Separated Wall Sliding:** When an agent grazes an obstacle corner, motion along the unobstructed axis is preserved while the colliding vector is dampened, preventing agents from getting stuck on furniture.
- **Agent-Agent Separation Steering:** Real-time inter-agent collision avoidance pushes intersecting walking agents apart smoothly, with lower IDs yielding right-of-way.
- **Discrete Pantry Queuing System:** When the 7 designated pantry counter/stool slots are occupied, overflow coffee seekers queue in 12 distinct standing coordinates instead of overlapping.
- **Layout Validator (`nav/validate.ts`):** Automatically executes at startup, verifying that all workstations and doors maintain at least 1.2m aisle clearance and that all chair approaches are obstacle-free.

---

### 3.2 Tier 2: The Mediation Bridge & Provider Gateway

Located in `bridge/` and `frontend/tools/mock-bridge/`.

#### 3.2.1 Gateway Resilience Architecture (`bridge/deskmates_bridge/gateway/`)
Every LLM call throughout the entire system—whether generated by the triage classifier, manager planner, department leads, or RealGravity worker sessions—passes through the local Gateway.
- **Token-Bucket Rate Limiter (`lane.py`):**
  - Configured per provider/key with defined RPM, TPM, burst capacity, and safety factors (default `0.9` to never ride limits).
  - Continuously calculates refill rates and available tokens per second.
- **Sliding TPM Window:** Tracks token consumption over rolling 60-second windows to prevent exceeding provider token quotas.
- **Multi-Level Priority Queue:**
  - **Priority 0:** Critical-path manager and lead planning/synthesis calls.
  - **Priority 1:** Retries of previously started calls (never waste already paid-for work).
  - **Priority 2:** Validation passes and triage confirmation.
  - **Priority 3:** Standard worker executions (shortest-job-first ordering).
- **Queue Aging:** Requests waiting in queue gain one priority level every 30 seconds (`aging_step_s: 30.0`), preventing worker starvation during heavy load.
- **AIMD Exponential Backoff & 429 Handling:**
  - Respects provider `Retry-After` headers plus 0–20% random jitter.
  - On 429 without headers, applies exponential backoff (2s, 4s, 8s, up to 60s) and cuts the bucket's throughput by 50% (AIMD).
  - On subsequent successes, gradually scales rate back up by +2% per turn.
- **Circuit Breaker (`breaker.py`):** Trips to `open` state after 5 failures in 60 seconds. Enters `half_open` after a 30-second cooldown, sending a single probe request before resuming normal traffic.
- **Dynamic Header Learning:** Inspects incoming `x-ratelimit-remaining-requests`, `x-ratelimit-reset`, and `retry-after` headers to automatically recalibrate configured rate limits on the fly.
- **Token Estimator (`estimator.py`):** Calculates prompt sizes using `chars / 3.5` and maintains an exponential moving average (EMA) to learn exact model-specific token-to-character ratios.

#### 3.2.2 Heterogeneous Model Allocation Matrix
GravityDesk pairs specific roles with foundation models optimized for those tasks:

| Role Alias | Primary Open-Weight Model | Fallback Chain | Context Window | Cognitive Specialization |
| :--- | :--- | :--- | :--- | :--- |
| **`triage`** | `groq/openai/gpt-oss-20b` | `openrouter/nvidia/nemotron-3.5-lightning:free` | 8,000 | Ultra-fast heuristic validation & sizing (< 1s) |
| **`manager`** | `openrouter/google/gemma-4-31b-it:free` | `nvidia/llama-3.1-nemotron-70b-instruct` → `openrouter/qwen/qwen3.8-27b:free` | 128,000 | Deep architectural planning & final synthesis |
| **`manager_escalation`** | `groq/openai/gpt-oss-120b` | `openrouter/qwen/qwen3.8-27b:free` | 8,000 | High-difficulty replans & conflict resolution |
| **`lead`** | `openrouter/qwen/qwen3.8-27b:free` | `nvidia/deepseek-ai/deepseek-v4.1-flash` → `go/deepseek-v4-flash` | 128,000 | Subgraph decomposition & code review |
| **`code`** | `nvidia/deepseek-ai/deepseek-v4.1-flash` | `openrouter/qwen/qwen3.8-27b:free` → `go/deepseek-v4-flash` | 128,000 | Autonomous tool loops, refactors, feature builds |
| **`fast`** | `groq/openai/gpt-oss-20b` | `openrouter/google/gemma-4-31b-it:free` | 8,000 | Rapid micro-edits & UI component tweaks |
| **`research`** | `openrouter/google/gemma-4-31b-it:free` | `nvidia/llama-3.1-nemotron-70b-instruct` | 128,000 | Multi-source synthesis & search ranking |
| **`qa`** | `openrouter/nvidia/nemotron-3.5-lightning:free` | `nvidia/deepseek-ai/deepseek-v4.1-flash` | 128,000 | Test generation, assertion checks, lint validation |
| **`text`** | `go/glm-5.3-flash` | `openrouter/cohere/north-mini-code:free` | 128,000 | High-volume documentation & README synthesis |

> **Context Window Guard:** Groq models have a strict 8,000-token context limit. The Gateway refuses to route prompts exceeding 80% of 8k (~6,400 tokens) to Groq, automatically promoting them to 128k models in the chain.

#### 3.2.3 Contract-Compliant Server (`frontend/tools/mock-bridge/server.ts`)
An executable reference implementation providing full REST and WebSocket endpoints:
- **`POST /api/tasks`:** Initiates a run, generates a unique `run_id`, triages the task, and returns `{ task_id, run_id }`.
- **`GET /api/models`:** Exposes available models and context ceilings.
- **`GET /api/health`:** Reports gateway status, queue depths, and provider API key health.
- **`GET /api/runs/{run_id}/events`:** Returns complete event tapes with `since_seq` pagination.
- **`WS /ws/events?run_id=<id>&since_seq=<n>`:** Broadcasts strictly monotonic event streams. On reconnection, immediately replays missed events before streaming live events.
- **`POST /api/llm/chat`:** Live Groq inference endpoint powering conversational interactions with Diya (the Manager agent).

---

### 3.3 Tier 3: RealGravity (PAG) Host Execution Engine

Located in `backend/`.

#### 3.3.1 Execution Modes
1. **Native Engine (Default):**
   - Runs directly on Windows using `backend/bin/opencode.exe`.
   - Generates configuration via `scripts/gen-native-config.py` from `.env`.
   - Consumes only **~80 MB to 110 MB RAM**, offering sub-second launch times (0.4s).
2. **Docker Sandbox Engine:**
   - Runs in an isolated Ubuntu container with dropped capabilities (`cap_drop: [ALL]`), read-only root filesystem, memory limits (2.0 GB), and Squid proxy egress allowlists.

#### 3.3.2 Five-Tier Context Discipline (`backend/plugins/context/lib.ts`)
To prevent context saturation over long sessions, RealGravity enforces 5 mathematical tiers:
- **Tier 1 (Cache Prefix Stabilization):** Stabilizes prompt headers to maximize provider KV-cache hits.
- **Tier 2 (Surgical Head/Tail Truncation):** Command outputs > 24,000 characters are truncated to a 1,500-char head and 1,500-char tail. Full unedited logs are preserved in `.agent/out/`.
- **Tier 3 (Staged Observation Masking):**
  - Computes context pressure: $\text{Fraction} = \text{Tokens} / 128,000$.
  - **Stage S0 (< 40%):** Protects 4 turns; minimum 2,500 chars to mask.
  - **Stage S1 (40% - 60%):** Protects 3 turns; minimum 1,500 chars to mask.
  - **Stage S2 (60% - 75%):** Protects 2 turns; minimum 800 chars to mask.
  - **Stage S3 (> 75%):** Protects 1 turn; minimum 300 chars to mask.
  - Replaced observations receive lightweight placeholders: `[... output omitted: L lines, hash: H ...]`. Tools in `NEVER_MASK` (`edit`, `write`, `patch`) are never masked.
- **Tier 4 (Token Compaction):** Triggers summarization at 20,000 tokens. In GravityDesk, this compaction event directly translates to a 3D coffee break in the pantry.
- **Tier 5 (Externalized Notes):** Retains critical progress in `.agent/notes.md`, surviving across compaction cycles.

#### 3.3.3 Security Profiles & Permissions Splicing
- **`strict`:** Every file modification and shell execution requires explicit user authorization.
- **`assist` (Default):** File modifications are auto-approved; shell commands prompt the user. Pre-approved commands in `.pag/commands.txt` run automatically.
- **`turbo`:** Fully autonomous execution; strictly requires a clean Git working directory.
- **Non-Bypassable Hard Denials:** `sudo *`, `git push *`, `rm -rf *`, `ssh *`, and `git reset --hard` are permanently blocked by container configuration.
- **Pre-Flight Privacy Gate (`hosted-allowed.txt`):** Prevents transmitting code to external APIs unless the project workspace path is explicitly whitelisted.

#### 3.3.4 Git Worktree Sandboxing & Audit Logging
- Every session checks out a timestamped integration branch (`agent/<timestamp>`).
- Each worker executes in an isolated Git worktree (`.deskmates/wt/<run>/<agent_id>`).
- `backend/plugins/audit/index.ts` tails diffs and appends file paths with exact modified line ranges (`L12–45`) to `.agent/audit.jsonl`.
- The user can merge the worktree into the main branch or cleanly discard it with a single click.

---

## 4. The Unified Event Contract (Contract v3)

The communication protocol between the UI and backend comprises 36 strictly validated event types across 4 functional domains.

### 4.1 Run Lifecycle & Planning Events
- `task.created`: Broadcasts initial user goal.
- `task.triaged`: Emits task classification (`task_class`), intensity (`light`, `standard`, `heavy`), estimated logical effort (`est_effort_s`), estimated workers, rationale, break policy, and active department definitions.
- `plan.ready`: Delivers the complete Task DAG (nodes, edges, descriptions, deliverables).
- `plan.updated`: Emitted when the manager or lead modifies the DAG (re-plans, subtask expansions).
- `result.final`: Signals project completion, opening the final report modal with markdown content, citations, and logical vs. real effort metrics.
- `run.checkpoint`: Announces Git integration branch (`agent/<ts>`) and base commit hash, enabling Merge/Discard controls.
- `run.error`: Surfaces runtime issues with recoverable flags.
- `sandbox.mode`: Declares host execution mode (`native` or `docker`).

### 4.2 Agents & Spatial Movement Events
- `worker.hired`: Spawns an agent in reception and navigates them to their assigned desk. The manager (`M0`) is seated instantly.
- `worker.released`: Agent stands, walks through reception, and despawns.
- `agent.state_changed`: Transitions agent status (`IDLE`, `ASSIGNED`, `WORKING`, `WAITING`, `REVIEW`, `BREAK`, `COMPLETE`, `FAILED`, `OFFLINE`).
- `agent.metrics`: Updates agent energy (0–100), active context tokens, and task completion counts.
- `context.stage_changed`: Broadcasts context tier stages (S0–S3) and token fractions.
- `agent.moved`: Triggers movement toward a designated destination (`desk`, `pantry`, `cafeteria`, `lounge`, `meeting`, `exit`).
- `agent.break_start`: Starts a break (`coffee`, `lunch`) and routes the agent to the appropriate area.
- `agent.chat`: Initiates a conversation between two agents at a designated chat station, displaying dialogue bubbles.
- `agent.break_end`: Concludes break and returns agent to their desk.
- `message.sent`: Spawns a flying envelope or walking courier between agents.
- `blackboard.note`: Pins architectural findings, hand-offs, or directives to the central blackboard.

### 4.3 Task Execution & Code Streaming Events
- `task.assigned`: Assigns task node to an agent.
- `task.started`: Agent begins typing at workstation.
- `task.progress`: Updates task progress percentage and status note based on measurable milestones.
- `task.completed`: Signals task success, triggers celebration animation, and plays audio ping.
- `task.failed`: Signals task failure, triggers confusion gesture, and initiates retry ladder.
- `task.rework`: Re-queues task for revision following lead review feedback.
- `task.reassigned`: Reallocates failed task to a different worker.
- `validation.passed` / `validation.failed`: Spawns 3D stamp indicating verification results.
- `file.edit`: Logs modified file path, branch, and exact line ranges (`[[start, end], ...]`).
- `runtime.stream`: Streams live terminal commands and test output lines to the Inspector.

### 4.4 Compute, Permissions & System Events
- `llm.call_started`: Dispatches upstream LLM call; triggers agent thinking pose and illuminates server rack LEDs.
- `llm.call_finished`: Records token counts (`tokens_in`, `tokens_out`) and request latency.
- `gate.state`: Updates global concurrency, queue depth, and backoff status.
- `permission.requested`: Pauses agent execution; agent walks to manager cabin to await user authorization.
- `permission.resolved`: Relays user decision (`once`, `always`, `reject`); agent returns to desk to resume or abort.
- `heartbeat`: Periodic keepalive every 15 seconds.
- `clock.tick`: Emitted every 5 seconds with synchronized office simulated time (`HH:MM`) and real elapsed seconds.

---

## 5. Triage, Decomposition, Scheduling & Review Lifecycle

### 5.1 Two-Stage Triage Engine
1. **Stage A (Word-Boundary Regex Heuristic):** Analyzes the prompt against regex patterns for keywords like `frontend`, `api`, `research`, `summarize`, and `database` without issuing LLM calls.
2. **Stage B (LLM Confirmation):** Dispatches a quick classification call to `groq/openai/gpt-oss-20b` (or fallback) to finalize task class, complexity score, and participating departments.

### 5.2 Mathematical Sizing & Complexity ($C$)
The system evaluates six signals scored from 0 to 10:
$$\text{Raw} = 4.0 \cdot \text{scope} + 3.5 \cdot \text{code} + 3.0 \cdot \text{research} + 2.0 \cdot \text{verify} + 1.5 \cdot \text{ambiguity} + 2.0 \cdot \text{depth} \quad (\max = 160)$$
$$C = \frac{100 \cdot \text{Raw}}{160} \quad (0 \le C \le 100)$$

- **$C < 15$ (`light` / Sprint):** Manager handles task solo at desk. Zero other workers hired. Zero coffee breaks, meals, or chats. Total runtime: ~2–4 minutes.
- **$15 \le C < 45$ (`standard` / Normal):** Focused team (2–4 workers). Coffee breaks triggered on context compaction. Chats occur on inter-department hand-offs.
- **$C \ge 45$ (`heavy` / Workday):** Full engineering swarm (6–12 workers). Lunch break scheduled at 50% DAG completion. Full review loops and cross-department debates.

### 5.3 Org Instantiation & Bay Allocation
Departments are assigned to distinct wings via `allocateBays()` to ensure each team has a dedicated bay:
- **`backend`:** APIs, microservices, databases, CLI engines (NW Bay).
- **`frontend`:** React components, Tailwind styling, state management (NE Bay).
- **`research`:** Web search analysis, technical comparisons (NW/SE Bay).
- **`data`:** Benchmarks, telemetry, validation scripts (SW Bay).
- **`qa`:** Automated test suites, linting, typechecking (SW Bay).
- **`content`:** Documentation, API references, final executive synthesis (SE Bay).

### 5.4 Scheduling & Worker Selection
Tasks are scheduled dynamically when all dependencies in `depends_on` report `done`:
$$\text{Score} = 0.40 \cdot \text{skill\_match} + 0.25 \cdot \text{availability} + 0.20 \cdot (1 - \text{workload}) + 0.10 \cdot \text{energy} + \text{priority\_bonus}$$

---

## 6. The Observer UI & Observability Console

Located in `frontend/src/ui/`.

### 6.1 Landing Page (`Landing.tsx`)
- Task input bar with sample goal chips.
- Live triage preview calculating task class and intensity in real time as the user types.
- Model selector, security profile toggle (`strict`, `assist`, `turbo`), execution mode switch (`live` vs. `replay`), and corporate accent color picker.
- Ambient 3D office canvas orbiting smoothly in the background.

### 6.2 Main Workspace (`Workspace.tsx`)
- Houses the 3D WebGL Canvas, Minimap, Triage Banner, Permission Desk, Event Log, and drawer overlays.
- **Keyboard Shortcuts:**
  - `Space`: Pause / Resume simulation.
  - `F`: Follow selected agent camera.
  - `G`: Toggle data flow lines in 3D.
  - `B`: Toggle 3D isometric view vs. 2D Blueprint orthographic mode.
  - `D`: Toggle Developer Overlay (live agent counts, door queues, stuck repaths).
  - `Esc`: Close open drawers and inspectors.

### 6.3 Toolbar (`Toolbar.tsx`)
- System status indicator (Live Bridge connected vs. Mock simulation).
- Speed control buttons (1x, 10x, 60x).
- Simulated office clock (`09:00` baseline) and real elapsed timer.
- Zone jump dropdown for instant camera focus on specific rooms.

### 6.4 Hierarchical Left Panel (`LeftPanel.tsx`, `DagView.tsx`)
- **Team Org Tab:** Visual tree representing the manager, leads, and workers with live status dots and progress bars.
- **Task DAG Tab:** Full interactive SVG directed acyclic graph laid out with Dagre. Features smooth Bézier curves, animated particle flows on active edges, and clickable nodes that focus the 3D camera directly on the assigned agent.
- **Blackboard Tab:** Live pins displaying cross-team architectural decisions, hand-offs, and user directives.

### 6.5 Deep-Dive Inspector (`Inspector.tsx`)
- **Profile Tab:** Agent role, engine label, energy gauge, context utilization meter, and reporting hierarchy.
- **Live Tab:** Real-time stream of file modifications with exact line ranges (`L12–45`), live terminal output, and Git checkpoint Merge/Discard buttons.

### 6.6 Human-in-the-Loop Permission Desk (`PermissionPanel.tsx`)
- Displays pending security authorizations when an agent attempts a sensitive shell or file operation in `strict` or `assist` mode.
- The agent physically walks to the manager's cabin and stands waiting.
- Offers three actions: **Reject all**, **Approve once**, and **Always (project)**.

### 6.7 Compute & Cost Drawer (`ComputeDrawer.tsx`)
- Real-time telemetry tracking LLM calls, deterministic tool executions, tokens in, and tokens out.
- Half-circle concurrency gauge illustrating active slots vs. capacity.
- Department utilization meters and estimated operational cost ($0.00 for open-source tiers with an optional toggle showing equivalent proprietary API cost).

### 6.8 Deliverables & Final Report Modal (`ReportView.tsx`)
- Comprehensive Markdown synthesis viewer with citations and effort comparisons.
- **Export Options:**
  - Export professional PDF report via `jsPDF`.
  - Download complete source code as a `.ZIP` archive.
  - Save individual files directly to disk.
- Interactive code viewer tab allowing users to inspect all generated source files.

### 6.9 Event Log & Diya Directive Console (`EventLog.tsx`, `sim/managerAgent.ts`)
- Filterable event stream displaying all simulation events with timestamps.
- **Active Floor Control Input:** Allows the user to message Diya (the Manager) directly:
  - Inquire about output files ("where are the output files?").
  - Request technical insights ("can you share one insight?").
  - Order Phase 2 expansions ("continue with next phase").
  - Pause work ("stop current task").
  - Ask free-form technical questions backed by live Groq LLM inference.
- Responses generate speech bubbles over Diya in 3D and pin notes to the blackboard.

---

## 7. Autonomous Output Deliverable: CRYPTracker

Located in `output/CRYPTracker/`.

To demonstrate complete end-to-end execution, GravityDesk includes a verified, full-stack software artifact generated autonomously by the swarm:

### 7.1 Application Overview
**CRYPTracker PRO** is an enterprise-grade, real-time cryptocurrency liquidity and price tracking dashboard built with React 18, TypeScript, Tailwind CSS, and Vite.

### 7.2 Core Implemented Features
1. **Live WebSocket Price Ticker:** High-frequency price streaming for BTC, ETH, SOL, BNB, and XRP with sub-30ms latency indicators.
2. **Animation Frame Throttling:** State updates batched to maintain 60 FPS without UI jank.
3. **Interactive Sparkline Charts:** Dynamic SVG visualizers with auto-scaling price wave charts.
4. **Order Depth Ladder:** Simulated live order book with real-time bid and ask depth visualizers.
5. **Price Alert Trigger Engine:** User-configurable thresholds triggering alert toasts when market prices cross targets.
6. **Watchlist & Search Filters:** Live instrument search and starred favorites list.
7. **Automated Test Suite:** Comprehensive Vitest assertions verifying data structures and price streaming.

---

## 8. Verification & Acceptance Testing

The project incorporates 41 automated tests across frontend and bridge suites:

### 8.1 Acceptance Test Coverage
- **B1 (Tape Replay):** Verified playback of recorded event tapes (`sprint.json`, `standard.json`, `heavy.json`).
- **B2 (Audit Line Tracking):** Verified that file edits display exact line ranges in the Inspector.
- **B3 (Permission Round-Trip):** Verified that approving permissions in the UI unblocks agents in $\le 1$ second.
- **B4 (429 Backoff Resilience):** Verified that injected HTTP 429 errors activate backoff states without crashing runs.
- **B5 (Context Compaction):** Verified that reaching context Stage 3 triggers coffee breaks in the pantry.
- **B6 (WebSocket Resume):** Verified that dropping and reconnecting a WebSocket client yields zero duplicate and zero missing events.
- **B7 (Effort Metric):** Verified that final reports calculate measured organizational effort vs. real elapsed time.
- **B8 (Git Control):** Verified that Merge and Discard actions control worktree integration branches.
- **T1–T7 (Triage & Pacing):** Verified word-boundary classification, unique wing allocations, sprint runs with zero breaks, and heavy runs with cafeteria lunch breaks.
- **G1–G16 (Gateway Core):** Verified token-bucket exactness, priority ordering, circuit breaker transitions, TPM sliding windows, and 50-request concurrent load handling.
- **S1–S9 (Safety Escapes):** Certified against SSH key leakage, credential exposure, egress filtering, and filesystem immutability.

---

## 9. Execution Guide & Operating Instructions

### 9.1 Prerequisites
- **Node.js:** Version 18.0.0 or higher with `npm`.
- **PowerShell:** Version 7.0+ (Windows) or **Bash** (Linux/WSL).
- **Python:** Version 3.11+ (for Bridge Gateway and RealGravity tools).
- **API Keys (At least one):**
  - Groq (`GROQ_API_KEY`)
  - NVIDIA NIM (`NVIDIA_API_KEY`)
  - OpenRouter (`OPENROUTER_API_KEY`)

### 9.2 Launching the Complete System
To launch both the Bridge Server (`:8000`) and the 3D Virtual Floor (`:5173`) simultaneously:

```powershell
# From the repository root:
.\scripts\start-all.ps1
```

### 9.3 Launching Components Individually

#### 1. Start the Bridge Server
```powershell
# Option A: Via PowerShell script
.\scripts\start-mock-bridge.ps1

# Option B: Directly from frontend directory
cd frontend
npm run bridge:mock
```

#### 2. Start the 3D Virtual Floor Frontend
```powershell
# Option A: Via PowerShell script
.\scripts\start-frontend.ps1

# Option B: Directly from frontend directory
cd frontend
npm run dev
```

#### 3. Run RealGravity Directly in Terminal
```powershell
# Recommended assist mode on a project:
.\scripts\run-realgravity.ps1 D:\myproject assist

# Strict review-all mode:
.\scripts\run-realgravity.ps1 D:\myproject strict

# List all configured models:
.\scripts\run-realgravity.ps1 --list-models
```

---

## 10. Summary Matrix of All Implemented Files

| Subsystem | File Path | Primary Function & Implementation Details |
| :--- | :--- | :--- |
| **Root** | `README.md` | Executive project specification, problem statement, architecture diagrams, and quick-start instructions. |
| **Root** | `package.json` | Top-level project manifest. |
| **Scripts** | `scripts/start-all.ps1` | Automated launch script spawning background Bridge job and foreground Vite frontend. |
| **Scripts** | `scripts/start-mock-bridge.ps1` | Dedicated launcher for the contract-compliant server. |
| **Scripts** | `scripts/start-frontend.ps1` | Dedicated launcher for the 3D office web application. |
| **Scripts** | `scripts/run-realgravity.ps1` | Wrapper dispatching RealGravity sessions on local projects. |
| **Scripts** | `scripts/check-environment.ps1` | Pre-flight validator checking Node.js, Python, binaries, and configurations. |
| **Bridge** | `bridge/deskmates_bridge/gateway/lane.py` | Token-bucket rate limiter, sliding TPM window, priority queue with aging, and AIMD backoff. |
| **Bridge** | `bridge/deskmates_bridge/gateway/router.py` | Model router, alias resolution, upstream request execution, and retry fallback ladder. |
| **Bridge** | `bridge/deskmates_bridge/gateway/breaker.py` | Circuit breaker tracking failure counts, half-open probes, and cool-downs. |
| **Bridge** | `bridge/deskmates_bridge/gateway/estimator.py` | Token estimator with character ratios and EMA usage learning. |
| **Bridge** | `bridge/deskmates_bridge/gateway/clock.py` | Protocol clock providing `RealClock` and `FakeClock` for testing. |
| **Bridge** | `bridge/tests/gateway/test_gateway.py` | 16 comprehensive unit and load tests covering gateway resilience and concurrency. |
| **Frontend** | `frontend/tools/mock-bridge/server.ts` | Contract v3 server with REST routes, WebSocket event streaming, resume, and live Groq LLM reasoning. |
| **Frontend** | `frontend/src/three/OfficeCanvas.tsx` | Main Three.js canvas, orbit camera rig, lighting, and whiteboard synchronization. |
| **Frontend** | `frontend/src/three/StaticOffice.tsx` | Instanced office geometry, tenant carpets, glass walls, and dynamic server LEDs. |
| **Frontend** | `frontend/src/three/AgentRig.ts` | Procedural humanoid character rig with walking kinematics, typing, thinking, and hierarchy clothing. |
| **Frontend** | `frontend/src/three/AgentsLayer.tsx` | Three.js layer managing character rig instances, animations, and updates. |
| **Frontend** | `frontend/src/three/Chairs.tsx` | Instanced chairs with smooth sliding animations during sit/stand transitions. |
| **Frontend** | `frontend/src/three/Doors.tsx` | Sliding glass doors opening upon agent proximity. |
| **Frontend** | `frontend/src/three/FxLayer.tsx` | 3D visual effects: flying message envelopes, corridor couriers, and validation stamps. |
| **Frontend** | `frontend/src/three/LabelsLayer.tsx` | Billboard overhead agent name badges and speech bubbles. |
| **Frontend** | `frontend/src/three/cameraCtl.ts` | Cinematic camera controller supporting auto-director jumps, smooth fly-to, and agent follow. |
| **Frontend** | `frontend/src/three/materials.ts` | Shared Three.js materials, dynamic color blending, and Blueprint mode switching. |
| **Frontend** | `frontend/src/three/textures.ts` | Procedural floor carpets, blueprints, and dynamic HTML canvas whiteboard textures. |
| **Frontend** | `frontend/src/sim/director.ts` | Simulation director coordinating action queues, pathfinding, and kinematics. |
| **Frontend** | `frontend/src/sim/directorActs.ts` | Action execution routines for coffee breaks, cafeteria meals, chats, and meetings. |
| **Frontend** | `frontend/src/sim/managerAgent.ts` | Conversational Diya Manager memory agent with live Groq LLM integration and dynamic DAG expansion. |
| **Frontend** | `frontend/src/sim/sound.ts` | Web Audio API procedural sound synthesizer (pings, ticks, celebrations). |
| **Frontend** | `frontend/src/nav/grid.ts` | 0.25-meter collision grid matrix and free-coordinate search. |
| **Frontend** | `frontend/src/nav/astar.ts` | A* pathfinding algorithm with Manhattan heuristics and corner-clipping protection. |
| **Frontend** | `frontend/src/nav/validate.ts` | Startup layout validator ensuring aisle clearances and reachable seats. |
| **Frontend** | `frontend/src/config/layout.ts` | Spatial coordinate definitions for all office zones, furniture, walls, doors, and slots. |
| **Frontend** | `frontend/src/config/office.ts` | Office dimensions, speeds, acceleration, department definitions, and color maps. |
| **Frontend** | `frontend/src/config/furnitureDefs.ts` | Furniture geometry blueprints, collision boxes, and seat anchors. |
| **Frontend** | `frontend/src/state/store.ts` | Reactive Zustand global store maintaining agents, tasks, logs, metrics, and UI state. |
| **Frontend** | `frontend/src/state/events.ts` | Event reducer processing and applying all 36 Contract v3 event types. |
| **Frontend** | `frontend/src/state/engine.ts` | Simulation run engine providing `MockEngine` and `LiveEngine` implementations. |
| **Frontend** | `frontend/src/state/departments.ts` | Dynamic department registration and bay tinting system. |
| **Frontend** | `frontend/src/mock/triage.ts` | Regex word-boundary triage classifier and complexity calculator. |
| **Frontend** | `frontend/src/services/projectBundle.ts` | Source code bundling utility supporting in-browser ZIP generation and local disk exports. |
| **Frontend** | `frontend/src/ui/Landing.tsx` | Launch portal with task formulation, profile picker, model selector, and live triage preview. |
| **Frontend** | `frontend/src/ui/Workspace.tsx` | Main 3D workspace container, keyboard shortcut handler, and dev overlay. |
| **Frontend** | `frontend/src/ui/Toolbar.tsx` | Top control header for sim speed, camera reset, view toggles, and clock display. |
| **Frontend** | `frontend/src/ui/LeftPanel.tsx` | Sidebar housing Team Org chart, Task DAG view, and shared Blackboard. |
| **Frontend** | `frontend/src/ui/DagView.tsx` | Interactive SVG Task DAG with Dagre layout, Bézier curves, and animated particle flows. |
| **Frontend** | `frontend/src/ui/Inspector.tsx` | Deep-dive agent inspector with energy meters, live file diffs, line ranges, and terminal streams. |
| **Frontend** | `frontend/src/ui/PermissionPanel.tsx` | Interactive Human-in-the-Loop permission approval console. |
| **Frontend** | `frontend/src/ui/ComputeDrawer.tsx` | Telemetry drawer displaying token usage, concurrency gauges, and cost comparisons. |
| **Frontend** | `frontend/src/ui/ReportView.tsx` | Deliverables and executive report viewer with PDF export and code viewer tabs. |
| **Frontend** | `frontend/src/ui/EventLog.tsx` | Filterable event stream and Diya Manager directive input console. |
| **Frontend** | `frontend/src/ui/TriageBanner.tsx` | Top banner summarizing task complexity, intensity, and active departments. |
| **Frontend** | `frontend/src/ui/Minimap.tsx` | 2D overview minimap showing real-time agent positions. |
| **Backend** | `backend/bin/pag.ps1` | Native and Docker launcher for RealGravity with Git branching and diff summaries. |
| **Backend** | `backend/plugins/context/lib.ts` | 5-tier context discipline algorithms (truncation, staged masking, EMA token estimation). |
| **Backend** | `backend/plugins/audit/index.ts` | Live Git diff tracker logging file modifications with exact line ranges to `audit.jsonl`. |
| **Backend** | `backend/plugins/deskmates/index.ts` | OpenCode plugin relaying permissions, compactions, and tool execution to the Bridge. |
| **Backend** | `backend/profiles/base.json` | Base agent configuration, open-source model definitions, and non-bypassable hard denials. |
| **Output** | `output/CRYPTracker/` | Production React/TypeScript crypto tracker application generated autonomously by the swarm. |
