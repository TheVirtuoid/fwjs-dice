import Dice from "../../src/Dice";

describe('addition', () => {
	it('should throw error if "+" by itself', () => {
		try {
			Dice.roll('+');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('should throw error if "+" is first in equation', () => {
		try {
			Dice.roll('+3');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('should throw error if "+" is last in equation', () => {
		try {
			Dice.roll('3+');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('should return the number 3', () => {
		const result = Dice.roll('1+2');
		expect(result).to.equal(3);
	});
	// we use toFixed() in the test below to take into account IEEE precision issues
	it('should return the number 3.4', () => {
		const result = Dice.roll('1.2+2.2');
		expect(result.toFixed(1)).to.equal('3.4');
	});
});