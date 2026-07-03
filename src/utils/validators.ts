export function isValidCNPJ(value: string): boolean {
  const cnpj = value.replace(/\D/g, "");

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const calc = (slice: string, factor: number) => {
    let sum = 0;
    let weight = factor;
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const digit1 = calc(cnpj.substring(0, 12), 5);
  const digit2 = calc(cnpj.substring(0, 13), 6);

  return digit1 === parseInt(cnpj[12]) && digit2 === parseInt(cnpj[13]);
}
