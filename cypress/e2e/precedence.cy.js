import Dice from "../../src/Dice";

describe('operator precedence', () => {
	it('should return correct result mixing "*" and "+"', () => {
		const result = Dice.roll('3+2*4+6');
		expect(result).to.equal(17);
	});
	it('should return correct result mixing "*" and "-"', () => {
		const result = Dice.roll('3-2*4-6');
		expect(result).to.equal(-11);
	});
	it('should return correct result mixing "/" and "+"', () => {
		const result = Dice.roll('3+4/2+6');
		expect(result).to.equal(11);
	});
	it('should return correct result mixing "/" and "-"', () => {
		const result = Dice.roll('3-4/2-6');
		expect(result).to.equal(-5);
	});
	it('should return correct result mixing "*" and "/"', () => {
		const result = Dice.roll('12/2*3');
		expect(result).to.equal(18);
	});
	it('should return correct result mixing "+" and "-"', () => {
		const result = Dice.roll('12-2+3');
		expect(result).to.equal(13);
	});
	it('should return correct result mixing "()" and other operators', () => {
		const result = Dice.roll('2*(3+4)-2+(2*3)');
		expect(result).to.equal(18);
	});
	it('should return correct result with multiple "()"', () => {
		const result = Dice.roll('2*(3+4)-2+(2*(4+5))');
		expect(result).to.equal(30);
	});
	it('should return correct result with "d" and other operators', () => {
		const result = Dice.roll('3d6+100');
		expect(result >= 103 && result <= 118).to.be.true;
	});
	it('multiple d operators', () => {
		const result = Dice.roll('d6+2d6+d6');
		expect(result >= 4 && result <= 24).to.be.true;
	});

});