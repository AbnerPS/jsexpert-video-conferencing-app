const server = require('http').createServer((request, response) => {
    response.writeHead(204, {
        'Access-Control-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    })

    response.end('Hey there!')
})

const socketIO = require('socket.io')
const io = socketIO(server, {
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on('connection', socket => {
    console.log('connected', socket.id)
    socket.on('join-room', (roomID, userID) => {
        // adiciona os usuarios na mesma sala
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userID)
        socket.on('disconnected', () => {
            console.log('disconnected!', roomID, userID)
            socket.to(roomID).broadcast.emit('user-disconnected', userID)
        })
    })
})

const startServer = () => {
    const { address, port } = server.address
    console.log(`App running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)