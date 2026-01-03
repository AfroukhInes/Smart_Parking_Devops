import { useState } from "react";
import { AUTH } from "./api";

export default function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function submit(e){
    e.preventDefault();

    await fetch(`${AUTH}/register`,{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({name,email,password})
    });

    alert("Compte créé 👍 Maintenant connecte-toi");
  }

  return(
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-3">Créer un compte</h2>

      <form onSubmit={submit} className="flex flex-col gap-2 items-center">

        <input className="border px-3 py-2 rounded"
          placeholder="Nom"
          onChange={e=>setName(e.target.value)} />

        <input className="border px-3 py-2 rounded"
          placeholder="Email"
          onChange={e=>setEmail(e.target.value)} />

        <input className="border px-3 py-2 rounded"
          type="password"
          placeholder="Mot de passe"
          onChange={e=>setPassword(e.target.value)} />

        <button className="bg-blue-600 text-white px-3 py-2 rounded">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
