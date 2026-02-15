// LoginUser.tsx
import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock, DoorOpen } from "lucide-react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        
        try {
            const res = await api.post("/users/login", { username, password });
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("user", JSON.stringify({
                id: res.data.id,
                email: res.data.email,
                role: res.data.role
            }));
            
            navigate("/");
        } catch (err) {
            setError("Invalid username or password");
            console.error("Login failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md w-full fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg mb-4">
                        <DoorOpen className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mt-2">Sign in to access RoomBooking</p>
                </div>

                {/* Login Card */}
                <div className="card">
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-error mb-6">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your username"
                                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-blue-600" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Admin:</span> admin / admin123</p>
                                <p><span className="font-medium">Student:</span> student1 / 123456</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}