<div align="center">

<h1>2DAI - AI-Powered Design Editor</h1>

<p>
  <strong>Describe it. Generate it. Edit it to perfection.</strong><br/>
  An open-source AI design editor built for creators, marketers, and developers.
</p>

<p>
  <a href="https://github.com/tineshnehte/2dai/releases"><img src="https://img.shields.io/github/v/release/tineshnehte/2dai?color=6C4DFF&label=version&style=flat-square" alt="Version" /></a>
  <a href="https://github.com/tineshnehte/2dai/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square" alt="License" /></a>
  <a href="https://github.com/tineshnehte/2dai/stargazers"><img src="https://img.shields.io/github/stars/tineshnehte/2dai?color=FFB703&style=flat-square" alt="Stars" /></a>
  <a href="https://github.com/tineshnehte/2dai/issues"><img src="https://img.shields.io/github/issues/tineshnehte/2dai?style=flat-square" alt="Issues" /></a>
  <a href="https://github.com/tineshnehte/2dai/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
  <img src="https://img.shields.io/badge/status-in%20development-orange?style=flat-square" alt="Status" />
</p>

<p>
  <a href="#overview">Overview</a> ·
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#contributing">Contributing</a>
</p>

</div>

---

## Overview

**2DAI** is an open-source AI design editor that turns natural language into production-ready visual designs. Social media posts, banners, presentations, posters and more, with the editing depth you'd expect from a real design tool.

Unlike AI image generators that produce flat images you can't touch, 2DAI generates **fully structured, editable canvases** where every element (text, shape, image, color, position) can be precisely controlled after generation. The AI also understands follow-up commands like *"make the headline bolder"*, *"shift to a dark palette"*, or *"add a logo in the top right"*.

> **Why open source?** Design tooling shouldn't be locked behind expensive SaaS walls. 2DAI is built in public under Apache 2.0 so anyone can run it, extend it, and contribute back.

---

## Features

### AI Generation
- **Full canvas generation** from a single prompt - layout, typography, colors, shapes, all at once
- **Streaming render** - design elements appear as the AI generates them, not all at once at the end
- **Targeted AI edits** - patch specific elements by ID without regenerating the whole design
- **Style commands** - "change to a pastel palette", "use Space Grotesk throughout"
- **AI image assets** - generate and embed images directly into the canvas

### Deep Editing
- **Properties panel** - pixel-precise control over position, size, rotation, opacity, color, shadow, gradient
- **Layer panel** - full Z-order control with drag-and-drop reordering
- **Rich text editing** - inline font family, weight, size, color, letter spacing, line height
- **Group / ungroup** - compose complex elements into reusable groups
- **Undo / Redo** - deep command history

### Export
- **PNG** - high resolution raster export
- **PDF** - print-ready vector PDF
- **PowerPoint (PPTX)** - editable slides straight from the canvas

### Productivity
- **Templates** - curated starting points for social posts, banners, posters, presentations
- **Brand Kit** - save brand colors, fonts, and logos for consistent generation
- **Google Fonts** - full Google Fonts integration baked in

---

## Architecture

```
+--------------------------------------------------+
|               Next.js Frontend                   |
|   Canvas (Fabric.js) | Properties | AI Chat      |
+---------------------------+----------------------+
                            | SSE Stream
+---------------------------v----------------------+
|         FastAPI + LangGraph Backend              |
|                                                  |
|   Supervisor Agent  <-- routes intent            |
|         |                                        |
|   Design Architect  ->  full layout gen          |
|         |                                        |
|   Element Builder   ->  per-object generation    |
|         |                                        |
|   Quality Checker   <-> retry loop               |
|         |                                        |
|   SSE Emitter       ->  streams JSON patches     |
|                                                  |
|   Edit Agent | Style Agent | Image Gen Agent     |
+--------------------------------------------------+
```

The frontend consumes a Server-Sent Events stream. As LangGraph emits canvas patch events, the canvas renders each element incrementally so users see the design build up in real time.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router) | RSC, streaming, file-based routing |
| Canvas | Fabric.js v6 | Best object model, inline text editing, SVG export |
| State | Zustand | Lightweight, devtools, canvas-friendly |
| UI | Shadcn/ui + Radix + Tailwind | Accessible primitives with full control |
| Backend | Python 3.12 + FastAPI | LangGraph is Python-native, best LLM ecosystem |
| AI Agents | LangGraph + LangChain | Stateful multi-agent, observable, human-in-the-loop |
| LLM | Google Gemini 2.0 Flash | Fast, multimodal, structured output |
| Image Gen | Stability AI / DALL-E 3 | Embedded asset generation |
| Streaming | Server-Sent Events | Lightweight, browser-native, no WebSocket overhead |
| Database | Supabase (Postgres) | Open source, storage and Auth included |
| Monorepo | Turborepo | Shared canvas schema across FE and BE |
| Auth | Clerk | Fast integration, SSO, RBAC |
| Observability | LangSmith + Sentry + OpenTelemetry | Agent traces, errors, metrics |
| Testing | Vitest + Playwright + Pytest | Unit, E2E, agent integration tests |
| CI/CD | GitHub Actions | Lint, test, build, deploy |

