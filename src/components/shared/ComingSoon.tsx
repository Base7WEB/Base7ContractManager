import { Construction } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="p-6 md:p-8">
        <EmptyState
          icon={Construction}
          title="Em construção"
          description={description ?? "Esta tela ainda não foi implementada nesta fase do projeto."}
        />
      </div>
    </>
  );
}
