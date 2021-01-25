class View {
    constructor() {

    }

    createVideoElement({muted = true, src, srcObject}) {
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

    renderVideo({ userID, stream = null, url = null, isCurrentID = false}) {
        const video = this.createVideoElement({ src: url, srcObject: stream })
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
}