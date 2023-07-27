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
    );
};

export default UrlTable;
