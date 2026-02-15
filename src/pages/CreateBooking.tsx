import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Room } from "../types/models";

export default function CreateBooking(){
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomId, setRoomId] = useState<number>();
    const [purpose, setPurpose] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() =>{
        api.get("/rooms").then(res => setRooms(res.data));
    }, []);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

         try {
            await api.post("/bookings", {
                roomId,
                userId: user.id,
                purpose,
                startTime,
                endTime
            });

            alert("Booking berhasil");
        } catch (error: any) {
            alert(error.response?.data || "Booking gagal");
        }
    };

    return (
        <div>
            <h1>Create Booking</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Room</label>
                    <select value={roomId ?? ""}onChange={e => setRoomId(Number(e.target.value))} required>
                        <option value="">-- pilih room --</option>
                        {rooms.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Purpose</label>
                    <input
                        value={purpose}
                        onChange={e => setPurpose(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Book</button>
            </form>
        </div>    
    );
}