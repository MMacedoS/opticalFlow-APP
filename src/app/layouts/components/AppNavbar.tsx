import { NavLink } from "react-router-dom";

import { appNavigationItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  return (
    <nav aria-label="Navegação principal" className="overflow-x-auto">
      <div className="inline-flex min-w-full items-center gap-2 rounded-4xl border border-border/70 bg-card/85 p-2 shadow-sm backdrop-blur">
        {appNavigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "inline-flex h-9 items-center justify-center rounded-4xl px-4 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
