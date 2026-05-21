import { Send, Plus } from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";

const threads = [
  { name: "Sophie Laurent", last: "Looking forward to my arrival on the 16th.", time: "10:42", unread: 0, channel: "Email" },
  { name: "John Mathews", last: "Could I get a late checkout please?", time: "09:18", unread: 1, channel: "WhatsApp" },
  { name: "H. Tanaka", last: "Confirming spa booking for tomorrow.", time: "Yesterday", unread: 0, channel: "Email" },
  { name: "Elena Rodriguez", last: "Will arrive around 21:00.", time: "Yesterday", unread: 2, channel: "SMS" },
];

export function CommunicationsFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Guests"
        title="Guest Communications"
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New message
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader title="Inbox" hint="3 unread" />
          <ul className="divide-y divide-border-subtle">
            {threads.map((t, i) => (
              <li
                key={t.name}
                className={`flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-surface-2/60 transition ${
                  i === 1 ? "bg-primary-tint/30" : ""
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                  {t.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[13px] font-medium text-text-primary">{t.name}</span>
                    <span className="text-[10px] text-text-disabled">{t.time}</span>
                  </div>
                  <div className="truncate text-[12px] text-text-secondary">{t.last}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge tone="neutral">{t.channel}</StatusBadge>
                    {t.unread > 0 && (
                      <span className="rounded-sm bg-primary px-1.5 py-px text-[10px] font-medium text-primary-foreground">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
            <div>
              <div className="text-[14px] font-semibold text-text-primary">John Mathews</div>
              <div className="text-[11px] text-text-secondary">RES-2041 · WhatsApp · Active stay</div>
            </div>
            <StatusBadge tone="info">Checked-In</StatusBadge>
          </div>
          <div className="flex-1 space-y-3 p-5 min-h-[400px]">
            <Bubble from="them" text="Hi! Could I get a late checkout please?" time="09:18" />
            <Bubble from="me" text="Of course, John. We can hold your room until 14:00 — is that helpful?" time="09:21" />
            <Bubble from="them" text="That works perfectly. Thank you." time="09:22" />
          </div>
          <div className="border-t border-border-subtle p-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 focus-within:border-primary">
              <input
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-text-disabled"
                placeholder="Type a message…"
              />
              <button className="rounded-md bg-primary p-1.5 text-primary-foreground hover:bg-primary-pressed transition">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Bubble({ from, text, time }: { from: "me" | "them"; text: string; time: string }) {
  return (
    <div className={`flex ${from === "me" ? "justify-end" : ""}`}>
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 text-[13px] ${
          from === "me" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-text-primary"
        }`}
      >
        <div>{text}</div>
        <div className={`mt-1 text-right text-[10px] ${from === "me" ? "text-primary-foreground/70" : "text-text-disabled"}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
export default CommunicationsFeature;
