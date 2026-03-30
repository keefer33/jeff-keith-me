import { Alert, Group, Text } from "@mantine/core";
import type { CardProps, GroupProps } from "@mantine/core";
import { RiChat2Line } from "@remixicon/react";
import useChatStore from "~/lib/stores/chatStore";

export type ChatPromptTriggerProps = {
  prompt: string;
  disabled?: boolean;
} & Omit<CardProps, "children" | "onClick" | "component">;

/**
 * Clickable prompt that sends the string through the global chat store (streams via /api/chat).
 * Compose with {@link ChatPromptTriggerList} or use standalone on any page.
 */
export function ChatPromptTrigger({
  prompt,
  disabled: disabledProp,
  radius = "xl",
}: ChatPromptTriggerProps) {
  const sendPrompt = useChatStore((s) => s.sendPrompt);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const disabled = disabledProp ?? isStreaming;

  return (
    <Alert
      variant="light"
      p="xs"
      radius={radius}
      onClick={() => void sendPrompt(prompt)}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
      }}
      icon={<RiChat2Line size={20} />}
    >
      <Text component="span" size="sm" style={{ display: "flex", gap: "0.5rem" }}>
        <span>{prompt}</span>
      </Text>
    </Alert>
  );
}

export type ChatPromptTriggerListProps = {
  prompts: readonly string[];
} & Omit<GroupProps, "children">;

export function ChatPromptTriggerList({ prompts, gap = "lg" }: ChatPromptTriggerListProps) {
  return (
    <Group gap={gap} wrap="wrap">
      {prompts.map((p) => (
        <ChatPromptTrigger key={p} prompt={p} />
      ))}
    </Group>
  );
}
