class Business {
    constructor({ room, media, view, socketBuilder }) {
        this.room = room
        this.media = media
        this.view = view
        this.socketBuilder = socketBuilder
         .setOnUserConnected(this.onUserConnected())
         .setOnUserDisconnected(this.onUserDisconnected())
         .build()
        this.socketBuilder.emit('join-room', this.room, 'Teste-01')
        this.currentStream = {}
    }

    static inicialize(deps) {
        const instance = new Business(deps)
        return instance._init()
    }

    async _init() {
        this.currentStream = await this.media.getCamera()
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
        }
    }
}