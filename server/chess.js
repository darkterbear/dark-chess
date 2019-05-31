const Piece = {
  W_KING: 1,
  W_QUEEN: 2,
  W_ROOK: 3,
  W_BISHOP: 4,
  W_KNIGHT: 5,
  W_PAWN: 6,
  B_KING: -1,
  B_QUEEN: -2,
  B_ROOK: -3,
  B_BISHOP: -4,
  B_KNIGHT: -5,
  B_PAWN: -6
}

class Square {
  constructor(row, column, piece) {
    this.row = row
    this.column = column
    this.piece = piece
  }
}

class Board {
  constructor() {
    // create empty board
    this.cells = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => new Square(r, c))
    )

    // add pawns
    this.cells[1] = Array.from(
      { length: 8 },
      (_, c) => new Square(1, c, Piece.W_PAWN)
    )
    this.cells[6] = Array.from(
      { length: 8 },
      (_, c) => new Square(6, c, Piece.B_PAWN)
    )

    // add rooks
    this.cells[0][0] = new Square(0, 0, Piece.W_ROOK)
    this.cells[0][7] = new Square(0, 7, Piece.W_ROOK)

    this.cells[7][0] = new Square(7, 0, Piece.B_ROOK)
    this.cells[7][7] = new Square(7, 7, Piece.B_ROOK)

    // add knights
    this.cells[0][1] = new Square(0, 1, Piece.W_KNIGHT)
    this.cells[0][6] = new Square(0, 6, Piece.W_KNIGHT)

    this.cells[7][1] = new Square(7, 1, Piece.B_KNIGHT)
    this.cells[7][6] = new Square(7, 6, Piece.B_KNIGHT)

    // add bishops
    this.cells[0][2] = new Square(0, 2, Piece.W_BISHOP)
    this.cells[0][5] = new Square(0, 5, Piece.W_BISHOP)

    this.cells[7][2] = new Square(7, 2, Piece.B_BISHOP)
    this.cells[7][5] = new Square(7, 5, Piece.B_BISHOP)

    // add queens
    this.cells[0][3] = new Square(0, 3, Piece.W_QUEEN)
    this.cells[7][3] = new Square(7, 3, Piece.B_QUEEN)

    // add kings
    this.cells[0][4] = new Square(0, 4, Piece.W_KING)
    this.cells[7][4] = new Square(7, 4, Piece.B_KING)
  }
}

module.exports = {
  Board,
  Square,
  Piece
}
