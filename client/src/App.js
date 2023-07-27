import React from 'react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Router from "./router";

axios.defaults.withCredentials = true;

const App = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <h1>URL Shortener</h1>
                <Router />
            </div>
        </BrowserRouter>
    );
};

export default App;
