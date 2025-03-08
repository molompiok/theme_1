import React from "react";
import { useAuthRedirect } from "../../../hook/authRedirect";

export default function Page() {
  useAuthRedirect();
  return (
    <div className="bg-gray-200 px-3 font-primary">
      <div className="relative w-full min-h-dvh pt-10 max-w-[1200px] mx-auto ">
        <h1 className="text-3xl ml-12t">Mes comamandes</h1>
      </div>
    </div>
  );
}
