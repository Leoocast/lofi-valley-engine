# Inventory System

Sistema de inventario con 21 slots (3 filas × 7 columnas) y drag & drop completo.

---

## Descripción General

El inventario permite al jugador:

1. **Almacenar items** en 21 slots fijos
2. **Drag & drop** entre inventario y hotbars
3. **Organizar** con tabs (Items / Tools)
4. **Modal draggable** que recuerda posición

**Estado Actual**: ✅ Completamente funcional

---

## Arquitectura

### Principio Fundamental

**Zustand Vanilla = Lógica | React = Solo Renderizado**

```
┌──────────────────────────────────────────┐
│          inventoryStore (Zustand)        │
│  ┌────────────────────────────────────┐  │
│  │ slots: (InventoryItem | null)[]    │  │
│  │ itemsMap: Map<string, Item>        │  │
│  │ isInventoryOpen: boolean           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  inventoryActions:                       │
│    - addItem(itemId, quantity)           │
│    - removeItem(itemId, quantity)        │
│    - moveItem(fromIndex, toIndex)        │
│    - toggleInventory()                   │
└──────────────────────────────────────────┘
                    ↕
┌──────────────────────────────────────────┐
│         Inventory.tsx (React)            │
│  ┌────────────────────────────────────┐  │
│  │ - Draggable modal                  │  │
│  │ - Tabs (Items / Tools)             │  │
│  │ - Grid 3×7 (21 slots)              │  │
│  │ - Drag & drop handlers             │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Estado del Inventario

### Interface: `InventoryState`

```typescript
interface InventoryItem {
  id: string // "seed-crop-0-0", "wood", etc.
  quantity: number
}

interface InventoryState {
  slots: (InventoryItem | null)[] // 21 slots fijos
  itemsMap: Map<string, InventoryItem> // Lookup O(1)
  isInventoryOpen: boolean
}
```

### Inicialización

```typescript
const createInitialSlots = (): (InventoryItem | null)[] => {
  const items: (InventoryItem | null)[] = [
    // 10 semillas iniciales
    { id: "seed-crop-0-0", quantity: 4 },
    { id: "seed-crop-0-1", quantity: 4 },
    { id: "seed-crop-1-0", quantity: 4 },
    { id: "seed-crop-1-1", quantity: 4 },
    { id: "seed-crop-2-0", quantity: 4 },
    { id: "seed-crop-2-1", quantity: 4 },
    { id: "seed-crop-3-0", quantity: 4 },
    { id: "seed-crop-3-1", quantity: 4 },
    { id: "seed-crop-4-0", quantity: 4 },
    { id: "seed-crop-4-1", quantity: 4 },
  ]

  // Rellenar hasta 21 slots
  while (items.length < 21) {
    items.push(null)
  }

  return items
}
```

---

## Acciones del Inventario

### addItem

**Propósito**: Agregar items al inventario con stacking automático

```typescript
addItem: (itemId: string, quantity: number) => {
  inventoryStore.setState((state) => {
    const existingItem = state.itemsMap.get(itemId)

    if (existingItem) {
      // Stack con item existente
      const newSlots = state.slots.map((slot) =>
        slot && slot.id === itemId
          ? { ...slot, quantity: slot.quantity + quantity }
          : slot,
      )
      return {
        slots: newSlots,
        itemsMap: buildItemsMap(newSlots),
      }
    } else {
      // Nuevo item - buscar primer slot vacío
      const newSlots = [...state.slots]
      const emptyIndex = newSlots.findIndex((slot) => slot === null)

      if (emptyIndex !== -1) {
        newSlots[emptyIndex] = { id: itemId, quantity }
      }

      return {
        slots: newSlots,
        itemsMap: buildItemsMap(newSlots),
      }
    }
  })
}
```

**Comportamiento**:

1. Si el item ya existe → suma cantidad al slot existente
2. Si es nuevo → busca primer slot vacío (`null`)
3. Actualiza `itemsMap` para lookup O(1)

### removeItem

**Propósito**: Consumir/remover items del inventario

```typescript
removeItem: (itemId: string, quantity: number) => {
  inventoryStore.setState((state) => {
    const existingItem = state.itemsMap.get(itemId)
    if (!existingItem) return state

    const newQuantity = existingItem.quantity - quantity

    if (newQuantity <= 0) {
      // Eliminar completamente - dejar slot como null
      const newSlots = state.slots.map((slot) =>
        slot && slot.id === itemId ? null : slot,
      )
      return {
        slots: newSlots,
        itemsMap: buildItemsMap(newSlots),
      }
    } else {
      // Reducir cantidad
      const newSlots = state.slots.map((slot) =>
        slot && slot.id === itemId ? { ...slot, quantity: newQuantity } : slot,
      )
      return {
        slots: newSlots,
        itemsMap: buildItemsMap(newSlots),
      }
    }
  })
}
```

**Comportamiento**:

1. Si cantidad llega a 0 → slot se convierte en `null`
2. Si queda cantidad → actualiza el slot
3. Reconstruye `itemsMap`

### moveItem

**Propósito**: Drag & drop entre slots (swap)

```typescript
moveItem: (fromIndex: number, toIndex: number) => {
  inventoryStore.setState((state) => {
    const newSlots = [...state.slots]

    // Simple swap
    const temp = newSlots[fromIndex]
    newSlots[fromIndex] = newSlots[toIndex]
    newSlots[toIndex] = temp

    return {
      slots: newSlots,
      itemsMap: buildItemsMap(newSlots),
    }
  })
}
```

---

## Componente: Inventory.tsx

### Estructura

```typescript
export const Inventory = (): ReactElement => {
  const isOpen = useInventory((s) => s.isInventoryOpen)
  const slots = useInventory((s) => s.slots)
  const mouseDrag = useHotbar((s) => s.mouseDrag)

  const [activeTab, setActiveTab] = useState<"items" | "tools">("items")
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // ... drag handlers

  return (
    <div className="inventory" style={{ top, left }}>
      {/* Header draggable */}
      <div className="inventory__header" onMouseDown={handleHeaderMouseDown}>
        <h2>Inventario</h2>
        <button onClick={inventoryActions.toggleInventory}>✕</button>
      </div>

      {/* Tabs */}
      <div className="inventory__tabs">
        <button onClick={() => setActiveTab("items")}>Items</button>
        <button onClick={() => setActiveTab("tools")}>Tools</button>
      </div>

      {/* Grid */}
      <div className="inventory__grid">
        {Array.from({ length: 21 }, (_, i) => {
          const item = slots[i] || null
          return renderItemSlot(item, i)
        })}
      </div>
    </div>
  )
}
```

### Features

#### 1. Modal Draggable

```typescript
const handleHeaderMouseDown = (e: React.MouseEvent) => {
  if (e.target instanceof HTMLButtonElement) return
  e.preventDefault()

  dragStateRef.current = {
    isWindowDragging: true,
    startX: e.clientX,
    startY: e.clientY,
    windowStartX: position.x,
    windowStartY: position.y,
  }
}

