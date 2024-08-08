let canvas,
  videoElt,
  recordContainer,
  playbackContainer,
  playbackVideoEl,
  startBtn,
  stopBtn,
  uploadBt,
  ctx,
  gotToNew,
  listObject,
  fileInput;

let constraintObj = {
  audio: true,
  video: {
    facingMode: "user",
  },
};

let dataFramId;
let mediaRecorder;
let chunks = [];
let overlayImage = null;

const desiredWidth = 200; // Example: 200px width
const desiredHeight = 200;

export async function setupVideo() {
  try {
    canvas = document.getElementById("video-canvas");
    startBtn = document.getElementById("start");
    stopBtn = document.getElementById("stop");
    uploadBt = document.getElementById("upload");
    fileInput = document.getElementById("file-input");
    gotToNew = document.getElementById("go-to-new");
    startBtn.onclick = start;
    stopBtn.onclick = stop;
    uploadBt.onclick = uploadPhoto;
    gotToNew.onclick = goToNewRecord;
    fileInput.addEventListener("change", upload);
    listObject = document.getElementById("video-recordings");

    videoElt = document.getElementById("video");
    recordContainer = document.getElementById("recordContainer");
    playbackContainer = document.getElementById("playbackContainer");
    playbackVideoEl = document.getElementById("playback-video");

    let stream = await navigator.mediaDevices.getUserMedia(constraintObj);
    setupStream(stream);
  } catch (err) {
    console.log(err.name, err.message);
  }
}

function setupStream(stream) {
  ctx = canvas.getContext("2d");

  videoElt.srcObject = stream;
  videoElt.play();

  videoElt.onloadedmetadata = function (ev) {
    canvas.width = videoElt.videoWidth;
    canvas.height = videoElt.videoHeight;

    // drawFrame();
    var videoStream = canvas.captureStream();
    mediaRecorder = new MediaRecorder(videoStream);
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function (e) {
      //stop drawing
      if (dataFramId) cancelAnimationFrame(dataFramId);
      var blob = new Blob(chunks, { type: "video/webm" });
      chunks = [];

      //show playback
      var videoURL = URL.createObjectURL(blob);
      recordContainer.style.display = "none";
      playbackContainer.style.display = "flex";
      playbackVideoEl.src = videoURL;


      //create elements to add to recent lists
      var videoObject = document.createElement("video");
      videoObject.setAttribute("src", videoURL);
      videoObject.setAttribute("controls", false);
      videoObject.width = 100;
      videoObject.heigh = "100px";

      var holderObject = document.createElement("div");
      holderObject.setAttribute("key", listObject.children.length + 1);
      holderObject.setAttribute("class", "rec-row");
      holderObject.style.cursor = "pointer";
      holderObject.innerText = `video ${listObject.children.length + 1}`;
      holderObject.append(videoObject);
      holderObject.addEventListener("click", playPreviousVideo);
      listObject.append(holderObject);
    };
  };
}
function drawFrame() {
  ctx.drawImage(videoElt, 0, 0, canvas.width, canvas.height); // Draw video frame
  if (overlayImage) {
    const aspectRatio = overlayImage.width / overlayImage.height;
    let drawWidth, drawHeight;

    // Calculate the dimensions to maintain aspect ratio
    if (overlayImage.width > overlayImage.height) {
      drawWidth = desiredWidth;
      drawHeight = drawWidth / aspectRatio;
    } else {
      drawHeight = desiredHeight;
      drawWidth = drawHeight * aspectRatio;
    }

    // Ensure the image fits within the desired area
    if (drawWidth > desiredWidth) {
      drawWidth = desiredWidth;
      drawHeight = drawWidth / aspectRatio;
    }

    if (drawHeight > desiredHeight) {
      drawHeight = desiredHeight;
      drawWidth = drawHeight * aspectRatio;
    }
    overlayImage.width = drawWidth;
    overlayImage.height = drawHeight;

    // Calculate the position top left the image
    const x = 10;
    const y = 10;

    // Draw the image on the canvas
    ctx.drawImage(overlayImage, x, y, drawWidth, drawHeight);
  }
  dataFramId = requestAnimationFrame(drawFrame); // Continue drawing
}
function start() {
  startBtn.style.display = "none";
  stopBtn.style.display = "initial";
  uploadBt.style.display = "initial";
  videoElt.classList.add("video-recording");
  drawFrame();
  mediaRecorder.start();
}

function stop() {
  startBtn.style.display = "initial";
  stopBtn.style.display = "none";
  uploadBt.style.display = "none";
  videoElt.classList.remove("video-recording");
  mediaRecorder.stop();
}

function uploadPhoto() {
  fileInput.click();
}

function upload() {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    if (file.type.startsWith("image/")) {
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          overlayImage = img;
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

function goToNewRecord() {
  recordContainer.style.display = "flex";
  playbackContainer.style.display = "none";
}

function playPreviousVideo() {
  recordContainer.style.display = "none";
  playbackContainer.style.display = "flex";
  playbackVideoEl.src = this.children[0].src;
}
