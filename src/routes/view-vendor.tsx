import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/view-vendor")({
  component: () => <Outlet />,
});
