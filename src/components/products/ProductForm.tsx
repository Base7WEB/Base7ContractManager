import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICON_OPTIONS } from "@/lib/icons";
import type {
  ProductBackupPolicy,
  ProductLicense,
  ProductScope,
  ProductTechDocs,
  ProductWarranty,
} from "@/types/domain";
import type { ProductInsert } from "@/hooks/useProducts";

export interface ProductFormValues {
  slug: string;
  name: string;
  commercial_name: string;
  description: string;
  status: "active" | "inactive";
  default_version: string;
  icon: string;
  production_url: string;

  scope_modules: string;
  scope_integrations: string;
  scope_frontend_hosting: string;
  scope_backend: string;
  scope_isolation_note: string;
  scope_subdomain_pattern: string;

  license_type: ProductLicense["type"];
  license_transferability: ProductLicense["transferability"];
  license_term: ProductLicense["term"];
  license_source_code_included: boolean;
  license_ip_clause_text: string;

  warranty_days: string;
  warranty_covered: string;
  warranty_not_covered: string;
  warranty_notes: string;

  tech_frontend: string;
  tech_backend: string;
  tech_hosting: string;
  tech_additional_services: string;
  tech_architecture_text: string;
  tech_deploy_text: string;
  tech_security_bullets: string;

  backup_frequency: string;
  backup_retention: string;
  backup_storage_location: string;
  backup_restore_test_frequency: string;
  backup_responsibilities_text: string;
}

const linesToArray = (text: string) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const arrayToLines = (arr: string[] | undefined) => (arr ?? []).join("\n");

export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  slug: "",
  name: "",
  commercial_name: "",
  description: "",
  status: "active",
  default_version: "1.0.0",
  icon: "Boxes",
  production_url: "",

  scope_modules: "",
  scope_integrations: "",
  scope_frontend_hosting: "",
  scope_backend: "",
  scope_isolation_note: "",
  scope_subdomain_pattern: "{cliente}.base7web.com.br",

  license_type: "não exclusiva",
  license_transferability: "intransferível",
  license_term: "indeterminado",
  license_source_code_included: false,
  license_ip_clause_text:
    "A concessão da licença de uso não implica cessão ou transferência de propriedade intelectual, código-fonte, arquitetura, componentes, metodologias ou demais ativos tecnológicos pertencentes à Base7 Web, salvo disposição expressa em instrumento específico.",

  warranty_days: "30",
  warranty_covered: "",
  warranty_not_covered: "",
  warranty_notes: "",

  tech_frontend: "",
  tech_backend: "",
  tech_hosting: "",
  tech_additional_services: "",
  tech_architecture_text: "",
  tech_deploy_text: "",
  tech_security_bullets: "Secrets fora do repositório\nPrincípio do menor privilégio\nAcessos individualizados\nRotação de credenciais quando necessário",

  backup_frequency: "",
  backup_retention: "",
  backup_storage_location: "",
  backup_restore_test_frequency: "",
  backup_responsibilities_text: "",
};

