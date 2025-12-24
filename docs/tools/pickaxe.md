# Pico (Pickaxe) ⛏️

## Descripción

El **Pico** es una herramienta que permite:

1. Romper **rocas** (destructible entities)
2. Remover **tierra arada** (tilled soil)

## Configuración

**Archivo**: `src/constants/tools.ts`

```typescript
{
  id: "pickaxe",
  emoji: "⛏️",
  name: "Pico",
  shortcut: 2
}
```

**Color de hover**: `rgba(128, 128, 128, 0.25)` (gris piedra)

---

## Funcionalidad

### 1. Romper Rocas

**Handler**: `src/engine/toolHandlers.ts` (lógica integrada)

**Comportamiento**:

- Detecta rocas (`sprite.id === "rock"`) en el tile clickeado
- Reduce HP de la roca en 1
- Cuando HP llega a 0, la roca se destruye
- **Animación**: Shake al golpear

**Visual Feedback**:

- **Borde blanco**: Roca compatible (puede romperse)
- **HP Bar**: Muestra vida restante de la roca
- **Hover**: Solo muestra borde en rocas, no en árboles

**Código relevante**:

```typescript
// En toolHandlers.ts
if (activeTool === "pickaxe") {
  const rockEntity = findEntityAtTile(mouseTile, entities)

  if (rockEntity && rockEntity.sprite.id === "rock") {
    // Reducir HP
    rockEntity.hp = (rockEntity.hp || 0) - 1

    if (rockEntity.hp <= 0) {
      // Destruir roca
      const updatedEntities = entities.filter((e) => e.id !== rockEntity.id)
      worldStore.setState({ entities: updatedEntities })
    }
  }
}
```

---

### 2. Remover Tierra Arada

**Handler**: `src/engine/tools/pickaxeHandler.ts`

**Función**: `handlePickaxeOnTilledSoil(x, y, tilledSoil, FARM_WIDTH, FARM_HEIGHT)`

**Comportamiento**:

1. Verifica que el tile está arado
2. Marca el tile para eliminación (`removedAt = currentTime`)
3. Inicia animación **pop-out** (300ms)
4. Después de la animación, elimina el tile y recalcula autotiling

**Flujo**:

```
Click en tierra arada
    ↓
markTilledSoilForRemoval()
    ↓
Animación pop-out (300ms)
    ↓
removeTilledSoil()
    ↓
Recalcular autotiling vecinos
```

**Código**:

```typescript
export function handlePickaxeOnTilledSoil(
  x,
  y,
  tilledSoil,
  FARM_WIDTH,
  FARM_HEIGHT,
) {
  const tileKey = `${x}-${y}`
  const tile = tilledSoil.get(tileKey)

  if (!tile || tile.removedAt !== null) return

  // 1. Marcar para eliminación (inicia animación)
  const markedSoil = markTilledSoilForRemoval(x, y, tilledSoil)
  worldStore.setState({ tilledSoil: markedSoil })

  // 2. Eliminar después de animación
  setTimeout(() => {
    const currentSoil = worldStore.getState().tilledSoil
    const updatedSoil = removeTilledSoil(
      x,
      y,
      currentSoil,
      FARM_WIDTH,
      FARM_HEIGHT,
    )
    worldStore.setState({ tilledSoil: updatedSoil })
  }, 300)
}
```

---

## Interacción con Otros Sistemas

### Autotiling

- Al remover tierra arada, recalcula los sprites de tiles vecinos
- Usa bitmask para determinar nuevas conexiones

### Animaciones

- **Shake**: Al golpear rocas
- **Pop-out**: Al remover tierra arada (300ms)

### Visual Feedback

- **Árboles**: Se hacen transparentes (opacity: 0.05) para no bloquear vista
- **Rocas**: Muestran borde blanco y HP bar al hacer hover

---

## Restricciones

1. **No puede remover tierra con crops**: Si hay un crop plantado, el pico no puede remover ese tile
2. **Solo rocas**: El pico NO puede romper árboles (usa hacha para eso)
3. **Dentro del grid**: Solo funciona dentro de los límites de la granja

---

## Shortcuts

- **Tecla**: `2`
- **Deseleccionar**: `ESC`

---

## Archivos Relacionados

- `src/constants/tools.ts` - Configuración
- `src/engine/tools/pickaxeHandler.ts` - Lógica de tierra arada
- `src/engine/toolHandlers.ts` - Lógica de rocas
- `src/engine/autotiling/tilledSoilAutotiling.ts` - Autotiling
- `src/components/GameEntities/GameEntities.tsx` - Visual feedback
