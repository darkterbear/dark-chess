import io from 'socket.io-client'

// const URL = 'https://darkchess-api.terranceli.com'
const URL = 'http://localhost:3002'

const Socket = io(URL)

export default Socket
