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
			['d', 1]
	]);


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
				if (number !== '' && character !== 'd') {
					operands.push(number);
					number = '';
				}
				switch(character) {
					case 'd':
						number = number || '1';
						operators.push(`${number}-${character}`);
						number = '';
						break;
					case '(':
						operators.push(character);
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
						if ('+-'.indexOf(operators[operators.length - 1]) === -1) {
							({ operands, operators } = Dice.#collapseStack({ operands, operators }));
						}
						operators.push(character);
						break;
					case '+':
					case '-':
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
		({ operands, operators } = Dice.#collapseStack({ operands, operators }));
		if (operands.length !== 1 || operators.length !== 0) {
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
		return { operands, operators };
	}

	static #collapse(stacks) {
		const { operands, operators } = stacks;
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
		let dieNumber;
		let operator = operators.pop();
		if (operator.at(-1) === 'd') {
			([dieNumber, operator] = operator.split('-'));
		}
		const numberOperands = Dice.#numberOperandsPerOperator.get(operator);
		if (operands.length < numberOperands) {
			throw new Error(`Badly formed equation. Too few operands for the operator ${operator}. (${operands.length}`);
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
				numbers.unshift(parseFloat(dieNumber));
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