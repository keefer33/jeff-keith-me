import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("shared/AppLayout.tsx", [
    route("/", "pages/Home.tsx"),
    route("resume", "pages/Resume.tsx"),
    route("projects/genny-bot", "pages/projects/GennyBot.tsx"),
    route("projects/sloot-ai", "pages/projects/SlootAi.tsx"),
  ]),
  route("api/chat", "api/chat.ts"),
] satisfies RouteConfig;
