import {
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { ReactNode } from "react";
import { resume } from "~/lib/resume";

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card radius="md" padding="lg">
      <Stack gap="xs">
        <Title order={3} size="h4">
          {title}
        </Title>
        <Divider />
        {children}
      </Stack>
    </Card>
  );
}

export default function Resume() {
  return (
    <Container size="md" py="xs">
      <Stack gap="md">
        <Paper>
          <Group align="flex-start" justify="space-between" wrap="nowrap">
            <Stack gap={6}>
              <Title order={3}>{resume.name}</Title>
              <Text c="dimmed" fw={600}>
                {resume.headline}
              </Text>
              <Text size="sm" c="dimmed">
                {resume.location}
              </Text>
              <Group gap="xs" mt="xs">
                <Anchor href={`mailto:${resume.email}`} size="sm">
                  {resume.email}
                </Anchor>
                <Text size="sm" c="dimmed">
                  •
                </Text>
                <Anchor href={`tel:${resume.phone.replaceAll(" ", "")}`} size="sm">
                  {resume.phone}
                </Anchor>
              </Group>
            </Stack>

            <Stack align="flex-end" gap="sm">
              <Button component="a" href="/Jeff_Keith_Resume.pdf" variant="light">
                Download PDF
              </Button>
              <Button
                component="a"
                href={`mailto:${resume.email}?subject=${encodeURIComponent("Resume / Portfolio")}`}
                variant="subtle"
              >
                Contact
              </Button>
            </Stack>
          </Group>

          <Divider my="lg" />

          <Stack gap="xs">
            <Title order={3} size="h4">
              Summary
            </Title>
            <Text size="sm">{resume.summary}</Text>
          </Stack>
        </Paper>

        <SectionCard title="Professional Experience">
          <Stack gap="md">
            {resume.experience.map((job) => (
              <Paper key={`${job.role}-${job.company}`} withBorder radius="md" p="lg">
                <Stack gap="xs">
                  <Group justify="space-between" wrap="nowrap">
                    <Stack gap={2}>
                      <Text fw={800}>{job.role}</Text>
                      <Text size="sm" c="dimmed">
                        {job.company} {job.location ? `• ${job.location}` : ""}
                      </Text>
                    </Stack>
                    <Text size="sm" c="dimmed">
                      {job.range}
                    </Text>
                  </Group>

                  <List spacing="xs" size="sm" c="dimmed" icon={<span>•</span>}>
                    {job.bullets.map((b) => (
                      <List.Item key={b}>{b}</List.Item>
                    ))}
                  </List>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard title="Education">
          <Stack gap="sm">
            {resume.education.map((ed) => (
              <Paper key={ed.title} withBorder radius="md" p="lg">
                <Stack gap={2}>
                  <Text fw={800}>{ed.title}</Text>
                  <Text size="sm" c="dimmed">
                    {ed.school}
                    {ed.location ? ` • ${ed.location}` : ""}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {ed.range}
                  </Text>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard title="Technical Skills">
          <Stack gap="md">
            {resume.technicalSkills.map((group) => (
              <Stack gap="xs" key={group.group}>
                <Text fw={700}>{group.group}</Text>
                <Group gap="xs" wrap="wrap">
                  {group.skills.map((s) => (
                    <Badge key={s} variant="light">
                      {s}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            ))}
          </Stack>
        </SectionCard>
      </Stack>
    </Container>
  );
}
