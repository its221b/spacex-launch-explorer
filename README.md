# 🚀 SpaceX Launch Explorer

A modern, feature-rich mobile application built with React Native and Expo that allows users to explore SpaceX launches, view launchpad locations on interactive maps, and get real-time information about space missions.

## 📱 What is SpaceX Launch Explorer?

SpaceX Launch Explorer is a comprehensive mobile app that provides space enthusiasts with:

- **Real-time SpaceX launch data** from the official SpaceX API
- **Interactive maps** showing launchpad locations worldwide
- **Detailed launch information** including mission patches, dates, and status
- **Location-based features** to see your distance from launch sites
- **Professional UI/UX** with modern design patterns and smooth animations

## ✨ Key Features

### 🚀 Launch Management
- **Browse all SpaceX launches** with infinite scroll pagination
- **Search and filter** launches by name or mission details
- **Launch details** with comprehensive mission information
- **Mission patches** and high-quality images
- **Launch status tracking** (upcoming, successful, failed)

### 🗺️ Interactive Maps
- **Google Maps integration** for Android devices
- **Apple Maps integration** for iOS devices
- **Launchpad markers** with detailed information
- **User location tracking** with permission handling
- **Distance calculations** from your location to launchpads
- **Navigation integration** to open external map apps

### 🎨 Modern UI/UX
- **Professional design system** with consistent styling
- **Smooth animations** and transitions
- **Responsive layout** for all screen sizes
- **Dark/light theme support** (system-based)
- **Loading states** and error handling
- **Pull-to-refresh** functionality

### 🔧 Technical Features
- **TypeScript** for type safety
- **State management** with Zustand
- **Image optimization** and preloading
- **Offline support** with graceful error handling
- **Performance optimization** with React.memo and useMemo
- **Comprehensive error boundaries**

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Maps**: React Native Maps
- **HTTP Client**: Axios with interceptors
- **Location Services**: Expo Location
- **Code Quality**: ESLint + Prettier
- **Design System**: Centralized constants and styles

## 🏗️ Project Architecture

```
src/
├── api/           # API integration and types
│   ├── client.ts  # Axios configuration
│   ├── launches.ts # SpaceX API calls
│   └── types.ts   # API data models
├── components/    # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── LaunchItem.tsx
│   ├── MapViewComponent.tsx
│   └── SearchBar.tsx
├── hooks/         # Custom React hooks
│   ├── useImageOptimization.ts
│   └── useLocation.ts
├── navigation/    # Navigation configuration
│   ├── BottomTabs.tsx
│   └── RootStack.tsx
├── screens/       # Main app screens
│   ├── LaunchDetailScreen.tsx
│   ├── LaunchListScreen.tsx
│   └── MapScreen.tsx
├── store/         # Zustand state management
│   └── launcheStore.ts
└── utils/         # Utility functions
    ├── constants.ts
    ├── distanceCalculator.ts
    └── logger.ts
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **Mobile device** or **emulator** for testing

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/spacex-launch-explorer.git
cd spacex-launch-explorer
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
# Google Maps API Key (required for Android maps)
GOOGLE_MAPS_API_KEY_ANDROID=your_google_maps_api_key_here

# Note: iOS uses Apple Maps by default, no API key needed
```

**How to get Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps SDK for Android
4. Create credentials (API Key)
5. Restrict the key to Android apps only

### Step 4: Start Development Server

```bash
npm start
# or
npx expo start
```

### Step 5: Run on Device/Simulator

- **Mobile Device**: Scan QR code with Expo Go app
- **Android Emulator**: Press `a` in terminal
- **iOS Simulator**: Press `i` in terminal (macOS only)
- **Web Browser**: Press `w` in terminal

## 📱 How to Use the App

### 1. Launch List Screen
- **Browse launches**: Scroll through all SpaceX launches
- **Search**: Use the search bar to find specific missions
- **Pull to refresh**: Get the latest launch data
- **Tap launch**: View detailed information about a mission

### 2. Launch Detail Screen
- **Mission information**: Complete launch details and timeline
- **Mission patch**: High-quality mission patch images
- **Launchpad data**: Location and facility information
- **View on Map**: Navigate to map showing launchpad location
- **Wikipedia**: External links for additional information

### 3. Map Screen
- **Interactive map**: View launchpad locations worldwide
- **User location**: See your current position (requires permission)
- **Distance calculation**: Real-time distance to launchpads
- **Navigation**: Open external maps for directions
- **Marker information**: Tap markers for launchpad details

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Code quality
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting

# Type checking
npx tsc --noEmit      # Check TypeScript types
```

## 🎨 Design System

The app uses a centralized design system in `src/utils/constants.ts`:

### Colors
- **Primary**: `#007AFF` (iOS blue)
- **Secondary**: `#34C759` (success green)
- **Map Colors**: Launchpad (red), User Location (blue)

### Typography
- **Font Sizes**: 12px to 48px scale
- **Font Weights**: 400 (normal) to 700 (bold)
- **Line Heights**: 1.2 (tight) to 1.75 (relaxed)

### Spacing
- **Base Unit**: 4px
- **Scale**: xs(4px) to 4xl(48px)
- **Component-specific**: Card, button, and input spacing

## 🔐 Permissions & Privacy

### Location Permission
- **Purpose**: Calculate distance to launchpads and show user location on map
- **Permission Type**: `ACCESS_FINE_LOCATION` (Android), `NSLocationWhenInUseUsageDescription` (iOS)
- **User Control**: Can deny permission, app works without location
- **Data Usage**: Location data never leaves your device

### Network Permission
- **Purpose**: Fetch SpaceX launch data and mission information
- **Data**: Public SpaceX API data only
- **Privacy**: No personal data collection or tracking

## 🚨 Troubleshooting

### Common Issues

1. **Metro bundler errors**
   ```bash
   npx expo start --clear
   ```

2. **TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

3. **Map not loading on Android**
   - Verify Google Maps API key in `.env`
   - Check API key restrictions in Google Cloud Console
   - Ensure billing is enabled for Google Cloud project

4. **Location not working**
   - Grant location permission in device settings
   - Check if location services are enabled
   - Verify app has location permission

5. **Network errors**
   - Check internet connection
   - Verify SpaceX API is accessible
   - App includes automatic retry mechanisms

### Performance Issues

- **Slow scrolling**: Reduce batch size in `launcheStore.ts`
- **Memory issues**: Clear app cache or restart device
- **Map lag**: Check device performance and close other apps

## 📊 API Integration

### SpaceX API
- **Base URL**: `https://api.spacexdata.com`
- **Endpoints**: Launches, launchpads, and mission data
- **Rate Limiting**: Public API with reasonable limits
- **Data Format**: JSON with comprehensive mission information

### Error Handling
- **Network errors**: Automatic retry with exponential backoff
- **API errors**: User-friendly error messages
- **Offline support**: Graceful degradation when network unavailable

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the existing code patterns
4. **Test thoroughly** on both iOS and Android
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Use TypeScript for all new code
- Follow existing component patterns
- Maintain consistent styling using the design system
- Add proper error handling for new features
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SpaceX** for providing the public API and inspiring space exploration
- **Expo** for the excellent development platform and tools
- **React Native Community** for the amazing ecosystem and libraries
- **Open Source Contributors** for the tools and libraries that make this possible

## 📞 Support & Community

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Documentation**: Check the code comments and TypeScript types
- **Contributing**: See the contributing guidelines above

---

**Ready to explore space? 🚀 Download the app and start your journey through SpaceX launches!**

*Built with ❤️ for the space community*
