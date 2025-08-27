# React Comments Component

A React comments component with nested comments, persistence, and real-time synchronization across tabs.

## Features

✅ **Display comments list** - Shows all comments in a clean, organised layout  
✅ **Add new comments** - Users can enter text and add comments with a single click  
✅ **Delete comments** - Remove unwanted comments from the list  
✅ **Nested comments** - Reply to comments
✅ **Persistent storage** - Comments are saved using IndexedDB and persist across app restarts  
✅ **Cross-tab synchronization** - Changes are automatically synced across multiple browser tabs in real-time  

## Technical Implementation

### Core Technologies
- **React 19** with TypeScript
- **IndexedDB** for local persistence (no external database required)
- **BroadcastChannel API** for cross-tab communication
- **UUID** for unique comment identification
- **Vite** for development and building

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run tests
```bash
npm run test
```

## Next?

Potential improvements for production use:
- Comments Editing
- Collapsing of nested comments and loading additional comments
- Allow only one level of reply to simplify the thread and improve readability
- Associate comments with a user identifier
- Storybooks to showcase components usage.
- CI/CD using github action
- Filter or flag inappropriate language and offensive content
