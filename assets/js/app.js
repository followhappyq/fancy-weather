//Dom elements
const body = document.querySelector("body");

const btn = document.querySelector(".talk");
const content = document.querySelector(".content");

async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=morning&client_id=${properties.unsplash}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    body.style.backgroundImage = `url(${data.urls.full})`;
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
};

//Add listener to the button
btn.addEventListener("click", () => {
  recognition.start();
});
