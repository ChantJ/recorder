import { setupVideo } from "./recorder.js";

const VideoRecord = () => {
  window.onload = () => {
    setupVideo();
  };

  return `<div>
      ${backBtn()}
      <div class="container">
        <div class="record-container">
          <div id="recordContainer" class="video-record-wrapper">
            <video id="video"></video>
            <canvas id="video-canvas"></canvas>
            <div class="buttons-container">
              <button id="start">Start Recording</button>
              <button id="stop" style="display:none">
                Stop Recording
              </button>
              <button id="upload" style="display: none;">
                Upload Photo
              </button>
              <input
                type="file"
                id="file-input"
                accept="image/*,.pdf"
                style="display: none;"
              />
            </div>
          </div>
          <div id="playbackContainer" style="display:none">
            <video id="playback-video" controls></video>
            <div class="buttons-container">
              <button id="go-to-new">Go To New Recording</button>
            </div>
          </div>
        </div>
        <div class="recent-recorders">
          <h2>Recent Recordings</h2>
          <div id="video-recordings"></div>
        </div>
      </div>
    </div>`;
};

export default VideoRecord;
