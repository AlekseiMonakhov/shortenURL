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
            {urls.map((url) => {
                const fullUrl = url.shortenedUrl.replace('http://localhost/', 'http://localhost:3001/');
                return (
                    <tr key={url._id}>
                        <td>{url.url}</td>
                        <td><a href={fullUrl} target="_blank" rel="noopener noreferrer">{fullUrl}</a></td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default UrlTable;
