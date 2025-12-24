import { createStore } from "zustand/vanilla"

/**
 * Music Player State - persists across views
 */
interface MusicPlayerState {
  isOpen: boolean
}

const initialState: MusicPlayerState = {
  isOpen: false,
}

export const musicPlayerStore = createStore<MusicPlayerState>(
  () => initialState,
)

export const musicPlayerActions = {
  open: () => musicPlayerStore.setState({ isOpen: true }),
  close: () => musicPlayerStore.setState({ isOpen: false }),
  toggle: () => {
    const state = musicPlayerStore.getState()
    musicPlayerStore.setState({ isOpen: !state.isOpen })
  },
}
