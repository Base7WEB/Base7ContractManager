import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Boxes,
  Heart,
  FileText,
  FolderOpen,
  Building2,
  FileCode2,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Clientes",
    items: [{ label: "Clientes", to: "/clientes", icon: Users }],
  },
  {
    label: "Produtos",
    items: [
      { label: "Sistemas", to: "/produtos/sistemas", icon: Boxes },
      { label: "BASE7 CARE", to: "/produtos/base7-care", icon: Heart },
    ],
  },
  {
    label: "Documentos",
    items: [
      { label: "Contratos", to: "/contratos", icon: FileText },
      { label: "Documentações", to: "/documentacoes", icon: FolderOpen },
    ],
  },
  {
    label: "Configurações",
    items: [
      { label: "Empresa", to: "/configuracoes/empresa", icon: Building2 },
      { label: "Templates", to: "/configuracoes/templates", icon: FileCode2 },
    ],
  },
];

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <img
              src="/imagem/logo-base7web.png"
              alt="Base7 Web"
              className="h-6 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
            />
            <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Base7 Web
              </span>
              <span className="text-sm font-semibold text-sidebar-foreground">Contract Manager</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {NAV_GROUPS.map((group) => (
            <SidebarGroup key={group.label || "root"}>
              {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <NavLink
                          to={item.to}
                          end={item.end}
                          className={({ isActive }) =>
                            cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground")
                          }
                        >
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent">
                    <div className="flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-accent-foreground">
                      {user?.email?.slice(0, 2).toUpperCase() ?? "??"}
                    </div>
                    <span className="truncate text-sm">{user?.email ?? "—"}</span>
                    <ChevronsUpDown className="ml-auto size-3.5 opacity-60" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">BASE7 CONTRACT MANAGER</span>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
