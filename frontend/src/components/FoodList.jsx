import { useEffect, useState } from "react";
import axios from "axios";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch available food with donor details
    axios.get("http://localhost:5000/api/food")
      .then(res => setFoods(res.data))
      .catch(err => console.log("Error fetching food:", err));
  }, []);

  const handleRequest = async (foodId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/food/request/${foodId}`,
        {},
        { headers: { Authorization: token } }
      );
      alert("Food successfully reserved! 🎊 Please coordinate pickup.");
      setFoods(foods.filter(f => f._id !== foodId));
    } catch (err) {
      alert("Request failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-700 flex items-center gap-2">
          Available Donations 🍱
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div key={food._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
              
              {/* TOP BADGE SECTION */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  food.foodType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {food.foodType === 'Veg' ? '🌱 Veg' : '🍗 Non-Veg'}
                </span>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  ⏱️ {food.expiryTime}
                </span>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{food.title}</h2>
                <p className="text-sm text-gray-500 mb-4">📍 {food.location}</p>
                
                <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    🌡️ <strong>Storage:</strong> {food.storageMethod}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    📦 <strong>Status:</strong> {food.isPacked ? "Properly Packed" : "Open Container"}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    ⚖️ <strong>Qty:</strong> {food.quantity}
                  </p>
                </div>

                {/* DONOR INFO (FROM POPULATE) */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 mb-2">Donated by:</p>
                  <p className="text-sm font-semibold text-gray-700 uppercase">
                    🏨 {food.donorId?.name || "Verified Hotel"}
                  </p>
                </div>

                {/* ROLE-BASED ACTION */}
                {userRole === 'ngo' && (
                  <button 
                    onClick={() => handleRequest(food._id)}
                    className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-transform active:scale-95"
                  >
                    Request Pickup
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {foods.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg italic font-medium">
              No food available right now. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}