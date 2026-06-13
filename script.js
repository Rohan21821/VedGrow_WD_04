const apiKey = "1259aeccb7776f470bc3aad7e76815ea";

const cityInput =
document.getElementById("cityInput");

const searchBtn =
document.getElementById("searchBtn");

const cityName =
document.getElementById("cityName");

const temperature =
document.getElementById("temperature");

const feelsLike =
document.getElementById("feelsLike");

const description =
document.getElementById("description");

const favoriteBtn =
document.getElementById("favoriteBtn");

const humidity =
document.getElementById("humidity");

const wind =
document.getElementById("wind");

const pressure =
document.getElementById("pressure");

const uvIndex =
document.getElementById("uvIndex");

const aqi =
document.getElementById("aqi");

const visibility =
document.getElementById("visibility");

const countryFlag =
document.getElementById("countryFlag");

const loader =
document.getElementById("loader");

const sunrise =
document.getElementById("sunrise");

const sunset =
document.getElementById("sunset");

const weatherIcon =
document.getElementById("weatherIcon");

const forecastContainer =
document.getElementById("forecastContainer");

const favoritesList =
document.getElementById("favoritesList");

const suggestions =
document.getElementById("suggestions");

const errorBox =
document.getElementById("errorBox");

const locationBtn =
document.getElementById("locationBtn");

let currentUnit = "metric";
let currentCity = "";

function updateUnitButtons(){

document
.getElementById("celsiusBtn")
.classList.remove("active");

document
.getElementById("fahrenheitBtn")
.classList.remove("active");

if(currentUnit === "metric"){

document
.getElementById("celsiusBtn")
.classList.add("active");

}else{

document
.getElementById("fahrenheitBtn")
.classList.add("active");

}

}

async function getWeather(city){

try{

loader.style.display = "block";
const response =
await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`
);

const data =
await response.json();
saveRecent(city);

if(data.cod !== 200){

errorBox.style.display="block";

errorBox.textContent=
"City not found";
return;
}
currentCity = city;
displayWeather(data);
getForecast(city);

}
catch(error){

console.error(error);

alert("Unable to fetch weather data");

loader.style.display = "none";

}
errorBox.style.display="none";
loader.style.display = "none";
cityInput.value = "";
loadRecent();
}

function updateDateTime(){

const now = new Date();

document.getElementById("dateTime").textContent =
now.toLocaleString();

}


function displayWeather(data){

cityName.textContent =
`${data.name}, ${data.sys.country}`;

const unitSymbol =
currentUnit === "metric"
? "°C"
: "°F";

temperature.textContent =
`${Math.round(data.main.temp)} ${unitSymbol}`;

description.textContent =
data.weather[0].description;

humidity.textContent =
`${data.main.humidity}%`;

wind.textContent =
currentUnit === "metric"
? `${data.wind.speed} m/s`
: `${data.wind.speed} mph`;

weatherIcon.src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

getUVIndex(
data.coord.lat,
data.coord.lon
);

getAQI(
data.coord.lat,
data.coord.lon
);

const weatherMain =
data.weather[0].main;

if(weatherMain === "Clear"){

document.body.style.background =
"linear-gradient(135deg,#0ea5e9,#38bdf8)";

}

else if(weatherMain === "Clouds"){

document.body.style.background =
"linear-gradient(135deg,#475569,#64748b)";

}

else if(weatherMain === "Rain"){

document.body.style.background =
"linear-gradient(135deg,#1e293b,#334155)";

}

else if(weatherMain === "Snow"){

document.body.style.background =
"linear-gradient(135deg,#cbd5e1,#e2e8f0)";

document.body.style.color =
"white";

}

sunrise.textContent =
new Date(
data.sys.sunrise * 1000
).toLocaleTimeString();

sunset.textContent =
new Date(
data.sys.sunset * 1000
).toLocaleTimeString();

feelsLike.textContent =
`${Math.round(data.main.feels_like)}°`;

pressure.textContent =
`${data.main.pressure} hPa`;

visibility.textContent =
`${data.visibility / 1000} km`;

countryFlag.src =
`https://flagsapi.com/${data.sys.country}/flat/64.png`;

}

function saveFavorite(city){

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

if(!favorites.includes(city)){

favorites.push(city);

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

loadFavorites();

}
}

function removeFavorite(city){

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

favorites =
favorites.filter(item =>
item !== city
);

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

loadFavorites();

}

function loadFavorites(){

const favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

favoritesList.innerHTML = "";

favorites.forEach(city => {

const cityBtn =
document.createElement("div");

cityBtn.classList.add(
"favorite-city"
);

cityBtn.innerHTML =
`
${city}
<span class="removeFav">
❌
</span>
`;

cityBtn
.querySelector(".removeFav")
.addEventListener("click",(e)=>{

e.stopPropagation();

removeFavorite(city);

});

cityBtn.addEventListener(
"click",
() => getWeather(city)
);

favoritesList.appendChild(cityBtn);

});

}
favoriteBtn.addEventListener("click", () => {

if(currentCity){

saveFavorite(currentCity);

}

});

searchBtn.addEventListener("click", () => {

const city =
cityInput.value.trim();

if(city){

getWeather(city);

}

});

cityInput.addEventListener("keypress", (e) => {

if(e.key === "Enter"){

searchBtn.click();

}

});

async function getUVIndex(lat, lon){

try{

const response =
await fetch(
`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`
);

const data =
await response.json();

uvIndex.textContent =
data.current.uvi;

}
catch(error){

uvIndex.textContent = "N/A";

console.error(error);

}
}

async function getAQI(lat,lon){

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
);

const data =
await response.json();

const value =
data.list[0].main.aqi;

let quality = "";

switch(value){

case 1:
quality = "Good";
break;

case 2:
quality = "Fair";
break;

case 3:
quality = "Moderate";
break;

case 4:
quality = "Poor";
break;

case 5:
quality = "Very Poor";
break;

}

aqi.textContent =
quality;

}
catch(error){

aqi.textContent =
"N/A";

}
}


