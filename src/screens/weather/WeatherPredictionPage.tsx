import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  Header,
  SearchBar,
  Button,
  Card,
  InfoBox,
  Loading,
  BilingualText,
} from '../../components';

interface WeatherData {
  location: string;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionEn: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

interface ForecastDay {
  day: string;
  dayEn: string;
  date: string;
  icon: string;
  tempHigh: number;
  tempLow: number;
  rain: number;
}

interface SprayAdvice {
  icon: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  color: string;
  bgColor: string;
}

interface WeatherPredictionPageProps {
  navigation: any;
}

interface LocationSuggestion {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  displayName?: string;
}

const WeatherLoadingAnimation: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const weatherIcons = [
    { icon: '🌾', label: 'Analyzing crops' },
    { icon: '📊', label: 'Reading data' },
    { icon: '🌧️', label: 'Checking rain' },
    { icon: '🌡️', label: 'Reading temp' },
  ];

  useEffect(() => {
    const cycleIcons = () => {
      // Fade out and scale down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change icon
        setCurrentIconIndex((prev) => (prev + 1) % weatherIcons.length);

        // Fade in and scale up
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    const interval = setInterval(cycleIcons, 1500);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation for the icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={weatherLoadingStyles.container}>
      <View style={weatherLoadingStyles.iconContainer}>
        <Animated.Text
          style={[
            weatherLoadingStyles.mainIcon,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
              ],
            },
          ]}
        >
          {weatherIcons[currentIconIndex].icon}
        </Animated.Text>
      </View>

      <View style={weatherLoadingStyles.loadingBars}>
        <View style={[weatherLoadingStyles.bar, { height: 30, animationDelay: 0 }]} />
        <View style={[weatherLoadingStyles.bar, { height: 50, animationDelay: 100 }]} />
        <View style={[weatherLoadingStyles.bar, { height: 40, animationDelay: 200 }]} />
        <View style={[weatherLoadingStyles.bar, { height: 60, animationDelay: 300 }]} />
      </View>

      <Text style={weatherLoadingStyles.loadingText}>
        ಹವಾಮಾನ ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ...
      </Text>
      <Text style={weatherLoadingStyles.loadingTextEn}>
        Fetching weather data
      </Text>
    </View>
  );
};

