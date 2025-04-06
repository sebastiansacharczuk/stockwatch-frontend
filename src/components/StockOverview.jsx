import React, { useEffect, useState } from "react";
import { getTickerDetails } from "../api.js";
import { Card, ListGroup } from "react-bootstrap";
import { ChartComponent } from "./ChartComponent/ChartComponent.jsx";

function StockOverview({ watchlist, selectedTicker, companyName }) {
    const [stockDetails, setStockDetails] = useState(null);

    useEffect(() => {
        if (!selectedTicker) return;

        getTickerDetails(selectedTicker)
            .then((data) => setStockDetails(data.results))
            .catch((error) => console.error("Błąd:", error));
    }, [selectedTicker]);

    if (!selectedTicker) {
        return <p>Brak wybranego tickera</p>;
    }

    return (
        <div className="stock-overview">
            <h2>Ticker: {selectedTicker}</h2>
            <h2>Name: {companyName}</h2>
            {stockDetails ? (
                <>
                    {/* Sekcja z wykresem i danymi obok siebie */}
                    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                        <div style={{ flex: 2 }}>
                            <ChartComponent
                                watchlist={watchlist}
                                selectedTicker={selectedTicker}
                                style={{ height: 400, width: "100%" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Card>
                                {(stockDetails.branding?.logo_url || stockDetails.name || stockDetails.ticker) && (
                                    <Card.Header className="d-flex align-items-center">
                                        {stockDetails.branding?.logo_url && (
                                            <img
                                                src={stockDetails.branding.logo_url}
                                                alt="Logo"
                                                style={{ height: '50px', marginRight: '15px' }}
                                            />
                                        )}
                                        <h3 className="mb-0">
                                            {stockDetails.name && stockDetails.name}{" "}
                                            {stockDetails.ticker && <small>({stockDetails.ticker})</small>}
                                        </h3>
                                    </Card.Header>
                                )}
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        {stockDetails.market_cap && (
                                            <ListGroup.Item>
                                                <strong>Market Cap:</strong> ${stockDetails.market_cap.toLocaleString()}
                                            </ListGroup.Item>
                                        )}
                                        {stockDetails.total_employees && (
                                            <ListGroup.Item>
                                                <strong>Liczba pracowników:</strong> {stockDetails.total_employees.toLocaleString()}
                                            </ListGroup.Item>
                                        )}
                                        {stockDetails.list_date && (
                                            <ListGroup.Item>
                                                <strong>Na giełdzie od:</strong> {stockDetails.list_date}
                                            </ListGroup.Item>
                                        )}
                                        {stockDetails.address && (
                                            <ListGroup.Item>
                                                <strong>Adres:</strong>{" "}
                                                {[
                                                    stockDetails.address.address1,
                                                    stockDetails.address.city,
                                                    stockDetails.address.state,
                                                    stockDetails.address.postal_code,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </ListGroup.Item>
                                        )}
                                        {stockDetails.phone_number && (
                                            <ListGroup.Item>
                                                <strong>Telefon:</strong> {stockDetails.phone_number}
                                            </ListGroup.Item>
                                        )}
                                        {stockDetails.homepage_url && (
                                            <ListGroup.Item>
                                                <strong>Strona WWW:</strong>{" "}
                                                <a
                                                    href={stockDetails.homepage_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {stockDetails.homepage_url}
                                                </a>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    {/* Opis spółki pod spodem */}
                    {stockDetails.description && (
                        <div style={{ marginTop: "20px" }}>
                            <h4>Opis:</h4>
                            <p>{stockDetails.description}</p>
                        </div>
                    )}
                </>
            ) : (
                <p>Ładowanie danych...</p>
            )}
        </div>
    );
}

export default StockOverview;
