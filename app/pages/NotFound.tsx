import { Container, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

/**
 * Fallback for unknown paths (e.g. scanner probes) so the router matches and
 * logs stay clean instead of "No route matches URL".
 */
export default function NotFound() {
  return (
    <Container size="md" py="lg">
      <Stack gap="md">
        <Title order={2}>Page not found</Title>
        <Text size="sm" c="dimmed">
          Nothing lives at this URL.{" "}
          <Link to="/" style={{ color: "inherit" }}>
            Go home
          </Link>
          .
        </Text>
      </Stack>
    </Container>
  );
}
