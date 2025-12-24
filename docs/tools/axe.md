# Hacha (Axe)

## Descripción General

Herramienta para talar árboles y entidades destructibles basadas en madera.

## Implementación

### Sistema de Daño

- **Daño por golpe:** 1 HP
- **Objetivo:** Entidades destructibles (árboles)
- **Drop:** 3x madera al destruir árbol

### Animaciones

- **Chop** (300ms): Animación estilo cartoon cuando el árbol sobrevive al golpe
- **Die** (200ms): Efecto pop cuando el HP del árbol llega a 0

### Configuración de Herramienta

```typescript
// toolConfigs.ts
axe: {
  showTileHover: false,        // Sin overlay de tile
  interactsWithTiles: false,   // No interactúa con tiles
  interactsWithEntities: true, // Interactúa con entidades
}
```

### Lógica del Handler

```typescript
// toolHandlers.ts
1. Verificar si la entidad es destructible
2. Hacer 1 de daño
3. Si HP <= 0:
   - Reproducir animación DIE
   - Programar eliminación después de la animación
   - Retornar drops (3x madera)
4. Si no:
   - Reproducir animación CHOP
   - Actualizar HP
```

## Archivos

- Handler: `src/engine/toolHandlers.ts`
- Configuración: `src/constants/toolConfigs.ts`
- Animaciones: `src/engine/animationEngine.ts`
