import SubNav from "../../components/SubNav.tsx";
import "../../styles/audioWatermarking/AboutModel.css";
import {useNavigate} from "react-router-dom";

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

const AboutModel = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/watermarking");
    };

    return(
        <div className="container">
            <SubNav buttons={buttonLinks} />
            <div className="intro-section mb-2">
                <h1 className="intro-title">AI Watermarking to mark your Audios</h1>
                <p className="intro-description">
                    Cutting-edge audio integrity solution powered by neural watermarking, enabling precise,
                    tamper-resistant
                    traceability down to the waveform.
                </p>
                <div className="center-container">
                    <button className="bt-button" onClick={handleNavigate}>
                        <span className="text">Try It Now</span>
                    </button>
                </div>
            </div>

            <div className="features-row">
                <div className="feature-card">
                    <div className="icon">🔐</div>
                    <h3 className="title">State-of-the-Art Robustness</h3>
                    <p className="tx-description">
                        Designed to withstand common audio manipulations such as compression, pitch shifting, and resampling, ensuring the watermark remains intact.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="icon">⚡</div>
                    <h3 className="title">High-Resolution Localization</h3>
                    <p className="tx-description">
                        Detects watermarks with sample-level precision (1/16,000 of a second), enabling pinpoint identification of AI-generated segments.
                    </p>
                </div>
                <div className="feature-card">
                    <div className="icon">🚀</div>
                    <h3 className="title">Open-Source & Trainable</h3>
                    <p className="tx-description">
                        AudioSeal is open-source, allowing for transparency and community contributions. It can be fine-tuned to adapt to specific requirements.
                    </p>
                </div>
            </div>


            <div className="center-container">
                <h2>Model Architecture & Technical Overview</h2>
            </div>

            <div className="watermarking-section">
                <div className="text-content">
                    <p>
                        AudioSeal employs a dual-model architecture: a <strong>Watermark Generator</strong> and
                        a <strong>Watermark Detector</strong>, inspired by Meta's EnCodec design. This combination
                        ensures robust, fast, and imperceptible watermarking.
                    </p>

                    <ul className="architecture-list">
                        <li>
                            <strong>Watermark Generator:</strong> Encodes input audio using 1D convolutions and residual
                            blocks to embed a watermark, then reconstructs the audio waveform imperceptibly.
                        </li>
                        <li>
                            <strong>Watermark Detector:</strong> Processes audio with a shared encoder, upsamples via
                            transposed convolutions, and outputs a probability map identifying the watermark.
                        </li>
                    </ul>

                    <p>
                        For detailed implementation and research references, check the <a
                        href="https://github.com/facebookresearch/audioseal" target="_blank" rel="noopener noreferrer">GitHub
                        repository</a> or the <a href="https://arxiv.org/abs/2401.17264" target="_blank"
                                                 rel="noopener noreferrer">research paper</a>.
                    </p>
                </div>

                <div className="image-content">
                    <img src="/audioseal_architecture.jpeg" alt="AudioSeal Architecture" />
                </div>
            </div>

            <div className="center-container mb-3">
                <h2>How it Works</h2>
            </div>
            <div className="grid-container">
                <div className="card">
                    <div className="title">Generation & Watermarking</div>
                    <div className="icon"><i className="bi bi-soundwave"></i></div>
                    <div className="content">
                        <p>The generator embeds an inaudible watermark into the audio waveform using psychoacoustic masking techniques.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="title">Distribution & Tracking</div>
                    <div className="icon"><i className="bi bi-graph-up-arrow"></i></div>
                    <div className="content">
                        <p>The watermarked audio is distributed across platforms, maintaining the watermark's integrity through common audio manipulations.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="title">Verification & Authentication</div>
                    <div className="icon"><i className="bi bi-shield-lock-fill"></i></div>
                    <div className="content">
                        <p>The detector scans the audio to identify and localize the watermark, confirming authenticity and detecting any tampered segments.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModel;