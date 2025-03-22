import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useModalStore = create(
  combine(
    {
      isModalOpen: false,
    },
    (set) => ({
      setModalOpen: (open: boolean) => set({ isModalOpen: open }),
    })
  )
);
