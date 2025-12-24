# Azada (Hoe) 🔨

## Descripción

La **Azada** es una herramienta que permite **arar tierra** para preparar el suelo para plantar cultivos.

## Configuración

**Archivo**: `src/constants/tools.ts`

```typescript
{
  id: "hoe",
  emoji: "🔨",
  name: "Azada",
  shortcut: 3
}
```

**Color de hover**: `rgba(184, 131, 94, 0.25)` (marrón tierra)

---

## Funcionalidad

### Arar Tierra

**Handler**: `src/engine/tools/hoeHandler.ts`

**Función**: `handleHoeTool(x, y, entities, tilledSoil, FARM_WIDTH, FARM_HEIGHT)`

**Comportamiento**:

1. Valida que el tile está dentro del grid
2. Verifica que NO hay entidades bloqueantes (crops, árboles, rocas)
3. Verifica que el tile NO está ya arado
4. Ara el tile y aplica **autotiling** a vecinos

**Flujo**:

```
Click en tile vacío
    ↓
Validar límites del grid
    ↓
Verificar NO hay crops
    ↓
Verificar NO hay árboles/rocas (footprint)
    ↓
Verificar NO está ya arado
    ↓
tillSoilAndAutoTile()
    ↓
Calcular bitmask del tile
    ↓
Recalcular bitmasks de vecinos
    ↓
Actualizar worldStore
```

---

## Validaciones

### 1. Límites del Grid

```typescript
if (x < 0 || x >= FARM_WIDTH || y < 0 || y >= FARM_HEIGHT) {
  return // Fuera del grid
}
```

### 2. Crops Bloqueantes

```typescript
const cropAtTile = entities.find(
  (e) => e.type === "crop" && e.x === x && e.y === y,
)
if (cropAtTile) {
  console.log("[Hoe Blocked] Crop at tile:", { x, y })
  return
}
```

### 3. Árboles/Rocas Bloqueantes

**Importante**: La azada verifica el **footprint lógico**, no el hitbox visual.

```typescript
const treeRockAtTile = entities.find((e) => {
  if (e.sprite.id !== "tree" && e.sprite.id !== "rock") return false

  // Obtener posición real del footprint (con baseOffset si existe)
  const basePos = getBasePosition(e)
  const footprint = getLogicalSize(e.sprite)

  return (
    x >= basePos.x &&
    x < basePos.x + footprint.w &&
    y >= basePos.y &&
    y < basePos.y + footprint.h
  )
})

if (treeRockAtTile) {
  console.log("[Hoe Blocked] Tree/Rock footprint at tile:", { x, y })
  return
}
```

**Ejemplo**:

- Árbol en posición `(5, 5)` con footprint `3x3`
- Ocupa tiles: `(5,5)`, `(6,5)`, `(7,5)`, `(5,6)`, etc.
- NO puedes arar ninguno de esos tiles

### 4. Ya Arado

```typescript
const tileKey = `${x}-${y}`
if (tilledSoil.has(tileKey)) {
  console.log("[Hoe Blocked] Already tilled:", { x, y })
  return
}
```

---

## Autotiling

Cuando aras un tile, el sistema:

1. **Crea el tile arado** con timestamp y estado inicial:

```typescript
{
  spriteIndex: 0,        // Se calculará con autotiling
  isWatered: false,
  wateredAt: null,
  hasCrop: null,
  createdAt: currentTime,
  removedAt: null
}
```

2. **Calcula bitmask** del nuevo tile basado en vecinos
3. **Recalcula bitmasks** de los 8 tiles vecinos
4. **Asigna sprite index** según bitmask (0-15)

Ver: [`docs/systems/autotiling.md`](../systems/autotiling.md) para detalles del sistema de bitmask.

---

## Visual Feedback

### Cursor

- **Hover sobre tile válido**: Borde punteado marrón
- **Hover sobre tile bloqueado**: Sin feedback

### Árboles

- Se hacen **transparentes** (opacity: 0.05) cuando haces hover cerca
- Permite ver el suelo debajo para saber dónde arar

### Animación

- **Pop-in**: El tile arado aparece con animación de 200ms
- Escala de 0.8 → 1.0 con bounce

---

## Interacción con Otros Sistemas

### Crops System

- Los tiles arados son **requisito** para plantar semillas
- El crop se vincula al tile: `tile.hasCrop = cropId`

### Watering System

- Solo se pueden regar tiles arados
- El estado `isWatered` se almacena en el tile

### Pickaxe

- El pico puede **remover** tierra arada
- Recalcula autotiling al remover

---

## Restricciones

1. **Solo tiles vacíos**: No se puede arar donde hay entidades
2. **Footprint completo**: Verifica el área completa de árboles/rocas, no solo el tile de origen
3. **Una vez por tile**: No se puede arar un tile ya arado (usa pico para remover primero)

---

## Shortcuts

- **Tecla**: `3`
- **Deseleccionar**: `ESC`

---

## Archivos Relacionados

- `src/constants/tools.ts` - Configuración
- `src/engine/tools/hoeHandler.ts` - Lógica principal
- `src/engine/autotiling/tilledSoilAutotiling.ts` - Sistema de autotiling
- `src/engine/rendering/visualBoundsAndOffset.ts` - Cálculo de footprints
- `src/components/ToolHoverOverlay/ToolHoverOverlay.tsx` - Visual feedback
