

const onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const room = urlParams.get('room');
  console.log('This is the room:', room)
  const socketUrl = 'http://localhost:3000'
  const socketBuilder = new SocketBuilder({ socketUrl })
  const peerConfig = Object.values({
    id: undefined,
    config: {
      port: 9000,
      host: 'localhost',
      path: '/'
    }
  })
  const peerBuilder = new PeerBuilder({ peerConfig })
  const view = new View()
  const media = new Media()
  const deps = {
    view,
    media,
    room,
    socketBuilder,
    peerBuilder
  }

  Business.inicialize(deps)
  
  // view.renderVideo({userID: 'Teste-01', url: 'https://media.giphy.com/media/muGYyrWwxOOMo/giphy.mp4'})
  // view.renderVideo({userID: 'Teste-02', isCurrentID: true, url: 'https://media.giphy.com/media/muGYyrWwxOOMo/giphy.mp4'})
  // view.renderVideo({userID: 'Teste-03', url: 'https://media.giphy.com/media/muGYyrWwxOOMo/giphy.mp4'})


}

window.onload = onload