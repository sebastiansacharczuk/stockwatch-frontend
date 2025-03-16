import { api } from "../api";
import {useState} from "react";

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        api.post("login", {username: username, password: password}).then((r) => {
            console.log(r.data);
            setIsAuthenticated(true);
            localStorage.setItem("user", "true");
        });
    };

    return (
        <div>
            <h1 className="text-2xl">Login</h1>
            <form className="mt-4 flex flex-col" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input type="text" value={username}  onChange={(e) => setUsername(e.target.value)} className="p-2 border rounded mb-2" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded mb-2" />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded">Login</button>
            </form>
        </div>
    );
}
export default Login;