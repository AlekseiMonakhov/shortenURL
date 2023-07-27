import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UrlForm from './UrlForm';
import {Link} from "react-router-dom";

const UrlTable = () => {
    const [urls, setUrls] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const urlsPerPage = 5;

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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <UrlForm onNewUrl={handleNewUrl} />
            <table>
                <thead>
                <tr>
                    <th>Original URL</th>
                    <th>Short URL</th>
                    <nav>
                        <Link to="/user-requests">View Users Requests</Link>
                    </nav>
                </tr>
                </thead>
                <tbody>
                {currentUrls.map((url) => {
                    const fullUrl = `http://localhost:3001/api/v1/${url.shortenedUrl}`;
                    return (
                        <tr key={url._id}>
                            <td>{url.url}</td>
                            <td><a href={fullUrl} >{fullUrl}</a></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <nav>
                <ul className="pagination">
                    {Array(Math.ceil(urls.length / urlsPerPage)).fill().map((_, i) =>
                        <li key={i}>
                            <a onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </a>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default UrlTable;
