# AgriHelper - Testing Documentation

Comprehensive Jest unit tests for all screens in the AgriHelper application.

## Test Coverage Summary

All 9 screens have complete unit test coverage with multiple test cases for each component.

### Test Files Created

1. **SplashScreen.test.tsx** - 6 test cases
2. **AppIntroScreen.test.tsx** - 4 test cases
3. **LoginScreen.test.tsx** - 8 test cases
4. **HomeScreen.test.tsx** - 8 test cases
5. **WeatherPredictionPage.test.tsx** - 8 test cases
6. **FramInfo.test.tsx** - 7 test cases
7. **AddSprayRecordScreen.test.tsx** - 12 test cases
8. **SprayRecordsListScreen.test.tsx** - 12 test cases
9. **ProductScannerScreen.test.tsx** - 13 test cases

**Total: 78 test cases**

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test SplashScreen.test.tsx
```

## Test Coverage by Screen

### 1. SplashScreen
**File:** `src/screens/__tests__/SplashScreen.test.tsx`

**Test Cases:**
- ✅ Renders correctly with Kannada and English text
- ✅ Displays loading indicator
- ✅ Requests permissions on mount
- ✅ Navigates to AppIntro after loading animation
- ✅ Displays logo emoji
- ✅ Handles permission failures

**Key Features Tested:**
- Component rendering
- Permission requests (Location, Camera, Gallery)
- Navigation after timeout
- Animated UI elements

---

### 2. AppIntroScreen
**File:** `src/screens/__tests__/AppIntroScreen.test.tsx`

**Test Cases:**
- ✅ Renders correctly
- ✅ Displays bilingual content
- ✅ Navigates to login on "Get Started" button
- ✅ Skip button functionality

**Key Features Tested:**
- Welcome screen rendering
- Button interactions
- Navigation flow

---

### 3. LoginScreen
**File:** `src/screens/login/__tests__/LoginScreen.test.tsx`

**Test Cases:**
- ✅ Renders login form correctly
- ✅ Displays phone input field
- ✅ Validates phone number (10 digits)
- ✅ Sends OTP via Firebase Auth
- ✅ Shows OTP input after sending OTP
- ✅ Verifies OTP code
- ✅ Handles authentication errors
- ✅ Displays bilingual labels

**Key Features Tested:**
- Form validation
- Firebase Authentication integration
- Phone number and OTP flow
- Error handling

---

### 4. HomeScreen
**File:** `src/screens/__tests__/HomeScreen.test.tsx`

**Test Cases:**
- ✅ Renders home screen with header
- ✅ Displays phone number in header
- ✅ Renders all feature cards
- ✅ Shows logout confirmation dialog
- ✅ Calls logout function on confirm
- ✅ Navigates to feature screens
- ✅ Shows "Coming Soon" for disabled features
- ✅ Cancels logout on cancel button

**Key Features Tested:**
- Feature cards grid display
- Navigation to different screens
- Logout flow with confirmation
- MobX state integration

---

### 5. WeatherPredictionPage
**File:** `src/screens/weather/__tests__/WeatherPredictionPage.test.tsx`

**Test Cases:**
- ✅ Renders weather screen
- ✅ Displays search bar
- ✅ Shows current location button
- ✅ Fetches weather data from API
- ✅ Displays weather information
- ✅ Shows loading indicator
- ✅ Handles API errors
- ✅ Navigates back

**Key Features Tested:**
- OpenWeatherMap API integration
- Location services (Geolocation)
- Weather data display
- Forecast information
- Error handling

---

### 6. FramInfo (AgriNews Browser)
**File:** `src/screens/agriNews/__tests__/FramInfo.test.tsx`

**Test Cases:**
- ✅ Renders WebView component
- ✅ Displays correct URL
- ✅ Shows header with bilingual title
- ✅ Back button navigation
- ✅ Reload button functionality
- ✅ Forward/backward navigation buttons
- ✅ WebView state management

**Key Features Tested:**
- WebView integration
- Browser controls
- Navigation state
- Bilingual UI

---

### 7. AddSprayRecordScreen
**File:** `src/screens/recordFarm/__tests__/AddSprayRecordScreen.test.tsx`

**Test Cases:**
- ✅ Renders form with all fields
- ✅ Chemical name input
- ✅ Disease selection
- ✅ Quantity input
- ✅ Acres input
- ✅ Cost input
- ✅ Date field with current date
- ✅ Image upload section
- ✅ Remove uploaded image
- ✅ Form validation
- ✅ Submit button states (enabled/disabled)
- ✅ Navigation and save functionality

**Key Features Tested:**
- Form inputs and validation
- Image picker integration
- Select dropdowns
- Required field validation
- Data submission

---

### 8. SprayRecordsListScreen
**File:** `src/screens/recordFarm/__tests__/SprayRecordsListScreen.test.tsx`

**Test Cases:**
- ✅ Renders records list
- ✅ Displays record count and total cost
- ✅ Shows filter options
- ✅ Renders individual spray records
- ✅ Add new record button
- ✅ Navigation to add screen
- ✅ Back button navigation
- ✅ Image badges on records
- ✅ Record detail view
- ✅ Filter functionality
- ✅ Bilingual header
- ✅ Cost calculation

**Key Features Tested:**
- List rendering
- Filtering and sorting
- Cost calculation
- Navigation between screens
- Record data display

---

### 9. ProductScannerScreen
**File:** `src/screens/ai_chat/__tests__/ProductScannerScreen.test.tsx`

**Test Cases:**
- ✅ Renders scanner screen
- ✅ Search input functionality
- ✅ Product search and display
- ✅ Shows benefits in Kannada and English
- ✅ Displays dosage information
- ✅ Shows safety instructions
- ✅ Handles unknown products
- ✅ Case-insensitive search
- ✅ Timing information
- ✅ Spray weather conditions
- ✅ Multiple product support (NPK, Aliette, etc.)
- ✅ Navigation
- ✅ Bilingual content

**Key Features Tested:**
- Product database search
- Bilingual information display
- Search functionality
- Static data retrieval
- User guidance

---

## Mocked Dependencies

The following external dependencies are mocked in tests:

### Global Mocks
- `react-native-permissions` - Permission handling
- `@react-native-firebase/auth` - Firebase authentication
- `@react-native-community/geolocation` - Location services
- `react-native-webview` - WebView component
- `fetch` - API calls

### Custom Component Mocks
- Global components (Header, Card, Button, etc.) are mocked for isolation

## Testing Best Practices Used

1. **Isolation** - Each test is independent and doesn't affect others
2. **Mocking** - External dependencies are properly mocked
3. **Async Handling** - `waitFor` and `async/await` for asynchronous operations
4. **User Interactions** - Tests simulate real user actions with `fireEvent`
5. **Accessibility** - Tests use `testID` and semantic queries
6. **Coverage** - Multiple scenarios tested per component
7. **Bilingual Testing** - Both Kannada and English content tested

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test -- --coverage --watchAll=false
```

