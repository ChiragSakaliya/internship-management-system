
import React, { useEffect, useState } from "react";
import styles from "./FacultyDashboard.module.css";

const FacultyDashboard = () => {
    const [faculties, setFaculties] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch("http://localhost:5000/faculties");
                if (!response.ok) {
                    throw new Error("Failed to fetch faculties data");
                }
                const data = await response.json();
                setFaculties(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFaculties();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/faculties/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete faculty");
            }
            setFaculties((prev) => prev.filter((faculty) => faculty.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const action = currentStatus === 0 ? "activate" : "deactivate";
        try {
            const response = await fetch(`http://localhost:5000/faculties/${id}/toggle-active`, {
                method: "PUT",
            });
            if (!response.ok) {
                throw new Error(`Failed to ${action} faculty`);
            }
            setFaculties((prev) =>
                prev.map((faculty) =>
                    faculty.id === id ? { ...faculty, isActive: currentStatus === 0 ? 1 : 0 } : faculty
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredFaculties = faculties.filter((faculty) =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h2 className={styles.heading}>Faculties</h2>
                <p className={styles.subheading}>Manage registered faculties</p>
            </div>

            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Search faculty..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>College</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFaculties.length > 0 ? (
                        filteredFaculties.map((faculty) => (
                            <tr key={faculty.id}>
                                <td>{faculty.name}</td>
                                <td>{faculty.email}</td>
                                <td>{faculty.address}</td>
                                <td>{faculty.college}</td>
                                <td className={faculty.isActive === 0 ? styles.inactive : styles.active}>
                                    {faculty.isActive === 0 ? "Inactive" : "Active"}
                                </td>
                                <td>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDelete(faculty.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${
                                            faculty.isActive === 0 ? styles.activateButton : styles.deactivateButton
                                        }`}
                                        onClick={() => handleToggleStatus(faculty.id, faculty.isActive)}
                                    >
                                        {faculty.isActive === 0 ? "Activate" : "Deactivate"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className={styles.noData}>
                                No faculties found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FacultyDashboard;
