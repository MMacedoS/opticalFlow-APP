export const openWhatsApp = (phone: string, message?: string): void => {
  if (!phone) return;

  let cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 10 || cleanPhone.length === 11) {
    cleanPhone = `55${cleanPhone}`;
  }

  let url = `https://wa.me/${cleanPhone}`;

  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};
