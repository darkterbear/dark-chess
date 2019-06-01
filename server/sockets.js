const Chess = require('./chess')
const { Square, PieceType, Board, Piece } = Chess

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * User schema
 *
 * 'id': String // room name
 */
var users = {}

/**
 * A dictionary of pending setTimeout handlers for disconnecting users
 */
var disconnects = {}

/**
 * Room schema
 *
 * 'name': {
 *    players: [String], // id
 *    pieces: [[Square]] // two arrays of Squares
 * 		turn: 0 // -1 for not started, 0 for white, 1 for black
 * 		board: [[Square]]
 * }
 */
var rooms = {}

const hat = length => {
  var text = ''
  var possible = 'abcdef0123456789'

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

module.exports = server => {
  const io = require('socket.io')(server, {
    origins: '*:*'
  })

  const updateBoard = (room, playerIndex) => {
    /**
     * {
     *    r: {
     *      c: S,
     *      c: S
     *    }
     * }
     */
    let observableSquares = {}

    let pieces = room.pieces[playerIndex]
    let opponentPieces = room.pieces[1 - playerIndex]

    room.board.cells.forEach(r => {
      r.forEach(square => {
        if (
          pieces.some(p =>
            Chess.isReachable(square.row, square.col, p, pieces, opponentPieces)
          )
        ) {
          if (!observableSquares[square.row]) observableSquares[square.row] = {}
          observableSquares[square.row][square.col] = square
        }
      })
    })

    io.to(room.players[playerIndex]).emit('updateBoard', observableSquares)
  }

  io.on('connection', socket => {
    // autoassign id
    var id = hat(8)
    while (Object.keys(users).includes(id)) {
      id = hat(8)
    }

    // send id to client
    socket.emit('id', id)
    socket.join(id)
    users[id] = null

    // join/create room
    socket.on('joinRoom', name => {
      // check if room name exists already
      if (rooms[name]) {
        let room = rooms[name]
        if (room.players.length >= 2) socket.emit('joinRoomFailure')
        else if (room.players.length === 1) {
          // decide who is white and who is black
          let pos = Math.floor(Math.random() * 2)
          room.players.splice(pos, 0, id)

          users[id] = name
          socket.emit('joinRoomSuccess')

          // start the game
          room.turn = 0
          room.board = new Board()

          room.pieces = [
            room.board.cells
              .slice(0, 2)
              .flat()
              .map(s => s.piece),
            room.board.cells
              .slice(6, 8)
              .flat()
              .map(s => s.piece)
          ]

          io.to(room.players[0]).emit('startGame', 0)
          io.to(room.players[1]).emit('startGame', 1)

          // update the board
          updateBoard(room, 0)
          updateBoard(room, 1)

          // kickstart the turn
          io.to(room.players[0]).emit('yourTurn')
        }
      } else {
        rooms[name] = {
          players: [id],
          turn: -1,
          board: [],
          pieces: []
        }
        users[id] = name
        socket.emit('joinRoomSuccess')
      }
    })

    // play move
    socket.on('move', ({ origin, target }) => {
      console.log(origin, target)
      let roomId = users[id]
      if (!roomId) return
      let room = rooms[roomId]
      if (!room) return

      // check if its the player's turn
      let turn = room.turn
      if (room.players[turn] !== id) return

      // check that target and origin are on the board
      if (target.row < 0 || target.col < 0 || target.row > 7 || target.col > 7)
        return false
      if (origin.row < 0 || origin.col < 0 || origin.row > 7 || origin.col > 7)
        return false

      // check if the move is legal
      let originSquare = room.board.cells[origin.row][origin.col]
      if (
        turn === 0
          ? originSquare.piece.pieceType <= 0
          : originSquare.piece.pieceType >= 0
      )
        return
      if (
        Chess.isLegalMove(
          target.row,
          target.col,
          originSquare.piece,
          room.pieces[turn],
          room.pieces[1 - turn]
        )
      ) {
        // make the move
        room.board.cells[target.row][target.col].piece =
          room.board.cells[origin.row][origin.col].piece
        room.board.cells[origin.row][origin.col].piece = undefined
        room.board.cells[target.row][target.col].piece.row = target.row
        room.board.cells[target.row][target.col].piece.col = target.col

        // update boards
        updateBoard(room, 0)
        updateBoard(room, 1)

        // next player's turn
        turn = 1 - turn
        io.to(room.players[turn]).emit('yourTurn')
      }
    })

    // disconnect
    socket.on('disconnect', () => {
      console.log('disconnect')

      if (!users[id]) return

      const roomId = users[id]
      const room = rooms[roomId]
      users[room.players[0]] = null
      users[room.players[1]] = null

      io.to(room.players[0]).emit('gameEnd')
      io.to(room.players[1]).emit('gameEnd')

      delete users[id]
      delete rooms[roomId]
    })
  })
}
