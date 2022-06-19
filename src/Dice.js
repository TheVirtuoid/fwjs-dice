export default class Dice {
	constructor() {
		throw new Error('You cannot instantiate a new Dice class. Use the static methods instead.');
	}

	static roll(equation = '') {
		return Dice.#parse(equation);
	}

	static #numberOperandsPerOperator = new Map([
			['+', 2],
			['-', 2],
			['*', 2],
			['/', 2],
			['d', 2]
	]);


	static #parse(equation) {
		console.log(`-------------------------------------------- ${equation} -------------------------------------`);
		const characters = equation.split('');
		let operands = [];
		let operators = [];
		let number = '';
		while (characters.length) {
			const character = characters.shift().toLowerCase();
			if (character.match(/[\d\.]/)) {
				number = `${number}${character}`;
			} else {
				if (number !== '') {
					operands.push(number);
					number = '';
				}
				switch(character) {
					case 'd':
						if (operands.length === 0) {
							operands.push('1');
						}
						operators.push(character);
						break;
					/*case '(':
						if (operands.length === operators.length) {
							operators.push(character);
						} else {
							throw new Error('Illegal placement of open parenthesis.');
						}
						break;
					case ')':
						Dice.#collapseStack({ operators, operands }, true);
						if (operators[operators.length - 1] !== '(') {
							throw new Error('Mismatch of parenthesis. Too many close parenthesis.');
						}
						operators.pop();
						break;*/
					/*case '*':
					case '/':
						if ('+-'.indexOf(operators[operators.length - 1]) !== -1) {
							const result = Dice.#collapseStack({ operands, operators });
							operands.push(result);
						}
						operators.push(character);*/
					case '+':
					case '-':
						if (operands.length === 0) {
							throw new Error('Operator must not be the first character in the equation.');
						}
						({ operands, operators } = Dice.#collapseStack({ operands, operators }));
						operators.push(character);
						break;
					default:
						// throw new Error('Unknown character in equation');
						break;
				}
			}
		}
		if (number !== '') {
			operands.push(number);
		}
		console.log('AT END');
		console.log(JSON.stringify(operands));
		console.log(JSON.stringify(operators));
		({ operands, operators } = Dice.#collapseStack({ operands, operators }));
		if (operands.length !== 1 && operators.length !== 0) {
			throw new Error('The equation is mal-formed');
		}
		return operands[0];
	}

	// TODO: I would like to possibly use a regex here to get what I need
	static #collapseStack (stacks, closeParenthesis = false) {
		console.log('----COLLAPSE STACK');
		let { operands, operators } = stacks;
		console.log(JSON.stringify(operands));
		console.log(JSON.stringify(operators));
		while(operators.length && operators[operators.length - 1] !== '(') {
			({operands, operators } = Dice.#collapse({ operands, operators }));
		}
		if (closeParenthesis && operators[operators.length - 1] !== '(') {
			throw new Error('Mismatch parenthesis. More than one close parenthesis found.');
		}
		if (!closeParenthesis && operators[operators.length -1] === '(') {
			throw new Error('Mismatch parenthesis. More than one open parenthesis found.');
		}
		return { operands, operators };
	}

	/*
			Collapsing
			operand = 0, operator = 0:		Error: No final result
			operand = 1, operator = 0:		Return
			operand = 1, operator = 1:		process
	 */

	static #collapse(stacks) {
		console.log('---collapse   ');
		const { operands, operators } = stacks;
		console.log(JSON.stringify(operands));
		console.log(JSON.stringify(operators));
		if (operands.length + operators.length === 0) {
			throw new Error('There must be at least one operand and one operator.');
		}
		if (operands.length === 1 && operators.length === 0) {
			return { operands, operators };
		}
		if (operators.length === 0) {
			throw new Error('Badly formed equation. Too many operands for the operators.');
		}
		let result;
		const operator = operators.pop();
		const numberOperands = Dice.#numberOperandsPerOperator.get(operator);
		if (operands.length < numberOperands) {
			throw new Error(`Badly formed equation. Too few operands for the operator ${operator}.`);
		}
		const numbers = operands.splice(operands.length - numberOperands).map((item) => parseFloat(item));
		switch(operator) {
			case '+':
				result = numbers[0] + numbers[1];
				break;
			case '-':
				result = numbers[0] - numbers[1];
				break;
			case '*':
				result = numbers[0] * numbers[1];
				break;
			case '/':
				result = numbers[0] / numbers[1];
				break;
			case 'd':
				if (!Number.isInteger(numbers[0]) || !Number.isInteger(numbers[1])) {
					throw new Error(`One of the operands is not an integer number.`);
				}
				if (numbers[1] < 2) {
					throw new Error(`The dice type (number after the 'd') must be 2 or greater.`);
				}
				if (numbers[0] < 1) {
					throw new Error(`The number of dices (number before the 'd') must be 1 or greater.`);
				}
				result = 0;
				for(let i = 1; i <= numbers[0]; i++) {
					result += Math.ceil(Math.random() * numbers[1]);
				}
				break;
		}
		operands.push(result);
		return { operands, operators };
	}

}