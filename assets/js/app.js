//Dom elements
const body = document.querySelector("body");

/** Voice recognition DOM elements START*/
const btn = document.querySelector(".voice-recognition .talk");
const voiceInput = document.querySelector(".voice-recognition .result");
/** Voice recognition DOM elements END */

async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=morning&client_id=${properties.unsplash}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3) ), url('${data.urls.full}')`;
  } else {
    console.log(res.status);
  }
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log("vocie is activated");
};

recognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  console.log(transcript);
  saveRecognitionToInput(transcript);
};

const saveRecognitionToInput = (transcript) => {
  voiceInput.value = transcript;
};

//Add listener to the button
btn.addEventListener("click", () => {
  recognition.start();
});
