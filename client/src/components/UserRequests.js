import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRequests = () => {
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:3001/user-requests');
            setUserRequests(response.data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Распределение числа запросов между пользователями</h2>
            <table>
                <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Number of Requests</th>
                </tr>
                </thead>
                <tbody>
                {userRequests.map((user, index) => (
                    <tr key={index}>
                        <td>{user._id}</td>
                        <td>{user.numberOfRequests}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRequests;
