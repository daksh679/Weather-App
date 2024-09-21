import React from "react";

const WeatherDisplay = ({ data, unit }) => {
  const { name, main, weather } = data;

  const convertTemp = (temp) => {
    if (unit === "fahrenheit") {
      return ((temp * 9) / 5 + 32).toFixed(1);
    }
    return temp.toFixed(1);
  };

  return (
    <div className="text-center mt-6">
      <h2 className="text-2xl font-semibold mb-4">{name}</h2>
      <div className="flex justify-center items-center">
        <div>
          <p className="text-6xl font-bold">
            {convertTemp(main.temp)}°{unit === "celsius" ? "C" : "F"}
          </p>
          <p className="text-xl mt-2">{weather[0].main}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt={weather[0].description}
          className="w-24 h-24 ml-4"
        />
      </div>
    </div>
  );
};

export default WeatherDisplay;
