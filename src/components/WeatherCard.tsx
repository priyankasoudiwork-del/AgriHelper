import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Card } from './Card';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  location?: string;
  icon?: string;
  feelsLike?: number;
}

interface WeatherCardProps {
  data: WeatherData;
  unit?: 'celsius' | 'fahrenheit';
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  data,
  unit = 'celsius',
  style,
  titleStyle,
}) => {
  const temperatureSymbol = unit === 'celsius' ? '°C' : '°F';

  const getWeatherIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    return '🌤️';
  };

  return (
    <Card style={[styles.card, style]}>
      {data.location && (
        <Text style={[styles.location, titleStyle]}>📍 {data.location}</Text>
      )}

      <View style={styles.mainContent}>
        <Text style={styles.icon}>
          {data.icon || getWeatherIcon(data.condition)}
        </Text>
        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>
            {Math.round(data.temperature)}{temperatureSymbol}
          </Text>
          <Text style={styles.condition}>{data.condition}</Text>
          {data.feelsLike !== undefined && (
            <Text style={styles.feelsLike}>
              Feels like {Math.round(data.feelsLike)}{temperatureSymbol}
            </Text>
          )}
        </View>
      </View>

      {(data.humidity !== undefined || data.windSpeed !== undefined) && (
        <View style={styles.details}>
          {data.humidity !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💧</Text>
              <View>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{data.humidity}%</Text>
              </View>
            </View>
          )}
          {data.windSpeed !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💨</Text>
              <View>
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>{data.windSpeed} km/h</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

interface WeatherForecastItem {
  day: string;
  temperature: number;
  condition: string;
  icon?: string;
}

interface WeatherForecastProps {
  forecast: WeatherForecastItem[];
  unit?: 'celsius' | 'fahrenheit';
  style?: ViewStyle;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
  forecast,
  unit = 'celsius',
  style,
}) => {
  const temperatureSymbol = unit === 'celsius' ? '°C' : '°F';

  const getWeatherIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    return '🌤️';
  };

  return (
    <Card style={[styles.forecastCard, style]}>
      <Text style={styles.forecastTitle}>Weather Forecast</Text>
      <View style={styles.forecastContainer}>
        {forecast.map((item, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{item.day}</Text>
            <Text style={styles.forecastIcon}>
              {item.icon || getWeatherIcon(item.condition)}
            </Text>
            <Text style={styles.forecastTemp}>
              {Math.round(item.temperature)}{temperatureSymbol}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 64,
    marginRight: 20,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  condition: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  forecastCard: {},
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
    flex: 1,
  },
  forecastDay: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  forecastIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
