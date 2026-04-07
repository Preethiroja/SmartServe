import { useState } from 'react';
import axios from 'axios';

export default function AddFood() {
  const [form, setForm] = useState({
    title: '',
    quantity: '',
    location: '',
    description: '',
    foodType: 'Veg',
    expiryTime: '',
    storageMethod: 'Room Temp',
    isPacked: false,
    verificationDetails: '' // 👈 Added this to state
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check before sending
    if (!form.verificationDetails) {
      return alert("Please provide Aadhar or Business ID for verification.");
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post('http://localhost:5000/api/food', form, {
        headers: { Authorization: token }
      });
      alert("Post sent for Admin Approval! 🛡️");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error: Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full">
      <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
        🍎 Create New Donation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <input 
            required
            className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-green-400 outline-none" 
            placeholder="Food Title (e.g. Fresh Biryani)" 
            onChange={e => setForm({...form, title: e.target.value})} 
          />
          <input 
            required
            className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-green-400 outline-none" 
            placeholder="Quantity (e.g. 15 Plates / 5kg)" 
            onChange={e => setForm({...form, quantity: e.target.value})} 
          />
        </div>

        <input 
          required
          className="border p-3 rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-green-400 outline-none" 
          placeholder="Pickup Address (Google Maps location)" 
          onChange={e => setForm({...form, location: e.target.value})} 
        />

        {/* 🛡️ NEW: Verification Section */}
        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
           <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-2">
             🛡️ Donor Verification
           </h3>
           <input 
            required
            className="border-2 border-yellow-300 p-3 rounded-xl w-full bg-white focus:ring-2 focus:ring-yellow-400 outline-none" 
            placeholder="Enter Aadhar Number or Business ID" 
            onChange={e => setForm({...form, verificationDetails: e.target.value})} 
          />
          <p className="text-[10px] text-yellow-700 mt-2 italic">
            * This information is required for Admin approval and safety compliance.
          </p>
        </div>

        {/* Safety & Type Section */}
        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
          <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            🍱 Food Safety & Details
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 ml-1">Food Category</label>
              <select 
                className="border p-2 w-full rounded-lg mt-1" 
                onChange={e => setForm({...form, foodType: e.target.value})}
              >
                <option value="Veg">🌱 Veg</option>
                <option value="Non-Veg">🍗 Non-Veg</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 ml-1">Expiry Period</label>
              <input 
                required
                className="border p-2 w-full rounded-lg mt-1" 
                placeholder="e.g. 3 Hours" 
                onChange={e => setForm({...form, expiryTime: e.target.value})} 
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs text-gray-500 ml-1">Storage Method</label>
              <select 
                className="border p-2 w-full rounded-lg mt-1" 
                onChange={e => setForm({...form, storageMethod: e.target.value})}
              >
                <option value="Room Temp">🌡️ Room Temp</option>
                <option value="Refrigerated">❄️ Refrigerated</option>
                <option value="Hot">🔥 Kept Hot</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <input 
              type="checkbox" 
              id="packed"
              className="h-5 w-5 text-green-600 rounded" 
              onChange={e => setForm({...form, isPacked: e.target.checked})} 
            />
            <label htmlFor="packed" className="ml-2 text-sm text-gray-700 cursor-pointer">
              I confirm the food is properly packed and sealed.
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition shadow-lg ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
          }`}
        >
          {loading ? 'Processing...' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  );
}