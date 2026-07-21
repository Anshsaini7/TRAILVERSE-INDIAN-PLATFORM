'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { treks, trekkingCompanies, adventureActivities, Trek } from '../data/mockData';
import { MapPin, Info, Navigation, Compass, Layers, ShieldCheck, HelpCircle, Sun, Cloud, CloudSun, CloudDrizzle, CloudRain, Snowflake, CloudLightning, Droplets, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATE_DISTRICTS } from '../data/indianLocations';
import { useWeather } from '../context/WeatherContext';

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getWeatherDescription(code: number) {
  if (code === 0) return { label: 'Sunny', icon: 'Sun' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 45 || code === 48) return { label: 'Foggy', icon: 'Cloud' };
  if (code >= 51 && code <= 55) return { label: 'Light Drizzle', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { label: 'Rainy', icon: 'CloudRain' };
  if (code >= 71 && code <= 77) return { label: 'Snowy', icon: 'Snowflake' };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: 'CloudRain' };
  if (code === 85 || code === 86) return { label: 'Snow Showers', icon: 'Snowflake' };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: 'CloudLightning' };
  return { label: 'Overcast', icon: 'Cloud' };
}

const GoogleWeatherIcon = ({ name, className = "w-8 h-8" }: { name: string; className?: string }) => {
  switch (name) {
    case 'Sun':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffb00" />
              <stop offset="30%" stopColor="#ffb700" />
              <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sunBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="100%" stopColor="#ff5d00" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#sunGlow)" opacity="0.6" />
          <circle cx="50" cy="50" r="28" fill="url(#sunBody)" />
        </svg>
      );
    case 'CloudSun':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="sunBodyMini" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="100%" stopColor="#ff5d00" />
            </linearGradient>
            <linearGradient id="cloudBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d2d9e5" />
            </linearGradient>
            <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="60" cy="38" r="20" fill="url(#sunBodyMini)" />
          <path
            d="M25 65 c-5 0 -9 -4 -9 -9 c0 -4 3.5 -8.5 8 -9 c1 -5 5 -12 12 -12 c6 0 10 4 12 8 c3 -1.5 6 -2 9 -2 c8 0 14 6 14 14 c0 8 -6 10 -14 10 z"
            fill="url(#cloudBody)"
            filter="url(#cloudShadow)"
          />
        </svg>
      );
    case 'Cloud':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="cloudBodyOnly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>
          <path
            d="M20 62 c-5 0 -9 -4 -9 -9 c0 -4 3.5 -8.5 8 -9 c1 -6 5.5 -13 13 -13 c7 0 11.5 5 13 9 c3 -1.5 7 -2 10 -2 c9 0 16 7 16 16 c0 9 -7 9 -16 9 z"
            fill="url(#cloudBodyOnly)"
            filter="url(#cloudShadow)"
          />
        </svg>
      );
    case 'CloudDrizzle':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="cloudBodyDrizzle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          <path
            d="M20 58 c-5 0 -9 -4 -9 -9 c0 -4 3.5 -8.5 8 -9 c1 -6 5.5 -13 13 -13 c7 0 11.5 5 13 9 c3 -1.5 7 -2 10 -2 c9 0 16 7 16 16 c0 9 -7 9 -16 9 z"
            fill="url(#cloudBodyDrizzle)"
          />
          <line x1="32" y1="65" x2="28" y2="78" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="65" x2="46" y2="78" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="68" y1="65" x2="64" y2="78" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'CloudRain':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="cloudBodyRain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <path
            d="M20 58 c-5 0 -9 -4 -9 -9 c0 -4 3.5 -8.5 8 -9 c1 -6 5.5 -13 13 -13 c7 0 11.5 5 13 9 c3 -1.5 7 -2 10 -2 c9 0 16 7 16 16 c0 9 -7 9 -16 9 z"
            fill="url(#cloudBodyRain)"
          />
          <line x1="28" y1="65" x2="23" y2="82" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="44" y1="65" x2="39" y2="82" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="65" x2="55" y2="82" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="76" y1="65" x2="71" y2="82" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'Snowflake':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="8" fill="#e0f2fe" />
          <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="28" r="4" fill="#38bdf8" />
          <circle cx="50" cy="72" r="4" fill="#38bdf8" />
          <circle cx="28" cy="50" r="4" fill="#38bdf8" />
          <circle cx="72" cy="50" r="4" fill="#38bdf8" />
        </svg>
      );
    case 'CloudLightning':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="cloudBodyLightning" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <path
            d="M20 58 c-5 0 -9 -4 -9 -9 c0 -4 3.5 -8.5 8 -9 c1 -6 5.5 -13 13 -13 c7 0 11.5 5 13 9 c3 -1.5 7 -2 10 -2 c9 0 16 7 16 16 c0 9 -7 9 -16 9 z"
            fill="url(#cloudBodyLightning)"
          />
          <path d="M46 58 L32 78 L46 78 L40 95 L62 70 L48 70 Z" fill="#eab308" stroke="#ffe000" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="cloudDefault" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          <path
            d="M20 58 c-5 0 -9 -4 -9 -9 c0 -4 3.5 -8.5 8 -9 c1 -6 5.5 -13 13 -13 c7 0 11.5 5 13 9 c3 -1.5 7 -2 10 -2 c9 0 16 7 16 16 c0 9 -7 9 -16 9 z"
            fill="url(#cloudDefault)"
          />
        </svg>
      );
  }
};

interface TransitConfig {
  label: string;
  icon: string;
  multiplier: number;
  speed: number; // in km/h
  color: string;
  dashArray?: string;
}

export const TRANSIT_MODES: Record<string, TransitConfig> = {
  plane: { label: '✈️ Flight', icon: '✈️', multiplier: 1.0, speed: 750, color: '#3b82f6', dashArray: '8, 6' },
  car: { label: '🚗 Car', icon: '🚗', multiplier: 1.35, speed: 70, color: '#f59e0b' },
  bus: { label: '🚌 Bus', icon: '🚌', multiplier: 1.38, speed: 50, color: '#10b981' },
  train: { label: '🚆 Train', icon: '🚆', multiplier: 1.42, speed: 65, color: '#ec4899' },
  bike: { label: '🏍️ Bike', icon: '🏍️', multiplier: 1.32, speed: 45, color: '#8b5cf6' },
  walking: { label: '🥾 Walking', icon: '🥾', multiplier: 1.18, speed: 5, color: '#ef4444', dashArray: '4, 4' }
};


function generateWindingRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  transitMode: string
): [number, number][] {
  if (transitMode === 'plane') {
    return [
      [startLat, startLon],
      [endLat, endLon]
    ];
  }

  const points: [number, number][] = [];
  const segments = 30; // Detailed winding turns
  
  const dLat = endLat - startLat;
  const dLon = endLon - startLon;
  const distanceDeg = Math.sqrt(dLat * dLat + dLon * dLon);

  const length = distanceDeg || 1;
  const perpLat = -dLon / length;
  const perpLon = dLat / length;

  let waveFactor = 0.08;
  let frequency = 6;
  
  if (transitMode === 'walking') {
    waveFactor = 0.12;
    frequency = 12;
  } else if (transitMode === 'train') {
    waveFactor = 0.04;
    frequency = 3;
  } else {
    waveFactor = 0.08;
    frequency = 8;
  }

  const amplitude = distanceDeg * waveFactor;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    if (i === 0) {
      points.push([startLat, startLon]);
    } else if (i === segments) {
      points.push([endLat, endLon]);
    } else {
      const envelope = Math.sin(t * Math.PI);
      const wave = (
        Math.sin(t * Math.PI * frequency) * 0.65 +
        Math.cos(t * Math.PI * (frequency * 1.8)) * 0.25 +
        Math.sin(t * Math.PI * (frequency * 2.8)) * 0.1
      ) * envelope;

      const lat = startLat + t * dLat + perpLat * wave * amplitude;
      const lon = startLon + t * dLon + perpLon * wave * amplitude;
      points.push([lat, lon]);
    }
  }

  return points;
}

