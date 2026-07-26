import { FileText, Download, Printer } from "lucide-react";
import { reportEngine } from "@/services/reportEngine";
import { demoPortfolio } from "@/services/demoPortfolio";

export function PortfolioReport() {
  const pf = demoPortfolio.getPortfolio();
  const report = reportEngine.generateReport(pf);

  return (
    <div className="bg-white text-black rounded-xl p-8 max-w-4xl mx-auto shadow-2xl relative">
      <div className="absolute top-8 right-8 flex gap-2 no-print">
        <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
        <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded transition-colors" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="border-b-2 border-black/10 pb-6 mb-8 mt-4">
        <h1 className="font-display text-4xl font-black mb-2">AgentFi Enterprise</h1>
        <h2 className="text-xl text-black/60 font-semibold uppercase tracking-widest">Portfolio Intelligence Report</h2>
        <div className="mt-4 text-sm font-mono text-black/50">Generated: {report.date}</div>
      </div>

      <div className="mb-10">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-l-4 border-primary pl-3">Executive Summary</h3>
        <p className="text-lg leading-relaxed text-black/80">{report.executiveSummary}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-black/5 p-4 rounded-lg">
          <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold block mb-1">Total Value</span>
          <span className="text-2xl font-bold">${report.metrics.totalValue.toLocaleString()}</span>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold block mb-1">Risk Score</span>
          <span className="text-2xl font-bold">{report.metrics.riskScore}/100</span>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold block mb-1">Risk Level</span>
          <span className="text-2xl font-bold">{report.metrics.riskLevel}</span>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <span className="text-[10px] uppercase tracking-wider text-black/50 font-bold block mb-1">Active Assets</span>
          <span className="text-2xl font-bold">{report.metrics.activeAssets}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-l-4 border-primary pl-3">Asset Allocation</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2">Asset</th>
                <th className="text-right py-2">Allocation</th>
                <th className="text-right py-2">Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {report.assetAllocation.map((a, i) => (
                <tr key={i} className="border-b border-black/5">
                  <td className="py-2 font-bold">{a.symbol}</td>
                  <td className="text-right py-2">{a.allocation}%</td>
                  <td className="text-right py-2">${a.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-l-4 border-primary pl-3">Top AI Recommendations</h3>
          <div className="space-y-4">
            {report.topRecommendations.map((r, i) => (
              <div key={i} className="bg-black/5 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{r.title}</h4>
                  <span className="text-[10px] uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded font-bold">{r.type}</span>
                </div>
                <p className="text-xs text-black/70 mb-2">{r.reasoning}</p>
                <div className="text-xs font-semibold text-green-700">Expected: {r.expectedImpact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
