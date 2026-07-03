import type { SubmitEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { LoginFormValues } from "../types/login.types";

interface LoginFormProps {
  values: LoginFormValues;
  errors: Partial<Record<keyof LoginFormValues, string | undefined>>;
  isPending: boolean;
  errorMessage?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  values,
  errors,
  isPending,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <Card className="w-full max-w-md rounded-4xl border border-border/70 bg-card/95 shadow-xl backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Acessar sistema
        </CardTitle>
        <CardDescription>
          Entre com suas credenciais para continuar no OpticaFlow.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="email"
            >
              E-mail
            </label>

            <Input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="voce@empresa.com"
              type="email"
              value={values.email}
              onChange={(event) => onEmailChange(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />

            {errors.email ? (
              <p className="text-xs text-destructive" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="senha"
            >
              Senha
            </label>

            <Input
              autoComplete="current-password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              type="password"
              value={values.senha}
              onChange={(event) => onPasswordChange(event.target.value)}
              aria-invalid={Boolean(errors.senha)}
            />

            {errors.senha ? (
              <p className="text-xs text-destructive" role="alert">
                {errors.senha}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <p
              className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <Button
            className="w-full"
            size="lg"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
