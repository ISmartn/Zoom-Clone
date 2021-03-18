// const { PeerServer } = require("peer");

// const { text } = require("express");
// const bootstrap = require('bootstrap')

const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});
const peers = {}
let myVideoStream;


navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        socket.on('user-connected', (userId) => {
            connecToNewUser(userId, stream);

        })
        peer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('steam', userVideoStream => {
                addVideoStream(video, userVideostream)
            })
        })
        let text = $('input')
        // console.log(text)
        $('html').keydown((e) => {
            if (e.which == 13 && text.val().length !== 0) {
                // console.log(text.val());
                socket.emit('message', text.val());
                text.val('');
            }
        })
        // Receving incoming messages from server
        socket.on('createMessage', message => {
            // console.log('this is coming from server',message)
            $('.messages').append(
                `<li class = "message">
        <b>user</b><br/>
        ${message}
  </li>`
            );
            scrollToBottom()
        })


    })

peer.on('open', id => {
    // console.log(id);
    socket.emit('join-room', ROOM_ID, id);
})
socket.emit('join-room', ROOM_ID);



const connecToNewUser = (userId, stream) => {
    // console.log(userId);
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    //This is simply new user video stream
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.append(video);
};


// Sending messages




//Function to prevent overflow of the message window
// Scroll function in message window

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"))
}

//Mute or Unmute audio
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}
const setMuteButton = () => {
    const html = `<i class="bi bi-mic-mute-fill"></i>
<span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}
const setUnmuteButton = () => {
    const html = `<i class="bi bi-mic-fill"></i>
<span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}

//Play and Stop Video
const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `<i class="bi bi-camera-video-fill"></i>
  <span>Stop Video</span>`
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `<i class="bi bi-camera-video-off-fill"></i>
  <span>Play Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;
}