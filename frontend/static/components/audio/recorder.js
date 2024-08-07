const RecorderContainer = document.getElementById("recorder-container");
const stopButton = document.getElementById("record-new");
const audioElement = document.getElementById("last-recording");
const volumeElement = document.getElementById("volume");
const volumeWrapper = document.getElementById("volumneWrapper");
let listObject = document.getElementById("recordings");

let audioContext = null;
let micStreamAudioSourceNode;
let audioWorkletNode;
let recording = false;
let gainNode;
let buffers = [];
let stream;
let [track] = [];

stopButton.addEventListener("click", function () {
  if (recording) {
    this.classList.remove("recording");
    this.innerText = "Start Recording";
    stop(listObject);
  } else {
    this.classList.add("recording");
    this.innerText = "Stop Recording";
    start();
  }
  recording = !recording;
});

async function start() {
  audioElement.src = "";
  audioElement.style.display = "none";
  volumeWrapper.style.display = "flex";
  volumeElement.value = "50";

  try {
    if (
      !window.AudioContext ||
      !window.MediaStreamAudioSourceNode ||
      !window.AudioWorkletNode
    ) {
      alert("Your browser does not support the required APIs");
      return;
    }

    if (null === audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var options = { audio: true, video: false };
      await audioContext.audioWorklet.addModule(
        "static/components/audio/audio-processor.js"
      );
    }

    var options = { audio: true, video: false };
    stream = await navigator.mediaDevices.getUserMedia(options);
    [track] = stream.getAudioTracks();
    micStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    audioWorkletNode = new AudioWorkletNode(audioContext, "audio-processor");
    gainNode = audioContext.createGain();
    micStreamAudioSourceNode
      .connect(gainNode)
      .connect(audioWorkletNode)
      .connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    audioWorkletNode.port.addEventListener("message", (event) => {
      buffers.push(event.data.buffer);
    });
    audioWorkletNode.port.start();

    const parameter = audioWorkletNode.parameters.get("isRecording");
    parameter.setValueAtTime(1, audioContext.currentTime);
  } catch (e) {
    console.log(e);
  }
}

function stop() {
  audioElement.style.display = "initial";
  volumeWrapper.style.display = "none";

  const settings = track.getSettings();
  track.stop();
  audioWorkletNode.port.close();
  const parameter = audioWorkletNode.parameters.get("isRecording");

  parameter.setValueAtTime(0, audioContext.currentTime);

  const blob = encodeAudio(buffers, settings); // <11>
  const url = URL.createObjectURL(blob);
  audioElement.src = url;

  var audioObject = document.createElement("audio");
  audioObject.setAttribute("src", url);
  audioObject.setAttribute("controls", true);

  var holderObject = document.createElement("div");
  holderObject.setAttribute("key", listObject.children.length + 1);
  holderObject.setAttribute("class", "rec-row");
  holderObject.append(audioObject);

  listObject.append(holderObject);
  buffers = [];
}

volumeElement.addEventListener("input", function (e) {
  gainNode.gain.setValueAtTime(
    parseInt(e.target.value) / 100,
    audioContext.currentTime
  );
});
