import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { clientFormDefaults, clientFormSchema, type ClientFormValues } from "@/lib/schemas/client";

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function ClientForm({ defaultValues, onSubmit, isSubmitting, submitLabel = "Salvar cliente", onCancel }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { ...clientFormDefaults, ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Dados empresariais</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="trade_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome fantasia</FormLabel>
                  <FormControl>
                    <Input placeholder="Barbearia Dom Corte" {...field} />
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
                    <Input placeholder="Dom Corte Barbearia LTDA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CNPJ">CNPJ</SelectItem>
                      <SelectItem value="CPF">CPF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{form.watch("kind") === "CPF" ? "CPF" : "CNPJ"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Somente números" {...field} />
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
                    <Input placeholder="Avenida Brasil" {...field} />
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
                    <Input maxLength={2} placeholder="SP" {...field} />
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
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Responsável</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Rafael Henrique Almeida" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo / função</FormLabel>
                  <FormControl>
                    <Input placeholder="Sócio Administrador" {...field} />
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
                    <Input type="email" placeholder="contato@cliente.com.br" {...field} />
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
                  <FormLabel>Telefone / WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Observações</h3>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea rows={3} placeholder="Notas internas sobre este cliente (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-end gap-2 border-t border-border pt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
