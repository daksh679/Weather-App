import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import CitySearch from "./components/CitySearch";
import debounce from "lodash.debounce";

const WeatherDisplay = lazy(() => import("./components/WeatherDisplay"));
const ForecastDisplay = lazy(() => import("./components/ForecastDisplay"));

const API_KEY = process.env.REACT_APP_API_KEY;
const DEFAULT_CITY = "Delhi";
const CACHE_KEY = "weatherAppCache";

const App = () => {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeatherData = useCallback(
    debounce(async (cityName) => {
      setIsLoading(true);
      setError(null);
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.ok || !forecastResponse.ok) {
          throw new Error("City not found");
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        setWeatherData(weatherData);
        setForecastData(forecastData);
        setLastUpdated(new Date().toISOString());

        // Cache the data
        const cacheData = {
          city: cityName,
          weatherData,
          forecastData,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cachedData) {
      setCity(cachedData.city);
      setWeatherData(cachedData.weatherData);
      setForecastData(cachedData.forecastData);
      setLastUpdated(cachedData.lastUpdated);
      setIsLoading(false);
    }
    fetchWeatherData(cachedData ? cachedData.city : city);
  }, []);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city, fetchWeatherData]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "celsius" ? "fahrenheit" : "celsius"));
  };

  const handleRefresh = () => {
    fetchWeatherData(city);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6">Weather Forecast</h1>
        <CitySearch onCitySelect={setCity} />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={toggleUnit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Toggle °C/°F
          </button>
          <button
            onClick={handleRefresh}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Refresh
          </button>
        </div>
        {isLoading && <p className="mt-4">Loading...</p>}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {weatherData && (
          <Suspense fallback={<div>Loading weather data...</div>}>
            <WeatherDisplay data={weatherData} unit={unit} />
          </Suspense>
        )}
        {lastUpdated && (
          <p className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
      {forecastData && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
          <Suspense fallback={<div>Loading forecast data...</div>}>
            <ForecastDisplay data={forecastData} unit={unit} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default App;
