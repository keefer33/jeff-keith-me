import { Group, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core";
import { RiChatDownloadLine, RiChatNewLine, RiChatUploadLine } from "@remixicon/react";
import type { ReactNode } from "react";

function LegendChip({
  label,
  tip,
  children,
  primaryColor,
}: {
  label: string;
  tip: string;
  children: ReactNode;
  primaryColor: string;
}) {
  return (
    <Tooltip label={tip} position="top" withArrow openDelay={400}>
      <Group gap={6} wrap="nowrap" align="center" style={{ cursor: "default" }}>
        <ThemeIcon size={22} radius="sm" variant="light" color={primaryColor}>
          {children}
        </ThemeIcon>
        <Text component="span" size="xs" fw={500}>
          {label}
        </Text>
      </Group>
    </Tooltip>
  );
}

/** Compact key for chat footer actions; uses current theme primary (ColorPicker). */
export default function ChatFooterLegend() {
  const theme = useMantineTheme();
  const primaryColor = theme.primaryColor;

  return (
    <Group gap="xs" align="center">
      <LegendChip
        primaryColor={primaryColor}
        label="Show chat"
        tip="Opens the streaming reply panel when it is hidden."
      >
        <RiChatUploadLine size={22} aria-hidden />
      </LegendChip>

      <LegendChip
        primaryColor={primaryColor}
        label="Hide chat"
        tip="Tucks the panel away so you can read the page underneath."
      >
        <RiChatDownloadLine size={22} aria-hidden />
      </LegendChip>

      <LegendChip
        primaryColor={primaryColor}
        label="New chat"
        tip="Clears the thread so you can start a fresh conversation."
      >
        <RiChatNewLine size={22} aria-hidden />
      </LegendChip>
    </Group>
  );
}
