import { fetchAddressByCep } from "@/utils/viacep";
import { useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { addressSchema } from "../schema/company.schema";
import type z4 from "zod/v4";

type AddressFormValues = z4.infer<typeof addressSchema>;

export const useAutoFillAddress = (
  cepValue: string,
  setValue: UseFormSetValue<AddressFormValues>,
) => {
  useEffect(() => {
    const handleCepFetch = async () => {
      if (!cepValue) return;

      const cleanCep = cepValue.replace(/\D/g, "");
      if (cleanCep.length !== 8) return;
      try {
        const data = await fetchAddressByCep(cepValue);

        if (data) {
          setValue("logradouro", data.logradouro, { shouldValidate: true });
          setValue("bairro", data.bairro, { shouldValidate: true });
          setValue("cidade", data.localidade, { shouldValidate: true });
          setValue("uf", data.uf, { shouldValidate: true });
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
      }
    };

    handleCepFetch();
  }, [cepValue, setValue]);
};
