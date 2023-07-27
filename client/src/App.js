import React from 'react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Router from "./router";
import styles from './App.module.css';

axios.defaults.withCredentials = true;

const App = () => {
    return (
        <BrowserRouter>
            <div className={styles.App}>
                <h1 className={styles.header}>URL Shortener</h1>
                <Router />
            </div>
        </BrowserRouter>
    );
};

export default App;
