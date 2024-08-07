const AudioRecord = () => {
  return ` <div>
      ${backBtn()}
      <div class="audio-container">
        <div class="record-container">
          <div class="record-wrapper">
            <button id="record-new">Start Recording</button>

            <div id="volumneWrapper" style="display:none">
              <img src="static/assets/volume.png" alt="volume" />
              <input
                type="range"
                min="0"
                max="100"
                id="volume"
              />
            </div>
            <audio style="display:none" id="last-recording" controls />
          </div>
        </div>
        <div class="recent-recorders">
          <h2>Recent Recordings</h2>
          <div id="recordings"></div>
        </div>
      </div>
    </div>`;
};

export default AudioRecord;
