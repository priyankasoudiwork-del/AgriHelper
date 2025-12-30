import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Image, ImageSourcePropType } from 'react-native';
import { Card } from './Card';

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  image?: ImageSourcePropType;
  source?: string;
  date?: string;
  category?: string;
}

interface NewsCardProps {
  news: NewsItem;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onPress,
  style,
  titleStyle,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, style]}>
        {news.image && (
          <Image source={news.image} style={styles.image} />
        )}

        <View style={styles.content}>
          {news.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{news.category}</Text>
            </View>
          )}

          <Text style={[styles.title, titleStyle]} numberOfLines={2}>
            {news.title}
          </Text>

          {news.description && (
            <Text style={styles.description} numberOfLines={3}>
              {news.description}
            </Text>
          )}

          <View style={styles.footer}>
            {news.source && (
              <Text style={styles.source}>📰 {news.source}</Text>
            )}
            {news.date && (
              <Text style={styles.date}>🕒 {news.date}</Text>
            )}
          </View>
        </View>
      </Card>
    </Component>
  );
};

interface CompactNewsCardProps {
  news: NewsItem;
  onPress?: () => void;
  style?: ViewStyle;
}

export const CompactNewsCard: React.FC<CompactNewsCardProps> = ({
  news,
  onPress,
  style,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.compactCard, style]}>
        {news.image && (
          <Image source={news.image} style={styles.compactImage} />
        )}

        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {news.title}
          </Text>

          <View style={styles.compactFooter}>
            {news.source && (
              <Text style={styles.compactSource}>{news.source}</Text>
            )}
            {news.date && (
              <Text style={styles.compactDate}>{news.date}</Text>
            )}
          </View>
        </View>
      </View>
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: '#ede9fe',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#9ca3af',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  compactCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 12,
  },
  compactContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactSource: {
    fontSize: 11,
    color: '#9ca3af',
  },
  compactDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
