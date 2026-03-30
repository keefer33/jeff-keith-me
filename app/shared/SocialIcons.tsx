import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { RiGithubLine, RiLinkedinBoxLine } from "@remixicon/react";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jeff-keith-8b263967/",
    icon: RiLinkedinBoxLine,
  },
  {
    label: "GitHub",
    href: "https://github.com/keefer33",
    icon: RiGithubLine,
  },
];

export default function SocialIcons() {
  return (
    <Group gap="xs">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <Tooltip key={label} label={label}>
          <ActionIcon
            component="a"
            href={href}
            target="_blank"
            rel="noreferrer"
            variant="transparent"
            aria-label={label}
            size="md"
          >
            <Icon />
          </ActionIcon>
        </Tooltip>
      ))}
    </Group>
  );
}
