import { useState } from "react";
import { api } from "../api/axios";

export default function CreateRoom() {
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await api.post("/rooms", {
        roomCode,
        name,
        capacity,
        status: 1,
        building,
        floor,
        });

        alert("Room created!");
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Create Room</h2>
        <input placeholder="Room Code" onChange={e => setRoomCode(e.target.value)} />
        <input placeholder="Name" onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Capacity" onChange={e => setCapacity(+e.target.value)} />
        <input placeholder="Building" onChange={e => setBuilding(e.target.value)} />
        <input placeholder="Floor" onChange={e => setFloor(e.target.value)} />
        <button type="submit">Create</button>
        </form>
    );
}
