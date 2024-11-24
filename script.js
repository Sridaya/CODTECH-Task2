const apiKey = "e97fe8d4c807ebc69523b0d482470ce7";
const apiUrl = "https://api.openweathermap.org/data/2.5/";

// DOM Elements
const searchButton = document.getElementById("search-button");
const searchCity = document.getElementById("search-city");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("forecast-container");

// Fetch Weather Data
async function fetchWeather(city) {
    try {
        const isPincode = /^\d+$/.test(city); // Check if input is numeric (pincode)
        const query = isPincode ? `zip=${city},IN` : `q=${city}`;
        
        const response = await fetch(`${apiUrl}weather?${query}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayCurrentWeather(data);
        fetchForecast(city);  // Fetch forecast data after current weather
    } catch (error) {
        alert(error.message);
    }
}

// Display Current Weather
function displayCurrentWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    condition.textContent = `Condition: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    weatherIcon.src = 'OIP.jpeg'; // Ensure this path is correct
}

// Fetch Forecast Data
async function fetchForecast(city) {
    try {
        const response = await fetch(`${apiUrl}forecast?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert(error.message);
    }
}

// Display Forecast with Conditional Images
function displayForecast(data) {
    forecastContainer.innerHTML = "";
    data.list.slice(0, 5).forEach(item => {
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        // Get temperature and weather description
        const temperature = item.main.temp;
        const description = item.weather[0].description.toLowerCase();

        // Set image based on conditions
        let weatherImage = "";
        if (description.includes("rain") || description.includes("drizzle")) {
            weatherImage = "rainy.jpeg"; // Replace with your rainy image file
        } else if (description.includes("snow") || description.includes("winter")) {
            weatherImage = "winter.jpeg"; // Replace with your winter image file
        } else if (description.includes("clear") || temperature > 25) {
            weatherImage = "sunny.jpeg"; // Replace with your sunny image file
        } else {
            weatherImage = "cloudy.jpeg"; // Default image for cloudy or other conditions
        }

        forecastCard.innerHTML = `
            <p>${new Date(item.dt_txt).toLocaleString()}</p>
            <p>${temperature}°C</p>
            <p>${description}</p>
            <img src="${weatherImage}" alt="Weather Icon"> <!-- Dynamic image -->
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

// Event Listeners
searchButton.addEventListener("click", () => {
    const location = searchCity.value.trim(); // Input can now be city or pincode
    if (location) {
        fetchWeather(location);
    } else {
        alert("Please enter a valid city name or pincode.");
    }
});
