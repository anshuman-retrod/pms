import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, User, Users, Building2, Gift, Footprints, CalendarClock,
  CheckCircle2, Mail, Phone, CreditCard,
} from "lucide-react";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui/Primitives";

const types = [
  { id: "individual", label: "Individual", icon: User, hint: "Single guest or family" },
  { id: "group", label: "Group", icon: Users, hint: "Block of rooms · rooming list" },
  { id: "corporate", label: "Corporate", icon: Building2, hint: "Negotiated rate · direct bill" },
  { id: "package", label: "Package", icon: Gift, hint: "Honeymoon · Spa · B&B" },
  { id: "walkin", label: "Walk-In", icon: Footprints, hint: "On-the-spot, minimum fields" },
  { id: "event", label: "Event / Banquet", icon: CalendarClock, hint: "Venue + catering + AV" },
] as const;

type T = (typeof types)[number]["id"];

export function NewReservationFeature() {
  const [type, setType] = useState<T>("individual");

  return (
    <div>
      <PageHeader
        eyebrow="Reservations · New"
        title="New reservation"
        description="Choose a booking type and complete the form. Auto-confirmation sent on submit."
        actions={
          <>
            <Link to="/reservations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              Save draft
            </Button>
            <Button size="sm">Confirm reservation</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[260px_1fr]">
        {/* Type tabs */}
        <Card>
          <CardHeader title="Booking type" />
          <ul className="p-2">
            {types.map((t) => {
              const active = type === t.id;
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setType(t.id)}
                    className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition ${
                      active ? "bg-primary-tint text-primary-pressed" : "hover:bg-surface-2"
                    }`}
                  >
                    <Icon className={`mt-0.5 h-4 w-4 ${active ? "text-primary" : "text-text-secondary"}`} />
                    <div>
                      <div className="text-[13px] font-medium">{t.label}</div>
                      <div className="text-[11px] text-text-secondary">{t.hint}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-4">
          {type === "individual" && <IndividualForm />}
          {type === "group" && <GroupForm />}
          {type === "corporate" && <CorporateForm />}
          {type === "package" && <PackageForm />}
          {type === "walkin" && <WalkinForm />}
          {type === "event" && <EventForm />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-secondary">{label}</span>
        {hint && <span className="text-[10px] text-text-disabled">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

function IndividualForm() {
  return (
    <>
      <Card>
        <CardHeader title="Guest details" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <Field label="Full name">
            <input className={inputCls} placeholder="e.g. John Mathews" />
          </Field>
          <Field label="Nationality">
            <input className={inputCls} placeholder="United Kingdom" />
          </Field>
          <Field label="Email">
            <input className={inputCls} type="email" placeholder="john@email.com" />
          </Field>
          <Field label="Phone">
            <input className={inputCls} placeholder="+44 7700 900812" />
          </Field>
          <Field label="ID type">
            <select className={inputCls}>
              <option>Passport</option>
              <option>Aadhaar</option>
              <option>Driving Licence</option>
            </select>
          </Field>
          <Field label="ID number">
            <input className={inputCls} placeholder="UK-PP 893421" />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Stay & rate" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <Field label="Check-in">
            <input className={inputCls} type="date" defaultValue="2026-05-15" />
          </Field>
          <Field label="Check-out">
            <input className={inputCls} type="date" defaultValue="2026-05-18" />
          </Field>
          <Field label="Nights / Pax">
            <div className="flex gap-2">
              <input className={inputCls} placeholder="3 nights" readOnly />
              <input className={inputCls} placeholder="2 adults" />
            </div>
          </Field>
          <Field label="Room type" hint="Live availability">
            <select className={inputCls}>
              <option>Deluxe King · 12 left · ₹11,000</option>
              <option>Premier Suite · 5 left · ₹22,000</option>
              <option>Heritage Suite · 2 left · ₹35,000</option>
            </select>
          </Field>
          <Field label="Rate plan">
            <select className={inputCls}>
              <option>BAR · Bed & Breakfast</option>
              <option>Corporate</option>
              <option>Package · Honeymoon</option>
              <option>Promotional · Stay 3 Pay 2</option>
            </select>
          </Field>
          <Field label="Source">
            <select className={inputCls}>
              <option>Direct</option>
              <option>Booking.com</option>
              <option>Expedia</option>
              <option>Agoda</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Special requests & preferences" />
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            {[
              "High floor",
              "Sea view",
              "Twin beds",
              "Hypoallergenic pillow",
              "Late check-out",
              "Airport pickup",
              "Newspaper · FT",
              "Vegan menu",
            ].map((t) => (
              <button
                key={t}
                className="rounded-full border border-border px-3 py-1 text-[11px] text-text-secondary hover:border-primary hover:text-primary"
              >
                + {t}
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-md border border-border bg-surface p-3 text-[13px] focus:border-primary focus:outline-none"
            rows={3}
            placeholder="Free-text notes for the front office team…"
          />
        </div>
      </Card>

      <Summary total={36000} />
    </>
  );
}

function GroupForm() {
  return (
    <>
      <Card>
        <CardHeader title="Group details" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <Field label="Group name">
            <input className={inputCls} placeholder="Tata Steel Annual Offsite" />
          </Field>
          <Field label="Company / event">
            <input className={inputCls} placeholder="Tata Steel Ltd." />
          </Field>
          <Field label="Primary contact">
            <input className={inputCls} placeholder="Anil Kumar · +91 98xxxxxx20" />
          </Field>
          <Field label="Pickup target">
            <input className={inputCls} placeholder="40 of 50 rooms" />
          </Field>
        </div>
      </Card>
      <Card>
        <CardHeader title="Room block" action={<Button size="sm" variant="outline">+ Add row</Button>} />
        <table className="w-full text-[13px]">
          <thead className="bg-surface-2/40 text-left">
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Room type", "Quantity", "From", "To", "Rate", "Booked"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { t: "Deluxe King", q: 30, from: "20 May", to: "23 May", r: 9500, b: 24 },
              { t: "Premier Suite", q: 15, from: "20 May", to: "23 May", r: 19000, b: 12 },
              { t: "Heritage Suite", q: 5, from: "20 May", to: "23 May", r: 32000, b: 4 },
            ].map((r, i) => (
              <tr key={i} className="border-t border-border-subtle">
                <td className="px-4 py-3 font-medium text-text-primary">{r.t}</td>
                <td className="px-4 py-3 font-mono">{r.q}</td>
                <td className="px-4 py-3 text-text-secondary">{r.from}</td>
                <td className="px-4 py-3 text-text-secondary">{r.to}</td>
                <td className="px-4 py-3 font-mono">₹{r.r.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={r.b === r.q ? "success" : "warning"}>
                    {r.b}/{r.q}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border-subtle bg-surface-2/30 p-4">
          <Button variant="outline" size="sm">
            Upload rooming list (CSV / Excel)
          </Button>
          <span className="ml-3 text-[11px] text-text-disabled">
            Master folio or individual folios?{" "}
            <button className="text-primary hover:underline">Configure</button>
          </span>
        </div>
      </Card>
      <Summary total={1480000} />
    </>
  );
}

function CorporateForm() {
  return (
    <>
      <Card>
        <CardHeader title="Corporate account" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <Field label="Company">
            <select className={inputCls}>
              <option>Infosys Ltd. · Negotiated ₹8,200</option>
              <option>HSBC India · Negotiated ₹9,800</option>
              <option>Reliance Jio</option>
            </select>
          </Field>
          <Field label="PO / Reference">
            <input className={inputCls} placeholder="PO-2026-04812" />
          </Field>
          <Field label="Rate plan">
            <input className={inputCls} value="Corporate · valid until 31 Dec 2026" readOnly />
          </Field>
          <Field label="Billing">
            <select className={inputCls}>
              <option>Direct bill to company (City Ledger)</option>
              <option>Guest pays — company reimburses</option>
            </select>
          </Field>
        </div>
      </Card>
      <IndividualForm />
    </>
  );
}

function PackageForm() {
  return (
    <>
      <Card>
        <CardHeader title="Package selection" />
        <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
          {[
            {
              name: "Honeymoon Bliss",
              price: 28000,
              items: ["Champagne on arrival", "Spa for 2 · 60 min", "Candle-light dinner", "Late checkout"],
            },
            { name: "Stay & Spa", price: 18500, items: ["B&B included", "1 spa treatment", "Pool access"] },
            { name: "Family Escape", price: 22000, items: ["B&B for 4", "Kids amenities", "Airport transfer"] },
          ].map((p) => (
            <button
              key={p.name}
              className="rounded-lg border border-border bg-surface p-4 text-left hover:border-primary"
            >
              <div className="text-[14px] font-semibold text-text-primary">{p.name}</div>
              <div className="font-mono text-[12px] text-primary">₹{p.price.toLocaleString()} / night</div>
              <ul className="mt-2 space-y-1 text-[11px] text-text-secondary">
                {p.items.map((i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-[var(--color-success)]" />
                    {i}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </Card>
      <IndividualForm />
    </>
  );
}

function WalkinForm() {
  return (
    <>
      <Card>
        <CardHeader title="Quick walk-in" hint="Minimum fields · ready in 60 seconds" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <Field label="Name">
            <input className={inputCls} />
          </Field>
          <Field label="Phone">
            <input className={inputCls} />
          </Field>
          <Field label="ID number">
            <input className={inputCls} />
          </Field>
          <Field label="Nights">
            <input className={inputCls} type="number" defaultValue={1} />
          </Field>
          <Field label="Adults / children">
            <input className={inputCls} placeholder="2 / 0" />
          </Field>
          <Field label="Payment">
            <select className={inputCls}>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
            </select>
          </Field>
        </div>
      </Card>
      <Card>
        <CardHeader title="Available right now" hint="Click a room to assign" />
        <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-4 md:grid-cols-6">
          {["104", "207", "211", "303", "308", "402"].map((n) => (
            <button
              key={n}
              className="rounded-md border border-[var(--color-success)] bg-[oklch(0.96_0.04_152)] p-3 text-left transition hover:scale-[1.03]"
            >
              <div className="font-mono text-[14px] font-semibold text-[var(--color-success)]">{n}</div>
              <div className="text-[10px] text-text-secondary">Deluxe · ₹9,500</div>
            </button>
          ))}
        </div>
      </Card>
      <Summary total={9500} />
    </>
  );
}

function EventForm() {
  return (
    <>
      <Card>
        <CardHeader title="Event details" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <Field label="Venue">
            <select className={inputCls}>
              <option>Grand Ballroom · 500 pax</option>
              <option>Boardroom · 16 pax</option>
              <option>Garden Lawn · 250 pax</option>
            </select>
          </Field>
          <Field label="Event type">
            <select className={inputCls}>
              <option>Wedding</option>
              <option>Corporate conference</option>
              <option>Birthday</option>
              <option>Product launch</option>
            </select>
          </Field>
          <Field label="Expected pax">
            <input className={inputCls} type="number" defaultValue={180} />
          </Field>
          <Field label="Date">
            <input className={inputCls} type="date" />
          </Field>
          <Field label="Start">
            <input className={inputCls} type="time" defaultValue="18:00" />
          </Field>
          <Field label="End">
            <input className={inputCls} type="time" defaultValue="23:00" />
          </Field>
        </div>
      </Card>
      <Card>
        <CardHeader title="Catering & AV" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <div>
            <div className="label-uppercase mb-2">Menu</div>
            <div className="space-y-2 text-[13px]">
              {["Silver · ₹1,800/pax", "Gold · ₹2,800/pax", "Platinum · ₹4,200/pax"].map((m) => (
                <label key={m} className="flex items-center gap-2">
                  <input type="radio" name="menu" />
                  {m}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="label-uppercase mb-2">AV / equipment</div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {["Projector + screen", "Wireless mic ×2", "Stage lighting", "DJ console", "Photographer", "Live streaming"].map((a) => (
                <label key={a} className="flex items-center gap-2">
                  <input type="checkbox" />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Summary total={420000} />
    </>
  );
}

function Summary({ total }: { total: number }) {
  return (
    <Card>
      <CardHeader title="Confirmation" hint="Auto-send on submit" />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_240px]">
        <div className="space-y-2 text-[12px]">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <Mail className="h-3.5 w-3.5 text-text-secondary" /> Email confirmation
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <Phone className="h-3.5 w-3.5 text-text-secondary" /> SMS confirmation
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <CreditCard className="h-3.5 w-3.5 text-text-secondary" /> Pre-authorize card on file
          </label>
        </div>
        <div className="rounded-md border border-border bg-surface-2/40 p-4">
          <div className="label-uppercase">Estimated total</div>
          <div className="mt-1 font-display text-[22px] font-semibold text-text-primary">₹{total.toLocaleString()}</div>
          <div className="text-[10px] text-text-disabled">Inclusive of taxes</div>
          <Button className="mt-3 w-full" size="sm">
            Confirm reservation
          </Button>
        </div>
      </div>
    </Card>
  );
}
export default NewReservationFeature;
