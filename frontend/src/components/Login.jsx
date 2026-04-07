import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({});
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      
      // Store both for global access
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); 
      localStorage.setItem("userName", res.data.name);

      nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">SmartServe Login</h2>
        <input placeholder="Email" className="border p-2 w-full mb-4 rounded" 
          onChange={(e)=>setData({...data, email: e.target.value})} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded" 
          onChange={(e)=>setData({...data, password: e.target.value})} />
        <button onClick={login} className="bg-green-500 hover:bg-green-600 text-white w-full p-2 rounded font-bold">
          Login
        </button>
        <p className="text-center mt-4 text-sm">
          New here? <Link to="/register" className="text-blue-500 underline">Register</Link>
        </p>
      </div>
    </div>
  );
}