import type { ISystem } from "@/engine/GameLoop"
import { dropsActions } from "@/engine/dropsStore"

/**
 * DropTickSystem
 * Ticks the drops store to check for auto-pickup
 * Runs every game tick but dropsStore only updates when needed
 */
export class DropTickSystem implements ISystem {
  update(): void {
    dropsActions.tick()
  }
}
