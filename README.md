<div align="center">

<img src="./public/images/lofivalleyengine_logo_.png" alt="Lofi Valley Engine Logo" width="400"/>

**English** | [Español](./README.es.md)

> A cozy farming game engine built for the web with a headless architecture

</div>

**Lofi Valley** is a browser-based farming simulation game inspired by Stardew Valley, Animal Crossing, and Fae Farm. Built with performance and player freedom in mind, it features a deterministic headless game engine that separates simulation logic from rendering, allowing for smooth gameplay at variable speeds (x1, x2, x4, x10) without breaking game mechanics.

## ✨ Features

- 🎮 **Headless Game Engine Architecture** - Deterministic simulation independent of rendering
- ⏱️ **Variable Time Control** - Play at your own pace with adjustable game speed
- 🌱 **Farming System** - Plant, water, and harvest crops with realistic growth mechanics
- 🛠️ **Farm Laboratory** - Visual editor for designing and testing farm layouts
- 🌍 **Internationalization** - Full i18n support (English & Spanish)
- 🎨 **Pixel Art Aesthetic** - Charming retro-style graphics
- 🖥️ **Cross-Platform** - Runs in browser and as desktop app (via Tauri)

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

1. **[Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)** (Windows only)
2. **[Rust](https://rust-lang.org/tools/install/)** - Required for Tauri
3. **[Node.js 24.10+](https://nodejs.org/download)**

For detailed prerequisites, see [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/).

### Installation

```bash
# Clone the repository
git clone https://github.com/Leoocast/lofi-valley-engine.git
cd lofi-valley-engine

# Install dependencies
npm install

# Run in development mode (web)
npm run dev

# Run as desktop app (Tauri)
npm run tauri dev
```

## 🎯 Game Modes

### Farm Laboratory

A visual design tool for creating and testing farm layouts. Features include:

- Terrain painting (grass, dirt, water)
- Object placement (trees, rocks, decorations)
- Real-time weather and time-of-day simulation
- Grid-based layout system

### Crops Testing Environment

A dedicated environment for testing crop mechanics:

- Plant and grow various crops
- Test watering and growth systems
- Experiment with crop configurations

## 🏗️ Architecture

Lofi Valley uses a **Headless Game Engine** architecture with three distinct layers:

1. **Engine Layer** - Pure TypeScript simulation logic (no React)
2. **State Layer** - Zustand stores for state management
3. **View Layer** - React components for rendering

This separation ensures:

- ⚡ High performance with minimal re-renders
- 🎯 Deterministic game logic
- 🧪 Easy testing and debugging
- 🔄 Time control without breaking mechanics

For more details, see [`/docs/game-engine-architecture.md`](./docs/game-engine-architecture.md).

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest)
- **Bundler**: [Vite](https://vite.dev/)
- **Styling**: [Sass](https://sass-lang.com/) + [Emotion](https://emotion.sh/) + [Tailwind CSS](https://tailwindcss.com/)
- **i18n**: [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/)

### Desktop App

- **Framework**: [Tauri v2](https://v2.tauri.app/)
- **Language**: [Rust](https://rust-lang.org/)

### Code Quality

- **Linting**: [ESLint](https://eslint.org/) with [Airbnb Extended](https://eslint-airbnb-extended.nishargshah.dev/)
- **Formatting**: [Prettier](https://prettier.io/)

## 💻 Development Setup

### VSCode Configuration

Press `Ctrl + Shift + P`, open `settings.json`, and add:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Available Scripts

```bash
npm run dev          # Start Vite dev server (web)
npm run build        # Build for production
npm run preview      # Preview production build
npm run tauri dev    # Run Tauri desktop app in dev mode
npm run tauri build  # Build Tauri desktop app
```

## 📚 Documentation

- [`/docs/game-engine-architecture.md`](./docs/game-engine-architecture.md) - Core architecture principles
- [`/docs/systems/`](./docs/systems/) - Game systems documentation
- [`/docs/tools/`](./docs/tools/) - Tool implementations
- [`/ai/README.md`](./ai/README.md) - AI collaboration guidelines

## 🤝 Contributing

Contributions are welcome! Please read the documentation in `/docs` to understand the architecture before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [dev.lofivalley.com](https://dev.lofivalley.com)
- **Discord**: [Join our community](https://discord.gg/hRzEkg39ja)
- **Bluesky**: [@arkydev](https://bsky.app/profile/arkydev.bsky.social)

---

Made with 💚 by [Leoocast](https://github.com/Leoocast)
