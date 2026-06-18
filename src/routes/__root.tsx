import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  Navigate,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/app/layouts/AppShell";
import { PosShell } from "@/app/layouts/PosShell";
import { isPosPath } from "@/features/retrod-one/lib/access";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { applyTheme, readSavedTheme } from "@/app/theme/theme";
import FeatureDisabled from "@/components/FeatureDisabled";
import type { FeatureKey } from "@/types/entitlements";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-pressed"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-pressed"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Retrod PMS — Hospitality Operating System" },
      {
        name: "description",
        content:
          "Enterprise-grade Property Management System for luxury hotels and hospitality groups.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
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

function AuthGate() {
  const { isAuthenticated, featureEnabled } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Standalone routes render without the PMS shell
  if (pathname === "/login" || pathname === "/one") return <Outlet />;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const disabledFeature = getFeatureBlockedOnPath(pathname, featureEnabled);
  if (disabledFeature) {
    const Shell = isPosPath(pathname) ? PosShell : AppShell;
    return (
      <Shell>
        <FeatureDisabled title={disabledFeature.title} description={disabledFeature.description} />
      </Shell>
    );
  }

  if (isPosPath(pathname)) {
    return (
      <PosShell>
        <Outlet />
      </PosShell>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    applyTheme(readSavedTheme());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors />
        <AuthGate />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function getFeatureBlockedOnPath(
  pathname: string,
  featureEnabled: (feature: FeatureKey) => boolean,
): { title: string; description: string } | null {
  const checks: Array<{
    feature: FeatureKey;
    matches: (path: string) => boolean;
    title: string;
    description: string;
  }> = [
    {
      feature: "channelManager",
      matches: (path) => path === "/channel-manager" || path.startsWith("/channel-manager/"),
      title: "Channel Manager is not enabled",
      description:
        "This tenant setup does not include Channel Manager. Enable it in tenant features to use OTA connectivity screens.",
    },
    {
      feature: "websiteBuilder",
      matches: (path) => path === "/website-builder" || path.startsWith("/website-builder/"),
      title: "Website Builder is not enabled",
      description:
        "This tenant setup does not include Website Builder. Enable it in tenant features to manage website pages.",
    },
    {
      feature: "bookingEngine",
      matches: (path) => path === "/booking-engine" || path.startsWith("/booking-engine/"),
      title: "Booking Engine is not enabled",
      description:
        "This tenant setup does not include Booking Engine. Enable it in tenant features to manage direct booking experiences.",
    },
    {
      feature: "revenueAi",
      matches: (path) => path === "/revenue/ai-dashboard" || path === "/ai-insights",
      title: "AI Revenue features are not enabled",
      description:
        "This tenant setup does not include AI Revenue features. Enable it in tenant features to access AI demand and pricing insights.",
    },
    {
      feature: "masterData",
      matches: (path) => path === "/masters" || path.startsWith("/masters/"),
      title: "Master Data is not enabled",
      description:
        "This tenant setup does not include centralized Master Data Management. Enable it in tenant features to access this module.",
    },
  ];

  for (const check of checks) {
    if (check.matches(pathname) && !featureEnabled(check.feature)) {
      return { title: check.title, description: check.description };
    }
  }
  return null;
}
