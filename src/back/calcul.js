export function evaluateExpression(expression) {
    const stack = [];
    let currentNumber = "";
    
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        
        if (!isNaN(char)) {
        // If the character is a number, append it to the current number string
            currentNumber += char;
        } else if (char === '+' || char === '-' || char === '*' || char === '/') {
            // If the character is an operator, evaluate the current number and push it to the stack
            if (currentNumber === "") {
                // if it's the first character
                if (char === '+' || char === '-'){
                    currentNumber += char;
                } else {
                    return "Error, can't start by operator";
                }
            } else if (currentNumber !== "") {
                stack.push(Number(currentNumber));
                currentNumber = "";
                stack.push(char);
            }
        }
    }
    stack.push(Number(currentNumber));

    // for (let i = 0; i < stack.length; i++) {
    //     console.log("Element " + i + " : " + stack[i]);
    // }

    let dict = {
        "operand_1":null,
        "operator":null,
        "operand_2":null,
        "status":null,
        "resultado":null,
        "error_message":null
    }

    if(stack.length > 3){
        dict.status = false;
        dict.error_message = "Error: too many operands";
        return dict;
    } else if (stack.length == 2){
        dict.status = false;
        dict.error_message = "Error: operator not followed by number";
        return dict;
    } else if (stack.length == 1){
        dict.status = true;
        dict.operand_1 = currentNumber;
        dict.resultado = currentNumber;
        dict.error_message = "Exito";
        return dict;
    }
    
    // Perform the operation using the previous two operands
    const operand2 = stack.pop();
    const operator = stack.pop();
    const operand1 = stack.pop();

    dict.operand_1 = Number(operand1);
    dict.operator = operator;
    dict.operand_2 = Number(operand2);

    let result = "";    
    if (operator === '+') {
        result = operand1 + operand2;
    } else if (operator === '-') {
        result = operand1 - operand2;
    } else if (operator === '*') {
        result = operand1 * operand2;
    } else if (operator === '/') {
        result = operand1 / operand2;
    }
    dict.resultado = result;
    // if there is no operator, we return the number
    dict.status = true;
    dict.error_message = "Exito";
    return dict;
}


export function list_to_string(expression) {
    let string = "";
    for (let i = 0; i < expression.length; i++) {
        string += expression[i];
    }
    return string;
}


// let expression = ["856"];
// let expression = ["369", "+", "190"];
// let result = evaluateExpression(expression);
// console.log(result);