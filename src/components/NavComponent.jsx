import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { logoutUser } from "../redux/auth/authThunks.js";

function NavComponent() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <Navbar
            expand="lg"
            className="p-4 w-100 navbar-dark bg-dark"
            fixed={"top"}
        >
            <Container fluid>
                <Navbar.Brand as={Link} to="/">StockWatch</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/watchlists">Watchlists</Nav.Link>
                                <Nav.Link as={Link} to="/news">News</Nav.Link>
                                <Nav.Link as={Link} to="/test">Test</Nav.Link>
                                <Nav.Link
                                    as="button"
                                    onClick={() => dispatch(logoutUser())}
                                    className="text-red-500"
                                >
                                    Logout
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavComponent;