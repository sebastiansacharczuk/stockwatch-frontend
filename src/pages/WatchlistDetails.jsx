import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addTickerToWatchlist, getWatchlistById, searchTickers } from "../api.js";
import StockOverview from "../components/StockOverview.jsx";
import { Button } from "react-bootstrap";
import SearchModal from "../components/SearchModal.jsx";

function handleAddTicker(watchlist_id, ticker, companyName, setModalShow, setWatchlist) {
    addTickerToWatchlist(watchlist_id, ticker, companyName)
        .then(() => {
            return getWatchlistById(watchlist_id);
        })
        .then((response) => {
            setWatchlist(response.data.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setModalShow(false));
}

function WatchlistDetails() {
    const { id } = useParams();
    const [watchlist, setWatchlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicker, setSelectedTicker] = useState(null); // Obiekt { ticker, name }
    const [modalShow, setModalShow] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getWatchlistById(id)
            .then((response) => {
                const watchlistData = response.data.data;
                setWatchlist(watchlistData);
                if (watchlistData.items && watchlistData.items.length > 0) {
                    const firstItem = watchlistData.items[0];
                    setSelectedTicker({ ticker: firstItem.ticker, name: firstItem.name });
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
                                    className={`list-group-item ${
                                        selectedTicker && selectedTicker.ticker === item.ticker ? "active" : ""
                                    }`}
                                    style={{
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    onClick={() => setSelectedTicker({ ticker: item.ticker, name: item.name })}
                                >
                                    {item.ticker} | {item.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak elementów w watchliscie.</p>
                    )}
                </div>

                {/* Prawa kolumna – komponent StockOverview */}
                <div className="flex-grow-1 p-2">
                    {selectedTicker ? (
                        <StockOverview ticker={selectedTicker.ticker} companyName={selectedTicker.name} />
                    ) : (
                        <p>Wybierz ticker z listy.</p>
                    )}
                </div>

                <SearchModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    title="Dodaj akcję"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={handleSearchSubmit}
                    searchResults={searchResults}
                    renderResult={(result) => (
                        <>
                            <strong>{result.ticker}</strong> | {result.name}
                        </>
                    )}
                    getKey={(result) => result.ticker}
                    onSelect={(result) =>
                        handleAddTicker(id, result.ticker, result.name, setModalShow, setWatchlist)
                    }
                    placeholder="Wpisz frazę"
                />
            </div>
        </div>
    );
}

export default WatchlistDetails;