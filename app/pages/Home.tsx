import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";
import { CHAT_EXPLORER_PROMPTS } from "~/lib/const";
import { ChatPromptTriggerList } from "~/shared/ChatPromptTriggers";

export default function Home() {
  return (
    <Container size="md" py="lg">
      <Stack gap="xl">
        <Stack gap="lg">
          <Title order={2}>Welcome</Title>

          <Text size="md">
            You are chatting with Jeff Keith&apos;s site assistant — it can draw on his resume,
            GitHub, and LinkedIn to answer questions about his work, leadership, and how he might
            help your team.
          </Text>
          <Text size="sm">
            Use the prompt box below to ask anything, or try one of the suggested questions. Answers
            stream in the chat panel.
          </Text>

          <Text size="sm" c="dimmed">
            Prefer a traditional layout?{" "}
            <Anchor component={Link} to="/resume" underline="hover">
              View the full resume page
            </Anchor>{" "}
            or{" "}
            <Anchor href="/JeffKeithResume2026.pdf" underline="hover">
              download the PDF
            </Anchor>
            .
          </Text>
        </Stack>

        <Stack gap="xs">
          <Title order={3} size="h4">
            Suggested questions
          </Title>
          <Text size="sm" c="dimmed">
            Click a prompt to send it to the assistant (it starts streaming immediately).
          </Text>

          <ChatPromptTriggerList prompts={CHAT_EXPLORER_PROMPTS} />
        </Stack>
      </Stack>
    </Container>
  );
}
