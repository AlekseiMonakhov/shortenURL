import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UrlForm from './UrlForm';

const UrlTable = () => {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const fetchUrls = async () => {
            const response = await axios.get('http://localhost:3001/urls');
            setUrls(response.data);
        };
        fetchUrls();
    }, []);

    const handleNewUrl = (url) => {
        setUrls(prevUrls => [url, ...prevUrls]);
    };

    return (
        <>
            <UrlForm onNewUrl={handleNewUrl} />
            <table>
                <thead>
                <tr>
                    <th>Original URL</th>
                    <th>Short URL</th>
                </tr>
                </thead>
                <tbody>
                {urls.map((url) => {
                    const fullUrl = `http://localhost:3001/${url.shortenedUrl}`;
                    return (
                        <tr key={url._id}>
                            <td>{url.url}</td>
                            <td><a href={fullUrl} target="_blank" rel="noopener noreferrer">{fullUrl}</a></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </>
    );
};

export default UrlTable;
