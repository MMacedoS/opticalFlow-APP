import { Card, CardContent } from "@/components/ui/card";

export function AppFooter() {
  return (
    <footer>
      <Card className="rounded-4xl border border-border/70 bg-card/90 shadow-sm backdrop-blur">
        <CardContent className="flex flex-col gap-1 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            Optica Flow • Experiência administrativa padronizada
          </p>
          <p className="text-xs text-muted-foreground">v1.0.0</p>
        </CardContent>
      </Card>
    </footer>
  );
}
