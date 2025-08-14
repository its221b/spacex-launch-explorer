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

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack)
- **State Management**: Zustand
- **Maps**: React Native Maps
- **HTTP Client**: Axios
- **Location Services**: Expo Location
- **Code Quality**: ESLint + Prettier
- **Design System**: Centralized constants for colors, typography, spacing, and shadows

## 📱 Screenshots

### Launch List Screen
- Displays all SpaceX launches with infinite scroll
- Search functionality to filter launches
- Pull-to-refresh for latest data
- Status badges (Upcoming, Success, Failed)

### Launch Detail Screen
- Comprehensive launch information
- Mission patch images
- Launchpad details and location
- Wikipedia integration
- Navigation to map view

### Map Screen
- Interactive map showing launchpad locations
- User's current location
- Distance calculations
- External maps integration (Apple Maps/Google Maps)

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
- **LaunchItem**: Displays individual launch information
- **MapViewComponent**: Wrapper for React Native Maps
- **SearchBar**: Search functionality with consistent styling
- **ErrorState**: User-friendly error display with retry options

### State Management
- **Zustand Store**: Manages launches, launchpads, and app state
- **Automatic Retry**: Built-in retry mechanism for failed API calls
- **Pagination**: Efficient data loading with infinite scroll

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spacex-launch-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
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
- **Image Optimization**: Proper image handling with placeholders
- **Memoization**: React.memo and useMemo for performance optimization
- **Lazy Loading**: Components loaded only when needed

## 🧪 Testing

### Manual Testing
- Test on both iOS and Android devices/simulators
- Verify error handling with network issues
- Test location permissions and map functionality
- Verify search and filtering functionality

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

### Network Issues
- The app includes automatic retry mechanisms
- Check SpaceX API status if experiencing persistent issues
- Verify network connectivity and permissions

## 📚 API Documentation

### SpaceX API Endpoints
- **Launches**: `GET /v5/launches` - List all launches
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
