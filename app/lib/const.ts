/**
 * AI Gateway models from admin JSON: value = parsed meta.id, label = parsed meta.name.
 * Sorted by `order` ascending.
 */
export type AiModelOption = { value: string; label: string };

export const DEFAULT_AI_MODEL = "anthropic/claude-opus-4.7";

export const AI_MODEL_OPTIONS: AiModelOption[] = [
  { value: "openai/gpt-5.5", label: "GPT 5.5" },
  { value: "anthropic/claude-opus-4.7", label: "Claude Opus 4.7" },
  { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6" },
  { value: "xai/grok-4.3", label: "Grok 4.3" },
  { value: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { value: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
  { value: "deepseek/deepseek-v4-flash", label: "DeepSeek V4 Flash" },
  { value: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { value: "zai/glm-5.1", label: "GLM 5.1" },
  { value: "minimax/minimax-m2.7-highspeed", label: "MiniMax M2.7 High Speed" },
];

/** Suggested questions for the site assistant — reusable across pages. */
export const CHAT_EXPLORER_PROMPTS = [
  "Give me a concise overview of Jeff's resume.",
  "What stands out on Jeff's GitHub?",
  "Walk me through his work history in order.",
  "What are Jeff's strongest technical skills?",
  "How has he led teams and engineers?",
  "Where does AI show up in his recent work?",
  "What kind of roles or projects is he a fit for?",
  "Has he shipped production AI features, not just experiments?",
  "What stack does he use day to day?",
  "What's different about his path from IC to engineering manager?",
  "Does he still write code alongside managing?",
  "Who has he worked for, and in what industries?",
] as const;

export type ChatExplorerPrompt = (typeof CHAT_EXPLORER_PROMPTS)[number];

/** Chat prompts scoped to portfolio project pages — assistant uses resume, GitHub, LinkedIn. */
export const GENNY_BOT_PROJECT_PROMPTS = [
  "Give me a summary fo the genny repo.",
  "Do an architectural deep-dive on the genny repo.",
  "Tell me about the api endpoints in the genny repo.",
  "Perform a code review of one of the features in the genny repo. Highlight the code and the reasoning behind the code.",
] as const;

export const SLOOT_AI_PROJECT_PROMPTS = [
  "Give me a summary fo the slootai repo.",
  "Do an architectural deep-dive on the slootai repo.",
  "Tell me about the api endpoints in the slootai repo.",
  "Perform a code review of one of the features in the slootai repo. Highlight the code and the reasoning behind the code.",
] as const;

/** Raw GitHub README URLs for project pages (rendered client-side). */
export const SLOOT_AI_README_URL =
  "https://raw.githubusercontent.com/keefer33/slootai/refs/heads/main/README.md";

export const GENNY_BOT_README_URL =
  "https://raw.githubusercontent.com/keefer33/genny/refs/heads/main/README.md";

export const GENNY_BOT_API_README_URL =
  "https://raw.githubusercontent.com/keefer33/gennyapi/refs/heads/main/README.md";

export const SLOOT_AI_API_README_URL =
  "https://raw.githubusercontent.com/keefer33/slootapi/refs/heads/main/README.md";

export const SLOOT_AI_MCP_SERVER_README_URL =
  "https://raw.githubusercontent.com/keefer33/slootmcp/refs/heads/main/README.md";

export const SLOOT_OVERVIEW_LOOM = "https://www.loom.com/share/36358c6746cf4671ab72c75fa0a12ada";
