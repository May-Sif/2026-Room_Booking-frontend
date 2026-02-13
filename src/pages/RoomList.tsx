import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Room } from "../types/models";
import { useNavigate } from "react-router-dom";

export default function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const loadData = () => {
    api.get("/rooms").then(res => setRooms(res.data));
  };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin mau hapus ruangan ini?")) return;
        await api.delete(`/rooms/${id}`);
        loadData();
    };

    return (
        <div>
            <h1>Room List</h1>
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>RoomCode</th>
                        <th>Name</th>
                        <th>Capacity</th>
                        <th>Building</th>
                        <th>Floor</th>
                        <th>Detail</th>
                        {role === "Admin" && (
                            <th>Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(r => (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.roomCode}</td>
                            <td>{r.name}</td>
                            <td>{r.capacity}</td>
                            <td>{r.building}</td>
                            <td>{r.floor}</td>
                            <td>
                                <button onClick={() => navigate(`/rooms/${r.id}/bookings`)}>
                                    Detail
                                </button>
                            </td>
                            {role === "Admin" && (
                            <td>
                            <button onClick={() => navigate(`/rooms/edit/${r.id}`)}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(r.id)}>
                                Delete
                            </button>
                            </td>
                        )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}