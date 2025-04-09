import { useState, useRef } from "react";
import "./App.css";
import VideoPlayer from "./videoPlayer";
import axios from "axios";

function App() {
  const playerRef = useRef(null);
  const [videoLink, setVideoLink] = useState(null); // State to store the uploaded video link
  const [uploading, setUploading] = useState(false); // State to track upload status

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: videoLink
      ? [
          {
            src: videoLink,
            type: "application/x-mpegURL",
          },
        ]
      : [],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post("https://backend-3pou.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setVideoLink(response.data.videoUrl); // Set the video link from the server response
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>
        <h1>Video Streaming Application</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <p>Uploading...</p>}
      </div>
      {videoLink && (
        <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
      )}
    </>
  );
}

export default App;
