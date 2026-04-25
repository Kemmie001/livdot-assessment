import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { Toaster } from "@/views/shadcn/sonner";
import { CreateEventModal } from "@/views/event-list/components/CreateEventModal";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b bg-background/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link
          to="/events"
          className="font-bold text-lg tracking-tight text-blue-600 hover:text-blue-700 transition-colors"
        >
          LIV DOT
        </Link>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8 mt-12">
        <Outlet />
      </main>
      <CreateEventModal />
      <Toaster richColors position="bottom-right" />
    </div>
  ),
});
