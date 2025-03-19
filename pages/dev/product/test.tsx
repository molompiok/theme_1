// import React, { useState, useRef, FormEvent, ChangeEvent, JSX } from "react";
// import { BsPerson, BsTrash } from "react-icons/bs";
// import { FiEdit2 } from "react-icons/fi";
// import { useAuthRedirect } from "../../hook/authRedirect";

// type EditStateType = {
//   type: "address" | "number" | null;
//   index: number | null;
//   value: string;
// };

// export default function Page(): JSX.Element {
//   useAuthRedirect();

//   const [fullName, setFullName] = useState<string>("");
//   const [email] = useState<string>("sijean619@gmail.com");
//   const [addresses, setAddresses] = useState<string[]>([
//     "Abidjan yopougon maroc anador",
//     "Yamoussokro derriere la baselique",
//   ]);
//   const [numbers, setNumbers] = useState<string[]>(["+225 0759091098"]);
//   const [editState, setEditState] = useState<EditStateType>({
//     type: null,
//     index: null,
//     value: "",
//   });

//   const addressInputRef = useRef<HTMLInputElement>(null);
//   const numberInputRef = useRef<HTMLInputElement>(null);

//   const handleAddItem = (
//     e: FormEvent<HTMLFormElement>,
//     ref: React.RefObject<HTMLInputElement | null>,
//     setter: React.Dispatch<React.SetStateAction<string[]>>
//   ): void => {
//     e.preventDefault();
//     const input = ref.current;
//     if (!input) return;

//     const newValue = input.value.trim();
//     if (newValue) {
//       setter((prev) => [...prev, newValue]);
//       input.value = "";
//     }
//   };

//   const handleDeleteItem = (
//     index: number,
//     setter: React.Dispatch<React.SetStateAction<string[]>>
//   ): void => {
//     setter((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleEditStart = (
//     type: "address" | "number",
//     index: number,
//     value: string
//   ): void => {
//     setEditState({ type, index, value });
//   };

//   const handleEditCancel = (): void => {
//     setEditState({ type: null, index: null, value: "" });
//   };

//   const handleEditChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     setEditState((prev) => ({ ...prev, value: e.target.value }));
//   };

//   const handleEditSubmit = (e: FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
//     const { type, index, value } = editState;

//     if (!value.trim() || index === null) {
//       handleEditCancel();
//       return;
//     }

//     const setter = type === "address" ? setAddresses : setNumbers;
//     setter((prev) => prev.map((item, i) => (i === index ? value : item)));
//     handleEditCancel();
//   };

//   const renderSection = (
//     title: string,
//     data: string[],
//     type: "address" | "number"
//   ): JSX.Element => {
//     const isAddress = type === "address";
//     const inputRef = isAddress ? addressInputRef : numberInputRef;
//     const setter = isAddress ? setAddresses : setNumbers;

//     return (
//       <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mt-6 w-full">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//           <h2 className="text-xl sm:text-2xl font-semibold text-black">
//             {title}
//           </h2>

//           <form
//             onSubmit={(e) => handleAddItem(e, inputRef, setter)}
//             className="flex w-full sm:w-auto gap-2"
//           >
//             <input
//               ref={inputRef}
//               type="text"
//               className="flex-1 sm:flex-none w-full sm:w-64 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder={`Nouveau ${title.toLowerCase()}`}
//             />
//             <button
//               type="submit"
//               className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               Ajouter
//             </button>
//           </form>
//         </div>

//         <div className="space-y-4">
//           {data.map((item, i) => (
//             <div
//               key={i}
//               className="border-b border-gray-200 pb-4 last:border-b-0"
//             >
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                 <div className="flex-1">
//                   <h3 className="text-black text-sm font-medium">
//                     {title} {i + 1}
//                   </h3>
//                   {editState.type === type && editState.index === i ? (
//                     <form
//                       onSubmit={handleEditSubmit}
//                       className="flex flex-col sm:flex-row gap-2 mt-2"
//                     >
//                       <input
//                         type="text"
//                         className="flex-1 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                         value={editState.value}
//                         onChange={handleEditChange}
//                         autoFocus
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           type="submit"
//                           className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
//                         >
//                           Sauvegarder
//                         </button>
//                         <button
//                           type="button"
//                           className="bg-white hover:bg-gray-100 text-black border border-black px-4 py-2 rounded-lg transition-colors"
//                           onClick={handleEditCancel}
//                         >
//                           Annuler
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     <p className="text-black mt-1 break-words">{item}</p>
//                   )}
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => handleEditStart(type, i, item)}
//                     className="text-black hover:text-gray-600 p-1"
//                     aria-label="Edit"
//                   >
//                     <FiEdit2 size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteItem(i, setter)}
//                     className="text-black hover:text-gray-600 p-1"
//                     aria-label="Delete"
//                   >
//                     <BsTrash size={20} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   };

//   return (
//     <div className="min-h-dvh bg-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center gap-2 sm:gap-3 mb-4">
//           <BsPerson className="text-2xl sm:text-4xl text-gray-800" />
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             Informations de livraison
//           </h1>
//         </div>
//         <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
//           <div className="space-y-6">
//             <div>
//               <label className="text-black text-sm font-medium block mb-1">
//                 Nom complet
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder="Votre nom complet"
//               />
//             </div>
//             <div>
//               <label className="text-black text-sm font-medium block mb-1">
//                 Email
//               </label>
//               <p className="text-black">{email}</p>
//             </div>
//           </div>
//         </section>

//         {renderSection("Adresses", addresses, "address")}
//         {renderSection("Numéros", numbers, "number")}
//       </div>
//     </div>
//   );
// }