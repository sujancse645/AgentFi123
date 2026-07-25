import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Check, AlertTriangle, ShieldAlert, ShieldX } from "lucide-react";
import type { ParsedIntent } from "@/lib/intentParser";

interface Props {
  intent: ParsedIntent;
}

export const RiskCard = ({ intent }: Props) => {
  const { risk } = intent;
  const total = risk.checks.length;

  const tone =
    risk.level === "safe"
      ? {
          icon: ShieldCheck,
          iconWrap: "bg-success/15 text-success",
          badge: "border-success/40 bg-success/10 text-success",
        }
      : risk.level === "caution"
      ? {
          icon: ShieldAlert,
          iconWrap: "bg-warning/15 text-warning",
          badge: "border-warning/40 bg-warning/10 text-warning",
        }
      : {
          icon: ShieldX,
          iconWrap: "bg-destructive/15 text-destructive",
          badge: "border-destructive/40 bg-destructive/10 text-destructive",
        };
  const Icon = tone.icon;

  return (
    <Card className="glass-card hover-lift animate-fade-in-up [animation-delay:80ms]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${tone.iconWrap}`}>
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle className="font-display text-base">Safety Check</CardTitle>
        </div>
        <Badge variant="outline" className={tone.badge}>
          {risk.passed} / {total} passed
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{risk.headline}</p>

        <ul className="space-y-2">
          {risk.checks.map((c) => (
            <li
              key={c.label}
              className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="text-foreground/90">{c.label}</span>
              {c.status === "pass" ? (
                <Badge className="gap-1 border-0 bg-success/15 text-success hover:bg-success/20">
                  <Check className="h-3 w-3" /> Pass
                </Badge>
              ) : c.status === "warn" ? (
                <Badge className="gap-1 border-0 bg-warning/15 text-warning hover:bg-warning/20">
                  <AlertTriangle className="h-3 w-3" /> Caution
                </Badge>
              ) : (
                <Badge className="gap-1 border-0 bg-destructive/15 text-destructive hover:bg-destructive/20">
                  <AlertTriangle className="h-3 w-3" /> Fail
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
