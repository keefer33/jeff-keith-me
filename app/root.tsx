import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { createThemeWithColor } from "./lib/theme";
import { MantineProvider } from "@mantine/core";
import useAppStore from "./lib/stores/appStore";
import { useEffect, useMemo } from "react";
import { loadThemeSettings, themeSettingsColorSchemeManager } from "./lib/themeUtils";
import type { Route } from "./+types/root";
import mantine from "@mantine/core/styles.css?url";
import app from "./app.css?url";
import { useClientMounted } from "./lib/hooks/useClientMounted";

function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeColor, setThemeColor } = useAppStore();
  const colorSchemeManager = useMemo(() => themeSettingsColorSchemeManager(), []);

  useEffect(() => {
    const { themeColor: savedColor } = loadThemeSettings();
    if (savedColor && savedColor !== themeColor) {
      setThemeColor(savedColor);
    }
  }, []);

  const dynamicTheme = createThemeWithColor(themeColor);

  return (
    <MantineProvider
      theme={dynamicTheme}
      defaultColorScheme="dark"
      colorSchemeManager={colorSchemeManager}
    >
      {children}
    </MantineProvider>
  );
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap",
  },
  {
    rel: "preconnect",
    href: "https://accounts.google.com/gsi/client",
  },
  { rel: "manifest", href: "/manifest.json" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const mounted = useClientMounted();
  const { setIsMobile } = useAppStore();
  // Detect mobile screen size and update store
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < 992;
      setIsMobile(isMobile);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="stylesheet" href={mantine} />
        <link rel="stylesheet" href={app} />
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body>
        <DynamicThemeProvider>{mounted ? children : null}</DynamicThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
