import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, ArrowRight, ArrowLeft, IdCard, KeyRound, CreditCard, CheckCircle2,
  Camera, AlertCircle, Crown, Clock,
} from "lucide-react";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui-kit/Primitives";
import { arrivalsToday, departuresToday } from "@/lib/mock-data";

export const Route = createFileRoute("/check-in")({
  head: () => ({ meta: [{ title: "Check-In / Out — Retrod PMS" }] }),
  component: CheckInPage,
});

const STEPS = ["Find guest", "Verify ID", "Assign room", "Payment", "Issue key"] as const;

function CheckInPage() {
  const [tab, setTab] = useState<"checkin" | "checkout">("checkin");
  const [step, setStep] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string>("204");

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Check-In / Check-Out" description="Three-click arrivals. One-tap departures with auto-folio close." />

      <div className="space-y-6 p-6">
        <div className="flex rounded-md border border-border bg-surface p-0.5 text-[13px] w-fit">
          <button onClick={() => setTab("checkin")} className={`rounded px-4 py-1.5 ${tab === "checkin" ? "bg-foreground text-background" : "text-text-secondary"}`}>Check-In · 24</button>
          <button onClick={() => setTab("checkout")} className={`rounded px-4 py-1.5 ${tab === "checkout" ? "bg-foreground text-background" : "text-text-secondary"}`}>Check-Out · 18</button>
        </div>

        {tab === "checkin" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            {/* Arrivals queue */}
            <Card>
              <CardHeader title="Arrivals queue" hint="Sorted by ETA" />
              <div className="border-b border-border-subtle p-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
                  <input className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-2 text-[12px]" placeholder="Search name / RES no…" />
                </div>
              </div>
              <ul className="max-h-[640px] divide-y divide-border-subtle overflow-y-auto scrollbar-thin">
                {arrivalsToday.concat(arrivalsToday).slice(0, 8).map((r, i) => (
                  <li key={i} className={`flex items-center gap-3 px-4 py-3 hover:bg-surface-2/60 cursor-pointer ${i === 0 ? "bg-primary-tint/40" : ""}`}>
                    {r.guest.includes("Sophie") || r.guest.includes("Tanaka") ? <Crown className="h-3.5 w-3.5 text-[var(--color-gold,#c9a84c)]" /> : <span className="h-3.5 w-3.5" />}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{r.guest.split(" ").map(s => s[0]).slice(0, 2).join("")}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-text-primary">{r.guest}</div>
                      <div className="text-[11px] text-text-secondary">{r.id} · {r.nights}N · ETA 14:00</div>
                    </div>
                    <StatusBadge tone={r.status === "Confirmed" ? "success" : "warning"}>{r.status}</StatusBadge>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Wizard */}
            <Card>
              <CardHeader
                title="Express check-in · John Mathews"
                hint="RES-2041 · Booking.com · 3 nights"
                action={<StatusBadge tone="warning">Pending balance ₹4,800</StatusBadge>}
              />

              {/* Stepper */}
              <div className="flex items-center gap-2 overflow-x-auto border-b border-border-subtle px-5 py-3 text-[12px]">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 whitespace-nowrap">
                    <button onClick={() => setStep(i)}
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${i < step ? "bg-[var(--color-success)] text-white" : i === step ? "bg-primary text-primary-foreground" : "border border-border text-text-disabled"}`}>
                      {i < step ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                    </button>
                    <span className={i <= step ? "text-text-primary" : "text-text-disabled"}>{s}</span>
                    {i < STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-text-disabled" />}
                  </div>
                ))}
              </div>

              <div className="p-5">
                {step === 0 && <StepFind />}
                {step === 1 && <StepID />}
                {step === 2 && <StepRoom selected={selectedRoom} onSelect={setSelectedRoom} />}
                {step === 3 && <StepPayment />}
                {step === 4 && <StepKey room={selectedRoom} />}
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle bg-surface-2/40 px-5 py-3">
                <Button variant="outline" size="sm" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
                  <ArrowLeft className="h-3.5 w-3.5" />Back
                </Button>
                {step < 4 ? (
                  <Button size="sm" onClick={() => setStep(s => Math.min(4, s + 1))}>Continue<ArrowRight className="h-3.5 w-3.5" /></Button>
                ) : (
                  <Button size="sm"><CheckCircle2 className="h-3.5 w-3.5" />Complete check-in</Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {tab === "checkout" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Express check-out" hint="Auto-charged on opt-in" action={<StatusBadge tone="info">Card on file</StatusBadge>} />
              <ul className="divide-y divide-border-subtle">
                {departuresToday.concat(departuresToday).slice(0, 4).map((r, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <div className="text-[14px] font-medium text-text-primary">{r.guest}</div>
                      <div className="text-[11px] text-text-secondary">Room {r.room} · final folio emailed at 06:00</div>
                    </div>
                    <Button size="sm" variant="outline">Confirm auto-charge</Button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader title="Standard check-out" hint="Folio review · multi-tender · GST invoice" />
              <ul className="divide-y divide-border-subtle">
                {departuresToday.concat(departuresToday).slice(0, 4).map((r, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-2/40">
                    <div>
                      <div className="text-[14px] font-medium text-text-primary">{r.guest}</div>
                      <div className="text-[11px] text-text-secondary">Room {r.room} · Checkout 11:00</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.balance > 0
                        ? <StatusBadge tone="warning">₹{r.balance.toLocaleString()} due</StatusBadge>
                        : <StatusBadge tone="success">Settled</StatusBadge>}
                      <Button size="sm">Settle & checkout</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader title="Late check-out requests" hint="Approval per HK availability" />
              <table className="w-full text-[13px]">
                <thead className="bg-surface-2/40 text-left">
                  <tr>{["Guest", "Room", "Requested time", "Charge", "HK ready", "Decision"].map(h => <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    { g: "Hiroshi Tanaka", r: "108", t: "15:00", c: "50% (₹6,200)", ok: true },
                    { g: "Elena Rodriguez", r: "401", t: "16:00", c: "Full night (₹35,000)", ok: false },
                    { g: "Marcus Weber", r: "215", t: "13:30", c: "Comp (Loyalty Gold)", ok: true },
                  ].map((x, i) => (
                    <tr key={i} className="border-t border-border-subtle">
                      <td className="px-4 py-3 font-medium text-text-primary">{x.g}</td>
                      <td className="px-4 py-3 font-mono">{x.r}</td>
                      <td className="px-4 py-3 text-text-secondary"><Clock className="mr-1 inline h-3 w-3" />{x.t}</td>
                      <td className="px-4 py-3 font-mono">{x.c}</td>
                      <td className="px-4 py-3"><StatusBadge tone={x.ok ? "success" : "warning"}>{x.ok ? "Ready" : "Tight"}</StatusBadge></td>
                      <td className="px-4 py-3"><div className="flex gap-1"><Button size="sm">Approve</Button><Button size="sm" variant="outline">Decline</Button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

function StepFind() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FieldRow label="Guest name" value="John Mathews" />
      <FieldRow label="Email" value="john.mathews@email.com" />
      <FieldRow label="Phone" value="+44 7700 900812" mono />
      <FieldRow label="Source" value="Booking.com" />
      <FieldRow label="Reservation" value="RES-2041" mono />
      <FieldRow label="Stay" value="15 May → 18 May · 3 nights" />
    </div>
  );
}

function StepID() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_280px]">
      <div className="grid grid-cols-2 gap-4">
        <label><div className="label-uppercase mb-1">ID type</div><select className={inputCls}><option>Passport</option><option>Aadhaar</option><option>Driving licence</option></select></label>
        <label><div className="label-uppercase mb-1">ID number</div><input className={inputCls} defaultValue="UK-PP 893421" /></label>
        <label><div className="label-uppercase mb-1">Nationality</div><input className={inputCls} defaultValue="United Kingdom" /></label>
        <label><div className="label-uppercase mb-1">Date of birth</div><input type="date" className={inputCls} defaultValue="1989-04-12" /></label>
        <label className="col-span-2"><div className="label-uppercase mb-1">Form C (foreign nationals)</div>
          <div className="rounded-md border border-border bg-surface-2/40 px-3 py-2 text-[12px] text-text-secondary">Auto-generated from passport scan · ready to file</div></label>
      </div>
      <div className="rounded-md border-2 border-dashed border-border bg-surface-2/30 p-6 text-center">
        <Camera className="mx-auto h-8 w-8 text-text-disabled" />
        <div className="mt-2 text-[12px] font-medium text-text-primary">Scan / upload ID</div>
        <div className="text-[11px] text-text-secondary">Front + back · OCR extracts fields</div>
        <Button size="sm" variant="outline" className="mt-3"><IdCard className="h-3.5 w-3.5" />Scan now</Button>
      </div>
    </div>
  );
}

function StepRoom({ selected, onSelect }: { selected: string; onSelect: (r: string) => void }) {
  const ready = ["104", "108", "204", "207", "211", "303", "308", "402"];
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[12px] text-text-secondary">Pre-assigned: <span className="font-mono text-text-primary">204 · Deluxe King · Floor 2</span></div>
        <Button size="sm" variant="outline">Suggest upgrade</Button>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {ready.map(n => (
          <button key={n} onClick={() => onSelect(n)}
            className={`aspect-[3/2.4] rounded-md border-2 p-2 text-left transition ${selected === n ? "border-primary bg-primary-tint" : "border-[var(--color-success)] bg-[oklch(0.96_0.04_152)]"}`}>
            <div className={`font-mono text-[13px] font-semibold ${selected === n ? "text-primary" : "text-[var(--color-success)]"}`}>{n}</div>
            <div className="text-[10px] text-text-secondary">Ready</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepPayment() {
  return (
    <div>
      <div className="mb-3 flex items-start gap-3 rounded-md border border-[var(--color-warning)]/30 bg-[oklch(0.97_0.05_70)] p-3 text-[12px]">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" />
        <div className="flex-1">
          <div className="font-medium text-text-primary">Outstanding balance: ₹4,800</div>
          <div className="text-text-secondary">Collect before issuing key. Payment can be split across tenders.</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { name: "Card", hint: "Visa · MC · RuPay · Amex" },
          { name: "UPI", hint: "Scan QR · GPay · PhonePe" },
          { name: "Cash", hint: "INR · counter receipt" },
        ].map(p => (
          <button key={p.name} className="rounded-lg border border-border bg-surface p-4 text-left hover:border-primary">
            <CreditCard className="mb-2 h-5 w-5 text-primary" />
            <div className="text-[14px] font-semibold text-text-primary">{p.name}</div>
            <div className="text-[11px] text-text-secondary">{p.hint}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label><div className="label-uppercase mb-1">Amount</div><input className={inputCls} defaultValue="₹4,800" /></label>
        <label><div className="label-uppercase mb-1">Reference</div><input className={inputCls} placeholder="TXN / approval code" /></label>
      </div>
    </div>
  );
}

function StepKey({ room }: { room: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
        <KeyRound className="h-7 w-7 text-primary" />
      </div>
      <div className="mt-3 font-display text-[20px] font-semibold text-text-primary">Issue key card · Room {room}</div>
      <div className="mt-1 text-[12px] text-text-secondary">Encoder Lobby-A · valid until 18 May 11:00</div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm">Print welcome letter</Button>
        <Button size="sm"><KeyRound className="h-3.5 w-3.5" />Encode keys (×2)</Button>
      </div>
    </div>
  );
}

function FieldRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label-uppercase text-[10px]">{label}</div>
      <div className={`mt-1 text-[13px] text-text-primary ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
