import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { HistoryItem } from "@/lib/calculator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CalculatorHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onUseResult: (result: string) => void;
}

export function CalculatorHistory({ 
  history, 
  onClearHistory,
  onUseResult
}: CalculatorHistoryProps) {
  const { t } = useTranslation();
  
  return (
    <div className="w-full md:w-1/2 lg:w-2/3">
      <Card className="h-full">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t('calculator.history.title')}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearHistory}
              className="text-sm text-muted-foreground hover:text-primary"
              disabled={history.length === 0}
            >
              {t('calculator.history.clear')}
            </Button>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-96">
            {history.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">{item.expression}</div>
                    <div className="text-lg font-medium">{item.result}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onUseResult(item.result)}
                    className="text-muted-foreground hover:text-primary"
                    aria-label={t('calculator.history.use')}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {history.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-history-line text-4xl text-muted mb-2"></i>
              <p className="text-muted-foreground">{t('calculator.history.empty')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
