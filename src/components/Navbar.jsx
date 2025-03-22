import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from 'react-bootstrap/Nav';
import {logoutUser} from "../redux/auth/authThunks.js";

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleSelect = (eventKey) => alert(`selected ${eventKey}`);
    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <Link to="/" className="text-lg">Home</Link>
            <div>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="mr-4">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/news" className="mr-4">News</Link>
                        <Link to="/watchlists" className="mr-4">Watchlists</Link>
                        <button
                            onClick={() => dispatch(logoutUser())}
                            className="text-red-500"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
