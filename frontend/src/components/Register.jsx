import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // Added adminSecret to the state
  const [data, setData] = useState({ name: "", email: "", password: "", role: "", adminSecret: "" });
  const nav = useNavigate();

  const register = async () => {
    if (!data.role) return alert("Please select a role");
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Registered successfully! Please login.");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-400 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        <input placeholder="Full Name" className="border p-3 w-full mb-4 rounded" 
          onChange={(e)=>setData({...data, name: e.target.value})} />
        
        <input placeholder="Email Address" className="border p-3 w-full mb-4 rounded" 
          onChange={(e)=>setData({...data, email: e.target.value})} />
        
        <input type="password" placeholder="Password" className="border p-3 w-full mb-4 rounded" 
          onChange={(e)=>setData({...data, password: e.target.value})} />

        <select className="border p-3 w-full mb-4 rounded bg-gray-50" 
          onChange={(e)=>setData({...data, role: e.target.value})}>
          <option value="">Register as...</option>
          <option value="donor">Donor (Individual/Restaurant)</option>
          <option value="ngo">NGO (Charity/Foundation)</option>
          <option value="admin">Admin (System Manager)</option>
        </select>

        {/* Conditional input for Admin Secret */}
        {data.role === 'admin' && (
          <input 
            type="password"
            placeholder="Enter Admin Secret Key" 
            className="border-2 border-yellow-500 p-3 w-full mb-6 rounded bg-yellow-50" 
            onChange={(e)=>setData({...data, adminSecret: e.target.value})} 
          />
        )}

        <button onClick={register} className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg font-semibold transition">
          Register
        </button>
      </div>
    </div>
  );
}