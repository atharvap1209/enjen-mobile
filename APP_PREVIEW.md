# 📱 Enjen Mobile - App Preview

## Visual Structure Preview

```
┌─────────────────────────────────┐
│        My Tasks                 │  ← Header (28px, bold)
├─────────────────────────────────┤
│ [All] [Pending] [In Progress]   │  ← Filter Chips (active: blue)
│ [Completed]                      │
├─────────────────────────────────┤
│                                  │
│  ┌───────────────────────────┐  │
│  │ [Stage] ......... [Pending] │  │  ← Task Card
│  │                             │  │
│  │ Stage: Slitting             │  │  ← Main Label (20px)
│  │ WO-123 | Machine-1          │  │  ← Sub Label (16px)
│  │ Created: 2025-11-17...      │  │  ← Created (12px)
│  │                             │  │
│  │              [Start] ───────┤  │  ← Action Button
│  └───────────────────────────┘  │
│                                  │
│  ┌───────────────────────────┐  │
│  │ [Stage QC] .... [Pending]  │  │
│  │                             │  │
│  │ Stage QC: Cutting           │  │
│  │ WO-124 | Machine-2          │  │
│  │ Created: 2025-11-17...      │  │
│  │                             │  │
│  │              [Start] ───────┤  │
│  └───────────────────────────┘  │
│                                  │
│  ┌───────────────────────────┐  │
│  │ [Unpacking] [In Progress]  │  │
│  │                             │  │
│  │ Unpacking: Coil CR-456      │  │
│  │ GRN-789                     │  │
│  │ Created: 2025-11-17...      │  │
│  │                             │  │
│  │              [Open] ────────┤  │
│  └───────────────────────────┘  │
│                                  │
│  ┌───────────────────────────┐  │
│  │ [GRN QC] ....... [Pending] │  │
│  │                             │  │
│  │ GRN Quality Check           │  │
│  │ GRN-790 | 5 Coils           │  │
│  │ Created: 2025-11-17...      │  │
│  │                             │  │
│  │              [Start] ───────┤  │
│  └───────────────────────────┘  │
│                                  │
├─────────────────────────────────┤
│  [My Tasks]  [Scan]  [Profile]  │  ← Bottom Tabs
└─────────────────────────────────┘
```

## Component Breakdown

### 🎨 **TaskCard Component**

Each card contains:

```
┌─────────────────────────────────┐
│ Row 1: [Type Tag] .... [Status] │  ← Left & Right aligned
│                                  │
│ Row 2: Main Label Text           │  ← Large, bold (20px)
│                                  │
│ Row 3: Sub Label Text            │  ← Medium (16px)
│                                  │
│ Row 4: Created: timestamp        │  ← Small, gray (12px)
│                                  │
│ Row 5:         [Action Button]   │  ← Right aligned, blue
└─────────────────────────────────┘
```

### 🏷️ **Task Type Tags**

Visual representation of task types with colors:

- 🔵 **Stage** - Blue background, white text
- 🟣 **Stage QC** - Purple background, white text
- 🩷 **GRN QC** - Pink background, white text
- 🟠 **Unpacking** - Amber background, white text
- 🟢 **Putaway** - Green background, white text
- 🟦 **Packing QC** - Indigo background, white text
- 🔴 **Pre-Dispatch QC** - Red background, white text

### 📊 **Status Badges**

Visual representation of status with colors:

- 🟠 **Pending** - Amber background, white text
- 🔵 **In Progress** - Blue background, white text
- 🟢 **Completed** - Green background, white text
- 🔴 **Hold** - Red background, white text

### 🎯 **Action Buttons**

Dynamic button text based on status:

- **Pending** → Shows "Start" button
- **In Progress** → Shows "Open" button
- **Completed** → Shows "View" button
- **Hold** → Shows "Open" button

## Screen Flow

```
App Start
   ↓
┌──────────────────────────────┐
│   Bottom Tab Navigator       │
│                              │
│  ┌────────────────────────┐ │
│  │    My Tasks Stack      │ │
│  │  ┌──────────────────┐ │ │
│  │  │ MyTasksScreen    │ │ │  ← You are here (default)
│  │  │ - Header         │ │ │
│  │  │ - Filters        │ │ │
│  │  │ - Task List      │ │ │
│  │  └──────────────────┘ │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │    Scan Stack          │ │
│  │  ┌──────────────────┐ │ │
│  │  │ ScanScreen       │ │ │  ← Placeholder
│  │  │ (Coming Soon)    │ │ │
│  │  └──────────────────┘ │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │    Profile Stack       │ │
│  │  ┌──────────────────┐ │ │
│  │  │ ProfileScreen    │ │ │  ← Placeholder
│  │  │ (Coming Soon)    │ │ │
│  │  └──────────────────┘ │ │
│  └────────────────────────┘ │
└──────────────────────────────┘
```

