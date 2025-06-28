import { useState, useEffect, useCallback } from 'react';
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

export function useCalculatorEnhanced() {
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
      const savedMemory = localStorage.getItem('calculatorMemory');
      if (savedHistory || savedMemory) {
        setState(prev => ({
          ...prev,
          history: savedHistory ? JSON.parse(savedHistory) : [],
          memory: savedMemory ? parseFloat(savedMemory) : 0
        }));
      }
    } catch (error) {
      console.error('Failed to load calculator data:', error);
    }
  }, []);

  // Save history and memory to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(state.history));
      localStorage.setItem('calculatorMemory', state.memory.toString());
    } catch (error) {
      console.error('Failed to save calculator data:', error);
    }
  }, [state.history, state.memory]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const handleNumber = useCallback((num: string) => {
    clearError();
    setState(prev => {
      if (prev.shouldResetInput || prev.currentInput === '0') {
        return {
          ...prev,
          currentInput: num,
          shouldResetInput: false,
          expression: prev.shouldResetInput ? num : prev.expression + num
        };
      }
      
      return {
        ...prev,
        currentInput: prev.currentInput + num,
        expression: prev.expression + num
      };
    });
  }, [clearError]);

  const handleOperation = useCallback((operation: string) => {
    clearError();
    setState(prev => {
      try {
        let newCurrentInput = prev.currentInput;
        let newExpression = prev.expression;

        // Handle special operations
        if (['square', 'sqrt', 'reciprocal', 'percent'].includes(operation)) {
          const current = parseFloat(prev.currentInput);
          let result: number;

          switch (operation) {
            case 'square':
              result = current * current;
              newExpression = `sqr(${current})`;
              break;
            case 'sqrt':
              if (current < 0) {
                throw new Error('음수의 제곱근을 계산할 수 없습니다');
              }
              result = Math.sqrt(current);
              newExpression = `√(${current})`;
              break;
            case 'reciprocal':
              if (current === 0) {
                throw new Error('0으로 나눌 수 없습니다');
              }
              result = 1 / current;
              newExpression = `1/(${current})`;
              break;
            case 'percent':
              result = current / 100;
              newExpression = `${current}%`;
              break;
            default:
              result = current;
          }

          newCurrentInput = result.toString();
          
          return {
            ...prev,
            currentInput: newCurrentInput,
            expression: newExpression,
            shouldResetInput: true,
            lastResult: newCurrentInput
          };
        }

        // Handle regular operations
        if (prev.operation && prev.previousInput && !prev.shouldResetInput) {
          const result = calculateResult(
            parseFloat(prev.previousInput),
            parseFloat(prev.currentInput),
            prev.operation
          );
          
          if (!isFinite(result)) {
            throw new Error('유효하지 않은 계산입니다');
          }

          newCurrentInput = result.toString();
          newExpression = `${prev.previousInput} ${formatOperation(prev.operation)} ${prev.currentInput} = ${result}`;
          
          const historyItem: HistoryItem = {
            expression: newExpression,
            result: newCurrentInput
          };

          return {
            ...prev,
            currentInput: newCurrentInput,
            previousInput: newCurrentInput,
            operation,
            shouldResetInput: true,
            expression: newCurrentInput + ` ${formatOperation(operation)} `,
            history: [historyItem, ...prev.history].slice(0, 50),
            lastResult: newCurrentInput
          };
        }

        return {
          ...prev,
          previousInput: prev.currentInput,
          operation,
          shouldResetInput: true,
          expression: prev.currentInput + ` ${formatOperation(operation)} `
        };
      } catch (error) {
        return {
          ...prev,
          error: error instanceof Error ? error.message : '계산 오류가 발생했습니다',
          currentInput: '0',
          shouldResetInput: true
        };
      }
    });
  }, [clearError]);

  const handleEquals = useCallback(() => {
    clearError();
    setState(prev => {
      try {
        if (!prev.operation || !prev.previousInput) {
          return prev;
        }

        const result = calculateResult(
          parseFloat(prev.previousInput),
          parseFloat(prev.currentInput),
          prev.operation
        );

        if (!isFinite(result)) {
          throw new Error('유효하지 않은 계산입니다');
        }

        const finalExpression = `${prev.previousInput} ${formatOperation(prev.operation)} ${prev.currentInput} = ${result}`;
        
        const historyItem: HistoryItem = {
          expression: finalExpression,
          result: result.toString()
        };

        return {
          ...prev,
          currentInput: result.toString(),
          previousInput: null,
          operation: null,
          shouldResetInput: true,
          expression: finalExpression,
          history: [historyItem, ...prev.history].slice(0, 50),
          lastResult: result.toString()
        };
      } catch (error) {
        return {
          ...prev,
          error: error instanceof Error ? error.message : '계산 오류가 발생했습니다',
          currentInput: '0',
          shouldResetInput: true
        };
      }
    });
  }, [clearError]);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentInput: '0',
      previousInput: null,
      operation: null,
      shouldResetInput: false,
      expression: '',
      error: null
    }));
  }, []);

  const handleClearEntry = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentInput: '0',
      error: null
    }));
  }, []);

  const handleBackspace = useCallback(() => {
    clearError();
    setState(prev => {
      if (prev.currentInput.length <= 1 || prev.currentInput === '0') {
        return { ...prev, currentInput: '0' };
      }
      
      const newInput = prev.currentInput.slice(0, -1);
      return {
        ...prev,
        currentInput: newInput,
        expression: prev.expression.slice(0, -1)
      };
    });
  }, [clearError]);

  const handleDecimal = useCallback(() => {
    clearError();
    setState(prev => {
      if (prev.currentInput.includes('.')) {
        return prev;
      }
      
      if (prev.shouldResetInput) {
        return {
          ...prev,
          currentInput: '0.',
          shouldResetInput: false,
          expression: '0.'
        };
      }
      
      return {
        ...prev,
        currentInput: prev.currentInput + '.',
        expression: prev.expression + '.'
      };
    });
  }, [clearError]);

  const handleNegate = useCallback(() => {
    clearError();
    setState(prev => {
      const current = parseFloat(prev.currentInput);
      const negated = (-current).toString();
      
      return {
        ...prev,
        currentInput: negated,
        expression: prev.expression.replace(prev.currentInput, negated)
      };
    });
  }, [clearError]);

  // Memory functions
  const memoryAdd = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: prev.memory + parseFloat(prev.currentInput)
    }));
  }, []);

  const memorySubtract = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: prev.memory - parseFloat(prev.currentInput)
    }));
  }, []);

  const memoryRecall = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentInput: prev.memory.toString(),
      shouldResetInput: true
    }));
  }, []);

  const memoryClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: 0
    }));
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(state.currentInput);
      setState(prev => ({ ...prev, lastResult: '복사됨!' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, lastResult: null }));
      }, 1000);
    } catch (error) {
      setState(prev => ({ ...prev, error: '클립보드 복사에 실패했습니다' }));
    }
  }, [state.currentInput]);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: []
    }));
  }, []);

  return {
    ...state,
    handleNumber,
    handleOperation,
    handleEquals,
    handleClear,
    handleClearEntry,
    handleBackspace,
    handleDecimal,
    handleNegate,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    copyToClipboard,
    clearHistory,
    clearError
  };
}