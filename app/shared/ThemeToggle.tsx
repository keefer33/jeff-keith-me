import { ActionIcon, Group } from "@mantine/core";
import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "~/lib/hooks/useTheme";

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const isLight = colorScheme === "light";

  return (
    <Group gap="xs">
      <ActionIcon
        variant="transparent"
        size="md"
        onClick={toggleColorScheme}
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        {isLight ? <RiMoonLine /> : <RiSunLine />}
      </ActionIcon>
    </Group>
  );
}
