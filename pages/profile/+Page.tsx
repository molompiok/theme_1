import React, { useState, useRef, FormEvent, ChangeEvent, JSX } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";

// Définition des types
type EditStateType = {
  type: "address" | "number" | null;
  index: number | null;
  value: string;
};

export default function Page(): JSX.Element {
  
  const [fullName, setFullName] = useState<string>("");
  const email: string = "sijean619@gmail.com";
  const [addresses, setAddresses] = useState<string[]>([
    "Abidjan yopougon maroc anador",
    "Yamoussokro derriere la baselique",
  ]);
  const [numbers, setNumbers] = useState<string[]>(["+225 0759091098"]);
  const [editState, setEditState] = useState<EditStateType>({
    type: null, // 'address' or 'number'
    index: null,
    value: ""
  });
  
  // Refs for the add item forms
  const addressInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  
  // Form submission handlers
  const handleAddAddress = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!addressInputRef.current) return;
    
    const newAddress = addressInputRef.current.value.trim();
    if (newAddress) {
      setAddresses(prev => [...prev, newAddress]);
      addressInputRef.current.value = "";
    }
  };
  
  const handleAddNumber = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!numberInputRef.current) return;
    
    const newNumber = numberInputRef.current.value.trim();
    if (newNumber) {
      setNumbers(prev => [...prev, newNumber]);
      numberInputRef.current.value = "";
    }
  };
  
  // Delete handlers
  const handleDeleteAddress = (index: number): void => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDeleteNumber = (index: number): void => {
    setNumbers(prev => prev.filter((_, i) => i !== index));
  };
  
  // Edit handlers
  const handleEditStart = (type: "address" | "number", index: number, value: string): void => {
    setEditState({
      type,
      index,
      value
    });
  };
  
  const handleEditCancel = (): void => {
    setEditState({
      type: null,
      index: null,
      value: ""
    });
  };
  
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditState(prev => ({
      ...prev,
      value: e.target.value
    }));
  };
  
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { type, index, value } = editState;
    
    if (value.trim() === "" || index === null) {
      return;
    }
    
    if (type === "address") {
      setAddresses(prev => 
        prev.map((item, i) => i === index ? value : item)
      );
    } else if (type === "number") {
      setNumbers(prev => 
        prev.map((item, i) => i === index ? value : item)
      );
    }
    
    // Reset edit state
    handleEditCancel();
  };
  
  // Render section for addresses or numbers
  const renderSection = (title: string, data: string[], type: "address" | "number"): JSX.Element => {
    const isAddress = type === "address";
    const handleDelete = isAddress ? handleDeleteAddress : handleDeleteNumber;
    const inputRef = isAddress ? addressInputRef : numberInputRef;
    const handleAdd = isAddress ? handleAddAddress : handleAddNumber;
    
    return (
      <div className="flex flex-col gap-7 bg-white w-[90%] p-5 mt-7 mx-auto rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl">{title}</h2>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              className="border p-2 rounded"
              placeholder={`Nouveau ${title.toLowerCase()}`}
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded">
              Ajouter
            </button>
          </form>
        </div>
        
        {data.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-700 font-light">{title} {i + 1}</h2>
              <div className="flex gap-2">
                <FiEdit2 
                  className="text-lg text-gray-400 cursor-pointer" 
                  onClick={() => handleEditStart(type, i, item)} 
                />
                <BsTrash 
                  className="text-xl text-red-500 cursor-pointer" 
                  onClick={() => handleDelete(i)} 
                />
              </div>
            </div>
            
            {editState.type === type && editState.index === i ? (
              <form onSubmit={handleEditSubmit} className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={editState.value}
                  onChange={handleEditChange}
                  autoFocus
                />
                <button type="submit" className="bg-green-500 text-white px-3 py-2 rounded">
                  Sauvegarder
                </button>
                <button 
                  type="button" 
                  className="bg-gray-300 text-gray-700 px-3 py-2 rounded"
                  onClick={handleEditCancel}
                >
                  Annuler
                </button>
              </form>
            ) : (
              <span className="sm:text-lg text-sm text-gray-900">{item}</span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="relative w-full max-w-[1200px] mx-auto font-primary pt-10">
        <h1 className="text-3xl ml-12">Profile</h1>
        
        <div className="flex flex-col gap-7 bg-white w-[90%] mx-auto p-5 mt-7 rounded-lg">
          <div>
            <h2 className="text-gray-700 font-light">Nom complet</h2>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
            />
          </div>
          <div>
            <h2 className="text-gray-700 font-light">Email</h2>
            <span>{email}</span>
          </div>
        </div>
        
        {renderSection("Adresses", addresses, "address")}
        {renderSection("Numéros", numbers, "number")}
      </div>
    </div>
  );
}