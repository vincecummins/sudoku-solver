class SudokuSolver {
  constructor() {
    this.puzzleString = null;
    this.puzzleBoard = []
  }
  static validateCharacters(string) {
    const notValidCharacters = /[^1-9\.]/i
    if (notValidCharacters.test(string)) {
      throw new Error('Invalid characters in puzzle')
    }
  }
  validatePuzzleString(puzzleString) {
    SudokuSolver.validateCharacters(puzzleString)
    if (puzzleString.length != 81) {
      throw new Error('Expected puzzle to be 81 characters long')
    }
  }

  validateCoordinateAndValue(coordinate, value) {
    if (coordinate === '' || value === '') {
      throw new Error('Required field(s) missing')
    }
    const validCoordinations = /^[A-I][1-9]$/
    const notValidValue = /[^1-9]/
    if (!validCoordinations.test(coordinate)) {
      throw new Error('Invalid coordinate')
    }
    if (notValidValue.test(value)) {
      throw new Error('Invalid value')
    }
  }

  checkRowPlacement(row, value) {
    const puzzleRow = this.board[row]
    for (let index in puzzleRow) {
      if (puzzleRow[index] == value) {
        return false
      }
    }

    return true
  }

  checkColPlacement(column, value) {
    for (let index = 0; index < 9; index++) {
      if (this.board[index][column] == value) {
        return false
      }
    }

    return true
  }

  checkRegionPlacement(row, column, value) {
    let regionRow = parseInt(row / 3) * 3
    let regionColumn = parseInt(column / 3) * 3
    for (let row = regionRow; row < regionRow + 3; row++) {
      for (let col = regionColumn; col < regionColumn + 3; col++) {
        if (this.board[row][col] == value) {
          return false
        }
      }
    }

    return true
  }

  checkCoordinatePlacement(coordinate, value) {
    this.validateCoordinateAndValue(coordinate, value)

    const result = {
      valid: true,
      conflict: []
    }

    let [row, col] = coordinate.split('')
    row = row.charCodeAt(0) - 65
    col = Number(col) - 1

    if (!this.checkRowPlacement(row, value)) {
      result.valid = false
      result.conflict.push('row')
    }
    if (!this.checkColPlacement(col, value)) {
      result.valid = false
      result.conflict.push('column')
    }
    if (!this.checkRegionPlacement(row, col, value)) {
      result.valid = false
      result.conflict.push('region')
    }

    if (result.valid) {
      delete result.conflict
    }

    return result

  }

  checkPlacement(row, col, val) {
    if (this.checkRowPlacement(row, val)
      && this.checkColPlacement(col, val)
      && this.checkRegionPlacement(row, col, val)) {
      return true
    }

    return false
  }

  getSolution() {
    const solutionArray = this.board.flat(9)
    const solutionString = solutionArray.join('')
    return solutionString
  }

  solve(row = 0, col = 0) {
    if (col === 9) {
      col = 0
      row++
    }

    if (row === 9) {
      return this.getSolution()
    }

    if (this.board[row][col] != '.') {
      return this.solve(row, col + 1)
    }

    for (let i = 1; i < 10; i++) {
      let value = i.toString()
      if (this.checkPlacement(row, col, value)) {
        this.board[row][col] = value
        const testSolve = this.solve(row, col + 1)
        if (testSolve != false) {
          return testSolve
        } else {
          this.board[row][col] = '.'
        }
      }
    }

    return false
  }

  build(puzzleString) {
    this.validatePuzzleString(puzzleString)

    this.puzzleString = puzzleString
    this.board = []

    const puzzleArray = Array.from(this.puzzleString)
    for (let i = 0; i < 9; i++) {
      const characters = puzzleArray.splice(0, 9)
      this.board.push(characters)
    }
  }

  /* solve(puzzleString) {
    let arr = [];
    for (let i = 0; i < 81; i++) {
      let row = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
      let col = (i % 9) + 1;
      let region = 1 + Math.floor(i / 27) * 3 + Math.floor((col - 1) / 3);
      arr.push({ value: puzzleString[i] != '.' ? parseInt(puzzleString[i]) : '.', region: region, row: row, col: col })
    } if (!findNumbers(arr)) {
      return res.json({ error: 'Puzzle cannot be solved' })
    } else {
      return findNumbers(arr)
    }
  }
*/ } /*

function findNumbers (arr) {
  let newPuzzleString = [];
  let i = 0;
  let back = 0;
  let arr2 = []
  let counter = 0;
  while (i < arr.length) {
    if (i < 0) {
      return false
    }
    let currRow = arr[i].row
    let currCol = arr[i].col
    let currRegion = arr[i].region
    let arr1 = []
    let len;
    if (arr[i].value == '.') {
      arr2.push(i)
      for (let j = 1; j <= 9; j++) {
        if (!arr.filter(x => x.region == currRegion).map(x => x.value).includes(j) && !arr.filter(x => x.col == currCol).map(x => x.value).includes(j) && !arr.filter(x => x.row == currRow).map(x => x.value).includes(j)) {
          arr1.push(j)
        }
      }
      len = arr1.length
      console.log(counter, arr1.length, i, arr1)
      if (counter < arr1.length) {
        arr[i].value = arr1[counter]
        counter = 0;
        newPuzzleString.push(arr1[counter])
        i++
      }
      if (arr1.length === 0) {
        console.log(arr[i].value, i, counter, arr1.length, arr2[arr2.length - 1])
        counter +=1
        i++
    }
    
    }
    else {
      counter = 0;
      newPuzzleString.push(arr[i].value)
      i++
    }
  } 
  console.log(arr2) 

  return newPuzzleString
} */

module.exports = SudokuSolver;

