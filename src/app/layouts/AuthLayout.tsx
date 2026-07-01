import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,oklch(0.96_0.02_230)_0%,transparent_45%),radial-gradient(circle_at_80%_0%,oklch(0.95_0.03_30)_0%,transparent_40%),linear-gradient(160deg,oklch(0.99_0.01_250)_0%,oklch(0.98_0.01_40)_100%)] px-4 py-10 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <Outlet />
      </div>
    </main>
  );
}