## Troubleshooting

### Common Issues

**Issue:** Tests timeout
**Solution:** Increase timeout in jest.config.js
```javascript
testTimeout: 10000
```

**Issue:** Mock not working
**Solution:** Clear jest cache
```bash
npm test -- --clearCache
```

**Issue:** Coverage not generated
**Solution:** Run with coverage flag
```bash
npm test -- --coverage --watchAll=false
```

## Test Maintenance

- Update tests when component props change
- Add new tests for new features
- Remove obsolete tests
- Keep mocks up to date with actual implementations
- Run tests before committing code

## Future Enhancements

- [ ] Integration tests for complete user flows
- [ ] E2E tests with Detox
- [ ] Snapshot testing for UI components
- [ ] Performance testing
- [ ] Accessibility testing with `@testing-library/react-native-a11y`

---

## Quick Reference

### Running Specific Test Suites

```bash
# Run only SplashScreen tests
npm test SplashScreen

# Run only login-related tests
npm test login

# Run only weather tests
npm test Weather

# Run all screen tests
npm test screens
```

### Watch Mode Commands

When in watch mode (`npm test -- --watch`):
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename
- Press `t` to filter by test name
- Press `q` to quit

---

**Last Updated:** December 2024
**Test Framework:** Jest + React Native Testing Library
**Total Test Cases:** 78
**Coverage Target:** 80%+
