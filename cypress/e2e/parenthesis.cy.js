import Dice from "../../src/Dice";

describe('parenthesis', () => {
	describe('(open)', () => {
		it('should throw error if op comes right after a number', () => {
			try {
				Dice.roll('6(');
				expect(true).to.be.false;
			} catch(err) {
				expect(err.name).to.equal('Error');
			}
		});
		it('should throw error if op comes right after a cp', () => {
			try {
				Dice.roll('(3*6)(');
				expect(true).to.be.false;
			} catch(err) {
				expect(err.name).to.equal('Error');
			}
		});
		it('should correctly evaluate expression', () => {
			const result = Dice.roll('(3+4)');
			expect(result).to.equal(7);
		});
	});
	describe('(close)', () => {
		it('should throw error if cp comes right after an operator', () => {
			try {
				Dice.roll('4+)');
				expect(true).to.be.false;
			} catch(err) {
				expect(err.name).to.equal('Error');
			}
		});
	});
	describe('mismatch', () => {
		it('should throw error if more open than close', () => {
			try {
				Dice.roll('(3+4()');
				expect(true).to.be.false;
			} catch(err) {
				expect(err.name).to.equal('Error');
			}
		});
		it('should throw error if more close than open', () => {
			try {
				Dice.roll('(3+4))');
				expect(true).to.be.false;
			} catch(err) {
				expect(err.name).to.equal('Error');
			}
		});
	});
});