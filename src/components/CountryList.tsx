import React from 'react';
import { MapPin, X } from 'lucide-react';
import { getCountryInfo } from '../utils/countryUtils';

interface CountryListProps {
  visitedCountries: Set<string>;
  onCountryClick: (countryName: string) => void;
}

const CountryList: React.FC<CountryListProps> = ({ visitedCountries, onCountryClick }) => {
  return (
    <div className="w-full lg:w-96">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800 ml-2">
            Países Visitados ({visitedCountries.size})
          </h2>
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {Array.from(visitedCountries).sort().map((country) => {
            const countryInfo = getCountryInfo(country);
            return (
              <div
                key={country}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors"
              >
                <div className="flex items-center gap-3">
                  {countryInfo.code && (
                    <img
                      src={`https://flagcdn.com/w40/${countryInfo.code.toLowerCase()}.png`}
                      alt={`${country} flag`}
                      className="w-6 h-4 object-cover rounded-sm shadow-sm"
                      loading="lazy"
                    />
                  )}
                  <span className="text-gray-700">{country}</span>
                </div>
                <button
                  onClick={() => onCountryClick(country)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar país"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {visitedCountries.size === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Haz clic en los países del mapa para marcarlos como visitados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryList;