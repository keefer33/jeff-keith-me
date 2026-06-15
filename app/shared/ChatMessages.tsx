import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Container,
  Group,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { RiArrowLeftLine } from "@remixicon/react";
import { useEffect, useRef } from "react";
import useChatStore from "~/lib/stores/chatStore";
import { useChatScroll } from "~/lib/hooks/useChatScroll";
import { useTheme } from "~/lib/hooks/useTheme";
import useAppStore from "~/lib/stores/appStore";
import MarkdownRenderer from "./MarkdownRenderer";
import ChatFooterLegend from "./ChatFooterLegend";

const STREAM_STATUS_LABELS: Record<string, string> = {
  start: "Starting",
  finish: "Finishing",
  "reasoning-start": "Thinking",
  "reasoning-end": "Writing",
  "start-step": "Processing",
  "finish-step": "Step complete",
  "tool-input-start": "Tool input started",
  "tool-input-end": "Tool input finished",
  "tool-call": "Calling tool",
  "tool-result": "Tool result received",
  "tool-error": "Tool error",
};

function getStreamStatusLabel(streamStatus: { status: string; tool_name?: string }) {
  if (streamStatus.tool_name && streamStatus.tool_name.length > 0) {
    return `${streamStatus.tool_name} : ${STREAM_STATUS_LABELS[streamStatus.status]}`;
  }

  return STREAM_STATUS_LABELS[streamStatus.status] ?? "Working...";
}

export default function ChatMessages() {
  const { messages, isMessagesVisible, isStreaming, streamStatus, error, hideMessages } =
    useChatStore();
  const { viewportRef, scrollToBottom } = useChatScroll();
  const { colorScheme } = useTheme();
  const { isMobile } = useAppStore();
  const wasStreamingRef = useRef(false);

  useEffect(() => {
    if (!isMessagesVisible) {
      return;
    }
    if (isStreaming) {
      scrollToBottom();
    } else if (wasStreamingRef.current) {
      scrollToBottom("auto", 50);
    }
    wasStreamingRef.current = isStreaming;
  }, [messages, isStreaming, streamStatus, isMessagesVisible, error, scrollToBottom]);

  if (!isMessagesVisible) {
    return null;
  }

  const mainHeight =
    "calc(100dvh - var(--app-shell-header-offset, 0px) - var(--app-shell-footer-offset, 0px))";
  return (
    <>
      <ScrollArea viewportRef={viewportRef} h={mainHeight}>
        <Container size="md" py="xs">
          <Stack gap="xs" pb="xl">
            <Group gap="xs" wrap="nowrap" justify="space-between" align="center">
              <Tooltip label="Back">
                <ActionIcon
                  type="button"
                  variant="subtle"
                  color="gray"
                  size="lg"
                  onClick={hideMessages}
                  aria-label="Hide chat messages"
                >
                  <RiArrowLeftLine size={22} />
                </ActionIcon>
              </Tooltip>
              <ChatFooterLegend />
            </Group>
            {messages.length === 0 && (
              <Text size="sm" c="dimmed">
                Send a prompt from the footer to start chatting.
              </Text>
            )}

            {messages.map((message, index) => {
              const isActiveStreamBubble =
                message.role === "assistant" && isStreaming && index === messages.length - 1;

              return (
                <Card
                  key={message.id}
                  radius="sm"
                  p="sm"
                  bg={
                    message.role === "user"
                      ? colorScheme === "dark"
                        ? "gray.9"
                        : "gray.0"
                      : undefined
                  }
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: message.role === "user" ? "85%" : isMobile ? "100%" : "85%",
                  }}
                  miw={200}
                >
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      {message.role}
                    </Text>

                    {message.content ? (
                      <Box
                        className="markdown-body"
                        fz="sm"
                        mih={isActiveStreamBubble ? 28 : undefined}
                      >
                        <MarkdownRenderer
                          content={message.content}
                          streaming={isActiveStreamBubble}
                        />
                      </Box>
                    ) : (
                      ""
                    )}
                    {message.role === "assistant" && message.reasoning ? (
                      <Text size="xs" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
                        {message.reasoning}
                      </Text>
                    ) : null}
                    {isActiveStreamBubble ? (
                      <Badge variant="light" w="fit-content">
                        {streamStatus ? getStreamStatusLabel(streamStatus) : "Streaming..."}
                      </Badge>
                    ) : null}
                  </Stack>
                </Card>
              );
            })}
          </Stack>

          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}
        </Container>
      </ScrollArea>
    </>
  );
}
