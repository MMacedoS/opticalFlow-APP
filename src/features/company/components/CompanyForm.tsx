import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Building2, Pencil } from "lucide-react";
import { useCompanyForm } from "../hooks/useCompanyForm";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { maskCNPJ } from "@/utils/masks";
import { AddressForm } from "../../../components/address/AddressForm";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "../../../components/contacts/ContactForm";
import type { Company } from "../types/company.types";
import { DialogForm } from "@/components/dialog/DialogForm";
import { CardPage } from "@/components/cards/CardPage";
import { DialogClose } from "@/components/ui/dialog";

type CompanyFormProps = {
  initialData?: Company;
};

export function CompanyForm({ initialData }: CompanyFormProps) {
  const { form, onSubmit, isPending, errorMessage } =
    useCompanyForm(initialData);

  const isEditing = !!initialData;

  const enderecos = form.watch("enderecos") || [];
  const contatos = form.watch("contatos") || [];

  return (
    <>
      <DialogForm
        title={isEditing ? "Editar" : "Cadastrar"}
        icon={isEditing ? Pencil : Building2}
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
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <Controller
                          name="nome"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-company-nome">
                                Nome da Empresa
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-company-nome"
                                aria-invalid={fieldState.invalid}
                                placeholder="nome da empresa"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="razao"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-company-razao">
                                Razão Social
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-company-razao"
                                aria-invalid={fieldState.invalid}
                                placeholder="Razão social da empresa"
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
                              <FieldLabel htmlFor="form-company-email">
                                E-mail
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-company-email"
                                aria-invalid={fieldState.invalid}
                                placeholder="Email da empresa"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        <Controller
                          name="cnpj"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-company-cnpj">
                                CNPJ
                              </FieldLabel>
                              <Input
                                {...field}
                                value={maskCNPJ(field.value || "")}
                                onChange={(e) =>
                                  field.onChange(maskCNPJ(e.target.value))
                                }
                                id="form-company-cnpj"
                                aria-invalid={fieldState.invalid}
                                placeholder="00.000.0000/0001-00"
                                autoComplete="off"
                                maxLength={18}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="registro_estadual"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-company-rg-estadual">
                                Registro Estadual
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-company-rg-estadual"
                                aria-invalid={fieldState.invalid}
                                placeholder="xxxxxxxxxxxx-xx"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="registro_municipal"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-company-rg-municipal">
                                Registro Municipal
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-company-rg-municipal"
                                aria-invalid={fieldState.invalid}
                                placeholder="xxxxxxxxxxx-xx"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="website"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-company-rg-website">
                                website
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-company-rg-website"
                                aria-invalid={fieldState.invalid}
                                placeholder="https://www.exemplo.com"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </FieldGroup>

                    <Separator className="my-4" />

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                      <AddressForm
                        className="mt-4"
                        data={enderecos}
                        // Atualiza o React Hook Form quando a lista mudar
                        onChange={(data) =>
                          form.setValue("enderecos", data, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <ContactForm
                        className="mt-4"
                        data={contatos}
                        // Atualiza o React Hook Form quando a lista mudar
                        onChange={(data) =>
                          form.setValue("contatos", data, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </form>
                </>
              }
              action={<></>}
              footer={
                <>
                  <DialogClose
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        type="reset"
                        form="form-company"
                        className="mr-2 hover:bg-destructive/10 hover:text-destructive"
                        disabled={isPending}
                        onClick={() => form.reset()}
                      >
                        Fechar
                      </Button>
                    }
                  />
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
