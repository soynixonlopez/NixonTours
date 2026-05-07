const DEFAULT_PHONE = "50768252312";

export function normalizeWhatsAppDigits(input: string): string {
  return input.replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = normalizeWhatsAppDigits(phone) || DEFAULT_PHONE;
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${digits}?text=${text}`;
}

export function defaultWhatsAppPrefill(): string {
  return buildWhatsAppUrl(
    DEFAULT_PHONE,
    "Hola Nixon Tours, quiero cotizar un paquete a Guna Yala."
  );
}

export function formatPricePAB(price: number): string {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function packageTypeLabel(type: string): string {
  switch (type) {
    case "estadia":
      return "Estadía";
    case "pasadia":
      return "Pasadía";
    case "camping":
      return "Camping";
    default:
      return type;
  }
}
