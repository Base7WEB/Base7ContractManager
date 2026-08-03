import type { Database } from "../types/db";
import type { ClientKind, ContractStatus } from "../types/domain";
import { addDaysISO, formatAddress, formatCurrencyBRL, formatDateBR, formatDocument } from "./format";

type ContractRow = Database["public"]["Tables"]["contracts"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type SnapshotRow = Database["public"]["Tables"]["contract_snapshots"]["Row"];

/**
 * Única fonte de verdade que alimenta todos os templates de documento. Função pura — nenhum
 * texto contratual é gerado dinamicamente por IA, apenas variáveis substituídas em templates
 * fixos. Sempre lê do snapshot congelado (nunca de `products`/`company_settings` ao vivo), para
 * que editar um produto no futuro nunca altere um contrato já emitido.
 */
export interface DocumentContext {
  company: SnapshotRow["company_snapshot"];
  product: SnapshotRow["product_snapshot"];
  client: {
    trade_name: string;
    legal_name: string;
    kind: ClientKind;
    document_formatted: string;
    address_formatted: string;
    contact_name: string;
    contact_role: string | null;
    email: string | null;
    phone: string | null;
  };
  contract: {
    number: string;
    status: ContractStatus;
    value_formatted: string;
    payment_method: string;
    term_days: number;
    start_date_formatted: string;
    delivery_date_formatted: string;
    warranty_end_date_formatted: string;
    system_version: string;
    subdomain: string;
    system_name: string;
  };
  care: {
    monthly_price_formatted: string;
    start_date_formatted: string;
    due_day: number;
  } | null;
  generated_at_formatted: string;
}

export function buildDocumentContext(params: {
  contract: ContractRow;
  client: ClientRow;
  snapshot: SnapshotRow;
}): DocumentContext {
  const { contract, client, snapshot } = params;
  const { commercial, care } = contract;
  const product = snapshot.product_snapshot;

  const deliveryDate = commercial.delivery_date;
  const warrantyDays = product.warranty.days ?? 30;

  return {
    company: snapshot.company_snapshot,
    product,
    client: {
      trade_name: client.trade_name,
      legal_name: client.legal_name,
      kind: client.kind,
      document_formatted: formatDocument(client.document, client.kind),
      address_formatted: formatAddress({
        street: client.address_street,
        number: client.address_number,
        complement: client.address_complement,
        neighborhood: client.address_neighborhood,
        city: client.address_city,
        state: client.address_state,
        zip: client.address_zip,
      }),
      contact_name: client.contact_name,
      contact_role: client.contact_role,
      email: client.email,
      phone: client.phone,
    },
    contract: {
      number: contract.number,
      status: contract.status,
      value_formatted: formatCurrencyBRL(commercial.value),
      payment_method: commercial.payment_method,
      term_days: commercial.term_days,
      start_date_formatted: formatDateBR(commercial.start_date),
      delivery_date_formatted: formatDateBR(deliveryDate),
      warranty_end_date_formatted: formatDateBR(addDaysISO(deliveryDate, warrantyDays)),
      system_version: commercial.system_version,
      subdomain: commercial.subdomain,
      system_name: `${product.name} — ${client.trade_name}`,
    },
    care: care?.active
      ? {
          monthly_price_formatted: formatCurrencyBRL(care.monthly_price),
          start_date_formatted: formatDateBR(care.start_date),
          due_day: care.due_day,
        }
      : null,
    generated_at_formatted: formatDateBR(new Date().toISOString().slice(0, 10)),
  };
}
