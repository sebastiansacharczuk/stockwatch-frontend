import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const DisposableToast = ({ header, body, disposeAfter = 3000, animation = true }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (show && disposeAfter) {
            const timer = setTimeout(() => {
                setShow(false);
            }, disposeAfter);

            return () => clearTimeout(timer);
        }
    }, [show, disposeAfter]);

    if (!show) {
        return null;
    }

    return (
        <Toast
            show={show}
            onClose={() => setShow(false)} // Ręczne zamykanie Toast
            animation={animation}
            style={{
                position: 'fixed', // Przypięty do ekranu
                top: '20px',       // 20 pikseli od góry
                left: '50%',       // Wyśrodkowany poziomo
                transform: 'translateX(-50%)', // Centrowanie
                zIndex: 9999,      // Toast na wierzchu
            }}
        >
            <Toast.Header>
                <strong className="me-auto">{header}</strong>
            </Toast.Header>
            <Toast.Body>{body}</Toast.Body>
        </Toast>
    );
};

export default MyToast;