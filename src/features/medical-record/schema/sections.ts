import z from "zod/v4";

import type {
  ListSectionKey,
  SectionPayload,
  SingleSectionKey,
} from "../types/medicalRecord.type";

export type FieldType = "text" | "textarea" | "number" | "datetime" | "date";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
}

/** Medidas por olho: gera os campos od_<coluna> e oe_<coluna>. */
export interface EyeGridConfig {
  columns: { suffix: string; label: string; placeholder?: string }[];
  type?: FieldType;
}

export interface SingleSectionConfig {
  key: SingleSectionKey;
  title: string;
  description: string;
  eyeGrid?: EyeGridConfig;
  fields: FieldConfig[];
}

export interface ListSectionConfig {
  key: ListSectionKey;
  title: string;
  description: string;
  itemTitle: string;
  fields: FieldConfig[];
  defaults?: Record<string, string>;
}

const OBSERVACOES: FieldConfig = {
  name: "observacoes",
  label: "Observações",
  type: "textarea",
};

export const SINGLE_SECTIONS: SingleSectionConfig[] = [
  {
    key: "anamnese",
    title: "Anamnese",
    description: "Histórico e condições relevantes do paciente",
    fields: [
      {
        name: "historico_pessoal",
        label: "Histórico pessoal",
        type: "textarea",
      },
      {
        name: "historico_familiar",
        label: "Histórico familiar",
        type: "textarea",
      },
      { name: "alergias", label: "Alergias", type: "textarea" },
      {
        name: "medicamentos_uso",
        label: "Medicamentos em uso",
        type: "textarea",
      },
      OBSERVACOES,
    ],
  },
  {
    key: "acuidade_visual",
    title: "Acuidade visual",
    description: "Tabela de Snellen (ex.: 20/20)",
    eyeGrid: {
      columns: [
        { suffix: "sem_correcao", label: "Sem correção", placeholder: "20/40" },
        { suffix: "com_correcao", label: "Com correção", placeholder: "20/20" },
      ],
    },
    fields: [OBSERVACOES],
  },
  {
    key: "refracao",
    title: "Refração",
    description: "Dioptrias por olho, distância pupilar e adição",
    eyeGrid: {
      columns: [
        { suffix: "esferico", label: "Esférico", placeholder: "-1.25" },
        { suffix: "cilindrico", label: "Cilíndrico", placeholder: "-0.50" },
        { suffix: "eixo", label: "Eixo", placeholder: "180" },
      ],
    },
    fields: [
      { name: "dp", label: "DP (mm)", placeholder: "62" },
      { name: "adicao", label: "Adição", placeholder: "+2.00" },
      OBSERVACOES,
    ],
  },
  {
    key: "ceratometria",
    title: "Ceratometria",
    description: "Curvatura da córnea",
    eyeGrid: {
      columns: [
        { suffix: "k1", label: "K1", placeholder: "43.00" },
        { suffix: "k2", label: "K2", placeholder: "44.25" },
      ],
    },
    fields: [OBSERVACOES],
  },
  {
    key: "biomicroscopia",
    title: "Biomicroscopia",
    description: "Exame com lâmpada de fenda",
    fields: [{ name: "descricao", label: "Descrição", type: "textarea" }],
  },
  {
    key: "fundoscopia",
    title: "Fundoscopia",
    description: "Exame de fundo de olho",
    fields: [{ name: "descricao", label: "Descrição", type: "textarea" }],
  },
  {
    key: "pressao_intraocular",
    title: "Pressão intraocular",
    description: "Tonometria em mmHg",
    eyeGrid: {
      type: "number",
      columns: [{ suffix: "mmhg", label: "mmHg", placeholder: "15" }],
    },
    fields: [
      { name: "horario", label: "Horário", type: "datetime" },
      OBSERVACOES,
    ],
  },
];

export const LIST_SECTIONS: ListSectionConfig[] = [
  {
    key: "diagnosticos",
    title: "Diagnósticos",
    description: "Códigos CID do atendimento",
    itemTitle: "Diagnóstico",
    defaults: { versao: "CID-10" },
    fields: [
      { name: "codigo", label: "Código", placeholder: "H52.1", required: true },
      {
        name: "versao",
        label: "Versão",
        placeholder: "CID-10",
        required: true,
      },
      { name: "descricao", label: "Descrição", placeholder: "Miopia" },
    ],
  },
  {
    key: "exames_complementares",
    title: "Exames complementares",
    description: "Exames solicitados e resultados",
    itemTitle: "Exame",
    fields: [
      {
        name: "exame",
        label: "Exame",
        placeholder: "Topografia",
        required: true,
      },
      { name: "dataExame", label: "Data", type: "date" },
      { name: "resultado", label: "Resultado", type: "textarea" },
    ],
  },
  {
    key: "evolucoes_clinicas",
    title: "Evolução clínica",
    description: "Anotações de acompanhamento",
    itemTitle: "Evolução",
    fields: [
      {
        name: "descricao",
        label: "Descrição",
        type: "textarea",
        required: true,
      },
      { name: "dataEvolucao", label: "Data", type: "datetime" },
    ],
  },
];

export const EYES = [
  { prefix: "od", label: "OD (direito)" },
  { prefix: "oe", label: "OE (esquerdo)" },
] as const;

/** Lista plana de campos de uma secao, incluindo os da grade por olho. */
export function sectionFields(config: SingleSectionConfig): FieldConfig[] {
  const gridFields: FieldConfig[] = config.eyeGrid
    ? EYES.flatMap((eye) =>
        config.eyeGrid!.columns.map((column) => ({
          name: `${eye.prefix}_${column.suffix}`,
          label: `${eye.label} ${column.label}`,
          type: config.eyeGrid!.type,
        })),
      )
    : [];

  return [...gridFields, ...config.fields];
}

export type FormValues = Record<string, string>;

export function buildSchema(fields: FieldConfig[]) {
  const shape = Object.fromEntries(
    fields.map((field) => {
      let rule = z.string().trim();

      if (field.required) {
        rule = rule.min(1, `${field.label} é obrigatório`);
      }

      if (field.type === "number") {
        return [
          field.name,
          rule.refine(
            (value) =>
              value === "" || !Number.isNaN(Number(value.replace(",", "."))),
            `${field.label} deve ser um número`,
          ),
        ];
      }

      return [field.name, rule];
    }),
  );

  return z.object(shape);
}

/** Converte os valores do formulario no formato da API ("" vira null). */
export function toPayload(
  fields: FieldConfig[],
  values: FormValues,
): SectionPayload {
  return Object.fromEntries(
    fields.map((field) => {
      const value = values[field.name]?.trim() ?? "";

      if (value === "") return [field.name, null];
      if (field.type === "number")
        return [field.name, Number(value.replace(",", "."))];
      if (field.type === "datetime" || field.type === "date") {
        return [field.name, new Date(value).toISOString()];
      }

      return [field.name, value];
    }),
  );
}

/** Converte o registro salvo em valores do formulario. */
export function toFormValues(
  fields: FieldConfig[],
  record: Record<string, unknown> | null | undefined,
  defaults: Record<string, string> = {},
): FormValues {
  return Object.fromEntries(
    fields.map((field) => {
      const value = record?.[field.name];

      if (value === null || value === undefined) {
        return [field.name, defaults[field.name] ?? ""];
      }
      if (field.type === "datetime") {
        return [field.name, toLocalInput(String(value), 16)];
      }
      if (field.type === "date") {
        return [field.name, String(value).slice(0, 10)];
      }

      return [field.name, String(value)];
    }),
  );
}

function toLocalInput(iso: string, length: number): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, length);
}
