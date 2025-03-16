import {api} from "../api.js";

function News() {

    const handleButtonClick = () => {
        api.get("user_info").then((r) => {
            console.log(r.data);
        });
    };

    return (
        <div>
            <h1 className="text-2xl">Welcome to News Page</h1>
            {/* Dodaj przycisk */}
            <button onClick={handleButtonClick} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Kliknij</button>
        </div>
    );
}
export default News;