// Access DOM elements of the calculator
const inputBox = document.getElementById('input');
const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');

// Define expression and result variables
let expression = '';
let result = '';

// Button click event handler
function buttonClick(event) {
  // Ensure we only handle clicks on buttons
  const target = event.target;
  if (!target.classList.contains('btn')) return;
  
  const action = target.dataset.action;
  // Use data-value if present; otherwise, use the button's text content
  const text = target.textContent.trim();
  const value = target.dataset.value || text;
  
  // Map operator actions to actual operator symbols
  const operatorMap = {
    addition: '+',
    subtraction: '-',
    multiplication: '*',
    division: '/'
  };

  switch (action) {
    case 'number':
      addValue(value);
      break;
    case 'clear':
      clear();
      break;
    case 'backspace':
      backspace();
      break;
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division': {
      const op = operatorMap[action];
      // If expression is empty but we have a result, start with the result.
      if (expression === '' && result !== '') {
        startFromResult(op);
      } else if (expression !== '' && !isLastCharOperator()) {
        addValue(op);
      }
      break;
    }
    case 'submit':
      submit();
      break;
    case 'negate':
      negate();
      break;
    case 'mod':
      percentage();
      break;
    case 'decimal':
      // For decimal, we simply pass the value (".") to addValue.
      decimal(value);
      break;
    default:
      break;
  }

  // Update the display after every click
  updateDisplay(expression, result);
}

// Listen for clicks on the input section
inputBox.addEventListener('click', buttonClick);

// Append a value to the expression
function addValue(val) {
  if (val === '.') {
    // Determine the current number (portion after the last operator)
    const lastOperatorIndex = Math.max(
      expression.lastIndexOf('+'),
      expression.lastIndexOf('-'),
      expression.lastIndexOf('*'),
      expression.lastIndexOf('/')
    );
    const currentNumber = expression.slice(lastOperatorIndex + 1);
    // Only add a decimal if the current number doesn't already include one
    if (!currentNumber.includes('.')) {
      expression += val;
    }
  } else {
    expression += val;
  }
}

// Update the display fields
function updateDisplay(expr, res) {
  expressionDiv.textContent = expr;
  resultDiv.textContent = res;
}

// Clear the current expression and result
function clear() {
  expression = '';
  result = '';
}

// Remove the last character from the expression
function backspace() {
  expression = expression.slice(0, -1);
}

// Check if the last character in the expression is an operator
function isLastCharOperator() {
  const lastChar = expression.slice(-1);
  return ['+', '-', '*', '/'].includes(lastChar);
}

// When starting with a result, use it as the new starting point
function startFromResult(val) {
  expression = result + val;
  result = '';
}

// Evaluate the expression and update the result
function submit() {
  result = evaluateExpression();
  expression = '';
}

// Safely evaluate the expression using eval()
function evaluateExpression() {
  try {
    const evalResult = eval(expression);
    if (isNaN(evalResult) || !isFinite(evalResult)) {
      return ' ';
    } else if (evalResult < 1) {
      return parseFloat(evalResult.toFixed(10));
    } else {
      return parseFloat(evalResult.toFixed(2));
    }
  } catch (error) {
    return ' ';
  }
}

// Negate the current number or the result
function negate() {
  if (expression === '' && result !== '') {
    result = -result;
  } else if (expression !== '') {
    // Toggle the sign of the current expression
    if (expression.startsWith('-')) {
      expression = expression.slice(1);
    } else {
      expression = '-' + expression;
    }
  }
}

// Convert the current value or result to a percentage
function percentage() {
  if (expression !== '') {
    result = evaluateExpression();
    expression = '';
    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = '';
    }
  } else if (result !== '') {
    result = parseFloat(result) / 100;
  }
}

// For the decimal action, just add the decimal point
function decimal(val) {
  addValue(val);
}