async function getForecast(city){

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`
);

const data =
await response.json();

displayForecast(data.list);

}
catch(error){

console.error(error);

}
}

function displayForecast(list){

forecastContainer.innerHTML = "";

const dailyForecast =
list.filter(item =>
item.dt_txt.includes("12:00:00")
);

dailyForecast.forEach(day => {

const card =
document.createElement("div");

card.classList.add("forecast-card");

card.innerHTML = `
<h3>
${new Date(day.dt_txt)
.toLocaleDateString()}
</h3>

<img src=
"https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

<p>
${Math.round(day.main.temp)}
${currentUnit === "metric" ? "°C" : "°F"}
</p>

<p>
${day.weather[0].description}
</p>
`;

forecastContainer.appendChild(card);

});
}

document
.getElementById("celsiusBtn")
.addEventListener("click", () => {

currentUnit = "metric";

updateUnitButtons();

if(currentCity){

getWeather(currentCity);

}

});

document
.getElementById("fahrenheitBtn")
.addEventListener("click", () => {

currentUnit = "imperial";

updateUnitButtons();

if(currentCity){

getWeather(currentCity);

}

});

loadFavorites();
updateUnitButtons();

const cities = [

"Mumbai",
"Pune",
"Delhi",
"Bangalore",
"Hyderabad",
"Chennai",
"Kolkata",
"Nagpur",
"Nashik",
"London",
"Paris",
"Tokyo",
"Dubai",
"Sydney",
"New York",
"California",
"Nashik",
"Jakarta",
"Ahilyanagar"

];

function saveRecent(city){

let recent =
JSON.parse(
localStorage.getItem("recent")
) || [];

recent =
recent.filter(item =>
item !== city
);

recent.unshift(city);

recent = recent.slice(0,5);

localStorage.setItem(
"recent",
JSON.stringify(recent)
);

loadRecent();

}

function loadRecent(){

const recent =
JSON.parse(
localStorage.getItem("recent")
) || [];

const container =
document.getElementById(
"recentSearches"
);

container.innerHTML="";

recent.forEach(city=>{

const btn =
document.createElement("div");

btn.classList.add(
"favorite-city"
);

btn.textContent=city;

btn.onclick=
()=>getWeather(city);

container.appendChild(btn);

});

}


cityInput.addEventListener("input", () => {

const value =
cityInput.value.toLowerCase();

suggestions.innerHTML = "";

if(!value) return;

const matches =
cities.filter(city =>
city.toLowerCase().includes(value)
);

matches.forEach(city => {

const div =
document.createElement("div");

div.classList.add(
"suggestion-item"
);

div.textContent = city;

div.addEventListener("click", () => {

cityInput.value = city;
suggestions.innerHTML = "";
getWeather(city);

suggestions.innerHTML = "";

});

suggestions.appendChild(div);

});

});

locationBtn.addEventListener(
"click",
() => {

navigator.geolocation.getCurrentPosition(
async position => {

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`
);

const data =
await response.json();

currentCity = data.name;

displayWeather(data);

getForecast(data.name);

}
);

}
);

const themeBtn =
document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

document.body.classList.toggle(
"light-theme"
);

if(document.body.classList.contains("light-theme")){

themeBtn.textContent =
"🌙 Dark Mode";

}else{

themeBtn.textContent =
"☀ Light Mode";

}

});


setInterval(updateDateTime,1000);
updateDateTime();

