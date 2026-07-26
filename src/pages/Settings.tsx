import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="container max-w-4xl py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">System Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your AgentFi operating system configuration.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>RPC Configuration</CardTitle>
              <CardDescription>Manage your Solana RPC endpoints.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Primary Endpoint</p>
                  <p className="text-sm font-mono mt-1 text-primary">https://api.mainnet-beta.solana.com</p>
                </div>
                <Button variant="secondary" className="w-full text-white/70 hover:text-white">Update RPC URL</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>AI Preferences</CardTitle>
              <CardDescription>Configure the underlying LLM engine.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Model</p>
                  <p className="text-sm font-mono mt-1 text-primary">Deterministic Provider (Mock)</p>
                </div>
                <Button variant="secondary" className="w-full text-white/70 hover:text-white">Change Model</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
