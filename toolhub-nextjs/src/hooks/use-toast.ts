import * as React from "react"

// Hook for toast notifications (simplified version)
export function useToast() {
  const toast = React.useCallback((props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
    // Simple alert for now - can be enhanced with proper toast component
    const message = props.title ? `${props.title}: ${props.description}` : props.description;
    alert(message);
  }, []);

  return { toast };
}