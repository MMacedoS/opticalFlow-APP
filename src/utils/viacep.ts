export const fetchAddressByCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    return data.erro ? null : data;
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error);
    return null;
  }
};
