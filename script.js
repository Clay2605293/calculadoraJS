const resultDisplay = document.getElementById('result');
const recentOperation = document.getElementById('recentOperation');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const historyContainer = document.getElementById('historyContainer');
const clearHistoryBtn = document.getElementById('clearHistory');


let currentInput = '';
let previousInput = '';
let operator = null;
let operationHistory = '';

function updateDisplay() {
    resultDisplay.value = currentInput || '0';
    recentOperation.value = operationHistory || '';
}


numberButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const value = button.textContent;
        currentInput += value;
        updateDisplay();
    });
});


operatorButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const value = button.textContent;
        const id = button.id;

        if (value === '=') return;

        if (id === 'C') {
            currentInput = '';
            updateDisplay();
            return;
        }

        if (id === 'clerAll') {
            currentInput = '';
            previousInput = '';
            operator = null;
            operationHistory = '';
            updateDisplay();
            return;
        }

        if (id === 'plusMinus') {
            if (currentInput.startsWith('-')) {
                currentInput = currentInput.slice(1);
            } else if (currentInput !== '') {
                currentInput = '-' + currentInput;
            }
            updateDisplay();
            return;
        }        

        if (currentInput === '') return;

        operator = value;
        previousInput = currentInput;
        currentInput = '';
        operationHistory = previousInput + ' ' + operator;
        updateDisplay();
    });
});


function calculate() {
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;

    if (isNaN(prev) || isNaN(curr) || !operator) return;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case 'x':
            result = prev * curr;
            break;
        case '/':
            result = curr === 0 ? 'Error' : prev / curr;
            break;
        case '^':
            result = Math.pow(prev, curr);
            break;
        default:
            return;
    }

    if (result === 'Error') {
        resultDisplay.value = result;
        return;
    }

    let savedPrevious = previousInput;
    let savedOperator = operator;
    let savedCurrent = currentInput;

    currentInput = result.toString();
    previousInput = '';
    operator = null;

    let historyEntry = `${savedPrevious} ${savedOperator} ${savedCurrent} = ${result}`;
    addToHistory(historyEntry);

    updateDisplay();
}


document.getElementById('equal').addEventListener('click', function() {
    if (previousInput === '' || currentInput === '' || !operator) return;

    operationHistory = previousInput + operator + currentInput ;

    calculate();

    updateDisplay();
});


function addToHistory(entry) {
    const line = document.createElement('div');
    line.textContent = entry;
    historyContainer.appendChild(line);
}


clearHistoryBtn.addEventListener('click', function() {
    historyContainer.innerHTML = '';
});