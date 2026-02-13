import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    console.log("User:", user);
    console.log("Calling API:", `/bookings/my/${user.id}`);

    api.get(`/bookings/my/${user.id}`)
        .then(res => {
        console.log("Response:", res.data);
        setBookings(res.data);
        })
        .catch(err => console.error(err));
    }, []);


  return (
    <div>
      <h1>My Bookings</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Room</th>
            <th>Purpose</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.roomCode}</td>
              <td>{b.purpose}</td>
              <td>{new Date(b.startTime).toLocaleString()}</td>
              <td>{new Date(b.endTime).toLocaleString()}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
