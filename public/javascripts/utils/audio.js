export function unlock() {
  // alert('audio.unlock()')
  // create empty buffer and play it
  var buffer = context.createBuffer(1, 1, 22050);
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);

  // play the file. noteOn is the older version of start()
  source.start ? source.start(0) : source.noteOn(0);

  // // by checking the play state after some time, we know if we're really unlocked
  // setTimeout(function () {
  //   if (
  //     source.playbackState === source.PLAYING_STATE ||
  //     source.playbackState === source.FINISHED_STATE
  //   ) {
  //     console.log("finished unlocking");
  //   }
  // }, 0);
}

export function play() {
  source = context.createBufferSource();
  source.buffer = killBillBuffer;
  source.connect(context.destination);
  source.start();
}

export function stop() {  
  if (source !== undefined && source !== null) {
    try{
    // alert('audio.stop() start');
    source.stop();
    // alert('audio.stop() finish');
    } catch(err) {
      // alert(`audio.stop() err=${err}`);
    }
  }
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext(); // Make it crossbrowser
var gainNode = context.createGain();
gainNode.gain.value = 1; // set volume to 100%
var source;

var killBillBuffer = void 0;
// The Promise-based syntax for BaseAudioContext.decodeAudioData() is not supported in Safari(Webkit).
window
  .fetch("/audio/kill_bill_whistle.wav")
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) =>
    context.decodeAudioData(
      arrayBuffer,
      (audioBuffer) => {
        killBillBuffer = audioBuffer;
      },
      (error) => console.error(error)
    )
  );
