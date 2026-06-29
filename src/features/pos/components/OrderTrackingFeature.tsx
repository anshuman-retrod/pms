import { CheckCircle2, Clock, MapPin, ChefHat, Package } from "lucide-react";
import { PageHeader, Card } from "@/components/ui/Primitives";

const trackingSteps = [
  { id: 1, label: "Order Placed", time: "12:30 PM", icon: <CheckCircle2 className="h-5 w-5" />, status: "completed" },
  { id: 2, label: "Preparing", time: "12:35 PM", icon: <ChefHat className="h-5 w-5" />, status: "completed" },
  { id: 3, label: "Ready", time: "12:45 PM", icon: <Package className="h-5 w-5" />, status: "active" },
  { id: 4, label: "Out for Delivery", time: "--:--", icon: <MapPin className="h-5 w-5" />, status: "pending" },
  { id: 5, label: "Delivered", time: "--:--", icon: <Clock className="h-5 w-5" />, status: "pending" },
];

export function OrderTrackingFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Fulfillment"
        title="Order Tracking"
        description="Monitor real-time status of active orders."
      />
      <div className="p-6 max-w-3xl">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[16px] font-semibold text-text-primary">Order #NEW-101</h2>
              <p className="text-[13px] text-text-secondary mt-1">Delivery to: 42, Park Street, Block B</p>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-medium text-brand">Estimated Delivery</div>
              <div className="text-[18px] font-mono font-bold text-text-primary">1:10 PM</div>
            </div>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -z-10" />
            
            <div className="space-y-8">
              {trackingSteps.map((step, idx) => (
                <div key={step.id} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    step.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' :
                    step.status === 'active' ? 'bg-surface border-primary text-primary ring-4 ring-primary/10' :
                    'bg-surface border-border text-text-disabled'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="pt-2.5">
                    <h3 className={`text-[15px] font-medium ${
                      step.status === 'pending' ? 'text-text-disabled' : 'text-text-primary'
                    }`}>
                      {step.label}
                    </h3>
                    <p className={`text-[13px] font-mono mt-1 ${
                      step.status === 'pending' ? 'text-text-disabled' : 'text-text-secondary'
                    }`}>
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
