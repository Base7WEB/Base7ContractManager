import type { ClientKind } from "../types/domain";

export function formatDocument(document: string, kind: ClientKind): string {
  const digits = document.replace(/\D/g, "");
  if (kind === "CNPJ" && digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  if (kind === "CPF" && digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return document;
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function addDaysISO(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatAddress(parts: {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}): string {
  const line1 = [parts.street, parts.number].filter(Boolean).join(", ");
  const line2 = [parts.complement, parts.neighborhood].filter(Boolean).join(", ");
  const line3 = [parts.city, parts.state].filter(Boolean).join(" — ");
  const zip = parts.zip ? `CEP ${parts.zip.replace(/(\d{5})(\d{3})/, "$1-$2")}` : "";
  return [line1, line2, line3, zip].filter(Boolean).join(", ");
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
