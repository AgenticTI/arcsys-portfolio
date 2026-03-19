export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in_progress" | "done";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  subtasks: Subtask[];
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  taskCount: number;
};

export type User = {
  name: string;
  email: string;
  avatarInitials: string;
};

export type WikiPage = {
  id: string;
  projectId: string;
  title: string;
  content: string;
  updatedAt: string; // ISO date string
};

export const mockUser: User = {
  name: "Leon",
  email: "leon@hazel.app",
  avatarInitials: "L",
};

export const mockProjects: Project[] = [
  { id: "p1", name: "Website Redesign", color: "#7C3AED", taskCount: 5 },
  { id: "p2", name: "Mobile App", color: "#10B981", taskCount: 4 },
  { id: "p3", name: "Marketing Q2", color: "#F59E0B", taskCount: 3 },
];

// Datas relativas ao momento do demo (use datas fixas próximas de 2026-03-17)
export const mockTasks: Task[] = [
  // --- Website Redesign (p1) ---
  {
    id: "t1",
    projectId: "p1",
    title: "Redesign landing page hero section",
    description: "Create a modern hero section with clear value proposition, CTA button, and product screenshot.",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-03-17",
    subtasks: [
      { id: "st1", title: "Write headline copy", completed: true },
      { id: "st2", title: "Design hero layout", completed: true },
      { id: "st3", title: "Add CTA button", completed: false },
      { id: "st4", title: "Add product screenshot", completed: false },
    ],
    createdAt: "2026-03-10",
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Update color palette to new brand guide",
    description: "Apply updated brand colors across all components. Focus on primary and accent colors.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-03-19",
    subtasks: [
      { id: "st5", title: "Update CSS variables", completed: false },
      { id: "st6", title: "Apply to buttons", completed: false },
      { id: "st7", title: "Apply to navigation", completed: false },
    ],
    createdAt: "2026-03-11",
  },
  {
    id: "t3",
    projectId: "p1",
    title: "Improve page load performance",
    description: "Optimize images and reduce JavaScript bundle size to achieve sub-2s load time.",
    priority: "high",
    status: "todo",
    dueDate: "2026-03-21",
    subtasks: [
      { id: "st8", title: "Compress all images", completed: false },
      { id: "st9", title: "Lazy load below-fold images", completed: false },
    ],
    createdAt: "2026-03-12",
  },
  {
    id: "t4",
    projectId: "p1",
    title: "Write about us page content",
    description: "Draft copy for the about page including team bios and company story.",
    priority: "low",
    status: "done",
    dueDate: "2026-03-15",
    subtasks: [
      { id: "st10", title: "Draft company story", completed: true },
      { id: "st11", title: "Write team bios", completed: true },
    ],
    createdAt: "2026-03-08",
  },
  {
    id: "t5",
    projectId: "p1",
    title: "Set up analytics tracking",
    description: "Integrate analytics for key user actions: CTA clicks, form submissions, page views.",
    priority: "medium",
    status: "in_progress",
    dueDate: "2026-03-18",
    subtasks: [
      { id: "st12", title: "Install analytics SDK", completed: true },
      { id: "st13", title: "Track CTA clicks", completed: false },
      { id: "st14", title: "Track form submissions", completed: false },
    ],
    createdAt: "2026-03-13",
  },
  // --- Mobile App (p2) ---
  {
    id: "t6",
    projectId: "p2",
    title: "Design onboarding flow screens",
    description: "Create 4-screen onboarding with permission requests and account setup.",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-03-18",
    subtasks: [
      { id: "st15", title: "Welcome screen", completed: true },
      { id: "st16", title: "Permissions screen", completed: false },
      { id: "st17", title: "Profile setup screen", completed: false },
    ],
    createdAt: "2026-03-11",
  },
  {
    id: "t7",
    projectId: "p2",
    title: "Implement push notifications",
    description: "Set up push notification service and implement opt-in flow for iOS and Android.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-03-24",
    subtasks: [
      { id: "st18", title: "Configure notification service", completed: false },
      { id: "st19", title: "Build opt-in UI", completed: false },
    ],
    createdAt: "2026-03-12",
  },
  {
    id: "t8",
    projectId: "p2",
    title: "Fix crash on login screen",
    description: "Users report app crashes when entering email with special characters. Reproduce and fix.",
    priority: "high",
    status: "done",
    dueDate: "2026-03-16",
    subtasks: [
      { id: "st20", title: "Reproduce the crash", completed: true },
      { id: "st21", title: "Fix input validation", completed: true },
      { id: "st22", title: "Write regression test", completed: true },
    ],
    createdAt: "2026-03-14",
  },
  {
    id: "t9",
    projectId: "p2",
    title: "Add dark mode support",
    description: "Implement system-aware dark mode using platform theme APIs.",
    priority: "low",
    status: "todo",
    dueDate: "2026-03-28",
    subtasks: [
      { id: "st23", title: "Define dark color tokens", completed: false },
      { id: "st24", title: "Apply to all screens", completed: false },
    ],
    createdAt: "2026-03-13",
  },
  // --- Marketing Q2 (p3) ---
  {
    id: "t10",
    projectId: "p3",
    title: "Plan Q2 content calendar",
    description: "Define blog topics, social media posts, and newsletter schedule for April through June.",
    priority: "medium",
    status: "in_progress",
    dueDate: "2026-03-20",
    subtasks: [
      { id: "st25", title: "Research trending topics", completed: true },
      { id: "st26", title: "Draft April schedule", completed: false },
      { id: "st27", title: "Draft May–June schedule", completed: false },
    ],
    createdAt: "2026-03-10",
  },
  {
    id: "t11",
    projectId: "p3",
    title: "Create social media assets",
    description: "Design reusable templates for Instagram, LinkedIn, and Twitter posts.",
    priority: "low",
    status: "todo",
    dueDate: "2026-03-22",
    subtasks: [
      { id: "st28", title: "Design Instagram template", completed: false },
      { id: "st29", title: "Design LinkedIn template", completed: false },
    ],
    createdAt: "2026-03-11",
  },
  {
    id: "t12",
    projectId: "p3",
    title: "Write Q1 performance report",
    description: "Summarize Q1 campaign results, key metrics, and learnings for the team.",
    priority: "medium",
    status: "done",
    dueDate: "2026-03-15",
    subtasks: [
      { id: "st30", title: "Gather metrics data", completed: true },
      { id: "st31", title: "Write report draft", completed: true },
      { id: "st32", title: "Get team review", completed: true },
    ],
    createdAt: "2026-03-09",
  },
];

