import React, { useState } from "react";
import {  BsTrash } from "react-icons/bs";

import { FiEdit2 } from "react-icons/fi";

export default function Page() {
  const [fullName, setFullName] = useState();
  // const [email, _setEmail] = useState('sijean619@gmail.com');
  const email = 'sijean619@gmail.com';
  const [adresses, setAdresses] = useState([
    "Abidjan yopougon maroc anador",
    "Yamoussokro derriere la baselique",
  ]);

  const [numbers, setNumber] = useState([
    "+225 0759091098",
  ]);

  return (
    <div className="bg-gray-200">
      <div className="relative w-full min-h-dvh pt-10 max-w-[1200px] mx-auto font-primary">
        <h1 className="text-3xl ml-12">Profile</h1>
        <div className="flex text-clamp-sm flex-col gap-7 bg-white w-[90%] mx-auto p-5 mt-7 rounded-lg">
          <div>
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-gray-700 font-light">Insere votre Nom complet</h2>
              <FiEdit2 className="text-lg text-gray-400" />
            </div>
            <span>{fullName}</span>
          </div>
          <div>
            <h2 className="text-gray-700  font-light">Email</h2>
            <span>{email}</span>
          </div>
        </div>

        <div className="flex  flex-col gap-7 bg-white w-[90%] p-5 mt-7 mx-auto rounded-lg">
          <div className="flex gap-4 items-center">
            <h2 className="text-3xl">Adresses </h2>
            <button className="font-bold underline underline-offset-2">
              + Ajoutez
            </button>
          </div>
          {adresses.map((adresse, i) => {
            return (
              <div className="flex flex-col ">
                <div className="flex items-end gap-2">
                  <h2 className="text-gray-700 font-light">Address {i + 1}</h2>
                  <BsTrash className="text-xl" />
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="sm:text-lg text-sm text-gray-900">{adresse}</span>
                  <FiEdit2 className="text-lg text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex  flex-col gap-7 bg-white w-[90%] p-5 mt-7 mx-auto rounded-lg">
          <div className="flex gap-4 items-center">
            <h2 className="text-3xl">Numeros </h2>
            <button className="font-bold underline underline-offset-2">
              + Ajoutez
            </button>
          </div>
          {numbers.map((number, i) => {
            return (
              <div className="flex flex-col ">
                <div className="flex items-end gap-2">
                  <h2 className="text-gray-700 font-light">Numero {i + 1}</h2>
                  <BsTrash className="text-xl" />
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="sm:text-lg text-sm text-gray-900">{number}</span>
                  <FiEdit2 className="text-lg text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
