# 🚀 SpaceX Launch Explorer

A polished SpaceX Launch Explorer mobile app built with React Native, Expo, and TypeScript. This app consumes the SpaceX public API and implements a maps-first native experience for space enthusiasts.

## ✨ Features

- **Launch List**: Browse all SpaceX launches with infinite scroll and search
- **Launch Details**: View comprehensive launch information including mission patches, details, and launchpad data
- **Interactive Maps**: See launchpad locations with distance calculations from your current position
- **Real-time Data**: Live data from SpaceX API with automatic retry mechanisms
- **Modern UI/UX**: Clean, consistent design system with professional styling
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Offline Support**: Graceful handling of network issues with retry functionality

## 🗺️ Map Implementation and Libraries Used

### **Core Mapping Libraries**
- **React Native Maps**: Primary mapping component with Google Maps provider
- **Expo Location**: Device location services and permission handling
- **Google Maps API**: Native map rendering and geocoding services

### **Map Features Implemented**
- **Launchpad Markers**: Red pins showing SpaceX launch site locations
- **User Location**: Blue pin displaying current device position
- **Distance Calculations**: Real-time distance from user to launchpad using Haversine formula
- **Interactive Navigation**: Tap markers for launchpad information
- **Map Controls**: Built-in zoom, pan, and compass functionality

### **Technical Implementation**
The MapViewComponent uses Google Maps provider with comprehensive configuration including user location display, compass, scale, buildings, and indoor mapping. The component automatically fits the viewport to show both the user's location and selected launchpad, with optimized update intervals for smooth performance.

### **Map Performance Optimizations**
- **Marker Clustering**: Efficient rendering of multiple launchpad locations
- **Viewport Optimization**: Automatic fitting to show both user and launchpad locations
- **Memory Management**: Proper cleanup of map resources and event listeners

## 🔐 Permission Flows and Handling

### **Location Permission Flow**
1. **Initial Request**: App requests location permission on first map access
2. **Permission Types**:
   - `ACCESS_FINE_LOCATION` (Android)
   - `NSLocationWhenInUseUsageDescription` (iOS)
3. **User Choices**: Allow, Deny, or Don't Ask Again

### **Permission Handling Implementation**
The app implements a comprehensive permission flow that requests location access with user-friendly messaging. When permission is granted, it acquires the current location with high accuracy and a 15-second timeout. If permission is denied, it shows a clear UI explaining why location is needed and provides an "Enable Location" button that directs users to device settings.

### **Permission States and UX**
- **Loading State**: Spinner while acquiring location
- **Permission Denied**: Clear card explaining why location is needed
- **Enable Location Button**: Direct link to device settings
- **Graceful Fallback**: App works without location (shows launchpad only)

### **Error Handling for Permissions**
- **Timeout Handling**: 15-second timeout for location acquisition
- **Accuracy Fallback**: Falls back to lower accuracy if high accuracy fails
- **Network Dependency**: Handles cases where location services are unavailable

## 📱 App Screenshots

### **Launch List Screen**
![Launch List](assets/1.jpg)
- **Infinite Scroll**: Smooth pagination with 10 launches per page
- **Search Bar**: Real-time filtering with debounced input
- **Status Badges**: Color-coded launch status indicators
- **Mission Patches**: Optimized image loading with placeholders
- **Pull-to-Refresh**: Latest data updates

### **Launch Detail Screen**
![Launch Details](assets/2.jpg)
- **Mission Information**: Complete launch details and timeline
- **Launchpad Data**: Location, name, and full details
- **Mission Patch**: High-quality mission patch images
- **View on Map Button**: Direct navigation to map with launchpad location
- **Wikipedia Integration**: External links for additional information

### **Map Screen**
- **Interactive Map**: Google Maps integration with launchpad markers
- **User Location**: Current position with distance calculations
- **Launchpad Markers**: Red pins with launch site information
- **Navigation Options**: External maps integration (Google Maps/Apple Maps)
- **Permission States**: Clear UI for location permission handling

### **Key UI Elements**
- **Safe Area Handling**: Content respects device notches and system UI
- **Professional Styling**: Consistent design system with proper spacing
- **Loading States**: Smooth transitions and loading indicators
- **Error Boundaries**: Graceful error handling with retry options
- **Responsive Design**: Optimized for various screen sizes

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand
- **Maps**: React Native Maps + Google Maps API
- **HTTP Client**: Axios
- **Location Services**: Expo Location
- **Code Quality**: ESLint + Prettier
- **Design System**: Centralized constants for colors, typography, spacing, and shadows