export const mockPages: WikiPage[] = [
  {
    id: "wp1",
    projectId: "p1",
    title: "Overview",
    content: "Redesign completo do site corporativo.\n\nObjetivos: aumentar conversão em 30%.\nPrazo: Q2 2026.\nStakeholders: Leon (dev), Ana (design), Carlos (PM).",
    updatedAt: "2026-03-17T10:00:00Z",
  },
  {
    id: "wp2",
    projectId: "p1",
    title: "Brief",
    content: "O cliente solicitou um redesign focado em mobile-first.\n\nRequisitos principais:\n- Nova identidade visual\n- Performance acima de 90 no Lighthouse\n- Integração com CRM existente",
    updatedAt: "2026-03-14T14:30:00Z",
  },
  {
    id: "wp3",
    projectId: "p2",
    title: "Overview",
    content: "App mobile para iOS e Android.\n\nStack: React Native + Expo.\nTarget: usuários B2C, 18-35 anos.\nLançamento previsto: Julho 2026.",
    updatedAt: "2026-03-16T09:15:00Z",
  },
  {
    id: "wp4",
    projectId: "p2",
    title: "Sprint Notes",
    content: "Sprint 1 (Mar 11-18):\n✓ Setup do projeto e CI/CD\n✓ Tela de login e autenticação\n→ Push notifications (em progresso)\n\nSprint 2 (Mar 18-25):\n- Feed principal\n- Profile screen",
    updatedAt: "2026-03-18T16:00:00Z",
  },
  {
    id: "wp5",
    projectId: "p3",
    title: "Overview",
    content: "Campanha de marketing para o Q2 2026.\n\nCanais: Google Ads, Instagram, LinkedIn.\nOrçamento: R$ 45.000.\nKPIs: 500 leads qualificados, CAC < R$ 90.",
    updatedAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "wp6",
    projectId: "p3",
    title: "Copy Guidelines",
    content: "Tom de voz: profissional mas acessível.\n\nPalavras a usar: resultado, crescimento, solução.\nPalavras a evitar: barato, grátis, urgente.\n\nFormato dos CTAs: verbos no imperativo (\"Comece agora\", \"Saiba mais\").",
    updatedAt: "2026-03-13T08:45:00Z",
  },
];
