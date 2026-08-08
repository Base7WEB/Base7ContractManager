import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICON_OPTIONS } from "@/lib/icons";
import { toKebabSlug } from "@/lib/utils";
import type { ServiceCategory, ServicePricePeriod } from "@/types/domain";
import { SERVICE_CATEGORY_LABEL } from "@/types/domain";
import type { ServiceInsert, ServiceRow } from "@/hooks/useServices";

export interface ServiceFormValues {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  category: ServiceCategory;
  status: "active" | "inactive";
  icon: string;

  price: string;
  price_prefix: string;
  price_period: ServicePricePeriod;
  delivery_text: string;

  items: string;

  scope_object_text: string;
  scope_deliverables: string;
  scope_exclusions: string;
  scope_client_responsibilities: string;

  payment_default_method: string;
  payment_term_days: string;
  payment_recurring: boolean;
  payment_renewal_text: string;

  warranty_days: string;
  warranty_notes: string;
}

const linesToArray = (text: string) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const arrayToLines = (arr: string[] | undefined) => (arr ?? []).join("\n");

export const SERVICE_FORM_DEFAULTS: ServiceFormValues = {
  slug: "",
  name: "",
  badge: "",
  tagline: "",
  category: "site",
  status: "active",
  icon: "Briefcase",

  price: "",
  price_prefix: "",
  price_period: "unico",
  delivery_text: "",

  items: "",

  scope_object_text: "",
  scope_deliverables: "",
  scope_exclusions: "",
  scope_client_responsibilities: "",

  payment_default_method: "50% de entrada + 50% na entrega",
  payment_term_days: "",
  payment_recurring: false,
  payment_renewal_text: "",

  warranty_days: "30",
  warranty_notes: "",
};

export function serviceToFormValues(service: ServiceRow): ServiceFormValues {
  return {
    slug: service.slug,
    name: service.name,
    badge: service.badge ?? "",
    tagline: service.tagline,
    category: service.category,
    status: service.status,
    icon: service.icon ?? "Briefcase",

    price: String(service.price),
    price_prefix: service.price_prefix,
    price_period: service.price_period,
    delivery_text: service.delivery_text,

    items: arrayToLines(service.items),

    scope_object_text: service.scope.object_text ?? "",
    scope_deliverables: arrayToLines(service.scope.deliverables),
    scope_exclusions: arrayToLines(service.scope.exclusions),
    scope_client_responsibilities: arrayToLines(service.scope.client_responsibilities),

    payment_default_method: service.payment_terms.default_method ?? "",
    payment_term_days: service.payment_terms.term_days != null ? String(service.payment_terms.term_days) : "",
    payment_recurring: service.payment_terms.recurring ?? false,
    payment_renewal_text: service.payment_terms.renewal_text ?? "",

    warranty_days: service.warranty.days != null ? String(service.warranty.days) : "",
    warranty_notes: service.warranty.notes ?? "",
  };
}

export function serviceFormToInsert(values: ServiceFormValues): ServiceInsert {
  return {
    slug: values.slug,
    name: values.name,
    badge: values.badge || null,
    tagline: values.tagline,
    category: values.category,
    status: values.status,
    icon: values.icon || null,

    price: Number(values.price) || 0,
    price_prefix: values.price_prefix,
    price_period: values.price_period,
    delivery_text: values.delivery_text,

    items: linesToArray(values.items),

    scope: {
      object_text: values.scope_object_text,
      deliverables: linesToArray(values.scope_deliverables),
      exclusions: linesToArray(values.scope_exclusions),
      client_responsibilities: linesToArray(values.scope_client_responsibilities),
    },
    payment_terms: {
      default_method: values.payment_default_method,
      term_days: values.payment_term_days ? Number(values.payment_term_days) : null,
      recurring: values.payment_recurring,
      renewal_text: values.payment_renewal_text || null,
    },
    warranty: {
      days: values.warranty_days ? Number(values.warranty_days) : null,
      notes: values.warranty_notes,
    },
  };
}

