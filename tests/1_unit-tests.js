const chai = require('chai');
const assert = chai.assert;

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
    suite('puzzle string', () => {
        test('valid puzzle string of 81 characters', (done) => {
            let puzzleString = puzzlesAndSolutions[0][0];
            let errorMessage = null;
            try {
                solver.build(puzzleString)
            } catch (error) {
                errorMessage = error.message
            }
            assert.isNull(errorMessage)

            done()
        })
        test('puzzle string with invalid characters (not 1-9 or .)', (done) => {
            let puzzleString = puzzlesAndSolutions[0][0];
            let errorMessage = null;
            try {
                solver.build(puzzleString.replace('9', 'A'))
            } catch (error) {
                errorMessage = error.message
            }
            assert.isNotNull(errorMessage)
            assert.equal(errorMessage, 'Invalid characters in puzzle')
            done()
        })
        test(' puzzle string that is not 81 characters in length', (done) => {
            let arr = Array.from(puzzlesAndSolutions[0][0]);
            arr.pop()
            let puzzleString = arr.join('')
            let errorMessage = null;
            console.log(puzzleString)
            try {
                solver.build(puzzleString)
            } catch (error) {
                errorMessage = error.message
            }
            assert.isNotNull(errorMessage)
            assert.equal(errorMessage, 'Expected puzzle to be 81 characters long')
            done()
        })
    })
    suite('check placement', () => {
        test('Logic handles a valid row placement', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            solver.build(puzzleString)
            let placement = solver.checkRowPlacement(0, 3)
            assert.isTrue(placement)
            done();
        });
        test('Logic handles an invalid row placement', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            solver.build(puzzleString)
            let placement = solver.checkRowPlacement(0, 1)
            assert.isFalse(placement)
            done();
        });
        test('Logic handles a valid column placement', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            solver.build(puzzleString)
            let placement = solver.checkColPlacement(0, 9)
            assert.isTrue(placement)
            done();
        });
        test('Logic handles an invalid column placement', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            solver.build(puzzleString)
            let placement = solver.checkColPlacement(0, 1)
            assert.isFalse(placement)
            done();
        });
        test('Logic handles a valid region(3x3 grid) placement', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            solver.build(puzzleString)
            let placement = solver.checkRegionPlacement(0, 0, 9)
            assert.isTrue(placement)
            done();
        });
        test('Logic handles an invalid region(3x3 grid) placement', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            solver.build(puzzleString)
            let placement = solver.checkRegionPlacement(0, 0, 1)
            assert.isFalse(placement)
            done();
        });
    });
    suite('solving tests', ()=> {
        test('Valid puzzle strings pass the solver', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            let solutionString = puzzlesAndSolutions[0][1]
            let errorMessage = null
            let solution
            try {
                solver.build(puzzleString)
                solution = solver.solve()
                if (!solution) throw new Error('Puzzle cannot be solved')
            } catch (error) {
                errorMessage = error.message
            }
            assert.equal(solution, solutionString)
            assert.isNull(errorMessage)

            done();
        });
        test('Invalid puzzle strings fail the solver', function (done) {
            let puzzleString = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let errorMessage = null
            let solution
            try {
                solver.build(puzzleString)
                solution = solver.solve()
                if (!solution) throw new Error('Puzzle cannot be solved')
            } catch (error) {
                errorMessage = error.message
            }
            assert.isNotNull(errorMessage)
            assert.equal(errorMessage, 'Puzzle cannot be solved')
            done();
        });
        test('Solver returns the the expected solution for an incomplete puzzzle', function (done) {
            let puzzleString = puzzlesAndSolutions[0][0]
            let solutionString = puzzlesAndSolutions[0][1]
            let errorMessage = null
            let solution
            try {
                solver.build(puzzleString)
                solution = solver.solve()
                if (!solution) throw new Error('Puzzle cannot be solved')
            } catch (error) {
                errorMessage = error.message
            }
            assert.equal(solution, solutionString)
            assert.isNull(errorMessage)

            done();
        })
    });
});
