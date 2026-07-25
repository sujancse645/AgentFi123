const fs = require('fs');
const path = require('path');

const files = [
  'src/components/dashboard/ExecutiveBriefing.tsx',
  'src/components/dashboard/FinancialHealth.tsx',
  'src/components/dashboard/RecommendationsFeed.tsx',
  'src/components/dashboard/WhyThisRecommendation.tsx',
  'src/components/intent/SimulationPanel.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Add import if not present
  if (!content.includes('formatPercentage') && content.match(/\{.*confidence.*?\}%/i)) {
    content = `import { formatPercentage } from "@/utils/agentMetrics";\n` + content;
  }
  
  // Replace {x.confidence}% with {formatPercentage(x.confidence)}
  content = content.replace(/\{([a-zA-Z0-9_.]+\.confidence)\}%/g, '{formatPercentage($1)}');
  
  // Replace {x.executionConfidence}% with {formatPercentage(x.executionConfidence)}
  content = content.replace(/\{([a-zA-Z0-9_.]+\.executionConfidence)\}%/g, '{formatPercentage($1)}');

  fs.writeFileSync(fullPath, content);
});
console.log('Fixed confidence format');
