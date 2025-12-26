import { useState } from "react";

export default function Agent() {

  const [code, setCode] = useState("");
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  async function entry() {
    setError("");
    setBill(null);

    const res = await fetch(`http://localhost:3002/entry/${code}`, {
      method: "POST"
    });

    const data = await res.json();

    if (data.error) setError("Ticket inconnu");
    else alert("Entrée enregistrée");
  }

  async function exit() {
    setError("");

    const res = await fetch(`http://localhost:3002/exit/${code}`, {
      method: "POST"
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setBill(data);
  }

  return (
    <div className="text-center">

      {/* titre */}
      <h2 className="text-2xl font-bold mb-4">
        👮 Interface Agent
      </h2>

      {/* carte */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-2 w-3/4 mx-auto">

        <div className="flex justify-center gap-3 items-center">

          <input
            placeholder="Code du ticket"
            onChange={e => setCode(e.target.value)}
            className="border rounded-xl px-3 py-2 w-72"
          />

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:scale-105 duration-200"
            onClick={entry}
          >
            Scanner entrée
          </button>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:scale-105 duration-200"
            onClick={exit}
          >
            Scanner sortie / Facture
          </button>
        </div>

        {/* erreur */}
        {error && (
          <p className="text-red-600 font-semibold mt-3">
            {error}
          </p>
        )}

        {/* facture */}
        {bill && (
          <p className="mt-4 text-lg font-bold">
            💰 Total à payer : {bill.total} DA
          </p>
        )}

      </div>
    </div>
  );
}
