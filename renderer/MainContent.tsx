// MainContent.tsx
// import type { PropsWithChildren } from "react";
// import { twMerge } from "tailwind-merge";
// import { useModalStore } from "../store/modal";

// export function MainContent({ children }: PropsWithChildren) {
//   const { isModalOpen } = useModalStore();

//   return (
//     <div
//       className={twMerge(
//         "transition-transform duration-500 ease-in-out max-w-dvw max-h-dvh",
//         isModalOpen ? "scale-[.97] overflow-hidden backdrop-blur-md" : "scale-none overflow-auto backdrop-blur-none"
//       )}
//     >
//       {children}
//     </div>
//   );
// }