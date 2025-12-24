# Sistema de Sprites

## Interfaz de Sprite

```typescript
interface Sprite {
  id: string
  baseWidth: number // Ancho del footprint (colisión)
  baseHeight: number // Alto del footprint (colisión)
  realWidth: number // Ancho visual (renderizado)
  realHeight: number // Alto visual (renderizado)
  spriteSheet: SpriteSheet
  hitboxes?: Array<{ x; y; w; h }> // Hitboxes custom opcionales
}
```

## Footprint vs Tamaño Visual

- **Footprint (base):** Área ocupada en el grid para colisión
- **Visual (real):** Tamaño renderizado real (el sprite puede extenderse más allá del footprint)

Ejemplo: Árbol con footprint 1×1 pero tamaño visual 3×5 (la canopy se extiende más allá del tronco)

## Hitboxes Custom

Feature opcional para interacción precisa del mouse en sprites que se extienden más allá de su footprint.

### Comportamiento Default

Si no hay hitboxes definidas, usa los bounds visuales completos (0, 0, realWidth, realHeight)

### Hitboxes Personalizadas

Define áreas clickeables específicas relativas a la posición visual del sprite:

```typescript
TREE_SPRITE: {
  // ... otras propiedades
  hitboxes: [
    { x: 0, y: 0, w: 3, h: 4 }, // Canopy (porción superior)
    { x: 1, y: 4, w: 1, h: 1 }, // Tronco (centro inferior)
  ]
}
```

**Coordenadas:** Relativas a la posición visual del sprite (incluye visualOffset)

**Caso de uso:** Árboles donde la canopy se extiende izquierda/derecha/arriba más allá de la base del tronco

## Cálculo de Visual Offset

Sprites más altos que su footprint necesitan offset para alinear la base con el grid:

```typescript
// visualBoundsAndOffset.ts
visualOffset.y = -(spriteSheet.height - baseHeight * TILE_SIZE)
```

El offset Y negativo "levanta" el sprite para que la base se alinee con el footprint, la canopy se extiende hacia arriba.

## Detección de Hover

`isPointInEntityHitbox()` verifica la posición del mouse contra:

1. Hitboxes custom (si están definidas) - preciso
2. Bounds visuales (fallback) - rectángulo completo

Soporta tiles negativos para sprites que se extienden fuera de los límites del grid.

## Archivos

- Interfaz: `src/engine/interfaces/sprites.ts`
- Bounds/Offset: `src/engine/rendering/visualBoundsAndOffset.ts`
- Detección de Hit: `src/utils/findEntityAtTile.ts`
