import type { ServiceDocumentContext } from "../../context.js";
import { contratoEssencialTemplate } from "./essencial.js";
import { contratoProfissionalTemplate } from "./profissional.js";
import { contratoEstruturaCompletaTemplate } from "./estruturaCompleta.js";
import { contratoLandingPageExpressTemplate } from "./landingPageExpress.js";
import { contratoSprintValidacaoTemplate } from "./sprintValidacao.js";
import { contratoGestaoTrafegoTemplate } from "./gestaoTrafego.js";
import { contratoConsultoriaEstrategicaTemplate } from "./consultoriaEstrategica.js";
import { contratoAutomacaoIATemplate } from "./automacaoIA.js";
import { contratoDashboardMetricasTemplate } from "./dashboardMetricas.js";

type ServiceContractTemplate = (ctx: ServiceDocumentContext, current: number, total: number) => string;

/** Chave = `services.slug` (ver scripts/seed.ts). Um serviço novo que não caia em nenhum destes
 * slugs cai no fallback genérico em pdf/index.ts (renderServiceContractHtml). */
export const SERVICE_CONTRACT_TEMPLATES: Record<string, ServiceContractTemplate> = {
  essencial: contratoEssencialTemplate,
  profissional: contratoProfissionalTemplate,
  "estrutura-completa": contratoEstruturaCompletaTemplate,
  "landing-page-express": contratoLandingPageExpressTemplate,
  "sprint-validacao": contratoSprintValidacaoTemplate,
  "gestao-trafego-escala": contratoGestaoTrafegoTemplate,
  "consultoria-estrategica": contratoConsultoriaEstrategicaTemplate,
  "automacao-atendimento-ia": contratoAutomacaoIATemplate,
  "dashboard-metricas-tempo-real": contratoDashboardMetricasTemplate,
};
