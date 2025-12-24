# Sistema de Herramientas

## Descripción General

El sistema de herramientas permite al jugador interactuar con el mundo del juego mediante 5 herramientas básicas. Cada herramienta tiene una función específica y se selecciona mediante shortcuts de teclado (1-5) o desde la hotbar.

---

## Herramientas Disponibles

| Herramienta  | Emoji | Shortcut | Función Principal                  | Documentación                          |
| ------------ | ----- | -------- | ---------------------------------- | -------------------------------------- |
| **Hacha**    | 🪓    | `1`      | Talar árboles                      | [`axe.md`](./axe.md)                   |
| **Pico**     | ⛏️    | `2`      | Romper rocas, remover tierra arada | [`pickaxe.md`](./pickaxe.md)           |
| **Azada**    | 🔨    | `3`      | Arar tierra                        | [`hoe.md`](./hoe.md)                   |
| **Regadera** | 💧    | `4`      | Regar tierra arada                 | [`watering-can.md`](./watering-can.md) |
| **Guadaña**  | ✂️    | `5`      | Cosechar crops                     | _(Pendiente)_                          |

---

## Arquitectura del Sistema

### Flujo de Datos

```
Usuario presiona tecla (1-5) o click en hotbar
    ↓
worldActions.setActiveTool(tool)
    ↓
worldStore.activeTool actualizado
    ↓
Componentes React reaccionan (useWorld)
    ↓
Visual feedback (hover, cursor, etc.)
    ↓
Usuario hace click en tile
    ↓
handleToolUse() en toolRouter.ts
    ↓
Handler específico de la herramienta
    ↓
Actualización del worldStore
```

### Componentes Clave

#### 1. **Configuración** (`src/constants/tools.ts`)

```typescript
export const TOOLS = [
  { id: "axe", emoji: "🪓", name: "Hacha", shortcut: 1 },
  { id: "pickaxe", emoji: "⛏️", name: "Pico", shortcut: 2 },
  { id: "hoe", emoji: "🔨", name: "Azada", shortcut: 3 },
  { id: "wateringCan", emoji: "💧", name: "Regadera", shortcut: 4 },
  { id: "scythe", emoji: "✂️", name: "Guadaña", shortcut: 5 },
]

export const TOOL_COLORS = {
  axe: "rgba(228, 215, 27, 0.25)",
  pickaxe: "rgba(128, 128, 128, 0.25)",
  hoe: "rgba(184, 131, 94, 0.25)",
  wateringCan: "rgba(0, 191, 255, 0.25)",
  scythe: "rgba(144, 238, 144, 0.25)",
}
```

#### 2. **Estado Global** (`src/engine/store.ts`)

```typescript
interface WorldState {
  activeTool: Tool | null  // Herramienta actualmente seleccionada
  // ... otros estados
}

export const worldActions = {
  setActiveTool: (tool: Tool) => { ... },
  clearTool: () => { ... },
}
```

#### 3. **Router de Herramientas** (`src/engine/tools/toolRouter.ts`)

Centraliza la lógica de uso de herramientas:

```typescript
export function handleToolUse({
  mouseTile,
  activeTool,
  activeItem,
  entities,
  tilledSoil,
  FARM_WIDTH,
  FARM_HEIGHT,
}) {
  // Routing según herramienta activa
  switch (activeTool) {
    case "hoe":
      return handleHoeTool(...)
    case "wateringCan":
      return handleWateringCan(...)
    case "pickaxe":
      // Lógica de pico...
    // etc.
  }
}
```

#### 4. **Handlers Individuales** (`src/engine/tools/`)

- `hoeHandler.ts` - Lógica de arar tierra
- `wateringCanHandler.ts` - Lógica de regar
- `pickaxeHandler.ts` - Lógica de remover tierra arada
- _(Otros handlers en toolHandlers.ts)_

---

## Integración con Hotbar

