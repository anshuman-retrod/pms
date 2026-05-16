import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_DESCRIPTION, ROLE_LABEL } from "@/lib/rbac";
import { Button } from "@/components/ui-kit/Primitives";
import { Lock, ShieldCheck, Star } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Retrod PMS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { users, login, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string>(users[0]?.id ?? "");
  const [email, setEmail] = useState("aarav@grandpalace.in");
  const [password, setPassword] = useState("••••••••");

  useEffect(() => {
    if (isAuthenticated) nav({ to: "/" });
  }, [isAuthenticated, nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? users.find(u => u.id === selected);
    if (match) {
      login(match.id);
      nav({ to: "/" });
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_440px] bg-background">
      {/* Left panel — brand */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-foreground p-12 text-background">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary font-display text-[15px] font-semibold text-primary-foreground">R</div>
            <span className="font-display text-[22px] font-semibold tracking-tight">Retrod</span>
            <span className="ml-1 rounded-sm bg-background/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-background/70">PMS</span>
          </div>
        </div>

        <div className="max-w-md">
          <p className="font-display text-[40px] leading-[1.1] text-background">
            The operating system for hospitality.
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-background/70">
            Front office, housekeeping, revenue, billing, and channel management — unified for properties that operate at world-class standards.
          </p>
          <div className="mt-8 flex items-center gap-6 text-[12px] text-background/60">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SOC 2 · ISO 27001</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]" /> Luxury hospitality grade</span>
          </div>
        </div>

        <div className="text-[11px] text-background/40">© 2026 Retrod Systems · The Grand Palace, New Delhi</div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center px-8 py-16 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <div className="label-uppercase mb-2">Welcome back</div>
            <h1 className="font-display text-[28px] font-semibold text-text-primary">Sign in to Retrod</h1>
            <p className="mt-1 text-[13px] text-text-secondary">Use your assigned credentials to access the property.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-text-secondary">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-text-secondary">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <Button className="!h-10 w-full justify-center"><Lock className="h-3.5 w-3.5" />Sign in</Button>
          </form>

          <div className="mt-8 rounded-lg border border-border-subtle bg-surface-2/40 p-4">
            <div className="label-uppercase mb-2">Demo · Sign in as any role</div>
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                const u = users.find(x => x.id === e.target.value);
                if (u) setEmail(u.email);
              }}
              className="h-9 w-full rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} — {ROLE_LABEL[u.role]}</option>
              ))}
            </select>
            <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
              {ROLE_DESCRIPTION[(users.find(u => u.id === selected)?.role) ?? "owner"]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
