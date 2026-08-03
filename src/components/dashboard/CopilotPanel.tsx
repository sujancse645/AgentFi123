import { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles, User, Bot, Loader2, RefreshCcw } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { agentApi } from "@/services/agentApi";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export function CopilotPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { publicKey } = useWallet();

  const prompts = [
    "Why is my risk score high?",
    "What should I do with idle SOL?",
    "How can I increase yield?",
    "Rebalance my portfolio"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await agentApi.copilotChat(text, publicKey?.toBase58());
      setMessages(prev => [...prev, { role: "assistant", content: response.answer }]);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to connect to Copilot.");
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request right now.", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel border border-primary/30 rounded-2xl p-6 h-full flex flex-col bg-gradient-to-br from-primary/5 to-transparent shadow-[0_0_30px_rgba(124,92,252,0.1)]">
      <h3 className="font-display font-bold flex items-center gap-2 mb-2 shrink-0">
        <Sparkles className="w-5 h-5 text-primary" />
        Financial Copilot
      </h3>
      
      {messages.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-6 shrink-0">
          Ask the AI to analyze your portfolio or generate a specific strategy.
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar mb-4 space-y-4 pt-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm' : 
                msg.isError ? 'bg-destructive/10 text-destructive rounded-tl-sm border border-destructive/20' : 
                'bg-primary/10 text-foreground rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-primary/10 rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="shrink-0 flex flex-col justify-end mt-auto">
        {messages.length === 0 && (
          <div className="space-y-2 mb-4">
            {prompts.map(p => (
              <button 
                key={p} 
                onClick={() => handleSend(p)}
                className="w-full text-left bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors border border-white/5 rounded-lg px-4 py-2.5 text-sm text-foreground/80 flex items-center justify-between group"
              >
                {p}
                <MessageSquare className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputValue);
            }}
            placeholder="Ask AgentFi anything..." 
            className="w-full bg-background/50 border border-border/50 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
