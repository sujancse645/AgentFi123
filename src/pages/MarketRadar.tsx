import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Radar, ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPercentage } from "@/utils/agentMetrics";

export default function MarketRadar() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-display">Market Radar</h2>
          <p className="text-muted-foreground mt-1">Real-time scanning of the Solana ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Scanning Active</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Hot Pairs", value: "SOL/USDC", icon: Flame, change: "+5.2%", trend: "up" },
          { title: "Network TPS", value: "3,421", icon: Activity, change: "-2.1%", trend: "down" },
          { title: "Avg Fee", value: "0.00001", icon: Radar, change: "Stable", trend: "neutral" },
          { title: "Opportunities", value: "14 Found", icon: Target, change: "+3 New", trend: "up" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 font-medium ${
                stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="inline w-3 h-3 mr-1" /> : stat.trend === 'down' ? <ArrowDownRight className="inline w-3 h-3 mr-1" /> : null}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card mt-6 border border-white/10">
        <CardHeader>
          <CardTitle>Live Orderbook Anomalies</CardTitle>
          <CardDescription>Detected by AgentFi's deep-learning model.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Asset Pair</th>
                  <th className="px-4 py-3">Anomaly Type</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-bold text-primary">JUP / USDC</td>
                  <td className="px-4 py-4">Whale accumulation detected</td>
                  <td className="px-4 py-4 text-success font-mono">94%</td>
                  <td className="px-4 py-4"><Button size="sm" variant="secondary">Analyze</Button></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-bold text-primary">BONK / SOL</td>
                  <td className="px-4 py-4">High volatility incoming</td>
                  <td className="px-4 py-4 text-warning font-mono">78%</td>
                  <td className="px-4 py-4"><Button size="sm" variant="secondary">Analyze</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Temporary import for Target icon to avoid TS error
import { Target } from "lucide-react";
