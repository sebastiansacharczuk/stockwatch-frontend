import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getWatchlistById, searchTickers} from "../api.js";
import StockOverview from "./StockOverview";
import {Button, ListGroup, Modal} from "react-bootstrap";

function SearchModal({ searchQuery, setSearchQuery, onSearch, searchResults, onSelect, ...props }) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add stock
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded mb-2 w-100"
                    placeholder="Wpisz frazę"
                />
                <ListGroup className="mt-3">
                    {searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                            <ListGroup.Item
                                key={index}
                                action
                                onClick={() => onSelect(result)}
                            >
                                <strong>{result.ticker}</strong> | {result.name}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-muted mt-2">Brak wyników</p>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Zamknij</Button>
                <Button variant="dark" onClick={() => onSearch(searchQuery)}>Szukaj</Button>
            </Modal.Footer>
        </Modal>
    );
}

function handleAddTicker() {

}

function WatchlistDetails() {
    const { id } = useParams();
    const [watchlist, setWatchlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicker, setSelectedTicker] = useState(null);
    const [selectedAddTicker, setSelectedAddTicker] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getWatchlistById(id)
            .then((response) => {
                const watchlistData = response.data.data;
                setWatchlist(watchlistData);
                // Ustaw domyślnie pierwszy ticker z listy, jeśli istnieje
                if (watchlistData.items && watchlistData.items.length > 0) {
                    setSelectedTicker(watchlistData.items[0]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [id]);

    const handleSearchSubmit = (query) => {
        searchTickers(query)
            .then((response) => {
                setSearchResults(response.data.data.results);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!watchlist) {
        return <p>Watchlist not found.</p>;
    }

    return (
        <div className="container-fluid mt-4 ms-auto" style={{ height: "100vh", width: "100vw" }}>
            <div className="d-flex w-100 vh-100">
                {/* Lewa kolumna – lista tickerów */}
                <div className="border-end p-2" style={{ width: "250px" }}>
                    <h2>Tickery</h2>
                    <Button variant="dark" onClick={() => setModalShow(true)}>
                        +
                    </Button>
                    {watchlist.items && watchlist.items.length > 0 ? (
                        <ul className="list-group mt-2">
                            {watchlist.items.map((item, index) => (
                                <li
                                    key={index}
                                    className={`list-group-item ${selectedTicker === item ? "active" : ""}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setSelectedTicker(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak elementów w watchliscie.</p>
                    )}
                </div>

                {/* Prawa kolumna – komponent StockOverview */}
                <div className="flex-grow-1 p-2">
                    <StockOverview ticker={selectedTicker} />
                </div>

                <SearchModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    onSearch={handleSearchSubmit}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                    onSelect={handleAddTicker(id, selectedAddTicker)}
                />
            </div>
        </div>
    );
}

export default WatchlistDetails;