const weatherLoadingStyles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mainIcon: {
    fontSize: 56,
  },
  loadingBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 70,
    marginBottom: 20,
  },
  bar: {
    width: 12,
    backgroundColor: '#0284c7',
    borderRadius: 6,
    opacity: 0.7,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingTextEn: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

const WeatherPredictionPage: React.FC<WeatherPredictionPageProps> = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const WEATHER_API_KEY = '6aff63fa2d7876c6e45ab4c3952ac7de';

  // Karnataka boundaries (approximate)
  const KARNATAKA_BOUNDS = {
    minLat: 11.5,
    maxLat: 18.5,
    minLon: 74.0,
    maxLon: 78.5,
  };

  const isInKarnataka = (lat: number | string, lon: number | string): boolean => {
    const latitude = Number(lat);
    const longitude = Number(lon);
  
    console.log("lat======,", latitude, "long====", longitude);
  
    return (
      latitude >= KARNATAKA_BOUNDS.minLat &&
      latitude <= KARNATAKA_BOUNDS.maxLat &&
      longitude >= KARNATAKA_BOUNDS.minLon &&
      longitude <= KARNATAKA_BOUNDS.maxLon
    );
  };
  

  useEffect(() => {
    getCurrentLocation();

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []);

const getCurrentLocation = async () => {
  setLoading(true);
  setError('');

  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'ಸ್ಥಳ ಅನುಮತಿ | Location Permission',
          message: 'ಹವಾಮಾನ ಡೇಟಾಗಾಗಿ ನಿಮ್ಮ ಸ್ಥಳದ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ | This app needs access to your location for weather data',
          buttonPositive: 'ಸರಿ | OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setError('ಸ್ಥಳ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ | Location permission denied');
        setLoading(false);
        return;
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log('📍 Raw GPS:', latitude, longitude);

        // Ignore Google / Emulator fallback location
        if (
          latitude === 37.421998 &&
          longitude === -122.084
        ) {
          setError(
            'ನಿಜವಾದ ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ. GPS ಆನ್ ಮಾಡಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ | Unable to get real location. Please turn on GPS and try again.'
          );
          setLoading(false);
          return;
        }

        // Optional: restrict only to Karnataka
        // if (!isInKarnataka(latitude, longitude)) {
        //   setError('ಈ ಸ್ಥಳ ಕರ್ನಾಟಕದಲ್ಲಿ ಇಲ್ಲ | This location is not in Karnataka.');
        //   setLoading(false);
        //   return;
        // }

        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        let errorMsg = 'ಸ್ಥಳ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ | Unable to get location';

        if (error.code === 1) {
          errorMsg = 'ಸ್ಥಳ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ | Location permission denied';
        } else if (error.code === 2) {
          errorMsg = 'ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ | Location unavailable';
        } else if (error.code === 3) {
          errorMsg = 'ಸಮಯ ಮೀರಿದೆ | Request timeout';
        }

        setError(errorMsg + ' ದಯವಿಟ್ಟು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ | Please enter manually.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  } catch (err) {
    setError('ಸ್ಥಳ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ | Failed to get location. Please enter manually.');
    setLoading(false);
  }
};


  const fetchLocationSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Use Nominatim (OpenStreetMap) API for better Indian location coverage
      // This includes villages, towns, and cities across Karnataka
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)},Karnataka,India&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=15&` +
        `countrycodes=in`,
        {
          headers: {
            'User-Agent': 'AgriHelper-WeatherApp/1.0'
          }
        }
      );

      if (!response.ok) {
        setSuggestions([]);
        return;
      }

      const data = await response.json();

      // Debug: Log raw API response
      console.log('🔍 Nominatim API Response for:', query);
      console.log('📍 Found locations:', data.length);
      if (data.length > 0) {
        console.log('📌 First result:', {
          name: data[0].display_name,
          lat: data[0].lat,
          lon: data[0].lon,
          type: data[0].type,
          address: data[0].address
        });
      }

      // Filter and map Karnataka locations
      const karnatakaLocations = data
        .filter((loc: any) => {
          const lat = parseFloat(loc.lat);
          const lon = parseFloat(loc.lon);

          // Only include if within Karnataka boundaries
          if (!isInKarnataka(lat, lon)) {
            return false;
          }

          // Filter to include cities, towns, villages, and localities
          const validTypes = ['city', 'town', 'village', 'hamlet', 'suburb', 'municipality', 'administrative'];
          return validTypes.some(type => loc.type?.includes(type) || loc.class?.includes(type));
        })
        .map((loc: any) => {
          // Extract clean location name
          const name = loc.address?.village ||
                      loc.address?.town ||
                      loc.address?.city ||
                      loc.address?.municipality ||
                      loc.address?.suburb ||
                      loc.name ||
                      loc.display_name.split(',')[0];

          return {
            name: name,
            state: loc.address?.state || 'Karnataka',
            country: 'India',
            lat: parseFloat(loc.lat),
            lon: parseFloat(loc.lon),
            displayName: loc.display_name,
          };
        })
        // Remove duplicates by name
        .filter((loc: any, index: number, self: any[]) =>
          index === self.findIndex((l) => l.name === loc.name)
        )
        .slice(0, 10); // Limit to 10 suggestions

      setSuggestions(karnatakaLocations);
      setShowSuggestions(karnatakaLocations.length > 0);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search - wait 500ms after user stops typing
    const timeout = setTimeout(() => {
      fetchLocationSuggestions(text);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);

    // Immediately fetch weather for selected location
    fetchWeatherByCoords(suggestion.lat, suggestion.lon);
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    // Check if location is in Karnataka
    // if (!isInKarnataka(lat, lon)) {
    //   setError('ಈ ಸ್ಥಳ ಕರ್ನಾಟಕದಲ್ಲಿ ಇಲ್ಲ | This location is not in Karnataka. Please enter a location within Karnataka.');
    //   setLoading(false);
    //   return;
    // }

    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error('Weather data fetch failed');
      }

      const currentData = await currentResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error('Forecast data fetch failed');
      }

      const forecastData = await forecastResponse.json();

      processWeatherData(currentData, forecastData);
    } catch (err) {
      setError('Failed to fetch weather. Check API key.');
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError('');

    try {
      // Use Nominatim for better coverage of Indian villages
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(cityName)},Karnataka,India&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5&` +
        `countrycodes=in`,
        {
          headers: {
            'User-Agent': 'AgriHelper-WeatherApp/1.0'
          }
        }
      );

      if (!geocodeResponse.ok) {
        throw new Error('Location not found');
      }

      const geocodeData = await geocodeResponse.json();

      if (!geocodeData || geocodeData.length === 0) {
        setError('ಸ್ಥಳ ಕಂಡುಬಂದಿಲ್ಲ | Location not found. Please check spelling or try nearby town.');
        setLoading(false);
        return;
      }

      // Use the first result
      const location = geocodeData[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);

      // Check if location is in Karnataka
      // if (!isInKarnataka(lat, lon)) {
      //   setError('ಈ ಸ್ಥಳ ಕರ್ನಾಟಕದಲ್ಲಿ ಇಲ್ಲ | This location is not in Karnataka. Please enter a Karnataka location.');
      //   setLoading(false);
      //   return;
      // }

      // Fetch weather using coordinates
      await fetchWeatherByCoords(lat, lon);
    } catch (err) {
      setError('ಸ್ಥಳ ಕಂಡುಬಂದಿಲ್ಲ | Location not found. Please try again with correct spelling.');
      setLoading(false);
    }
  };

  const processWeatherData = (current: any, forecast: any) => {
    const getWeatherIcon = (code: number): string => {
      if (code >= 200 && code < 300) return '⛈️';
      if (code >= 300 && code < 400) return '🌦️';
      if (code >= 500 && code < 600) return '🌧️';
      if (code >= 600 && code < 700) return '❄️';
      if (code >= 700 && code < 800) return '🌫️';
      if (code === 800) return '☀️';
      if (code === 801) return '🌤️';
      if (code === 802) return '⛅';
      if (code > 802) return '☁️';
      return '🌤️';
    };

    const getKannadaCondition = (description: string): string => {
      const conditions: Record<string, string> = {
        'clear sky': 'ಸ್ಪಷ್ಟ ಆಕಾಶ',
        'few clouds': 'ಕೆಲವು ಮೋಡಗಳು',
        'scattered clouds': 'ಚದುರಿದ ಮೋಡಗಳು',
        'broken clouds': 'ಮೋಡ ಕವಿದಿದೆ',
        'overcast clouds': 'ಮೋಡ ಕವಿದಿದೆ',
        'light rain': 'ಹಗುರ ಮಳೆ',
        'moderate rain': 'ಮಧ್ಯಮ ಮಳೆ',
        'heavy rain': 'ಭಾರೀ ಮಳೆ',
        'thunderstorm': 'ಗುಡುಗು ಸಹಿತ ಮಳೆ',
        'mist': 'ಮಂಜು',
        'haze': 'ಮಬ್ಬು'
      };
      return conditions[description.toLowerCase()] || 'ಮೋಡ ಕವಿದಿದೆ';
    };

    const processed: WeatherData = {
      location: `${current.name}, ${current.sys.country}`,
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      condition: getKannadaCondition(current.weather[0].description),
      conditionEn: current.weather[0].description,
      icon: getWeatherIcon(current.weather[0].id),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6),
      rainChance: current.clouds ? current.clouds.all : 20,
      uvIndex: 7,
      sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
    };

    setWeatherData(processed);
    setLocation(processed.location);

    const dailyForecasts: ForecastDay[] = [];
    const processedDates = new Set();

    const kannadaDays = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
    const engDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toDateString();

      if (!processedDates.has(dateStr) && dailyForecasts.length < 7) {
        processedDates.add(dateStr);

        const dayIndex = date.getDay();
        const isToday = dailyForecasts.length === 0;
        const isTomorrow = dailyForecasts.length === 1;

        dailyForecasts.push({
          day: isToday ? 'ಇಂದು' : isTomorrow ? 'ನಾಳೆ' : kannadaDays[dayIndex],
          dayEn: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : engDays[dayIndex],
          date: `${months[date.getMonth()]} ${date.getDate()}`,
          icon: getWeatherIcon(item.weather[0].id),
          tempHigh: Math.round(item.main.temp_max),
          tempLow: Math.round(item.main.temp_min),
          rain: item.pop !== undefined ? Math.round(item.pop * 100) : 20
        });
      }
    });

    setForecast(dailyForecasts);
    setLoading(false);
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    setSuggestions([]);

    if (location.trim()) {
      fetchWeatherByCity(location);
    }
  };

  const getSprayAdvice = (): SprayAdvice | null => {
    if (!weatherData) return null;

    if (weatherData.rainChance > 70) {
      return {
        icon: '❌',
        title: 'ಇಂದು ಸಿಂಪಡಿಸಬೇಡಿ',
        titleEn: 'Do Not Spray Today',
        message: 'ಮಳೆಯ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು. ರಾಸಾಯನಿಕ ವ್ಯರ್ಥವಾಗುತ್ತದೆ.',
        messageEn: 'High chance of rain. Chemical will be wasted.',
        color: '#ef4444',
        bgColor: '#fee2e2',
      };
    } else if (weatherData.rainChance > 55) {
      return {
        icon: '⚠️',
        title: 'ಎಚ್ಚರಿಕೆ',
        titleEn: 'Caution',
        message: 'ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ. ಬೆಳಗಿನ ಜಾವ ಸೂಕ್ತ.',
        messageEn: 'Rain possible. Early morning spray recommended.',
        color: '#f59e0b',
        bgColor: '#fef3c7',
      };
    } else {
      return {
        icon: '✅',
        title: 'ಸಿಂಪಡಿಸಲು ಉತ್ತಮ ದಿನ',
        titleEn: 'Good Day to Spray',
        message: 'ಹವಾಮಾನ ಅನುಕೂಲಕರವಾಗಿದೆ. ಸಿಂಪಡಿಸಬಹುದು.',
        messageEn: 'Weather is favorable. Safe to spray.',
        color: '#16a34a',
        bgColor: '#dcfce7',
      };
    }
  };

  const advice = getSprayAdvice();

  return (
    <View style={styles.container}>
      <Header
        title="ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ"
        subtitle="Weather Prediction"
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
        style={styles.header}
      />

      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <SearchBar
            value={location}
            onChangeText={handleLocationChange}
            placeholder="ನಿಮ್ಮ ಸ್ಥಳ ಹುಡುಕಿ | Search Karnataka location"
            onSearch={handleSearch}
          />

          {/* Location Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(suggestion)}
                >
                  <Text style={styles.suggestionIcon}>📍</Text>
                  <View style={styles.suggestionText}>
                    <Text style={styles.suggestionName}>{suggestion.name}</Text>
                    <Text style={styles.suggestionState}>
                      {suggestion.state}, {suggestion.country}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Button
            title="📍 ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ | Use Current Location"
            onPress={getCurrentLocation}
            variant="secondary"
            style={styles.locationButton}
          />
        </View>

        {error ? (
          <InfoBox
            message={error}
            variant="error"
            style={styles.infoBox}
          />
        ) : null}

        {loading ? (
          <WeatherLoadingAnimation />
        ) : weatherData ? (
          <>
            <Card style={styles.weatherCard}>
              <Text style={styles.locationName}>{weatherData.location}</Text>

              <View style={styles.tempSection}>
                <Text style={styles.weatherIcon}>{weatherData.icon}</Text>
                <View style={styles.tempDetails}>
                  <Text style={styles.temperature}>{weatherData.temp}°C</Text>
                  <Text style={styles.condition}>{weatherData.condition}</Text>
                  <Text style={styles.conditionEn}>{weatherData.conditionEn}</Text>
                  <Text style={styles.feelsLike}>Feels like {weatherData.feelsLike}°C</Text>
                </View>
              </View>

              <View style={styles.weatherStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💧</Text>
                  <Text style={styles.statValue}>{weatherData.humidity}%</Text>
                  <BilingualText kannada="ಆರ್ದ್ರತೆ" english="Humidity" style={styles.statLabel} />
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💨</Text>
                  <Text style={styles.statValue}>{weatherData.windSpeed} km/h</Text>
                  <BilingualText kannada="ಗಾಳಿ" english="Wind" style={styles.statLabel} />
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🌧️</Text>
                  <Text style={styles.statValue}>{weatherData.rainChance}%</Text>
                  <BilingualText kannada="ಮಳೆ" english="Rain" style={styles.statLabel} />
                </View>
              </View>
            </Card>

            {advice && (
              <Card style={[styles.adviceCard, { backgroundColor: advice.bgColor }]}>
                <Text style={styles.adviceIcon}>{advice.icon}</Text>
                <Text style={[styles.adviceTitle, { color: advice.color }]}>{advice.title}</Text>
                <Text style={[styles.adviceTitleEn, { color: advice.color }]}>{advice.titleEn}</Text>
                <Text style={styles.adviceMessage}>{advice.message}</Text>
                <Text style={styles.adviceMessageEn}>{advice.messageEn}</Text>
              </Card>
            )}

            <View style={styles.forecastSection}>
              <BilingualText
                kannada="೭ ದಿನಗಳ ಮುನ್ಸೂಚನೆ"
                english="7-Day Forecast"
                style={styles.sectionTitle}
              />

              {forecast.map((day, index) => (
                <Card key={index} style={styles.forecastCard}>
                  <View style={styles.forecastLeft}>
                    <Text style={styles.forecastDay}>{day.day}</Text>
                    <Text style={styles.forecastDayEn}>{day.dayEn}</Text>
                    <Text style={styles.forecastDate}>{day.date}</Text>
                  </View>

                  <View style={styles.forecastCenter}>
                    <Text style={styles.forecastIcon}>{day.icon}</Text>
                  </View>

                  <View style={styles.forecastRight}>
                    <Text style={styles.forecastTemp}>{day.tempHigh}° / {day.tempLow}°</Text>
                    <View style={styles.rainChance}>
                      <Text style={styles.rainIcon}>💧</Text>
                      <Text style={styles.rainPercent}>{day.rain}%</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌤️</Text>
            <BilingualText
              kannada="ಸ್ಥಳ ನಮೂದಿಸಿ ಅಥವಾ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ"
              english="Enter location or use current location"
              style={styles.emptyText}
            />
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    backgroundColor: '#0284c7',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  locationButton: {
    marginTop: 0,
  },
  infoBox: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  loading: {
    paddingVertical: 60,
  },
  weatherCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 20,
  },
  weatherIcon: {
    fontSize: 80,
  },
  tempDetails: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  conditionEn: {
    fontSize: 14,
    color: '#6b7280',
  },
  feelsLike: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  adviceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  adviceIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adviceTitleEn: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  adviceMessage: {
    fontSize: 15,
    textAlign: 'center',
    color: '#374151',
    marginBottom: 4,
  },
  adviceMessageEn: {
    fontSize: 13,
    textAlign: 'center',
    color: '#6b7280',
  },
  forecastSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  forecastCard: {
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forecastLeft: {
    flex: 1,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  forecastDayEn: {
    fontSize: 13,
    color: '#6b7280',
  },
  forecastDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  forecastCenter: {
    flex: 1,
    alignItems: 'center',
  },
  forecastIcon: {
    fontSize: 36,
  },
  forecastRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  rainChance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rainIcon: {
    fontSize: 14,
  },
  rainPercent: {
    fontSize: 13,
    color: '#0284c7',
    fontWeight: '600',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
  },
  spacer: {
    height: 40,
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  suggestionIcon: {
    fontSize: 20,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  suggestionState: {
    fontSize: 13,
    color: '#6b7280',
  },
});

export default WeatherPredictionPage;
