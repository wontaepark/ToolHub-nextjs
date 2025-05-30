import { Calculator } from "@/components/calculator/Calculator";
import { CalculatorHistory } from "@/components/calculator/CalculatorHistory";
import { useCalculator } from "@/hooks/use-calculator";

export default function CalculatorPage() {
  const { state, operations, calculations } = useCalculator();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">계산기</h2>
        <p className="text-muted-foreground">
          기본 사칙연산과 고급 기능을 지원하는 계산기입니다. 키보드 입력도 지원합니다.
        </p>
      </div>
      
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
    </div>
  );
}
