import {api} from "../api.js";
import {Button} from "react-bootstrap";

function Home() {

    const handleButtonClick = () => {
        api.get("user_info").then((r) => {
            console.log(r.data);
        });
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