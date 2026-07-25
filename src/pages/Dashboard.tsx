import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { 
  Wallet, Bot, Command, LayoutGrid, PieChart, Beaker, Globe2, 
  Compass, FileText, MessageSquare, Monitor, Play, ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useAgentStore } from "@/store/useAgentStore";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { demoPortfolio, PersonaType } from "@/services/demoPortfolio";

// Core Components
import { GlobalSystemStatus } from "@/components/dashboard/GlobalSystemStatus";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { CollaborationPipeline } from "@/components/dashboard/CollaborationPipeline";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { AgentConsensus } from "@/components/dashboard/AgentConsensus";
import { AgentMemory } from "@/components/dashboard/AgentMemory";

// Portfolio Components
import { WalletIntelligence } from "@/components/dashboard/WalletIntelligence";
import { FinancialHealth } from "@/components/dashboard/FinancialHealth";
import { AssetAllocation } from "@/components/dashboard/AssetAllocation";
import { PortfolioRiskEngine } from "@/components/dashboard/PortfolioRiskEngine";
import { RecommendationsFeed } from "@/components/dashboard/RecommendationsFeed";
import { PerformanceTracker } from "@/components/dashboard/PerformanceTracker";

// Strategy Components
import { StrategyLab } from "@/components/dashboard/StrategyLab";
import { CopilotPanel } from "@/components/dashboard/CopilotPanel";

// Market Components
import { MarketIntelligence } from "@/components/dashboard/MarketIntelligence";
import { OpportunityRadar } from "@/components/dashboard/OpportunityRadar";

// Phase 4 & 4.5 Components
import { ExecutiveBriefing } from "@/components/dashboard/ExecutiveBriefing";
import { ExecutiveInsights } from "@/components/dashboard/ExecutiveInsights";
import { TrustCenter } from "@/components/dashboard/TrustCenter";
import { AIValueGenerated } from "@/components/dashboard/AIValueGenerated";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecommendationCenter } from "@/components/dashboard/RecommendationCenter";
import { StrategyMarketplace } from "@/components/dashboard/StrategyMarketplace";
import { StrategyExecutionCenter } from "@/components/dashboard/StrategyExecutionCenter";
import { AgentDebate } from "@/components/dashboard/AgentDebate";
import { AgentPerformance } from "@/components/dashboard/AgentPerformance";
import { FinancialJournal } from "@/components/dashboard/FinancialJournal";

// Reports & Demo
import { PortfolioReport } from "@/components/reports/PortfolioReport";
import { JudgeMode } from "@/components/demo/JudgeMode";
import { PresentationMode } from "@/components/demo/PresentationMode";

type Tab = "command" | "portfolio" | "strategy" | "market" | "executive" | "reports" | "copilot" | "presentation" | "judge";

