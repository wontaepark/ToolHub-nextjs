import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorButton } from "./CalculatorButton";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { CalculatorHistory } from "./CalculatorHistory";
import { useCalculatorEnhanced } from "@/hooks/use-calculator-enhanced";

interface EnhancedCalculatorProps {
  showHistory?: boolean;
}

export function EnhancedCalculator({ showHistory = false }: EnhancedCalculatorProps) {
  const calculator = useCalculatorEnhanced();
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for calculator keys
      if (/^[0-9+\-*/.=]$/.test(e.key) || ['Enter', 'Escape', 'Backspace'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Numbers
      if (/^[0-9]$/.test(e.key)) {
        calculator.handleNumber(e.key);
      }
      
      // Operations
      switch (e.key) {
        case '+':
          calculator.handleOperation('add');
          break;
        case '-':
          calculator.handleOperation('subtract');
          break;
        case '*':
          calculator.handleOperation('multiply');
          break;
        case '/':
          calculator.handleOperation('divide');
          break;
        case '=':
        case 'Enter':
          calculator.handleEquals();
          break;
        case '.':
          calculator.handleDecimal();
          break;
        case 'Escape':
          calculator.handleClear();
          break;
        case 'Backspace':
          calculator.handleBackspace();
          break;
        case 'c':
        case 'C':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            calculator.copyToClipboard();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [calculator]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <CalculatorDisplay 
        currentInput={calculator.currentInput}
        expression={calculator.expression}
        error={calculator.error}
        lastResult={calculator.lastResult}
        memory={calculator.memory}
        onCopy={calculator.copyToClipboard}
        onClearHistory={calculator.clearHistory}
        showHistory={showHistory}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Calculator */}
        <div className="lg:col-span-3">
          <Card className="p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="grid grid-cols-4 gap-3">
              
              {/* Row 1: Clear and Division */}
              <CalculatorButton 
                variant="function" 
                onClick={calculator.handleClear}
                ariaLabel="All Clear"
              >
                AC
              </CalculatorButton>
              <CalculatorButton 
                variant="function" 
                onClick={calculator.handleClearEntry}
                ariaLabel="Clear Entry"
              >
                CE
              </CalculatorButton>
              <CalculatorButton 
                variant="function" 
                onClick={calculator.handleBackspace}
                ariaLabel="Backspace"
              >
                ⌫
              </CalculatorButton>
              <CalculatorButton 
                variant="operator" 
                onClick={() => calculator.handleOperation('divide')}
                ariaLabel="Divide"
              >
                ÷
              </CalculatorButton>
              
              {/* Row 2: 7, 8, 9, Multiply */}
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('7')}
                ariaLabel="Seven"
              >
                7
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('8')}
                ariaLabel="Eight"
              >
                8
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('9')}
                ariaLabel="Nine"
              >
                9
              </CalculatorButton>
              <CalculatorButton 
                variant="operator" 
                onClick={() => calculator.handleOperation('multiply')}
                ariaLabel="Multiply"
              >
                ×
              </CalculatorButton>
              
              {/* Row 3: 4, 5, 6, Subtract */}
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('4')}
                ariaLabel="Four"
              >
                4
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('5')}
                ariaLabel="Five"
              >
                5
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('6')}
                ariaLabel="Six"
              >
                6
              </CalculatorButton>
              <CalculatorButton 
                variant="operator" 
                onClick={() => calculator.handleOperation('subtract')}
                ariaLabel="Subtract"
              >
                -
              </CalculatorButton>
              
              {/* Row 4: 1, 2, 3, Add */}
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('1')}
                ariaLabel="One"
              >
                1
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('2')}
                ariaLabel="Two"
              >
                2
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('3')}
                ariaLabel="Three"
              >
                3
              </CalculatorButton>
              <CalculatorButton 
                variant="operator" 
                onClick={() => calculator.handleOperation('add')}
                ariaLabel="Add"
              >
                +
              </CalculatorButton>
              
              {/* Row 5: Special functions and 0 */}
              <CalculatorButton 
                variant="function" 
                onClick={() => calculator.handleOperation('percent')}
                ariaLabel="Percent"
              >
                %
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={() => calculator.handleNumber('0')}
                ariaLabel="Zero"
              >
                0
              </CalculatorButton>
              <CalculatorButton 
                variant="number" 
                onClick={calculator.handleDecimal}
                ariaLabel="Decimal point"
              >
                .
              </CalculatorButton>
              <CalculatorButton 
                variant="equals" 
                onClick={calculator.handleEquals}
                ariaLabel="Equals"
              >
                =
              </CalculatorButton>
              
              {/* Row 6: Advanced functions */}
              <CalculatorButton 
                variant="function" 
                onClick={() => calculator.handleOperation('square')}
                ariaLabel="Square"
              >
                x²
              </CalculatorButton>
              <CalculatorButton 
                variant="function" 
                onClick={() => calculator.handleOperation('sqrt')}
                ariaLabel="Square root"
              >
                √x
              </CalculatorButton>
              <CalculatorButton 
                variant="function" 
                onClick={() => calculator.handleOperation('reciprocal')}
                ariaLabel="Reciprocal"
              >
                1/x
              </CalculatorButton>
              <CalculatorButton 
                variant="function" 
                onClick={calculator.handleNegate}
                ariaLabel="Plus minus"
              >
                ±
              </CalculatorButton>
              
              {/* Row 7: Memory functions */}
              <CalculatorButton 
                variant="memory" 
                onClick={calculator.memoryAdd}
                ariaLabel="Memory Add"
              >
                M+
              </CalculatorButton>
              <CalculatorButton 
                variant="memory" 
                onClick={calculator.memorySubtract}
                ariaLabel="Memory Subtract"
              >
                M-
              </CalculatorButton>
              <CalculatorButton 
                variant="memory" 
                onClick={calculator.memoryRecall}
                ariaLabel="Memory Recall"
              >
                MR
              </CalculatorButton>
              <CalculatorButton 
                variant="memory" 
                onClick={calculator.memoryClear}
                ariaLabel="Memory Clear"
              >
                MC
              </CalculatorButton>
            </div>
          </Card>
        </div>
        
        {/* History Panel */}
        {showHistory && (
          <div className="lg:col-span-2">
            <CalculatorHistory 
              history={calculator.history}
              onClearHistory={calculator.clearHistory}
              onUseResult={(result) => {
                calculator.handleClear();
                calculator.handleNumber(result);
              }}
            />
          </div>
        )}
      </div>
      
      <KeyboardShortcuts />
    </div>
  );
}