useEffect(() => {
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (dragStateRef.current.isWindowDragging) {
      const dx = e.clientX - dragStateRef.current.startX
      const dy = e.clientY - dragStateRef.current.startY
      setPosition({
        x: dragStateRef.current.windowStartX + dx,
        y: dragStateRef.current.windowStartY + dy,
      })
    }
  }

  window.addEventListener("mousemove", handleGlobalMouseMove)
  return () => window.removeEventListener("mousemove", handleGlobalMouseMove)
}, [])
```

#### 2. Tabs

- **Items**: Muestra todos los items (seeds, resources, etc.)
- **Tools**: Muestra solo herramientas (desde `toolsStore`)

#### 3. Drag & Drop

**Inicio del drag**:

```typescript
const handleMouseDown = (
  e: React.MouseEvent,
  type: "tool" | "item",
  id: string,
  index: number,
) => {
  e.preventDefault()
  e.stopPropagation()

  hotbarActions.startMouseDrag({
    source: "inventory",
    sourceIndex: index,
    ...(type === "tool" ? { toolId: id } : { itemId: id }),
    mouseX: e.clientX,
    mouseY: e.clientY,
  })
}
```

**Drop en slot**:

```typescript
const handleDropOnSlot = (type: "tool" | "item", toIndex: number) => {
  if (!mouseDrag) return

  // Drop desde inventario (reorder)
  if (mouseDrag.source === "inventory") {
    if (mouseDrag.itemId && type === "item") {
      inventoryActions.moveItem(mouseDrag.sourceIndex, toIndex)
    }
    hotbarActions.markDropHandled()
    hotbarActions.endMouseDrag()
  }

  // Drop desde hotbar (transfer)
  else if (mouseDrag.source === "main" || ...) {
    if (mouseDrag.itemId && type === "item") {
      hotbarActions.transferToInventory(
        mouseDrag.source,
        mouseDrag.sourceIndex,
        toIndex
      )
      hotbarActions.markDropHandled()
      hotbarActions.endMouseDrag()
    }
  }
}
```

---

## Integración con Hotbars

### Transfer: Hotbar → Inventory

```typescript
// En hotbarStore.ts
transferToInventory: (
  source: HotbarType,
  sourceIndex: number,
  targetInventoryIndex: number,
) => {
  hotbarStore.setState((state) => {
    const sourceHotbar = getHotbarByType(state, source)
    const sourceSlot = sourceHotbar[sourceIndex]

    if (!sourceSlot.itemId) return state

    // Mover a inventario
    inventoryActions.moveItemFromHotbar(sourceSlot.itemId, targetInventoryIndex)

    // Limpiar slot de hotbar
    const newHotbar = [...sourceHotbar]
    newHotbar[sourceIndex] = { itemId: null, toolId: null }

    return updateHotbarByType(state, source, newHotbar)
  })
}
```

### Transfer: Inventory → Hotbar

```typescript
// En hotbarStore.ts
transferFromInventory: (
  inventoryIndex: number,
  targetHotbar: HotbarType,
  targetIndex: number,
) => {
  const inventorySlot = inventoryStore.getState().slots[inventoryIndex]
  if (!inventorySlot) return

  hotbarStore.setState((state) => {
    const targetHotbarSlots = getHotbarByType(state, targetHotbar)
    const newHotbar = [...targetHotbarSlots]

    newHotbar[targetIndex] = {
      itemId: inventorySlot.id,
      toolId: null,
    }

    // Remover de inventario
    inventoryActions.removeItem(inventorySlot.id, inventorySlot.quantity)

    return updateHotbarByType(state, targetHotbar, newHotbar)
  })
}
```

---

## Renderizado de Items

### Seeds (Sprites de Crops)

```typescript
if (itemDef.type === "seed") {
  const styles = getSeedSpriteStyles(itemDef)
  return (
    <div style={styles.containerStyle}>
      <div style={styles.packetStyle} />  {/* Paquete base */}
      <div style={styles.cropStyle} />    {/* Sprite del crop */}
    </div>
  )
}
```

### Harvest Items (Sprites de Crops)

```typescript
if (itemDef.spritesheet === "crops") {
  const spriteStyle = getCropsSpriteStyle(itemDef.spriteIndex)
  return (
    <div style={{
      ...spriteStyle,
      transform: "scale(1.8)",
      transformOrigin: "center",
    }} />
  )
}
```

### Tools (Emojis)

```typescript
return <span className="text-2xl">{itemDef.emoji}</span>
```

---

## Keyboard Shortcuts

| Tecla | Acción            |
| ----- | ----------------- |
| `I`   | Toggle inventario |
| `ESC` | Cerrar inventario |

---

## Styling

**Archivo**: `src/components/Inventory/Inventory.css`

### Grid Layout

```css
.inventory__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 columnas */
  gap: 8px;
}
```

### Slots

```css
.inventory__slot {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-cream-medium);
  border: 2px solid var(--color-cream-dark);
  border-radius: var(--radius-md);
  cursor: grab;
}

