import React from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";

function SearchModal({
                         show,
                         onHide,
                         title,
                         searchQuery,
                         setSearchQuery,
                         onSearch,
                         searchResults,
                         renderResult,
                         getKey,
                         onSelect,
                         placeholder,
                     }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded mb-2 w-100"
                    placeholder={placeholder}
                />
                <ListGroup className="mt-3">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <ListGroup.Item
                                key={getKey(result)}
                                action
                                onClick={() => onSelect(result)}
                            >
                                {renderResult(result)}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-muted mt-2">Brak wyników</p>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Zamknij</Button>
                <Button variant="dark" onClick={() => onSearch(searchQuery)}>Szukaj</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SearchModal;