---

## Project Structure

```
2dai-studio/
├── apps/
│   ├── web/                        # Next.js 15 frontend
│   │   ├── app/
│   │   │   ├── (editor)/           # main editor route
│   │   │   ├── (dashboard)/        # project dashboard
│   │   │   └── api/generate/       # SSE proxy route
│   │   ├── components/
│   │   │   └── editor/
│   │   │       ├── DesignCanvas.tsx
│   │   │       ├── Toolbar.tsx
│   │   │       ├── PropertiesPanel.tsx
│   │   │       ├── LayersPanel.tsx
│   │   │       └── AIChat.tsx
│   │   └── stores/
│   │       ├── canvasStore.ts
│   │       └── uiStore.ts
│   │
│   └── api/                        # Python FastAPI backend
│       ├── agents/
│       │   ├── supervisor.py
│       │   ├── design_architect.py
│       │   ├── element_builder.py
│       │   ├── style_agent.py
│       │   ├── edit_agent.py
│       │   ├── image_gen_agent.py
│       │   └── quality_checker.py
│       ├── graphs/
│       │   └── design_graph.py
│       ├── schemas/
│       │   └── canvas_schema.py
│       └── main.py
│
├── packages/
│   └── canvas-schema/              # Shared TS + Python canvas types
│
├── docs/
├── .github/
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
├── docker-compose.yml
├── turbo.json
├── CONTRIBUTING.md
└── LICENSE
```

---

## Getting Started

> Active development - Getting Started will be finalized at first release.

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker + Docker Compose

### Clone and Install

```bash
git clone https://github.com/tineshnehte/2dai.git
cd 2dai

# Install all workspace dependencies
npm install

# Set up Python environment
cd apps/api
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

```bash
cp .env.example .env
```

```env
# LLM
GEMINI_API_KEY=
OPENAI_API_KEY=

# Image Generation
STABILITY_API_KEY=

# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Auth
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Observability
LANGSMITH_API_KEY=
SENTRY_DSN=
```

### Run with Docker

```bash
docker compose up
```

| Service | URL |
|---|---|
| Web App | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## Roadmap

<details open>
<summary><strong>Phase 1 - Foundation (MVP)</strong></summary>

- [ ] AI full-canvas generation from prompt
- [ ] Real-time SSE streaming render
- [ ] Properties panel (position, size, color, opacity, rotation)
- [ ] Layer panel with Z-order drag-and-drop
- [ ] Undo / Redo command history
- [ ] Export: PNG, PDF, PowerPoint (PPTX)
- [ ] Canvas templates (social post, poster, banner, presentation)

</details>

<details>
<summary><strong>Phase 2 - Deep Editing</strong></summary>

- [ ] AI chat for targeted edits via delta patches
- [ ] Brand Kit (colors, fonts, logo storage)
- [ ] Image upload + AI background removal
- [ ] Google Fonts picker
- [ ] Gradient, shadow, and border editors
- [ ] Component / symbol library

</details>

<details>
<summary><strong>Phase 3 - Collaboration</strong></summary>

- [ ] Real-time multiplayer cursors
- [ ] Design version history
- [ ] Team workspaces and role-based access control
- [ ] Plugin / extension system
- [ ] Public API for programmatic design generation
- [ ] Design token export (CSS variables)

</details>

---

## Contributing

Contributions are welcome - bug reports, new features, docs improvements, all of it.

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m 'feat: add brand kit support'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Read [CONTRIBUTING.md](CONTRIBUTING.md) for code standards and the review process. Good first issues are tagged [`good first issue`](https://github.com/tineshnehte/2dai/issues?q=label%3A%22good+first+issue%22) on GitHub.

---

## Community

- Bugs and features -> [GitHub Issues](https://github.com/tineshnehte/2dai/issues)
- Ideas and discussion -> [GitHub Discussions](https://github.com/tineshnehte/2dai/discussions)
- Updates -> [@tineshnehete](https://twitter.com/tineshnehete)

---

## License

Copyright (c) 2026 [tineshnehte](https://github.com/tineshnehte)

Licensed under the [Apache License 2.0](LICENSE). Use it, modify it, distribute it - including commercially. Just keep the attribution.

---

<div align="center">
  <br/>
  If 2DAI helps you, a star on GitHub goes a long way.
  <br/><br/>
  Built by <a href="https://github.com/tineshnehte">@tineshnehte</a> and contributors
</div>
