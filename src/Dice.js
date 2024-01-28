class Stack {
	operands;
	operators;
	root;

	constructor(args) {
		const { operands = [], operators = [], root = true } = args;
		this.operands = operands;
		this.operators = operators;
		this.root = root;
	}
}

export default class Dice {
	constructor() {
		throw new Error('You cannot instantiate a new Dice class. Use the static methods instead.');
	}

	static roll(equation = '') {
		this.#setupEquationService(equation);
		return Dice.#parse(true);
	}

	static #numberOperandsPerOperator = new Map([
		['+', 2],
		['-', 2],
		['*', 2],
		['/', 2],
		['d', 1]
	]);

	static #equation = {
		equation: null,
		generator: null,
		service: null
	};

	static #setupEquationService(equation) {
		const eq = this.#equation;
		eq.equation = equation.split('');
		eq.generator = function* () {
			for(let i = 0, l = eq.equation.length; i < l; i++) {
				yield eq.equation[i];
			}
		};
		eq.service = eq.generator();
	}

	static #getNextCharacter() {
		return this.#equation.service.next();
	}

	static #parse(root) {
		let stack = new Stack({ root });
		let number = '';
		let nextCharacter = this.#getNextCharacter();
		let endOfEquation = nextCharacter.done;
		while (!endOfEquation) {
			const character = nextCharacter.value.toLowerCase();
			if (character.match(/[\d\.]/)) {
				number = `${number}${character}`;
			} else {
				if (number !== '' && character !== 'd') {
					stack.operands.push(number);
					number = '';
				}
				switch(character) {
					case 'd':
						number = number || '1';
						stack.operators.push(`${number}-${character}`);
						number = '';
						break;
					case '(':
						stack.operands.push(this.#parse(false));
						break;
					case ')':
						if (stack.root) {
							throw new Error('Mismatch of parenthesis. Too many close parenthesis.');
						}
						stack = Dice.#collapseStack(stack);
						endOfEquation = true;
						break;
					case '*':
					case '/':
						if ('+-'.indexOf(stack.operators[stack.operators.length - 1]) === -1) {
							stack = Dice.#collapseStack(stack);
						}
						stack.operators.push(character);
						break;
					case '+':
					case '-':
						stack = Dice.#collapseStack(stack);
						stack.operators.push(character);
						break;
					default:
						// throw new Error('Unknown character in equation');
						break;
				}
			}
			if (!endOfEquation) {
				nextCharacter = this.#getNextCharacter();
				endOfEquation = nextCharacter.done;
			}
		}
		if (number !== '') {
			stack.operands.push(number);
		}
		stack = Dice.#collapseStack(stack);
		if (stack.operands.length !== 1 || stack.operators.length !== 0) {
			throw new Error('The equation is mal-formed');
		}
		return stack.operands[0];
	}

	static #collapseStack (stack) {
		while(stack.operators.length) {
			stack = Dice.#collapse(stack);
		}
		return stack;
	}

	static #collapse(stack) {
		if (stack.operands.length + stack.operators.length === 0) {
			throw new Error('There must be at least one operand and one operator.');
		}
		if (stack.operands.length === 1 && stack.operators.length === 0) {
			return stack;
		}
		if (stack.operators.length === 0) {
			throw new Error('Badly formed equation. Too many operands for the operators.');
		}
		let result;
		let dieNumber;
		let operator = stack.operators.pop();
		if (operator.at(-1) === 'd') {
			([dieNumber, operator] = operator.split('-'));
		}
		const numberOperands = Dice.#numberOperandsPerOperator.get(operator);
		if (stack.operands.length < numberOperands) {
			throw new Error(`Badly formed equation. Too few operands for the operator ${operator}. (${stack.operands.length}`);
		}
		const numbers = stack.operands.splice(stack.operands.length - numberOperands).map((item) => parseFloat(item));
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
		stack.operands.push(result);
		return stack;
	}

}