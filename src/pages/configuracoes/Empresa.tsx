import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCompanySettingsQuery, useUpdateCompanySettingsMutation } from "@/hooks/useCompanySettings";

interface CompanyFormValues {
  name: string;
  legal_name: string;
  cnpj: string;
  email: string;
  phone: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  website: string;
}

const EMPTY_VALUES: CompanyFormValues = {
  name: "",
  legal_name: "",
  cnpj: "",
  email: "",
  phone: "",
  address_street: "",
  address_number: "",
  address_complement: "",
  address_neighborhood: "",
  address_city: "",
  address_state: "",
  address_zip: "",
  website: "",
};

export default function ConfiguracoesEmpresa() {
  const { data: company, isLoading } = useCompanySettingsQuery();
  const updateMutation = useUpdateCompanySettingsMutation();

  const form = useForm<CompanyFormValues>({ defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!company) return;
    form.reset({
      name: company.name,
      legal_name: company.legal_name ?? "",
      cnpj: company.cnpj ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      address_street: company.address_street ?? "",
      address_number: company.address_number ?? "",
      address_complement: company.address_complement ?? "",
      address_neighborhood: company.address_neighborhood ?? "",
      address_city: company.address_city ?? "",
      address_state: company.address_state ?? "",
      address_zip: company.address_zip ?? "",
      website: company.website ?? "",
    });
  }, [company, form]);

  async function onSubmit(values: CompanyFormValues) {
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        legal_name: values.legal_name || null,
        cnpj: values.cnpj || null,
        email: values.email || null,
        phone: values.phone || null,
        address_street: values.address_street || null,
        address_number: values.address_number || null,
        address_complement: values.address_complement || null,
        address_neighborhood: values.address_neighborhood || null,
        address_city: values.address_city || null,
        address_state: values.address_state || null,
        address_zip: values.address_zip || null,
        website: values.website || null,
      });
      toast.success("Dados da empresa atualizados.");
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
      <PageHeader
        title="Empresa"
        description="Dados da Base7 Web usados como CONTRATADA nos documentos gerados."
      />
      <div className="max-w-3xl p-6 md:p-8">
        {!company?.cnpj && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            O CNPJ ainda não foi preenchido. Enquanto estiver em branco, os contratos gerados mostram
            "[a inserir]" no lugar do CNPJ da Base7 Web.
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Informe o nome." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legal_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão social</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="Somente números" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <FormControl>
                      <Input placeholder="https://base7web.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="address_street"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_number"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_complement"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_neighborhood"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_city"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_state"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_zip"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
