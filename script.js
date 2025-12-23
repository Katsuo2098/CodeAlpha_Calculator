// Calculator JavaScript Implementation

class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.history = '';
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.displayCurrent = document.getElementById('display-current');
        this.displayHistory = document.getElementById('display-history');
    }
    
    bindEvents() {
        // Button click events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
                this.addButtonPressEffect(e.target);
            });
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // Prevent context menu on right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    addButtonPressEffect(button) {
        button.classList.add('btn-pressed');
        setTimeout(() => {
            button.classList.remove('btn-pressed');
        }, 100);
    }
    
    handleButtonClick(button) {
        const { number, operator, action } = button.dataset;
        
        if (number !== undefined) {
            this.inputNumber(number);
        } else if (operator !== undefined) {
            this.inputOperator(operator);
        } else if (action === 'equals') {
            this.calculate();
        } else if (action === 'clear') {
            this.clear();
        } else if (action === 'backspace') {
            this.backspace();
        }
    }
    
    handleKeyboardInput(event) {
        const key = event.key;
        
        // Prevent default behavior for calculator keys
        if ('0123456789+-*/.=EnterEscapeBackspace'.includes(key) || 
            ['+', '-', '*', '/'].includes(event.code)) {
            event.preventDefault();
        }
        
        switch (key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.inputNumber(key);
                this.highlightButton(`[data-number="${key}"]`);
                break;
            case '.':
                this.inputDecimal();
                this.highlightButton('[data-number="."]');
                break;
            case '+':
                this.inputOperator('+');
                this.highlightButton('[data-operator="+"]');
                break;
            case '-':
                this.inputOperator('-');
                this.highlightButton('[data-operator="-"]');
                break;
            case '*':
                this.inputOperator('*');
                this.highlightButton('[data-operator="*"]');
                break;
            case '/':
                this.inputOperator('/');
                this.highlightButton('[data-operator="/"]');
                break;
            case 'Enter':
            case '=':
                this.calculate();
                this.highlightButton('[data-action="equals"]');
                break;
            case 'Escape':
                this.clear();
                this.highlightButton('[data-action="clear"]');
                break;
            case 'Backspace':
                this.backspace();
                this.highlightButton('[data-action="backspace"]');
                break;
        }
    }
    
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            this.addButtonPressEffect(button);
        }
    }
    
    inputNumber(num) {
        if (this.waitingForOperand) {
            // Starting new number after operator - only allow single digit
            this.currentInput = num;
            this.waitingForOperand = false;
            
            // If we have a previous number and operator, calculate immediately
            if (this.previousInput !== '' && this.operator) {
                const firstValue = parseFloat(this.previousInput);
                const secondValue = parseFloat(num);
                const result = this.performCalculation(firstValue, secondValue, this.operator);
                
                this.currentInput = String(result);
                this.previousInput = '';
                this.operator = null;
                this.waitingForOperand = true;
                this.updateHistory('=');
            }
        } else {
            // If we're not waiting for operand, replace the current digit (single digit mode)
            this.currentInput = num;
        }
        this.updateDisplay();
    }
    
    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);
            
            this.currentInput = String(newValue);
            this.previousInput = newValue;
        }
        
        this.waitingForOperand = true;
        this.operator = nextOperator;
        this.updateHistory(nextOperator);
        this.updateDisplay();
    }
    
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }
    
    calculate() {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousInput !== '' && this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);
            
            this.updateHistory('=');
            this.currentInput = String(newValue);
            this.previousInput = '';
            this.operator = null;
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    }
    
    performCalculation(firstValue, secondValue, operator) {
        switch (operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                if (secondValue === 0) {
                    this.showError('Cannot divide by zero');
                    return 0;
                }
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.history = '';
        this.updateDisplay();
    }
    
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    updateHistory(operator = '') {
        if (operator) {
            this.history = `${this.previousInput} ${this.getOperatorSymbol(operator)}`;
        }
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '=': '='
        };
        return symbols[operator] || operator;
    }
    
    updateDisplay() {
        // Format the current input for display
        let displayValue = this.currentInput;
        
        // Handle very long numbers
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            if (!isNaN(num)) {
                displayValue = num.toExponential(6);
            }
        }
        
        // Handle decimal places
        if (displayValue.includes('.') && displayValue.length > 12) {
            const decimalPlaces = 12 - displayValue.indexOf('.') - 1;
            const num = parseFloat(displayValue);
            if (!isNaN(num)) {
                displayValue = num.toFixed(Math.max(0, decimalPlaces));
            }
        }
        
        this.displayCurrent.textContent = displayValue;
        this.displayHistory.textContent = this.history;
        
        // Add error styling if needed
        if (this.displayCurrent.textContent.includes('Error')) {
            this.displayCurrent.classList.add('error');
        } else {
            this.displayCurrent.classList.remove('error');
        }
    }
    
    showError(message) {
        this.currentInput = 'Error';
        this.displayCurrent.classList.add('error');
        setTimeout(() => {
            this.clear();
            this.displayCurrent.classList.remove('error');
        }, 2000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
    
    // Add some visual feedback for better UX
    console.log('🧮 Single-Digit Calculator initialized successfully!');
    console.log('💡 Try using keyboard shortcuts:');
    console.log('   - Single Digits: 0-9');
    console.log('   - Operators: +, -, *, /');
    console.log('   - Equals: Enter or =');
    console.log('   - Clear: Escape');
    console.log('   - Backspace: Backspace');
    console.log('   - Decimal: .');
});

// Add some additional utility functions
window.calculatorUtils = {
    // Function to copy result to clipboard
    copyResult: () => {
        const result = document.getElementById('display-current').textContent;
        navigator.clipboard.writeText(result).then(() => {
            console.log('Result copied to clipboard!');
        });
    },
    
    // Function to get calculation history
    getHistory: () => {
        const history = document.getElementById('display-history').textContent;
        const current = document.getElementById('display-current').textContent;
        return { history, current };
    }
};
