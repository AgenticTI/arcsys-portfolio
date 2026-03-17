# CLAUDE.md — Portifolio ARCSYS

This is the root guide for the portfolio monorepo. Read this before working on any project.

---

## Overview

A monorepo containing 5 independent frontend portfolio projects. Each is a fully functional demo app — no shared backend, no shared packages, no monorepo tooling. Each project is self-contained with its own `package.json`, `node_modules`, and `CLAUDE.md`.

The repo is hosted at: `https://github.com/AgenticTI/Portifolio.git`

---

## Projects

| Folder | App Name | Stack | Port | Description |
|---|---|---|---|---|
| `saas-tarefas/` | Hazel | Next.js 14, Zustand, @dnd-kit | 3000 | Kanban/list task manager SaaS |
| `saude-agendamento/` | MedAgenda | Next.js 14, Zustand, shadcn/ui | 3000 | Medical appointment booking (patient + doctor roles) |
| `ecommerce-micro/` | MicroShop | Vite 5, React 19, TanStack Router | 5173 | E-commerce with admin panel |
| `fitness-treinos/` | FitTrack | Next.js 16, Zustand, Tailwind v4 | 3000 | Fitness tracker with workout timer and heatmap |
| `restaurante-pedidos/` | Restaurante Noir | Next.js 14, Framer Motion | 3000 | Restaurant ordering app (client + kitchen views) |

Each project has its own `CLAUDE.md` with full architecture docs.

---

## Running a Project

Each project is independent — `cd` into the folder and run:

```bash
cd <project-folder>
npm install     # only needed first time
npm run dev
```

**Note:** Only run one Next.js project at a time on port 3000 to avoid conflicts. `ecommerce-micro` uses port 5173 (Vite) so it can run alongside any Next.js project.

---

## Repo Structure

```
Portifolio ARCSYS/
├── saas-tarefas/          # Hazel — task manager
├── saude-agendamento/     # MedAgenda — medical scheduling
├── ecommerce-micro/       # MicroShop — e-commerce (Vite)
├── fitness-treinos/       # FitTrack — fitness tracker
├── restaurante-pedidos/   # Restaurante Noir — ordering system
├── docs/
│   └── superpowers/
│       └── plans/         # Original implementation plans (dense, for reference)
├── Ideias_Portifolio.md   # Original project ideation notes
└── CLAUDE.md              # This file
```

---

## Rules

- Each project is a **standalone app** — never import across project folders.
- `node_modules/` is gitignored in each project — run `npm install` before starting.
- The repo has no root `package.json` — there is no workspace tooling.
- When working on a specific project, read that project's `CLAUDE.md` first.
