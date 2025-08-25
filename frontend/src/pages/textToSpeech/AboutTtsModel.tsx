import SubNav from "../../components/SubNav.tsx";
import "../../styles/textToSpeech/AboutTtsModel.css";
import 'flag-icons/css/flag-icons.min.css';
import {useNavigate} from "react-router-dom";

const buttonLinks = [
    { path: "/about-tts-models", line1: "Learn more about", line2: "the Models" },
    { path: "/tts", line1: "Try the", line2: "TTS Generator" },
    { path: "/available-speakers", line1: "Explore", line2: "Speakers" },
];

const AboutModel = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/tts");
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks}/>

            <div className="intro-section mb-2">
                <h1 className="intro-title">XTTS: Cross-lingual Text-to-Speech</h1>
                <p className="intro-description">
                    XTTS is a cutting-edge neural text-to-speech model supporting over 15 languages and cross-lingual
                    voice
                    cloning. Built on the foundations of Coqui TTS and YourTTS, it enables users to synthesize
                    expressive and
                    multilingual speech in any supported language using any speaker’s voice.
                </p>
            </div>

            <div className="center-container">
                <button className="bt-button" onClick={handleNavigate}>
                    <span className="text">Try It Now</span>
                </button>
            </div>

            <div className="features-row">
                <div className="feature-card">
                    <div className="icon">🌍</div>
                    <h3 className="title">Multilingual Synthesis</h3>
                    <p className="tx-description">
                        XTTS supports 16+ languages including English, French, Arabic, Spanish, and Chinese. The model
                        is trained
                        on a diverse dataset enabling natural prosody and pronunciation.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="icon">🗣️</div>
                    <h3 className="title">Voice Cloning</h3>
                    <p className="tx-description">
                        Using just a few seconds of audio, XTTS can clone a speaker's voice and synthesize speech in any
                        language
                        while preserving the speaker's identity.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="icon">🧠</div>
                    <h3 className="title">Cross-lingual Transfer</h3>
                    <p className="tx-description">
                        XTTS allows you to use a speaker from one language to generate speech in another, leveraging its
                        robust
                        multilingual encoder-decoder architecture.
                    </p>
                </div>
            </div>

            <div className="watermarking-section">
                <div className="text-content">
                    <h2>Behind the Scenes</h2>
                    <p>
                        XTTS is a deep generative model built using a VITS-like architecture (Variational Inference
                        TTS). It employs
                        an encoder-decoder structure combined with a speaker embedding system and attention mechanism.
                        This enables
                        fine control over prosody and identity across languages.
                    </p>
                    <p>
                        Originally derived from <strong>YourTTS</strong> and <strong>Coqui TTS</strong>, XTTS pushes the
                        boundaries
                        of real-time multilingual TTS, allowing for expressive, controllable synthesis with high
                        fidelity.
                    </p>
                </div>

                <div className="image-content">
                    <img src="/tts.png" alt="XTTS architecture diagram"/>
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

export default AboutModel;