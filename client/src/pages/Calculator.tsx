import { useState } from "react";
import { Calculator } from "@/components/calculator/Calculator";
import { CalculatorHistory } from "@/components/calculator/CalculatorHistory";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCalculator } from "@/hooks/use-calculator";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("calculator");
  const { state, operations, calculations } = useCalculator();

  return (
    <div>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Calculator 
              currentInput={state.currentInput}
              expression={state.expression}
              onNumberClick={operations.handleNumberInput}
              onOperationClick={operations.handleOperation}
              onClearClick={operations.clear}
              onClearEntryClick={operations.clearEntry}
              onBackspaceClick={operations.backspace}
              onDecimalClick={operations.handleDecimalInput}
              onEqualsClick={operations.calculate}
              onNegateClick={() => operations.negate()}
            />
            
            <CalculatorHistory 
              history={state.history} 
              onClearHistory={calculations.clearHistory}
              onUseResult={calculations.useHistoryResult}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
