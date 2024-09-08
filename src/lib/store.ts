
import { create } from "zustand"

interface LoginModalState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openModal: () => Promise<void>;
  closeModal: () => Promise<void>; 
}

export const useLoginModal = create<LoginModalState>((set) => ({
  isOpen: false,
  setIsOpen: (open: boolean) => set({ isOpen: open }),
  openModal: async () => set({ isOpen: true }),
  closeModal: async () => set({ isOpen: false })
}))
