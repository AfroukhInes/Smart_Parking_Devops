import { useState } from "react";
import { RESERVATION } from "./api";

export default function Agent(){

  const [code,setCode]=useState("");

  async function entry(){
    await fetch(`${RESERVATION}/entry/${code}`,{method:"POST"});
    alert("Entrée enregistrée");
  }

  async function exit(){
    await fetch(`${RESERVATION}/exit/${code}`,{method:"POST"});
    alert("Sortie enregistrée");
  }

  return(
    <div className="text-center">

      <h2 className="text-2xl font-bold">Interface Agent</h2>

      <input className="border px-3 py-1"
        placeholder="Code"
        onChange={e=>setCode(e.target.value)} />

      <button onClick={entry}
        className="bg-blue-500 text-white px-3 py-1 rounded ml-2">
        Entrée
      </button>

      <button onClick={exit}
        className="bg-green-600 text-white px-3 py-1 rounded ml-2">
        Sortie
      </button>

    </div>
  );
}
