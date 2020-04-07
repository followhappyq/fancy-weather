const properties = {
  unsplash: "h016S_7pAl7MHncLE8OtNR6wrBeBv2iS035G8KuCCA4",
  opencagedata: "a7bc7920be7b4e7fa5fefa29178826b4",
};

let currentCity = "Belarus,Minsk";
let currentInfo = {
  currentCity: "Belarus, Minsk",
  currentCoordinate: {
    lat: 53.902334,
    lng: 27.5618791,
  },
  currentLocale: "EN",
  weatherInfo: {
    currentTemperature: 0,
    summary: "",
  },
  currentTimeZone: "Europe/Minsk",
};

const locales = {
  opencageLocal: {
    EN: "en-us",
    PL: "pl-l",
    RU: "ru-ru",
  },
};

let date = new Date();
date.setDate(date.getDate() + 1);

console.log(date);

console.log(new Date().toLocaleDateString("pl-PL", { weekday: "long" }));
console.log(
  new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/Moscow" })
);
