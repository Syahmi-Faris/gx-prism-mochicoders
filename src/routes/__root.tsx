import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { PhoneShell } from "../components/PhoneShell";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-prism">404</h1>
        <p className="mt-3 text-muted-foreground">This screen doesn't exist.</p>
        <Link
          to="/"
          className="inline-block mt-6 rounded-full gradient-prism text-primary-foreground px-5 py-2 text-sm font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full gradient-prism text-primary-foreground px-5 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GX Prism — Behavioural Financial Resilience" },
      {
        name: "description",
        content:
          "AI-powered financial resilience for Malaysian youth. Capture spending effortlessly, get behavioural insights, intercept impulses, and rebuild savings.",
      },
      { property: "og:title", content: "GX Prism — Behavioural Financial Resilience" },
      { name: "twitter:title", content: "GX Prism — Behavioural Financial Resilience" },
      {
        property: "og:description",
        content:
          "AI-powered financial resilience for Malaysian youth. Capture spending effortlessly, get behavioural insights, intercept impulses, and rebuild savings.",
      },
      {
        name: "twitter:description",
        content:
          "AI-powered financial resilience for Malaysian youth. Capture spending effortlessly, get behavioural insights, intercept impulses, and rebuild savings.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f4fc55f7-51a6-49ac-b06f-c5918ba5e970/id-preview-2f7a6e99--66748449-ce85-4e2f-b923-dbeb91887d54.lovable.app-1778346363996.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f4fc55f7-51a6-49ac-b06f-c5918ba5e970/id-preview-2f7a6e99--66748449-ce85-4e2f-b923-dbeb91887d54.lovable.app-1778346363996.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <PhoneShell>
        <Outlet />
      </PhoneShell>
      <Toaster />
    </QueryClientProvider>
  );
}
