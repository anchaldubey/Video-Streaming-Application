import { useState } from 'react'
import './App.css'
import VideoPlayer from './videoPlayer'
import { useRef } from 'react'

function App() {

  const playerRef = useRef(null)
  // Video link is hardcoded for now
  const videoLink = "http://localhost:8000/uploads/testVideo/37d3801e-df68-4fa4-8c0b-2e6c372567a0/index.m3u8"

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: 'application/x-mpegURL'
      }
    ]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
       <div>
        <h1>Video player</h1>
      </div>
      <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
      />
    </>
  )
}

export default App
