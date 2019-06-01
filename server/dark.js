/**
 * Utilities for Dark Chess
 */

// COPY PASTED FROM MASTER, MAY BE USEFUL
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
        if (opponentPieces.some(p => p.col === c && p.row === r)) return false
        if (ownPieces.some(p => p.col === c && p.row === r)) return false
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
 * Applies the 'darkness' or 'fog-of-war' to a board to send to a player
 * @param {[[{ type: String, color: String}]]} board Matrix of squares on the board
 * @param {String} color Color to foggify for
 */
const foggify = (board, color) => {
  // let boardCopy = JSON.parse(JSON.stringify(board))
  let foggedBoard = Array.from(
    { length: 8 },
    () =>
      Array.from({ length: 8 }, () => ({
        type: 'fog'
      }))
    // Array.from({ length: 8 }, () => null)
  )
  let ownPieces = []
  let opponentPieces = []
  board.forEach((row, r) => {
    row.forEach((square, c) => {
      if (square && square.color === color)
        ownPieces.push({ row: r, col: c, type: square.type })
      if (square && square.color !== color)
        opponentPieces.push({ row: r, col: c, type: square.type })
    })
  })

  const addToVisible = (r, c) => {
    foggedBoard[r][c] = board[r][c]
  }

  ownPieces.forEach(p => {
    // for each piece, add itself to the visible board
    addToVisible(p.row, p.col)

    // add what is visible to it to the visible board
    if (p.type === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let tr = p.row + dr
          let tc = p.col + dc
          if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) addToVisible(tr, tc)
        }
      }
    }

    if (p.type === 'r' || p.type === 'q') {
      // probe right
      let dc = 0
      do {
        dc++
        if (p.col + dc < 8) addToVisible(p.row, p.col + dc)
        else break
      } while (!board[p.row][p.col + dc])

      // probe left
      dc = 0
      do {
        dc--
        if (p.col + dc >= 0) addToVisible(p.row, p.col + dc)
        else break
      } while (!board[p.row][p.col + dc])

      // probe up
      let dr = 0
      do {
        dr++
        if (p.row + dr < 8) addToVisible(p.row + dr, p.col)
        else break
      } while (!board[p.row + dr][p.col])

      // probe down
      dr = 0
      do {
        dr--
        if (p.row + dr >= 0) addToVisible(p.row + dr, p.col)
        else break
      } while (!board[p.row + dr][p.col])
    }

    if (p.type === 'b' || p.type === 'q') {
      // probe upper right
      let dc = 0
      let dr = 0
      do {
        dc++
        dr++
        if (p.row + dr < 8 && p.col + dc < 8)
          addToVisible(p.row + dr, p.col + dc)
        else break
      } while (!board[p.row + dr][p.col + dc])

      // probe upper left
      dc = 0
      dr = 0
      do {
        dc--
        dr++
        if (p.row + dr < 8 && p.col + dc >= 0)
          addToVisible(p.row + dr, p.col + dc)
        else break
      } while (!board[p.row + dr][p.col + dc])

      // probe lower left
      dc = 0
      dr = 0
      do {
        dc--
        dr--
        if (p.row + dr >= 0 && p.col + dc >= 0)
          addToVisible(p.row + dr, p.col + dc)
        else break
      } while (!board[p.row + dr][p.col + dc])

      // probe lower right
      dc = 0
      dr = 0
      do {
        dc++
        dr--
        if (p.row + dr >= 0 && p.col + dc < 8)
          addToVisible(p.row + dr, p.col + dc)
        else break
      } while (!board[p.row + dr][p.col + dc])
    }

    if (p.type === 'n') {
      for (let dr = -2; dr <= 2; dr += 4) {
        for (let dc = -1; dc <= 1; dc += 2) {
          let tr = p.row + dr,
            tc = p.col + dc
          if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) addToVisible(tr, tc)
        }
      }

      for (let dr = -1; dr <= 1; dr += 2) {
        for (let dc = -2; dc <= 2; dc += 4) {
          let tr = p.row + dr,
            tc = p.col + dc
          if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) addToVisible(tr, tc)
        }
      }
    }

    if (p.type === 'p') {
      if (color === 'w') {
        addToVisible(p.row + 1, p.col)
        if (p.col > 0) addToVisible(p.row + 1, p.col - 1)
        if (p.col < 7) addToVisible(p.row + 1, p.col + 1)
        if (p.row === 1) addToVisible(p.row + 2, p.col)
      }

      if (color === 'b') {
        addToVisible(p.row - 1, p.col)
        if (p.col > 0) addToVisible(p.row - 1, p.col - 1)
        if (p.col < 7) addToVisible(p.row - 1, p.col + 1)
        if (p.row === 6) addToVisible(p.row - 2, p.col)
      }

      // TODO: handle en passant
    }
  })

  return foggedBoard
}

const coordsToSquare = (r, c) => {
  return String.fromCharCode(c + 97) + (r + 1)
}

module.exports = {
  foggify,
  coordsToSquare
}
