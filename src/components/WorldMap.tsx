import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Loader2, AlertCircle } from 'lucide-react';

// Using a more stable and reliable GeoJSON source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  visitedCountries: Set<string>;
  onCountryClick: (countryName: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ visitedCountries, onCountryClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapData, setMapData] = useState<any>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(geoUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMapData(data);
      } catch (err) {
        setError('Error loading map data. Please try refreshing the page.');
        console.error('Error loading map data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 relative min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error || !mapData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 relative min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="mt-2 text-gray-800">{error || 'Error loading map data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 relative min-h-[400px]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          center: [0, 30]
        }}
        style={{
          width: "100%",
          height: "400px"
        }}
      >
        <ZoomableGroup>
          <Geographies geography={mapData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const isVisited = visitedCountries.has(countryName);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tooltip-id="country-tooltip"
                    data-tooltip-content={countryName}
                    onClick={() => onCountryClick(countryName)}
                    style={{
                      default: {
                        fill: isVisited ? '#4F46E5' : '#D1D5DB',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: isVisited ? '#4338CA' : '#9CA3AF',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#312E81',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;