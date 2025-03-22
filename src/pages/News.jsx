import React, { useState, useEffect } from 'react';
import { getNews } from '../api.js';
import {Button, Modal} from "react-bootstrap";


function MyVerticallyCenteredModal({ selectedArticle, ...props }) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {selectedArticle ? selectedArticle.title : 'Brak tytułu'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedArticle && selectedArticle.image_url && (
                    <img
                        src={selectedArticle.image_url}
                        alt=""
                        className="img-fluid mb-3"
                    />
                )}
                <p><strong>Autor:</strong> {selectedArticle?.author || 'Brak autora'}</p>
                <p>
                    <strong>Data publikacji:</strong>{' '}
                    {selectedArticle
                        ? new Date(selectedArticle.published_utc).toLocaleString('pl-PL')
                        : 'Brak daty'}
                </p>
                <p>{selectedArticle?.description || 'Brak opisu'}</p>
                {selectedArticle && (
                    <a
                        href={selectedArticle.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Przeczytaj pełny artykuł
                    </a>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}


function News() {
    // Definicja stanów
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const articlesPerPage = 15;
    const [modalShow, setModalShow] = React.useState(false);



    // Pobieranie danych z API
    useEffect(() => {
        getNews()
            .then(data => {
                if (data.data.status === 'success') {
                    setArticles(data.data.data); // Zakładam, że dane są w polu 'data'
                }
            })
            .catch(error => console.error('Błąd pobierania danych:', error));
    }, []);

    // Logika paginacji
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = articles.slice(startIndex, endIndex);

    // Funkcje do zmiany strony
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (
        <div className="container-fluid mt-4 text-center" style={{height: "100vh", width: "100vw"}}>
            <h1 className="text-2xl">News</h1>

            <div className="list-group mb-3">
                {currentArticles.map((article, index) => (
                    <Button
                        key={index}
                        variant="primary"
                        onClick={() => {
                            setModalShow(true)
                            setSelectedArticle(article)
                        }}
                        className="mb-2"
                    >
                        {article.title}
                    </Button>
                ))}
            </div>

            {/* Paginacja */}
            <div className="d-flex justify-content-center align-items-center">
                <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="primary"
                >
                    Poprzednia
                </Button>
                <span className="mx-3">Strona {currentPage} z {totalPages}</span>
                <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="primary"
                >
                    Następna
                </Button>
            </div>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                selectedArticle={selectedArticle}
            />

        </div>
    );
}

export default News;