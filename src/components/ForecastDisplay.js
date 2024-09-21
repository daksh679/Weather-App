import React from "react";

const ForecastDisplay = ({ data, unit }) => {
  const convertTemp = (temp) => {
    if (unit === "fahrenheit") {
      return ((temp * 9) / 5 + 32).toFixed(1);
    }
    return temp.toFixed(1);
  };

  const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  };

  const dailyForecasts = data.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {dailyForecasts.map((forecast) => (
        <div key={forecast.dt} className="text-center">
          <h3 className="font-semibold">{getDayOfWeek(forecast.dt_txt)}</h3>
          <img
            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
            alt={forecast.weather[0].description}
            className="w-16 h-16 mx-auto"
          />
          <p className="text-sm">
            {convertTemp(forecast.main.temp_max)}°
            {unit === "celsius" ? "C" : "F"} /{" "}
            {convertTemp(forecast.main.temp_min)}°
            {unit === "celsius" ? "C" : "F"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ForecastDisplay;
