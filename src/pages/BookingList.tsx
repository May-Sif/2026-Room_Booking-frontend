import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";
import type { Booking } from "../types/models";
import { CheckCircle, XCircle, Trash2, Filter } from "lucide-react";

export default function BookingList() {
  const { roomId } = useParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  const loadData = async () => {
    setLoading(true);
    try {
      if (roomId) {
        const res = await api.get(`/bookings/room/${roomId}`);
        setBookings(res.data);
      } else {
        const res = await api.get("/bookings");
        setBookings(res.data);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roomId]);

  const updateStatus = async (
    id: number,
    status: "Pending" | "Approved" | "Rejected",
  ) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      loadData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      loadData();
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };
  
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

  const [statusFilter, setStatusFilter] = useState<string>("");

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
        <h1 className="page-title-border">
          {roomId ? `Bookings for Room ${roomId}` : "All Bookings"}
        </h1>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <label className="filter-label">Filter by Status:</label>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Bookings</option>
            <option value="1">Pending</option>
            <option value="2">Approved</option>
            <option value="3">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Purpose</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              {role === "Admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={role === "Admin" ? 7 : 6} className="empty-state">
                  <p className="empty-state-text">No bookings found</p>
                </td>
              </tr>
            ) : (
              bookings
                .filter((b) => {
                  if (!statusFilter) return true;
                  return b.status === Number(statusFilter);
                })
                .map((b) => (
                  <tr key={b.id} className="hover:bg-blue-50/50">
                    <td className="font-medium text-gray-900">#{b.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {b.userId.toString().charAt(0)}
                        </div>
                        <span>User {b.userId}</span>
                      </div>
                    </td>
                    <td className="max-w-xs truncate">{b.purpose}</td>
                    <td>{new Date(b.startTime).toLocaleString()}</td>
                    <td>{new Date(b.endTime).toLocaleString()}</td>
                    <td>{getStatusBadge(b.status)}</td>

                    {role === "Admin" && (
                      <td>
                        <div className="action-group">
                          {b.status === 1 && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, "Approved")}
                                className="action-approve"
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "Rejected")}
                                className="action-reject"
                                title="Reject"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="action-delete"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}