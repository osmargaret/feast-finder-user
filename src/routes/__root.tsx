import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-4 pt-32">
        <div className="max-w-md text-center">
          <p className="text-7xl font-black text-primary">404</p>
          <h1 className="mt-3 text-2xl font-extrabold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/" className="btn-primary">Go home</Link>
            <Link to="/meals" className="btn-ghost">Browse meals</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MenuMenu — Marketplace for Food Vendors" },
      { name: "description", content: "Discover and order meals from local food vendors, all in one place." },
      { name: "author", content: "MenuMenu" },
      { property: "og:title", content: "MenuMenu — Marketplace for Food Vendors" },
      { property: "og:description", content: "Discover and order meals from local food vendors, all in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