export function productToFormValues(product: {
  slug: string;
  name: string;
  commercial_name: string | null;
  description: string | null;
  status: "active" | "inactive";
  default_version: string;
  icon: string | null;
  production_url: string | null;
  scope: ProductScope;
  license: ProductLicense;
  warranty: ProductWarranty;
  tech_docs: ProductTechDocs;
  backup_policy: ProductBackupPolicy;
}): ProductFormValues {
  return {
    slug: product.slug,
    name: product.name,
    commercial_name: product.commercial_name ?? "",
    description: product.description ?? "",
    status: product.status,
    default_version: product.default_version,
    icon: product.icon ?? "Boxes",
    production_url: product.production_url ?? "",

    scope_modules: arrayToLines(product.scope.modules),
    scope_integrations: arrayToLines(product.scope.integrations),
    scope_frontend_hosting: product.scope.infrastructure?.frontend_hosting ?? "",
    scope_backend: product.scope.infrastructure?.backend ?? "",
    scope_isolation_note: product.scope.infrastructure?.isolation_note ?? "",
    scope_subdomain_pattern: product.scope.default_subdomain_pattern ?? "",

    license_type: product.license.type,
    license_transferability: product.license.transferability,
    license_term: product.license.term,
    license_source_code_included: product.license.source_code_included,
    license_ip_clause_text: product.license.ip_clause_text,

    warranty_days: String(product.warranty.days),
    warranty_covered: arrayToLines(product.warranty.covered),
    warranty_not_covered: arrayToLines(product.warranty.not_covered),
    warranty_notes: product.warranty.notes ?? "",

    tech_frontend: product.tech_docs.frontend,
    tech_backend: product.tech_docs.backend,
    tech_hosting: product.tech_docs.hosting,
    tech_additional_services: product.tech_docs.additional_services,
    tech_architecture_text: product.tech_docs.architecture_text,
    tech_deploy_text: product.tech_docs.deploy_text,
    tech_security_bullets: arrayToLines(product.tech_docs.security_bullets),

    backup_frequency: product.backup_policy.frequency,
    backup_retention: product.backup_policy.retention,
    backup_storage_location: product.backup_policy.storage_location,
    backup_restore_test_frequency: product.backup_policy.restore_test_frequency,
    backup_responsibilities_text: product.backup_policy.responsibilities_text,
  };
}

