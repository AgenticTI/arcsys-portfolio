# saude-agendamento — Sistema de Agendamento Médico

**Data:** 2026-03-17
**Autor:** Leon
**Status:** Aprovada
**Spec pai:** [2026-03-17-portfolio-parent-spec.md](2026-03-17-portfolio-parent-spec.md)

---

## 1. Identidade do Nicho

**Contexto:** Sistema usado por pacientes que precisam agendar consultas médicas e por médicos que gerenciam sua agenda. Demonstra lógica de domínio real: estados de consulta (pendente, confirmado, cancelado), dois papéis de usuário distintos e fluxo completo de agendamento — sem ser apenas uma landing page.

**Referências visuais coletadas:**
- Dribbble: [Doctor Booking App UI Design — MD Saiful Islam](https://dribbble.com/shots/25674088-Doctor-Booking-App-UI-Design)
- Dribbble: [UI/UX for Doctor Appointment App — Cadabra Studio (pt.1)](https://dribbble.com/shots/17257991-UI-UX-for-Doctor-Appointment-App-1)
- Dribbble: [UI/UX for Doctor Appointment App — Cadabra Studio (pt.2)](https://dribbble.com/shots/17309708-UI-UX-for-Doctor-Appointment-App-2)
- Dribbble: [AI Doctor Appointment Booking App — Sajibur Rahman](https://dribbble.com/shots/25841036-AI-Doctor-Appointment-Booking-App)
- Behance: [Doctor Appointment Booking App UI/UX Case Study](https://www.behance.net/gallery/215343385/Doctor-Appointment-Booking-App-UIUX-Case-Study)
- Behance: [Doctor Appointment App | Doctor & Hospital Finder App](https://www.behance.net/gallery/177790681/Doctor-Appointment-App-Doctor-Hospital-Finder-App)

**Paleta de cores:**
| Token | Valor | Uso |
|---|---|---|
| Primary | `#3DAA6D` | Ações principais, ícones, bordas ativas |
| Primary Light | `#EBF7F0` | Backgrounds de cards, badges confirmado |
| Accent | `#5B8CDB` | Ações secundárias, links, horários disponíveis |
| Neutral 900 | `#1A1D23` | Títulos e texto principal |
| Neutral 500 | `#6B7280` | Labels, subtítulos, placeholders |
| Neutral 100 | `#F4F6F8` | Background geral das páginas |
| White | `#FFFFFF` | Cards, modais, inputs |
| Status Confirmado | `#3DAA6D` | Badge verde |
| Status Pendente | `#F59E0B` | Badge âmbar |
| Status Cancelado | `#EF4444` | Badge vermelho suave |

**Justificativa:** Verde esmeralda suave transmite saúde e natureza sem o frio clínico do azul hospitalar puro. O índigo complementa para ações secundárias. A combinação remete ao segmento de health startups modernas — humana e acolhedora, não institucional.

**Tipografia:**
- Família: **Inter** (Google Fonts — gratuita, legível, muito próxima da SF Pro da Apple)
- Títulos: Inter 700, 24–32px
- Body: Inter 400, 14–16px
- Labels/badges: Inter 500, 12px, uppercase, letter-spacing: 0.05em

**Estilo geral:** limpo, acolhedor, espaçoso. Border-radius de 12–16px nos cards. Sombras sutis (`box-shadow: 0 2px 12px rgba(0,0,0,0.06)`). Sem gradientes pesados. Ícones Lucide (rounded, traço fino). A complexidade está nos estados e na lógica — a interface parece simples.

---

## 2. Stack

| Camada | Escolha | Justificativa |
|---|---|---|
| Framework | Next.js 14 (App Router) | Demonstra conhecimento do framework mais relevante; SSR disponível mas não obrigatório aqui |
| Estilização | Tailwind CSS | Velocidade + resultado visual consistente com utilitários |
| Componentes | shadcn/ui | Acessível, customizável, estética clean que casa com Inter |
| Estado global | Zustand | Leve, sem boilerplate — mantém estado mutável das consultas |
| Ícones | Lucide React | Rounded, coerente com o estilo acolhedor |
| Dados | JSON estático em `/src/data/` | Sem banco, sem API — tudo local conforme spec pai |

---

## 3. Telas e Fluxo de Navegação

### Mapa de telas (8 no total)

```
1. Login (seleção de papel)
   ├── → 2. Dashboard do Paciente
   │         ├── → 3. Buscar Médico
   │         │         └── → 4. Perfil do Médico
   │         │                   └── → 5. Selecionar Horário
   │         │                               └── → 6. Confirmação
   │         └── → 7. Histórico de Consultas
   └── → 8. Agenda do Médico (dia + semana)
```

### Descrição de cada tela

**1. Login**
- Dois botões grandes centralizados: "Entrar como Paciente" e "Entrar como Médico"
- Logo + tagline do sistema
- Sem campos de email/senha reais — clique direto faz login com usuário mockado

**2. Dashboard do Paciente** *(tela hero)*
- Header com avatar e saudação ("Olá, Rafael")
- Card de destaque: próxima consulta (médico, especialidade, data/hora, status)
- Lista de consultas agendadas com badges de status
- Botão flutuante "+ Agendar nova consulta"
- Sidebar: Dashboard | Buscar médico | Histórico | Sair

**3. Buscar Médico**
- Campo de busca por nome
- Filtro por especialidade (tabs ou dropdown): Clínico Geral, Cardiologia, Dermatologia, Ortopedia, Pediatria
- Grid de cards de médicos: foto, nome, especialidade, avaliação (estrelas), CRM
- Estado vazio se nenhum resultado

**4. Perfil do Médico**
- Foto grande, nome, especialidade, avaliação, bio curta
- Botão "Agendar consulta" → vai para seleção de horário

**5. Selecionar Horário**
- Mini calendário (semana atual)
- Grade de horários disponíveis (08h–18h, intervalos de 30min)
- Slots `available` em verde claro, `booked` desabilitados em cinza
- Botão "Confirmar agendamento"

**6. Confirmação**
- Resumo: médico, data, horário
- Status inicial: "Pendente de confirmação pelo médico"
- Botão "Voltar ao Dashboard"

**7. Histórico de Consultas**
- Lista de consultas passadas com data, médico e status
- Estado de status imutável (só leitura)

**8. Agenda do Médico** *(tela hero do médico)*
- Header: data de hoje + total de consultas do dia
- Lista de consultas: horário, nome do paciente, especialidade, badge de status
- Ações por consulta: botões "Confirmar" e "Cancelar" (atualizam Zustand store imediatamente)
- Tab "Semana" mostra os próximos 5 dias com contagem de consultas por dia

---

## 4. Dados Mockados

### `src/data/doctors.json` — 6 médicos
```json
{
  "id": "d1",
  "name": "Dra. Ana Costa",
  "specialty": "Cardiologia",
  "photo": "https://i.pravatar.cc/150?img=47",
  "rating": 4.9,
  "crm": "CRM/SP 123456",
  "bio": "Cardiologista com 12 anos de experiência. Especialista em prevenção cardiovascular.",
  "availableSlots": ["09:00", "10:00", "14:00", "15:30"]
}
```
> **Nota de implementação:** `availableSlots` representa horários recorrentes — os mesmos slots estão disponíveis de segunda a sexta para fins de demo. O componente de seleção de horário deve tratar esses slots como disponíveis em qualquer dia da semana exibido no mini calendário, exceto quando o slot já estiver ocupado por uma appointment existente no Zustand store.

Especialidades presentes: Clínico Geral, Cardiologia, Dermatologia, Ortopedia, Pediatria, Neurologia.

### `src/data/appointments.json` — 8 consultas
```json
{
  "id": "a1",
  "patientId": "p1",
  "doctorId": "d1",
  "date": "2026-03-20",
  "time": "09:00",
  "status": "confirmed",
  "reason": "Consulta de rotina"
}
```
Status distribuídos: 3 `confirmed`, 3 `pending`, 2 `cancelled`.
Datas: 2 futuras próximas (próxima semana), 2 hoje, 4 passadas (para histórico).

### `src/data/patient.json` — 1 paciente logado
```json
{
  "id": "p1",
  "name": "Rafael Mendes",
  "photo": "https://i.pravatar.cc/150?img=12",
  "email": "rafael@email.com"
}
```

### `src/data/doctor-user.json` — 1 médico logado (para a visão do médico)
```json
{
  "id": "d3",
  "name": "Dr. Carlos Lima",
  "specialty": "Clínico Geral",
  "photo": "https://i.pravatar.cc/150?img=33"
}
```

### Zustand store — `src/store/appointments.ts`
- Estado inicial carregado de `appointments.json`
- Ações: `confirmAppointment(id)`, `cancelAppointment(id)`
- Ambas atualizam o `status` da consulta no array em memória
- Sem persistência (reseta ao recarregar — intencional para demo)

---

## 5. Scope do MVP

### ✅ Dentro
- Tela de login com seleção de papel (2 botões, sem auth real)
- Dashboard do paciente com próxima consulta destacada e lista de agendamentos
- Busca e filtro de médicos por especialidade
- Perfil do médico
- Fluxo completo de agendamento (seleção de horário → confirmação)
- Histórico de consultas do paciente
- Agenda do dia do médico com ações de confirmar/cancelar
- Visualização semanal na agenda do médico
- Estado mutável via Zustand (mudança de status em tempo real na UI)

### ❌ Fora
- Autenticação real (NextAuth, Clerk, Supabase Auth)
- Banco de dados real (Prisma, PostgreSQL, SQLite)
- Notificações (email, SMS, push)
- Pagamento ou teleconsulta
- Múltiplos médicos por clínica / admin panel
- Deploy em produção
- Integração com qualquer API externa
- Mobile responsivo (foco em 1280px desktop)

---

## 6. Critério de "Pronto"

### Checklist visual
- [ ] Todas as 8 telas renderizando sem layout quebrado em 1280px
- [ ] Badges de status com cores corretas (verde/âmbar/vermelho)
- [ ] Cards com sombra sutil e border-radius consistente (12–16px)
- [ ] Tipografia Inter carregando corretamente
- [ ] Sidebar do paciente e header do médico presentes e funcionais
- [ ] Slots de horário visualmente distintos: disponível (verde claro) vs ocupado (cinza, desabilitado)

### Checklist funcional
- [ ] Clicar "Entrar como Paciente" leva ao Dashboard do Paciente
- [ ] Clicar "Entrar como Médico" leva à Agenda do Médico
- [ ] Filtro de especialidade filtra os cards de médicos corretamente
- [ ] Fluxo completo: Buscar médico → Perfil → Selecionar horário → Confirmação funciona
- [ ] Médico clica "Confirmar" → badge muda para verde imediatamente (Zustand)
- [ ] Médico clica "Cancelar" → badge muda para vermelho imediatamente (Zustand)
- [ ] Próxima consulta no dashboard reflete corretamente os dados mockados

### Pronto para gravar?
> "Consigo gravar 2 minutos mostrando: login como paciente → dashboard → agendar consulta → confirmação. Depois login como médico → agenda → confirmar uma consulta. Sem travar, sem layout quebrado."

---

## 7. Estrutura de Pastas

```
saude-agendamento/
├── README.md
├── docs/
│   ├── arquitetura.md
│   ├── telas-e-fluxos.md
│   └── data-model.md
├── src/
│   ├── app/
│   │   ├── page.tsx                  ← Login
│   │   ├── paciente/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── buscar/page.tsx
│   │   │   ├── medico/[id]/page.tsx
│   │   │   ├── agendar/[id]/page.tsx
│   │   │   ├── confirmacao/page.tsx
│   │   │   └── historico/page.tsx
│   │   └── medico/
│   │       └── agenda/page.tsx
│   ├── components/
│   │   ├── ui/                       ← shadcn/ui
│   │   ├── AppointmentCard.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── TimeSlotGrid.tsx
│   │   └── Sidebar.tsx
│   ├── data/
│   │   ├── doctors.json
│   │   ├── appointments.json
│   │   ├── patient.json
│   │   └── doctor-user.json
│   └── store/
│       └── appointments.ts           ← Zustand store
└── public/
```
