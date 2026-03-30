import { ActionIcon, Box, Group, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RiPaletteLine } from "@remixicon/react";
import { colorOptions } from "~/lib/themeUtils";
import { useTheme } from "~/lib/hooks/useTheme";

interface ColorPickerProps {
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  trigger?: "popover" | "inline";
  maxWidth?: string;
}

export default function ColorPicker({
  size = "sm",
  trigger = "popover",
  maxWidth = "230px",
}: ColorPickerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { themeColor, changeThemeColor, colorScheme } = useTheme();

  const handleColorChange = (color: string) => {
    changeThemeColor(color);
    if (trigger === "popover") {
      close();
    }
  };

  const colorGrid = (
    <Group gap="xs" justify="flex-start">
      {colorOptions.map((color) => (
        <Box
          key={color.value}
          style={{
            cursor: "pointer",
          }}
          onClick={() => handleColorChange(color.value)}
        >
          <ActionIcon
            variant="filled"
            color={color.value}
            size={size}
            style={{
              border:
                themeColor === color.value
                  ? colorScheme === "light"
                    ? "2px solid var(--mantine-color-gray-9)"
                    : "2px solid var(--mantine-color-gray-0)"
                  : undefined,
            }}
            aria-label={`Set color to ${color.name}`}
          />
        </Box>
      ))}
    </Group>
  );

  if (trigger === "inline") {
    return <Box style={{ maxWidth }}>{colorGrid}</Box>;
  }

  return (
    <Popover
      opened={opened}
      onChange={close}
      position="bottom-end"
      withArrow
      offset={8}
      closeOnClickOutside
      closeOnEscape
    >
      <Popover.Target>
        <ActionIcon onClick={open} variant="transparent" size="lg" aria-label="Change color scheme">
          <RiPaletteLine />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        bg={colorScheme === "light" ? "var(--mantine-color-gray-1)" : "var(--mantine-color-dark-6)"}
      >
        <Box p={0} maw={maxWidth}>
          {colorGrid}
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
