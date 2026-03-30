import { Alert, Anchor, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { RiExternalLinkLine, RiGithubFill } from "@remixicon/react";
import { useEffect, useMemo, useState } from "react";
import { repoUrlFromRawReadmeUrl } from "~/lib/utils";
import MarkdownRenderer from "~/shared/MarkdownRenderer";
import { FeatureSection } from "~/shared/ProjectShowcaseLayout";

function repoNameFromGithubUrl(githubRepoUrl: string): string | null {
  try {
    const u = new URL(githubRepoUrl);
    if (!u.hostname.includes("github.com")) {
      return null;
    }
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[1] ?? parts[0] ?? null;
  } catch {
    return null;
  }
}

type ProjectReadmeSectionProps = {
  readmeUrl: string;
  /** Overrides auto-detection from `readmeUrl` (owner/repo segment after raw.githubusercontent.com). */
  repoUrl?: string;
  title?: string;
  /** Plain text only — rendered inside FeatureSection’s dimmed label. */
  description?: string;
};

/**
 * Fetches a public raw README (e.g. GitHub) and renders it with {@link MarkdownRenderer}.
 */
export default function ProjectReadmeSection({
  readmeUrl,
  repoUrl: repoUrlProp,
  title = "README",
  description = "Latest overview from the repository README (loaded from GitHub).",
}: ProjectReadmeSectionProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const repoHref = useMemo(
    () => repoUrlProp ?? repoUrlFromRawReadmeUrl(readmeUrl),
    [readmeUrl, repoUrlProp]
  );

  const repoDisplayName = useMemo(() => {
    if (!repoHref) {
      return null;
    }
    const fromPath = repoNameFromGithubUrl(repoHref);
    if (fromPath) {
      return fromPath;
    }
    try {
      return new URL(repoHref).pathname.split("/").filter(Boolean).pop() ?? null;
    } catch {
      return null;
    }
  }, [repoHref]);

  const titleRight = repoHref ? (
    <Anchor
      href={repoHref}
      target="_blank"
      rel="noopener noreferrer"
      size="sm"
      c="dimmed"
      style={{ lineHeight: 1.3 }}
      aria-label={
        repoDisplayName
          ? `${repoDisplayName} on GitHub (opens in new tab)`
          : "Repository on GitHub (opens in new tab)"
      }
    >
      <Group gap={6} wrap="nowrap" justify="flex-end">
        <RiGithubFill size={18} aria-hidden />
        {repoDisplayName ? (
          <Text component="span" size="sm" fw={500}>
            {repoDisplayName}
          </Text>
        ) : null}
        <RiExternalLinkLine size={16} aria-hidden />
      </Group>
    </Anchor>
  ) : undefined;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setContent(null);

    fetch(readmeUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (!cancelled) {
          setContent(text);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Request failed");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [readmeUrl]);

  return (
    <FeatureSection title={title} description={description} titleRight={titleRight}>
      <Stack gap="md">
        {loading ? (
          <Center py="xl">
            <Loader type="dots" />
          </Center>
        ) : null}

        {!loading && error ? (
          <Alert color="red" title="Could not load README">
            <Text size="sm">
              {error}. Open the{" "}
              <Anchor href={readmeUrl} target="_blank" rel="noopener noreferrer">
                raw file
              </Anchor>{" "}
              or try again later.
            </Text>
          </Alert>
        ) : null}

        {!loading && content ? (
          <MarkdownRenderer content={content} className="markdown-body" />
        ) : null}
      </Stack>
    </FeatureSection>
  );
}
