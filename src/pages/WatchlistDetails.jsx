import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWatchlistById } from "../api.js";
import {Button, Modal} from "react-bootstrap";

function SearchModal({ searchQuery, setSearchQuery, show, onHide, onSearch }) {
    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Wyszukiwanie
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Zamknij</Button>
                <Button variant="primary" onClick={onSearch}>Szukaj</Button>
            </Modal.Footer>
        </Modal>
    );
}

function WatchlistDetails() {
    const { id } = useParams();
    const [watchlist, setWatchlist] = useState(null);
    const [loading, setLoading] = useState(true); // Nowy stan do obsługi ładowania

    useEffect(() => {
        getWatchlistById(id)
            .then(response => {
                setWatchlist(response.data.data); // Poprawne przypisanie odpowiedzi API
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!watchlist) {
        return <p>Watchlist not found.</p>;
    }

    return (
        <>
            <div>
                <h1 className="text-2xl">{watchlist.name}</h1>
                <p>Owner: {watchlist.user}</p>
                <h2>Items:</h2>
                {watchlist.items.length > 0 ? (
                    <ul>
                        {watchlist.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in this watchlist.</p>
                )}
            </div>
        </>
    );
}

export default WatchlistDetails;
