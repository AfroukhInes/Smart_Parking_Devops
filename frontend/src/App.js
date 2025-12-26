import User from "./User";
import Agent from "./Agent";
import Admin from "./Admin";
import { useState } from "react";

export default function App() {

  const [page, setPage] = useState("user");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* TITRE */}
      <h1 className="text-4xl font-bold text-green-600 mt-6 flex items-center gap-2">
        Smart Parking 🚗
      </h1>

      {/* NOUVEAU MENU DE NAVIGATION */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setPage("user")}
          className={`px-6 py-2 rounded-xl shadow ${
            page === "user"
              ? "bg-green-500 text-white"
              : "bg-white"
          }`}
        >
          Utilisateur
        </button>

        <button
          onClick={() => setPage("agent")}
          className={`px-6 py-2 rounded-xl shadow ${
            page === "agent"
              ? "bg-blue-500 text-white"
              : "bg-white"
          }`}
        >
          Agent
        </button>

        <button
          onClick={() => setPage("admin")}
          className={`px-6 py-2 rounded-xl shadow ${
            page === "admin"
              ? "bg-purple-600 text-white"
              : "bg-white"
          }`}
        >
          Admin
        </button>
      </div>

      {/* CONTENU DYNAMIQUE DANS UNE CARTE */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 mt-8">
        {page === "user" && <User />}
        {page === "agent" && <Agent />}
        {page === "admin" && <Admin />}
      </div>

    </div>
  );
}
