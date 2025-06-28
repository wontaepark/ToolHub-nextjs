import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, History, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatorDisplayProps {
  currentInput: string;
  expression: string;
  error: string | null;
  lastResult: string | null;
  memory: number;
  onCopy: () => void;
  onClearHistory: () => void;
  showHistory?: boolean;
}

export function CalculatorDisplay({ 
  currentInput, 
  expression, 
  error, 
  lastResult, 
  memory,
  onCopy,
  onClearHistory,
  showHistory = false
}: CalculatorDisplayProps) {
  return (
    <Card className="mb-4 overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 group">
      <CardContent className="p-0 relative">
        {/* Memory indicator */}
        {memory !== 0 && (
          <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-2">
            <div className="text-xs text-green-700 dark:text-green-300 font-mono">
              Memory: {memory}
            </div>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 animate-pulse">
            <div className="text-sm text-red-700 dark:text-red-300 font-medium">
              ⚠️ {error}
            </div>
          </div>
        )}
        
        {/* Last result notification */}
        {lastResult && lastResult !== currentInput && !error && (
          <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2">
            <div className="text-xs text-blue-700 dark:text-blue-300 font-mono">
              {lastResult === '복사됨!' ? '📋 ' : '✨ '}{lastResult}
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="text-right space-y-3">
            {/* Expression display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showHistory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Clear history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground min-h-[1.25rem] font-mono max-w-[70%] truncate">
                {expression || '\u00A0'}
              </div>
            </div>
            
            {/* Main display */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy result to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <div 
                className={cn(
                  "text-right transition-all duration-300",
                  "font-mono font-bold leading-none",
                  "text-2xl sm:text-3xl md:text-4xl lg:text-3xl",
                  error ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
                )}
                style={{
                  fontSize: currentInput.length > 12 ? '1.5rem' : 
                           currentInput.length > 8 ? '2rem' : undefined
                }}
              >
                {error ? 'Error' : currentInput}
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated border for active state */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
      </CardContent>
    </Card>
  );
}
