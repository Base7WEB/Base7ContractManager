import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_70%_at_15%_-10%,hsl(205_100%_50%/0.08)_0%,transparent_55%),linear-gradient(160deg,hsl(222_47%_9%)_0%,hsl(222_45%_6%)_55%,hsl(222_50%_4%)_100%)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img src="/imagem/logo-base7web.png" alt="Base7 Web" className="h-9 w-auto" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-300/70">
              Ferramenta interna
            </p>
            <h1 className="text-lg font-semibold text-white">BASE7 Contract Manager</h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-200">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-primary"
              placeholder="voce@base7web.com.br"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-200">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Acesso restrito à equipe Base7 Web.
        </p>
      </div>
    </div>
  );
}
