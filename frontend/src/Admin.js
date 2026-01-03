import { useEffect, useState } from "react";
import { BILLING } from "./api";

export default function Admin(){

  const [data,setData]=useState({bills:[],totalMoney:0});

  useEffect(()=>{

    fetch(`${BILLING}/admin`)
      .then(r=>r.json())
      .then(setData);

  },[]);

  return(
    <div>
      <h2 className="text-2xl font-bold mb-2">Tableau Admin</h2>

      <p>Total encaissé : {data.totalMoney} DA</p>

      {data.bills.map(b=>(
        <p key={b.id}>
          Utilisateur {b.userId} — payé {b.total} DA
        </p>
      ))}
    </div>
  );
}
