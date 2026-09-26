import { useMemo } from "react";

import { Link, useLocation } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/layouts/components/ui/breadcrumb";
import { SidebarTrigger } from "@/app/layouts/components/ui/sidebar";
import {
  appNavigationItems,
  type NavigationItem,
} from "@/constants/navigation";

function flattenNavigation(items: NavigationItem[]): [string, string][] {
  return items.flatMap((item) => [
    ...(item.href !== "#" ? [[item.href, item.label] as [string, string]] : []),
    ...flattenNavigation(item.children ?? []),
  ]);
}

/** Paginas com link no breadcrumb, com o nome usado no menu. */
const PAGE_LABELS = new Map(flattenNavigation(appNavigationItems));

/** Segmentos intermediarios que nao sao paginas proprias. */
const EXTRA_LABELS: Record<string, string> = {
  "/prontuarios/atendimento": "Atendimento",
  "/receitas": "Receitas",
};

/** Ids (cuid/uuid) nao aparecem no breadcrumb. */
const isIdSegment = (segment: string) =>
  segment.length >= 20 && /\d/.test(segment) && /^[a-z0-9-]+$/i.test(segment);

const humanize = (segment: string) => {
  const text = segment.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function AppHeader() {
  const { pathname } = useLocation();

  const breadcrumbItems = useMemo(() => {
    const segments = pathname
      .split("/")
      .filter((segment) => segment && !isIdSegment(segment));

    if (segments.length === 0) {
      return [{ label: "Dashboard", href: "/dashboard", isPage: true }];
    }

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label =
        PAGE_LABELS.get(href) ?? EXTRA_LABELS[href] ?? humanize(segment);

      return { label, href, isPage: PAGE_LABELS.has(href) };
    });
  }, [pathname]);

  return (
    <header>
      <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm backdrop-blur">
        <CardContent className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Optica Flow
              </p>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/dashboard" />}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                      <div key={item.href} className="contents">
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast || !item.isPage ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink render={<Link to={item.href} />}>
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
