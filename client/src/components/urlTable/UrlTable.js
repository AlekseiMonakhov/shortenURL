import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UrlForm from '../urlForm/UrlForm';
import {Link} from "react-router-dom";
import Pagination from '../pagination/Pagination';
import styles from './UrlTable.module.css';

const UrlTable = () => {
    const [urls, setUrls] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const urlsPerPage = 10;

    useEffect(() => {
        const fetchUrls = async () => {
            const response = await axios.get('http://localhost:3001/api/v1/urls');
            setUrls(response.data);
        };
        fetchUrls();
    }, []);

    const handleNewUrl = (url) => {
        setUrls(prevUrls => [url, ...prevUrls]);
    };

    const indexOfLastUrl = currentPage * urlsPerPage;
    const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
    const currentUrls = urls.slice(indexOfFirstUrl, indexOfLastUrl);

    return (
        <>
            <UrlForm onNewUrl={handleNewUrl} />
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Original URL</th>
                    <th>Short URL</th>
                </tr>
                </thead>
                <tbody>
                {currentUrls.map((url) => {
                    const fullUrl = `http://localhost:3001/api/v1/${url.shortenedUrl}`;
                    return (
                        <tr key={url._id}>
                            <td>{url.url}</td>
                            <td><a href={fullUrl}>{fullUrl}</a></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <Pagination
                totalItems={urls.length}
                itemsPerPage={urlsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <nav className={styles.linkContainer}>
                <Link className={styles.link} to="/user-requests">View Users Requests</Link>
            </nav>
        </>
    );
};

export default UrlTable;
