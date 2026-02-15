import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";
import type { Booking } from "../types/models";

export default function BookingList() {
  const { roomId } = useParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const role = localStorage.getItem("role");

  const loadData = () => {
    if (roomId) {
      api.get(`/bookings/room/${roomId}`)
        .then((res) => setBookings(res.data));
    } else {
      api.get("/bookings")
        .then((res) => setBookings(res.data));
    }
  };

  useEffect(() => {
    loadData();
  }, [roomId]);

  const updateStatus = async (
    id: number,
    status: "Pending" | "Approved" | "Rejected",
  ) => {
    await api.patch(`/bookings/${id}/status`, { status });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus booking ini?")) return;
    await api.delete(`/bookings/${id}`);
    loadData();
  };
  
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Approved";
      case 3:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const [statusFilter, setStatusFilter] = useState<string>("");


  return (
    <div>
      <h1>
        {roomId ? `Bookings for Room ${roomId}` : "All Bookings"}
      </h1>

      <div style={{ marginBottom: 16 }}>
        <label>Status Filter: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="1">Pending</option>
          <option value="2">Approved</option>
          <option value="3">Rejected</option>
        </select>
      </div>


      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Purpose</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            {role === "Admin" && (
              <>
                <th>Action</th>
                <th>Hapus</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {bookings
          .filter((b) => {
            if (!statusFilter) return true;
            return b.status === Number(statusFilter);
          })
          .map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.userId}</td>
              <td>{b.purpose}</td>
              <td>{new Date(b.startTime).toLocaleString()}</td>
              <td>{new Date(b.endTime).toLocaleString()}</td>
              <td>{getStatusText(b.status)}</td>

              {role === "Admin" && (
                <>
                  <td>
                    {b.status === 1 && (
                      <>
                        <button onClick={() => updateStatus(b.id, "Approved")}>
                          Approve
                        </button>
                        <button onClick={() => updateStatus(b.id, "Rejected")}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>

                  <td>
                    <button onClick={() => handleDelete(b.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
