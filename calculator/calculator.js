'use strict'

var calculator = (function () {
    const OPERATION_REGEX = /[+\-\/*]/;
    var allowedKeys = [13, 42, 43, 45, 46, 47, 61, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    //47:divide 42:multiply 45:subtract 43:add
    var currentState = new State();

    function State() {
        this.input = '';
        this.reset = reset;
        this.addInput = addInput;
        this.isEqualToPreviousInput = isEqualToPreviousInput;
        this.undoLastInput = undoLastInput;
        this.updateInput = updateInput;
        
        function reset() {
            this.input = '';
        }

        function addInput(input) {
            this.input = this.input + input;
        }        

        function updateInput(input) {
            this.input = input;
        }

        function undoLastInput() {
            var currentInput = this.input;
            this.input = currentInput.replace(currentInput[currentInput.length - 1], '');
        }

        function isEqualToPreviousInput(input) {
            return this.input[this.input.length - 1] === input;
        }
    }

    function calculation(num, operation) {
        function add(num1, num2) {
            return num1 + num2;
        }

        function subtract(num1, num2) {
            return num1 - num2;
        }

        function multiply(num1, num2) {
            return num1 * num2;
        }

        function divide(num1, num2) {
            return num1 / num2;
        }

        return function (second_num) {
            num = Number(num);
            second_num = Number(second_num);

            if (operation === '+') {
                return add(num, second_num);
            }
            if (operation === '-') {
                return subtract(num, second_num);
            }
            if (operation === '*') {
                return multiply(num, second_num);
            }
            if (operation === '/') {
                return divide(num, second_num);
            }
            return second_num;
        }
    }

    function attachInputEventListener() {
        const keys = Array.from(document.querySelectorAll('.key'));

        keys.forEach(key => key.addEventListener('transitionend', removeTransition));
        keys.forEach(key => key.addEventListener('click', mousePress));
        window.addEventListener('keypress', keyPressed);
    }

    function keyPressed(event) {
        playSound();
        updateInput(event.keyCode);
    }

    function mousePress(e) {
        playSound();
        var dataValue = e.target.attributes['data-value'].value
        var input = dataValue != "ac" && dataValue != "ce" ? Number.parseFloat(dataValue) : dataValue;
        updateInput(input);
    }

    function removeTransition(e) {
        if (e.propertyName !== 'transform') return;
        e.target.classList.remove('playing');
    }

    function playSound() {
        const audio = document.querySelector(`audio[data-key="76"]`);
        if (!audio) return;
        audio.currentTime = 0;
        audio.play();
    }

    function updateInput(keyCode) {
        if (keyCode === "ac") {
            currentState.reset();
            updateHistory(currentState.input);
            updateResult(currentState.input);        
            return;
        }

        if(keyCode === "ce") {
            currentState.undoLastInput();
            updateResult(currentState.input);   
            return;
        }

        if (!isValidInput(keyCode)) {
            return;
        }

        if(keyCode === 13) {
            updateCalculation();
            return;
        }
        
        currentState.addInput(String.fromCharCode(keyCode));
        updateResult(currentState.input);
    }

    function updateCalculation() {      
        var result = eval(currentState.input);
        updateHistory(currentState.input);
        currentState.updateInput(result);
        updateResult(result);        
    }

    function isValidInput(keyCode) {
        return allowedKeys.indexOf(keyCode) >= 0 && 
            !currentState.isEqualToPreviousInput(String.fromCharCode(keyCode));
    }

    function updateHistory(currentInput, reset = false) {
        var historyElement = document.getElementById('history');

        if (reset) {
            historyElement.innerHTML = "";
            return;
        }
        historyElement.innerHTML = currentInput;
    }

    function updateResult(result) {        
        var resultElement = document.querySelector('.result h1');
        resultElement.innerHTML = result;
    }

    return {
        init: attachInputEventListener
    }
})();
