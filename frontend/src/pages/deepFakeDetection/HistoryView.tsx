import React, { useEffect, useState } from "react";
import SubNav from "../../components/SubNav.tsx";
import { fetchHistory, resetHistory, type DetectionResult } from "../../api/deepFakeDetectorApi.ts";
import "../../styles/deepFakeDetection/HistoryView.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const buttonLinks = [
    { path: "/about-deepfake-detector", line1: "Learn more about", line2: "The model" },
    { path: "/deepfake-detector", line1: "Test the", line2: "Detector" },
    { path: "/history", line1: "See previous", line2: "Results" },
];

const HistoryView: React.FC = () => {
    const [history, setHistory] = useState<DetectionResult[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        setLoading(true);
        const data = await fetchHistory();
        setHistory(data);
        setLoading(false);
    };

    const handleReset = async () => {
        if (window.confirm("Are you sure you want to reset the detection history?")) {
            await resetHistory();
            await loadHistory();
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="container">
            <SubNav buttons={buttonLinks} />

            <h1>Detection History</h1>
            <div className="container history-view">
            {loading ? (
                <p className="loading-text">Loading history...</p>
            ) : history.length === 0 ? (
                <div className="empty-message">
                    <i className="bi bi-archive-fill empty-icon"></i>
                    <p>No detection history found. Start by testing some files!</p>
                </div>
            ) : (
                <>
                    <table className="history-table table table-hover shadow-sm">
                        <thead className="table-dark">
                        <tr>
                            <th>Filename</th>
                            <th>Real Probability</th>
                            <th>Fake Probability</th>
                            <th>Timestamp</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((entry, idx) => (
                            <tr key={idx}>
                                <td>{entry.filename || "-"}</td>
                                <td>{entry.real_prob !== undefined ? entry.real_prob.toFixed(4) : "-"}</td>
                                <td>{entry.fake_prob !== undefined ? entry.fake_prob.toFixed(4) : "-"}</td>
                                <td>{entry.timestamp || entry.reset_at || "-"}</td>
                                <td>
                                    {entry.error ? (
                                        <span className="text-danger">
                        <i className="bi bi-x-circle-fill me-1"></i>Error
                      </span>
                                    ) : entry.reset_at ? (
                                        <span className="text-info">
                        <i className="bi bi-arrow-clockwise me-1"></i>History Reset
                      </span>
                                    ) : (
                                        <span className="text-success">
                        <i className="bi bi-check-circle-fill me-1"></i>OK
                      </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="reset-container">
                        <button className="btn btn-danger btn-reset" onClick={handleReset}>
                            <i className="bi bi-trash-fill me-2"></i>Reset History
                        </button>
                    </div>
                </>
            )}
        </div>
        </div>
    );
};

export default HistoryView;
