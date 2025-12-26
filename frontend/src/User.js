import { useEffect, useState } from "react";

export default function User() {

  const [spots, setSpots] = useState([]);
  const [name, setName] = useState("");
  const [car, setCar] = useState("");
  const [spot, setSpot] = useState("");
  const [ticket, setTicket] = useState("");
  const [code, setCode] = useState("");

  // popup
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3002/spots/free")
      .then(r => r.json())
      .then(setSpots);
  }, []);

  // 🔔 vérifier rappel serveur toutes les 10 secondes
  useEffect(() => {

    if (!code) return;

    const interval = setInterval(async () => {

      const res = await fetch(`http://localhost:3002/reservation/${code}`);
      const data = await res.json();

      if (data.reminderSent && !data.entryTime && !data.cancelled && !data.confirmed) {
  setShowPopup(true);
} else {
  setShowPopup(false);
}


    }, 10000); // 10s

    return () => clearInterval(interval);
  }, [code]);

  async function reserve(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3002/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        carNumber: car,
        spotId: spot
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setTicket(data.ticket);
    setCode(data.code);
  }

  async function confirmArrival() {
    await fetch(`http://localhost:3002/confirm/${code}`, {
      method: "POST"
    });

    alert("Arrivée confirmée 👍 (15 min supplémentaires)");
    setShowPopup(false);
  }

  async function cancelReservation() {
    await fetch(`http://localhost:3002/cancel/${code}`, {
      method: "POST"
    });

    alert("Réservation annulée ❌");
    setShowPopup(false);
  }

  return (
    <div className="text-center">

      <h2 className="text-2xl font-bold mb-4">
        🧾 Réservation utilisateur
      </h2>
      <p className="max-w-xl mx-auto text-sm mb-4 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-xl p-3 shadow">
  ⏰ <b>Votre réservation est valable 1 heure.</b><br />
  Si vous ne validez pas l’entrée dans ce délai, la réservation sera automatiquement annulée.<br />
  🔔 Un rappel vous sera envoyé 15 minutes avant l’annulation.<br />
  ⚠️ <span className="text-red-600 font-semibold">Aucun remboursement de l’acompte.</span>
</p>


      <form onSubmit={reserve} className="flex flex-col items-center gap-3">

        <input
          className="border px-3 py-2 rounded-xl w-72"
          placeholder="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="border px-3 py-2 rounded-xl w-72"
          placeholder="Matricule"
          value={car}
          onChange={e => setCar(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-xl w-72"
          onChange={e => setSpot(e.target.value)}
        >
          <option>Choisir place disponible</option>

          {spots.map(s => (
            <option key={s.id} value={s.id}>
              Section {s.section} — Nº {s.number} — Étage {s.floor}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Valider réservation (50 DA)
        </button>
      </form>

      {ticket && (
        <>
          <p className="mt-4 font-semibold text-green-600">
            🎟 Ticket généré
          </p>
          <a href={ticket} download className="underline text-blue-600">
            Télécharger le ticket PDF
          </a>
        </>
      )}

      {/* 🔔 POPUP AUTO */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-2xl w-96 shadow">

            <h3 className="text-xl font-bold mb-3">
              ⏳ Confirmez votre arrivée
            </h3>

            <p className="mb-4">
              Votre réservation expire bientôt.<br />
              Confirmez votre arrivée sinon elle sera annulée.
            </p>

            <p className="text-red-600 font-semibold mb-3">
              ⚠️ Aucun remboursement de l’acompte.
            </p>

            <div className="flex justify-between">

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
                onClick={confirmArrival}
              >
                ✔️ Je viens
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
                onClick={cancelReservation}
              >
                ❌ Annuler
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
