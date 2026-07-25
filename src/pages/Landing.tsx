import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Zap, Bot, Target, PlayCircle, Hexagon } from "lucide-react";

// AgentFi Premium Design System Colors
const COLORS = {
  background: "#0A0A0F", // Midnight Black base
  primary: "#7C5CFC", // Electric Purple
  secondary: "#10B981", // Solana Green / Success
  textPrimary: "#F8F8FA",
  textMuted: "#8888A0",
  cardBg: "rgba(18, 18, 26, 0.7)", // Deep Navy frosted
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

export default function Landing() {
  return (
    <div
      className="min-h-screen font-sans antialiased relative overflow-hidden"
      style={{ backgroundColor: COLORS.background, color: COLORS.textPrimary }}
    >
      {/* Animated Background System */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: `radial-gradient(circle, ${COLORS.primary}40 0%, transparent 60%)`,
            top: "-30%",
            left: "-15%",
            animation: "float-slow 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${COLORS.secondary}30 0%, transparent 60%)`,
            bottom: "-20%",
            right: "-10%",
            animation: "float-slow 30s ease-in-out infinite reverse",
          }}
        />
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${COLORS.textPrimary} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.textPrimary} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.05); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(124, 92, 252, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(124, 92, 252, 0); }
          100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(124, 92, 252, 0); }
        }
        @keyframes float-particle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; }
          100% { transform: translateY(-20vh) scale(0.5); opacity: 0; }
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 10px;
          background: linear-gradient(to top, transparent, ${COLORS.primary});
          border-radius: 2px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #A88BFA 0%, #7C5CFC 50%, #10B981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .glass-panel {
          background: ${COLORS.cardBg};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${COLORS.cardBorder};
        }
        
        .glow-btn {
          box-shadow: 0 0 30px rgba(124, 92, 252, 0.4);
          transition: all 0.3s ease;
        }
        .glow-btn:hover {
          box-shadow: 0 0 45px rgba(124, 92, 252, 0.6);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Floating Particles (Simulated) */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle z-0"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `float-particle ${10 + Math.random() * 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.3 + Math.random() * 0.5
          }}
        />
      ))}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-x-0 rounded-none">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary glow-primary shadow-lg shadow-primary/20">
              <Hexagon className="h-6 w-6 text-white absolute" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Agent<span className="text-primary">Fi</span>
            </span>
          </div>
          
          <Link to="/dashboard">
            <Button
              className="glow-btn bg-primary text-white h-11 px-6 rounded-xl font-medium"
            >
              Launch AgentFi
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto text-center">
          {/* Agent Activity Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-fade-in-up">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              4 Agents Online & Ready
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your Autonomous<br />
            <span className="gradient-text">Financial Operating System</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Transform natural language into intelligent Solana actions through AI-powered agents. Analyze, simulate, and execute with precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="h-14 px-8 text-lg glow-btn bg-primary text-white rounded-xl"
              >
                Launch AgentFi →
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg glass-panel hover:bg-white/5 border-border text-textPrimary rounded-xl transition-all"
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Explore Demo
              </Button>
            </Link>
          </div>
          
          {/* Neural Network Visualization (Abstracted via CSS) */}
          <div className="mt-20 mx-auto w-full max-w-4xl h-40 glass-panel rounded-2xl p-6 relative overflow-hidden flex items-center justify-around opacity-80 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-success/10 opacity-50" />
            
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="h-12 w-12 rounded-full glass-panel flex items-center justify-center relative">
                <Target className="h-5 w-5 text-primary" />
                <div className="absolute -inset-1 rounded-full border border-primary/30" style={{ animation: 'pulse-ring 3s infinite' }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground">INTENT_PARSED</span>
            </div>
            
            <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
            
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="h-12 w-12 rounded-full glass-panel flex items-center justify-center relative">
                <BrainCircuit className="h-5 w-5 text-white" />
                <div className="absolute -inset-1 rounded-full border border-white/30" style={{ animation: 'pulse-ring 3s infinite 1s' }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground">AGENT_MESH</span>
            </div>
            
            <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-success/50" />
            
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="h-12 w-12 rounded-full glass-panel flex items-center justify-center relative">
                <Zap className="h-5 w-5 text-success" />
                <div className="absolute -inset-1 rounded-full border border-success/30" style={{ animation: 'pulse-ring 3s infinite 2s' }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground">EXECUTED</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-background/50 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Intelligence at Scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our decentralized architecture utilizes specialized agents for unparalleled execution quality on Solana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Intent Intelligence", desc: "Understand and analyze user intentions dynamically before execution using natural language." },
              { icon: Bot, title: "Agent Orchestration", desc: "Multiple specialized AI agents collaborate seamlessly to optimize transaction outcomes." },
              { icon: ShieldCheck, title: "Risk Intelligence", desc: "Evaluate security vectors, liquidity depth, and risks before every transaction is formed." },
              { icon: Zap, title: "Execution Engine", desc: "Transform validated intentions into optimized on-chain instructions instantly." },
              { icon: Activity, title: "Portfolio Intelligence", desc: "Generate AI-powered insights and actionable recommendations for your holdings." },
              { icon: PlayCircle, title: "Simulation Studio", desc: "Preview outcomes, trace logic, and test strategies in a secure sandbox before committing funds." },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto glass-panel p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <h2 className="text-4xl font-bold mb-6 font-display">Ready for the future of finance?</h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Connect your wallet and experience the power of autonomous AI agents on Solana.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="h-14 px-10 text-lg glow-btn bg-primary text-white rounded-xl"
            >
              Launch AgentFi
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold">AgentFi</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 AgentFi. AI Financial Operating System for Solana.
          </p>
        </div>
      </footer>
    </div>
  );
}
// BrainCircuit icon for local use since it might not be exported by the old lucide-react
function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M12 8h8" />
      <path d="M16 8V5a2 2 0 0 1 2-2" />
      <circle cx="16" cy="13" r=".5" />
      <circle cx="18" cy="3" r=".5" />
      <circle cx="20" cy="21" r=".5" />
      <circle cx="20" cy="8" r=".5" />
    </svg>
  );
}
