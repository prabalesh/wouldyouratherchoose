import { Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Submit from "./pages/Submit";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">WouldYouRather</h1>
        <div className="flex gap-4">
          <Link to="/" className="text-purple-700 hover:underline">
            Home
          </Link>
          <Link to="/submit" className="text-purple-700 hover:underline">
            Submit
          </Link>
        </div>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
        </Routes>
      </main>
    </div>
  );
}
