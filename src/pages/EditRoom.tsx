import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then(res => {
        setRoomCode(res.data.roomCode);
        setName(res.data.name);
        setCapacity(res.data.capacity);
        setBuilding(res.data.building);
        setFloor(res.data.floor);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.put(`/rooms/${id}`, {
      roomCode,
      name,
      capacity,
      status: 1,
      building,
      floor
    });

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Room</h2>
      <input value={roomCode} onChange={e => setRoomCode(e.target.value)} />
      <input value={name} onChange={e => setName(e.target.value)} />
      <input type="number" value={capacity} onChange={e => setCapacity(+e.target.value)} />
      <input value={building} onChange={e => setBuilding(e.target.value)} />
      <input value={floor} onChange={e => setFloor(e.target.value)} />
      <button type="submit">Update</button>
    </form>
  );
}
