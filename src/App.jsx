import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlists from "./pages/Watchlists.jsx";
import News from "./pages/News.jsx";
import Navbar from "./components/Navbar.jsx";
import {useDispatch, useSelector} from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {checkAuth} from "./redux/auth/authThunks.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import WatchlistDetails from "./pages/WatchlistDetails.jsx";

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Sprawdzenie statusu logowania przy starcie aplikacji
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <Router>
            <Navbar />
            <div className="p-6">
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
                    <Route path="/watchlists" element={<ProtectedRoute><Watchlists /></ProtectedRoute>} />
                    <Route path="/watchlist/:id" element={<ProtectedRoute><WatchlistDetails /></ProtectedRoute>} />
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                        path="/register"
                        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;