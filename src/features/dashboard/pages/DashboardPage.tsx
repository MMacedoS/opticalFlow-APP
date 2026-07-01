import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";

export function DashboardPage() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <Card className="rounded-4xl border border-border/70 bg-card/95 shadow-lg">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Área principal após autenticação.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          O login foi concluído com sucesso e o usuário já está na área privada.
        </p>
        <Button variant="outline" onClick={clearSession}>
          Sair
        </Button>
      </CardContent>
    </Card>
  );
}
