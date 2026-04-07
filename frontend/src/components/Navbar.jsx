export default function Navbar() {
  return (
    <div className="bg-green-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">SmartServe 🍱</h1>
      <div className="space-x-4">
        <a href="/dashboard">Dashboard</a>
        <a href="/foods">Foods</a>
      </div>
    </div>
  );
}