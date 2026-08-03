import { z } from "zod";
import type { ClientInsert } from "@/hooks/useClients";

export const clientFormSchema = z
  .object({
    kind: z.enum(["CNPJ", "CPF"]),
    trade_name: z.string().trim().min(2, "Informe o nome fantasia."),
    legal_name: z.string().trim().min(2, "Informe a razão social."),
    document: z
      .string()
      .trim()
      .min(1, "Informe o CPF/CNPJ.")
      .transform((v) => v.replace(/\D/g, "")),
    address_street: z.string().trim().optional().or(z.literal("")),
    address_number: z.string().trim().optional().or(z.literal("")),
    address_complement: z.string().trim().optional().or(z.literal("")),
    address_neighborhood: z.string().trim().optional().or(z.literal("")),
    address_city: z.string().trim().optional().or(z.literal("")),
    address_state: z.string().trim().max(2, "Use a sigla do estado (ex.: SP).").optional().or(z.literal("")),
    address_zip: z.string().trim().optional().or(z.literal("")),
    contact_name: z.string().trim().min(2, "Informe o nome do responsável."),
    contact_role: z.string().trim().optional().or(z.literal("")),
    contact_document: z.string().trim().optional().or(z.literal("")),
    email: z.string().trim().email("E-mail inválido.").optional().or(z.literal("")),
    phone: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => (data.kind === "CNPJ" ? data.document.length === 14 : data.document.length === 11), {
    message: "CNPJ deve ter 14 dígitos e CPF 11 dígitos.",
    path: ["document"],
  });

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const clientFormDefaults: Partial<ClientFormValues> = {
  kind: "CNPJ",
  trade_name: "",
  legal_name: "",
  document: "",
  address_street: "",
  address_number: "",
  address_complement: "",
  address_neighborhood: "",
  address_city: "",
  address_state: "",
  address_zip: "",
  contact_name: "",
  contact_role: "",
  contact_document: "",
  email: "",
  phone: "",
  notes: "",
};

/** Converte o formulário (strings vazias) para o formato do banco (null) antes de salvar. */
export function clientFormToInsert(values: ClientFormValues, isDemo = false): ClientInsert {
  return {
    kind: values.kind,
    trade_name: values.trade_name,
    legal_name: values.legal_name,
    document: values.document,
    address_street: values.address_street || null,
    address_number: values.address_number || null,
    address_complement: values.address_complement || null,
    address_neighborhood: values.address_neighborhood || null,
    address_city: values.address_city || null,
    address_state: values.address_state || null,
    address_zip: values.address_zip || null,
    contact_name: values.contact_name,
    contact_role: values.contact_role || null,
    contact_document: values.contact_document || null,
    email: values.email || null,
    phone: values.phone || null,
    notes: values.notes || null,
    is_demo: isDemo,
  };
}
