import { DialogForm } from "@/components/dialog/DialogForm";
import { useUserForm } from "../hooks/useUserForm";
import type { UserFormValues } from "../types/user.types";
import { Pencil, UserPlus } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CardPage } from "@/components/cards/CardPage";
import { Button } from "@/components/ui/button";

type UserFormProps = {
  initialValues?: UserFormValues;
};

export function UserForm({ initialValues }: UserFormProps) {
  const { form, onSubmit, isPending, errorMessage } =
    useUserForm(initialValues);

  const isEditing = !!initialValues;

  return (
    <>
      <DialogForm
        title={isEditing ? "Editar usuário" : "Criar usuário"}
        icon={isEditing ? Pencil : UserPlus}
        width="max-w-3xl!"
        variant={isEditing ? "outline" : "default"}
        children={
          <>
            <CardPage
              title={isEditing ? "Editar Empresa" : "Cadastrar Empresa"}
              description={
                isEditing
                  ? "Preencha os campos abaixo para editar a empresa."
                  : "Preencha os campos abaixo para cadastrar uma nova empresa."
              }
              children={
                <>
                  <form id="form-company" onSubmit={onSubmit} noValidate>
                    <FieldGroup>
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                        <Controller
                          name="username"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-user-nome">
                                Nome do usuário
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-user-nome"
                                aria-invalid={fieldState.invalid}
                                placeholder="Nome do usuário"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="email"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-user-email">
                                E-mail de acesso
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-user-email"
                                aria-invalid={fieldState.invalid}
                                placeholder="example@example.com"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="senha"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-user-senha">
                                Senha do usuário
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-user-senha"
                                type="password"
                                aria-invalid={fieldState.invalid}
                                placeholder="senha do usuário"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="status"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">
                                Status
                              </FieldLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="inativo">
                                    Inativo
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </FieldGroup>
                  </form>
                </>
              }
              footer={
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="reset"
                    form="form-company"
                    className="mr-2 hover:bg-destructive/10 hover:text-destructive"
                    disabled={isPending}
                    onClick={() => form.reset()}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    form="form-company"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    className="bg-primary/80 text-white hover:bg-primary/90 hover:text-primary-foreground"
                  >
                    {isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              }
            />
            {errorMessage && (
              <p className="text-sm text-destructive mt-2">{errorMessage}</p>
            )}
          </>
        }
      />
    </>
  );
}
