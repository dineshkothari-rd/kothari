import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingContact from "./components/layout/FloatingContact";
import PrivateRoute from "./routes/PrivateRoute";

const Home = lazy(() => import("./pages/Home"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 text-sm font-semibold text-slate-500 dark:bg-gray-950 dark:text-slate-400">
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Login — no navbar/footer */}
          <Route path="/login" element={<Login />} />

          {/* Public pages — with navbar/footer */}
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950">
                <Navbar />
                <main className="grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
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
                <FloatingContact />
                <Footer />
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
