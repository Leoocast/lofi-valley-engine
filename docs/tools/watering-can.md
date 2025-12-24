# Regadera (Watering Can) 💧

## Descripción

La **Regadera** es una herramienta que permite **regar tierra arada** para que los cultivos puedan crecer.

## Configuración

**Archivo**: `src/constants/tools.ts`

```typescript
{
  id: "wateringCan",
  emoji: "💧",
  name: "Regadera",
  shortcut: 4
}
```

**Color de hover**: `rgba(0, 191, 255, 0.25)` (azul agua)

---

## Funcionalidad

### Regar Tierra Arada

**Handler**: `src/engine/tools/wateringCanHandler.ts`

**Función**: `handleWateringCan(x, y, tilledSoil)`

**Comportamiento**:

1. Valida que el tile está arado
2. Verifica que NO está ya regado
3. Marca el tile como regado con timestamp del juego
4. El agua se mantiene hasta las **6:00 AM** del siguiente día

**Flujo**:

```
Click en tierra arada
    ↓
Validar tile está arado
    ↓
Verificar NO está ya regado
    ↓
Marcar isWatered = true
    ↓
Guardar wateredAt = currentGameTime
    ↓
Actualizar worldStore
```

**Código**:

```typescript
export function handleWateringCan(x, y, tilledSoil) {
  const tileKey = `${x}-${y}`
  const tile = tilledSoil.get(tileKey)

  // Validar que está arado
  if (!tile) {
    return // No está arado, no se puede regar
  }

  // No permitir regar si ya está regado
  if (tile.isWatered) {
    console.log("💧 Tile already watered, wait until 6am reset")
    return
  }

  // Regar el tile
  const currentGameTime = worldStore.getState().gameTime.totalMinutes
  const next = new Map(tilledSoil)
  next.set(tileKey, {
    ...tile,
    isWatered: true,
    wateredAt: currentGameTime,
  })

  worldStore.setState({ tilledSoil: next })
}
```

---

## Sistema de Agua

### Estado del Tile

Cada tile arado tiene:

```typescript
interface TilledTile {
  spriteIndex: number
  isWatered: boolean // ¿Está regado?
  wateredAt: number | null // Timestamp del juego cuando se regó
  hasCrop: string | null
  createdAt: number
  removedAt: number | null
}
```

### Evaporación Automática

**Sistema**: `WaterEvaporationSystem` (corre en el GameLoop)

**Comportamiento**:

- Cada día a las **6:00 AM**, el sistema resetea TODA el agua
- Todos los tiles arados vuelven a `isWatered = false`
- Los crops **NO crecen** si el tile no está regado

**Código** (`src/engine/systems/WaterEvaporationSystem.ts`):

```typescript
export class WaterEvaporationSystem implements ISystem {
  private lastResetDay = 0

  update(): void {
    const state = worldStore.getState()
    const { hour, day } = state.gameTime

    // Reset a las 6am de cada día
    if (hour === 6 && day !== this.lastResetDay) {
      this.lastResetDay = day

      const updatedSoil = new Map(state.tilledSoil)
      for (const [key, tile] of updatedSoil) {
        updatedSoil.set(key, {
          ...tile,
          isWatered: false,
          wateredAt: null,
        })
      }

      worldStore.setState({ tilledSoil: updatedSoil })
    }
  }
}
```

---

## Visual Feedback

### Borde de Hover

- **Sobre crops**: Borde **azul** (indica que va a regar)
- **Sobre tierra vacía**: Borde azul punteado

### Sprite del Tile

- **Tierra seca**: Sprite normal (índices 0-15)
- **Tierra regada**: Sprite con overlay azul (visual futuro)

### Crops

- Los crops **solo crecen** si el tile está regado
- Ver: [`docs/systems/crops.md`](../systems/crops.md)

---

## Interacción con Otros Sistemas

### Crop Growth System

```typescript
// En CropGrowthSystem.ts
if (tile.isWatered) {
  crop.totalGrowthMinutes += timeDelta
  hasChanges = true
}
```

- Los crops **acumulan tiempo de crecimiento** solo si el tile está regado
- Si el tile se seca, el crecimiento se **pausa** (no se pierde progreso)

### Water Evaporation System

- Resetea agua a las 6:00 AM
- El jugador debe regar cada día para mantener el crecimiento

### Hoe Tool

- Solo se pueden regar tiles que fueron arados con la azada

---

## Restricciones

1. **Solo tierra arada**: No se puede regar tierra normal
2. **Una vez por día**: No se puede regar un tile ya regado (esperar hasta 6am)
3. **No riega crops directamente**: Riega el **tile**, el crop crece como consecuencia

---

## Mecánica de Juego

### Ciclo Diario

```
6:00 AM → Agua se evapora (reset)
    ↓
Jugador riega tiles
    ↓
Crops crecen durante el día
    ↓
6:00 AM siguiente día → Reset
```

### Estrategia

- Regar **temprano** en el día para maximizar crecimiento
- Planificar qué crops regar según prioridad
- El agua NO se consume por los crops, solo se resetea a las 6am

---

## Shortcuts

- **Tecla**: `4`
- **Deseleccionar**: `ESC`

---

## Archivos Relacionados

- `src/constants/tools.ts` - Configuración
- `src/engine/tools/wateringCanHandler.ts` - Lógica de riego
- `src/engine/systems/WaterEvaporationSystem.ts` - Sistema de evaporación
- `src/engine/systems/CropGrowthSystem.ts` - Crecimiento de crops
- `src/components/ToolHoverOverlay/ToolHoverOverlay.tsx` - Visual feedback
- `src/components/TilledSoil/TilledSoil.tsx` - Renderizado de tierra regada
