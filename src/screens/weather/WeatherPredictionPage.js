import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function WeatherPredictionPage({navigation}) {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // IMPORTANT: Replace with your OpenWeatherMap API key
  const WEATHER_API_KEY = '6aff63fa2d7876c6e45ab4c3952ac7de';

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Request location permission for Android
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

      // Get current position using React Native Geolocation
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location obtained:', latitude, longitude);
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMsg = 'ಸ್ಥಳ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ | Unable to get location';
          
          if (error.code === 1) {
            errorMsg = 'ಸ್ಥಳ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ | Location permission denied. Please enable in settings.';
          } else if (error.code === 2) {
            errorMsg = 'ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ | Location unavailable. Check GPS/Network.';
          } else if (error.code === 3) {
            errorMsg = 'ಸಮಯ ಮೀರಿದೆ | Request timeout. Please try again.';
          }
          
          setError(errorMsg + ' ದಯವಿಟ್ಟು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ | Please enter manually.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        }
      );
    } catch (err) {
      console.error('Location error:', err);
      setError('ಸ್ಥಳ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ | Failed to get location. Please enter manually.');
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      const currentData = await currentResponse.json();
      
      // Fetch 7-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data fetch failed');
      }
      
      const forecastData = await forecastResponse.json();
      
      processWeatherData(currentData, forecastData);
    } catch (err) {
      console.error('Weather API error:', err);
      setError('Failed to fetch weather. Check API key.');
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('City not found');
      }
      
      const currentData = await currentResponse.json();
      
      // Fetch 7-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data fetch failed');
      }
      
      const forecastData = await forecastResponse.json();
      
      processWeatherData(currentData, forecastData);
    } catch (err) {
      console.error('Weather API error:', err);
      setError('City not found. Please try again.');
      setLoading(false);
    }
  };

  const processWeatherData = (current, forecast) => {
    // Get weather icon emoji
    const getWeatherIcon = (code) => {
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

    // Get Kannada condition
    const getKannadaCondition = (description) => {
      const conditions = {
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

    // Calculate rain chance
    const getRainChance = (data) => {
      if (data.pop !== undefined) return Math.round(data.pop * 100);
      if (data.rain) return Math.min(100, 70);
      if (data.weather[0].main === 'Rain') return 70;
      if (data.weather[0].main === 'Clouds') return 30;
      return 10;
    };

    // Process current weather
    const processed = {
      location: `${current.name}, ${current.sys.country}`,
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      condition: getKannadaCondition(current.weather[0].description),
      conditionEn: current.weather[0].description,
      icon: getWeatherIcon(current.weather[0].id),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
      rainChance: current.clouds ? current.clouds.all : 20,
      uvIndex: 7, // Free tier doesn't include UV
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

    // Process 7-day forecast
    const dailyForecasts = [];
    const processedDates = new Set();
    
    const kannadaDays = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
    const engDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    forecast.list.forEach((item, index) => {
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
          rain: getRainChance(item)
        });
      }
    });

    setForecast(dailyForecasts);
    setLoading(false);
  };

  const handleSearch = () => {
    if (location.trim()) {
      fetchWeatherByCity(location);
    }
  };

  const getSprayAdvice = () => {
    if (!weatherData) return null;
    
    if (weatherData.rainChance > 60) {
      return {
        icon: '❌',
        title: 'ಇಂದು ಸಿಂಪಡಿಸಬೇಡಿ',
        titleEn: 'Do Not Spray Today',
        message: 'ಮಳೆಯ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು. ರಾಸಾಯನಿಕ ವ್ಯರ್ಥವಾಗುತ್ತದೆ.',
        messageEn: 'High chance of rain. Chemical will be wasted.',
        color: '#ef4444',
        bgColor: '#fee2e2',
      };
    } else if (weatherData.rainChance > 30) {
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
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity style={{alignSelf:"flex-start"}} onPress={() => navigation.goBack()}>
    <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold',alignSelf:"flex-start" }}>
      ← ಹಿಂದುಕ್ಕೆ
    </Text>
  </TouchableOpacity>
        <Text style={styles.headerTitle}>ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ</Text>
        <Text style={styles.headerSubtitle}>Weather Prediction</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Location Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="ನಿಮ್ಮ ಸ್ಥಳ | Your Location"
              placeholderTextColor="#9ca3af"
              value={location}
              onChangeText={setLocation}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.currentLocationText}>📍 ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ | Use Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* API Key Notice */}
        {WEATHER_API_KEY === 'YOUR_API_KEY_HERE' && (
          <View style={styles.apiNotice}>
            <Text style={styles.apiNoticeTitle}>⚠️ API Key Required</Text>
            <Text style={styles.apiNoticeText}>
              Get free API key from OpenWeatherMap.org{'\n'}
              Replace 'YOUR_API_KEY_HERE' in code
            </Text>
          </View>
        )}

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>ಹವಾಮಾನ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</Text>
            <Text style={styles.loadingTextEn}>Loading weather data...</Text>
          </View>
        ) : weatherData ? (
          <>
            {/* Current Weather Card */}
            <View style={styles.currentWeatherCard}>
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
                  <Text style={styles.statLabel}>ಆರ್ದ್ರತೆ | Humidity</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💨</Text>
                  <Text style={styles.statValue}>{weatherData.windSpeed} km/h</Text>
                  <Text style={styles.statLabel}>ಗಾಳಿ | Wind</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🌧️</Text>
                  <Text style={styles.statValue}>{weatherData.rainChance}%</Text>
                  <Text style={styles.statLabel}>ಮಳೆ | Rain</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>☀️</Text>
                  <Text style={styles.statValue}>{weatherData.uvIndex}</Text>
                  <Text style={styles.statLabel}>UV Index</Text>
                </View>
              </View>

              <View style={styles.sunTimes}>
                <View style={styles.sunTimeItem}>
                  <Text style={styles.sunIcon}>🌅</Text>
                  <Text style={styles.sunTime}>{weatherData.sunrise}</Text>
                  <Text style={styles.sunLabel}>ಸೂರ್ಯೋದಯ</Text>
                </View>
                <View style={styles.sunTimeItem}>
                  <Text style={styles.sunIcon}>🌇</Text>
                  <Text style={styles.sunTime}>{weatherData.sunset}</Text>
                  <Text style={styles.sunLabel}>ಸೂರ್ಯಾಸ್ತ</Text>
                </View>
              </View>
            </View>

            {/* Spray Advice */}
            {advice && (
              <View style={[styles.adviceCard, { backgroundColor: advice.bgColor }]}>
                <Text style={styles.adviceIcon}>{advice.icon}</Text>
                <Text style={[styles.adviceTitle, { color: advice.color }]}>{advice.title}</Text>
                <Text style={[styles.adviceTitleEn, { color: advice.color }]}>{advice.titleEn}</Text>
                <Text style={styles.adviceMessage}>{advice.message}</Text>
                <Text style={styles.adviceMessageEn}>{advice.messageEn}</Text>
              </View>
            )}

            {/* 7-Day Forecast */}
            <View style={styles.forecastSection}>
              <Text style={styles.sectionTitle}>೭ ದಿನಗಳ ಮುನ್ಸೂಚನೆ | 7-Day Forecast</Text>
              
              {forecast.map((day, index) => (
                <View key={index} style={styles.forecastCard}>
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
                </View>
              ))}
            </View>

            {/* Best Days to Spray */}
            <View style={styles.bestDaysCard}>
              <Text style={styles.bestDaysTitle}>ಸಿಂಪಡಿಸಲು ಉತ್ತಮ ದಿನಗಳು</Text>
              <Text style={styles.bestDaysTitleEn}>Best Days to Spray</Text>
              
              <View style={styles.bestDaysList}>
                {forecast
                  .filter(day => day.rain < 30)
                  .slice(0, 3)
                  .map((day, index) => (
                    <View key={index} style={styles.bestDayItem}>
                      <Text style={styles.bestDayIcon}>✅</Text>
                      <View>
                        <Text style={styles.bestDayText}>{day.day} ({day.dayEn})</Text>
                        <Text style={styles.bestDayDate}>{day.date} - {day.rain}% ಮಳೆ</Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>

            {/* Farming Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 ಇಂದಿನ ಕೃಷಿ ಸಲಹೆ | Today's Farming Tips</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  ಬೆಳಗಿನ ೬-೯ ಗಂಟೆ ಅಥವಾ ಸಂಜೆ ೪-೬ ಗಂಟೆ ಸಿಂಪಡಿಸಲು ಉತ್ತಮ{'\n'}
                  Best to spray between 6-9 AM or 4-6 PM
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  ಗಾಳಿಯ ವೇಗ ೧೫ km/h ಗಿಂತ ಕಡಿಮೆ ಇರುವಾಗ ಸಿಂಪಡಿಸಿ{'\n'}
                  Spray when wind speed is below 15 km/h
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  ಮಳೆಯಾದ ೨೪ ಗಂಟೆಯೊಳಗೆ ಸಿಂಪಡಿಸಬೇಡಿ{'\n'}
                  Avoid spraying within 24 hours after rain
                </Text>
              </View>
            </View>

            <View style={styles.spacer} />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌤️</Text>
            <Text style={styles.emptyText}>ಸ್ಥಳ ನಮೂದಿಸಿ ಅಥವಾ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ</Text>
            <Text style={styles.emptyTextEn}>Enter location or use current location</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    backgroundColor: '#0284c7',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0f2fe',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  searchButton: {
    backgroundColor: '#0284c7',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  currentLocationButton: {
    backgroundColor: '#dbeafe',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: 14,
    color: '#0284c7',
    fontWeight: '600',
  },
  apiNotice: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#fcd34d',
    borderRadius: 12,
    padding: 16,
  },
  apiNoticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  apiNoticeText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 20,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#991b1b',
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 4,
  },
  loadingTextEn: {
    fontSize: 14,
    color: '#6b7280',
  },
  currentWeatherCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
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
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunTimeItem: {
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  sunTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  sunLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  adviceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
  bestDaysCard: {
    backgroundColor: '#dcfce7',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  bestDaysTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  bestDaysTitleEn: {
    fontSize: 14,
    color: '#16a34a',
    marginBottom: 16,
  },
  bestDaysList: {
    gap: 12,
  },
  bestDayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bestDayIcon: {
    fontSize: 24,
  },
  bestDayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  bestDayDate: {
    fontSize: 13,
    color: '#16a34a',
  },
  tipsCard: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  tipBullet: {
    fontSize: 18,
    color: '#d97706',
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
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
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyTextEn: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  spacer: {
    height: 40,
  },
})