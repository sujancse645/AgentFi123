import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronDown, Code2, TrendingUp, TrendingDown, Wallet, AlertCircle, CheckCircle2, Activity } from "lucide-react";
import type { ParsedIntent } from "@/lib/intentParser";

interface Props {
  intent: ParsedIntent;
}

export const ParsedIntentCard = ({ intent }: Props) => {
  const [open, setOpen] = useState(false);
  const confidenceStyles =
    intent.confidence === "high"
      ? "border-primary/30 bg-primary/10 text-primary"
      : intent.confidence === "medium"
      ? "border-warning/30 bg-warning/10 text-warning"
      : "border-destructive/30 bg-destructive/10 text-destructive";

  const hasBalanceIssue = intent.walletContext && !intent.walletContext.hasSufficientBalance;

  return (
    <Card className="glass-card hover-lift animate-fade-in-up">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Brain className="h-4 w-4" />
          </div>
          <CardTitle className="font-display text-base">AI Analysis</CardTitle>
        </div>
        <Badge variant="outline" className={confidenceStyles}>
          {intent.confidence === "high"
            ? "High confidence"
            : intent.confidence === "medium"
            ? "Medium confidence"
            : "Low confidence"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{intent.summary}</p>

        {/* AI Reasoning */}
        {intent.meta?.reasoning && intent.meta.reasoning.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Reasoning</div>
            <div className="space-y-1.5">
              {intent.meta.reasoning.map((reason, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 text-xs ${
                    reason.includes("⚠️") ? "text-warning" : 
                    reason.includes("✓") ? "text-teal" : "text-muted-foreground"
                  }`}
                >
                  {reason.includes("⚠️") ? (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  ) : reason.includes("✓") ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  ) : (
                    <Activity className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  )}
                  <span>{reason.replace(/[⚠️✓]\s*/, "")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Data */}
        {intent.marketData && (intent.marketData.sourcePrice || intent.marketData.targetPrice) && (
          <div className="grid grid-cols-2 gap-2">
            {intent.marketData.sourcePrice && (
              <div className="rounded-md border border-border bg-muted/40 p-2">
                <div className="text-muted-foreground text-xs flex items-center gap-1">
                  {intent.source.token} Price
                  {intent.marketData.sourcePrice.change24h !== 0 && (
                    intent.marketData.sourcePrice.change24h > 0 ? (
                      <TrendingUp className="h-3 w-3 text-teal" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )
                  )}
                </div>
                <div className="font-mono text-sm text-foreground">
                  ${intent.marketData.sourcePrice.priceUsd.toFixed(4)}
                </div>
                {intent.marketData.sourcePrice.change24h !== 0 && (
                  <div className={`text-xs ${intent.marketData.sourcePrice.change24h > 0 ? "text-teal" : "text-destructive"}`}>
                    {intent.marketData.sourcePrice.change24h > 0 ? "+" : ""}{intent.marketData.sourcePrice.change24h.toFixed(2)}% (24h)
                  </div>
                )}
              </div>
            )}
            {intent.marketData.targetPrice && (
              <div className="rounded-md border border-border bg-muted/40 p-2">
                <div className="text-muted-foreground text-xs flex items-center gap-1">
                  {intent.target.token} Price
                  {intent.marketData.targetPrice.change24h !== 0 && (
                    intent.marketData.targetPrice.change24h > 0 ? (
                      <TrendingUp className="h-3 w-3 text-teal" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )
                  )}
                </div>
                <div className="font-mono text-sm text-foreground">
                  ${intent.marketData.targetPrice.priceUsd.toFixed(6)}
                </div>
                {intent.marketData.targetPrice.change24h !== 0 && (
                  <div className={`text-xs ${intent.marketData.targetPrice.change24h > 0 ? "text-teal" : "text-destructive"}`}>
                    {intent.marketData.targetPrice.change24h > 0 ? "+" : ""}{intent.marketData.targetPrice.change24h.toFixed(2)}% (24h)
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wallet Balance Warning */}
        {hasBalanceIssue && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
            <div className="flex items-start gap-2">
              <Wallet className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-destructive">Insufficient Balance</div>
                <div className="text-xs text-destructive/80">
                  You need {intent.source.amount.toFixed(4)} {intent.source.token} but only have {intent.walletContext?.balance.toFixed(4)} {intent.source.token} available.
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Recommended max: {intent.walletContext?.recommendedMax.toFixed(4)} {intent.source.token}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action & Constraints */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border bg-muted/40 p-2">
            <div className="text-muted-foreground">Action</div>
            <div className="font-mono text-sm text-foreground">{intent.action}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-2">
            <div className="text-muted-foreground">Max slippage</div>
            <div className="font-mono text-sm text-foreground">
              {(intent.constraints.maxSlippageBps / 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/60">
            <span className="flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5" />
              Raw JSON
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
{JSON.stringify(intent.raw, null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
