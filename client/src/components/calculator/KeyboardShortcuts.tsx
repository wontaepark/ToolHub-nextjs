import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";

export function KeyboardShortcuts() {
  const { t } = useTranslation();
  
  const shortcuts = [
    { key: "0-9", desc: t('calculator.shortcuts.numbers') },
    { key: "+, -, *, /", desc: t('calculator.shortcuts.operations') },
    { key: "Enter", desc: t('calculator.shortcuts.equals') },
    { key: "Escape", desc: t('calculator.shortcuts.clear') },
    { key: "Backspace", desc: t('calculator.shortcuts.backspace') },
    { key: ".", desc: t('calculator.shortcuts.decimal') }
  ];

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">{t('calculator.shortcuts.title')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="bg-muted rounded px-2 py-1 font-mono">{shortcut.key}</span>
              <span className="text-card-foreground">{shortcut.desc}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
