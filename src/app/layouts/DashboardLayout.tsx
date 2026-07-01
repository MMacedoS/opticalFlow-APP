import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Outlet />
      </div>
    </main>
  );
}