interface ServiceFormProps {
  mode: "create" | "edit";
  defaultValues?: ServiceFormValues;
  onSubmit: (values: ServiceFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ServiceForm({ mode, defaultValues, onSubmit, isSubmitting }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({ defaultValues: defaultValues ?? SERVICE_FORM_DEFAULTS });

  function handleNameBlur() {
    if (mode !== "create") return;
    const currentSlug = form.getValues("slug");
    if (currentSlug) return;
    form.setValue("slug", toKebabSlug(form.getValues("name")));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Identificação</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome"><Input {...form.register("name")} onBlur={handleNameBlur} placeholder="Essencial" /></Field>
          <Field label="Slug" hint="Identificador único.">
            <Input {...form.register("slug")} disabled={mode === "edit"} placeholder="essencial" />
          </Field>
          <Field label="Badge" hint="Ex.: 'Mais Popular'. Deixe em branco se não houver.">
            <Input {...form.register("badge")} placeholder="Mais Popular" />
          </Field>
          <Field label="Categoria">
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_CATEGORY_LABEL).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Status">
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Ícone">
            <Controller
              control={form.control}
              name="icon"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(({ value, label, Icon }) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Icon className="size-3.5" /> {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
        <Field label="Tagline" hint="Frase curta abaixo do nome no card.">
          <Input {...form.register("tagline")} placeholder="Para quem precisa de presença digital profissional" />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Preço e entrega</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Field label="Prefixo" hint="Ex.: 'A partir de'.">
            <Input {...form.register("price_prefix")} placeholder="A partir de" />
          </Field>
          <Field label="Preço (R$)">
            <Input inputMode="decimal" {...form.register("price")} placeholder="999.90" />
          </Field>
          <Field label="Período">
            <Controller
              control={form.control}
              name="price_period"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unico">Único</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Prazo de entrega (texto)">
            <Input {...form.register("delivery_text")} placeholder="Entrega em até 7 dias" />
          </Field>
        </div>
        <Field label="Itens exibidos no card" hint="Um item por linha.">
          <Textarea rows={6} {...form.register("items")} placeholder={"Site de até 5 páginas\nDesign responsivo\nSEO básico"} />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Escopo (usado no contrato)</h3>
        <Field label="Objeto" hint="Frase que descreve o que está sendo contratado.">
          <Textarea rows={2} {...form.register("scope_object_text")} />
        </Field>
        <Field label="Entregáveis" hint="Um item por linha.">
          <Textarea rows={4} {...form.register("scope_deliverables")} />
        </Field>
        <Field label="Exclusões" hint="Um item por linha. O que NÃO está incluso.">
          <Textarea rows={3} {...form.register("scope_exclusions")} />
        </Field>
        <Field label="Responsabilidades do cliente" hint="Um item por linha.">
          <Textarea rows={3} {...form.register("scope_client_responsibilities")} />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Pagamento e garantia (usado no contrato)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Forma de pagamento padrão"><Input {...form.register("payment_default_method")} /></Field>
          <Field label="Prazo (dias)" hint="Deixe em branco se não se aplicar.">
            <Input type="number" {...form.register("payment_term_days")} />
          </Field>
          <Field label="Dias de garantia/suporte" hint="Deixe em branco se não se aplicar.">
            <Input type="number" {...form.register("warranty_days")} />
          </Field>
          <Field label="Texto de renovação" hint="Só para serviços recorrentes (mensal).">
            <Input {...form.register("payment_renewal_text")} />
          </Field>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <Controller
            control={form.control}
            name="payment_recurring"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
          <Label>Serviço recorrente (cobrança mensal)</Label>
        </div>
        <Field label="Observações de garantia/suporte">
          <Textarea rows={2} {...form.register("warranty_notes")} />
        </Field>
      </section>

      <div className="flex justify-end border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {mode === "create" ? "Cadastrar serviço" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
