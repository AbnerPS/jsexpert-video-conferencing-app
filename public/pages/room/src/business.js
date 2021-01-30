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
        this.usersRecordings = new Map()
    }
    
    static inicialize(deps) {
        const instance = new Business(deps)
        return instance._init()
    }
    
    async _init() {
        this.view.configureRecordButton(this.onRecordPressed.bind(this))
        this.currentStream = await this.media.getCamera()
        this.socket = this.socketBuilder
        .setOnUserConnected(this.onUserConnected())
        .setOnUserDisconnected(this.onUserDisconnected())
        .build()

        this.currentPeer = await this.peerBuilder
        .setOnError(this.onPeerError())
        .setOnConnectionOpened(this.onPeerConnectionOpened())
        .setOnCallReceived(this.onPeerCallReceived())
        .setOnPeerStreamReceived(this.onPeerStreamReceived())
        .setOnCallError(this.onPeerCallError())
        .setOnCallClose(this.onPeerCallClose())
        .build()
        this.addVideoStream(this.currentPeer.id)
    }

    addVideoStream(userID, stream = this.currentStream) {
        const recorderInstance = new Recorder(userID, stream)
        this.usersRecordings.set(recorderInstance.filename, recorderInstance)
        if(this.recordingEnabled) {
            recorderInstance.startRecording()

        }
        const isCurrentID = false
        this.view.renderVideo({
            userID,
            stream,
            isCurrentID
        })
    }

    onUserConnected() {
        return userID => {
            console.log('User connected:', userID)
        }
    }

    onUserDisconnected() {
        return userID => {
            console.log('User disconnected:', userID)
            if(this.peers.has(userID)) {
                this.peers.get(userID).call.close()
                this.peers.delete(userID)
            }

            this.view.setParticipants(this.peers.size)
            this.view.removeVideoElement(userID)
        }
    }

    onPeerError() {
        return error => {
            console.error('Error on peer', error)
        }
    }

    onPeerConnectionOpened() {
        return peer => {
            const id = peer.id
            this.socket.emit('join-room', this.room, id)
        }
    }

    onPeerCallReceived() {
        return call => {
            console.log('Answering call', call)
            call.answer(this.currentStream)
        }
    }

    onPeerStreamReceived() {
        return (call, stream) => {
            const callerID = call.peer
            this.addVideoStream(callerID, stream)
            this.peers.set(callerID, { call})
            this.view.setParticipants(this.peers.size)
        }
    }

    onPeerCallError() {
        return (call, error) => {
            console.log('An call error ocurrend!', error)
            this.view.removeVideoElement(call.peer)
        }
    }

    onPeerCallClose() {
        return call => {
            console.log('Call closed!', call.peer)
        }
    }

    onRecordPressed(recordingEnabled) {
        this.recordingEnabled = recordingEnabled
        for(const [key, value] of this.usersRecordings) {
            if(this.recordingEnabled) {
                value.startRecording()
                continue;
            }
            this.stopRecording(key)
        }
    }

    async stopRecording(userID) {
        const usersRecordings = this.usersRecordings
        for(const [key, value] of usersRecordings) {
            const isContextUser = key.includes(userID)
            if(!isContextUser) continue;

            const rec = value
            const isRecordingActive = rec.recordingActive
            if(!isRecordingActive) continue;

            await rec.stopRecording()
        }
    }
}