import React from "react";

function StockOverview({ ticker }) {
    if (!ticker) {
        return <p>Brak wybranego tickera</p>;
    }

    return (
        <div>
            <h2>Podgląd: {ticker}</h2>
            {/* Tutaj dodaj logikę pobierania i wyświetlania danych spółki */}
            <p>Dane spółki dla tickera {ticker}...</p>
        </div>
    );
}

export default StockOverview;
