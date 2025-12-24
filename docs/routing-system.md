# Routing System

Sistema de rutas usando TanStack Router para navegación entre vistas.

---

## Descripción General

El proyecto usa **TanStack Router** para manejar la navegación entre:

- **Home** (`/`) - Página de inicio
- **Game** (`/game`) - Vista del juego (farm)
- **Laboratory** (`/laboratory`) - Vista de editor/laboratorio

**Estado Actual**: ✅ Funcional con 3 rutas principales

---

## Arquitectura

```
main.tsx
    ↓
RouterProvider
    ↓
RootLayout (__root.tsx)
    ↓
Routes (routes.ts)
    ├── IndexRoute (/)
    ├── GameRoute (/game)
    └── LaboratoryRoute (/laboratory)
```

---

## Archivos Principales

### 1. main.tsx

**Propósito**: Punto de entrada, inicializa router y GameLoop

```typescript
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { gameLoop } from "./engine/GameLoop"
import { RootLayout } from "./routes/__root"
import { Routes } from "./routes/routes"

const routeTree = RootLayout.addChildren(Routes)
const router = createRouter({ routeTree })

// Iniciar GameLoop
gameLoop.start()

// Render
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

**Features**:

- ✅ Inicia GameLoop al cargar
- ✅ F11 para fullscreen (Tauri)
- ✅ TypeScript type safety

### 2. \_\_root.tsx

**Propósito**: Layout raíz (wrapper de todas las rutas)

```typescript
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const RootLayout = createRootRoute({
  component: () => <Outlet />,
})
```

**Nota**: Actualmente solo renderiza `<Outlet />`, pero podría incluir:

- Header global
- Footer
- Sidebar
- Modales globales

### 3. routes.ts

**Propósito**: Definición de todas las rutas

```typescript
import { createRoute } from "@tanstack/react-router"
import { RootLayout } from "./__root"
import { FarmView } from "@/views/game/farm/farm_view"
import { FarmLaboratoryView } from "@/views/laboratory/farm/farm_laboratory_view"
import { HomeView } from "@/views/home/home_view"

const IndexRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: "/",
  component: HomeView,
})

const GameRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: "/game",
  component: FarmView,
})

const LaboratoryRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: "/laboratory",
  component: FarmLaboratoryView,
})

export const Routes = [IndexRoute, GameRoute, LaboratoryRoute]
```

---

## Rutas Disponibles

| Ruta          | Componente           | Descripción               |
| ------------- | -------------------- | ------------------------- |
| `/`           | `HomeView`           | Página de inicio          |
| `/game`       | `FarmView`           | Vista principal del juego |
| `/laboratory` | `FarmLaboratoryView` | Editor/laboratorio        |

---

## Navegación

### Programática

```typescript
import { useNavigate } from "@tanstack/react-router"

const navigate = useNavigate()

// Ir a game
navigate({ to: "/game" })

// Ir a laboratory
navigate({ to: "/laboratory" })

// Volver a home
navigate({ to: "/" })
```

### Links

```typescript
import { Link } from "@tanstack/react-router"

<Link to="/game">Jugar</Link>
<Link to="/laboratory">Editor</Link>
```

---

## GameLoop y Routing

**Importante**: El GameLoop se inicia en `main.tsx` ANTES del router

**Beneficio**: El loop corre independientemente de la ruta actual

```typescript
// En main.tsx
gameLoop.start() // ← Se inicia una sola vez

// El loop sigue corriendo aunque cambies de ruta
```

**Consideración**: Si quieres pausar el loop en ciertas rutas:

```typescript
// En FarmView
useEffect(() => {
  worldActions.resume()
  return () => worldActions.pause()
}, [])
```

---

## Type Safety

TanStack Router genera tipos automáticamente:

```typescript
// En main.tsx
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
```

**Beneficio**: Autocompletado y type checking en navegación

```typescript
// ✅ TypeScript sabe que estas rutas existen
navigate({ to: "/game" })

// ❌ Error: ruta no existe
navigate({ to: "/invalid" })
```

---

## Futuras Rutas

Rutas planificadas:

- `/settings` - Configuración del juego
- `/save-select` - Selección de partida guardada
- `/credits` - Créditos

---

## Archivos Relacionados

### Core

- `src/main.tsx` - Punto de entrada
- `src/routes/__root.tsx` - Layout raíz
- `src/routes/routes.ts` - Definición de rutas

### Views

- `src/views/home/home_view.tsx` - Home
- `src/views/game/farm/farm_view.tsx` - Game
- `src/views/laboratory/farm/farm_laboratory_view.tsx` - Laboratory

---

## Referencias

- **TanStack Router**: https://tanstack.com/router
- **Docs**: https://tanstack.com/router/latest/docs/framework/react/overview
