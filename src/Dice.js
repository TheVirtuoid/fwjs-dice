export default class Dice {
	constructor() {
		throw new Error('You cannot instantiate a new Dice class. Use the static methods instead.');
	}

	roll(equation = '') {
		return Dice.#parse(equation);
	}

	// TODO: I would like to possibly use a regex here to get what I need
	static #parse (equation) {
		const parts = equation.split('');
		let operands = [];
		let operators = [];
		let number = '';
		while(parts.length) {
			const part = parts.shift().toLowerCase();
			if (!isNaN(parseInt(part)) || part === '.') {
				number = `${number}${part}`;
			} else {
				operands.push(parseFloat(number));
				number = '';
				switch (part) {
					case '+':
					case '-':
						({ operands, operators } = Dice.#collapseStacks({ operands, operators }));
						operators.push(part);
						break;
					case '/':
					case '*':
						const lastOperator = operators[operators.length - 1];
						if (lastOperator !== '+' && lastOperator !== '-' && lastOperator !== undefined) {
							({ operands, operators } = Dice.#collapseStacks({ operands, operators}));
						}
						operators.push(part);
						break;
					case ')':
						({ operands, operators } = Dice.#collapseStacks({ operands, operators }));
						break;
					case '(':
					case 'd':
						operators.push(part);
						break;
					default:
						throw new Error(`Unrecognized character: ${part}`);
				}
			}
		}
		if (number !== '') {
			operands.push(parseFloat(number));
			({ operands, operators } = Dice.#collapseStacks({ operands, operators }));
		}
		if (operators.length !== 0 && operators.length !== 1) {
			throw new Error('Equation is not in correct format.');
		}
		return operators[0];
	}

	static #collapseStacks (stacks) {
		let { operands, operators } = stacks;
		while(operators.length && operators[operators.length - 1] !== '(') {
			({operands, operators } = Dice.#collapse({ operands, operators }));
		}
		return { operands, operators };
	}

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
}