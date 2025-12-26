import { useEffect, useState } from "react";

export default function Admin() {

  const [reservations, setReservations] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);

  useEffect(() => {

    fetch("http://localhost:3002/admin")
      .then(r => r.json())
      .then(data => {

        const list = Array.isArray(data.reservations)
          ? data.reservations
          : [];

        setReservations(list);
        setTotalMoney(data.totalMoney || 0);
      });

  }, []);

  return (
    <div className="text-center">

      {/* Titre */}
      <h2 className="text-2xl font-bold mb-2">
        🧾 Tableau Administrateur
      </h2>

      {/* Total encaissé */}
      <p className="font-semibold mb-4">
        Total encaissé : {totalMoney} DA
      </p>

      {/* Tableau avec style */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-6 mt-4">

        <table className="w-full border rounded-xl shadow">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Matricule</th>
              <th className="p-2">Place</th>
              <th className="p-2">Entrée</th>
              <th className="p-2">Sortie</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map(r => (
              <tr key={r.code} className="text-center border">

                <td className="p-2">{r.code}</td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.carNumber}</td>

                <td className="p-2">
                  Section {r.spot.section} – Nº {r.spot.number} – Étage {r.spot.floor}
                </td>

                <td className="p-2">
                  {r.entryTime ? new Date(r.entryTime).toLocaleString() : "-"}
                </td>

                <td className="p-2">
                  {r.exitTime ? new Date(r.exitTime).toLocaleString() : "-"}
                </td>

                <td className="p-2 font-bold">
                  {r.total ?? 0} DA
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
