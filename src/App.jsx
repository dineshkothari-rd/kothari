import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
