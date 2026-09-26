import { useEffect } from "react";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type ClinicalSummaryFormProps = {
  value: string | null;
  isPending: boolean;
  onSave: (value: string | null) => Promise<unknown>;
};

export function ClinicalSummaryForm({
  value,
  isPending,
  onSave,
}: ClinicalSummaryFormProps) {
  const form = useForm<{ resumo: string }>({
    defaultValues: { resumo: value ?? "" },
  });

  useEffect(() => {
    form.reset({ resumo: value ?? "" });
  }, [form, value]);

  const onSubmit = form.handleSubmit(async ({ resumo }) => {
    try {
      await onSave(resumo.trim() === "" ? null : resumo.trim());
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-semibold">Resumo clínico</h3>
        <p className="text-sm text-muted-foreground">
          Conclusão do atendimento e conduta
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor="resumo-clinico" className="sr-only">
          Resumo clínico
        </FieldLabel>
        <Textarea
          id="resumo-clinico"
          rows={8}
          placeholder="Conduta, orientações ao paciente, retorno..."
          {...form.register("resumo")}
        />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending}>
          <Save className="mr-2 size-4" />
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
