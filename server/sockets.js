const Chess = require('chess.js').Chess
const DarkChess = require('./dark')

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
 * Room schema
 *
 * 'name': {
 *    players: [String], // id
 * 		turn: 0 // -1 for not started, 0 for white, 1 for black
 * 		board: Chess
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

  const updateBoard = room => {
    let board = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => {
        return room.board.get(DarkChess.coordsToSquare(r, c))
      })
    )

    let white = DarkChess.foggify(board, 'w')
    let black = DarkChess.foggify(board, 'b')

    io.to(room.players[0]).emit('updateBoard', white)
    io.to(room.players[1]).emit('updateBoard', black)
  }

  io.on('connection', socket => {
    // autoassign id
    var id = hat(8)
    while (Object.keys(users).includes(id)) {
      id = hat(8)
    }

    // add socket to room of its id
    // socket.emit('id', id)
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
          room.board = new Chess()

          io.to(room.players[0]).emit('startGame', 'w')
          io.to(room.players[1]).emit('startGame', 'b')

          // update the board
          updateBoard(room)

          // kickstart the turn
          io.to(room.players[0]).emit('yourTurn')
        }
      } else {
        // create a room
        rooms[name] = {
          players: [id],
          turn: -1,
          board: null
        }

        users[id] = name
        socket.emit('joinRoomSuccess')
      }
    })

    // play move
    socket.on('move', move => {
      let roomId = users[id]
      if (!roomId) return
      let room = rooms[roomId]
      if (!room) return

      // check if its the player's turn
      let turn = room.turn
      if (room.players[turn] !== id) return
      if (room.board.move(move)) {
        updateBoard(room)

        io.to(room.players[turn]).emit('turnComplete')
        room.turn = 1 - turn
        io.to(room.players[room.turn]).emit('yourTurn')
      }
    })

    // disconnect
    socket.on('disconnect', () => {
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
