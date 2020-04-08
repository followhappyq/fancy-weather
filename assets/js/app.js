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

const temperatureDegree = document.querySelector(".weather-degree");
const weatherCity = document.querySelector(".information-container .city");
const time = document.querySelector(".information-container .time");
const summaryInfo = document.querySelector(".information-container .summary");
const feels = document.querySelector(".information-container .feels");
const wind = document.querySelector(".information-container .wind");
const humi = document.querySelector(".information-container .humidity");
const forecastTemp = document.querySelectorAll(".forecast-temperature");
const forecastDay = document.querySelectorAll(".forecast-day");

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
  saveRecognitionToInput(transcript);
};

const saveRecognitionToInput = (transcript) => {
  voiceInput.value = transcript;
};

/** SpeecRecognition END */

/**Weather API START https://darksky.net/dev/docs*/

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const cityInfo = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      getCityWeather(cityInfo);
      getCityInfoByCoordinate(cityInfo);
    });
  } else {
    console.log(1);
  }
});

async function getCityWeather(cityInfo) {
  const proxy = `https://cors-anywhere.herokuapp.com/`;
  const api = `${proxy}https://api.darksky.net/forecast/a0649363ce478d7e542996beff8f43c7/${cityInfo.lat},${cityInfo.lng}?lang=${currentLocale}`;
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const {
        temperature,
        summary,
        windSpeed,
        humidity,
        apparentTemperature,
      } = data.currently;
      const { daily } = data;
      temperatureDegree.textContent = `${Math.floor(temperature)} °F`;
      summaryInfo.textContent = summary;
      feels.textContent = `Feels Like: ${Math.floor(apparentTemperature)}`;
      wind.textContent = `Wind speed: ${Math.floor(windSpeed)} km/h`;
      humi.textContent = `Humidity: ${Math.floor(humidity * 100)} %`;
      dailyWeather(daily.data);
    });
  currentCoordinate = cityInfo;
}

/** Weather API END */

/** Opencage API START  https://opencagedata.com/api*/
// const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=a7bc7920be7b4e7fa5fefa29178826b4&language=PL`;

async function getCityInfoByName(city) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${properties.opencage}&language=${locales.opencageLocal[currentLocale]}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      addInformationAboutCity(data);
      getCityWeather(data.results[0].geometry);
    });
}

async function getCityInfoByCoordinate(cityInfo) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${cityInfo.lat}+${cityInfo.lng}&key=${properties.opencage}&language=${locales.opencageLocal[currentLocale]}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      addInformationAboutCity(data);
    });
}

function addInformationAboutCity(data) {
  const { timezone } = data.results[0].annotations;
  const { city, country } = data.results[0].components;
  const { formatted } = data.results[0];
  /**Add data to PAGE */
  weatherCity.textContent = `${
    city == undefined ? formatted : city + "," + country
  }`;
  time.textContent = `${new Date().toLocaleDateString("en-GB", {
    timeZone: timezone.name,
    dateStyle: "full",
  })}
  ${new Date().toLocaleTimeString("en-GB", {
    timeZone: timezone.name,
    hour: "numeric",
    minute: "numeric",
  })}`;
}

function dailyWeather(data) {
  let count = new Date().getDay() + 1;
  for (let index = 0; index < forecastDay.length; index++) {
    let weekDay = "";
    forecastTemp[index].textContent = `${Math.floor(
      data[index].temperatureMax
    )}`;
    weekDay = getWeekDays()[count];
    forecastDay[index].textContent =
      weekDay.slice(0, 1).toUpperCase() + weekDay.slice(1);
    count++;
  }
}

function getWeekDays() {
  let weekDays = {};
  let curDate = new Date();
  for (let i = 0; i < 7; ++i) {
    weekDays[curDate.getDay()] = curDate.toLocaleDateString(
      locales.opencageLocal[currentLocale],
      {
        weekday: "long",
      }
    );
    curDate.setDate(curDate.getDate() + 1);
  }

  return weekDays;
}

/**Opencage API END */

function translateData() {}

/**Add Event Listener START */
btn.addEventListener("click", () => {
  recognition.start();
});

searchButton.addEventListener("click", () => {
  getCityInfoByName(searchField.value);
});

languageSelected.addEventListener("change", () => {
  currentLocale = languageSelected.value;
  getCityInfoByName(searchField.value == "" ? "Minsk" : searchField.value);
});
/**Add Event Listener END */
