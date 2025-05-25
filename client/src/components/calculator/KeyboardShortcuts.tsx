import { Card, CardContent } from "@/components/ui/card";

export function KeyboardShortcuts() {
  const shortcuts = [
    { key: "0-9", desc: "Numbers" },
    { key: "+", desc: "Addition" },
    { key: "-", desc: "Subtraction" },
    { key: "*", desc: "Multiplication" },
    { key: "/", desc: "Division" },
    { key: "Enter", desc: "Calculate" },
    { key: "Esc", desc: "Clear All" },
    { key: "Backspace", desc: "Delete" }
  ];

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Keyboard Shortcuts</h3>
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
