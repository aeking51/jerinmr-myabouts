import { TerminalPortfolio } from "@/components/TerminalPortfolio";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  useVisitorTracking();
  
  return <TerminalPortfolio />;
};

export default Index;
