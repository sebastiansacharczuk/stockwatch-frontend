import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlists from "./pages/Watchlists.jsx";
import News from "./pages/News.jsx";
import Navbar from "./components/Navbar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserInfo} from "./redux/authThunks.js";

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, status } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchUserInfo());
    }, [dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Navbar/>
            <div className="p-6">
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                    <Route path="/news" element={isAuthenticated ? <News /> : <Navigate to="/login" />} />
                    <Route path="/watchlists" element={isAuthenticated ? <Watchlists /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;