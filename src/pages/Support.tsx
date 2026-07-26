import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function Support() {
  return (
    <div className="container max-w-4xl py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Support Center</h1>
          <p className="text-muted-foreground mt-2">Need help? Get in touch with our team.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <CardHeader>
              <HelpCircle className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Read our detailed guides and API references.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.open("https://docs.agentfi.io", "_blank")} className="w-full">View Docs</Button>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Community</CardTitle>
              <CardDescription>Join our Discord server to get help from others.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.open("https://discord.gg/agentfi", "_blank")} variant="secondary" className="w-full text-white/70 hover:text-white">Join Discord</Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors">
            <CardHeader>
              <Mail className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Send us an email for account-related issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => {
                toast.success("Support Ticket Created", { description: "Our team will reach out to your registered email." });
              }} variant="outline" className="w-full border-white/20 hover:bg-white/10">Contact Us</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
