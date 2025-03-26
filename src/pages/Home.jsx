import {api, getStockAggregateData} from "../api.js";
import {Button} from "react-bootstrap";

function Home() {

    const handleButtonClick = () => {
        getStockAggregateData("AAPL", 1, "day", "2023-01-09", "2023-02-10")
            .then((res) => {})
            .catch((err) => {})
    };

    return (
        <div>
            <h1 className="text-2xl">Welcome to Home Page</h1>
            {/* Dodaj przycisk */}
            <Button onClick={handleButtonClick}>Click</Button>
        </div>
    );
}
export default Home;