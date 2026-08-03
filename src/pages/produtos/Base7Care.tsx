import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { useCareSettingsQuery, useUpdateCareSettingsMutation } from "@/hooks/useCareSettings";

interface CareFormValues {
  monthly_price: string;
  description: string;
  is_offered: boolean;
}

export default function Base7Care() {
  const { data: care, isLoading } = useCareSettingsQuery();
  const updateMutation = useUpdateCareSettingsMutation();

  const form = useForm<CareFormValues>({
    defaultValues: { monthly_price: "249.90", description: "", is_offered: true },
  });

  useEffect(() => {
    if (!care) return;
    form.reset({
      monthly_price: care.monthly_price.toFixed(2),
      description: care.description,
      is_offered: care.is_offered,
    });
  }, [care, form]);

  async function onSubmit(values: CareFormValues) {
    const price = Number(values.monthly_price.replace(",", "."));
    if (Number.isNaN(price) || price < 0) {
      toast.error("Valor mensal inválido.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        monthly_price: price,
        description: values.description,
        is_offered: values.is_offered,
      });
      toast.success("BASE7 CARE atualizado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="BASE7 CARE" description="Plano único de infraestrutura, manutenção e suporte da Base7 Web." />
      <div className="max-w-2xl p-6 md:p-8">
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
              <Heart className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Plano único — sem variantes</p>
              <p className="text-xs text-muted-foreground">
                A Base7 Web oferece somente o BASE7 CARE. Não há planos Essencial/Profissional/Enterprise.
              </p>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthly_price"
              rules={{ required: "Informe o valor mensal." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor mensal (R$)</FormLabel>
                  <FormControl>
                    <Input inputMode="decimal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>O que o plano cobre</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormDescription>Texto usado no contrato e no manual de uso.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_offered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <FormLabel>Oferecer no fluxo de novo contrato</FormLabel>
                    <FormDescription>Se desativado, a opção de BASE7 CARE some do wizard de contratos.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end border-t border-border pt-6">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
