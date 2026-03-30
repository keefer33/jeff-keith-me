# jeff-keith-me

## ✨ Overview

Personal portfolio site for **Jeff Keith**: a React Router app with a streaming **AI site assistant** (resume, GitHub, LinkedIn context), a traditional **resume** page, and **project showcases** for Genny.bot and Sloot.ai with README content pulled from GitHub.

## 🌐 Website

[https://jeffkeith.me](https://jeffkeith.me)

## ⭐ Features

- 💬 **Site assistant** — Chat UI with suggested prompts; answers stream in the panel
- 📄 **Resume** — Structured resume page plus PDF download link
- 🧩 **Project pages** — Genny.bot and Sloot.ai with screenshots, Loom embeds (where configured), and remote README rendering
- 🎨 **Theming** — Light/dark and accent controls (Mantine + persisted preferences)
- 🤖 **Model choice** — Select among gateway-backed models (see `app/lib/const.ts`)
- 📡 **Server route** — `POST /api/chat` streams assistant replies (Vercel AI SDK + optional Composio tools)

## 📁 Project structure

```
app/
├── api/
│   └── chat.ts           # Streaming chat API
├── pages/
│   ├── Home.tsx
│   ├── Resume.tsx
│   └── projects/         # Genny.bot, Sloot.ai showcases
├── shared/               # AppLayout, ChatBot, Markdown, project shells
├── lib/
│   ├── stores/           # Zustand (chat, app)
│   ├── hooks/
│   ├── resume.ts
│   ├── theme.ts
│   └── const.ts          # Models, prompts, README URLs
└── routes.ts
```

## 🔗 Integrations

| Integration | Role |
|-------------|------|
| ▲ [Vercel AI Gateway](https://vercel.com/ai-gateway) | Model routing via AI SDK (`ai` package) |
| 🔗 [Composio](https://composio.dev/) | Optional tool sessions (`@composio/core`, `@composio/vercel`) |
| 🐙 [GitHub](https://github.com/) | Raw README URLs for project documentation sections |
| 📎 [Loom](https://www.loom.com/) | Embedded product walkthroughs on project pages |

## 🧱 Tech stack

- 🧭 **React Router** — Full-stack routes and loaders
- ⚛️ **React** — UI
- 🔷 **TypeScript**
- 🎨 **Mantine** — Components and theming
- 🐻 **Zustand** — Client state
- 🪶 **Tailwind CSS** — Utility styling (Vite plugin)
- 📝 **CodeMirror** + **react-markdown** — Editing and rich content
- ⚡ **Vite** — Build and dev server
- 🤖 **Vercel AI SDK** (`ai`) — Streaming completions

## 📜 Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | ⚡ Dev server with HMR |
| `npm run build` | 📦 Production build |
| `npm run start` | 🚀 Serve production build (`react-router-serve`) |
| `npm run typecheck` | 🔷 React Router typegen + `tsc` |

---

Built with ❤️ for a clear, conversational portfolio experience.
