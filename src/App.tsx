import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import ClientesList from "@/pages/clientes/ClientesList";
import ClienteForm from "@/pages/clientes/ClienteForm";
import ProdutosSistemas from "@/pages/produtos/ProdutosSistemas";
import ProdutoNovo from "@/pages/produtos/ProdutoNovo";
import ProdutoDetail from "@/pages/produtos/ProdutoDetail";
import Base7Care from "@/pages/produtos/Base7Care";
import ServicosList from "@/pages/servicos/ServicosList";
import ServicoForm from "@/pages/servicos/ServicoForm";
import ContratosList from "@/pages/contratos/ContratosList";
import ContratoWizard from "@/pages/contratos/ContratoWizard";
import ContratoDetail from "@/pages/contratos/ContratoDetail";
import Documentacoes from "@/pages/Documentacoes";
import ConfiguracoesEmpresa from "@/pages/configuracoes/Empresa";
import ConfiguracoesTemplates from "@/pages/configuracoes/Templates";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route index element={<Dashboard />} />

                <Route path="clientes" element={<ClientesList />} />
                <Route path="clientes/novo" element={<ClienteForm />} />
                <Route path="clientes/:clientId" element={<ClienteForm />} />

                <Route path="produtos/sistemas" element={<ProdutosSistemas />} />
                <Route path="produtos/sistemas/novo" element={<ProdutoNovo />} />
                <Route path="produtos/sistemas/:productId" element={<ProdutoDetail />} />
                <Route path="produtos/base7-care" element={<Base7Care />} />

                <Route path="servicos" element={<ServicosList />} />
                <Route path="servicos/novo" element={<ServicoForm />} />
                <Route path="servicos/:serviceId" element={<ServicoForm />} />

                <Route path="contratos" element={<ContratosList />} />
                <Route path="contratos/novo" element={<ContratoWizard />} />
                <Route path="contratos/:contractId" element={<ContratoDetail />} />

                <Route path="documentacoes" element={<Documentacoes />} />

                <Route path="configuracoes/empresa" element={<ConfiguracoesEmpresa />} />
                <Route path="configuracoes/templates" element={<ConfiguracoesTemplates />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
