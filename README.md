# Enjen Mobile - Factory Worker App

A simple mobile app for factory workers in India with low literacy. Built with React Native and Expo.

## Features

- **My Tasks**: View and manage production tasks with simple filters
- **Scan**: QR/Barcode scanning (coming soon)
- **Profile**: User profile and settings (coming soon)

## Tech Stack

- **Expo** (latest)
- **React Native**
- **TypeScript**
- **React Navigation** (Bottom Tabs + Stack)

## Project Structure

```
src/
├── components/       # Reusable components
│   └── TaskCard.tsx
├── data/            # Mock data
│   └── dummyTasks.ts
├── navigation/      # Navigation setup
│   └── AppNavigator.tsx
├── screens/         # Screen components
│   ├── MyTasksScreen.tsx
│   ├── ScanScreen.tsx
│   └── ProfileScreen.tsx
├── types/           # TypeScript types
│   └── Task.ts
└── utils/           # Helper functions
    └── taskUtils.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app on your mobile device (iOS or Android)

### Installation

1. Navigate to the project directory:
```bash
cd enjen-mobile
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

Then:
- Scan the QR code with Expo Go (Android) or Camera app (iOS)
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Press `w` to open in web browser

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Task Types

The app supports the following task types:

- **STAGE**: Production stage execution
- **STAGE_QC**: In-process QC for a stage
- **GRN_QC**: GRN quality check
- **UNPACKING**: Unpacking task
- **PUTAWAY**: Bin assignment / putaway
- **PACKING_QC**: Post-packing QC
- **PREDISPATCH_QC**: Pre-dispatch QC

## Task Statuses

- **PENDING**: Task not started
- **IN_PROGRESS**: Task currently being worked on
- **COMPLETED**: Task finished
- **HOLD**: Task on hold

## Design Principles

- Large, readable text for low-literacy users
- Simple, clean UI with minimal colors
- Touch-friendly buttons (minimum 44x44px)
- Clear visual hierarchy
- Simple English language

## Next Steps

- [ ] Add task detail screens for each task type
- [ ] Implement QR/Barcode scanning
- [ ] Add photo capture functionality
- [ ] Implement offline data sync
- [ ] Add authentication
- [ ] Connect to backend API

