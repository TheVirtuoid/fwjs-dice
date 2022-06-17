import Dice from "../../src/Dice";

describe('using "d" option', () => {
	it('throw error if only specify "d"', () => {
		try {
			Dice.roll('d');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('throw error if "d" is the last character', () => {
		try {
			Dice.roll('2d');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('throw error if number before "d" is not an integer', () => {
		try {
			Dice.roll('2.6d6');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('throw error if number after "d" is not an integer', () => {
		try {
			Dice.roll('2d6.6');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('throw error if number before "d" is less than 1', () => {
		try {
			Dice.roll('0d2');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('throw error if number after "d" is less than 2', () => {
		try {
			Dice.roll('2d1');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('return a number if no number is before the "d"', () => {
		const result = Dice.roll('d6');
		console.log(result);
		expect(result >= 1 && result <= 6).to.be.true;
	});
	it('return a number between 1 and 6', () => {
		const result = Dice.roll('1d6');
		expect(result >= 1 && result <= 6).to.be.true;
	});
	it('return a number between 2 and 12', () => {
		const result = Dice.roll('2d6');
		expect(result >= 2 && result <= 12).to.be.true;
	});
	it('return a number between 1 and 6 when using uppercase "D"', () => {
		const result = Dice.roll('D6');
		expect(result >= 1 && result <= 6).to.be.true;
	});
});