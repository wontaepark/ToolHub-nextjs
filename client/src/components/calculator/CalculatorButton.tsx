import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalculatorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary";
}

export function CalculatorButton({
  children,
  variant = "default",
  className,
  ...props
}: CalculatorButtonProps) {
  return (
    <button
      className={cn(
        "calculator-btn rounded-lg p-3 font-medium transition-colors",
        variant === "default" && "bg-card hover:bg-muted/80 dark:hover:bg-muted/20",
        variant === "primary" && "bg-primary hover:bg-primary/90 text-white",
        variant === "secondary" && "bg-muted hover:bg-muted/80 dark:hover:bg-muted/20",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
