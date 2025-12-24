# Hotbar System

Sistema de 3 hotbars customizables con drag & drop y selector visual.

---

## Descripción General

El sistema de hotbars permite al jugador:

1. **3 Hotbars** independientes (Main + 2 Custom)
2. **10 slots** por hotbar (shortcuts 1-0)
3. **Drag & drop** entre hotbars e inventario
4. **Selector visual** (grid 2×2)
5. **Decoration mode** integrado

**Estado Actual**: ✅ Completamente funcional

---

## Arquitectura

```
┌──────────────────────────────────────────┐
│       hotbarStore (Zustand Vanilla)      │
│  ┌────────────────────────────────────┐  │
│  │ activeHotbar: "main" | "custom1"   │  │
│  │ activeSlotIndex: number            │  │
│  │ mainHotbar: CustomSlot[]  (10)     │  │
│  │ customHotbar1: CustomSlot[] (10)   │  │
│  │ customHotbar2: CustomSlot[] (10)   │  │
│  │ decorationMenuOpen: boolean        │  │
│  │ mouseDrag: MouseDragState | null   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                    ↕
┌──────────────────────────────────────────┐
│         CurrentHotbar (React)            │
│  ┌────────────────────────────────────┐  │
│  │ MainHotbar | CustomHotbar          │  │
│  │ HotbarSelector (2×2 grid)          │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Estado del Hotbar

### Interface: `HotbarState`

```typescript
interface CustomSlot {
  itemId: string | null // "seed-crop-0-0", null
  toolId: Tool | null // "axe", "hoe", null
}

interface HotbarState {
  activeHotbar: "main" | "custom1" | "custom2"
  activeSlotIndex: number // -1 = ninguno, 0-9 = slot activo

  mainHotbar: CustomSlot[] // 10 slots
  customHotbar1: CustomSlot[] // 10 slots
  customHotbar2: CustomSlot[] // 10 slots

  decorationMenuOpen: boolean
  selectedDecorationMode: DecorationMode | null

  mouseDrag: MouseDragState | null
}
```

### Inicialización

```typescript
// MainHotbar: 5 herramientas + 5 vacíos
mainHotbar: [
  { itemId: "axe", toolId: "axe" },
  { itemId: "pickaxe", toolId: "pickaxe" },
  { itemId: "hoe", toolId: "hoe" },
  { itemId: "wateringCan", toolId: "wateringCan" },
  { itemId: "scythe", toolId: "scythe" },
  ...Array(5).fill({ itemId: null, toolId: null }),
]

// Custom hotbars: todos vacíos
customHotbar1: Array(10).fill({ itemId: null, toolId: null })
customHotbar2: Array(10).fill({ itemId: null, toolId: null })
```

---

## Componentes

### 1. CurrentHotbar

**Propósito**: Wrapper que muestra la hotbar activa

```typescript
export const CurrentHotbar = () => {
  const activeHotbar = useHotbar((s) => s.activeHotbar)

  return (
    <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
      {/* Hotbar activa */}
      {activeHotbar === "main" && <MainHotbar />}
      {activeHotbar === "custom1" && <CustomHotbar hotbarType="custom1" />}
      {activeHotbar === "custom2" && <CustomHotbar hotbarType="custom2" />}

      {/* Selector */}
      <HotbarSelector />
    </div>
  )
}
```

### 2. MainHotbar

**Propósito**: Hotbar principal con 10 slots customizables

**Features**:

- ✅ Renderiza tools (emojis) y items (sprites)
- ✅ Drag & drop para reorganizar
- ✅ Shortcuts 1-0
- ✅ Tooltips con nombres
- ✅ Badges de cantidad (desde inventoryStore)

**Renderizado de contenido**:

```typescript
const renderSlotContent = (slotIndex: number) => {
  const slot = mainHotbar[slotIndex]
  if (!slot || !slot.itemId) return null

  // Tools: emoji
  const tool = TOOLS.find((t) => t.id === slot.itemId)
  if (tool) {
    return <span className="text-2xl">{tool.emoji}</span>
  }

  // Seeds: packet + crop overlay
  if (itemDef.type === "seed") {
    const styles = getSeedSpriteStyles(itemDef)
    return (
      <div style={styles.containerStyle}>
        <div style={styles.packetStyle} />
        <div style={styles.cropStyle} />
      </div>
    )
  }

  // Harvest items: crop sprite
  const spriteStyle = getCropsSpriteStyle(itemDef.spriteIndex)
  return <div style={{ ...spriteStyle, transform: "scale(1.5)" }} />
}
```

### 3. CustomHotbar

**Propósito**: Hotbars personalizables (custom1, custom2)

**Diferencias con MainHotbar**:

- Acepta prop `hotbarType: "custom1" | "custom2"`
- Mismo comportamiento de drag & drop
- Misma lógica de renderizado

### 4. HotbarSelector

**Propósito**: Grid 2×2 para cambiar entre hotbars

**Layout**:

```
┌────┬────┐
│ 🔧 │ 🎨 │  Main | Decoration
├────┼────┤
│ C1 │ C2 │  Custom1 | Custom2
└────┴────┘
```

**Comportamiento**:

```typescript
const handleHotbarClick = (hotbar: HotbarType) => {
  hotbarStore.setState({
    activeHotbar: hotbar,
    activeSlotIndex: -1, // Deseleccionar slot
  })
}

