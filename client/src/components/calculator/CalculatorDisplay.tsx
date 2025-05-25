import { Card } from "@/components/ui/card";

interface CalculatorDisplayProps {
  currentInput: string;
  expression: string;
}

export function CalculatorDisplay({ currentInput, expression }: CalculatorDisplayProps) {
  return (
    <Card className="bg-muted p-4 rounded-none">
      <div className="text-right">
        <div className="text-sm text-muted-foreground h-6 mb-1 calculator-display">
          {expression || '\u00A0'} {/* Use non-breaking space to maintain height */}
        </div>
        <div className="text-3xl font-mono font-medium calculator-display">
          {currentInput}
        </div>
      </div>
    </Card>
  );
}
