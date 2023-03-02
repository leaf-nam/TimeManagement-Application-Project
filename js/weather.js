const API_KEY = "82d373f4e1729f502c9195d53079e948";

function onGeoOk(posion) {
  const lat = posion.coords.latitude;
  const lon = posion.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(url);
}
function onGeoError() {
  alert("Can't find you! No weather for you.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
