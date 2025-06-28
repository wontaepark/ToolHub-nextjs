import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalculatorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "number" | "operator" | "equals" | "function" | "memory";
  ariaLabel?: string;
}

export function CalculatorButton({
  children,
  variant = "number",
  className,
  ariaLabel,
  ...props
}: CalculatorButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "calculator-button relative overflow-hidden",
        "min-h-14 md:min-h-16 lg:min-h-14",
        "rounded-xl font-semibold text-lg md:text-xl lg:text-lg",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "active:scale-95 active:duration-75",
        "shadow-lg hover:shadow-xl",
        
        // Variant styles
        variant === "number" && [
          "bg-gradient-to-b from-white to-gray-50",
          "dark:from-gray-800 dark:to-gray-900",
          "border border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-gray-100",
          "hover:from-gray-50 hover:to-gray-100",
          "dark:hover:from-gray-700 dark:hover:to-gray-800",
          "hover:scale-105 hover:border-gray-300 dark:hover:border-gray-600"
        ],
        
        variant === "operator" && [
          "bg-gradient-to-b from-blue-500 to-blue-600",
          "hover:from-blue-400 hover:to-blue-500",
          "text-white border-0",
          "hover:scale-105",
          "shadow-blue-500/20 hover:shadow-blue-500/30"
        ],
        
        variant === "equals" && [
          "bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700",
          "hover:from-purple-500 hover:via-blue-500 hover:to-blue-600",
          "text-white font-bold border-0",
          "hover:scale-105",
          "shadow-purple-500/30 hover:shadow-purple-500/40",
          "animate-pulse hover:animate-none"
        ],
        
        variant === "function" && [
          "bg-gradient-to-b from-orange-400 to-orange-500",
          "hover:from-orange-300 hover:to-orange-400",
          "text-white border-0",
          "hover:scale-105",
          "shadow-orange-500/20 hover:shadow-orange-500/30"
        ],
        
        variant === "memory" && [
          "bg-gradient-to-b from-green-500 to-green-600",
          "hover:from-green-400 hover:to-green-500",
          "text-white border-0",
          "hover:scale-105",
          "shadow-green-500/20 hover:shadow-green-500/30"
        ],
        
        className
      )}
      aria-label={ariaLabel || children?.toString()}
      {...props}
    >
      {/* Click ripple effect */}
      <span className="absolute inset-0 bg-white/20 opacity-0 scale-0 rounded-xl transition-all duration-300 group-active:opacity-100 group-active:scale-100" />
      
      {children}
    </button>
  );
}
