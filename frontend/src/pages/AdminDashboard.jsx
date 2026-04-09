import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [allFood, setAllFood] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]); // 🚩 State for complaints
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAdminData();
    fetchComplaints(); // 🚩 Fetch complaints on load
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food/admin", {
        headers: { Authorization: token }
      });
      setAllFood(res.data);
      
      const total = res.data.length;
      const pending = res.data.filter(f => f.status === 'available' && f.isAdminApproved).length;
      const completed = res.data.filter(f => f.status === 'Accepted' || f.status === 'Collected').length;
      setStats({ total, pending, completed });
      setLoading(false);
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      setLoading(false);
    }
  };

  // 🚩 New: Fetch Complaints Logic
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/admin", {
        headers: { Authorization: token }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Complaints Fetch Error:", err);
    }
  };

  const approveFood = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/food/approve/${id}`, {}, {
        headers: { Authorization: token }
      });
      alert("Post verified and approved!");
      fetchAdminData(); 
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("⚠️ Remove this listing?")) {
      try {
        await axios.delete(`http://localhost:5000/api/food/${id}`, {
          headers: { Authorization: token }
        });
        setAllFood(allFood.filter(f => f._id !== id));
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  if (loading) return <div className="p-10 text-center text-white bg-gray-900 h-screen font-mono">INITIALIZING SECURE TERMINAL...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-yellow-400 tracking-tight uppercase">Admin Control Center</h1>
          <p className="text-gray-400 font-mono text-sm">System Moderation & Safety Protocol</p>
        </div>
        <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold transition shadow-lg">
          Exit Terminal
        </button>
      </div>

      {/* STATS STRIP */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-2xl border-b-4 border-blue-500 shadow-xl">
          <p className="text-gray-400 text-xs font-bold uppercase">System Total</p>
          <h3 className="text-3xl font-bold">{stats.total} Posts</h3>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border-b-4 border-yellow-500 shadow-xl">
          <p className="text-gray-400 text-xs font-bold uppercase">Verified & Active</p>
          <h3 className="text-3xl font-bold">{stats.pending} Live</h3>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border-b-4 border-green-500 shadow-xl">
          <p className="text-gray-400 text-xs font-bold uppercase">Success Rate</p>
          <h3 className="text-3xl font-bold">{stats.completed} Success</h3>
        </div>
      </div>

      {/* 🚩 ACTIVE COMPLAINTS SECTION */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
          🚩 User Complaints & Incident Reports
        </h2>
        <div className="grid gap-4">
          {complaints.length > 0 ? (
            complaints.map(c => (
              <div key={c._id} className="bg-red-900/10 border border-red-900/50 p-5 rounded-2xl flex justify-between items-start">
                <div>
                  <p className="font-bold text-red-400 text-lg">{c.foodId?.title || "Deleted Item"}</p>
                  <p className="text-gray-200 mt-1 italic">"{c.reason}"</p>
                  <div className="flex gap-4 mt-3 text-xs font-mono text-gray-500">
                    <p>NGO: <span className="text-gray-300">{c.ngoId?.name}</span></p>
                    <p>DONOR: <span className="text-gray-300">{c.donorId?.name}</span></p>
                  </div>
                </div>
                <span className="bg-red-900 text-red-200 px-3 py-1 rounded-md text-[10px] font-bold">URGENT</span>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-dashed border-gray-700 text-center">
               <p className="text-gray-500 italic">No incident reports found. Community is safe.</p>
            </div>
          )}
        </div>
      </div>

      {/* 🛡️ VERIFICATION QUEUE */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          🛡️ Verification Queue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allFood.filter(f => !f.isAdminApproved).map(food => (
            <div key={food._id} className="bg-gray-800 p-5 rounded-2xl flex justify-between items-center border border-yellow-900/30">
              <div>
                <p className="font-bold text-lg text-white">{food.title}</p>
                <p className="text-sm text-gray-400">Donor: {food.donorId?.name}</p>
                <p className="text-xs text-yellow-500 mt-1 font-mono">DOCS: {food.verificationDetails}</p>
              </div>
              <button 
                onClick={() => approveFood(food._id)}
                className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl font-bold text-sm transition"
              >
                Verify & Go Live
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📜 GLOBAL ACTIVITY TABLE */}
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
        <div className="p-6 bg-gray-700/50 border-b border-gray-600">
            <h2 className="text-xl font-bold">Global Activity Log</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700/30 text-gray-400 text-[10px] uppercase tracking-widest">
              <th className="p-5">Food Item</th>
              <th className="p-5">Donor</th>
              <th className="p-5">Recipient</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {allFood.filter(f => f.isAdminApproved).map((food) => (
              <tr key={food._id} className="border-b border-gray-700 hover:bg-gray-750/50 transition">
                <td className="p-5 font-semibold text-blue-100">{food.title}</td>
                <td className="p-5 text-gray-400 text-sm">{food.donorId?.name}</td>
                <td className="p-5 text-gray-400 text-sm">{food.requestedBy?.name || "—"}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    food.status === 'Accepted' ? 'bg-blue-900 text-blue-300' : 
                    food.status === 'available' ? 'bg-green-900 text-green-300' : 
                    'bg-gray-600 text-gray-200'
                  }`}>
                    {food.status === 'Accepted' ? 'NGO Accepted' : food.status}
                  </span>     
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => deletePost(food._id)} className="text-red-500 hover:text-red-300 font-bold underline text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}