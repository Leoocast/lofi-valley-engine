<div align="center">

<img src="./public/images/lofivalleyengine_logo_.png" alt="Lofi Valley Engine Logo" width="400"/>

[English](./README.md) | **Español**

> Un motor de juego cozy de granja construido para la web con arquitectura headless

</div>

**Lofi Valley** es un juego de simulación de granja basado en navegador, inspirado en Stardew Valley, Animal Crossing y Fae Farm. Construido con rendimiento y libertad del jugador en mente, cuenta con un motor de juego headless determinista que separa la lógica de simulación del renderizado, permitiendo un gameplay fluido a velocidades variables (x1, x2, x4, x10) sin romper las mecánicas del juego.

## ✨ Características

- 🎮 **Arquitectura Headless Game Engine** - Simulación determinista independiente del renderizado
- ⏱️ **Control de Velocidad Variable** - Juega a tu propio ritmo con velocidad de juego ajustable
- 🌱 **Sistema de Cultivos** - Planta, riega y cosecha cultivos con mecánicas de crecimiento realistas
- 🛠️ **Laboratorio de Granja** - Editor visual para diseñar y probar diseños de granja
- 🌍 **Internacionalización** - Soporte completo de i18n (Inglés y Español)
- 🎨 **Estética Pixel Art** - Gráficos retro encantadores
- 🖥️ **Multiplataforma** - Funciona en navegador y como aplicación de escritorio (vía Tauri)

## 🚀 Inicio Rápido

### Prerequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

1. **[Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)** (solo Windows)
2. **[Rust](https://rust-lang.org/tools/install/)** - Requerido para Tauri
3. **[Node.js 24.10+](https://nodejs.org/download)**

Para prerequisitos detallados, consulta [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/).

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/Leoocast/lofi-valley-engine.git
cd lofi-valley-engine

# Instala las dependencias
npm install

# Ejecuta en modo desarrollo (web)
npm run dev

# Ejecuta como aplicación de escritorio (Tauri)
npm run tauri dev
```

## 🎯 Modos de Juego

### Laboratorio de Granja

Una herramienta de diseño visual para crear y probar diseños de granja. Las características incluyen:

- Pintura de terreno (césped, tierra, agua)
- Colocación de objetos (árboles, rocas, decoraciones)
- Simulación de clima y hora del día en tiempo real
- Sistema de diseño basado en cuadrícula

### Entorno de Prueba de Cultivos

Un entorno dedicado para probar mecánicas de cultivos:

- Planta y cultiva varios tipos de cultivos
- Prueba sistemas de riego y crecimiento
- Experimenta con configuraciones de cultivos

## 🏗️ Arquitectura

Lofi Valley usa una arquitectura **Headless Game Engine** con tres capas distintas:

1. **Capa de Motor** - Lógica de simulación pura en TypeScript (sin React)
2. **Capa de Estado** - Stores de Zustand para gestión de estado
3. **Capa de Vista** - Componentes React para renderizado

Esta separación garantiza:

- ⚡ Alto rendimiento con re-renders mínimos
- 🎯 Lógica de juego determinista
- 🧪 Pruebas y depuración fáciles
- 🔄 Control de tiempo sin romper mecánicas

Para más detalles, consulta [`/docs/game-engine-architecture.md`](./docs/game-engine-architecture.md).

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Gestión de Estado**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Enrutamiento**: [TanStack Router](https://tanstack.com/router/latest)
- **Bundler**: [Vite](https://vite.dev/)
- **Estilos**: [Sass](https://sass-lang.com/) + [Emotion](https://emotion.sh/) + [Tailwind CSS](https://tailwindcss.com/)
- **i18n**: [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/)

### Aplicación de Escritorio

- **Framework**: [Tauri v2](https://v2.tauri.app/)
- **Lenguaje**: [Rust](https://rust-lang.org/)

### Calidad de Código

- **Linting**: [ESLint](https://eslint.org/) con [Airbnb Extended](https://eslint-airbnb-extended.nishargshah.dev/)
- **Formateo**: [Prettier](https://prettier.io/)

## 💻 Configuración de Desarrollo

### Configuración de VSCode

Presiona `Ctrl + Shift + P`, abre `settings.json`, y agrega:

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

### Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo Vite (web)
npm run build        # Construye para producción
npm run preview      # Vista previa de la build de producción
npm run tauri dev    # Ejecuta la aplicación de escritorio Tauri en modo desarrollo
npm run tauri build  # Construye la aplicación de escritorio Tauri
```

## 📚 Documentación

- [`/docs/game-engine-architecture.md`](./docs/game-engine-architecture.md) - Principios de arquitectura central
- [`/docs/systems/`](./docs/systems/) - Documentación de sistemas del juego
- [`/docs/tools/`](./docs/tools/) - Implementaciones de herramientas
- [`/ai/README.md`](./ai/README.md) - Guías de colaboración con IA

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee la documentación en `/docs` para entender la arquitectura antes de contribuir.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](./LICENSE) para más detalles.

## 🔗 Enlaces

- **Demo en Vivo**: [dev.lofivalley.com](https://dev.lofivalley.com)
- **Discord**: [Únete a nuestra comunidad](https://discord.gg/hRzEkg39ja)
- **Bluesky**: [@arkydev](https://bsky.app/profile/arkydev.bsky.social)

---

Hecho con 💚 por [Leoocast](https://github.com/Leoocast)
