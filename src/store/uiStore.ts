import { create } from 'zustand'

type Modal = 'create_event' | null

type UiStore = {
  activeModal: Modal
  openModal: (modal: Modal) => void
  closeModal: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}))