const handleDecorationClick = () => {
  hotbarActions.toggleDecorationMenu()
}
```

### 5. HotbarSlot

**Propósito**: Componente reutilizable de slot

**Props**:

```typescript
interface HotbarSlotProps {
  isActive: boolean
  emoji: string | null
  shortcut: string
  onClick: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: () => void
  quantity?: number
  tooltip?: string
  children?: ReactNode
}
```

**Features**:

- ✅ Badge de shortcut (bottom-center)
- ✅ Badge de cantidad (top-right)
- ✅ Estado activo (ring blanco)
- ✅ Tooltip al hover

---

## Drag & Drop

### Inicio del Drag

```typescript
const handleMouseDown = (index: number, e: React.MouseEvent) => {
  const slot = mainHotbar[index]
  if (slot && slot.itemId) {
    const tool = TOOLS.find((t) => t.id === slot.itemId)
    hotbarActions.startMouseDrag({
      source: "main",
      sourceIndex: index,
      itemId: tool ? undefined : slot.itemId,
      toolId: tool?.id,
      mouseX: e.clientX,
      mouseY: e.clientY,
    })
  }
}
```

### Drop en Slot

```typescript
const handleMouseUp = (index: number) => {
  if (!mouseDrag || !mouseDrag.isDragging) {
    hotbarActions.endMouseDrag()
    return
  }

  // Drop desde inventario
  if (mouseDrag.source === "inventory") {
    hotbarActions.transferFromInventory(
      mouseDrag.sourceIndex,
      "main",
      index,
      mouseDrag.itemId,
      mouseDrag.toolId
    )
    hotbarActions.markDropHandled()
    hotbarActions.endMouseDrag()
  }

  // Drop desde otra hotbar (swap)
  else if (mouseDrag.source === "main" || ...) {
    hotbarActions.swapHotbarSlots(
      mouseDrag.source,
      mouseDrag.sourceIndex,
      "main",
      index
    )
    hotbarActions.markDropHandled()
    hotbarActions.endMouseDrag()
  }
}
```

### Drop to Remove

**Comportamiento**: Si arrastras fuera de cualquier target válido, el slot se limpia

```typescript
// En farm_view.tsx
useEffect(() => {
  const handleGlobalMouseUp = () => {
    if (mouseDrag && mouseDrag.isDragging && !mouseDrag.dropHandled) {
      if (mouseDrag.source === "main" || ...) {
        // Limpiar slot de hotbar
        hotbarActions.clearHotbarSlot(mouseDrag.source, mouseDrag.sourceIndex)
      }
    }
    hotbarActions.endMouseDrag()
  }

  window.addEventListener("mouseup", handleGlobalMouseUp)
  return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
}, [mouseDrag])
```

---

## Acciones del Hotbar

### selectSlot

```typescript
selectSlot: (index: number) => {
  hotbarStore.setState({ activeSlotIndex: index })
}
```

### swapHotbarSlots

```typescript
swapHotbarSlots: (
  sourceHotbar: HotbarType,
  sourceIndex: number,
  targetHotbar: HotbarType,
  targetIndex: number,
) => {
  hotbarStore.setState((state) => {
    const sourceSlots = getHotbarByType(state, sourceHotbar)
    const targetSlots = getHotbarByType(state, targetHotbar)

    // Swap
    const temp = sourceSlots[sourceIndex]
    sourceSlots[sourceIndex] = targetSlots[targetIndex]
    targetSlots[targetIndex] = temp

    return {
      ...updateHotbarByType(state, sourceHotbar, sourceSlots),
      ...updateHotbarByType(state, targetHotbar, targetSlots),
    }
  })
}
```

### transferFromInventory

```typescript
transferFromInventory: (
  inventoryIndex: number,
  targetHotbar: HotbarType,
  targetIndex: number,
  itemId?: string,
  toolId?: Tool,
) => {
  hotbarStore.setState((state) => {
    const targetSlots = getHotbarByType(state, targetHotbar)
    const newSlots = [...targetSlots]

    newSlots[targetIndex] = {
      itemId: itemId || null,
      toolId: toolId || null,
    }

    return updateHotbarByType(state, targetHotbar, newSlots)
  })
}
```

---

## Sincronización con worldStore

**Problema**: La hotbar debe actualizar `worldStore.activeTool` cuando se selecciona una herramienta

**Solución**: useEffect en `farm_view.tsx`

```typescript
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

