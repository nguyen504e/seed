/**
 * Socket.io configuration
 */

import SocketIo from 'socket.io'

import profile from '../profile'
import server from './server'

const promise = new Promise(resolve => {

  // When the user disconnects.. perform this
  const onDisconnect = socket => {
    console.info(socket)
  }

  // When the user connects.. perform this
  const onConnect = socket => {
    // When the client emits 'info', this listens and executes
    socket.on('info', data => {
      console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2))
    })

    resolve(socket)
  }

  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }))

  const socketio = SocketIo(server, {
    serveClient: profile.env !== 'production',
    path:        '/socket.io-client'
  })

  socketio.on('connection', socket => {
    socket.address = socket.handshake.address !== null ?
      socket.handshake.address.address + ':' + socket.handshake.address.port :
      profile.domain

    socket.connectedAt = new Date()

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket)
      console.info('[%s] DISCONNECTED', socket.address)
    })

    // Call onConnect.
    onConnect(socket)
    console.info('[%s] CONNECTED', socket.address)
  })
})

export default promise
