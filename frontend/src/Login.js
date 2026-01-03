import { useState } from "react";
import { AUTH } from "./api";

export default function Login({ setToken, setUserId }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();

    const res = await fetch(`${AUTH}/login`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.error) {
      setErr(data.error);
      return;
    }

    setToken(data.token);
    setUserId(data.userId);
  }

  return (
    <div className="text-center">

      <h2 className="text-2xl font-bold mb-3">Connexion</h2>

      <form onSubmit={submit} className="flex flex-col gap-2 items-center">

        <input className="border px-3 py-2 rounded"
          placeholder="Email"
          onChange={e=>setEmail(e.target.value)} />

        <input className="border px-3 py-2 rounded"
          placeholder="Mot de passe"
          type="password"
          onChange={e=>setPassword(e.target.value)} />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Se connecter
        </button>

      </form>

      {err && <p className="text-red-600">{err}</p>}
    </div>
  );
}
