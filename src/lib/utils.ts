import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Remove acentos e caracteres não alfanuméricos — usado para sugerir o subdomínio do contrato. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
}

/** Slug kebab-case (com hífens) — usado para o `slug` de produtos/serviços, ex.: "base7-system-moda". */
export function toKebabSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
