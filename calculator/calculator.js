'use strict'

var calculator = (function() {
    var previousInput = '';
    var operators = [42, 43, 45, 47, 61];
    var allowedKeys = [13, 42, 43, 45, 46, 47, 61 , 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    //47:divide 42:multiply 45:subtract 43:add
    const OPERATION_REGEX = /[+\-\/*]/;

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
    
    function calculation(num, operation) {
        return function(second_num) {
            num = Number(num);
            second_num = Number(second_num);

            if (operation === '+') {
                return add(num, second_num);
            }
            if (operation === '-') {
                return subtract(num, second_num);
            } 
            if(operation === '*') {
                return multiply(num, second_num);
            }
            if (operation === '/') {
                return divide(num, second_num);
            }
            return second_num;
        }
    }

    function attachInputEventListener() {
        window.addEventListener('keypress', keyPressed);        
        const keys = Array.from(document.querySelectorAll('.key'));
        keys.forEach(key => key.addEventListener('transitionend', removeTransition));
        keys.forEach(key => key.addEventListener('click', mousePress));
    }

    function keyPressed(event) {        
        playSound();
        updateCalculation(event.keyCode);
    }    

    function mousePress(e) {
        var input = Number.parseFloat(e.target.attributes['data-value'].value);
        playSound();
        updateCalculation(input);
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

    function updateCalculation(keyCode) {
        if (allowedKeys.indexOf(keyCode) < 0) {
            return;
        }

        var currentInput = String.fromCharCode(keyCode);
        updateHistory(currentInput);
        previousInput = previousInput + currentInput;        
        console.log(previousInput);
        
        if(!isAccetableNumber(currentInput)) {
            var operrands = previousInput.split(OPERATION_REGEX);
            var matchedOperation = previousInput.match(OPERATION_REGEX);
            
            if(operrands.length > 1) {
                var calc = calculation(operrands[0], matchedOperation[0]);
                var result = calc(operrands[1]);                
                var resultElement = document.querySelector('.result h1');

                resultElement.innerHTML = result;                
                previousInput = result + currentInput;
            }
        } 
    }

    function updateHistory(currentInput) {
        var historyElement = document.getElementById('history');
        historyElement.innerHTML = historyElement.innerHTML + currentInput;
    }

    function isAccetableNumber(value) {
        return Number(value).toString() !== 'NaN' || value === '.';
    }

    return {
        init: attachInputEventListener
    }
})();