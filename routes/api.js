'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        let coordinate = req.body.coordinate
        let val = req.body.value
        let puzzle = req.body.puzzle
        console.log(req.body)
        solver.build(puzzle)
        return res.json(solver.checkCoordinatePlacement(coordinate, val))
      }
      catch (error) {
        return res.json({ error: error.message })
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        const puzzleString = req.body.puzzle
        if (!puzzleString) throw new Error('Required field missing')

        solver.build(puzzleString)
        const solution = solver.solve()
        if (!solution) throw new Error('Puzzle cannot be solved')

        res.json({ solution })
      } catch (error) {
        return res.json({ error: error.message })
      }
    })
};
