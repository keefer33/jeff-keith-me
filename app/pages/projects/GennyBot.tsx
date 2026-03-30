import { Image, SimpleGrid, Stack } from "@mantine/core";
import { ChatPromptTriggerList } from "~/shared/ChatPromptTriggers";
import ProjectReadmeSection from "~/shared/ProjectReadmeSection";
import { FeatureSection, ProjectPageShell } from "~/shared/ProjectShowcaseLayout";
import {
  GENNY_BOT_PROJECT_PROMPTS,
  GENNY_BOT_API_README_URL,
  GENNY_BOT_README_URL,
} from "~/lib/const";

export default function GennyBotProjectPage() {
  return (
    <ProjectPageShell title="Genny.bot" siteUrl="https://genny.bot/">
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" verticalSpacing="lg">
          <FeatureSection
            title="Product overview"
            description="Genny.bot is a production-ready generative AI app for creating images and videos (Veo, Sora, Kling, Flux, and more). It's a full-stack platform with both a frontend and backend API."
          >
            <Image src="https://aifile.link/Flwk7X.jpg" alt="Genny.bot screenshot" />
          </FeatureSection>
          <FeatureSection
            title="Ask the assistant"
            description="Tap a question to chat with Jeff's site assistant or enter in your own prompt."
          >
            <ChatPromptTriggerList prompts={GENNY_BOT_PROJECT_PROMPTS} gap="md" />
          </FeatureSection>
        </SimpleGrid>

        <ProjectReadmeSection readmeUrl={GENNY_BOT_README_URL} />
        <ProjectReadmeSection readmeUrl={GENNY_BOT_API_README_URL} />
      </Stack>
    </ProjectPageShell>
  );
}
