import React from 'react'
import Chessboard from 'chessboardjsx'
import Socket from './Socket'

const coordsToSquare = (r, c) => {
  return String.fromCharCode(c + 97) + (r + 1)
}

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      roomName: '',
      position: {},
      myTurn: false,
      myColor: ''
    }

    Socket.on('updateBoard', board => {
      console.log('received board update')
      let newPosition = {}
      board.forEach((row, r) => {
        row.forEach((square, c) => {
          if (square) {
            newPosition[coordsToSquare(r, c)] =
              square.color + square.type.toUpperCase()
          }
        })
      })
      this.setState({ position: newPosition })
    })

    Socket.on('yourTurn', () => {
      this.setState({ myTurn: true })
    })

    Socket.on('startGame', color => this.setState({ myColor: color }))

    Socket.on('turnComplete', () => this.setState({ myTurn: false }))
  }

  handleRoomNameChange = e => {
    this.setState({ roomName: e.target.value })
  }

  enterRoom = () => {
    if (this.state.roomName === '') return

    Socket.emit('joinRoom', this.state.roomName)
  }

  onDrop = move => {
    if (this.state.myTurn) {
      Socket.emit('move', { from: move.sourceSquare, to: move.targetSquare })
    }
  }

  render() {
    return (
      <div id='container'>
        <h1>dark chess</h1>
        {this.state.myTurn && <h2>your turn!</h2>}
        <Chessboard
          position={this.state.position}
          onDrop={this.onDrop}
          orientation={this.state.myColor === 'w' ? 'white' : 'black'}
          transitionDuration={0}
        />
        <input placeholder='room name' onChange={this.handleRoomNameChange} />
        <button onClick={this.enterRoom}>submit</button>
      </div>
    )
  }
}