export default function Dashboard() {
  useBackendHealth(); // Initialize backend polling/fallback
  
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { agents } = useAgentStore();
  const [activeTab, setActiveTab] = useState<Tab>("command");
  const [, setForceRender] = useState(0);

  const tabs = [
    { id: "command", label: "Command Center", icon: LayoutGrid },
    { id: "portfolio", label: "Portfolio Intelligence", icon: PieChart },
    { id: "strategy", label: "Strategy Lab", icon: Beaker },
    { id: "market", label: "Market Signals", icon: Globe2 },
    { id: "executive", label: "Executive Insights", icon: Compass },
    { id: "reports", label: "Enterprise Reports", icon: FileText },
    { id: "copilot", label: "AI Copilot", icon: MessageSquare },
    { id: "presentation", label: "Presentation Mode", icon: Monitor },
    { id: "judge", label: "Judge Demo", icon: Play },
  ];

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    demoPortfolio.setPersona(e.target.value as PersonaType);
    setForceRender(prev => prev + 1);
  };

  return (
    <div className="flex-1 flex w-full max-w-[1800px] mx-auto h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-border/40 p-4 flex flex-col h-full bg-background/50 shrink-0">
        <div className="mb-8 px-2 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Command className="w-5 h-5 text-primary" />
            AgentFi OS
          </h2>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Core Systems</div>
          {tabs.slice(0, 4).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group", activeTab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
          
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-2 px-2">Executive</div>
          {tabs.slice(4, 7).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group", activeTab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}

          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-2 px-2">Demo Tools</div>
          {tabs.slice(7).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group", activeTab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/40">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block px-2">Demo Persona</label>
          <select 
            value={demoPortfolio.getPersona()} 
            onChange={handlePersonaChange}
            className="w-full bg-background border border-border/50 rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
          >
            <option value="whale">Whale Investor</option>
            <option value="defi_farmer">DeFi Farmer</option>
            <option value="conservative">Conservative</option>
            <option value="beginner">Beginner</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 relative min-w-0">
        {/* Top Action Bar */}
        <div className="absolute top-6 right-8 z-10 flex items-center gap-3">
          <Link to="/agents">
            <Button className="gap-2 bg-gradient-primary text-white hover:opacity-90 glow-btn rounded-xl h-10 px-4 shadow-lg shadow-primary/20">
              <Bot className="w-4 h-4" /> New Intent
            </Button>
          </Link>
          {!connected && (
            <Button variant="outline" onClick={() => setVisible(true)} className="gap-2 glass-panel hover:bg-white/5 border-border rounded-xl h-10 px-4">
              <Wallet className="w-4 h-4" /> Connect
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* COMMAND CENTER */}
          {activeTab === "command" && (
            <motion.div key="command" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-7xl mx-auto pt-2">
              <ExecutiveBriefing />
              <GlobalSystemStatus />
              <SystemHealth />
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <AgentCard agent={agents.planner} />
                <AgentCard agent={agents.risk} />
                <AgentCard agent={agents.market} />
                <AgentCard agent={agents.execution} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                  <CollaborationPipeline />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TrustCenter />
                    <AIValueGenerated />
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <AgentDebate />
                  <LiveActivityFeed />
                </div>
              </div>
            </motion.div>
          )}

          {/* PORTFOLIO INTELLIGENCE */}
          {activeTab === "portfolio" && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-7xl mx-auto pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FinancialHealth />
                </div>
                <div>
                  <WalletIntelligence />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[400px]">
                  <AssetAllocation />
                  <PortfolioRiskEngine />
                </div>
                <div className="h-[400px]">
                  <PerformanceTracker />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto md:h-[400px]">
                <AgentPerformance />
                <FinancialJournal />
              </div>
            </motion.div>
          )}

          {/* STRATEGY LAB */}
          {activeTab === "strategy" && (
            <motion.div key="strategy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-7xl mx-auto pt-2">
              <StrategyLab />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[500px]">
                  <StrategyMarketplace />
                </div>
                <div className="h-[500px]">
                  <StrategyExecutionCenter />
                </div>
              </div>
            </motion.div>
          )}

          {/* MARKET SIGNALS */}
          {activeTab === "market" && (
            <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-7xl mx-auto pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
                <MarketIntelligence />
                <OpportunityRadar />
              </div>
            </motion.div>
          )}

          {/* EXECUTIVE INSIGHTS */}
          {activeTab === "executive" && (
            <motion.div key="executive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-7xl mx-auto pt-2">
              <ExecutiveBriefing />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-[400px]">
                  <ExecutiveInsights />
                </div>
                <div className="lg:col-span-2 h-[400px]">
                  <RecommendationCenter />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <div className="lg:col-span-2">
                  <AgentDebate />
                </div>
                <div>
                  <QuickActions />
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-5xl mx-auto pt-10 pb-20">
              <PortfolioReport />
            </motion.div>
          )}

          {/* AI COPILOT */}
          {activeTab === "copilot" && (
            <motion.div key="copilot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto h-[600px] pt-10">
              <CopilotPanel />
            </motion.div>
          )}

          {/* PRESENTATION MODE */}
          {activeTab === "presentation" && (
            <motion.div key="presentation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto pt-10">
              <PresentationMode />
            </motion.div>
          )}

          {/* JUDGE DEMO */}
          {activeTab === "judge" && (
            <motion.div key="judge" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto pt-10">
              <JudgeMode />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
