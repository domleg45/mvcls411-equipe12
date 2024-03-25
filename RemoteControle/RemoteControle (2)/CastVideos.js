let session;
let media;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let updateInterval;
let niveau = 1;
const seekSlider = document.getElementById('seekSlider');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
const applicationID = "3DDC41A0";
const videoList = [
  "https://transfertco.ca/video/DBillPrelude.mp4",
  "https://transfertco.ca/video/DBillSpotted.mp4",
  "https://transfertco.ca/video/usa23_7_02.mp4",
  // Add more video URLs as needed
];



document.getElementById("connectButton").addEventListener("click", () => {
  initializeApiOnly();

});


document.getElementById("startBtn").addEventListener("click", () => {
  if (session) {
    loadMedia(videoList[currentVideoIndex]);
  } else {
    alert("Connectez-vous sur chromecast en premier");
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (session) {
    currentVideoIndex = (currentVideoIndex - 1) % videoList.length;
    loadMedia(videoList[currentVideoIndex]);
  } else {
    alert("Connectez-vous sur chromecast en premier");
  }
});



document.getElementById("return").addEventListener("click", () => {
  if (media) {
    if (isPlaying) {
      currentVideoIndex = (currentVideoIndex.length === 0) % videoList.length;
      loadMedia(videoList[currentVideoIndex]);
    } else {
      currentVideoIndex = (currentVideoIndex.length === 0) % videoList.length;
      loadMedia(videoList[currentVideoIndex]);


    }
  }
});


// document.getElementById("forW").addEventListener("click", () => {
//   if (media) {
//     if(isPlaying){
//     currentVideoIndex = (currentVideoIndex.length === 10++) % videoList.length;
//     loadMedia(videoList[currentVideoIndex]);
//   } else  {
//     currentVideoIndex = (currentVideoIndex.length === 10) % videoList.length;
//     loadMedia(videoList[currentVideoIndex]);


//   }
// }});

document.getElementById("playBtn").addEventListener("click", () => {
  if (media) {
    if (isPlaying) {
      media.pause(null, onMediaCommandSuccess, onError);
    } else {
      media.play(null, onMediaCommandSuccess, onError);
    }
    isPlaying = !isPlaying;
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (session) {
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
    loadMedia(videoList[currentVideoIndex]);
  } else {
    alert("Connectez-vous sur chromecast en premier");
  }
});



function sessionListener(newSession) {
  session = newSession;
  document.getElementById("startBtn").style.display = "block";
  document.getElementById("nextBtn").style.display = "block";
  document.getElementById("prevBtn").style.display = "block";
  document.getElementById("volumeUp").style.display = "block";
  document.getElementById("return").style.display = "block";
}

function onMediaDiscovered(mediaItem) {
  media = mediaItem;
  document.getElementById("playBtn").style.display = "block";
}

function receiverListener(availability) {
  if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
    document.getElementById("connectButton").style.display = "block";
  } else {

  }
}


function onInitSuccess() {
  console.log("Chromecast init success");
}

function onError(error) {
  console.error("Chromecast initialization error", error);
}

function onMediaCommandSuccess() {
  console.log("Media command success");
}

function initializeApiOnly() {
  const sessionRequest = new chrome.cast.SessionRequest(
    chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  );
  const apiConfig = new chrome.cast.ApiConfig(
    sessionRequest,
    sessionListener,
    receiverListener
  );

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function loadMedia(videoUrl) {
  const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, "video/mp4");
  const request = new chrome.cast.media.LoadRequest(mediaInfo);

  session.loadMedia(request, onMediaDiscovered, onError);
}

// Function to initialize the Cast SDK
function initializeCastApi() {
  // Set up Cast SDK options
  const castOptions = new cast.framework.CastOptions();
  castOptions.receiverApplicationId = applicationID;

  // Initialize CastContext with the CastOptions
  const castContext = cast.framework.CastContext.getInstance();
  castContext.setOptions(castOptions);

  // Your existing event listener and button click handling code
  const castButton = document.getElementById("castButton");
  cast.framework.CastContext.getInstance().addEventListener(
    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
    function (event) {
      switch (event.castState) {
        case cast.framework.CastState.NO_DEVICES_AVAILABLE:
          castButton.disabled = true;
          break;
        case cast.framework.CastState.NOT_CONNECTED:
          castButton.disabled = false;
          break;
        case cast.framework.CastState.CONNECTING:
        case cast.framework.CastState.CONNECTED:
          castButton.disabled = true;
          break;
      }
    }
  );

  // Add a click event listener to the Cast button
  castButton.addEventListener("click", function () {
    // Get the current Cast session
    const session = castContext.getCurrentSession();

    // Check if there is an active Cast session
    if (session) {
      // Already connected - do nothing or disconnect if needed
    } else {
      // Not connected - initiate a Cast session
      castContext.requestSession().then(
        function () {
          // Handle successful connection
          console.log("Connected to Chromecast");
          initializeApiOnly();
        },
        function (errorCode) {
          // Handle connection error
          console.error("Error connecting to Chromecast: " + errorCode);
        }
      );
    }
  });
}
