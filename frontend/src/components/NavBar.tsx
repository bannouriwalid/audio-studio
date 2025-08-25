import "../styles/components/NavBar.css";

export default function CustomNavbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 fixed-top" style={{zIndex: 1050}}>
            {/* Left: Brand */}
            <a className="navbar-brand d-flex align-items-center me-5" href="/about-tts-models">
                <img
                    src="/logo.svg"
                    alt="Technozor Logo"
                    style={{height: "40px", width: "auto"}}
                    className="me-2"
                />
                <span className="fw-bolder fs-5 text-white">TECHNOZOR Audio Studio</span>
            </a>

            {/* Center-left: Nav Links */}
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto d-flex align-items-center gap-3">
                    <li className="nav-item">
                        <a className="fs-6 fw-normal nav-link text-white" href="/about-tts-models">
                            <i className="bi bi-translate me-1"></i> Text to Speech
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="fs-6 fw-normal nav-link text-white" href="/about-voice-cloning">
                            <i className="bi bi-person-bounding-box me-1"></i> Voice Cloning
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="fs-6 fw-normal nav-link text-white" href="/about_watermarking-model">
                            <i className="bi bi-soundwave me-1"></i> AI Watermarking
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="fs-6 fw-normal nav-link text-white" href="/about-deepfake-detector">
                            <i className="bi bi-shield-lock me-1"></i> Deepfake Detector
                        </a>
                    </li>
                </ul>
                {/* Right: Sign in button */}
                <div className="d-flex ms-auto">
                    <a className="btn btn-outline-light">
                        <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                    </a>
                </div>
            </div>
        </nav>
    );
}
