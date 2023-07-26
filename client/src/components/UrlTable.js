import React from 'react';

const UrlTable = ({ urls }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Original URL</th>
                <th>Short URL</th>
            </tr>
            </thead>
            <tbody>
            {urls.map((url) => (
                <tr key={url._id}>
                    <td>{url.originalUrl}</td>
                    <td>{url.shortUrl}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UrlTable;