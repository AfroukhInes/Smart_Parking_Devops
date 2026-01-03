import { useEffect, useState } from "react";
import { AUTH, RESERVATION, NOTIF } from "./api";

export default function UserDashboard({ token, userId }) {

  const [me,setMe] = useState({});
  const [spots,setSpots] = useState([]);
  const [car,setCar]=useState("");
  const [spot,setSpot]=useState("");
  const [msgs,setMsgs]=useState([]);

  async function load(){
    const p = await fetch(`${AUTH}/me`,{
      headers:{ "authorization": token }
    });
    setMe(await p.json());

    const sp = await fetch(`${RESERVATION}/spots/free`);
    setSpots(await sp.json());

    const m = await fetch(`${NOTIF}/messages/${userId}`);
    setMsgs(await m.json());
  }

  useEffect(()=>{ load(); },[]);

  async function reserve(){
    const res = await fetch(`${RESERVATION}/reserve`,{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({
        userId,
        name: me.name,
        carNumber: car,
        spotId: spot
      })
    });

    const data = await res.json();
    alert("Réservation effectuée ✔ Code envoyé dans messagerie");
    load();
  }

  return (
    <div>

      <h2 className="text-xl font-bold">Bienvenue {me.name}</h2>
      <p>Points fidélité : {me.points ?? 0}</p>

      <h3 className="font-bold mt-3">Nouvelle réservation</h3>

      <input placeholder="Matricule"
        className="border px-2 py-1"
        onChange={e=>setCar(e.target.value)} />

      <select onChange={e=>setSpot(e.target.value)} className="border px-2 py-1">
        <option>Choisir place</option>
        {spots.map(s=>(
          <option value={s.id} key={s.id}>
            Section {s.section} N°{s.number} Étage {s.floor}
          </option>
        ))}
      </select>

      <button
        onClick={reserve}
        className="bg-green-600 text-white px-3 py-1 rounded ml-2">
        Réserver
      </button>

      <h3 className="font-bold mt-6">📨 Messagerie</h3>

      {msgs.map(m=>(
        <p key={m.id}>➡ {m.text}</p>
      ))}

    </div>
  );
}
