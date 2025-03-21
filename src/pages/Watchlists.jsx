import {createWatchlist, getAllWatchlists} from "../api.js";
import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

function MyVerticallyCenteredModal({ watchlistName, setWatchlistName, ...props }) {
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Watchlist name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={watchlistName}
                    onChange={(e) => setWatchlistName(e.target.value)}
                    className="p-2 border rounded mb-2 w-100"
                    placeholder="Enter watchlist name"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
                <Button onClick={props.onSubmit}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Watchlists() {
    const [modalShow, setModalShow] = React.useState(false);
    const [watchlistName, setWatchlistName] = useState('');
    const [watchlists, setWatchlists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllWatchlists()
            .then(data => {
                if (data.data.status === 'success') {
                    setWatchlists(data.data.data); // Zakładam, że dane są w polu 'data'
            }
        })
            .catch(error => console.error('Błąd pobierania danych:', error));
    }, []);

    return (
        <div>
            <h1 className="text-2xl">Welcome to Watchlists Page</h1>
            <Button variant="primary" onClick={() => {setModalShow(true)}}>+</Button>
            <div className="list-group mb-3">
            {watchlists.length > 0 ? (
                    watchlists.map(watchlist => (
                        <button
                            key={watchlist.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => navigate(`/watchlist/${watchlist.id}`)}
                        >
                            {watchlist.name}
                        </button>
                    ))
                ) : (
                    <p>No watchlists available</p>
                )}
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                watchlistName={watchlistName}
                setWatchlistName={setWatchlistName}
                onHide={() => setModalShow(false)}
                onSubmit={ () => createWatchlist(watchlistName) }
            />
        </div>
    );
}
export default Watchlists;