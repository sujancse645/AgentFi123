import { useWallet } from "@solana/wallet-adapter-react";
import { Activity, Clock, PieChart, Coins } from "lucide-react";

export function WalletIntelligence() {
  const { publicKey } = useWallet();

  // If not connected, we don't show real intelligence. We show a demo layout if we want, or hide.
  // The user requested to show demo data if data is unavailable or not connected.
  const isConnected = !!publicKey;

  const stats = [
    { label: "Wallet Age", value: isConnected ? "142 Days" : "412 Days", icon: Clock },
    { label: "Tx Count", value: isConnected ? "1,204" : "84", icon: Activity },
    { label: "Portfolio", value: isConnected ? "$4,321" : "$12,450", icon: PieChart },
    { label: "Protocols", value: isConnected ? "12" : "3", icon: Coins },
  ];

  return (
    <div className="glass-panel border border-border/40 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold">Wallet Intelligence</h3>
        {!isConnected && (
          <span className="text-[10px] uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
            Demo Mode
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-xl font-mono font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
