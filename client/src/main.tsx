import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { ThemeProvider } from "./components/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// 콘솔 로그 필터링 - 개발 모드에서 불필요한 로그 차단
if (import.meta.env.DEV) {
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const message = args.join(' ');
    // Vite 관련 로그 필터링 
    if (message.includes('[vite]') || 
        message.includes('connected') ||
        message.includes('connecting') ||
        message.includes('server connection') ||
        message.includes('WebSocket') ||
        message.includes('HMR')) {
      return; // 로그를 출력하지 않음
    }
    originalLog(...args);
  };
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
