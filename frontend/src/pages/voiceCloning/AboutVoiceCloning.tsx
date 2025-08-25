import SubNav from "../../components/SubNav.tsx";
import "../../styles/voiceCloning/AboutVoiceCloning.css";
import 'flag-icons/css/flag-icons.min.css';
import { useNavigate } from "react-router-dom";

const buttonLinks = [
    { path: "/about-voice-cloning", line1: "Learn more about", line2: "Cloning process" },
    { path: "/playground", line1: "Generate audios with your", line2: "Own voices" },
    { path: "/voice-library", line1: "Manage your", line2: "Voices" },
];


const AboutCloningModel = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/playground");
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks} />

            <div className="intro-section mb-2">
                <h1 className="intro-title">XTTS Voice Cloning</h1>
                <p className="intro-description">
                    XTTS enables realistic, expressive, and multilingual voice cloning using only a few seconds of a speaker's audio.
                    It captures the vocal identity and transfers it across languages without requiring transcripts or speaker training.
                </p>
            </div>

            <div className="center-container">
                <button className="bt-button" onClick={handleNavigate}>
                    <span className="text">Try It Now</span>
                </button>
            </div>

            <div className="features-row">
                <div className="feature-card">
                    <div className="icon">🎤</div>
                    <h3 className="title">Few-shot Cloning</h3>
                    <p className="tx-description">
                        XTTS can clone a voice using just 3–10 seconds of audio. No transcription or voice-specific training required.
                        Works instantly and supports noisy samples with robustness.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="icon">🌐</div>
                    <h3 className="title">Cross-lingual Synthesis</h3>
                    <p className="tx-description">
                        A voice recorded in one language can be used to generate speech in another. XTTS decouples speaker identity from language for natural-sounding output.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="icon">⚡</div>
                    <h3 className="title">Fast & Lightweight</h3>
                    <p className="tx-description">
                        Built on a VITS-based encoder-decoder with speaker embeddings, XTTS runs efficiently on CPUs and small GPUs with high quality and low latency.
                    </p>
                </div>
            </div>

            <div className="watermarking-section">
                <div className="text-content">
                    <h2>How XTTS Voice Cloning Works</h2>
                    <p>
                        XTTS (Cross-lingual Text-to-Speech) is an extension of YourTTS, built using Coqui TTS. It combines voice cloning with multilingual synthesis by learning disentangled representations of:
                    </p>
                    <ul>
                        <li><strong>Speaker identity</strong> – Extracted from short audio clips via speaker encoders</li>
                        <li><strong>Linguistic content</strong> – From input text, in any supported language</li>
                        <li><strong>Prosody</strong> – Natural variations in tone, speed, and rhythm</li>
                    </ul>
                    <p>
                        By mapping these into a shared latent space, XTTS can reassemble them into fluent speech — even if the voice and target language never appeared together during training.
                    </p>
                    <p>
                        This makes XTTS ideal for applications like AI dubbing, personalized assistants, multilingual narration, and accessibility.
                    </p>
                </div>

                <div className="image-content">
                    <img src="/voice_cloning.jpg" alt="XTTS architecture diagram" />
                </div>
            </div>

            <div className="center-container mb-3">
                <h2 className="intro-title">Supported Languages</h2>
            </div>

            <div className="center-container mb-3">
                <ul className="flags-list">
                    <li className="flag-item"><span className="fi fi-sa flag-icon"></span> Arabic</li>
                    <li className="flag-item"><span className="fi fi-cn flag-icon"></span> Chinese</li>
                    <li className="flag-item"><span className="fi fi-nl flag-icon"></span> Dutch</li>
                    <li className="flag-item"><span className="fi fi-us flag-icon"></span> English</li>
                    <li className="flag-item"><span className="fi fi-fr flag-icon"></span> French</li>
                    <li className="flag-item"><span className="fi fi-de flag-icon"></span> German</li>
                    <li className="flag-item"><span className="fi fi-in flag-icon"></span> Hindi</li>
                    <li className="flag-item"><span className="fi fi-it flag-icon"></span> Italian</li>
                    <li className="flag-item"><span className="fi fi-jp flag-icon"></span> Japanese</li>
                    <li className="flag-item"><span className="fi fi-kr flag-icon"></span> Korean</li>
                    <li className="flag-item"><span className="fi fi-pl flag-icon"></span> Polish</li>
                    <li className="flag-item"><span className="fi fi-pt flag-icon"></span> Portuguese</li>
                    <li className="flag-item"><span className="fi fi-ru flag-icon"></span> Russian</li>
                    <li className="flag-item"><span className="fi fi-es flag-icon"></span> Spanish</li>
                    <li className="flag-item"><span className="fi fi-tr flag-icon"></span> Turkish</li>
                    <li className="flag-item"><span className="fi fi-vn flag-icon"></span> Vietnamese</li>
                </ul>
            </div>
        </div>
    );
};
export default AboutCloningModel;
