# Fun With JavaScript - 'Dice' static class

This repository is for the 'Dice' static class used in the Fun with JavaScript series (https://funwithjavascript.com).

## Versions

1.0.0 : Initial Version

## Installation

```
npm install --save @virtuoid/dice
```

## Dependencies

No dependencies

## Usage

It is important to note that the Dice class is a **static** class. It cannot be instantiated. In fact, it will throw an error if you do!

```javascript
import Dice from '@virtuoid/dice';

// Roll a single six-sided die
const rollSix = Dice.roll('d6');
const rollOneSix = Dice.roll('1d6');

// Roll three six-sided die
const rollThreeSix = Dice.roll('3d6');

// How about three die and add 2?
const modifiedRoll = Dice.roll('3d6+2');

// How about a twenty-sided die?
const twentySides = Dice.roll('d20');

// Wait! There's more! Entire Equations
const strange = Dice.roll('3+(d30-4)*(4+3d3)-16');
```
#### Methods
| Name                                          | Returns     | Description                                                                                                                                     |
|-----------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| roll(dieDescriptor: string) | Number | Rolls die according to the passed equation (see below).              |

## Equation Parser

The ```roll()``` method lets you pass an equation as the argument. This equation is then parsed and evaluated using normal mathematical precedence rules.

Addition, subtraction, multiplication, and division are supported. Parentheses are also supported.

There is a special operator called the Dice operator that, when used with a prefix and suffix, will roll a certain number of a certain type of die. The format is:

```xdy```

...where:

| Token | Required? | Default | Description                                                       |
|-------|-----------|---------|-------------------------------------------------------------------|
| x     | No        | 1       | The number of die to roll. Defaults to 1.                         | 
| d     | Yes       |         | The letter 'd'. This must always be there, as it is the operator. |
| y     | Yes       |         | The number of sides on the die                                    |

### Examples:
| Roll | Description |
| --- | --- |
| ```d6``` | Roll a single six-sided die |
| ```1d6``` | Roll a single six-sided die (same as first example) |
| ```3d6``` | Roll three six-sided die |
| ```d20``` | Roll a twenty-sided die |
| ```d100``` | Roll a hundred-sided die |
| ```10d100``` | Roll ten hundred-sided die |


## Github

```
https://github.com/TheVirtuoid/fwjs-dice
```

