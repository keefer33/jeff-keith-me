import { SimpleGrid, Stack } from "@mantine/core";
import { ChatPromptTriggerList } from "~/shared/ChatPromptTriggers";
import ProjectReadmeSection from "~/shared/ProjectReadmeSection";
import { FeatureSection, ProjectLoomEmbed, ProjectPageShell } from "~/shared/ProjectShowcaseLayout";
import {
  SLOOT_AI_API_README_URL,
  SLOOT_AI_MCP_SERVER_README_URL,
  SLOOT_AI_PROJECT_PROMPTS,
  SLOOT_AI_README_URL,
  SLOOT_OVERVIEW_LOOM,
} from "~/lib/const";
export default function SlootAiProjectPage() {
  return (
    <ProjectPageShell title="Sloot.ai" siteUrl="https://sloot.ai/">
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" verticalSpacing="lg">
          <FeatureSection
            title="Overview"
            description="Deploy intelligent AI agents that connect to your entire stack. With SlootAI, you get multi-model support (OpenAI, Anthropic, Gemini, DeepSeek), 2,500+ app integrations via Pipedream, custom tools, MCP servers, file management, and self-hosted cloud infrastructure — all in a single, developer-friendly platform."
          >
            <ProjectLoomEmbed shareUrl={SLOOT_OVERVIEW_LOOM} title="Sloot.ai overview — Loom" />
          </FeatureSection>
          <FeatureSection
            title="Ask the assistant"
            description="Tap a question to chat with Jeff's site assistant or enter in your own prompt."
          >
            <ChatPromptTriggerList prompts={SLOOT_AI_PROJECT_PROMPTS} gap="md" />
          </FeatureSection>
        </SimpleGrid>

        <ProjectReadmeSection readmeUrl={SLOOT_AI_README_URL} />
        <ProjectReadmeSection readmeUrl={SLOOT_AI_API_README_URL} />
        <ProjectReadmeSection readmeUrl={SLOOT_AI_MCP_SERVER_README_URL} />
      </Stack>
    </ProjectPageShell>
  );
}
