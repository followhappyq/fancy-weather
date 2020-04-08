const properties = {
  unsplash: "h016S_7pAl7MHncLE8OtNR6wrBeBv2iS035G8KuCCA4",
  opencage: "a7bc7920be7b4e7fa5fefa29178826b4",
};

let currentLocale = "EN";
let currentCoordinate = {
  lng: "",
  lat: "",
};

const locales = {
  opencageLocal: {
    EN: "en-us",
    PL: "pl-pl",
    RU: "ru-ru",
  },
};

let date = new Date();
date.setDate(date.getDate() + 1);
