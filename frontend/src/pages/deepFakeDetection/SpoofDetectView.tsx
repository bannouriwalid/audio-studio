import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import SubNav from "../../components/SubNav.tsx";
import { detectDeepfake, type DetectionResult } from "../../api/deepFakeDetectorApi.ts"; // adjust path as needed
import "../../styles/deepFakeDetection/SpoofDetectView.css";

const buttonLinks = [
    { path: "/about-deepfake-detector", line1: "Learn more about", line2: "The model" },
    { path: "/deepfake-detector", line1: "Test the", line2: "Detector" },
    { path: "/history", line1: "See previous", line2: "Results" },
];

const SpoofDetectView: React.FC = () => {
    const [results, setResults] = useState<DetectionResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setResults([]);
        setError(null);

        if (acceptedFiles.length === 0) {
            setError("Please upload one or more audio files.");
            return;
        }

        setLoading(true);

        try {
            const data = await detectDeepfake(acceptedFiles);
            setResults(Array.isArray(data) ? data : [data]);
        } catch (err: any) {
            setError(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: { "audio/*": [] },
        multiple: false,
    });

    return (
        <div className="container">
            <SubNav buttons={buttonLinks}/>
            <h1>Try the Deepfake Detection Model</h1>
            <div className="content-wrapper">
                <div className="try-model-page">
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? "active" : ""} ${isDragReject ? "reject" : ""}`}
                        aria-label="Drop audio files here or click to upload"
                    >
                        <input {...getInputProps()} />
                        <i className="bi bi-upload" style={{fontSize: 24}}></i>

                        {isDragReject ? (
                            <p className="dropzone-text reject-text">Unsupported file type...</p>
                        ) : isDragActive ? (
                            <p className="dropzone-text">Drop files here ...</p>
                        ) : (
                            <p className="dropzone-text">
                                Drag & drop an audio file here, or click to select
                            </p>
                        )}
                    </div>

                    {loading && <p className="loading-text">Detecting deepfake probabilities...</p>}

                    {error && <p className="error-text">{error}</p>}

                    {results.length > 0 && (
                        <div className="results-list">
                            <div
                                className={`result-card ${
                                    results[0].error
                                        ? "error"
                                        : results[0].fake_prob && results[0].fake_prob > 0.5
                                            ? "fake"
                                            : "real"
                                }`}
                            >
                                {/* Status badge */}
                                <div className="status-badge">
                                    {results[0].error
                                        ? "Error ❌"
                                        : results[0].fake_prob! > 0.5
                                            ? "Fake ⚠️"
                                            : "Real ✅"}
                                </div>

                                <h3>{results[0].filename}</h3>

                                {results[0].error ? (
                                    <p className="error-msg">Error: {results[0].error}</p>
                                ) : (
                                    <>
                                        <p>
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <strong>Real Probability:</strong> {(results[0].real_prob! * 100).toFixed(2)}%
                                        </p>
                                        <p>
                                            <i className="bi bi-x-circle-fill text-danger me-2"></i>
                                            <strong>Fake Probability:</strong> {(results[0].fake_prob! * 100).toFixed(2)}%
                                        </p>
                                        <p className="prediction">
                                            Prediction: {results[0].fake_prob! > 0.5 ? "Fake ⚠️" : "Real ✅"}
                                        </p>
                                        {results[0].timestamp && (
                                            <p className="timestamp">
                                                Detected at: {new Date(results[0].timestamp).toLocaleString()}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default SpoofDetectView;