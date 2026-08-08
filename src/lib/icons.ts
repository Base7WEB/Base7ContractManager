import {
  Bot,
  Boxes,
  Briefcase,
  Calendar,
  BarChart3,
  Globe,
  Heart,
  LayoutDashboard,
  Megaphone,
  Rocket,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Conjunto curado de ícones lucide-react oferecido no cadastro de Sistemas/Serviços — não a
 * biblioteca inteira (centenas de ícones), só os que fazem sentido pro catálogo da Base7 Web.
 * `icon` é salvo no banco como texto livre (nome desta lista); resolveIcon() cai num ícone
 * padrão se o valor salvo não bater com nenhuma opção (renomeação futura, dado legado, etc).
 */
export const ICON_OPTIONS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "Boxes", label: "Sistema (padrão)", Icon: Boxes },
  { value: "Briefcase", label: "Serviço (padrão)", Icon: Briefcase },
  { value: "Shirt", label: "Moda", Icon: Shirt },
  { value: "Sparkles", label: "Beleza / Estética", Icon: Sparkles },
  { value: "Scissors", label: "Barbearia / Salão", Icon: Scissors },
  { value: "ShoppingBag", label: "E-commerce", Icon: ShoppingBag },
  { value: "Store", label: "Loja / Institucional", Icon: Store },
  { value: "Globe", label: "Site / Landing Page", Icon: Globe },
  { value: "Rocket", label: "Lançamento / Estrutura", Icon: Rocket },
  { value: "Megaphone", label: "Tráfego Pago", Icon: Megaphone },
  { value: "Target", label: "Consultoria / Estratégia", Icon: Target },
  { value: "Bot", label: "Automação / IA", Icon: Bot },
  { value: "BarChart3", label: "Dashboard / Métricas", Icon: BarChart3 },
  { value: "LayoutDashboard", label: "Painel Administrativo", Icon: LayoutDashboard },
  { value: "Calendar", label: "Agendamento", Icon: Calendar },
  { value: "Zap", label: "Performance", Icon: Zap },
  { value: "Heart", label: "Cuidado / Suporte", Icon: Heart },
  { value: "Wrench", label: "Manutenção", Icon: Wrench },
];

const ICON_MAP = new Map(ICON_OPTIONS.map((opt) => [opt.value, opt.Icon]));

export function resolveIcon(name: string | null | undefined, fallback: LucideIcon = Boxes): LucideIcon {
  if (!name) return fallback;
  return ICON_MAP.get(name) ?? fallback;
}
