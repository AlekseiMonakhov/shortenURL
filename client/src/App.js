import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UrlTable from './components/UrlTable';
import UserRequests from './components/UserRequests';

axios.defaults.withCredentials = true;

const App = () => {
    return (
        <Router>
            <div className="App">
                <h1>URL Shortener</h1>
                <Routes>
                    <Route path="/" element={<UrlTable />} />
                    <Route path="user-requests" element={<UserRequests />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
