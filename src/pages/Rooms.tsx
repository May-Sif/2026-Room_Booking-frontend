import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Room } from "../types/models";

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        api.get("/rooms").then(res => setRooms(res.data));
    }, []);

    return (
        <div>
            <h1>Rooms</h1>
            <ul>
                {rooms.map(r => (
                    <li key={r.id}>
                        {r.name} ({r.capacity} - {r.status})
                    </li>
                ))}
            </ul>
        </div>
    );
}