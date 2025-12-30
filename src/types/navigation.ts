import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

/**
 * Root Stack Parameter List
 *
 * Defines all routes and their parameters in the AgriHelper app.
 * Each key represents a screen name, and the value represents the params
 * that screen expects (undefined if no params).
 */
export type RootStackParamList = {
  // Auth Flow Screens
  Splash: undefined;
  AppIntro: undefined;
  Login: undefined;

  // Main App Screens
  Home: undefined;
  Weather: undefined;
  AiScanner: undefined;
  SprayRecordsList: undefined;
  AddSprayRecord: {
    editMode?: boolean;
    recordId?: string;
  };
  FarmInfo: undefined;
};

/**
 * Navigation prop type helper
 *
 * @example
 * const HomeScreen: FC<{ navigation: NavigationProp<'Home'> }> = ({ navigation }) => {
 *   navigation.navigate('Weather'); // Type-safe navigation
 * }
 */
export type NavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

/**
 * Route prop type helper
 *
 * @example
 * const AddSprayRecordScreen: FC<{ route: RouteParam<'AddSprayRecord'> }> = ({ route }) => {
 *   const { editMode, recordId } = route.params; // Type-safe params
 * }
 */
export type RouteParam<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;

/**
 * Screen props helper combining navigation and route
 *
 * Use this for most screens as it provides both navigation and route props.
 *
 * @example
 * const MyScreen: FC<ScreenProps<'AddSprayRecord'>> = ({ navigation, route }) => {
 *   // Both navigation and route are type-safe
 * }
 */
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<T>;
  route: RouteParam<T>;
};
