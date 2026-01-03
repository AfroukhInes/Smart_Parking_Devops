import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import UserDashboard from "./UserDashboard";
import Agent from "./Agent";
import Admin from "./Admin";

export default function App(){

  const [page,setPage]=useState("login");
  const [token,setToken]=useState(null);
  const [userId,setUserId]=useState(null);

  return(
    <div className="p-6">

      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Smart Parking
      </h1>

      <div className="flex gap-2 mb-4">
        <button onClick={()=>setPage("login")}>Login</button>
        <button onClick={()=>setPage("register")}>Register</button>
        <button onClick={()=>setPage("user")}>User</button>
        <button onClick={()=>setPage("agent")}>Agent</button>
        <button onClick={()=>setPage("admin")}>Admin</button>
      </div>

      {page==="login" && <Login setToken={setToken} setUserId={setUserId} />}
      {page==="register" && <Register />}
      {page==="user" && token && <UserDashboard token={token} userId={userId} />}
      {page==="agent" && <Agent />}
      {page==="admin" && <Admin />}

    </div>
  );
}
