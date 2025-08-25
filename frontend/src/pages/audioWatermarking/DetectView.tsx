import { useState, type ChangeEvent } from "react";
import FileUploadForm from "../../components/FileUploadForm.tsx";
import AudioPlayer from "../../components/AudioPlayer.tsx";
import SubNav from "../../components/SubNav.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    detectWatermark,
    getProbabilityMap,
} from "../../api/audioWatermarkingApi.ts";
import "../../styles/audioWatermarking/EmbedView.css"; // ✅ reuse same styling as EmbedView

const buttonLinks = [
    {
        path: "/about_watermarking-model",
        line1: "Learn more about",
        line2: "The model",
    },
    {
        path: "/watermarking",
        line1: "Try the",
        line2: "Watermarker",
    },
    {
        path: "/watermarking-detection",
        line1: "Try the",
        line2: "Detector",
    },
];

const DetectorView = () => {
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [probMap, setProbMap] = useState<any>(null);
    const [loadingDetect, setLoadingDetect] = useState<boolean>(false);
    const [loadingMap, setLoadingMap] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setInputFile(e.target.files[0]);
            setResult(null);
            setProbMap(null);
        }
    };

    const handleDetect = async () => {
        if (!inputFile) {
            toast.error("Please upload an audio file.");
            return;
        }

        try {
            setLoadingDetect(true);
            const res = await detectWatermark(inputFile);
            setResult(res);
            toast.success("Detection completed!");
        } catch (err) {
            console.error("Detection error:", err);
            toast.error("Error during audioWatermarking detection.");
        } finally {
            setLoadingDetect(false);
        }
    };

    const handleProbabilityMap = async () => {
        if (!inputFile) {
            toast.error("Please upload an audio file.");
            return;
        }
        try {
            setLoadingMap(true);
            const res = await getProbabilityMap(inputFile);
            setProbMap(res);
            toast.success("Probability map fetched!");
        } catch (err) {
            console.error("Probability map error:", err);
            toast.error("Error fetching probability map.");
        } finally {
            setLoadingMap(false);
        }
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks}/>
            <h1>watermark detection</h1>

            <div className="aw-special-row">
                <FileUploadForm onChange={handleFileChange}/>

                <div className="mt-3 mb-3">
                    <AudioPlayer src={inputFile ? URL.createObjectURL(inputFile) : undefined}/>
                </div>

                <div className="this-wrapper">
                    <button
                        onClick={handleDetect}
                        disabled={loadingDetect}
                        type="button"
                        className="this-generate-btn"
                    >
                        {loadingDetect ? (
                            <span>Detecting ...</span>
                        ) : (
                            <>
                                <i className="bi bi-search icon-white-big"></i>
                                <span>Detect Watermark</span>
                            </>
                        )}
                    </button>
                </div>

                {result && (
                    <div
                        className={`detection-container ${
                            result.is_watermarked ? "detection-success" : "detection-failure"
                        }`}
                    >
                        <div className="detection-header">
                            <div className="detection-icon">
                                {result.is_watermarked ? "✅" : "❌"}
                            </div>
                            <div>
                                <h4 className="detection-title">
                                    {result.is_watermarked
                                        ? "Watermark Detected"
                                        : "No Watermark Found"}
                                </h4>
                                <p className="detection-subtext">
                                    {result.is_watermarked
                                        ? "This audio contains a valid watermark."
                                        : "No watermark was found in the uploaded audio."}
                                </p>
                            </div>
                        </div>

                        <div className="detection-info">
                            <p>
                                <strong>Detection Confidence:</strong>{" "}
                                {(result.probability * 100).toFixed(2)}%
                            </p>

                            {result.decoded_bits && result.decoded_bits.length > 0 && (
                                <p>
                                    <strong>Decoded Bits:</strong>{" "}
                                    <span className="decoded-bits">
                                        {result.decoded_bits.join(" ")}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="this-wrapper">
                    <button
                        onClick={handleProbabilityMap}
                        disabled={loadingMap}
                        type="button"
                        className="this-generate-btn"
                    >
                        {loadingMap ? (
                            <span>Fetching ...</span>
                        ) : (
                            <>
                                <i className="bi bi-graph-up icon-white-big"></i>
                                <span>Get Probability Map</span>
                            </>
                        )}
                    </button>
                </div>

                {probMap && (
                    <div className="prob-summary-container">
                        <h4 className="summary-title">📊 Probability Map Summary</h4>
                        <div className="summary-grid">
                            <div className="summary-card">
                                <div className="summary-header">
                                    <span className="summary-icon">🎯</span>
                                    <h5>Frame Probabilities</h5>
                                </div>
                                <ul>
                                    <li><strong>Total Points:</strong> {probMap.frame_stats.total_points}</li>
                                    <li><strong>Above Threshold:</strong> {probMap.frame_stats.above_threshold}</li>
                                    <li><strong>% Above
                                        Threshold:</strong> {probMap.frame_stats.percentage_above_threshold.toFixed(2)}%
                                    </li>
                                    <li><strong>Min:</strong> {probMap.frame_stats.min.toFixed(4)}</li>
                                    <li><strong>Max:</strong> {probMap.frame_stats.max.toFixed(4)}</li>
                                    <li><strong>Mean:</strong> {probMap.frame_stats.mean.toFixed(4)}</li>
                                    <li><strong>Std Dev:</strong> {probMap.frame_stats.std.toFixed(4)}</li>
                                </ul>
                            </div>

                            <div className="summary-card">
                                <div className="summary-header">
                                    <span className="summary-icon">🧬</span>
                                    <h5>Bit Confidences</h5>
                                </div>
                                <ul>
                                    <li><strong>Total Bits:</strong> {probMap.bit_stats.total_bits}</li>
                                    <li><strong>Min:</strong> {probMap.bit_stats.min.toFixed(4)}</li>
                                    <li><strong>Max:</strong> {probMap.bit_stats.max.toFixed(4)}</li>
                                    <li><strong>Mean:</strong> {probMap.bit_stats.mean.toFixed(4)}</li>
                                    <li><strong>Std Dev:</strong> {probMap.bit_stats.std.toFixed(4)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                <h2 className="tutorial-title mt-3">🚀 Quick Start Guide</h2>

                <div className="this-tutorial-step">
                    <div className="step-number">1️⃣</div>
                    <div className="step-content">
                        <h3>Upload Your Audio Clip</h3>
                        <p>Select an audio file you want to analyze for a watermark.</p>
                        <p className="note">
                            Recommended format: <code>.wav</code> for best results.
                        </p>
                    </div>
                </div>

                <div className="this-tutorial-step">
                    <div className="step-number">2️⃣</div>
                    <div className="step-content">
                        <h3>Detect Watermark</h3>
                        <p>Click the <strong>Detect Watermark</strong> button to check if the file contains an embedded
                            watermark.</p>
                        <p className="note">
                            The system will display detection confidence and any decoded bits if found.
                        </p>
                    </div>
                </div>

                <div className="this-tutorial-step">
                    <div className="step-number">3️⃣</div>
                    <div className="step-content">
                        <h3>View Probability Map</h3>
                        <p>Click <strong>Get Probability Map</strong> for deeper insights into the detection process.
                        </p>
                        <p className="note">
                            You’ll see frame-level statistics and bit-level confidence scores for detailed analysis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetectorView;
