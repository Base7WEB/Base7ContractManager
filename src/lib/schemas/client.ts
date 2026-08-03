import { z } from "zod";

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
