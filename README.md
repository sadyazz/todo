# todo app

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

a simple React Native todo application with offline storage and push notifications.

## What it does

- Create, edit, and manage todos
- Organize todos with custom categories and colors
- Set due dates and priority levels
- Schedule reminder notifications
- Mark todos as completed
- Dark and light theme support

## Technologies used

- React Native with Expo
- WatermelonDB for offline storage
- TypeScript
- Expo Notifications for push notifications
- SQLite database

## Development Tools

- **Linting**: ESLint for code quality (`yarn lint`)
- **Formatting**: Prettier for consistent style (`yarn format`)
- **Testing**: Jest for unit tests (`yarn test`)
- **CI/CD**: GitHub Actions automatically checks code quality and runs tests on every push/PR

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository

```bash
git clone https://github.com/sadyazz/todo.git
cd todo
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npx expo start
```

4. Run on iOS simulator

```bash
npx expo run:ios
```

5. Run on Android emulator

```bash
npx expo run:android
```

## Contributing

1. **Open an issue** to discuss your idea first
2. **Fork the repository** if you want to contribute
3. **Clone your fork** locally:
   ```bash
   git clone https://github.com/sadyazz/todo.git
   cd todo
   ```
4. **Install dependencies**:
   ```bash
   yarn install
   ```
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
6. **Make your changes** and ensure they work:
   ```bash
   yarn test        # Run tests
   yarn lint        # Check code quality
   yarn format      # Format code
   ```
7. **Create a Pull Request** with a clear description

### Code Quality Requirements

- **ESLint**: Code must pass linting (`yarn lint`)
- **Prettier**: Code must be formatted (`yarn format`)
- **Tests**: All tests must pass (`yarn test`)
- **TypeScript**: No type errors
