import React, { useState } from 'react';
import axios from 'axios';
import styles from './UrlForm.module.css';

const UrlForm = ({ onNewUrl }) => {
    const [url, setUrl] = useState('');
    const [customSubpart, setCustomSubpart] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post(
            'http://localhost:3001/api/v1/shorten',
            { url: url, subpart: customSubpart });

        if (response.status === 205) {
            alert('This subpart is already taken');
            setCustomSubpart('');
        } else if (response.status === 200) {
            onNewUrl(response.data);
            setUrl('');
            setCustomSubpart('');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
                Original URL:
                <input className={styles.input} type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </label>
            <label className={styles.label}>
                Custom subpart (optional):
                <input className={styles.input} type="text" value={customSubpart} onChange={(e) => setCustomSubpart(e.target.value)} />
            </label>
            <button className={styles.button} type="submit">Shorten</button>
        </form>
    );
};

export default UrlForm;
