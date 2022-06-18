export default class Dice {
	constructor() {
		throw new Error('You cannot instantiate a new Dice class. Use the static methods instead.');
	}

	static roll(equation = '') {
		return Dice.#parse(equation);
	}

	static #parse(equation) {
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
					case '(':
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
						break;
					case '*':
					case '/':
						if ('+-'.indexOf(operators[operators.length - 1]) !== -1) {
							const result = Dice.#collapseStack({ operands, operators });
							operands.push(result);
						}
					case '+':
					case '-':
						if (operands.length === 0) {
							throw new Error('Operator must not be the first character in the equation.');
						}
						const result = Dice.#collapseStack({ operands, operators });
						operands.push(result);
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
		({ operands, operators } = Dice.#collapseStack({ operands, operators }));
		if (operands.length !== 1 && operators.length !== 0) {
			throw new Error('The equation is mal-formed');
		}
		return operands[0];
	}

	// TODO: I would like to possibly use a regex here to get what I need
	static #collapseStack (stacks, closeParenthesis = false) {
		let { operands, operators } = stacks;
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

	static #collapse(stacks) {
		const { operands, operators } = stacks;
		let result;
		if (operands.length >= 2 && operators.length >= 1) {
			const operand2 = parseFloat(operands.pop());
			const operand1 = parseFloat(operands.pop());
			const operator = operators.pop();
			switch(operator) {
				case 'd':
					if (!Number.isInteger(operand2) || !Number.isInteger(operand1)) {
						throw new Error(`One of the operands is not an integer number.`);
					}
					if (operand2 < 2) {
						throw new Error(`The dice type (number after the 'd') must be 2 or greater.`);
					}
					if (operand1 < 1) {
						throw new Error(`The number of dices (number before the 'd') must be 1 or greater.`);
					}
					result = 0;
					for(let i = 1; i <= operand1; i++) {
						result += Math.ceil(Math.random() * operand2);
					}
					break;
				case '+':
					result = operand1 + operand2;
					break;
				case '-':
					result = operand1 - operand2;
					break;
				case '*':
					result = operand1 * operand2;
					break;
				case '/':
					result = operand1 / operand2;
					break;
				default:
					break;
			}
			operands.push(result);
		} else {
			throw new Error('Operator/operand mismatch. The equation is not balanced.');
		}
		return { operands, operators };
	}

/*
	static #collapse (stacks) {
		const { operands, operators } = stacks;
		let result;
		if (operands.length >= 2 && operators.length >= 1) {
			const operand2 = operands.pop();
			const operand1 = operands.pop();
			const operator = operators.pop();
			switch(operator) {
				case '+':
					result = operand1 + operand2;
					break;
				case '-':
					result = operand1 - operand2;
					break;
				case '*':
					result = operand1 * operand2;
					break;
				case '/':
					result = operand1 / operand2;
					break;
				case 'd':
					result = 0;
					for(let i = 1; i <= operand1; i++) {
						result += Math.ceil(Math.random() * operand2);
					}
					break;
			}
			operands.push(result);
		} else {
			throw new Error('Operator/operand mismatch. The equation is not balanced.');
		}
		return { operands, operators };
	}
*/
}