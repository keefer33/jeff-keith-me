import {
  ActionIcon,
  Card,
  Container,
  Group,
  Select,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  RiChatDownloadLine,
  RiChatNewLine,
  RiChatUploadLine,
  RiSendPlane2Line,
} from "@remixicon/react";
import { useState } from "react";
import { AI_MODEL_OPTIONS } from "~/lib/const";
import useChatStore from "~/lib/stores/chatStore";

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const {
    sendPrompt,
    isStreaming,
    isMessagesVisible,
    toggleMessagesVisibility,
    clearMessages,
    modelName,
    setModelName,
  } = useChatStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    const promptToSend = prompt;
    setPrompt("");
    await sendPrompt(promptToSend);
  };

  return (
    <Container size="md" py="lg">
      <Card radius="sm" p="xs">
        <form onSubmit={handleSubmit}>
          <Stack gap="xs">
            <Group gap="sm" wrap="nowrap" align="flex-start">
              <TextInput
                value={prompt}
                variant="transparent"
                onChange={(event) => setPrompt(event.currentTarget.value)}
                placeholder="Ask the chatbot..."
                aria-label="Chat prompt"
                disabled={isStreaming}
                style={{ flex: 1 }}
              />

              <Tooltip label="Send">
                <ActionIcon
                  type="submit"
                  variant="transparent"
                  size="lg"
                  loading={isStreaming}
                  disabled={!prompt.trim()}
                  aria-label="Send message"
                >
                  <RiSendPlane2Line size={24} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Group gap="sm" justify="space-between">
              <Select
                //label="Model"
                size="xs"
                placeholder="Select model"
                data={AI_MODEL_OPTIONS}
                value={modelName}
                onChange={(value) => value && setModelName(value)}
                disabled={isStreaming}
                searchable
                aria-label="AI model"
                //variant="filled"
              />

              <Group gap="xs" justify="space-between">
                <Tooltip label="New Chat">
                  <ActionIcon
                    type="button"
                    variant="transparent"
                    size="md"
                    onClick={clearMessages}
                    disabled={isStreaming}
                    aria-label="New Chat"
                  >
                    <RiChatNewLine size={24} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={isMessagesVisible ? "Hide chat" : "Show chat"}>
                  <ActionIcon
                    type="button"
                    variant="transparent"
                    size="md"
                    onClick={toggleMessagesVisibility}
                    aria-label={isMessagesVisible ? "Hide chat" : "Show chat"}
                  >
                    {isMessagesVisible ? (
                      <RiChatDownloadLine size={24} />
                    ) : (
                      <RiChatUploadLine size={24} />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
