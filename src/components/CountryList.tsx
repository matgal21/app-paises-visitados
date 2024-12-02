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
      <div className="bg-gradient-to-b from-gray-700 to-black rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-100 ml-2">
            Países Visitados ({visitedCountries.size})
            
          </h2>
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 hover:text-gray-900">
          {Array.from(visitedCountries).sort().map((country) => {
            const countryInfo = getCountryInfo(country);
            return (
              <div
                key={country}
                className="flex items-center justify-between p-3 hover:bg-green-800 hover:text-gray-900 rounded-lg group transition-colors border-t hover:scale-110 ml-2"
              >
                <div className="flex items-center gap-3">
                  {countryInfo.code && (
                    <img
                      src={`https://flagcdn.com/w40/${countryInfo.code.toLowerCase()}.png`}
                      alt={`${country} flag`}
                      className="w-8 h-6 object-cover rounded-sm shadow-sm hover:scale-110"
                      loading="lazy"
                    />
                  )}
                  <span className="text-gray-100">{country}</span>
                </div>
                <button
                  onClick={() => onCountryClick(country)}
                  className="text-gray-400  p-1.5 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar país"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {visitedCountries.size === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 hover:text-gray-900 mx-auto mb-3" />
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