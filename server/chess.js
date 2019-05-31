const PieceType = {
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

class Piece {
  constructor(row, column, pieceType) {
    this.row = row
    this.column = column
    this.pieceType = pieceType
  }
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
    this.cells[1].forEach(
      (square, c) => (square.piece = new Piece(1, c, PieceType.W_PAWN))
    )
    this.cells[6].forEach(
      (square, c) => (square.piece = new Piece(6, c, PieceType.B_PAWN))
    )

    // add rooks
    this.cells[0][0].piece = new Piece(0, 0, PieceType.W_ROOK)
    this.cells[0][7].piece = new Piece(0, 7, PieceType.W_ROOK)

    this.cells[7][0].piece = new Piece(7, 0, PieceType.B_ROOK)
    this.cells[7][7].piece = new Piece(7, 7, PieceType.B_ROOK)

    // add knights
    this.cells[0][1].piece = new Piece(0, 1, PieceType.W_KNIGHT)
    this.cells[0][6].piece = new Piece(0, 6, PieceType.W_KNIGHT)

    this.cells[7][1].piece = new Piece(7, 1, PieceType.B_KNIGHT)
    this.cells[7][6].piece = new Piece(7, 6, PieceType.B_KNIGHT)

    // add bishops
    this.cells[0][2].piece = new Piece(0, 2, PieceType.W_BISHOP)
    this.cells[0][5].piece = new Piece(0, 5, PieceType.W_BISHOP)

    this.cells[7][2].piece = new Piece(7, 2, PieceType.B_BISHOP)
    this.cells[7][5].piece = new Piece(7, 5, PieceType.B_BISHOP)

    // add queens
    this.cells[0][3].piece = new Piece(0, 3, PieceType.W_QUEEN)
    this.cells[7][3].piece = new Piece(7, 3, PieceType.B_QUEEN)

    // add kings
    this.cells[0][4].piece = new Piece(0, 4, PieceType.W_KING)
    this.cells[7][4].piece = new Piece(7, 4, PieceType.B_KING)
  }
}

const isReachable = (r, c, piece) => {}

const isLegalMove = (r, c, piece, ownPieces, opponentPieces) => {}

module.exports = {
  Board,
  Square,
  PieceType,
  Piece
}
