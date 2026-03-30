import {
  AspectRatio,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { RiExternalLinkLine } from "@remixicon/react";
import type { ReactNode } from "react";

export function ProjectPageShell({
  eyebrow = "Recent project",
  title,
  siteUrl,
  siteLabel,
  children,
}: {
  eyebrow?: string;
  title: string;
  siteUrl: string;
  siteLabel?: string;
  children: ReactNode;
}) {
  const label = siteLabel ?? new URL(siteUrl).hostname.replace(/^www\./, "");

  return (
    <Container size="md" py="lg">
      <Stack gap="xl">
        <Stack gap="sm">
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.06}>
            {eyebrow}
          </Text>
          <Title order={2}>{title}</Title>
          <Button
            component="a"
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            w="fit-content"
            style={{ textDecoration: "none" }}
          >
            <Group gap="sm" align="center">
              <Text>Visit {label}</Text>
              <RiExternalLinkLine size={16} />
            </Group>
          </Button>
        </Stack>
        {children}
      </Stack>
    </Container>
  );
}

function loomShareToEmbedSrc(shareUrl: string): string {
  const u = new URL(shareUrl);
  const parts = u.pathname.split("/").filter(Boolean);
  const i = parts.findIndex((p) => p === "share" || p === "embed");
  if (i === -1 || !parts[i + 1]) {
    throw new Error(`Invalid Loom URL: ${shareUrl}`);
  }
  return `https://www.loom.com/embed/${parts[i + 1]}`;
}

/**
 * Loom does not document a parameter that only hides the view count.
 * `hideEmbedTopBar` hides the top bar (title, owner, share); the view count is often removed with it.
 * @see https://support.atlassian.com/loom/docs/embed-your-video-into-a-webpage/
 */
const DEFAULT_LOOM_EMBED_PARAMS: Record<string, string> = {
  hideEmbedTopBar: "true",
};

function buildLoomEmbedUrl(shareUrl: string, embedParams?: Record<string, string>): string {
  const base = loomShareToEmbedSrc(shareUrl);
  const url = new URL(base);
  const merged = { ...DEFAULT_LOOM_EMBED_PARAMS, ...embedParams };
  for (const [key, value] of Object.entries(merged)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

/** Responsive Loom embed from a `https://www.loom.com/share/…` (or `/embed/…`) URL. */
export function ProjectLoomEmbed({
  shareUrl,
  title = "Loom walkthrough",
  embedParams,
}: {
  shareUrl: string;
  title?: string;
  /** Extra or override [Loom embed query params](https://support.atlassian.com/loom/docs/embed-your-video-into-a-webpage/) (merged with defaults). */
  embedParams?: Record<string, string>;
}) {
  const embedSrc = buildLoomEmbedUrl(shareUrl, embedParams);

  return (
    <Paper withBorder radius="md" p="md" bg="var(--mantine-color-body)">
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            border: 0,
            borderRadius: "var(--mantine-radius-md)",
            width: "100%",
            height: "100%",
          }}
        />
      </AspectRatio>
    </Paper>
  );
}

/** 16:9 block — drop in a `<video>` or embed when ready. */
export function ProjectVideoSlot({
  caption = "Drop a recorded walkthrough, demo, or embed here.",
}: {
  caption?: string;
}) {
  return (
    <Paper withBorder radius="md" p="md" bg="var(--mantine-color-body)">
      <AspectRatio ratio={16 / 9}>
        <Center
          bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))"
          style={{
            borderRadius: "var(--mantine-radius-md)",
            border:
              "1px dashed light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))",
          }}
        >
          <Stack align="center" gap={6} px="md" maw={360}>
            <Text size="sm" fw={600} c="dimmed" ta="center">
              Video placeholder
            </Text>
            <Text size="xs" c="dimmed" ta="center" lh={1.5}>
              {caption}
            </Text>
          </Stack>
        </Center>
      </AspectRatio>
    </Paper>
  );
}

/** One or more screenshot frames for a feature area. */
export function ProjectScreenshotSlot({
  index = 1,
  caption = "Replace with a UI screenshot or annotated image.",
}: {
  index?: number;
  caption?: string;
}) {
  return (
    <Paper withBorder radius="md" p="xs" bg="var(--mantine-color-body)">
      <AspectRatio ratio={16 / 10}>
        <Center
          bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))"
          style={{
            borderRadius: "var(--mantine-radius-sm)",
            border:
              "1px dashed light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))",
          }}
        >
          <Stack align="center" gap={4} px="sm">
            <Text size="xs" fw={600} c="dimmed" ta="center">
              Screenshot {index}
            </Text>
            <Text size="xs" c="dimmed" ta="center" lh={1.45}>
              {caption}
            </Text>
          </Stack>
        </Center>
      </AspectRatio>
    </Paper>
  );
}

export function ProjectScreenshotRow({
  count = 2,
  captions,
}: {
  count?: number;
  captions?: string[];
}) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {Array.from({ length: count }, (_, i) => (
        <ProjectScreenshotSlot key={i} index={i + 1} caption={captions?.[i] ?? undefined} />
      ))}
    </SimpleGrid>
  );
}

export function FeatureSection({
  title,
  description,
  children,
  titleRight,
}: {
  title: string;
  description: ReactNode;
  children?: ReactNode;
  /** Optional control (e.g. link) aligned to the right of the title row. */
  titleRight?: ReactNode;
}) {
  return (
    <Card radius="md" padding="lg" shadow="xs">
      <Stack gap="md">
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
            <Title order={3} size="h4" style={{ flex: 1, minWidth: 0 }}>
              {title}
            </Title>
            {titleRight ? <Box style={{ flexShrink: 0 }}>{titleRight}</Box> : null}
          </Group>
          <Text size="sm" c="dimmed" lh={1.65}>
            {description}
          </Text>
        </Stack>
        {children ? (
          <>
            <Divider />
            {children}
          </>
        ) : null}
      </Stack>
    </Card>
  );
}
