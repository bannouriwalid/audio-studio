import React from "react";
import SubNav from "../../components/SubNav.tsx";
import {useNavigate} from "react-router-dom";

const buttonLinks = [
    { path: "/about-deepfake-detector", line1: "Learn more about", line2: "The model" },
    { path: "/deepfake-detector", line1: "Test the", line2: "Detector"  },
    { path: "/history", line1: "See previous", line2: "Results" },
];


const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/deepfake-detector");
    };
    return (
        <div className="container">
            <SubNav buttons={buttonLinks} />

            <div className="intro-section mb-2">
                <h1 className="intro-title">Audio Deepfake Detection</h1>
                <p className="intro-description">
                    This system uses a state-of-the-art self-supervised learning model based on Wav2Vec 2.0 to detect artificially generated (deepfake) audio.
                    It analyzes audio waveforms to predict the likelihood of real versus fake speech, helping to fight audio misinformation and fraud.
                </p>
            </div>

            <div className="center-container">
                <button className="bt-button" onClick={handleNavigate}>
                    <span className="text">Try It Now</span>
                </button>
            </div>

            <div className="features-row">
                <div className="feature-card">
                    <div className="icon">🧠</div>
                    <h3 className="title">Self-Supervised Learning</h3>
                    <p className="tx-description">
                        Built on Facebook's Wav2Vec 2.0, the model learns from large amounts of unlabeled audio, enabling it to understand speech representations without heavy annotation.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="icon">🎧</div>
                    <h3 className="title">Robust Audio Analysis</h3>
                    <p className="tx-description">
                        Capable of processing raw audio waveforms directly, with pre-processing steps for standardization, ensuring reliable detection across diverse audio qualities.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="icon">⚡</div>
                    <h3 className="title">Efficient & Scalable</h3>
                    <p className="tx-description">
                        The architecture is designed for fast inference on GPUs or CPUs, suitable for both research and real-world deployment scenarios.
                    </p>
                </div>
            </div>

            <div className="watermarking-section">
                <div className="text-content">
                    <h2>How Audio Deepfake Detection Works</h2>
                    <p>
                        The detector leverages a 24-layer transformer encoder trained via self-supervised learning on speech audio. The Wav2Vec 2.0 model extracts rich latent representations from raw audio signals.
                    </p>
                    <p>
                        These features are then pooled and passed through a classifier trained to distinguish between real and synthetic speech, outputting probabilities for each class.
                    </p>
                    <p>
                        This approach requires no manual feature engineering and generalizes well to various audio conditions and deepfake generation methods.
                    </p>
                    <p>
                        Such technology is vital for mitigating misuse of synthetic audio in misinformation, fraud, and other malicious applications.
                    </p>
                </div>

                <div className="image-content">
                    <img
                        src="/Architecture-of-Wav2Vec2.png"
                        alt="Deepfake Detector Architecture Diagram"
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                </div>
            </div>

            <div className="center-container mb-3">
                <h2 className="intro-title">Supported Audio Formats & Specs</h2>
            </div>

            <div className="center-container mb-3">
                <ul className="audio-specs-list">
                    <li>Audio Format: WAV (PCM)</li>
                    <li>Sample Rate: 16 kHz (resampling applied if needed)</li>
                    <li>Mono Channel (stereo audio averaged)</li>
                    <li>Max file size: ~10 MB recommended</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;