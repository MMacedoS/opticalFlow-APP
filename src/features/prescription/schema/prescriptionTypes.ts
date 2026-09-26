import type {
  EyeGridConfig,
  FieldConfig,
} from "@/features/medical-record/schema/sections";

import type { PrescriptionType } from "../types/prescription.type";

export interface PrescriptionTypeConfig {
  tipo: PrescriptionType;
  label: string;
  title: string;
  eyeGrid?: EyeGridConfig;
  fields: FieldConfig[];
}

const OBSERVACOES: FieldConfig = {
  name: "observacoes",
  label: "Observações",
  type: "textarea",
};

export const PRESCRIPTION_TYPES: PrescriptionTypeConfig[] = [
  {
    tipo: "oculos",
    label: "Óculos",
    title: "Receita de óculos",
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
    tipo: "lente_contato",
    label: "Lente de contato",
    title: "Receita de lente de contato",
    eyeGrid: {
      columns: [
        { suffix: "grau", label: "Grau", placeholder: "-2.00" },
        { suffix: "curva_base", label: "Curva base", placeholder: "8.6" },
        { suffix: "diametro", label: "Diâmetro", placeholder: "14.2" },
      ],
    },
    fields: [
      { name: "marca", label: "Marca", placeholder: "Acuvue Oasys" },
      { name: "material", label: "Material", placeholder: "Silicone hidrogel" },
      OBSERVACOES,
    ],
  },
  {
    tipo: "medicamento",
    label: "Medicamento",
    title: "Receita de medicamento",
    fields: [
      {
        name: "medicamento",
        label: "Medicamento",
        placeholder: "Colírio lubrificante",
        required: true,
      },
      { name: "dosagem", label: "Dosagem", placeholder: "5 mg/ml" },
      {
        name: "posologia",
        label: "Posologia",
        placeholder: "1 gota 3x ao dia",
      },
      { name: "duracao", label: "Duração", placeholder: "30 dias" },
      OBSERVACOES,
    ],
  },
];

export const PRESCRIPTION_TYPE_BY_KEY = Object.fromEntries(
  PRESCRIPTION_TYPES.map((config) => [config.tipo, config]),
) as Record<PrescriptionType, PrescriptionTypeConfig>;
