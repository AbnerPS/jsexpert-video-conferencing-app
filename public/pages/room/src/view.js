class View {
    constructor() {
        this.recorderBtn = document.getElementById('record')
    }

    createVideoElement({ muted = true, src, srcObject }) {
        const video = document.createElement('video')
        video.muted = muted
        video.src = src
        video.srcObject = srcObject

        if(src) {
            video.controls = true
            video.loop = true
            Util.sleep(200).then(_ => video.play)
        }

        if(srcObject) {
            video.addEventListener("loadedmetadata", _ => video.play())
        }

        return video
    }

    renderVideo({ userID, stream = null, url = null, isCurrentID = false, muted = true}) {
        const video = this.createVideoElement({ muted, src: url, srcObject: stream })
        this.appendToHTMLTree(userID, video, isCurrentID)
    }

    appendToHTMLTree(userID, video, isCurrentID) {
        const div = document.createElement('div')
        div.id = userID
        div.classList.add('wrapper')
        div.append(video)

        const div2 = document.createElement('div')
        div2.innerText = isCurrentID ? '' : userID
        div.append(div2)

        const videoGrid = document.getElementById('video-grid')
        videoGrid.append(div)

    }

    setParticipants(count) {
        const myself = 1
        const participants = document.getElementById('participants')
        participants.innerHTML = (count + myself)
    }

    removeVideoElement(id) {
        const element = documento.getElementById(id)
        element.remove()
    }

    toggleRecordingButtonColor(isActive = true) {
        this.recorderBtn.style.color = isActive ? 'red' : 'white'
    }

    onRecordClick(command) {
        this.recordingEnabled = false
        return () => {
            const isActive = this.recordingEnabled = !this.recordingEnabled
            command(this.recordingEnabled)
            this.toggleRecordingButtonColor(isActive)
            
        }
    }

    configureRecordButton(command) {
        this.recorderBtn.addEventListener('click', this.onRecordClick(command))
    }
}