export default function IndiaMap() {
  const { userLocation } = useWeather();
  const [activeTab, setActiveTab] = useState<'treks' | 'camps' | 'operators' | 'sports'>('treks');
  const [selectedItem, setSelectedItem] = useState<any>(treks[0]); // Default selected item
  const [selectedState, setSelectedState] = useState<string>('Delhi');
  const [selectedCityName, setSelectedCityName] = useState<string>('New Delhi (Capital)');
  const [transitMode, setTransitMode] = useState<'plane' | 'bus' | 'train' | 'car' | 'bike' | 'walking'>('plane');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [userClicked, setUserClicked] = useState<boolean>(false);
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [trekViewMode, setTrekViewMode] = useState<'flat' | 'state'>('flat');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [mapType, setMapType] = useState<'hybrid' | 'roadmap' | 'terrain'>('hybrid');

  // Auto-detect and use current location if available from context on initial load
  useEffect(() => {
    if (userLocation && userLocation.city && userLocation.state && !userClicked) {
      setSelectedState('Detected Location');
      setSelectedCityName(userLocation.city);
      setCurrentLocation({
        name: userLocation.city,
        lat: userLocation.lat,
        lon: userLocation.lon
      });
    }
  }, [userLocation, userClicked]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerGroupRef = useRef<L.FeatureGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const midpointMarkerRef = useRef<L.Marker | null>(null);

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    feelsLike: number;
    windSpeed: number;
    humidity: number;
    conditionCode: number;
    conditionText: string;
    icon: string;
    high: number;
    low: number;
    daily: {
      day: string;
      tempMax: number;
      tempMin: number;
      conditionText: string;
      icon: string;
      humidity: number;
      windSpeed: number;
      hourly: {
        time: string;
        temp: number;
        precipProb: number;
      }[];
    }[];
    hourly: {
      time: string;
      temp: number;
      precipProb: number;
    }[];
  } | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    if (!selectedMarker) {
      setWeatherData(null);
      return;
    }

    let isMounted = true;
    setIsLoadingWeather(true);
    setSelectedDayIndex(0); // Reset selected day to Today whenever location changes
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedMarker.lat}&longitude=${selectedMarker.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data && data.current) {
          const code = data.current.weather_code;
          const condition = getWeatherDescription(code);
          
          const dailyForecasts = [];
          if (data.daily && data.daily.time && data.hourly && data.hourly.time) {
            const currentHour = new Date().getHours();
            for (let i = 0; i < 6; i++) {
              if (i < data.daily.time.length) {
                const timeStr = data.daily.time[i];
                const date = new Date(timeStr);
                const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + date.getDate();
                const dCode = data.daily.weather_code[i];
                const dCondition = getWeatherDescription(dCode);
                
                // Construct hourly segments for this specific day
                const dayHourly = [];
                const startHourIdx = i === 0 ? currentHour : (i * 24 + 8);
                
                for (let h = 0; h < 8; h++) {
                  const idx = startHourIdx + h * 3;
                  if (idx < data.hourly.time.length) {
                    const timeVal = data.hourly.time[idx];
                    const hDate = new Date(timeVal);
                    const hTimeStr = hDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                    dayHourly.push({
                      time: hTimeStr,
                      temp: Math.round(data.hourly.temperature_2m[idx]),
                      precipProb: Math.round(data.hourly.precipitation_probability[idx] || 0)
                    });
                  } else {
                    dayHourly.push({
                      time: `${(8 + h * 3) % 12 || 12} ${(8 + h * 3) >= 12 && (8 + h * 3) < 24 ? 'PM' : 'AM'}`,
                      temp: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2),
                      precipProb: 0
                    });
                  }
                }

                // Deterministic humidity & wind variations for subsequent days
                const dayHumidity = i === 0 
                  ? Math.round(data.current.relative_humidity_2m)
                  : Math.max(0, Math.min(100, Math.round(data.current.relative_humidity_2m + (Math.sin(i) * 15))));
                
                const dayWind = i === 0
                  ? Math.round(data.current.wind_speed_10m)
                  : Math.max(0, Math.round(data.current.wind_speed_10m + (Math.cos(i) * 5)));

                dailyForecasts.push({
                  day: dayName,
                  tempMax: Math.round(data.daily.temperature_2m_max[i]),
                  tempMin: Math.round(data.daily.temperature_2m_min[i]),
                  conditionText: dCondition.label,
                  icon: dCondition.icon,
                  humidity: dayHumidity,
                  windSpeed: dayWind,
                  hourly: dayHourly
                });
              }
            }
          }

          // Fallback if hourly is missing but current is present
          const currentHourly = [];
          if (dailyForecasts[0] && dailyForecasts[0].hourly.length > 0) {
            currentHourly.push(...dailyForecasts[0].hourly.map(h => ({
              time: h.time,
              temp: h.temp,
              precipProb: h.precipProb
            })));
          } else {
            const currentHourStr = new Date().getHours();
            for (let h = 0; h < 8; h++) {
              currentHourly.push({
                time: `${(currentHourStr + h * 3) % 12 || 12} ${(currentHourStr + h * 3) >= 12 && (currentHourStr + h * 3) < 24 ? 'PM' : 'AM'}`,
                temp: Math.round(data.current.temperature_2m),
                precipProb: 0
              });
            }
          }

          setWeatherData({
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            windSpeed: Math.round(data.current.wind_speed_10m),
            humidity: Math.round(data.current.relative_humidity_2m),
            conditionCode: code,
            conditionText: condition.label,
            icon: condition.icon,
            high: data.daily ? Math.round(data.daily.temperature_2m_max[0]) : Math.round(data.current.temperature_2m) + 3,
            low: data.daily ? Math.round(data.daily.temperature_2m_min[0]) : Math.round(data.current.temperature_2m) - 4,
            daily: dailyForecasts,
            hourly: currentHourly
          });
        }
        setIsLoadingWeather(false);
      })
      .catch(err => {
        console.warn("Failed to fetch live weather:", err);
        if (isMounted) {
          setIsLoadingWeather(false);
          
          const baseTemp = selectedItem?.weatherForecast?.[0] ? parseInt(selectedItem.weatherForecast[0].temp) : 15;
          const mockDaily = [];
          const daysOfWeek = ['Today', 'Fri 12', 'Sat 13', 'Sun 14', 'Mon 15', 'Tue 16'];
          const mockIcons = ['CloudSun', 'CloudSun', 'Sun', 'Sun', 'CloudSun', 'CloudRain'];
          const mockConditions = ['Partly Cloudy', 'Partly Cloudy', 'Sunny', 'Sunny', 'Partly Cloudy', 'Rainy'];
          const mockTempsMax = [baseTemp + 2, baseTemp + 1, baseTemp + 3, baseTemp + 4, baseTemp + 2, baseTemp + 1];
          const mockTempsMin = [baseTemp - 4, baseTemp - 5, baseTemp - 3, baseTemp - 2, baseTemp - 4, baseTemp - 6];
          const mockHumidity = [55, 60, 45, 40, 50, 75];
          const mockWind = [12, 14, 8, 10, 11, 18];

          for (let i = 0; i < 6; i++) {
            const dayHourly = [];
            const hours = ['2 PM', '5 PM', '8 PM', '11 PM', '2 AM', '5 AM', '8 AM', '11 AM'];
            const dayMax = mockTempsMax[i];
            const dayMin = mockTempsMin[i];
            const tempWave = [
              dayMax - 1,
              dayMax - 2,
              dayMin + 3,
              dayMin + 2,
              dayMin + 1,
              dayMin,
              dayMin + 2,
              dayMax
            ];
            const precipProbWave = i === 5 
              ? [40, 60, 80, 75, 50, 40, 30, 25]
              : [15, 25, 30, 20, 10, 5, 10, 15];

            for (let h = 0; h < 8; h++) {
              dayHourly.push({
                time: hours[h],
                temp: tempWave[h],
                precipProb: precipProbWave[h]
              });
            }

            mockDaily.push({
              day: daysOfWeek[i],
              tempMax: dayMax,
              tempMin: dayMin,
              conditionText: mockConditions[i],
              icon: mockIcons[i],
              humidity: mockHumidity[i],
              windSpeed: mockWind[i],
              hourly: dayHourly
            });
          }

          setWeatherData({
            temp: baseTemp,
            feelsLike: baseTemp - 2,
            windSpeed: 12,
            humidity: 55,
            conditionCode: 1,
            conditionText: selectedItem?.weatherForecast?.[0]?.condition || 'Clear Sky',
            icon: 'CloudSun',
            high: baseTemp + 2,
            low: baseTemp - 4,
            daily: mockDaily,
            hourly: mockDaily[0].hourly
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMarker, selectedItem]);

  const statesList = useMemo(() => {
    return Object.keys(STATE_DISTRICTS).sort();
  }, []);

  const citiesListForSelectedState = useMemo(() => {
    if (selectedState === 'Detected Location' && currentLocation) {
      return [currentLocation];
    }
    return STATE_DISTRICTS[selectedState] || [];
  }, [selectedState, currentLocation]);

  const selectedStartCity = useMemo(() => {
    if (selectedState === 'Detected Location' && currentLocation) {
      return currentLocation;
    }
    const list = STATE_DISTRICTS[selectedState] || [];
    return list.find(c => c.name === selectedCityName) || list[0] || { name: 'Delhi', lat: 28.613, lon: 77.209 };
  }, [selectedState, selectedCityName, currentLocation]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = {
          name: 'My Current Location',
          lat: latitude,
          lon: longitude
        };
        setCurrentLocation(loc);
        setSelectedState('Detected Location');
        setSelectedCityName('My Current Location');
        setIsDetectingLocation(false);
        setUserClicked(true);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        alert(`Failed to detect location: ${error.message}. Please select a state and city manually.`);
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const sortedAllTreks = useMemo(() => {
    return [...treks].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredFlatTreks = useMemo(() => {
    if (!searchQuery) return sortedAllTreks;
    const q = searchQuery.toLowerCase();
    return sortedAllTreks.filter(t => t.name.toLowerCase().includes(q));
  }, [sortedAllTreks, searchQuery]);

  const groupedTreks = useMemo(() => {
    const groups: Record<string, typeof treks> = {};
    treks.forEach(t => {
      const state = t.state || 'Other';
      if (!groups[state]) groups[state] = [];
      groups[state].push(t);
    });
    return groups;
  }, []);

  const filteredGroupedTreks = useMemo(() => {
    if (!searchQuery) return groupedTreks;
    const q = searchQuery.toLowerCase();
    const groups: Record<string, typeof treks> = {};
    Object.entries(groupedTreks).forEach(([state, list]) => {
      const filtered = list.filter(t => t.name.toLowerCase().includes(q));
      if (filtered.length > 0) {
        groups[state] = filtered;
      }
    });
    return groups;
  }, [groupedTreks, searchQuery]);

  const markers = useMemo(() => {
    switch (activeTab) {
      case 'treks':
        return treks.map(t => ({
          id: t.id,
          name: t.name,
          lat: t.coordinates.lat,
          lon: t.coordinates.lon,
          color: t.difficulty === 'Easy' ? '#10b981' : t.difficulty === 'Medium' ? '#f59e0b' : t.difficulty === 'Hard' ? '#f97316' : '#f43f5e',
          raw: t
        }));
      case 'camps':
        return treks.flatMap(t => 
          t.routeCoordinates.slice(1, -1).map((c, i) => ({
            id: `${t.id}-camp-${i}`,
            name: `${t.name} - Camp ${i + 1}`,
            lat: c.lat,
            lon: c.lon,
            color: '#06b6d4', // cyan base camps
            raw: t
          }))
        );
      case 'operators':
        return trekkingCompanies.map(c => {
          const lat = c.id === 'indiahikes' ? 30.31 : c.id === 'tth' ? 30.08 : c.id === 'bikat' ? 28.61 : 19.38;
          const lon = c.id === 'indiahikes' ? 78.03 : c.id === 'tth' ? 78.26 : c.id === 'bikat' ? 77.20 : 73.78;
          return {
            id: c.id,
            name: c.name,
            lat,
            lon,
            color: '#a855f7', // purple operators
            raw: c
          };
        });
      case 'sports':
        return adventureActivities.flatMap(act => 
          act.bestLocations.map(l => ({
            id: `${act.id}-${l.name}`,
            name: `${act.name} (${l.name})`,
            lat: l.coordinates.lat,
            lon: l.coordinates.lon,
            color: '#3b82f6', // blue sports
            raw: act
          }))
        );
      default: return [];
    }
  }, [activeTab]);

  useEffect(() => {
    if (markers.length > 0) {
      const matched = markers.find(m => m.id === selectedItem?.id);
      if (matched) {
        setTimeout(() => {
          setSelectedMarker(matched);
        }, 0);
      } else if (!selectedMarker || !markers.some(m => m.id === selectedMarker.id)) {
        setTimeout(() => {
          setSelectedMarker(markers[0]);
          setSelectedItem(markers[0].raw);
        }, 0);
      }
    }
  }, [markers, selectedItem, selectedMarker]);

  const routeDistance = useMemo(() => {
    if (!selectedMarker || !selectedStartCity) return 0;
    return getHaversineDistance(
      selectedStartCity.lat,
      selectedStartCity.lon,
      selectedMarker.lat,
      selectedMarker.lon
    );
  }, [selectedMarker, selectedStartCity]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.9734, 78.6569], // Central India
      zoom: 5,
      minZoom: 4,
      zoomControl: false,
    });
    
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    // Set up ResizeObserver to handle container layout changes smoothly
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Add Tile Layer (Google Hybrid default)
    const tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data © Google'
    }).addTo(map);

    markerGroupRef.current = L.featureGroup().addTo(map);

    return () => {
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Force map layout recalculation on marker/tab updates to ensure no visual rendering lag
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [selectedMarker, activeTab]);

  // Update Tile Layer Type
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    let url = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Hybrid
    if (mapType === 'roadmap') {
      url = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    } else if (mapType === 'terrain') {
      url = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
    }

    tileLayerRef.current.setUrl(url);
  }, [mapType]);

  // Sync Markers and Paths
  useEffect(() => {
    if (!mapRef.current || !markerGroupRef.current) return;

    const map = mapRef.current;
    const markerGroup = markerGroupRef.current;

    // Clear existing
    markerGroup.clearLayers();
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
    if (midpointMarkerRef.current) {
      midpointMarkerRef.current.remove();
      midpointMarkerRef.current = null;
    }

    // Add normal markers for category items
    markers.forEach(m => {
      // Skip selected marker to draw custom pin over it
      if (selectedMarker && selectedMarker.id === m.id) return;

      const pinHtml = `
        <div class="map-dot-marker" style="
          background-color: ${m.color};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          cursor: pointer;
        "></div>
      `;
      const icon = L.divIcon({
        html: pinHtml,
        className: 'custom-div-icon',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      L.marker([m.lat, m.lon], { icon })
        .addTo(markerGroup)
        .bindTooltip(m.name, {
          permanent: false,
          direction: 'top',
          offset: [0, -5],
          className: 'custom-map-tooltip'
        })
        .on('click', () => {
          setSelectedItem(m.raw);
          setSelectedMarker(m);
          setUserClicked(true);
        });
    });

    // If marker is selected
    if (selectedMarker) {
      // Zoom and pan to selected marker coordinates
      if (!userClicked) {
        map.setView([selectedMarker.lat, selectedMarker.lon], 11, { animate: true, duration: 1.2 });
      }

      // Draw custom glowing destination marker
      const destPinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <div class="pulse-ring" style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: ${selectedMarker.color};
            opacity: 0.45;
            animation: pin-pulse 1.6s infinite ease-out;
          "></div>
          <svg viewBox="0 0 24 24" width="28" height="28" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); z-index: 10;">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${selectedMarker.color}" stroke="white" stroke-width="1.5" />
          </svg>
        </div>
      `;
      const destIcon = L.divIcon({
        html: destPinHtml,
        className: 'dest-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 28]
      });

      destMarkerRef.current = L.marker([selectedMarker.lat, selectedMarker.lon], { icon: destIcon })
        .addTo(map)
        .bindTooltip(`🏔️ ${selectedMarker.name}`, {
          permanent: true,
          direction: 'top',
          className: 'selected-map-tooltip',
          offset: [0, -28]
        });

      // If route calculation is requested
      if (userClicked && selectedStartCity) {
        // Start Marker (Blue Pin)
        const startPinHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <svg viewBox="0 0 24 24" width="24" height="24" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.45)); z-index: 10;">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6" stroke="white" stroke-width="1.5" />
            </svg>
          </div>
        `;
        const startIcon = L.divIcon({
          html: startPinHtml,
          className: 'start-div-icon',
          iconSize: [28, 28],
          iconAnchor: [12, 24]
        });

        startMarkerRef.current = L.marker([selectedStartCity.lat, selectedStartCity.lon], { icon: startIcon })
          .addTo(map)
          .bindTooltip(`📍 Start: ${selectedStartCity.name}`, { permanent: false, direction: 'top' });

        // Draw Route Line
        const latlngs = generateWindingRoute(
          selectedStartCity.lat,
          selectedStartCity.lon,
          selectedMarker.lat,
          selectedMarker.lon,
          transitMode
        );
        const transit = TRANSIT_MODES[transitMode] || TRANSIT_MODES.plane;
        routeLineRef.current = L.polyline(latlngs as any, {
          color: transit.color,
          weight: transitMode === 'walking' ? 2.5 : 4,
          dashArray: transit.dashArray || undefined,
          opacity: 0.85
        }).addTo(map);

        // Midpoint distance badge
        const midLat = (selectedStartCity.lat + selectedMarker.lat) / 2;
        const midLon = (selectedStartCity.lon + selectedMarker.lon) / 2;
        const transitDist = routeDistance * transit.multiplier;
        const distHtml = `
          <div style="
            background: rgba(15, 23, 42, 0.95);
            color: ${transit.color};
            border: 1px solid ${transit.color}75;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 900;
            box-shadow: 0 3px 8px rgba(0,0,0,0.45);
            white-space: nowrap;
            text-align: center;
          ">
            ${transit.icon} ${Math.round(transitDist).toLocaleString()} km
          </div>
        `;
        const distIcon = L.divIcon({
          html: distHtml,
          className: 'dist-label-icon',
          iconSize: [80, 18],
          iconAnchor: [40, 9]
        });
        midpointMarkerRef.current = L.marker([midLat, midLon], { icon: distIcon, keyboard: false, interactive: false })
          .addTo(map);

        // Pan map bounds to fit both start city and trek coordinates
        map.fitBounds(latlngs as any, { padding: [50, 50] });
      }
    } else {
      // Zoom out to fit all category markers
      if (markerGroup.getLayers().length > 0) {
        map.fitBounds(markerGroup.getBounds(), { padding: [40, 40] });
      } else {
        map.setView([22.9734, 78.6569], 5);
      }
    }
  }, [markers, selectedMarker, selectedStartCity, userClicked, routeDistance, transitMode]);

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Extreme': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-50/10';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50 dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      
      {/* CSS Keyframes Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pin-pulse {
          0% { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        .custom-map-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 8px !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
          padding: 4px 8px !important;
        }
        .selected-map-tooltip {
          background: rgba(16, 185, 129, 0.95) !important;
          color: white !important;
          border: 1px solid rgba(16, 185, 129, 0.4) !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          font-weight: 900 !important;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4) !important;
          padding: 4px 8px !important;
        }
        .leaflet-container {
          background: #0b1329 !important;
          border-radius: 24px;
        }
      ` }} />

      {/* Sidebar Controls and Details Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            India Adventure Map
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Interactive Live Google Map tracking high-altitude treks, alpine base camps, operator headquarters, and extreme sports centers.
          </p>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { id: 'treks', label: '🏔️ Treks' },
              { id: 'camps', label: '⛺ Base Camps' },
              { id: 'operators', label: '💼 Operators' },
              { id: 'sports', label: '🪂 Sports' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedItem(null);
                  setSelectedMarker(null);
                  setUserClicked(false);
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:border-emerald-450 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Collapsible State/Flat Directories for Treks */}
          {activeTab === 'treks' && (
            <div className="flex flex-col gap-2 mt-3">
              <input
                type="text"
                placeholder="Search treks by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
              />

              {/* Directory Sub-toggles */}
              <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setTrekViewMode('flat')}
                  className={`flex-1 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg text-center transition-all cursor-pointer ${
                    trekViewMode === 'flat'
                      ? 'bg-white dark:bg-slate-800 text-emerald-500 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/40'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  🗂️ All Treks (A-Z)
                </button>
                <button
                  type="button"
                  onClick={() => setTrekViewMode('state')}
                  className={`flex-1 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg text-center transition-all cursor-pointer ${
                    trekViewMode === 'state'
                      ? 'bg-white dark:bg-slate-800 text-emerald-500 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/40'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  📍 Group by State
                </button>
              </div>
              
              <div className="max-h-56 overflow-y-auto scrollbar-none flex flex-col gap-2 mt-1">
                {trekViewMode === 'flat' ? (
                  <div className="flex flex-col gap-1.5">
                    {filteredFlatTreks.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedItem(t);
                          setSelectedMarker({
                            id: t.id,
                            name: t.name,
                            lat: t.coordinates.lat,
                            lon: t.coordinates.lon,
                            color: t.difficulty === 'Easy' ? '#10b981' : t.difficulty === 'Medium' ? '#f59e0b' : t.difficulty === 'Hard' ? '#f97316' : '#f43f5e',
                            raw: t
                          });
                          setUserClicked(true);
                        }}
                        className={`w-full text-left text-[11px] font-bold p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selectedItem?.id === t.id
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>🏔️ {t.name}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{t.state}</span>
                        </div>
                      </button>
                    ))}
                    {filteredFlatTreks.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No treks matching search query.
                      </div>
                    )}
                  </div>
                ) : (
                  Object.entries(filteredGroupedTreks).map(([state, list]) => {
                    const isExpanded = expandedState === state;
                    return (
                      <div key={state} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/40">
                        <button
                          onClick={() => setExpandedState(isExpanded ? null : state)}
                          className="w-full flex justify-between items-center bg-slate-100 dark:bg-slate-900/60 p-2.5 text-xs font-black text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <span>📍 {state}</span>
                          <span>{isExpanded ? '▼' : '▶'}</span>
                        </button>
                        {isExpanded && (
                          <div className="flex flex-col gap-1 p-2 bg-white dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800">
                            {list.map(t => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setSelectedItem(t);
                                  setSelectedMarker({
                                    id: t.id,
                                    name: t.name,
                                    lat: t.coordinates.lat,
                                    lon: t.coordinates.lon,
                                    color: t.difficulty === 'Easy' ? '#10b981' : t.difficulty === 'Medium' ? '#f59e0b' : t.difficulty === 'Hard' ? '#f97316' : '#f43f5e',
                                    raw: t
                                  });
                                  setUserClicked(true);
                                }}
                                className={`w-full text-left text-[11px] font-bold p-2 rounded-lg transition-colors cursor-pointer border ${
                                  selectedItem?.id === t.id
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent'
                                }`}
                              >
                                🏔️ {t.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Collapsible Search Lists for other tabs */}
          {activeTab !== 'treks' && (
            <div className="flex flex-col gap-2 mt-3">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
              />
              <div className="max-h-56 overflow-y-auto scrollbar-none flex flex-col gap-1.5 mt-2">
                {markers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMarker(m);
                      setSelectedItem(m.raw);
                      setUserClicked(true);
                    }}
                    className={`text-left text-xs font-bold p-2.5 rounded-xl border transition-all cursor-pointer ${
                      selectedMarker?.id === m.id
                        ? 'bg-slate-900 text-white dark:bg-emerald-500 border-transparent shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m.color === '#06b6d4' ? '⛺ ' : m.color === '#a855f7' ? '💼 ' : '🪂 '} {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Item Detail Card */}
        <div className="flex-1 flex flex-col justify-center mt-4 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id || selectedItem.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">
                      {selectedItem.state || selectedItem.category || 'Operator Headquarter'}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug mt-1">
                      {selectedItem.name}
                    </h3>
                  </div>
                  {selectedItem.difficulty && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${difficultyColor(selectedItem.difficulty)}`}>
                      {selectedItem.difficulty}
                    </span>
                  )}
                  {selectedItem.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Metrics */}
                {selectedItem.altitude && (
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase">Max Altitude</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm font-black">{selectedItem.altitude}m</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase">Duration</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm font-black">{selectedItem.duration} Days</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase">Distance</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm font-black">{selectedItem.distance}km</strong>
                    </div>
                  </div>
                )}

                {/* Live Weather Report */}
                {selectedMarker && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          🛰️ Live Weather Report
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                          {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} ({new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()})
                        </span>
                      </div>
                      <span className="text-[8px] bg-slate-200 dark:bg-slate-850 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono tracking-wider">
                        Real-time GPS
                      </span>
                    </div>

                    {isLoadingWeather ? (
                      <div className="flex items-center justify-center py-6 gap-2 text-[10px] text-slate-450 dark:text-slate-400 animate-pulse font-mono tracking-wider">
                        <Compass className="h-4 w-4 animate-spin text-emerald-500" />
                        Querying meteorological telemetry...
                      </div>
                    ) : weatherData ? (
                      (() => {
                        const currentDayInfo = weatherData.daily[selectedDayIndex] || weatherData.daily[0] || {
                          tempMax: weatherData.high,
                          tempMin: weatherData.low,
                          conditionText: weatherData.conditionText,
                          icon: weatherData.icon,
                          humidity: weatherData.humidity,
                          windSpeed: weatherData.windSpeed,
                          hourly: weatherData.hourly
                        };
                        const displayTemp = selectedDayIndex === 0 ? weatherData.temp : currentDayInfo.tempMax;
                        const displayCondition = selectedDayIndex === 0 ? weatherData.conditionText : currentDayInfo.conditionText;
                        const displayIcon = selectedDayIndex === 0 ? weatherData.icon : currentDayInfo.icon;
                        const displayHigh = currentDayInfo.tempMax;
                        const displayLow = currentDayInfo.tempMin;

                        // Calculate custom temperature curve coordinates
                        const hourlyData = currentDayInfo.hourly || [];
                        const temps = hourlyData.map(h => h.temp);
                        const minTemp = temps.length > 0 ? Math.min(...temps) : 10;
                        const maxTemp = temps.length > 0 ? Math.max(...temps) : 30;
                        
                        const points = hourlyData.map((h, i) => {
                          const x = (i + 0.5) * 62.5;
                          const range = maxTemp - minTemp;
                          // Scale temperature vertically between y=22 and y=68
                          const y = range === 0 ? 45 : 68 - ((h.temp - minTemp) / range) * 46;
                          return { x, y, temp: h.temp, precipProb: h.precipProb, time: h.time };
                        });

                        let linePath = '';
                        let fillPath = '';
                        if (points.length > 0) {
                          linePath = `M ${points[0].x} ${points[0].y}`;
                          for (let i = 0; i < points.length - 1; i++) {
                            const p0 = points[i];
                            const p1 = points[i+1];
                            const cp1x = p0.x + 20;
                            const cp1y = p0.y;
                            const cp2x = p1.x - 20;
                            const cp2y = p1.y;
                            linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
                          }
                          fillPath = `${linePath} L ${points[points.length - 1].x} 94 L ${points[0].x} 94 Z`;
                        }

                        return (
                          <div className="flex flex-col gap-3">
                            {/* Google Weather Header Card style */}
                            <div className="flex items-center gap-4 py-1">
                              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                <GoogleWeatherIcon name={displayIcon} className="w-16 h-16" />
                              </div>
                              <div className="flex items-start">
                                <span className="text-5xl font-medium text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                                  {displayTemp}
                                </span>
                                <span className="text-xl font-medium text-slate-800 dark:text-slate-100 leading-none relative -top-1.5 ml-0.5">
                                  °C
                                </span>
                              </div>
                              <div className="flex flex-col ml-1">
                                <span className="text-sm font-semibold text-slate-850 dark:text-slate-100 leading-tight">
                                  {displayCondition}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-450 mt-0.5">
                                  H{displayHigh}° L{displayLow}°
                                </span>
                              </div>
                            </div>

                            {/* 6-Day Horizontal Forecast Row */}
                            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                              {weatherData.daily.map((dayData, idx) => {
                                const isSelected = selectedDayIndex === idx;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedDayIndex(idx)}
                                    className={`flex-1 min-w-[58px] py-2 px-1 rounded-xl flex flex-col items-center gap-0.5 border transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
                                        : 'bg-slate-100/50 dark:bg-slate-900/30 border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/60'
                                    }`}
                                  >
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                      {dayData.day}
                                    </span>
                                    <GoogleWeatherIcon name={dayData.icon} className="w-8 h-8 my-0.5" />
                                    <div className="flex gap-1 text-[10px] font-bold">
                                      <span className="text-slate-800 dark:text-slate-200">{dayData.tempMax}°</span>
                                      <span className="text-slate-400 dark:text-slate-500">{dayData.tempMin}°</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Hourly Forecast Curve Chart */}
                            {points.length > 0 && (
                              <div className="overflow-x-auto scrollbar-none w-full border border-slate-100 dark:border-slate-900 rounded-xl bg-white dark:bg-slate-950 p-2">
                                <div className="w-[500px] flex-shrink-0">
                                  <svg viewBox="0 0 500 125" className="w-full h-[125px]">
                                    <defs>
                                      <linearGradient id="weatherTempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                                      </linearGradient>
                                    </defs>
                                    
                                    {/* Filled gradient area under temp curve */}
                                    <path d={fillPath} fill="url(#weatherTempGradient)" />
                                    
                                    {/* Smooth temp curve line */}
                                    <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                                    
                                    {/* Temperature labels above points */}
                                    {points.map((p, idx) => (
                                      <text
                                        key={`temp-${idx}`}
                                        x={p.x}
                                        y={p.y - 8}
                                        textAnchor="middle"
                                        className="text-[10px] font-extrabold fill-slate-700 dark:fill-slate-350"
                                      >
                                        {p.temp}°
                                      </text>
                                    ))}

                                    {/* Precipitation probability label columns */}
                                    {points.map((p, idx) => (
                                      <text
                                        key={`precip-${idx}`}
                                        x={p.x}
                                        y={90}
                                        textAnchor="middle"
                                        className="text-[9.5px] font-black fill-blue-600 dark:fill-blue-400"
                                      >
                                        💧{p.precipProb}%
                                      </text>
                                    ))}

                                    {/* Horizontal axis grid line */}
                                    <line
                                      x1={points[0].x}
                                      y1="96"
                                      x2={points[points.length - 1].x}
                                      y2="96"
                                      className="stroke-slate-200 dark:stroke-slate-800"
                                      strokeWidth="1.5"
                                    />
                                    
                                    {/* Axis ticks */}
                                    {points.map((p, idx) => (
                                      <line
                                        key={`tick-${idx}`}
                                        x1={p.x}
                                        y1="96"
                                        x2={p.x}
                                        y2="101"
                                        className="stroke-slate-200 dark:stroke-slate-800"
                                        strokeWidth="1.5"
                                      />
                                    ))}

                                    {/* Hourly column labels */}
                                    {points.map((p, idx) => (
                                      <text
                                        key={`time-${idx}`}
                                        x={p.x}
                                        y={116}
                                        textAnchor="middle"
                                        className="text-[9.5px] font-bold fill-slate-400 dark:fill-slate-500 uppercase"
                                      >
                                        {p.time}
                                      </text>
                                    ))}
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400">
                        Weather telemetry offline.
                      </div>
                    )}
                  </div>
                )}

                {/* Overview/About Text */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {selectedItem.overview || selectedItem.about || selectedItem.description || `Explore hiking courses and base camp pathways surrounding ${selectedItem.name}.`}
                </p>

                {/* Google Maps Distance & Route Panel */}
                {selectedMarker && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-350">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">🗺️ Google Route Engine</span>
                      <span className="text-[9px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-black border border-blue-500/20">
                        GPS Active
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 font-bold">
                      {/* Starting State Select */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">Starting State / UT</span>
                        <select
                          value={selectedState}
                          onChange={e => {
                            setSelectedState(e.target.value);
                            const cities = STATE_DISTRICTS[e.target.value] || [];
                            if (cities.length > 0) {
                              setSelectedCityName(cities[0].name);
                            }
                            setUserClicked(true);
                          }}
                          className="w-full sm:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-bold text-slate-800 dark:text-slate-200"
                        >
                          {selectedState === 'Detected Location' && (
                            <option value="Detected Location">📍 Detected Location</option>
                          )}
                          {statesList.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Starting City / District Select */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">City / District</span>
                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                          <select
                            value={selectedCityName}
                            onChange={e => {
                              setSelectedCityName(e.target.value);
                              setUserClicked(true);
                            }}
                            className="w-full sm:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-bold text-slate-800 dark:text-slate-250"
                          >
                            {citiesListForSelectedState.map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={isDetectingLocation}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isDetectingLocation 
                                ? 'bg-slate-100 dark:bg-slate-850 text-slate-400 animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-750 hover:scale-105 cursor-pointer flex-shrink-0'
                            }`}
                            title="Detect My Location via GPS"
                          >
                            <Compass className={`h-3.5 w-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Transit Mode Selector Pills */}
                      <div className="flex flex-col mt-1.5 border-t border-slate-200/25 dark:border-slate-800/40 pt-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">Select Transport Mode</span>
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                          {Object.entries(TRANSIT_MODES).map(([modeKey, config]) => {
                            const dist = routeDistance * config.multiplier;
                            const durationHrs = dist / config.speed;
                            
                            let durationText = '';
                            if (durationHrs < 1) {
                              durationText = `${Math.round(durationHrs * 60)}m`;
                            } else if (durationHrs < 24) {
                              const hrs = Math.floor(durationHrs);
                              const mins = Math.round((durationHrs - hrs) * 60);
                              durationText = `${hrs}h ${mins}m`;
                            } else {
                              const days = Math.floor(durationHrs / 24);
                              const hrs = Math.round(durationHrs % 24);
                              durationText = `${days}d ${hrs}h`;
                            }

                            return (
                              <button
                                key={modeKey}
                                type="button"
                                onClick={() => {
                                  setTransitMode(modeKey as any);
                                  setUserClicked(true);
                                }}
                                className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer ${
                                  transitMode === modeKey
                                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/55 dark:border-slate-800/45 scale-[1.03]'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                }`}
                              >
                                <span className="text-sm">{config.icon}</span>
                                <span className="text-[8px] font-black uppercase mt-0.5 leading-none">{config.label.split(' ')[1]}</span>
                                <span className="text-[8px] opacity-75 font-mono mt-0.5 leading-none">{Math.round(dist)} km</span>
                                <span className="text-[8px] opacity-60 font-mono leading-none mt-0.5">{durationText}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Distance Info Row */}
                      <div className="flex justify-between items-center text-xs border-t border-slate-200/25 dark:border-slate-800/40 pt-1.5 mt-1.5">
                        <span className="text-slate-400 font-medium">Estimated Mode Distance</span>
                        <span 
                          style={{ color: TRANSIT_MODES[transitMode].color }}
                          className="font-black text-sm transition-all duration-300"
                        >
                          {Math.round(routeDistance * TRANSIT_MODES[transitMode].multiplier).toLocaleString()} km
                        </span>
                      </div>

                      {/* Travel Route Steps Description */}
                      <div className="text-[10px] leading-relaxed text-slate-400 mt-1 font-medium border-t border-slate-200/25 dark:border-slate-800/40 pt-1.5">
                        Transit from <strong>{selectedStartCity.name}</strong> to base camps around <strong>{selectedMarker.name}</strong> via <strong>{TRANSIT_MODES[transitMode].label.split(' ')[1]}</strong>. Estimated travel duration is <strong>{
                          (() => {
                            const dist = routeDistance * TRANSIT_MODES[transitMode].multiplier;
                            const durationHrs = dist / TRANSIT_MODES[transitMode].speed;
                            if (durationHrs < 1) {
                              return `${Math.round(durationHrs * 60)} minutes`;
                            } else if (durationHrs < 24) {
                              const hrs = Math.floor(durationHrs);
                              const mins = Math.round((durationHrs - hrs) * 60);
                              return `${hrs} hours and ${mins} minutes`;
                            } else {
                              const days = Math.floor(durationHrs / 24);
                              const hrs = Math.round(durationHrs % 24);
                              return `${days} days and ${hrs} hours`;
                            }
                          })()
                        }</strong>. Plotted in mode color code.
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Action */}
                <div className="mt-2 flex flex-col gap-2">
                  {selectedItem.altitude ? (
                    <a
                      href={`/trek/${selectedItem.id}`}
                      className="w-full flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Navigate Trail Details
                    </a>
                  ) : selectedItem.website ? (
                    <a
                      href={`/companies/${selectedItem.id}`}
                      className="w-full flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      Visit Operator Profile
                    </a>
                  ) : (
                    <div className="text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                      Located coordinates: {selectedItem.lat ?? selectedItem.coordinates?.lat}° N, {selectedItem.lon ?? selectedItem.coordinates?.lon}° E
                    </div>
                  )}

                  {selectedMarker && (
                    <a
                      href={userClicked 
                        ? `https://www.google.com/maps/dir/?api=1&origin=${selectedStartCity.lat},${selectedStartCity.lon}&destination=${selectedMarker.lat},${selectedMarker.lon}&travelmode=driving`
                        : `https://www.google.com/maps/search/?api=1&query=${selectedMarker.lat},${selectedMarker.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                    >
                      🗺️ Open in Google Maps Site
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-xs p-4 text-center">
                <Compass className="h-8 w-8 mb-2 stroke-1 animate-spin text-slate-350 dark:text-slate-700" />
                Select any directory item to inspect routes, transit details, and locations.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SVG Canvas Map Display replaced by Google Maps Leaflet container */}
      <div className="lg:col-span-8 flex justify-center items-center relative overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-0 shadow-sm min-h-[550px] w-full z-10">
        
        {/* Leaflet map mounts here */}
        <div ref={mapContainerRef} className="w-full h-full min-h-[550px] z-10" />

        {/* Google Map Type Selector */}
        <div className={`absolute right-6 flex gap-1 p-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-[1000] text-[10px] font-black transition-all duration-300 ${
          selectedItem && selectedMarker ? 'bottom-56 sm:bottom-6' : 'bottom-6'
        }`}>
          {[
            { id: 'hybrid', label: '🛰️ Satellite' },
            { id: 'roadmap', label: '🗺️ Map' },
            { id: 'terrain', label: '🏔️ Terrain' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setMapType(type.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapType === type.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
               {type.label}
            </button>
          ))}
        </div>

        {/* Google Maps Route Navigation HUD */}
        {userClicked && selectedMarker && selectedStartCity && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-[1000] px-4 py-2.5 flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-850 dark:text-slate-200 font-bold w-[calc(100%-3rem)] sm:w-auto max-w-[95%]"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="truncate max-w-[100px] md:max-w-[130px]">{selectedStartCity.name}</span>
            </div>
            <div className="text-slate-400 font-medium flex-shrink-0">➔</div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate max-w-[100px] md:max-w-[130px]">{selectedMarker.name}</span>
            </div>
            <div 
              style={{ color: TRANSIT_MODES[transitMode].color }}
              className="border-l border-slate-200 dark:border-slate-800 pl-3 flex-shrink-0 flex items-center gap-1.5 text-[10px] font-black"
            >
              <span>{TRANSIT_MODES[transitMode].icon}</span>
              <span>{Math.round(routeDistance * TRANSIT_MODES[transitMode].multiplier).toLocaleString()} km</span>
            </div>
          </motion.div>
        )}

        {/* Reset View Button */}
        {selectedMarker && (
          <button
            onClick={() => {
              setSelectedMarker(null);
              setSelectedItem(null);
              setUserClicked(false);
            }}
            className={`absolute right-6 bg-slate-900/90 dark:bg-emerald-500/90 hover:scale-105 active:scale-95 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-2xl border border-white/10 shadow-xl transition-all z-[1000] cursor-pointer flex items-center gap-1.5 transition-all duration-300 ${
              userClicked && selectedStartCity ? 'top-20 sm:top-6' : 'top-6'
            }`}
          >
            🌍 Show All Treks
          </button>
        )}

        {/* Google Earth Satellite View HUD */}
        {selectedItem && selectedMarker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-56 bg-slate-950/85 backdrop-blur-md border border-emerald-500/35 rounded-2xl p-3 shadow-xl z-[1000] text-white font-sans pointer-events-none"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SENTINEL TELEMETRY
              </span>
              <span className="text-[8px] bg-emerald-500/25 text-emerald-300 px-1.5 py-0.5 rounded font-mono tracking-wider">
                {selectedItem.altitude ? `${selectedItem.altitude}m` : 'N/A'}
              </span>
            </div>
            
            <div className="relative h-20 rounded-lg overflow-hidden mb-2 border border-white/10">
              <img
                src={selectedItem.image || selectedItem.images?.[0] || "/india-satellite-map.jpg"}
                alt={selectedItem.name}
                className="w-full h-full object-cover brightness-90 contrast-125"
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent pointer-events-none animate-scanline" />
              {/* Grid overlay */}
              <div className="absolute inset-0 border border-white/5 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full opacity-70" />
                </div>
              </div>
              <div className="absolute bottom-1 left-1.5 text-[8px] bg-slate-900/90 px-1.5 py-0.5 rounded text-slate-400 font-mono tracking-wider">
                {selectedMarker.lat.toFixed(4)}° N | {selectedMarker.lon.toFixed(4)}° E
              </div>
            </div>

            <div className="flex flex-col gap-0.5 text-[10px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>Location:</span>
                <span className="text-white font-black truncate max-w-[110px]">{selectedItem.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>State:</span>
                <span className="text-emerald-400 font-bold">{selectedItem.state || 'N/A'}</span>
              </div>
              {selectedItem.distance && (
                <div className="flex justify-between items-center text-slate-400">
                  <span>Trek Length:</span>
                  <span className="text-white font-mono tracking-wider">{selectedItem.distance} km</span>
                </div>
              )}
              {userClicked && (
                <div className="flex justify-between items-center text-slate-400">
                  <span>Transit GPS:</span>
                  <span className="text-blue-400 font-extrabold font-mono tracking-wider">{routeDistance.toLocaleString()} km</span>
                </div>
              )}
              {weatherData && (
                <div className="flex justify-between items-center text-slate-400 mt-0.5 border-t border-white/10 pt-0.5">
                  <span>Live Weather:</span>
                  <span className="text-emerald-400 font-extrabold font-mono tracking-wider">
                    {weatherData.temp}°C ({weatherData.conditionText})
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
