import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayCircle, Database, Box, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Simulation() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-display">Simulation Studio</h2>
          <p className="text-muted-foreground mt-1">Test complex multi-step intentions without committing real funds.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
          <PlayCircle className="w-4 h-4" /> Run New Simulation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Testnet Environment</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Devnet Local</div>
            <p className="text-xs text-muted-foreground mt-1">Synced to slot 245,892,101</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Virtual Balance</CardTitle>
            <Box className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">100,000 USDC</div>
            <p className="text-xs text-muted-foreground mt-1">Refreshed 2 hours ago</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Execution Engine</CardTitle>
            <Zap className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Active</div>
            <p className="text-xs text-muted-foreground mt-1">0ms latency to local RPC</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card mt-6 border border-white/10">
        <CardHeader>
          <CardTitle>Recent Simulations</CardTitle>
          <CardDescription>History of your dry-run transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
              <div>
                <div className="font-semibold">Arbitrage Loop: USDC -\u003E RAY -\u003E SOL -\u003E USDC</div>
                <div className="text-xs text-muted-foreground mt-1">Simulated 10 mins ago</div>
              </div>
              <div className="text-right">
                <div className="text-success font-bold">+1.2% Profit</div>
                <div className="text-xs text-muted-foreground">Gas: 0.00001 SOL</div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
              <div>
                <div className="font-semibold">Flash Loan Liquidator</div>
                <div className="text-xs text-muted-foreground mt-1">Simulated 1 hr ago</div>
              </div>
              <div className="text-right">
                <div className="text-destructive font-bold">Failed: Insufficient Liquidity</div>
                <div className="text-xs text-muted-foreground">Reverted</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
