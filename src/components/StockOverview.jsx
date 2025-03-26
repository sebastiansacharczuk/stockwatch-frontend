import React, {useEffect, useState} from "react";
import {getTickerDetails} from "../api.js";
import Container from "react-bootstrap/Container";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import {ChartComponent} from "./ChartComponent/ChartComponent.jsx";

function StockOverview({ ticker, companyName}) {
    const [stockDetails, setStockDetails] = useState(null); // Obiekt { ticker, name }


    useEffect(() => {
        if (!ticker) return;

        getTickerDetails(ticker)
            .then((data) => setStockDetails(data.results))
            .catch((error) => console.error("Błąd:", error));
    }, [ticker]);

    if (!ticker) {
        return <p>Brak wybranego tickera</p>;
    }

    return (
        <div>
            <h2>Ticker: {ticker} </h2>
            <h2>Name: {companyName}</h2>
            {stockDetails ? (
                <>
                    <Container className="my-4">
                        <Row className="justify-content-md-center">
                            <Col md={8}>
                                <Card>
                                    <Card.Header className="d-flex align-items-center">
                                        <img
                                            src={stockDetails.branding.logo_url}
                                            alt="Logo"
                                            style={{ height: '50px', marginRight: '15px' }}
                                        />
                                        <h3 className="mb-0">
                                            {stockDetails.name} <small>({stockDetails.ticker})</small>
                                        </h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            {stockDetails.description}
                                        </Card.Text>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <strong>Market Cap:</strong> ${stockDetails.market_cap.toLocaleString()}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Liczba pracowników:</strong> {stockDetails.total_employees.toLocaleString()}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Na giełdzie od:</strong> {stockDetails.list_date.toLocaleString()}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Adres:</strong> {stockDetails.address.address1}, {stockDetails.address.city}, {stockDetails.address.state} {stockDetails.address.postal_code}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Telefon:</strong> {stockDetails.phone_number}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Strona WWW:</strong> <a href={stockDetails.homepage_url} target="_blank" rel="noopener noreferrer">{stockDetails.homepage_url}</a>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                                <ChartComponent
                                    selectedTicker={ticker}
                                    style={{ width: "800px", height: "400px" }}
                                />
                            </Col>
                        </Row>
                    </Container>

                </>
            ) : (
                <p>Ładowanie danych...</p>
            )}
        </div>
    );

}

export default StockOverview;