## 🏗️ Architecture

### Project Structure
```
src/
├── api/           # API integration and types
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── navigation/    # Navigation configuration
├── screens/       # Main app screens
├── store/         # Zustand state management
└── utils/         # Utility functions and constants
```

### Key Components
- **ErrorBoundary**: Catches and handles JavaScript errors gracefully
- **LaunchItem**: Displays individual launch information with image optimization
- **MapViewComponent**: Wrapper for React Native Maps with Google provider
- **SearchBar**: Search functionality with consistent styling and clear button
- **ErrorState**: User-friendly error display with retry options

### State Management
- **Zustand Store**: Manages launches, launchpads, and app state
- **Automatic Retry**: Built-in retry mechanism for failed API calls
- **Pagination**: Efficient data loading with infinite scroll
- **Image Optimization**: Background preloading and caching strategies

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Google Maps API Key (for map functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/its221b/spacex-launch-explorer.git
   cd spacex-launch-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your Google Maps API keys
   GOOGLE_MAPS_API_KEY_ANDROID=your_android_key_here
   GOOGLE_MAPS_API_KEY_IOS=your_ios_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

### Development Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔧 Development

### Code Quality
- **ESLint**: Code linting with React Native and TypeScript rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Full type safety throughout the application

### Design System
The app uses a centralized design system located in `src/utils/constants.ts`:

- **Colors**: Primary, secondary, status, and neutral color palettes
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (4px base unit)
- **Shadows**: Platform-specific shadow configurations
- **Border Radius**: Standardized border radius values

### Adding New Features
1. **Components**: Add to `src/components/` with consistent styling
2. **Screens**: Add to `src/screens/` following existing patterns
3. **Utilities**: Add to `src/utils/` with proper TypeScript types
4. **Constants**: Update `src/utils/constants.ts` for new design tokens

### API Integration
- **Base URL**: SpaceX public API
- **Endpoints**: Launches, launch details, and launchpad information
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Retry Logic**: Automatic retry for network failures

## 📊 Performance Features

- **Infinite Scroll**: Efficient data loading for large lists
- **Image Optimization**: Proper image handling with placeholders and preloading
- **Memoization**: React.memo and useMemo for performance optimization
- **Lazy Loading**: Components loaded only when needed
- **FlatList Optimization**: Reduced batch sizes and memory management

## 🧪 Testing

### Manual Testing
- Test on both iOS and Android devices/simulators
- Verify error handling with network issues
- Test location permissions and map functionality
- Verify search and filtering functionality
- Test image loading and optimization features

### Code Quality Checks
```bash
# Run all quality checks
npm run lint && npx tsc --noEmit && npm run format:check
```

## 🔍 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **TypeScript errors**: Run `npx tsc --noEmit` to check types
3. **Formatting issues**: Run `npm run format` to fix Prettier issues
4. **Linting errors**: Run `npm run lint:fix` to auto-fix issues
5. **Map not loading**: Verify Google Maps API key in `.env` file

### Network Issues
- The app includes automatic retry mechanisms
- Check SpaceX API status if experiencing persistent issues
- Verify network connectivity and permissions

## 📚 API Documentation

### SpaceX API Endpoints
- **Launches**: `POST /v5/launches/query` - List launches with pagination
- **Launch Details**: `GET /v5/launches/{id}` - Specific launch information
- **Launchpads**: `GET /v4/launchpads/{id}` - Launchpad details

### Data Models
- **Launch**: Mission details, dates, status, and links
- **Launchpad**: Location information and details
- **LaunchLinks**: Mission patches and Wikipedia links

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code patterns and architecture
- Use TypeScript for all new code
- Maintain consistent styling using the design system
- Add proper error handling for new features
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SpaceX**: For providing the public API
- **Expo**: For the excellent development platform
- **React Native Community**: For the amazing ecosystem
- **Open Source Contributors**: For the tools and libraries used

## 📞 Support

For development questions or issues:
- Check the troubleshooting section above
- Review the code structure and patterns
- Ensure all dependencies are properly installed
- Verify TypeScript and ESLint configurations

---

**Happy coding! 🚀✨**
