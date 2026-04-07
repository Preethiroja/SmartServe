import { useNavigate } from "react-router-dom";
import AddFood from "../components/AddFood"; // Import your AddFood component

export default function Dashboard() {
  const nav = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "User"; // Get name for personal touch

  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-green-700">SmartServe Dashboard</h1>
          <p className="text-gray-500">Welcome back, <span className="font-bold">{userName}</span>!</p>
        </div>
        <button 
          onClick={logout} 
          className="text-red-500 font-medium border border-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {role === 'admin' && (
    <div className="bg-white p-6 rounded-3xl shadow-md border-t-4 border-yellow-500">
      <h2 className="text-xl font-bold mb-2">Admin Control Center 🛡️</h2>
      <p className="text-gray-600 mb-4">Verify donor posts and moderate system activity.</p>
      <button 
        onClick={() => nav("/admin")} 
        className="bg-yellow-500 text-white w-full py-2 rounded-xl font-bold hover:bg-yellow-600 transition"
      >
        Go to Admin Panel
      </button>
    </div>
  )}
        {/* DONOR FLOW */}
        {role === 'donor' && (
          <>
            <div className="lg:col-span-2">
               {/* Embed the AddFood form directly here for a faster experience */}
               <AddFood />
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-md border-t-4 border-purple-500 h-fit">
              <h2 className="text-xl font-bold mb-2">My Activity 📜</h2>
              <p className="text-gray-600 mb-4">Check who requested your donations.</p>
              <button onClick={() => nav("/history")} className="bg-purple-500 text-white w-full py-2 rounded-xl">View History</button>
            </div>
          </>
        )}

        {/* NGO FLOW */}
        {role === 'ngo' && (
          <>
            <div className="bg-white p-6 rounded-3xl shadow-md border-t-4 border-blue-500">
              <h2 className="text-xl font-bold mb-2">Available Food 🍱</h2>
              <p className="text-gray-600 mb-4">Browse and request food donations near your location.</p>
              <button onClick={() => nav("/foods")} className="bg-blue-500 text-white w-full py-2 rounded-xl">View List</button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-t-4 border-purple-500">
              <h2 className="text-xl font-bold mb-2">My Activity 📜</h2>
              <p className="text-gray-600 mb-4">Track your requested pickups.</p>
              <button onClick={() => nav("/history")} className="bg-purple-500 text-white w-full py-2 rounded-xl">View History</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}