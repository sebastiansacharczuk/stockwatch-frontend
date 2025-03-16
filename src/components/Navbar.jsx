// Navbar.jsx
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
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
                        <button className="text-red-500" onClick={() => {
                                localStorage.removeItem("user");
                                setIsAuthenticated(false);
                            }}
                        > Logout </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
