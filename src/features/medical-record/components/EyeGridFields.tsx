import type { Control } from "react-hook-form";

import { EYES, type EyeGridConfig, type FormValues } from "../schema/sections";
import { SectionField } from "./SectionField";

type EyeGridFieldsProps = {
  grid: EyeGridConfig;
  control: Control<FormValues>;
  idPrefix: string;
};

/** Tabela OD/OE com um campo por coluna (ex.: od_esferico, oe_esferico). */
export function EyeGridFields({ grid, control, idPrefix }: EyeGridFieldsProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="p-2 text-left font-medium">Olho</th>
            {grid.columns.map((column) => (
              <th key={column.suffix} className="p-2 text-left font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EYES.map((eye) => (
            <tr key={eye.prefix} className="border-t">
              <td className="p-2 font-medium whitespace-nowrap">{eye.label}</td>
              {grid.columns.map((column) => (
                <td key={column.suffix} className="p-2">
                  <SectionField
                    field={{
                      name: `${eye.prefix}_${column.suffix}`,
                      label: `${eye.label} ${column.label}`,
                      type: grid.type,
                      placeholder: column.placeholder,
                    }}
                    control={control}
                    idPrefix={idPrefix}
                    hideLabel
                    className="min-w-24"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
