export function maskCNPJ(value?: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
}

export function maskCPF(value?: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .substring(0, 14);
}

export function maskCEP(value?: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  return digits.replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
}

export function maskPhone(value?: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
}
