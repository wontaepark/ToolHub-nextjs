import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorButton } from "./CalculatorButton";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { CalculatorHistory } from "./CalculatorHistory";
import { useCalculatorEnhanced } from "@/hooks/use-calculator-enhanced";

interface CalculatorProps {
  showHistory?: boolean;
}

export function Calculator({
  currentInput,
  expression,
  onNumberClick,
  onOperationClick,
  onClearClick,
  onClearEntryClick,
  onBackspaceClick,
  onDecimalClick,
  onEqualsClick,
  onNegateClick
}: CalculatorProps) {
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers
      if (/^[0-9]$/.test(e.key)) {
        onNumberClick(e.key);
      }
      
      // Operations
      switch (e.key) {
        case '+':
          onOperationClick('add');
          break;
        case '-':
          onOperationClick('subtract');
          break;
        case '*':
          onOperationClick('multiply');
          break;
        case '/':
          e.preventDefault(); // Prevent browser search
          onOperationClick('divide');
          break;
        case '%':
          onOperationClick('percent');
          break;
        case '.':
          onDecimalClick();
          break;
        case 'Enter':
          onEqualsClick();
          break;
        case 'Escape':
          onClearClick();
          break;
        case 'Backspace':
          onBackspaceClick();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onNumberClick, 
    onOperationClick, 
    onClearClick, 
    onBackspaceClick, 
    onDecimalClick, 
    onEqualsClick
  ]);

  return (
    <div className="w-full md:w-1/2 lg:w-1/3">
      <Card className="overflow-hidden">
        {/* Calculator Display */}
        <CalculatorDisplay currentInput={currentInput} expression={expression} />
        
        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-1 p-3">
          {/* Row 1 */}
          <CalculatorButton variant="secondary" onClick={onClearEntryClick}>CE</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={onClearClick}>C</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={onBackspaceClick}>
            <i className="ri-delete-back-2-line"></i>
          </CalculatorButton>
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('divide')}>÷</CalculatorButton>
          
          {/* Row 2 */}
          <CalculatorButton onClick={() => onNumberClick('7')}>7</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('8')}>8</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('9')}>9</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('multiply')}>×</CalculatorButton>
          
          {/* Row 3 */}
          <CalculatorButton onClick={() => onNumberClick('4')}>4</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('5')}>5</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('6')}>6</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('subtract')}>-</CalculatorButton>
          
          {/* Row 4 */}
          <CalculatorButton onClick={() => onNumberClick('1')}>1</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('2')}>2</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('3')}>3</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('add')}>+</CalculatorButton>
          
          {/* Row 5 */}
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('percent')}>%</CalculatorButton>
          <CalculatorButton onClick={() => onNumberClick('0')}>0</CalculatorButton>
          <CalculatorButton onClick={onDecimalClick}>.</CalculatorButton>
          <CalculatorButton variant="primary" onClick={onEqualsClick}>=</CalculatorButton>
          
          {/* Row 6 */}
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('square')}>x²</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('sqrt')}>√x</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={() => onOperationClick('reciprocal')}>1/x</CalculatorButton>
          <CalculatorButton variant="secondary" onClick={onNegateClick}>±</CalculatorButton>
        </div>
      </Card>
      
      <KeyboardShortcuts />
    </div>
  );
}
