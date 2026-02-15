// RoomList.tsx
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Room } from "../types/models";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, Users, MapPin, Building2 } from "lucide-react";

export default function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/rooms");
            setRooms(res.data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/rooms/${id}`);
            loadData();
        } catch (error) {
            console.error("Failed to delete room:", error);
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
                <h1 className="page-title-border">Available Rooms</h1>
            </div>

            {rooms.length === 0 ? (
                <div className="empty-state">
                    <Building2 className="empty-state-icon" />
                    <p className="empty-state-text">No rooms available</p>
                </div>
            ) : (
                <div className="grid-cards">
                    {rooms.map((room) => (
                        <div key={room.id} className="card group">
                            <div className="card-header">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Code: {room.roomCode}</p>
                                    </div>
                                    <div className="bg-blue-100 rounded-lg px-3 py-1">
                                        <span className="text-sm font-medium text-blue-700">Active</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        <span>{room.building}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        <span>Floor {room.floor}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span>Capacity: {room.capacity} people</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => navigate(`/rooms/${room.id}/bookings`)}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Bookings
                                    </button>
                                    
                                    {role === "Admin" && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/rooms/edit/${room.id}`)}
                                                className="action-edit"
                                                title="Edit Room"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
                                                className="action-delete"
                                                title="Delete Room"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}