Las herramientas se integran con el sistema de hotbars:

### MainHotbar

- Contiene las 5 herramientas por defecto
- Slots 0-4: Herramientas
- Slots 5-9: Disponibles para items

### Sincronización

```typescript
// En farm_view.tsx
useEffect(() => {
  const itemId = activeSlot?.itemId
  if (!itemId) {
    worldActions.clearTool()
    return
  }

  const isTool = TOOLS.some((t) => t.id === itemId)
  if (isTool) {
    worldActions.setActiveTool(itemId as any)
  } else {
    worldActions.clearTool()
  }
}, [activeSlot?.itemId])
```

Ver: [`../hotbar-system.md`](../hotbar-system.md) para más detalles.

---

## Visual Feedback

### Hover Overlay

Cada herramienta tiene feedback visual específico:

- **Borde de color**: Según `TOOL_COLORS`
- **Cursor**: Cambia según herramienta
- **Preview**: Muestra qué va a pasar al hacer click

**Componente**: `src/components/ToolHoverOverlay/ToolHoverOverlay.tsx`

### Entidades

- **Árboles**: Se hacen transparentes con herramientas de tile (hoe, watering, scythe)
- **Rocas**: Muestran HP bar cuando se hace hover con pico
- **Crops**: Cambian color de borde según herramienta (azul=regar, verde/rojo=cosechar)

**Componente**: `src/components/GameEntities/GameEntities.tsx`

---

## Shortcuts de Teclado

| Tecla | Acción                    |
| ----- | ------------------------- |
| `1`   | Seleccionar Hacha         |
| `2`   | Seleccionar Pico          |
| `3`   | Seleccionar Azada         |
| `4`   | Seleccionar Regadera      |
| `5`   | Seleccionar Guadaña       |
| `ESC` | Deseleccionar herramienta |

**Implementación**: `src/hooks/useShortcuts.ts` + `farm_view.tsx`

---

## Interacción con Otros Sistemas

### Autotiling

- **Hoe**: Crea tierra arada con autotiling
- **Pickaxe**: Remueve tierra arada y recalcula autotiling

Ver: [`../systems/autotiling.md`](../systems/autotiling.md)

### Crop System

- **Watering Can**: Riega tiles para permitir crecimiento
- **Scythe**: Cosecha crops maduros

Ver: [`../systems/crops.md`](../systems/crops.md)

### Animation Engine

- **Shake**: Al golpear entidades destructibles
- **Pop-in/Pop-out**: Al crear/remover tierra arada

Ver: [`../animation-engine.md`](../animation-engine.md)

---

## Restricciones Generales

1. **Una herramienta a la vez**: Solo puede haber una herramienta activa
2. **Dentro del grid**: Las herramientas solo funcionan dentro de los límites de la granja
3. **Validaciones específicas**: Cada herramienta tiene sus propias reglas de uso

---

## Archivos Relacionados

### Configuración

- `src/constants/tools.ts` - Definiciones de herramientas

### Estado

- `src/engine/store.ts` - Estado global de herramienta activa

### Lógica

- `src/engine/tools/toolRouter.ts` - Router principal
- `src/engine/tools/hoeHandler.ts` - Handler de azada
- `src/engine/tools/wateringCanHandler.ts` - Handler de regadera
- `src/engine/tools/pickaxeHandler.ts` - Handler de pico
- `src/engine/toolHandlers.ts` - Handlers de hacha, scythe, etc.

### UI

- `src/components/ToolHoverOverlay/ToolHoverOverlay.tsx` - Feedback visual
- `src/components/GameEntities/GameEntities.tsx` - Interacción con entidades
- `src/components/MainHotbar/MainHotbar.tsx` - Hotbar de herramientas

### Hooks

- `src/hooks/useShortcuts.ts` - Shortcuts de teclado
- `src/hooks/useWorld.ts` - Acceso al estado de herramienta activa
