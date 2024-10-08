import React, { useState, useRef, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

const API_KEY = process.env.REACT_APP_API_KEY;

const CitySearch = ({ onCitySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (term.length > 2) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${term}&limit=5&appid=${API_KEY}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch cities");
          }
          const data = await response.json();
          setCities(data);
          setIsOpen(true);
        } catch (err) {
          setError("Failed to fetch cities. Please try again.");
          setCities([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCities([]);
        setIsOpen(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleCitySelect = (city) => {
    onCitySelect(city.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex">
        <input
          type="text"
          placeholder="Search for a city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {isLoading && <p className="mt-2 text-gray-600">Loading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {isOpen && cities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {cities.map((city) => (
            <div
              key={`${city.lat}-${city.lon}`}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.state && `${city.state}, `}
              {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
