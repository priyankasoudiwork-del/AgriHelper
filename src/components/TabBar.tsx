import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { NotificationBadge } from './Badge';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  labelStyle?: TextStyle;
  activeLabelStyle?: TextStyle;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  style,
  tabStyle,
  activeTabStyle,
  labelStyle,
  activeLabelStyle,
}) => {
  return (
    <View style={[styles.container, styles[`container_${variant}`], style]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              styles[`tab_${variant}`],
              isActive && styles[`activeTab_${variant}`],
              tabStyle,
              isActive && activeTabStyle,
            ]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              {tab.icon && (
                <Text style={styles.icon}>{tab.icon}</Text>
              )}
              <Text
                style={[
                  styles.label,
                  styles[`label_${variant}`],
                  isActive && styles[`activeLabel_${variant}`],
                  labelStyle,
                  isActive && activeLabelStyle,
                ]}
              >
                {tab.label}
              </Text>
              {tab.badge !== undefined && tab.badge > 0 && (
                <NotificationBadge count={tab.badge} style={styles.badge} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface ScrollableTabBarProps extends TabBarProps {
  scrollable?: boolean;
}

export const ScrollableTabBar: React.FC<ScrollableTabBarProps> = (props) => {
  return <TabBar {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  container_default: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  container_pills: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  container_underline: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab_default: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tab_pills: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 2,
  },
  tab_underline: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab_default: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  activeTab_pills: {
    backgroundColor: '#ffffff',
  },
  activeTab_underline: {
    borderBottomColor: '#8b5cf6',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    marginRight: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  label_default: {
    color: '#6b7280',
  },
  label_pills: {
    color: '#6b7280',
  },
  label_underline: {
    color: '#6b7280',
  },
  activeLabel_default: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  activeLabel_pills: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  activeLabel_underline: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
});
