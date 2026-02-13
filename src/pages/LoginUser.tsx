import { useState } from "react";
import { api } from "../api/axios";
import type { User } from "../types/models";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("/users/login", { username, password });
            setUser(res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("user", JSON.stringify({
                id: res.data.id,
                email: res.data.email,
                role: res.data.role
            }));
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>

            {user && <p>Welcome, {user.username}! Role: {user.role}</p>}
        </div>
    )
}