# Licença Parental · Simulador Portugal

Um simulador visual e interativo para **planear a licença parental em Portugal**, com base nas regras oficiais da Segurança Social (120 / 150 dias + 30 dias extra partilhados).

👉 **Site em produção:** [`https://www.licencaparentalportuguesa.pt/`](https://www.licencaparentalportuguesa.pt/)

---

## ✨ Principais funcionalidades

- **Simulador de licença (120 / 150 / +30 dias)**
  - Escolha entre **120** ou **150 dias** iniciais.
  - Ative os **30 dias extra partilhados** (licença partilhada), com validação das regras (cada progenitor tem de gozar pelo menos 30 dias ou 2×15).
- **Calendário interativo**
  - Seleção da **data do parto**.
  - Calendário que mostra, dia a dia, se o bebé está com a mãe, o pai ou ambos.
- **Timeline visual**
  - Linha temporal com todos os blocos:
    - 42 dias obrigatórios da mãe
    - 28+7 dias (obrigatórios + opcionais) do pai
    - dias exclusivos de cada um
    - 30 dias extra partilhados
- **Cálculo de remuneração**
  - Introduz a **remuneração bruta mensal** da mãe e do pai.
  - Para cada período mostra:
    - número de dias
    - valor estimado de subsídio
    - **percentagem aplicada (80%, 83%, 90%, 100%)** conforme o guia oficial.
- **Regras explicadas**
  - Secção “Como funciona a licença parental?” com um resumo claro + link para o guia oficial em `gov.pt`.

---

## 🛠 Stack técnica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **UI**: React + Tailwind CSS
- **Estilo / UX**:
  - Layout responsivo (mobile-first)
  - Inputs otimizados para mobile (touch-friendly, sem zoom no iOS)
  - Componentes dedicados:
    - `Calendar` (data do parto)
    - `Timeline` (resumo + detalhe + remuneração)
    - `LeaveCalendar` (calendário inferior)
    - `RulesSection` (explicação das regras)

---

## 🚀 Como correr localmente

```bash
npm install
npm run dev
```

Depois abre:

- `http://localhost:3000`

---

## 🌐 Deploy na Vercel

Este projeto está preparado para deploy na Vercel:

1. Fazer push do código para um repositório (GitHub, GitLab, etc.).
2. Em [vercel.com](https://vercel.com), clicar em **Add New Project** e importar o repositório.
3. Confirmar as definições (framework Next.js é detetada automaticamente) e clicar em **Deploy**.

Ou usar a CLI:

```bash
npm i -g vercel
vercel        # primeiro deploy (configuração)
vercel --prod # deploy de produção
```

---

## 📚 Referências

- Guia oficial: [Licença e subsídio parental em Portugal (gov.pt)](https://www.gov.pt/guias/ter-uma-crianca/licenca-parental)
- Regulamento da Segurança Social (Subsídio Parental Inicial)
- Ficheiros de apoio na pasta `files/`:
  - `Licença Parental - Google Docs.pdf` (regras resumidas)
  - `Calculo Licença Parental.xlsx` (simulador original em Excel)
