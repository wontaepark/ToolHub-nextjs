export interface HistoryItem {
  expression: string;
  result: string;
}

export function formatOperation(operation: string): string {
  switch (operation) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '×';
    case 'divide': return '÷';
    case 'percent': return '%';
    case 'square': return '^2';
    case 'sqrt': return '√';
    case 'reciprocal': return '1/';
    case 'negate': return '-';
    default: return '';
  }
}

export function calculateResult(prevValue: number, currentValue: number, operation: string): number {
  let result: number;

  switch (operation) {
    case 'add':
      result = prevValue + currentValue;
      break;
    case 'subtract':
      result = prevValue - currentValue;
      break;
    case 'multiply':
      result = prevValue * currentValue;
      break;
    case 'divide':
      // Check for division by zero
      if (currentValue === 0) {
        return NaN; // Return NaN for division by zero
      }
      result = prevValue / currentValue;
      break;
    case 'percent':
      result = prevValue * (currentValue / 100);
      break;
    case 'square':
      result = prevValue * prevValue;
      break;
    case 'sqrt':
      // Check for negative number
      if (prevValue < 0) {
        return NaN; // Return NaN for square root of negative number
      }
      result = Math.sqrt(prevValue);
      break;
    case 'reciprocal':
      // Check for division by zero
      if (prevValue === 0) {
        return NaN; // Return NaN for division by zero
      }
      result = 1 / prevValue;
      break;
    default:
      result = currentValue;
  }

  // Format the result to avoid floating-point precision issues
  // but keep it as a number for calculations
  const resultStr = result.toString();
  
  // If the result has more than 12 digits or is in scientific notation
  if (resultStr.length > 12 || resultStr.includes('e')) {
    // Format to scientific notation with reasonable precision
    return parseFloat(result.toPrecision(10));
  }
  
  return result;
}

// Format a number for display (e.g., adding commas for thousands)
export function formatNumberForDisplay(value: string): string {
  // Handle special cases like NaN, Infinity
  if (value === 'NaN' || value === 'Infinity' || value === '-Infinity') {
    return value;
  }

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = value.split('.');
  
  // Format the integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Return the formatted number
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
