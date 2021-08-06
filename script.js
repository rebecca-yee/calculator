class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        // when we delete a number, all of the characters except for the last one (at index -1) remain
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number) {
        // if you try to select a decimal and there is already a decimal
        // in the current operand, return (stops method from executing any further)
        if (number === '.' && this.currentOperand.includes('.')) return 

        // this turns currentOperand into a string to that additional numbers can be concatenated
        // ex: pressing 1 and then 1 would be 11, not 2 (this would happen if this wasn't a string)
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        // if you try to select an operation and currentOperand is clear, return
        if (this.currentOperand === '') return;

        // if there is information in previousOperand and you select an operation again,
        // the expression is computed
        // ex: '1 +' already in previousOperand, we type '1 +' in currentOperand => '2 +' should display in previousOperand
        if (this.previousOperand !== '') {
            this.compute();
        }

        // the operation of the HTML text element is passed into this.operation
        this.operation = operation;

        // the information in currentOperand is passed into previousOperand, and then currentOperand is cleared
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;

        // this converts the previousOperand string into a number
        const prev = parseFloat(this.previousOperand);

        // this converts the currentOperand string into a number
        const current = parseFloat(this.currentOperand);

        // if there is no number in previousOperand or there is no number in currentOperand, return
        if (isNaN(prev) || isNaN(current)) return;

        // one of the following operations will perform depending on the operation we select
        switch(this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case 'x':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        // the answer is assigned to currentOperand
        this.currentOperand = computation;

        // the operation is cleared
        this.operation = undefined;

        // previousOperand is cleared
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        // this converts the number to a string
        const stringNumber = number.toString();

        // this turns the numbers before the decimal into a floating point number
        // ex: number = 123.456
        // ex: stringNumber = '123.456'
        // ex: stringNumber.split('.') = ['123', '456']
        // ex: integerDigits = 123
        // if you enter a . first, integerDigits = NaN and decimalDigits = ''
        const integerDigits = parseFloat(stringNumber.split('.')[0]);

        // ex: decimalDigits = '456'
        // if you enter an integer, decimalDigits will be null
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;

        if (isNaN(integerDigits)) {
            // if you enter a . first
            integerDisplay = '';
        } else {
            // this adds the commas between every three digits to the left of the decimal
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        // the HTML currentOperand text element is updated to contain the contents of currentOperand
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            // the HTML previousOperand text element is updated to contain the contents of previousOperand
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const clearButton = document.querySelector('[data-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);


// for every number button, if the button is clicked, input the inner text of the button
// (the number) to the appendNumber method
numberButtons.forEach(button => button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
}))

operationButtons.forEach(button => button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
}))

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
})

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})
