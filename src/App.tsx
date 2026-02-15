// App.tsx
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogIn, PlusCircle, LogOut, DoorOpen, BookOpen, LayoutDashboard } from "lucide-react";
import CreateBooking from "./pages/CreateBooking";
import BookingList from "./pages/BookingList";
import RoomList from "./pages/RoomList";
import LoginUser from "./pages/LoginUser";
import CreateRoom from "./pages/CreateRoom";
import EditRoom from "./pages/EditRoom";
import AdminRoute from "./components/AdminRoute";
import MyBookings from "./pages/MyBookings";

function App() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <DoorOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RoomBooking
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="nav-links">
              <Link to="/" className="nav-link flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Rooms
              </Link>
              
              {role === "Student" && (
                <>
                  <Link to="/bookings/create" className="nav-link flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Booking
                  </Link>
                  <Link to="/my-bookings" className="nav-link flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Bookings
                  </Link>
                </>
              )}
              
              {role === "Admin" && (
                <Link to="/rooms/create" className="nav-link flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Room
                </Link>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {!role ? (
                  <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-blue-600">{role}</span>
                  </span>
                  <button onClick={handleLogout} className="logout-btn flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-container">
        <Routes>
          <Route path="/login" element={<LoginUser />} />
          <Route path="/" element={<RoomList />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/rooms/:roomId/bookings" element={<BookingList />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/bookings/create" element={<CreateBooking />} />
          <Route path="/rooms/create" element={<AdminRoute><CreateRoom /></AdminRoute>} />
          <Route path="/rooms/edit/:id" element={<AdminRoute><EditRoom /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;