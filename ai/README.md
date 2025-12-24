# AI Context

**English** | [Español](#español)

---

## English

### About This Directory

If you want to use AI tools (like GitHub Copilot, Cursor, or ChatGPT) to help develop the project, these documents will help the AI understand the project's architecture, philosophy, and coding standards.

### Files

- **[context.md](./context.md)** - Core architectural principles and AI collaboration guidelines

### Key Principles

This project follows a **Headless Game Engine** architecture:

- **Engine Layer** - Pure TypeScript simulation logic (no React)
- **State Layer** - Zustand stores for state management
- **View Layer** - React components for rendering only

**Important**: The game simulation is completely independent of React. React is just a visualization layer, not the game engine itself.

### For AI Assistants

When working on this project, please:

- ✅ Respect the headless architecture separation
- ✅ Keep game logic in the Engine layer
- ✅ Use Zustand as the bridge between Engine and React
- ✅ Prioritize performance and clarity over "best practices"
- ✅ Ask before making major architectural changes

- ❌ Don't put game logic in React components
- ❌ Don't introduce unnecessary dependencies
- ❌ Don't over-engineer solutions
- ❌ Don't rewrite code without being asked

For detailed guidelines, read [context.md](./context.md).

---

## Español

### Acerca de Este Directorio

Si estás usando herramientas de IA (como GitHub Copilot, Cursor, o ChatGPT) para desarrollar el proyecto, estos documentos ayudarán a la IA a entender la arquitectura, filosofía y estándares de código del proyecto.

### Archivos

- **[context.md](./context.md)** - Principios arquitectónicos centrales y guías de colaboración con IA

### Principios Clave

Este proyecto sigue una arquitectura **Headless Game Engine**:

- **Capa de Motor** - Lógica de simulación pura en TypeScript (sin React)
- **Capa de Estado** - Stores de Zustand para gestión de estado
- **Capa de Vista** - Componentes React solo para renderizado

**Importante**: La simulación del juego es completamente independiente de React. React es solo una capa de visualización, no el motor del juego en sí.

### Para Asistentes de IA

Al trabajar en este proyecto, por favor:

- ✅ Respeta la separación de la arquitectura headless
- ✅ Mantén la lógica del juego en la capa Engine
- ✅ Usa Zustand como puente entre Engine y React
- ✅ Prioriza rendimiento y claridad sobre "mejores prácticas"
- ✅ Pregunta antes de hacer cambios arquitectónicos importantes

- ❌ No pongas lógica del juego en componentes React
- ❌ No introduzcas dependencias innecesarias
- ❌ No sobre-ingenierices soluciones
- ❌ No reescribas código sin que se te pida

Para guías detalladas, lee [context.md](./context.md).