export function productFormToInsert(values: ProductFormValues): ProductInsert {
  return {
    slug: values.slug,
    name: values.name,
    commercial_name: values.commercial_name || null,
    description: values.description || null,
    status: values.status,
    default_version: values.default_version,
    icon: values.icon || null,
    production_url: values.production_url || null,
    scope: {
      modules: linesToArray(values.scope_modules),
      integrations: linesToArray(values.scope_integrations),
      infrastructure: {
        frontend_hosting: values.scope_frontend_hosting,
        backend: values.scope_backend,
        isolation_note: values.scope_isolation_note,
      },
      default_subdomain_pattern: values.scope_subdomain_pattern,
    },
    license: {
      type: values.license_type,
      transferability: values.license_transferability,
      term: values.license_term,
      source_code_included: values.license_source_code_included,
      ip_clause_text: values.license_ip_clause_text,
    },
    warranty: {
      days: Number(values.warranty_days) || 0,
      covered: linesToArray(values.warranty_covered),
      not_covered: linesToArray(values.warranty_not_covered),
      notes: values.warranty_notes || undefined,
    },
    tech_docs: {
      frontend: values.tech_frontend,
      backend: values.tech_backend,
      hosting: values.tech_hosting,
      additional_services: values.tech_additional_services,
      architecture_text: values.tech_architecture_text,
      deploy_text: values.tech_deploy_text,
      security_bullets: linesToArray(values.tech_security_bullets),
    },
    backup_policy: {
      frequency: values.backup_frequency,
      retention: values.backup_retention,
      storage_location: values.backup_storage_location,
      restore_test_frequency: values.backup_restore_test_frequency,
      responsibilities_text: values.backup_responsibilities_text,
    },
  };
}

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ProductForm({ mode, defaultValues, onSubmit, isSubmitting }: ProductFormProps) {
  const form = useForm<ProductFormValues>({ defaultValues: defaultValues ?? PRODUCT_FORM_DEFAULTS });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <Tabs defaultValue="geral">
        <TabsList className="flex-wrap">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="escopo">Escopo</TabsTrigger>
          <TabsTrigger value="licenca">Licença</TabsTrigger>
          <TabsTrigger value="garantia">Garantia</TabsTrigger>
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome"><Input {...form.register("name")} /></Field>
            <Field label="Nome comercial"><Input {...form.register("commercial_name")} /></Field>
            <Field label="Slug" hint="Identificador único, ex.: base7-system-moda.">
              <Input {...form.register("slug")} disabled={mode === "edit"} placeholder="base7-system-moda" />
            </Field>
            <Field label="Versão padrão"><Input {...form.register("default_version")} /></Field>
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
            <Field label="URL de produção" hint="Deploy deste cliente instalado, se já existir.">
              <Input {...form.register("production_url")} placeholder="https://cliente.base7web.com.br" />
            </Field>
          </div>
          <Field label="Descrição"><Textarea rows={3} {...form.register("description")} /></Field>
        </TabsContent>

        <TabsContent value="escopo" className="space-y-4 pt-4">
          <Field label="Módulos e funcionalidades" hint="Um item por linha.">
            <Textarea rows={6} {...form.register("scope_modules")} />
          </Field>
          <Field label="Integrações" hint="Um item por linha.">
            <Textarea rows={3} {...form.register("scope_integrations")} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Hospedagem (frontend)"><Input {...form.register("scope_frontend_hosting")} /></Field>
            <Field label="Backend"><Input {...form.register("scope_backend")} /></Field>
          </div>
          <Field label="Observação de isolamento"><Input {...form.register("scope_isolation_note")} /></Field>
          <Field label="Padrão de subdomínio"><Input {...form.register("scope_subdomain_pattern")} /></Field>
        </TabsContent>

        <TabsContent value="licenca" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Tipo">
              <Controller
                control={form.control}
                name="license_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="não exclusiva">Não exclusiva</SelectItem>
                      <SelectItem value="exclusiva">Exclusiva</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Transferibilidade">
              <Controller
                control={form.control}
                name="license_transferability"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intransferível">Intransferível</SelectItem>
                      <SelectItem value="transferível">Transferível</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Prazo">
              <Controller
                control={form.control}
                name="license_term"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indeterminado">Indeterminado</SelectItem>
                      <SelectItem value="determinado">Determinado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Controller
              control={form.control}
              name="license_source_code_included"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Código-fonte incluso na licença</Label>
          </div>
          <Field label="Cláusula de propriedade intelectual">
            <Textarea rows={4} {...form.register("license_ip_clause_text")} />
          </Field>
        </TabsContent>

        <TabsContent value="garantia" className="space-y-4 pt-4">
          <Field label="Dias de garantia"><Input type="number" className="max-w-[140px]" {...form.register("warranty_days")} /></Field>
          <Field label="Cobre" hint="Um item por linha."><Textarea rows={3} {...form.register("warranty_covered")} /></Field>
          <Field label="Não cobre" hint="Um item por linha."><Textarea rows={3} {...form.register("warranty_not_covered")} /></Field>
          <Field label="Observações"><Textarea rows={2} {...form.register("warranty_notes")} /></Field>
        </TabsContent>

        <TabsContent value="stack" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Frontend"><Input {...form.register("tech_frontend")} /></Field>
            <Field label="Backend / Banco"><Input {...form.register("tech_backend")} /></Field>
            <Field label="Hospedagem"><Input {...form.register("tech_hosting")} /></Field>
            <Field label="Serviços adicionais"><Input {...form.register("tech_additional_services")} /></Field>
          </div>
          <Field label="Arquitetura"><Textarea rows={3} {...form.register("tech_architecture_text")} /></Field>
          <Field label="Deploy"><Textarea rows={2} {...form.register("tech_deploy_text")} /></Field>
          <Field label="Segurança" hint="Um item por linha."><Textarea rows={3} {...form.register("tech_security_bullets")} /></Field>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Frequência"><Input {...form.register("backup_frequency")} /></Field>
            <Field label="Retenção"><Input {...form.register("backup_retention")} /></Field>
            <Field label="Local de armazenamento"><Input {...form.register("backup_storage_location")} /></Field>
            <Field label="Frequência de teste de restauração"><Input {...form.register("backup_restore_test_frequency")} /></Field>
          </div>
          <Field label="Responsabilidades"><Textarea rows={3} {...form.register("backup_responsibilities_text")} /></Field>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {mode === "create" ? "Cadastrar sistema" : "Salvar alterações"}
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
