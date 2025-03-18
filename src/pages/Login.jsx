import { api } from "../api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice.js";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        api.post("login", { username, password })
            .then((response) => {
                console.log(response.data);
                // Zakładamy, że response.data zawiera dane użytkownika
                dispatch(login(response.data));
            })
            .catch((error) => {
                // obsługa błędów, np. wyświetlenie komunikatu użytkownikowi
                console.error("Błąd logowania:", error);
            });
    };

    return (
        <div>
            <h1 className="text-2xl">Login</h1>
            <form
                className="mt-4 flex flex-col"
                onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            >
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded mb-2"
                    placeholder="Nazwa użytkownika"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded mb-2"
                    placeholder="Hasło"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
