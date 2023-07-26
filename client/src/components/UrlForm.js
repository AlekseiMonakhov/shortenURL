import React, { useState } from 'react';
import axios from 'axios';

const UrlForm = ({ onNewUrl }) => {
    const [url, setUrl] = useState('');
    const [customUrl, setCustomUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('http://localhost:3001/urls', { originalUrl: url, shortenedUrl: customUrl });
        onNewUrl(response.data);
        setUrl('');
        setCustomUrl('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Original URL:
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </label>
            <label>
                Custom Shortened URL (optional):
                <input type="text" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} />
            </label>
            <button type="submit">Shorten</button>
        </form>
    );
};

export default UrlForm;