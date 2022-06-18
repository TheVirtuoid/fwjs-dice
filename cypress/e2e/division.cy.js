import Dice from "../../src/Dice";

describe('division', () => {
	it('should throw error if "/" by itself', () => {
		try {
			Dice.roll('/');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('should throw error if "/" is first in equation', () => {
		try {
			Dice.roll('/3');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('should throw error if "/" is last in equation', () => {
		try {
			Dice.roll('3/');
			expect(true).to.be.false;
		} catch (err) {
			expect(err.name).to.equal('Error');
		}
	});
	it('should return the number 6', () => {
		const result = Dice.roll('12/2');
		expect(result).to.equal(6);
	});
	// we use toFixed() in the test below to take into account IEEE precision issues
	it('should return the number 4.9', () => {
		const result = Dice.roll('12.25/2.5');
		expect(result.toFixed(1)).to.equal('4.9');
	});
});