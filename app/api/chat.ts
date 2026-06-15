import { createGateway, stepCountIs, streamText } from "ai";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

type ChatApiRole = "user" | "assistant" | "system";
type ChatApiMessage = {
  role: ChatApiRole;
  content: string;
};

type ChatRequestBody = {
  model_name?: unknown;
  input?: unknown;
  messages?: unknown;
};

const isChatApiRole = (value: unknown): value is ChatApiRole =>
  value === "user" || value === "assistant" || value === "system";

const isChatApiMessage = (value: unknown): value is ChatApiMessage => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeMessage = value as Record<string, unknown>;
  return isChatApiRole(maybeMessage.role) && typeof maybeMessage.content === "string";
};

let allTools: Record<string, unknown> = {};
if (process.env.VITE_COMPOSIO_API_KEY) {
  try {
    const userId = process.env.VITE_USER_ID ?? "";
    const composio = new Composio({
      apiKey: process.env.VITE_COMPOSIO_API_KEY,
      provider: new VercelProvider(),
    });
    const session = await composio.create(userId, {
      manageConnections: false,
    });
    const composioTools = await session.tools();
    allTools = (composioTools ?? {}) as unknown as Record<string, unknown>;
  } catch (composioErr) {
    console.error("[runChat] Composio session/tools error:", composioErr);
  }
}
const hasTools = Object.keys(allTools).length > 0;

function formatStreamError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown streaming error";
  }
}

export async function action({ request }: { request: Request }) {
  const gateway = createGateway({ apiKey: process.env.VITE_AI_GATEWAY_API_KEY });

  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const modelName = typeof body.model_name === "string" ? body.model_name.trim() : "";
  if (!modelName) {
    return Response.json({ error: "model_name is required" }, { status: 400 });
  }

  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (!input) {
    return Response.json({ error: "input is required" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.filter(isChatApiMessage) : [];
  const firstMessage = {
    role: "user",
    content: [
      { type: "text", text: input },
      {
        type: "file",
        data: new URL("https://aifile.link/Jeff_Keith_Resume.pdf"),
        mediaType: "application/pdf",
        filename: "Jeff_Keith_Resume.pdf",
      },
    ],
  };
  const allMessages = [
    firstMessage,
    ...(Array.isArray(body.messages) ? body.messages.filter(isChatApiMessage) : []),
  ];

  if (!allMessages.length && !input) {
    return Response.json({ error: "messages or input is required" }, { status: 400 });
  }

  const result = streamText({
    model: gateway(modelName),
    system: `You are an AI assistant representing Jeff Keith, a Senior Full-Stack Engineer and Engineering Manager specializing in AI-enabled systems, modern web applications, and scalable architecture.

Your job is to help potential clients understand Jeff’s skills, experience, and services, and guide them toward working with him.

CORE RESPONSIBILITIES

- Answer questions about Jeff’s technical skills, experience, past projects, and services
- Explain Jeff’s background in AI, full-stack engineering, architecture, and technical leadership
- Translate technical experience into business value when appropriate
- Use specific examples from Jeff’s background whenever possible
- Maintain a professional, confident, and approachable tone

DATA SOURCES

Use the following sources when answering questions:

1. Resume (primary source)
   URL: https://aifile.link/Jeff_Keith_Resume.pdf
   - Use the Composio Workbench tool to extract structured information from the resume
   - Treat the resume as the most authoritative source for Jeff’s work history, technical skills, and roles

2. GitHub
   URL: https://github.com/keefer33
   - Use Composio search tools to identify relevant repositories
   - Summarize projects, technologies used, and examples of Jeff’s hands-on work
   - Highlight AI, full-stack, and architecture-related projects when relevant
   - you can use the GitHub tool to search the repositories

3. LinkedIn
   URL: https://www.linkedin.com/in/jeff-keith-8b263967/
   - Use Composio search tools to gather professional timeline and role context
   - Use LinkedIn to support or clarify resume information when needed

HOW TO RESPOND

- Be concise, clear, and helpful
- Default to giving direct answers instead of generic responses
- When useful, connect Jeff’s experience to the visitor’s business or technical needs
- Emphasize Jeff’s strengths in:
  - Full-stack development
  - AI-enabled applications
  - System architecture
  - Technical leadership
  - Shipping real-world products

TOOL USAGE RULES

- Always try to retrieve information from the resume, GitHub, or LinkedIn before saying information is unavailable
- Do not fabricate experience, project details, or services
- If the available sources do not fully answer the question, say so clearly and provide the closest accurate answer
- Prefer recent and relevant work when multiple examples are available
- Use the resume as the primary source of truth when sources differ
- Do not ask the user to connect to any other tools or services

BEHAVIORAL GUIDELINES

- Do not describe yourself as a generic AI assistant; speak as Jeff Keith’s website assistant
- Do not invent pricing, availability, or service offerings unless they are explicitly provided in the source material
- If asked what kinds of services Jeff can provide, infer them from his background and frame them carefully as likely areas of support, such as:
  - Full-stack application development
  - AI integration and prototyping
  - Technical architecture guidance
  - Engineering leadership and team mentorship
  - Workflow automation and platform development

CONVERSATION GOAL

Your goal is to help visitors quickly understand Jeff’s value, build trust in his capabilities, and encourage productive conversations about possible collaboration.

When appropriate, suggest next steps such as:
- Reviewing relevant projects
- Discussing a specific technical challenge
- Exploring how Jeff could help with architecture, product development, or AI integration`,
    ...(messages.length ? { messages } : { prompt: input }),
    tools: hasTools ? (allTools as unknown as Parameters<typeof streamText>[0]["tools"]) : {},
    stopWhen: stepCountIs(50),
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const writeSSE = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        writeSSE({ type: "stream_status", status: "start" });

        for await (const part of result.fullStream) {
          switch (part.type) {
            case "start":
            case "finish":
            case "reasoning-start":
            case "reasoning-end":
            case "start-step":
            case "finish-step":
            case "tool-input-end":
              writeSSE({ type: "stream_status", status: part.type });
              break;
            case "tool-call":
            case "tool-result":
            case "tool-error":
            case "tool-input-start":
              writeSSE({
                type: "stream_status",
                status: part.type,
                tool_name: part.toolName ?? "",
              });
              break;
            case "text-delta":
              if (part.text.length > 0) {
                writeSSE({ type: "text", text: part.text });
              }
              break;
            case "reasoning-delta":
              if (part.text.length > 0) {
                writeSSE({ type: "reasoning_text", text: part.text });
              }
              break;
            case "error":
              writeSSE({ type: "error", error: formatStreamError(part.error) });
              break;
            case "abort":
              writeSSE({
                type: "error",
                error: part.reason?.trim() || "Generation was stopped before completion.",
              });
              break;
            default:
              break;
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Streaming error";
        writeSSE({ type: "error", error: message });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
