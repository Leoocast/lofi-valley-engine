# Sistema de Barra de Vida

## Descripción General

Barra de HP estilo fighting-game con efecto de daño retardado. Se muestra arriba de las entidades al hacer hover.

## Diseño Visual

- **Estilo:** Pixel art con borde blanco grueso
- **Tamaño:** 56px × 10px (14 tiles × 2.5 tiles)
- **Posición:** 12px arriba del sprite de la entidad, centrada

## Efecto de Daño Retardado

Dos barras superpuestas crean feedback visual:

1. **Barra blanca (retardada):** Transición lenta (700ms)
2. **Barra de color (HP actual):** Transición rápida (200ms)

Cuando recibe daño, la barra blanca se queda en el HP anterior mientras que la barra de color baja instantáneamente, creando un efecto "fantasma".

## Código de Colores

- **>60% HP:** Gradiente rosa (`from-pink-500 to-pink-600`)
- **30-60% HP:** Naranja-rojo (`from-orange-500 to-red-500`)
- **<30% HP:** Rojo (`from-red-600 to-red-700`)

## Reglas de Visibilidad

- Solo se muestra en **hover**
- Solo para entidades con **HP < maxHP** (dañadas)
- Oculta cuando la entidad está a vida completa

## Capas Z-Index

- Usa `depth + 1` para estar arriba de la entidad padre
- Respeta el layering de entidades (entidades adelante = HP bars adelante)

## Detalles Técnicos

```typescript
// HealthBar.tsx
interface HealthBarProps {
  currentHp: number
  maxHp: number
  centerX: number // Centro X de la entidad en píxeles
  topY: number // Top Y de la entidad en píxeles
  zIndex: number // Depth de la entidad + 1
}
```

## Archivos

- Componente: `src/components/HealthBar/HealthBar.tsx`
- Integración: `src/components/GameEntities/GameEntities.tsx`
