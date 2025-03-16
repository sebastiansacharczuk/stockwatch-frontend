import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlists from "./pages/Watchlists.jsx";
import News from "./pages/News.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <div className="p-6">
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                    <Route path="/news" element={isAuthenticated ? <News /> : <Navigate to="/login" />} />
                    <Route path="/watchlists" element={isAuthenticated ? <Watchlists /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;