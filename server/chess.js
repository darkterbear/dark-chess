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
	constructor(row, col, pieceType) {
		this.row = row
		this.col = col
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

const isRowBlocked = (r, c, piece, ownPieces, opponentPieces) => {
	if (
		opponentPieces.some(
			p =>
				p.row === r &&
				p.col > Math.min(c, piece.col) &&
				p.col < Math.max(c, piece.col)
		) ||
		ownPieces.some(
			p =>
				p.row === r &&
				p.col > Math.min(c, piece.col) &&
				p.col < Math.max(c, piece.col)
		)
	)
		return true
	return false
}

const isColBlocked = (r, c, piece, ownPieces, opponentPieces) => {
	if (
		opponentPieces.some(
			p =>
				p.col === c &&
				p.row > Math.min(r, piece.row) &&
				p.row < Math.max(r, piece.row)
		) ||
		ownPieces.some(
			p =>
				p.col === c &&
				p.row > Math.min(r, piece.row) &&
				p.row < Math.max(r, piece.row)
		)
	)
		return true
	return false
}

const isDiagonalBlocked = (r, c, piece, ownPieces, opponentPieces) => {
	let rDir = r - piece.row > 0 ? 1 : -1
	let cDir = c - piece.col > 0 ? 1 : -1

	for (
		let testR = piece.row + rDir;
		rDir > 0 ? testR < piece.row : testR > piece.row;
		testR += rDir
	) {
		for (
			let testC = piece.col + cDir;
			cDir > 0 ? testC < piece.col : testC > piece.col;
			testC += cDir
		) {
			if (
				ownPieces.some(p => p.row === testR && p.col === testC) ||
				opponentPieces.some(p => p.row === testR && p.col === testC)
			)
				return true
		}
	}
	return false
}

/**
 * Returns whether or not the target square is reachable by the piece
 * NOT whether or not the move is LEGAL
 * @param {Number} r Target row
 * @param {Number} c Target column
 * @param {Piece} piece Piece in question
 * @param {[Piece]} ownPieces Player's own pieces
 * @param {[Piece]} opponentPieces Opponent's pieces
 */
const isReachable = (r, c, piece, ownPieces, opponentPieces) => {
	// check that r and c is on the board
	if (r < 0 || c < 0 || r > 7 || c > 7) return false

	// check if there is already one of the player's own pieces at the target
	if (ownPieces.some(p => p.col === c && p.row === r)) return false

	let dr = Math.abs(r - piece.row)
	let dc = Math.abs(c - piece.col)

	switch (Math.abs(piece.pieceType)) {
		case PieceType.W_KING:
			if (dr <= 1 && dc <= 1) return true
			return false
		case PieceType.W_QUEEN:
			// check if reachable if no obstacles
			if (dr === 0) {
				if (isRowBlocked(r, c, piece, ownPieces, opponentPieces)) return false
				return true
			} else if (dc === 0) {
				if (isColBlocked(r, c, piece, ownPieces, opponentPieces)) return false
				return true
			} else if (dr === dc) {
				// check pieces between
				if (isDiagonalBlocked(r, c, piece, ownPieces, opponentPieces))
					return false
				return true
			}
			return false
		case PieceType.W_ROOK:
			if (dr === 0) {
				if (isRowBlocked(r, c, piece, ownPieces, opponentPieces)) return false
				return true
			} else if (dc === 0) {
				if (isColBlocked(r, c, piece, ownPieces, opponentPieces)) return false
				return true
			}
			return false
		case PieceType.W_BISHOP:
			if (dr === dc) {
				// check pieces between
				if (isDiagonalBlocked(r, c, piece, ownPieces, opponentPieces))
					return false
				return true
			}
			return false
		case PieceType.W_KNIGHT:
			if (dr === 2 && dc === 1) return true
			if (dc === 2 && dr === 1) return true
			return false
		case PieceType.W_PAWN:
			// if going straight...
			if (dc === 0) {
				// no piece must be in the way or in the target
				if (pieceType.some(p => p.col === c && p.row === r)) return false
				if (isColBlocked(r, c, piece, ownPieces, opponentPieces)) return false

				// if white...
				if (piece.pieceType === PieceType.W_PAWN) {
					// must go up by 1, or 2 if on row 1 rn
					if (r - piece.row === 1 || (r - piece.row === 2 && piece.row === 1))
						return true
					return false
				}

				// if black...
				if (piece.pieceType === PieceType.B_PAWN) {
					// must go down by 1, or 2 if on row 6 rn
					if (r - piece.row === -1 || (r - piece.row === -2 && piece.row === 6))
						return true
					return false
				}
			}

			// if white, must be going diagonally by +1 dr
			if (
				piece.pieceType === PieceType.W_PAWN &&
				dc === 1 &&
				r - piece.row === 1
			)
				return true

			// if black, must be going diagonally by +1 dr
			if (
				piece.pieceType === PieceType.B_PAWN &&
				dc === 1 &&
				r - piece.row === -1
			)
				return true

			return false
	}
}

/**
 *
 * @param {Number} r Target row
 * @param {Number} c Target column
 * @param {Piece} piece Piece in question
 * @param {[Piece]} ownPieces Player's own pieces
 * @param {[Piece]} opponentPieces Opponent's pieces
 */
const isLegalMove = (r, c, piece, ownPieces, opponentPieces) => {
	let originalRow = piece.row
	let originalCol = piece.col

	// check if in check after move
	piece.row = r
	piece.col = c
	let king = ownPieces.filter(
		p => Math.abs(p.pieceType) === PieceType.W_KING
	)[0]
	if (
		opponentPieces.some(p =>
			isReachable(king.row, king.col, p, opponentPieces, ownPieces)
		)
	)
		return false
	piece.row = originalRow
	piece.col = originalCol

	// TODO: override for castling
	// can't castle if king or rook as moved already
	// can't castle if currently in check
	// can't casn't through a check
	// TODO: override for enpassant

	// check reachable
	if (isReachable(r, c, piece, ownPieces, opponentPieces)) return true
	return false
}

module.exports = {
	Board,
	Square,
	PieceType,
	Piece
}
