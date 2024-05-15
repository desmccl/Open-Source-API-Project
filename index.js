document.getElementById('weatherForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    const location = document.getElementById('locationInput').value;
    if (location.trim() === "") {
        document.getElementById('weatherResults').innerHTML = "Please enter a location.";
        return;
    }
    getWeather(location);
});

async function getWeather(location) {
    const weatherResults = document.getElementById('weatherResults');
    weatherResults.innerHTML = 'Loading...';

    try {
        // Use Open-Meteo Geocoding API to convert the location to coordinates
        const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.results && geocodeData.results.length > 0) {
            const { latitude, longitude } = geocodeData.results[0];
            console.log('Coordinates:', latitude, longitude);

            // Fetch weather data using the coordinates
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode`);
            const weatherData = await weatherResponse.json();
            console.log('Weather Data:', weatherData);

            displayWeather(weatherData);
        } else {
            weatherResults.innerHTML = 'Location not found or no results available.';
        }
    } catch (error) {
        weatherResults.innerHTML = 'Error fetching weather data.';
        console.error('Error:', error);
    }
}

function displayWeather(data) {
    const weatherResults = document.getElementById('weatherResults');
    if (data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_min && data.daily.weathercode) {
        const tempMaxCelsius = data.daily.temperature_2m_max[0];
        const tempMinCelsius = data.daily.temperature_2m_min[0];
        const weatherCode = data.daily.weathercode[0];

        const tempMaxFahrenheit = (tempMaxCelsius * 9/5) + 32;
        const tempMinFahrenheit = (tempMinCelsius * 9/5) + 32;

        const weatherConditions = {
            0: 'Clear sky',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            51: 'Drizzle',
            61: 'Rain',
            66: 'Freezing Rain',
            71: 'Snow fall',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
        };

        const weatherDescription = weatherConditions[weatherCode] || 'Unknown weather condition';
        const weatherIconUrl = `images/${weatherCode}.png`;

        let html = `<h3>Today's Weather:</h3>
                    <img id="image" src="${weatherIconUrl}" alt="${weatherDescription}" />
                    <p>Max Temperature: ${tempMaxFahrenheit.toFixed(2)}°F</p>
                    <p>Min Temperature: ${tempMinFahrenheit.toFixed(2)}°F</p>
                    <p>Conditions: ${weatherDescription}</p>`;
        weatherResults.innerHTML = html;
    } else {
        weatherResults.innerHTML = 'Weather data not available.';
    }
}