.inventory__slot--empty {
  background: transparent;
  border: 2px dashed var(--color-cream-dark);
  opacity: 0.6;
  cursor: default;
}
```

### Badges

```css
.inventory__slotBadge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-wood-dark);
  color: var(--color-cream-light);
  border-radius: var(--radius-full);
  padding: 2px 6px;
  font-size: var(--font-size-xs);
}
```

---

## Performance

### itemsMap (O(1) Lookup)

```typescript
export const buildItemsMap = (
  slots: (InventoryItem | null)[],
): Map<string, InventoryItem> => {
  const map = new Map<string, InventoryItem>()
  for (const item of slots) {
    if (item) {
      map.set(item.id, item)
    }
  }
  return map
}
```

**Beneficio**: Verificar si un item existe es O(1) en lugar de O(N)

```typescript
// ✅ O(1)
const existingItem = state.itemsMap.get(itemId)

// ❌ O(N)
const existingItem = state.slots.find((slot) => slot?.id === itemId)
```

### Selectores Específicos

```typescript
// ✅ BIEN: Solo re-renderiza cuando cambia isInventoryOpen
const isOpen = useInventory((s) => s.isInventoryOpen)

// ❌ MAL: Re-renderiza en cualquier cambio
const state = useInventory()
```

---

## Debugging

### Verificar Estado

```typescript
// En consola del navegador
inventoryStore.getState().slots
inventoryStore.getState().itemsMap
```

### Logs

```typescript
// En inventoryActions
console.log("➡️ Adding item:", itemId, quantity)
console.log("➡️ Existing item:", existingItem)
```

---

## Archivos Relacionados

### Core

- `src/engine/inventoryStore.ts` - Store y acciones
- `src/constants/items.ts` - Definiciones de items

### Components

- `src/components/Inventory/Inventory.tsx` - Modal principal
- `src/components/Inventory/Inventory.css` - Estilos

### Hooks

- `src/hooks/useInventory.ts` - Hook de React

### Integration

- `src/views/game/farm/farm_view.tsx` - Shortcuts y renderizado
- `src/engine/hotbarStore.ts` - Transfer hotbar ↔ inventory

### Rendering

- `src/engine/rendering/seedSpriteRenderer.ts` - Sprites de seeds
- `src/engine/rendering/spritesheetRenderer.ts` - Sprites de crops

---

## Futuras Mejoras

- [ ] Persistencia en localStorage
- [ ] Filtros por tipo de item
- [ ] Búsqueda de items
- [ ] Auto-sort
- [ ] Merge/split stacks manual
- [ ] Tooltips con descripciones
