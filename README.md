# HexaMerge Challenge
Created by Rork

A challenging puzzle game built with React Native and Expo where players merge hexagonal tiles to reach higher numbers.

## Game Description

HexaMerge Challenge is a strategic puzzle game where players navigate and merge hexagonal tiles on a grid. The goal is to combine tiles of the same value to create higher-value tiles, manage the board efficiently, and achieve the highest score possible.

## Features

- Hexagonal grid-based gameplay
- Merge tiles with the same values
- Multiple difficulty levels
- Score tracking
- Intuitive touch controls
- Responsive design for various device sizes

## How to Run the Project

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or newer)
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd applaa-HexaMerge-challenge
   ```

2. Install dependencies:
   ```
   bun install
   ```

### Running the App

To start the development server with Expo:

```
bun start
```

This will start the Expo development server and provide you with options to run the app on:
- Android Emulator/Device
- iOS Simulator/Device (requires macOS)
- Web Browser

For web development:

```
bun start-web
```

## How to Build an APK

To build an Android APK file:

1. Make sure you have set up your Expo account:
   ```
   npx expo login
   ```

2. Install EAS CLI if you haven't already:
   ```
   npm install -g eas-cli
   ```

3. Configure your build:
   ```
   npx expo install expo-dev-client
   npx eas build:configure
   ```

4. Create a build profile for APK in eas.json:
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

5. Start the build process:
   ```
   npx eas build -p android --profile preview
   ```

6. Follow the prompts and wait for the build to complete. Once finished, you'll receive a download link for your APK.

## Project Structure

- `/app` - Main application screens and navigation
- `/assets` - Images and other static assets
- `/components` - Reusable UI components
- `/constants` - Game constants and theme colors
- `/store` - State management using Zustand
- `/types` - TypeScript type definitions
- `/utils` - Utility functions and game logic

## Technologies Used

- React Native
- Expo
- TypeScript
- Zustand (State Management)
- NativeWind (Styling)
- Expo Router (Navigation)
