/**
 * helpStore - Simple global store for help overlay visibility
 * Used to show/hide welcome overlays from the BackToMenuButton
 */
import { create } from "zustand"

interface HelpState {
  isHelpOpen: boolean
}

export const helpStore = create<HelpState>(() => ({
  isHelpOpen: false,
}))

export const helpActions = {
  open: () => helpStore.setState({ isHelpOpen: true }),
  close: () => helpStore.setState({ isHelpOpen: false }),
  toggle: () => helpStore.setState((s) => ({ isHelpOpen: !s.isHelpOpen })),
}
