# Spec Pai — Portfólio ARCSYS

**Data:** 2026-03-17
**Autor:** Leon
**Status:** Aprovada

---

## 1. Visão e Filosofia

O portfólio é composto por 5 MVPs independentes. Cada um existe para demonstrar capacidade técnica e sensibilidade de produto num nicho específico.

**Princípio central (Apple):** Quanto mais simples o produto parecer, mais sofisticado ele precisa ser por dentro. A complexidade é escondida, nunca exposta. A interface não explica o que faz — ela simplesmente funciona de forma óbvia.

**O que define um MVP bem-sucedido:**
- A lógica de negócio do nicho está presente e funcional (com dados mockados)
- A interface é polida o suficiente para ser gravada como demo
- Qualquer pessoa leiga consegue entender o que o sistema faz em menos de 5 segundos olhando para a tela

**O que NÃO faz parte do escopo de nenhum MVP:**
- Autenticação real
- Banco de dados real
- Deploy em produção
- Integração com o site Agentic

**Uso final:** Cada MVP será gravado em vídeo ou capturado em prints para exibição na seção de portfólio do site pessoal.

---

## 2. Processo por Projeto

Cada um dos 5 projetos segue este fluxo obrigatório antes de uma linha de código ser escrita:

### Passo 1 — Pesquisa de referências visuais
Usar Playwright para acessar Dribbble, Behance ou Mobbin e buscar referências reais de designers para aquele nicho específico. Screenshots das melhores referências ficam documentadas na spec filha.

### Passo 2 — Definição de identidade visual
Com base nas referências, definir:
- Paleta de cores + justificativa (por que essas cores fazem sentido para o nicho)
- Tipografia
- Estilo geral (adjetivos que descrevem o visual)

A identidade visual deve ser coerente com o nicho — clínica médica não pode parecer iFood.

### Passo 3 — Definição de stack
Escolher a stack mais adequada para o que o projeto precisa mostrar, não a mais familiar. Cada projeto pode ter uma stack diferente.

### Passo 4 — Definição de scope
Listar exatamente quais telas existem, quais interações funcionam, quais dados são mockados e como. Nada além do que está na lista.

### Passo 5 — Documentação
Antes de qualquer código, criar:
- **README.md** — o que é o sistema, como rodar, decisões técnicas e por quê
- **docs/arquitetura.md** — estrutura de pastas, fluxo de dados, componentes principais
- **docs/telas-e-fluxos.md** — mapa de navegação, o que cada tela faz
- **docs/data-model.md** — estrutura dos dados mockados (mesmo sem banco real, os dados têm forma)

A documentação serve dois propósitos: guia o vibe coding durante a build, e permite continuar desenvolvendo qualquer MVP que valha a pena evoluir além do portfólio.

### Passo 6 — Construção
Com spec filha + documentação definida, abrir o Claude Code na pasta do projeto e executar. A spec é a fonte de verdade — não improvisar durante a build.

---

## 3. Estrutura de Repositórios

```
Portifolio ARCSYS/
├── docs/
│   └── superpowers/
│       └── specs/
│           ├── 2026-03-17-portfolio-parent-spec.md   ← este arquivo
│           ├── 2026-03-17-saude-agendamento.md
│           ├── 2026-03-17-restaurante-pedidos.md
│           ├── 2026-03-17-fitness-treinos.md
│           ├── 2026-03-17-ecommerce-micro.md
│           └── 2026-03-17-saas-tarefas.md
├── saude-agendamento/
├── restaurante-pedidos/
├── fitness-treinos/
├── ecommerce-micro/
└── saas-tarefas/
```

Cada pasta de projeto tem sua própria documentação interna:

```
[nome-do-projeto]/
├── README.md
├── docs/
│   ├── arquitetura.md
│   ├── telas-e-fluxos.md
│   └── data-model.md
└── src/   (ou estrutura da stack escolhida)
```

Quando for hora de subir, cada pasta vira um repositório Git independente.

---

## 4. Template da Spec Filha

Cada uma das 5 specs herda desta spec pai e usa a seguinte estrutura obrigatória:

```markdown
# [Nome do Projeto]

## 1. Identidade do Nicho
- Contexto: quem usa esse tipo de sistema e para quê
- Referências visuais: links/screenshots coletados no Dribbble/Behance
- Paleta de cores + justificativa
- Tipografia escolhida
- Estilo geral (adjetivos que descrevem o visual)

## 2. Stack
- Framework + justificativa
- Estilização
- Bibliotecas de componentes / animação (se aplicável)
- Gerenciamento de estado (se necessário)

## 3. Telas e Fluxo de Navegação
- Mapa de todas as telas
- Fluxo do usuário do início ao fim
- O que cada tela exibe e quais interações ela tem

## 4. Dados Mockados
- Estrutura dos dados (formato, campos, valores de exemplo)
- Onde cada mock é usado

## 5. Scope do MVP
- ✅ O que está dentro
- ❌ O que está fora (explicitamente)

## 6. Critério de "Pronto"
- Checklist visual: o que precisa estar polido
- Checklist funcional: o que precisa funcionar
- "Isso está pronto para gravar um demo de 2 minutos?"
```

---

## 5. Os 5 Projetos

| # | Nome | Nicho | Spec |
|---|------|-------|------|
| 1 | saude-agendamento | Saúde — agendamento médico | [spec](2026-03-17-saude-agendamento.md) |
| 2 | restaurante-pedidos | Restaurante — sistema de pedidos | [spec](2026-03-17-restaurante-pedidos.md) |
| 3 | fitness-treinos | Fitness — plataforma de treinos | [spec](2026-03-17-fitness-treinos.md) |
| 4 | ecommerce-micro | E-commerce micro | [spec](2026-03-17-ecommerce-micro.md) |
| 5 | saas-tarefas | SaaS — gerenciador de tarefas | [spec](2026-03-17-saas-tarefas.md) |
