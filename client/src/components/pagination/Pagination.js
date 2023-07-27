import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const pagesCount = Math.ceil(totalItems / itemsPerPage);
    return (
        <ul className={styles.pagination}>
            {Array.from({ length: pagesCount }, (_, i) => i + 1).map((pageNumber) => (
                <li key={pageNumber} className={`${styles.pageItem} ${pageNumber === currentPage ? styles.paginationItemActive : ''}`}>
                    <a className={styles.paginationLink} href="!#" onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNumber);
                    }}>
                        {pageNumber}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default Pagination;
