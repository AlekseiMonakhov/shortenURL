import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlForm from './components/UrlForm';
import UrlTable from './components/UrlTable';
import UserRequests from './components/UserRequests';
axios.defaults.withCredentials = true;


const App = () => {
    const [urls, setUrls] = useState([]);

    const fetchUrls = async () => {
        const response = await axios.get('http://localhost:3001/urls');
        setUrls(response.data);
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    const handleNewUrl = (url) => {
        setUrls(prevUrls => [url, ...prevUrls]);
    };

    return (
        <Router>
            <div className="App">
                <h1>URL Shortener</h1>
                <Routes>
                    <Route path="/" element={
                        <>
                            <UrlForm onNewUrl={handleNewUrl} />
                            <UrlTable urls={urls} />
                        </>
                    } />
                    <Route path="/requests" element={<UserRequests />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
