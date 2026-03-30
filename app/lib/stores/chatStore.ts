import { create } from "zustand";
import createUniversalSelectors from "./universalSelectors";
import { DEFAULT_AI_MODEL } from "../const";

type ChatRole = "user" | "assistant";
type ChatApiRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  reasoning?: string;
};

export type ChatToolEvent = {
  id: string;
  toolCallId?: string;
  toolName: string;
  type: "tool-call" | "tool-result";
  payload: string;
};

type ChatApiMessage = {
  role: ChatApiRole;
  content: string;
};

type StreamEvent =
  | { type: "text"; text: string }
  | { type: "text-delta"; text: string }
  | { type: "reasoning_text"; text: string }
  | { type: "stream_status"; status: string; tool_name?: string }
  | { type: "error"; error?: string };

interface ChatStoreState {
  modelName: string;
  messages: ChatMessage[];
  toolEvents: ChatToolEvent[];
  streamStatus: { status: string; tool_name?: string } | null;
  isMessagesVisible: boolean;
  isStreaming: boolean;
  error: string | null;
  setModelName: (modelName: string) => void;
  toggleMessagesVisibility: () => void;
  showMessages: () => void;
  hideMessages: () => void;
  clearMessages: () => void;
  sendPrompt: (prompt: string) => Promise<void>;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const useChatStoreBase = create<ChatStoreState>((set, get) => ({
  modelName: DEFAULT_AI_MODEL,
  messages: [],
  toolEvents: [],
  streamStatus: null,
  isMessagesVisible: false,
  isStreaming: false,
  error: null,

  setModelName: (modelName) => set({ modelName }),
  toggleMessagesVisibility: () => set((state) => ({ isMessagesVisible: !state.isMessagesVisible })),
  showMessages: () => set({ isMessagesVisible: true }),
  hideMessages: () => set({ isMessagesVisible: false }),
  clearMessages: () => set({ messages: [], toolEvents: [], streamStatus: null, error: null }),

  sendPrompt: async (prompt) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || get().isStreaming) {
      return;
    }

    const userMessageId = createId();
    const assistantMessageId = createId();
    const conversationForRequest: ChatApiMessage[] = [
      ...get()
        .messages.filter((message) => message.content.trim().length > 0)
        .map((message) => ({ role: message.role, content: message.content })),
      { role: "user", content: trimmedPrompt },
    ];

    set((state) => ({
      isMessagesVisible: true,
      isStreaming: true,
      error: null,
      toolEvents: [],
      streamStatus: { status: "start" },
      messages: [
        ...state.messages,
        { id: userMessageId, role: "user", content: trimmedPrompt },
        { id: assistantMessageId, role: "assistant", content: "", reasoning: "" },
      ],
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: get().modelName,
          messages: conversationForRequest,
          input: trimmedPrompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body returned from chat endpoint.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";
      let isReasoningPhase = false;

      const handleEvent = (event: StreamEvent) => {
        if (event.type === "text-delta" || event.type === "text") {
          set((state) => ({
            messages: state.messages.map((message) =>
              message.id === assistantMessageId
                ? isReasoningPhase
                  ? { ...message, reasoning: `${message.reasoning ?? ""}${event.text}` }
                  : { ...message, content: `${message.content}${event.text}` }
                : message
            ),
          }));
          return;
        }

        if (event.type === "reasoning_text") {
          set((state) => ({
            messages: state.messages.map((message) =>
              message.id === assistantMessageId
                ? { ...message, reasoning: `${message.reasoning ?? ""}${event.text}` }
                : message
            ),
          }));
          return;
        }

        if (event.type === "stream_status") {
          if (event.status === "reasoning-start") {
            isReasoningPhase = true;
          }
          if (event.status === "reasoning-end") {
            isReasoningPhase = false;
          }
          set((state) => ({
            streamStatus: { status: event.status, tool_name: event.tool_name },
            messages:
              event.status === "reasoning-end"
                ? state.messages.map((message) =>
                    message.id === assistantMessageId ? { ...message, reasoning: "" } : message
                  )
                : state.messages,
          }));
          return;
        }

        if (event.type === "error") {
          const msg = event.error ?? "Streaming error";
          set((state) => ({
            error: msg,
            messages: state.messages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: message.content.trim()
                      ? `${message.content}\n\nError: ${msg}`
                      : `Error: ${msg}`,
                  }
                : message
            ),
          }));
        }
      };

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          buffer += decoder.decode(value, { stream: !streamDone });
        }

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventBlock of events) {
          const eventLine = eventBlock
            .split("\n")
            .find((line) => line.trimStart().startsWith("data:"));
          if (!eventLine) {
            continue;
          }

          try {
            const payload = eventLine.slice(eventLine.indexOf("data:") + 5).trim();
            const event = JSON.parse(payload) as StreamEvent;
            handleEvent(event);
          } catch {
            // Ignore malformed event chunks and continue streaming
          }
        }
      }

      if (buffer.trim()) {
        try {
          const eventLine = buffer.split("\n").find((line) => line.trimStart().startsWith("data:"));
          if (!eventLine) {
            return;
          }

          const payload = eventLine.slice(eventLine.indexOf("data:") + 5).trim();
          const event = JSON.parse(payload) as StreamEvent;
          handleEvent(event);
        } catch {
          // Ignore malformed trailing chunk
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Chat request failed.";
      set((state) => ({
        error: errorMessage,
        messages: state.messages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: `Error: ${errorMessage}` }
            : message
        ),
      }));
    } finally {
      set({ isStreaming: false, streamStatus: null });
    }
  },
}));

const useChatStore = createUniversalSelectors(useChatStoreBase);

export default useChatStore;