---

## Keyboard Shortcuts

| Tecla | Acción                            |
| ----- | --------------------------------- |
| `1-0` | Seleccionar slot de hotbar activa |
| `ESC` | Deseleccionar slot                |
| `D`   | Toggle decoration menu            |

---

## Styling

### MainHotbar

```css
.mainHotbar {
  display: flex;
  gap: 8px;
  background: rgba(245, 230, 211, 0.95);
  backdrop-filter: blur(20px);
  padding: 12px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-float);
}
```

### HotbarSelector

```css
.hotbarSelector__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.hotbarSelector__button--active {
  background: var(--color-green-medium);
  color: var(--color-cream-light);
}
```

---

## Performance

### useItemQuantity Hook

**Problema**: Cada slot necesita mostrar cantidad desde inventoryStore

**Solución**: Hook optimizado que solo se suscribe si el item existe

```typescript
export function useItemQuantity(itemId: string | null | undefined): number {
  return useInventory((state) => {
    if (!itemId) return 0
    const item = state.itemsMap.get(itemId)
    return item?.quantity ?? 0
  })
}
```

**Beneficio**: O(1) lookup con `itemsMap`, solo re-renderiza cuando cambia la cantidad de ESE item

---

## Archivos Relacionados

### Core

- `src/engine/hotbarStore.ts` - Store y acciones

### Components

- `src/components/CurrentHotbar/CurrentHotbar.tsx` - Wrapper
- `src/components/MainHotbar/MainHotbar.tsx` - Hotbar principal
- `src/components/CustomHotbar/CustomHotbar.tsx` - Hotbars custom
- `src/components/HotbarSelector/HotbarSelector.tsx` - Selector 2×2
- `src/components/HotbarSlot/HotbarSlot.tsx` - Slot reutilizable

### Hooks

- `src/hooks/useHotbar.ts` - Hook de React
- `src/hooks/useItemQuantity.ts` - Cantidad de items

### Integration

- `src/views/game/farm/farm_view.tsx` - Shortcuts y sincronización

---

## Futuras Mejoras

- [ ] Persistencia de configuración en localStorage
- [ ] Nombres custom para hotbars
- [ ] Más de 2 hotbars custom
- [ ] Hotbar vertical (opcional)
