/** DOM elements START */
const body = document.querySelector("body");
const backgroundImage = document.querySelector(".refresh-image");
const languageSelected = document.querySelector(".locales select");

/** Voice recognition DOM elements START*/
const btn = document.querySelector(".voice-recognition .talk");
const voiceInput = document.querySelector(".voice-recognition .result");
/** Voice recognition DOM elements END */

/** Opencage DOM elements START */
const searchField = document.querySelector(".search-field .result");
const searchButton = document.querySelector(".voice-recognition .search");
/** Opencage DOM elements END */

/** Weather DOM elements  START*/

const temperatureDescription = document.querySelector(".weather-description");
const temperatureDegree = document.querySelector(".weather-degree");
/** Weather DOM elements  END*/

/** DOM elements END */

/**Change background START */
backgroundImage.addEventListener("click", getLinkToImage);

async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?query=morning&client_id=${properties.unsplash}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3) ), url('${data.urls.regular}')`;
  } else {
    console.log(res.status);
  }
}

/**Change background END */

/** SpeechRecognition START */
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

/** SpeecRecognition END */

/**Weather API START https://darksky.net/dev/docs*/

window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = `https://cors-anywhere.herokuapp.com/`;
      const api = `${proxy}https://api.darksky.net/forecast/a0649363ce478d7e542996beff8f43c7/${lat},${long}?lang=${currentInfo.currentLocale}`;
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const { temperature, summary } = data.currently;
          //DOM elements
          temperatureDegree.textContent = `${Math.floor(temperature)} °F`;
          temperatureDescription.textContent = summary;
          console.log(data);
        });
    });
  } else {
    console.log(1);
  }
});

async function getCityWeather(cityInfo) {
  const proxy = `https://cors-anywhere.herokuapp.com/`;
  const api = `${proxy}https://api.darksky.net/forecast/a0649363ce478d7e542996beff8f43c7/${currentInfo.currentCoordinate.lat},${currentInfo.currentCoordinate.lng}?lang=${currentInfo.currentLocale}`;
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { temperature, summary } = data.currently;
      const { daily } = data;
      currentInfo.weatherInfo.temperature = temperature;
      currentInfo.weatherInfo.summary = summary;
      currentInfo.currentTimeZone = data.timezone;
      console.log(daily);
    });
}

/** Weather API END */

/** Opencage API START  https://opencagedata.com/api*/
// const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=a7bc7920be7b4e7fa5fefa29178826b4&language=PL`;

async function getCityInfo(city) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=a7bc7920be7b4e7fa5fefa29178826b4&language=${
    locales.opencageLocal[currentInfo.currentLocale]
  }`;
  let info;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      info = data.results[0];
      /**change state in properties.js */
      currentInfo.currentCoordinate = data.results[0].geometry;
      currentInfo.currentCity = data.results[0].formatted;
      console.log(data.results[0]);
    });
  return info;
}

function addInformationOnPage() {
  getCityInfo(searchField.value == "" ? "Minsk" : searchField.value);
  getCityWeather();
}

/**Opencage API END */

function translateData() {}

/**Add Event Listener START */
btn.addEventListener("click", () => {
  recognition.start();
});

searchButton.addEventListener("click", addInformationOnPage);

languageSelected.addEventListener("change", () => {
  currentInfo.currentLocale = languageSelected.value;
});
/**Add Event Listener END */
