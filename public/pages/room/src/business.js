class Business {
    constructor({ room, media, view, socketBuilder, peerBuilder }) {
        this.room = room
        this.media = media
        this.view = view
        this.socket = {}
        this.socketBuilder = socketBuilder
        this.currentStream = {}
        this.peerBuilder = peerBuilder
        this.currentPeer = {}
        this.peers = new Map()
    }
    
    static inicialize(deps) {
        const instance = new Business(deps)
        return instance._init()
    }
    
    async _init() {
        this.currentStream = await this.media.getCamera()
        this.socket = this.socketBuilder
        .setOnUserConnected(this.onUserConnected())
        .setOnUserDisconnected(this.onUserDisconnected())
        .build()
        this.currentPeer = await this.peerBuilder
        .setOnError(this.setOnError())
        .setOnConnectionOpened(this.onPeerConnectionOpened())
        .setOnCallReceived(this.onPeerCallReceived())
        .setOnPeerStreamReceived(this.onPeerStreamReceived())
        .build()
        this.addVideoStream('Teste-01')
    }

    addVideoStream(userID, stream = this.currentStream) {
        const isCurrentID = false
        this.view.renderVideo({
            userID,
            stream,
            isCurrentID
        })
    }

    onUserConnected = function() {
        return userID => {
            console.log('User connected:', userID)
        }
    }

    onUserDisconnected = function() {
        return userID => {
            console.log('User disconnected:', userID)
            this.currentPeer.call(userID, this.currentStream)
        }
    }

    onPeerError = function() {
        return error => {
            console.error('Error on peer', error)
        }
    }

    onPeerConnectionOpened = function() {
        return peer => {
            const id = peer.id
            this.socket.emit('join-room', this.room, id)
        }
    }

    onPeerCallReceived = function() {
        return call => {
            console.log('Answering call', call)
            call.answer(this.currentStream)
        }
    }

    onPeerStreamReceived = function() {
        return (call, stream) => {
            const callerID = call.peer
            this.addVideoStream(callerID, stream)
            this.peers.set(callerID, { call})
            this.view.setParticipants(this.peers.size)
        }
    }
}