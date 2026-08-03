import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, FileText, Heart, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ClientPicker } from "@/components/clients/ClientPicker";
import { ProductPicker } from "@/components/products/ProductPicker";
import type { ClientRow } from "@/hooks/useClients";
import type { ProductRow } from "@/hooks/useProducts";
import { useCreateContractMutation } from "@/hooks/useContracts";
import { useCareSettingsQuery } from "@/hooks/useCareSettings";
import { generateDocument } from "@/lib/documents";
import { slugify, cn } from "@/lib/utils";
import type { ProductScope } from "@/types/domain";

const STEPS = ["Cliente", "Sistema", "Comercial", "Revisão"] as const;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso: string, days: number) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

interface CommercialState {
  value: string;
  payment_method: string;
  term_days: string;
  start_date: string;
  delivery_date: string;
  system_version: string;
  subdomain: string;
}

interface CareState {
  active: boolean;
  monthly_price: string;
  start_date: string;
  due_day: string;
}

export default function ContratoWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<ClientRow | null>(null);
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: careSettings } = useCareSettingsQuery();
  const createContract = useCreateContractMutation();

  const [commercial, setCommercial] = useState<CommercialState>({
    value: "",
    payment_method: "À vista",
    term_days: "20",
    start_date: todayISO(),
    delivery_date: addDaysISO(todayISO(), 20),
    system_version: "",
    subdomain: "",
  });

  const [care, setCare] = useState<CareState>({
    active: true,
    monthly_price: "",
    start_date: "",
    due_day: "10",
  });

  useEffect(() => {
    if (!careSettings) return;
    setCare((prev) => ({
      ...prev,
      monthly_price: prev.monthly_price || careSettings.monthly_price.toFixed(2),
      start_date: prev.start_date || commercial.delivery_date,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careSettings]);

  function updateCommercial(patch: Partial<CommercialState>) {
    setCommercial((prev) => {
      const next = { ...prev, ...patch };
      if (patch.start_date !== undefined || patch.term_days !== undefined) {
        const days = Number(next.term_days) || 0;
        next.delivery_date = addDaysISO(next.start_date, days);
      }
      return next;
    });
  }

  function handleSelectClient(selected: ClientRow) {
    setClient(selected);
  }

  function handleSelectProduct(selected: ProductRow) {
    setProduct(selected);
    const scope = selected.scope as ProductScope;
    const pattern = scope.default_subdomain_pattern || "{cliente}.base7web.com.br";
    const suggestedSubdomain = client ? pattern.replace("{cliente}", slugify(client.trade_name)) : "";
    setCommercial((prev) => ({
      ...prev,
      system_version: selected.default_version,
      subdomain: prev.subdomain || suggestedSubdomain,
    }));
  }

  function goToStep(next: number) {
    if (next === 2 && !client) {
      toast.error("Selecione um cliente para continuar.");
      return;
    }
    if (next === 3 && !product) {
      toast.error("Selecione um sistema para continuar.");
      return;
    }
    if (next === 4) {
      if (!commercial.value || Number(commercial.value) <= 0) {
        toast.error("Informe o valor do contrato.");
        return;
      }
      if (care.active && careSettings && !care.monthly_price) {
        setCare((prev) => ({
          ...prev,
          monthly_price: prev.monthly_price || careSettings.monthly_price.toFixed(2),
          start_date: prev.start_date || commercial.delivery_date,
        }));
      }
    }
    setStep(next);
  }

  async function handleGenerate() {
    if (!client || !product) return;
    setSubmitting(true);
    try {
      const contract = await createContract.mutateAsync({
        client_id: client.id,
        product_id: product.id,
        status: "rascunho",
        is_demo: false,
        commercial: {
          value: Number(commercial.value),
          payment_method: commercial.payment_method,
          term_days: Number(commercial.term_days) || 0,
          start_date: commercial.start_date,
          delivery_date: commercial.delivery_date,
          system_version: commercial.system_version,
          subdomain: commercial.subdomain,
        },
        care: care.active
          ? {
              active: true,
              monthly_price: Number(care.monthly_price) || careSettings?.monthly_price || 0,
              start_date: care.start_date || commercial.delivery_date,
              due_day: Number(care.due_day) || 10,
            }
          : null,
      });

      try {
        await generateDocument(contract.id, "pacote_completo");
        toast.success("Contrato criado e documentação gerada.");
      } catch (genErr) {
        toast.error(
          `Contrato criado, mas a geração do PDF falhou (${genErr instanceof Error ? genErr.message : "erro desconhecido"}). Tente gerar novamente na página do contrato.`,
        );
      }

      navigate(`/contratos/${contract.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao criar o contrato.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Novo contrato" description="Cliente → Sistema → Comercial → Revisão." />

      <div className="mx-auto max-w-3xl p-6 md:p-8">
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    active && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary bg-primary/10 text-primary",
                    !active && !done && "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : n}
                </div>
                <span className={cn("text-sm", active ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
                {n < STEPS.length && <div className="mx-2 h-px flex-1 bg-border" />}
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className="space-y-6">
            <ClientPicker value={client} onChange={handleSelectClient} />
            <div className="flex justify-end">
              <Button onClick={() => goToStep(2)}>
                Continuar
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <ProductPicker value={product} onChange={handleSelectProduct} />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 size-4" />
                Voltar
              </Button>
              <Button onClick={() => goToStep(3)}>
                Continuar
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Valor do projeto (R$)</Label>
                <Input
                  inputMode="decimal"
                  value={commercial.value}
                  onChange={(e) => updateCommercial({ value: e.target.value })}
                  placeholder="4500.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Forma de pagamento</Label>
                <Input
                  value={commercial.payment_method}
                  onChange={(e) => updateCommercial({ payment_method: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Prazo (dias)</Label>
                <Input
                  type="number"
                  value={commercial.term_days}
                  onChange={(e) => updateCommercial({ term_days: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Versão do sistema</Label>
                <Input
                  value={commercial.system_version}
                  onChange={(e) => updateCommercial({ system_version: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de início</Label>
                <Input
                  type="date"
                  value={commercial.start_date}
                  onChange={(e) => updateCommercial({ start_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de entrega</Label>
                <Input
                  type="date"
                  value={commercial.delivery_date}
                  onChange={(e) => updateCommercial({ delivery_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Domínio / subdomínio</Label>
                <Input
                  value={commercial.subdomain}
                  onChange={(e) => updateCommercial({ subdomain: e.target.value })}
                />
              </div>
            </div>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="size-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">BASE7 CARE</p>
                      <p className="text-xs text-muted-foreground">
                        {careSettings ? `R$ ${careSettings.monthly_price.toFixed(2)}/mês` : "Carregando..."}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={care.active}
                    onCheckedChange={(checked) =>
                      setCare((prev) => ({
                        ...prev,
                        active: checked,
                        monthly_price: prev.monthly_price || careSettings?.monthly_price.toFixed(2) || "",
                        start_date: prev.start_date || commercial.delivery_date,
                      }))
                    }
                  />
                </div>
                {care.active && (
                  <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>Valor mensal (R$)</Label>
                      <Input
                        inputMode="decimal"
                        value={care.monthly_price}
                        onChange={(e) => setCare((prev) => ({ ...prev, monthly_price: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Início do CARE</Label>
                      <Input
                        type="date"
                        value={care.start_date}
                        onChange={(e) => setCare((prev) => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Dia de vencimento</Label>
                      <Input
                        type="number"
                        min={1}
                        max={28}
                        value={care.due_day}
                        onChange={(e) => setCare((prev) => ({ ...prev, due_day: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 size-4" />
                Voltar
              </Button>
              <Button onClick={() => goToStep(4)}>
                Revisar
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && client && product && (
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-5 pt-6">
                <SummaryRow label="Cliente" value={`${client.trade_name} (${client.legal_name})`} />
                <SummaryRow label="Sistema" value={product.name} />
                <SummaryRow
                  label="Valor"
                  value={`${Number(commercial.value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} — ${commercial.payment_method}`}
                />
                <SummaryRow label="Prazo" value={`${commercial.term_days} dias`} />
                <SummaryRow
                  label="Datas"
                  value={`Início ${formatBR(commercial.start_date)} · Entrega ${formatBR(commercial.delivery_date)}`}
                />
                <SummaryRow label="Domínio" value={commercial.subdomain} />
                <SummaryRow
                  label="BASE7 CARE"
                  value={
                    care.active
                      ? `R$ ${Number(care.monthly_price || 0).toFixed(2)}/mês — vencimento dia ${care.due_day}`
                      : "Não contratado"
                  }
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)} disabled={submitting}>
                <ArrowLeft className="mr-2 size-4" />
                Voltar e editar
              </Button>
              <Button onClick={handleGenerate} disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <FileText className="mr-2 size-4" />}
                Gerar documentação
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function formatBR(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
