// MyBooking.tsx
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/bookings/my/${user.id}`);
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className="badge badge-pending">Pending</span>;
      case 2:
        return <span className="badge badge-approved">Approved</span>;
      case 3:
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title-border">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <CalendarDays className="empty-state-icon" />
          <p className="empty-state-text">You haven't made any bookings yet</p>
          <button 
            onClick={() => window.location.href = "/bookings/create"}
            className="btn-primary mt-4"
          >
            Create Your First Booking
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left side - Room Info */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{booking.roomCode}</h3>
                      <p className="text-gray-600 mt-1 max-w-md">{booking.purpose}</p>
                    </div>
                  </div>

                  {/* Right side - Time and Status */}
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(booking.status)}
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(booking.startTime).toLocaleTimeString()} - 
                          {new Date(booking.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}