const { Square, PieceType, Board, Piece } = require('./chess')

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
    pieces.forEach(p => {
      observableSquares[p.row][p.col] = room.board.cells[p.row][p.col]
      switch (Math.abs(p.pieceType)) {
        case PieceType.W_KING:
          break
        case PieceType.W_QUEEN:
          break
        case PieceType.W_ROOK:
          break
        case PieceType.W_BISHOP:
          break
        case PieceType.W_KNIGHT:
          break
        case PieceType.W_PAWN:
          break
      }
    })
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
            room.board
              .slice(0, 2)
              .flat()
              .map(s => s.piece),
            room.board
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

    // disconnect
    socket.on('disconnect', () => {
      const handler = setTimeout(() => {
        if (!users[id]) return

        const roomId = users[id]
        const room = rooms[roomId]
        users[room.players[0]] = null
        users[room.players[1]] = null

        io.to(room.players[0]).emit('gameEnd')
        io.to(room.players[1]).emit('gameEnd')

        delete users[id]
        delete rooms[roomId]
      }, 3000)

      disconnects[id] = handler
    })
  })
}
