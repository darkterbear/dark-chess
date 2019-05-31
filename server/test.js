const io = require('socket.io-client')
const socket1 = io('http://localhost:3002')
const socket2 = io('http://localhost:3002')
const socket3 = io('http://localhost:3002')

var socket1Id
var socket2Id
var socket3Id
let roomName = 'test'

socket1.on('id', id => {
  socket1Id = id
  console.log(socket1Id)
})

socket2.on('id', id => {
  socket2Id = id
  console.log(socket2Id)
})

socket3.on('id', id => {
  socket3Id = id
  console.log(socket3Id)
})

// test room joining
socket1.on('joinRoomSuccess', () => {
  console.log('s1 joined room')
})

socket2.on('joinRoomSuccess', () => {
  console.log('s2 joined room')
})

socket3.on('joinRoomSuccess', () => {
  console.log('s3 joined room')
})

socket1.on('joinRoomFailure', () => {
  console.log('s1 join failed')
})

socket2.on('joinRoomFailure', () => {
  console.log('s2 join failed')
})

socket3.on('joinRoomFailure', () => {
  console.log('s3 join failed')
})

// test startgame
socket1.on('startGame', () => console.log('s1 start game'))
socket2.on('startGame', () => console.log('s2 start game'))
socket3.on('startGame', () => console.log('s3 start game'))

socket1.emit('joinRoom', roomName)
socket2.emit('joinRoom', roomName)
socket3.emit('joinRoom', roomName)
