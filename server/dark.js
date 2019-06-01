/**
 * Utilities for Dark Chess
 */

// COPY PASTED FROM MASTER, MAY BE USEFUL
// const isReachable = (r, c, piece, ownPieces, opponentPieces) => {
//   // check that r and c is on the board
//   if (r < 0 || c < 0 || r > 7 || c > 7) return false

//   // check if there is already one of the player's own pieces at the target
//   if (ownPieces.some(p => p.col === c && p.row === r)) return false

//   let dr = Math.abs(r - piece.row)
//   let dc = Math.abs(c - piece.col)

//   switch (Math.abs(piece.pieceType)) {
//     case PieceType.W_KING:
//       if (dr <= 1 && dc <= 1) return true
//       return false
//     case PieceType.W_QUEEN:
//       // check if reachable if no obstacles
//       if (dr === 0) {
//         if (isRowBlocked(r, c, piece, ownPieces, opponentPieces)) return false
//         return true
//       } else if (dc === 0) {
//         if (isColBlocked(r, c, piece, ownPieces, opponentPieces)) return false
//         return true
//       } else if (dr === dc) {
//         // check pieces between
//         if (isDiagonalBlocked(r, c, piece, ownPieces, opponentPieces))
//           return false
//         return true
//       }
//       return false
//     case PieceType.W_ROOK:
//       if (dr === 0) {
//         if (isRowBlocked(r, c, piece, ownPieces, opponentPieces)) return false
//         return true
//       } else if (dc === 0) {
//         if (isColBlocked(r, c, piece, ownPieces, opponentPieces)) return false
//         return true
//       }
//       return false
//     case PieceType.W_BISHOP:
//       if (dr === dc) {
//         // check pieces between
//         if (isDiagonalBlocked(r, c, piece, ownPieces, opponentPieces))
//           return false
//         return true
//       }
//       return false
//     case PieceType.W_KNIGHT:
//       if (dr === 2 && dc === 1) return true
//       if (dc === 2 && dr === 1) return true
//       return false
//     case PieceType.W_PAWN:
//       // if going straight...
//       if (dc === 0) {
//         // no piece must be in the way or in the target
//         if (opponentPieces.some(p => p.col === c && p.row === r)) return false
//         if (ownPieces.some(p => p.col === c && p.row === r)) return false
//         if (isColBlocked(r, c, piece, ownPieces, opponentPieces)) return false

//         // if white...
//         if (piece.pieceType === PieceType.W_PAWN) {
//           // must go up by 1, or 2 if on row 1 rn
//           if (r - piece.row === 1 || (r - piece.row === 2 && piece.row === 1))
//             return true
//           return false
//         }

//         // if black...
//         if (piece.pieceType === PieceType.B_PAWN) {
//           // must go down by 1, or 2 if on row 6 rn
//           if (r - piece.row === -1 || (r - piece.row === -2 && piece.row === 6))
//             return true
//           return false
//         }
//       }

//       // if white, must be going diagonally by +1 dr
//       if (
//         piece.pieceType === PieceType.W_PAWN &&
//         dc === 1 &&
//         r - piece.row === 1
//       )
//         return true

//       // if black, must be going diagonally by +1 dr
//       if (
//         piece.pieceType === PieceType.B_PAWN &&
//         dc === 1 &&
//         r - piece.row === -1
//       )
//         return true

//       return false
//   }
// }

/**
 * Applies the 'darkness' or 'fog-of-war' to a board to send to a player
 * @param {[[{ type: String, color: String}]]} board Matrix of squares on the board
 * @param {String} color Color to foggify for
 */
const foggify = (board, color) => {
  // TODO: jesus christ
  return board
}

const coordsToSquare = (r, c) => {
  return String.fromCharCode(c + 97) + (r + 1)
}

module.exports = {
  foggify,
  coordsToSquare
}
