document.getElementById('get-weather-btn').addEventListener('click', function() {
    const city = document.getElementById('search-box').value;
    const apiKey = '509a0077ffdd3636186efea500d91879';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            fetchForecast(city);
            displayMap(data);
        })
        .catch(error => console.error('Error:', error));
});

function displayCurrentWeather(data) {
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°F`;
    document.getElementById('weather-description').textContent = `Weather Conditions: ${data.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} mph`;
    document.getElementById('weather-display').style.display = 'block';
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('#forecast .forecast-cards');
    forecastContainer.innerHTML = ''; // Clear existing content

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const temp = forecast.main.temp;
            const description = forecast.weather[0].description;

            const card = document.createElement('div');
            card.classList.add('forecast-card');
            card.innerHTML = `
                <h3>${date}</h3>
                <p>Temp: ${temp}°F</p>
                <p>Conditions: ${description}</p>
            `;

            forecastContainer.appendChild(card);
        }
    });
}

function fetchForecast(city) {
    const apiKey = '509a0077ffdd3636186efea500d91879';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(displayForecast)
        .catch(error => console.error('Error:', error));
}

function displayMap(data) {
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const map = L.map('weather-map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const apiKey = '509a0077ffdd3636186efea500d91879'
    const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        maxZoom: 19,
        attribution: '© OpenWeatherMap'
    }).addTo(map);
}
