# Quick Start Guide - Enjen Mobile

## 🚀 Run the App

1. **Open Terminal** and navigate to the project:
   ```bash
   cd /Users/athxrvx/Documents/enjen-mobile
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open on your device**:
   - **iOS**: Scan QR code with Camera app, opens in Expo Go
   - **Android**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **Web Browser**: Press `w` in terminal

## 📱 What You'll See

### Bottom Navigation (3 tabs):
1. **My Tasks** - Task management with filters
2. **Scan** - Placeholder screen
3. **Profile** - Placeholder screen

### My Tasks Screen Features:
- **Header**: "My Tasks" title
- **Filter Chips**: All, Pending, In Progress, Completed
  - Default filter: Pending
  - Tap to filter tasks
- **Task Cards**: Display with:
  - Task type tag (colored)
  - Status badge (colored)
  - Main label (large text)
  - Sub label (secondary info)
  - Created date
  - Action button (Start/Open/View)

### Current Dummy Data:
- 1 STAGE task (Pending)
- 1 STAGE_QC task (Pending)
- 1 UNPACKING task (In Progress)
- 1 GRN_QC task (Pending)

## 🧪 Testing the App

### Try these interactions:
1. **Filter tasks**: Tap filter chips at the top
2. **View task details**: Tap on any task card (logs to console)
3. **Action buttons**: Tap Start/Open/View buttons (logs to console)
4. **Navigate tabs**: Tap bottom navigation buttons

### Check the console:
- Open Expo DevTools in browser
- Or check terminal output
- You'll see logs when tapping tasks

## 📂 Key Files to Understand

```
src/
├── types/Task.ts              # Task data model
├── data/dummyTasks.ts         # Mock task data
├── utils/taskUtils.ts         # Helper functions (labels, colors)
├── components/TaskCard.tsx    # Reusable task card component
├── screens/
│   └── MyTasksScreen.tsx      # Main screen with filters & list
├── navigation/
│   └── AppNavigator.tsx       # Bottom tabs + stacks setup
└── App.tsx                    # Entry point
```

## 🎨 UI Design

- **Large text**: Easy to read (20px+ for main content)
- **Touch-friendly**: Buttons 44x44px minimum
- **Simple colors**: Blue accent (#3B82F6), neutral grays
- **Clean layout**: Plenty of white space
- **No complex UI**: Optimized for low-literacy users

## 🔧 Troubleshooting

### App won't start?
```bash
# Clear cache and restart
npm start -- --clear
```

### Module not found errors?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Expo Go not connecting?
- Ensure phone and computer are on the same WiFi
- Try typing the URL manually in Expo Go
- Or use tunnel mode: `npm start -- --tunnel`

## 📝 Next Development Steps

1. **Add detail screens**: Create screens for each task type
2. **Wire navigation**: Navigate to detail screens on task tap
3. **Add forms**: Build QC inspection forms
4. **Implement scan**: Add camera/barcode scanning
5. **Photo capture**: Add image upload for QC
6. **Offline mode**: Cache data locally
7. **Backend integration**: Connect to API

## 💡 Tips

- Keep checking console logs for debugging
- Use React DevTools for component inspection
- Test on a real device for accurate touch experience
- Use simple language in all UI text
- Keep animations minimal or none for performance

---

**Built with ❤️ for factory workers**

