# PRINCIPIO FUNDAMENTAL: HEADLESS GAME ENGINE

Este proyecto usa una arquitectura Headless Game Engine.

Definición:

- El juego no depende de React para existir.
- React NO es el motor, es solo una capa de visualización e input.
- Toda la simulación vive fuera de React.

Si React desaparece mañana, el juego sigue funcionando.

# ROLES DE CADA CAPA

## Engine [(src/engine)](../src/engine)

Responsabilidades:

- Tiempo del juego
- Simulaciones (cultivos, agua, crecimiento, clima, etc.)
- Reglas del mundo
- Estado canónico
- Lógica determinista

Prohibiciones:

- NO JSX
- NO hooks de React
- NO efectos visuales
- NO lógica de UI

El engine es ciego: no sabe cómo se ve el juego.

## Estado – ZUSTAND

Zustand es el puente entre Engine y React.

Reglas:

Zustand contiene la única fuente de verdad

- El Engine escribe en Zustand
- React solo lee de Zustand
- React nunca muta lógica del mundo directamente (A menos que sean cosas sencillas, tipo cambiar un booleano en la vista que no repercute en el mundo ni en los ticks)
- Zustand se usa preferentemente en modo vanilla store para:
  - Evitar renders innecesarios
  - Poder actualizar desde loops y sistemas

Ejemplo mental:
[(src/engine/systems/tickSystem.ts)](../src/engine/systems/tickSystem.ts)
<br/>
El tiempo avanza → Engine calcula → Zustand se actualiza → React reacciona
<br/>
<strong>NUNCA AL REVÉS.</strong>

## React [(src/views)](../src/views)

Responsabilidades:

- Renderizar estado
- Manejar input (mouse, teclado)
- Mostrar animaciones, UI, feedback visual

Prohibiciones:

- NO lógica de simulación
- NO timers de juego
- NO reglas de crecimiento
- NO “si pasan 2 horas entonces…”

React observa, no decide.

## SISTEMA DE TIEMPO (CRÍTICO)

El tiempo del juego:

- NO depende del tiempo real
- NO depende del frame rate
- Puede ir a x1, x10, pausarse o acelerarse

Reglas:

- El Engine controla el tiempo
- El tiempo se calcula por ticks (sigo pensando en deltaTime si es necesario en un futuro)
- React solo muestra “son las 6:00 AM”

# REGLAS DE COLABORACIÓN CON IA

Cuando una IA trabaje en este proyecto:

Debe:

- Respetar la arquitectura headless
- Pensar como game designer + systems engineer
- Proponer soluciones simples antes que complejas (Siempre buscando performance)
- Priorizar claridad sobre “best practices genéricas” (Muy importante)

No debe:

- Reescribir código sin pedirlo
- Meter lógica en React “por comodidad”
- Introducir dependencias innecesarias
- Romper separación Engine / View

## PERFORMANCE FIRST (SIN OVERENGINEERING)

Este proyecto prioriza el performance y la estabilidad en todo momento.

### Principio central

Buscamos:

- El menor número de re-renders posibles
- La menor cantidad de trabajo por frame
- Claridad + eficiencia, no “clever code”

Pero NO buscamos:

- Optimizar por reflejo
- Micro-optimizaciones irrelevantes
- Complejidad innecesaria

### Regla principal

Si una optimización añade cientos o miles de líneas de código para ahorrar ~1ms, NO se hace.

El costo cognitivo importa más que una ganancia marginal.

### React y Performance

Reglas:

- React solo re-renderiza cuando realmente es necesario
- Se usan selectors específicos en Zustand (Muy importante)
- Se evita pasar objetos grandes o mutables como props

No se debe recalcular lógica del mundo en componentes

Aceptable:

- Un re-render barato
- Un cálculo trivial en render
- Simplicidad bien entendida

No aceptable:

- Re-renders por estado global innecesario
- useEffect encadenados para lógica del juego
- “Optimizar” sin medir o sin problema real

### Engine y Performance

Reglas:

- La simulación corre fuera de React
- El Engine puede actualizar estado sin causar renders inmediatos
- Los sistemas deben ser predecibles y deterministas

La lógica debe escalar bien con x1 / x10 sin multiplicar costo

Aceptable:

- Lógica clara aunque no sea la más micro-optimizada
- Un loop sencillo y legible

No aceptable:

- Sistemas abstractos solo “por si acaso” (MUY IMPORTANTE, si tienes alguna pregunta respecto al diseño futuro, pregúntame)
- Generalizaciones que nadie necesita aún
- Overengineering preventivo

### Filosofía de optimización

Orden correcto:

1.- Diseño correcto
2.- Código claro
3.- Medir
4.- Optimizar solo lo que duele

Nunca al revés.

### Frase guía (para IA y colaboradores)

- Performance importa.
- Claridad importa más.
- Overengineering mata el proyecto más rápido que 2ms extra.

El jugador no ve el profiler, pero sí siente el lag.

### Resumen de puntos clave a tener en cuenta

- React renderiza, el Engine decide.
- El estado vive en Zustand.
- El tiempo es una simulación, no un reloj.
- Si funciona solo a x1, está mal diseñado.
- El jugador controla el ritmo, no el sistema.

## ESTADO ACTUAL DEL DESARROLLO

### Mecánicas Temporalmente Deshabilitadas

**Muerte de Cultivos (Crop Death)**

- **Estado**: Deshabilitada durante desarrollo
- **Implementación**: Todos los valores de `deathTimeWithoutWater` y `deathTimeWithoutHarvest` en `cropConfigs.ts` están configurados como `Infinity`
- **Razón**: Se implementará más adelante con una nueva mecánica mejorada
- **Ubicación**: `src/constants/cropConfigs.ts`
- **Sistema afectado**: `CropGrowthSystem.ts` (las comparaciones `>=` con `Infinity` nunca se cumplen, previniendo muerte de cultivos)
