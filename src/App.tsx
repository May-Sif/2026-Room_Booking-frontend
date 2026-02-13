import { Routes, Route, Link } from "react-router-dom";
import CreateBooking from "./pages/CreateBooking";
import BookingList from "./pages/BookingList";
import RoomList from "./pages/RoomList";
import LoginUser from "./pages/LoginUser";
import CreateRoom from "./pages/CreateRoom";
import EditRoom from "./pages/EditRoom";
import AdminRoute from "./components/AdminRoute";
import { useNavigate } from "react-router-dom";
import MyBookings from "./pages/MyBookings";

function App() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <nav style={{ display: "flex", gap: 16 }}>
        <Link to="/">Rooms</Link>
        
        {role === "Student" && <Link to="/bookings/create">Create Booking</Link>}
        {role === "Student" && <Link to="/my-bookings">My Bookings</Link>}
        {role === "Admin" && <Link to="/rooms/create">Create Room</Link>}
        {!role && <Link to="/login">Login</Link>}
        {role && <button onClick={handleLogout}>Logout</button>}
      </nav>

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
    </>
  );
}

export default App;
