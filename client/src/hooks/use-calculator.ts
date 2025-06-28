import { useState, useEffect } from 'react';
import { calculateResult, formatOperation, HistoryItem } from '@/lib/calculator';

interface CalculatorState {
  currentInput: string;
  previousInput: string | null;
  operation: string | null;
  shouldResetInput: boolean;
  expression: string;
  history: HistoryItem[];
  memory: number;
  error: string | null;
  lastResult: string | null;
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    currentInput: '0',
    previousInput: null,
    operation: null,
    shouldResetInput: false,
    expression: '',
    history: [],
    memory: 0,
    error: null,
    lastResult: null
  });

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('calculatorHistory');
      if (savedHistory) {
        setState(prev => ({
          ...prev,
          history: JSON.parse(savedHistory)
        }));
      }
    } catch (error) {
      console.error('Failed to load calculator history:', error);
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(state.history));
    } catch (error) {
      console.error('Failed to save calculator history:', error);
    }
  }, [state.history]);

  // Helper function to update state
  const updateState = (newState: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Number input handler
  const handleNumberInput = (number: string) => {
    if (state.shouldResetInput) {
      updateState({
        currentInput: number,
        shouldResetInput: false
      });
    } else {
      updateState({
        currentInput: state.currentInput === '0' ? number : state.currentInput + number
      });
    }
  };

  // Decimal input handler
  const handleDecimalInput = () => {
    if (state.shouldResetInput) {
      updateState({
        currentInput: '0.',
        shouldResetInput: false
      });
    } else if (!state.currentInput.includes('.')) {
      updateState({
        currentInput: state.currentInput + '.'
      });
    }
  };

  // Operation handler
  const handleOperation = (operation: string) => {
    if (state.operation && !state.shouldResetInput) {
      // Perform the previous operation
      calculate();
    }

    updateState({
      previousInput: state.currentInput,
      operation: operation,
      shouldResetInput: true,
      expression: `${state.currentInput} ${formatOperation(operation)}`
    });
  };

  // Calculate result
  const calculate = () => {
    if (!state.operation && !state.previousInput) return;

    const prev = parseFloat(state.previousInput || state.currentInput);
    const current = parseFloat(state.currentInput);
    
    // For operations that don't require a second operand
    const isSingleOperandOperation = ['square', 'sqrt', 'reciprocal'].includes(state.operation || '');
    
    // Build expression string
    let expressionText = '';
    if (isSingleOperandOperation) {
      expressionText = `${formatOperation(state.operation!)}${state.previousInput}`;
    } else {
      expressionText = `${state.previousInput} ${formatOperation(state.operation!)} ${state.currentInput}`;
    }
    
    const result = calculateResult(prev, current, state.operation || '');
    
    // Add to history if this isn't a continued calculation
    if (!state.shouldResetInput) {
      const historyItem: HistoryItem = {
        expression: expressionText,
        result: result.toString()
      };
      
      updateState({
        history: [historyItem, ...state.history.slice(0, 99)] // Limit history to 100 items
      });
    }
    
    updateState({
      currentInput: result.toString(),
      previousInput: null,
      operation: null,
      shouldResetInput: true,
      expression: `${expressionText} =`
    });
  };

  // Clear all
  const clear = () => {
    updateState({
      currentInput: '0',
      previousInput: null,
      operation: null,
      shouldResetInput: false,
      expression: ''
    });
  };

  // Clear entry
  const clearEntry = () => {
    updateState({
      currentInput: '0'
    });
  };

  // Backspace
  const backspace = () => {
    updateState({
      currentInput: state.currentInput.length > 1 ? state.currentInput.slice(0, -1) : '0'
    });
  };

  // Negate
  const negate = () => {
    updateState({
      currentInput: (parseFloat(state.currentInput) * -1).toString()
    });
  };

  // Clear history
  const clearHistory = () => {
    updateState({ history: [] });
  };

  // Use result from history
  const useHistoryResult = (result: string) => {
    updateState({
      currentInput: result,
      previousInput: null,
      operation: null,
      shouldResetInput: false,
      expression: ''
    });
  };

  return {
    state,
    operations: {
      handleNumberInput,
      handleDecimalInput,
      handleOperation,
      calculate,
      clear,
      clearEntry,
      backspace,
      negate
    },
    calculations: {
      clearHistory,
      useHistoryResult
    }
  };
}
