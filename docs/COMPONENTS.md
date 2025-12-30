# AgriHelper Custom Components

A comprehensive collection of reusable TypeScript React Native components for the AgriHelper application.

## Table of Contents

- [Basic Components](#basic-components)
- [Form Components](#form-components)
- [Navigation Components](#navigation-components)
- [Display Components](#display-components)
- [Specialized Components](#specialized-components)

---

## Basic Components

### BilingualText
Display text in both Kannada and English with customizable separators.

```typescript
import { BilingualText } from '@/components';

<BilingualText
  kannada="ನಮಸ್ಕಾರ"
  english="Hello"
  separator=" | "
/>
```

### Button
Versatile button with variants, sizes, and loading states.

```typescript
import { Button } from '@/components';

<Button
  title="Submit"
  onPress={() => {}}
  variant="primary" // primary | secondary | danger
  size="medium" // small | medium | large
  loading={false}
/>
```

### Card
Container component with shadow and rounded corners.

```typescript
import { Card } from '@/components';

<Card>
  <Text>Card content</Text>
</Card>
```

### InfoBox
Informational message box with variants.

```typescript
import { InfoBox } from '@/components';

<InfoBox
  message="Operation successful"
  variant="success" // info | warning | success | error
  icon="✓"
/>
```

---

## Form Components

### CustomInput
Standard text input with label and error handling.

```typescript
import { CustomInput } from '@/components';

<CustomInput
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
  error={error}
/>
```

### PhoneInput
Phone number input with country code.

```typescript
import { PhoneInput } from '@/components';

<PhoneInput
  label="Phone Number"
  countryCode="🇮🇳 +91"
  value={phone}
  onChangeText={setPhone}
/>
```

### OTPInput
OTP/verification code input.

```typescript
import { OTPInput } from '@/components';

<OTPInput
  label="Enter OTP"
  length={6}
  value={otp}
  onChangeText={setOtp}
/>
```

### Select
Dropdown selector with modal picker.

```typescript
import { Select } from '@/components';

<Select
  label="Select Crop"
  placeholder="Choose a crop"
  options={[
    { label: 'Rice', value: 'rice' },
    { label: 'Wheat', value: 'wheat' }
  ]}
  value={selectedCrop}
  onChange={setSelectedCrop}
/>
```

### Checkbox
Checkbox with label support.

```typescript
import { Checkbox } from '@/components';

<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label="I agree to terms"
/>
```

### Radio & RadioGroup
Radio buttons for single selection.

```typescript
import { Radio, RadioGroup } from '@/components';

<RadioGroup
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### Switch
Toggle switch component.

```typescript
import { Switch } from '@/components';

<Switch
  value={enabled}
  onValueChange={setEnabled}
  label="Enable notifications"
/>
```

### SearchBar
Search input with clear and search actions.

```typescript
import { SearchBar } from '@/components';

<SearchBar
  value={query}
  onChangeText={setQuery}
  placeholder="Search..."
  onSearch={handleSearch}
  showSearchButton={true}
/>
```

### FilterBar
Horizontal filter chips.

```typescript
import { FilterBar } from '@/components';

<FilterBar
  filters={[
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' }
  ]}
  selectedFilters={selected}
  onFilterChange={handleFilterChange}
/>
```

---

## Navigation Components

### Header
App header with title and action buttons.

```typescript
import { Header } from '@/components';

<Header
  title="Home"
  subtitle="Welcome back"
  leftIcon="←"
  rightIcon="⋮"
  onLeftPress={goBack}
  onRightPress={openMenu}
/>
```

### TabBar
Tab navigation component.

```typescript
import { TabBar } from '@/components';

<TabBar
  tabs={[
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'news', label: 'News', icon: '📰', badge: 3 }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills" // default | pills | underline
/>
```

---

## Display Components

### Avatar & AvatarGroup
User avatars with initials fallback.

```typescript
import { Avatar, AvatarGroup } from '@/components';

<Avatar
  name="John Doe"
  size="large" // small | medium | large | xlarge
  variant="circular" // circular | rounded | square
/>

<AvatarGroup
  avatars={[
    { name: 'User 1' },
    { name: 'User 2' }
  ]}
  max={3}
/>
```

### Badge
Status and label badges.

```typescript
import { Badge, NotificationBadge, StatusBadge } from '@/components';

<Badge
  label="New"
  variant="primary"
  size="medium"
/>

<NotificationBadge count={5} max={99} />

<StatusBadge status="online" />
```

### ListItem & SectionHeader
List item components.

```typescript
import { ListItem, SectionHeader } from '@/components';

<SectionHeader
  title="Recent Activity"
  action="See All"
  onActionPress={handleSeeAll}
/>

<ListItem
  title="Item Title"
  subtitle="Item description"
  leftIcon="📄"
  rightIcon="→"
  onPress={handlePress}
/>
```

### Divider
Horizontal or vertical dividers.

```typescript
import { Divider, DividerWithText } from '@/components';

<Divider orientation="horizontal" spacing={16} />

<DividerWithText text="OR" />
```

### Loading & Skeleton
Loading states.

```typescript
import { Loading, Skeleton } from '@/components';

<Loading message="Loading..." fullScreen />

<Skeleton width="100%" height={20} />
```

---

## Specialized Components

### Modal & ConfirmDialog
Modal dialogs.

```typescript
import { Modal, ConfirmDialog } from '@/components';

<Modal
  visible={visible}
  onClose={handleClose}
  title="Modal Title"
>
  <Text>Modal content</Text>
</Modal>

<ConfirmDialog
  visible={visible}
  title="Confirm Action"
  message="Are you sure?"
  confirmText="Yes"
  cancelText="No"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  variant="danger"
/>
```

### Toast
Toast notifications.

```typescript
import { Toast } from '@/components';

<Toast
  visible={showToast}
  message="Success!"
  type="success" // success | error | warning | info
  duration={3000}
  position="bottom" // top | bottom
  onHide={handleHide}
/>
```

### WeatherCard & WeatherForecast
Weather display components.

```typescript
import { WeatherCard, WeatherForecast } from '@/components';

<WeatherCard
  data={{
    temperature: 28,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    location: 'Bangalore'
  }}
  unit="celsius"
/>

<WeatherForecast
  forecast={[
    { day: 'Mon', temperature: 28, condition: 'Sunny' },
    { day: 'Tue', temperature: 26, condition: 'Cloudy' }
  ]}
/>
```

### NewsCard
News article cards.

```typescript
import { NewsCard, CompactNewsCard } from '@/components';

<NewsCard
  news={{
    id: '1',
    title: 'Article Title',
    description: 'Article description...',
    source: 'AgriNews',
    date: '2 hours ago',
    category: 'Farming'
  }}
  onPress={handlePress}
/>

<CompactNewsCard
  news={newsItem}
  onPress={handlePress}
/>
```

---

## Usage Tips

1. **Import from index**: All components can be imported from `@/components`:
   ```typescript
   import { Button, Card, Input } from '@/components';
   ```

2. **TypeScript Support**: All components are fully typed with TypeScript interfaces.

3. **Customization**: Most components accept `style` props for custom styling.

4. **Variants**: Many components support variants for different visual styles.

5. **Accessibility**: Components include proper accessibility features where applicable.

---

## Color Scheme

The components use a consistent color palette:
- Primary: `#8b5cf6` (Purple)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Danger: `#ef4444` (Red)
- Info: `#3b82f6` (Blue)
- Neutral: Gray scale from `#f9fafb` to `#1f2937`
