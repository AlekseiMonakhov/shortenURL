import React, { useState } from 'react';
import axios from 'axios';

const UrlForm = ({ onNewUrl }) => {
    const [url, setUrl] = useState('');
    const [customSubpart, setCustomSubpart] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post(
            'http://localhost:3001/shorten',
            { url: url, subpart: customSubpart });
        onNewUrl(response.data);
        setUrl('');
        setCustomSubpart('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Original URL:
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </label>
            <label>
                Custom subpart (optional):
                <input type="text" value={customSubpart} onChange={(e) => setCustomSubpart(e.target.value)} />
            </label>
            <button type="submit">Shorten</button>
        </form>
    );
};

export default UrlForm;