## User Interactions

### Filter Tasks

```
User taps "All"
   ↓
Shows all 4 tasks
   ↓
Chip turns blue (active)
```

```
User taps "Pending"
   ↓
Filters to 3 pending tasks
   ↓
Chip turns blue (active)
```

```
User taps "In Progress"
   ↓
Filters to 1 in-progress task
   ↓
Chip turns blue (active)
```

```
User taps "Completed"
   ↓
Shows empty state
   ↓
"No tasks found" message
```

### Task Interaction

```
User taps task card
   ↓
Console logs: "Task pressed: {task object}"
   ↓
(In future: Navigate to detail screen)
```

```
User taps action button
   ↓
Console logs: "Task pressed: {task object}"
   ↓
(In future: Start/open/view task)
```

## Data Flow

```
DUMMY_TASKS (dummyTasks.ts)
   ↓
MyTasksScreen state (selectedFilter)
   ↓
Filter logic (filteredTasks)
   ↓
FlatList rendering
   ↓
TaskCard components
   ↓
User interaction
   ↓
Console log
```

## Sample Data

### Task 1 - STAGE (Pending)
```json
{
  "id": "task-1",
  "type": "STAGE",
  "status": "PENDING",
  "mainLabel": "Stage: Slitting",
  "subLabel": "WO-123 | Machine-1",
  "primaryId": "STAGE-001",
  "createdAt": "2025-11-17T08:00:00Z",
  "priority": "NORMAL"
}
```

### Task 2 - STAGE_QC (Pending, Urgent)
```json
{
  "id": "task-2",
  "type": "STAGE_QC",
  "status": "PENDING",
  "mainLabel": "Stage QC: Cutting",
  "subLabel": "WO-124 | Machine-2",
  "primaryId": "STAGE-002",
  "createdAt": "2025-11-17T09:15:00Z",
  "priority": "URGENT"
}
```

### Task 3 - UNPACKING (In Progress)
```json
{
  "id": "task-3",
  "type": "UNPACKING",
  "status": "IN_PROGRESS",
  "mainLabel": "Unpacking: Coil CR-456",
  "subLabel": "GRN-789",
  "primaryId": "COIL-CR-456",
  "createdAt": "2025-11-17T07:30:00Z",
  "updatedAt": "2025-11-17T10:00:00Z",
  "priority": "NORMAL"
}
```

### Task 4 - GRN_QC (Pending, Urgent)
```json
{
  "id": "task-4",
  "type": "GRN_QC",
  "status": "PENDING",
  "mainLabel": "GRN Quality Check",
  "subLabel": "GRN-790 | 5 Coils",
  "primaryId": "GRN-790",
  "createdAt": "2025-11-17T10:30:00Z",
  "priority": "URGENT"
}
```

## Typography Scale

```
Header Title:    28px  (bold, #111827)
Main Label:      20px  (bold, #111827)
Sub Label:       16px  (normal, #6B7280)
Button Text:     16px  (bold, #FFFFFF)
Type/Status Tag: 14px  (semibold, #FFFFFF)
Filter Chip:     16px  (semibold, varies)
Created Date:    12px  (normal, #9CA3AF)
```

## Spacing Scale

```
Card padding:     16px
Card margin:      8px horizontal, 8px vertical
Card border:      8px radius
Button padding:   12px vertical, 24px horizontal
Button radius:    6px
Tag padding:      6px vertical, 12px horizontal
Tag radius:       4px
Filter padding:   8px vertical, 16px horizontal
Filter radius:    20px (pill shape)
```

## Touch Targets

All interactive elements meet minimum 44x44px requirement:

- ✅ Task Card: Full width × 200px+ height
- ✅ Action Button: 100px × 44px minimum
- ✅ Filter Chip: 80px+ × 44px
- ✅ Tab Bar Item: 120px × 60px

## Accessibility Features

- ✅ Large, readable text (minimum 14px)
- ✅ High contrast colors (WCAG AA compliant)
- ✅ Touch-friendly tap targets (44x44px+)
- ✅ Clear visual hierarchy
- ✅ Simple English language
- ✅ Color + text for status (not color alone)
- ✅ Consistent spacing and alignment

---

## 🎯 Design for Low Literacy Users

1. **Visual Cues**: Colors indicate type/status
2. **Simple Words**: "Start", "Open", "View" instead of complex terms
3. **Icons Ready**: Structure supports adding icons later
4. **Clear Hierarchy**: Important info is larger and bolder
5. **Consistent Layout**: Same pattern for all cards
6. **Immediate Feedback**: Touch states on all buttons

---

## 🚀 Ready to Run!

```bash
cd /Users/athxrvx/Documents/enjen-mobile
npm start
```

Then scan the QR code with Expo Go or press `i` for iOS simulator!

