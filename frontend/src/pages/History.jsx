import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [items, setItems] = useState([]);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = () => {
    axios.get("http://localhost:5000/api/food/history", {
      headers: { Authorization: token }
    })
    .then(res => setItems(res.data))
    .catch(err => console.log(err));
  };

  // 🚩 NEW: Function to handle filing complaints
  const handleComplaint = async (foodId) => {
    const reason = prompt("Describe the problem with this food (e.g., Spoiled, Wrong quantity):");
    if (!reason) return;

    try {
      await axios.post("http://localhost:5000/api/complaints", 
        { foodId, reason }, 
        { headers: { Authorization: token } }
      );
      alert("Complaint submitted to Admin. 🛡️");
    } catch (err) {
      console.error(err);
      alert("Error submitting complaint.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Activity History 📜</h1>
        
        <div className="space-y-6">
          {items.map((item) => (
            <div 
              key={item._id} 
              className={`bg-white p-6 rounded-2xl shadow-sm border-l-8 ${
                item.status === 'Accepted' ? 'border-blue-500' : 
                item.isAdminApproved ? 'border-green-500' : 'border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'Accepted' ? 'bg-blue-100 text-blue-700' : 
                      item.isAdminApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'available' && !item.isAdminApproved ? 'Pending Approval' : item.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Food Details</p>
                  <p className="text-sm mt-1">🍱 {item.quantity} | {item.foodType}</p>
                  <p className="text-sm">📍 {item.location}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    {role === 'donor' ? 'Recipient Status' : 'Donated By (Hotel)'}
                  </p>
                  
                  {role === 'donor' ? (
                    item.requestedBy ? (
                      <div className="text-sm text-blue-700 mt-1">
                        <p className="font-bold">🤝 {item.requestedBy.name}</p>
                        <p className="text-xs opacity-75">Accepted your donation</p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-400 mt-1">
                        {item.isAdminApproved ? "Visible to NGOs - Waiting..." : "Waiting for Admin to Verify"}
                      </p>
                    )
                  ) : (
                    <div className="text-sm text-green-700 mt-1">
                      <p className="font-bold">🏨 {item.donorId?.name || "Unknown Donor"}</p>
                      <p className="text-xs opacity-75">Pickup from this location</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 🚩 NEW: Complaint Button logic inside the card */}
              {role === 'ngo' && item.status === 'Accepted' && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => handleComplaint(item._id)}
                    className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase tracking-wider hover:bg-red-50 px-3 py-2 rounded-lg transition"
                  >
                    🚩 Report an issue
                  </button>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic text-lg font-medium">No activity recorded yet.</p>
              <p className="text-gray-300 text-sm">Donations you make or accept will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}