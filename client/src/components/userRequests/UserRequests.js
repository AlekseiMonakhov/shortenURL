import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import styles from './UserRequests.module.css';
import Pagination from '../pagination/Pagination';

const UserRequests = () => {
    const [userRequests, setUserRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:3001/api/v1/user-requests');
            setUserRequests(response.data);
        };
        fetchData();
    }, []);

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = userRequests.slice(indexOfFirstRequest, indexOfLastRequest);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Distribution of the number of clicks between users</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Clicks</th>
                </tr>
                </thead>
                <tbody>
                {currentRequests.map((user, index) => (
                    <tr key={index}>
                        <td>{user._id}</td>
                        <td>{user.numberOfRequests}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                totalItems={userRequests.length}
                itemsPerPage={requestsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <nav className={styles.linkContainer}>
                <Link className={styles.link} to="/">Home</Link>
            </nav>
        </div>
    );
};

export default UserRequests;
