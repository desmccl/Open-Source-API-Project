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
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
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
    if (data.hourly && data.hourly.temperature_2m) {
        const temperaturesCelsius = data.hourly.temperature_2m;
        const temperaturesFahrenheit = temperaturesCelsius.map(tempCelsius => {
            return (tempCelsius * 9/5) + 32; // Convert Celsius to Fahrenheit
        });
        
        let html = '<h3>Hourly Temperatures:</h3><ul id="temps">';
        temperaturesFahrenheit.forEach((tempFahrenheit, index) => {
            html += `<li>Hour ${index}: ${tempFahrenheit.toFixed(2)}°F</li>`; // Display temperature with two decimal places
        });
        html += '</ul>';
        weatherResults.innerHTML = html;
    } else {
        weatherResults.innerHTML = 'Weather data not available.';
    }
}





