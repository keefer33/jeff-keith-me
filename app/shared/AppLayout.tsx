import {
  ActionIcon,
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Avatar,
  Burger,
  Group,
  NavLink as MantineNavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  RiCloseLine,
  RiFilePdfLine,
  RiHome4Line,
  RiIdCardLine,
  RiRobot2Line,
  RiSparkling2Line,
} from "@remixicon/react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import useChatStore from "~/lib/stores/chatStore";
import ChatBot from "./ChatBot";
import ChatMessages from "./ChatMessages";
import SocialIcons from "./SocialIcons";
import ThemeToggle from "./ThemeToggle";
import ColorPicker from "./ColorPicker";
import { useClientMounted } from "~/lib/hooks/useClientMounted";
import { useTheme } from "~/lib/hooks/useTheme";

const navIconProps = { size: 18 } as const;

/** Global `a[href]:hover` underline would otherwise show on NavLink roots. */
const navbarNavLinkStyles = {
  root: {
    textDecoration: "none",
    "&:hover": { textDecoration: "none" },
  },
  label: {
    textDecoration: "none",
  },
} as const;

export default function AppLayout() {
  const mounted = useClientMounted();
  const { colorScheme } = useTheme();
  const location = useLocation();
  const [mobileNavOpened, setMobileNavOpened] = useState(false);
  const { isMessagesVisible, hideMessages } = useChatStore();
  const handleNavLinkClick = () => {
    hideMessages();
    setMobileNavOpened(false);
  };
  return (
    <AppShell
      layout="alt"
      padding="0"
      withBorder={false}
      header={{ height: 64, offset: true }}
      footer={{ height: 130, offset: true }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { desktop: false, mobile: !mobileNavOpened },
      }}
    >
      <AppShellHeader>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={mobileNavOpened}
              onClick={() => setMobileNavOpened((opened) => !opened)}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Title order={4} hiddenFrom="sm">
              Jeff Keith
            </Title>
          </Group>
          <Group gap={1}>
            <SocialIcons />
            <ThemeToggle />
            <ColorPicker />
          </Group>
        </Group>
      </AppShellHeader>

      <AppShellNavbar
        p="md"
        bg={!mounted ? "gray.9" : colorScheme === "dark" ? "gray.9" : "gray.0"}
      >
        <Group justify="flex-end" hiddenFrom="sm" mb="sm">
          <ActionIcon
            variant="subtle"
            size="md"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpened(false)}
          >
            <RiCloseLine size={18} />
          </ActionIcon>
        </Group>

        <Stack align="center" justify="center" gap="xs">
          <Avatar
            src="https://aifile.link/7k8Tsl.jpg"
            color="cyan"
            size="120px"
            variant="outline"
          />
          <Title order={1}>Jeff Keith</Title>
          <Stack gap="0">
            <Text size="xs" c="dimmed">
              Senior Full Stack Engineer
            </Text>
            <Text size="xs" c="dimmed">
              Engineering Manager
            </Text>
          </Stack>
          <SocialIcons />
        </Stack>
        <Stack gap={4}>
          <Text size="xs" c="dimmed">
            Navigation
          </Text>

          <MantineNavLink
            component={Link}
            to="/"
            label="Home"
            leftSection={<RiHome4Line {...navIconProps} />}
            variant="light"
            active={location.pathname === "/"}
            onClick={handleNavLinkClick}
            w="100%"
            styles={navbarNavLinkStyles}
          />

          <MantineNavLink
            component={Link}
            to="/resume"
            label="Resume"
            leftSection={<RiIdCardLine {...navIconProps} />}
            variant="subtle"
            active={location.pathname === "/resume"}
            onClick={handleNavLinkClick}
            w="100%"
            styles={navbarNavLinkStyles}
          />

          <MantineNavLink
            component="a"
            href="/Jeff_Keith_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            label="Resume (PDF)"
            leftSection={<RiFilePdfLine {...navIconProps} />}
            variant="subtle"
            w="100%"
            styles={navbarNavLinkStyles}
          />

          <Text size="xs" c="dimmed" mt="md">
            Recent projects
          </Text>

          <MantineNavLink
            component={Link}
            to="/projects/genny-bot"
            label="Genny.bot"
            leftSection={<RiRobot2Line {...navIconProps} />}
            variant="subtle"
            active={location.pathname === "/projects/genny-bot"}
            onClick={handleNavLinkClick}
            w="100%"
            styles={navbarNavLinkStyles}
          />

          <MantineNavLink
            component={Link}
            to="/projects/sloot-ai"
            label="Sloot.ai"
            leftSection={<RiSparkling2Line {...navIconProps} />}
            variant="subtle"
            active={location.pathname === "/projects/sloot-ai"}
            onClick={handleNavLinkClick}
            w="100%"
            styles={navbarNavLinkStyles}
          />
        </Stack>
      </AppShellNavbar>

      <AppShellMain>{isMessagesVisible ? <ChatMessages /> : <Outlet />}</AppShellMain>

      <AppShellFooter>
        <ChatBot />
      </AppShellFooter>
    </AppShell>
  );
}
