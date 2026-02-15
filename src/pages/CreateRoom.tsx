// CreateRoom.tsx
import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";

export default function CreateRoom() {
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/rooms", {
                roomCode,
                name,
                capacity,
                status: 1,
                building,
                floor,
            });
            
            alert("✅ Room created successfully!");
            navigate("/");
        } catch (error) {
            console.error("Failed to create room:", error);
            alert("❌ Failed to create room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto fade-in">
            <div className="page-header">
                <h1 className="page-title-border">Create New Room</h1>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Room Code</label>
                            <input
                                placeholder="e.g., A101"
                                className="form-input"
                                value={roomCode}
                                onChange={e => setRoomCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Room Name</label>
                            <input
                                placeholder="e.g., Conference Room A"
                                className="form-input"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-group col-span-1">
                            <label className="form-label">Capacity</label>
                            <input
                                type="number"
                                placeholder="20"
                                className="form-input"
                                value={capacity}
                                onChange={e => setCapacity(+e.target.value)}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group col-span-1">
                            <label className="form-label">Building</label>
                            <input
                                placeholder="e.g., Main"
                                className="form-input"
                                value={building}
                                onChange={e => setBuilding(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group col-span-1">
                            <label className="form-label">Floor</label>
                            <input
                                placeholder="e.g., 1"
                                className="form-input"
                                value={floor}
                                onChange={e => setFloor(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Creating...
                                </div>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Create Room
                                </>
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="btn-secondary flex items-center justify-center gap-2 px-6"
                        >
                            <X className="h-5 w-5" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}