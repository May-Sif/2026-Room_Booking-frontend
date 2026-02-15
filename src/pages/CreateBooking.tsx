// CreateBooking.tsx
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Room } from "../types/models";
import { CalendarDays, Clock, FileText, MapPin, Users } from "lucide-react";

export default function CreateBooking() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomId, setRoomId] = useState<number>();
    const [purpose, setPurpose] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        api.get("/rooms").then(res => setRooms(res.data));
    }, []);

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setRoomId(id);
        const room = rooms.find(r => r.id === id);
        setSelectedRoom(room || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/bookings", {
                roomId,
                userId: user.id,
                purpose,
                startTime,
                endTime
            });

            alert("Booking berhasil dibuat!");
            // Reset form
            setRoomId(undefined);
            setPurpose("");
            setStartTime("");
            setEndTime("");
            setSelectedRoom(null);
        } catch (error: any) {
            alert(error.response?.data || "Booking gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto fade-in">
            <div className="page-header">
                <h1 className="page-title-border">Create New Booking</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="md:col-span-2">
                    <div className="form-container">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-group">
                                <label className="form-label flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    Select Room
                                </label>
                                <select 
                                    value={roomId ?? ""}
                                    onChange={handleRoomChange} 
                                    className="form-select" 
                                    required
                                >
                                    <option value="">-- Choose a room --</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name} - {r.building} (Capacity: {r.capacity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    Purpose
                                </label>
                                <textarea
                                    value={purpose}
                                    onChange={e => setPurpose(e.target.value)}
                                    className="form-input"
                                    rows={3}
                                    placeholder="e.g., Meeting with team, Study group, etc."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-blue-600" />
                                        Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        End Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-primary w-full py-3 text-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    "Create Booking"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Room Info Section */}
                <div className="md:col-span-1">
                    {selectedRoom ? (
                        <div className="stat-card sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Room</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Room Name</p>
                                    <p className="font-medium text-gray-800">{selectedRoom.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Building</p>
                                    <p className="font-medium text-gray-800">{selectedRoom.building}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Floor</p>
                                    <p className="font-medium text-gray-800">{selectedRoom.floor}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Capacity</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-1">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        {selectedRoom.capacity} people
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="stat-card flex flex-col items-center justify-center text-center h-64">
                            <MapPin className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">Select a room to see details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}