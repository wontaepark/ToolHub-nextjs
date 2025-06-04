import { useTranslation } from 'react-i18next';
import { Calculator } from "@/components/calculator/Calculator";
import { CalculatorHistory } from "@/components/calculator/CalculatorHistory";
import { useCalculator } from "@/hooks/use-calculator";
import AdSense from "@/components/AdSense";

export default function CalculatorPage() {
  const { t } = useTranslation();
  const { state, operations, calculations } = useCalculator();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('tools.calculator.title')}</h2>
        <p className="text-muted-foreground">
          {t('calculator.description')}
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
