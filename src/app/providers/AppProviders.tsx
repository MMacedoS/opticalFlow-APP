import type { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/app/layouts/components/ui/tooltip";
import { queryClient } from "@/utils/queryClient";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}
