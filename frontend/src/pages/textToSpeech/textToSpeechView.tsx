import {useEffect, useState} from "react";
import SubNav from "../../components/SubNav.tsx";
import {
    fetchSpeakers,
    fetchLanguages,
    generateTTS_XTTS,
    generateTTS_VITS,
    type Language,
    type Speaker, type TTSResponse,
} from "../../api/textToSpeechApi.ts";
import "../../styles/textToSpeech/textToSpeechView.css";
import {toast} from "react-toastify";
import {sanitizeFilename} from "./SpeakersCatalogue.tsx";
import AudioPlayer from "../../components/AudioPlayer.tsx";

const buttonLinks = [
    { path: "/about-tts-models", line1: "Learn more about", line2: "the Models" },
    { path: "/tts", line1: "Try the", line2: "TTS Generator" },
    { path: "/available-speakers", line1: "Explore", line2: "Speakers" },
];

const languageFlags: Record<string, string> = {
    ar: "fi fi-sa",
    zh: "fi fi-cn",
    nl: "fi fi-nl",
    en: "fi fi-us",
    fr: "fi fi-fr",
    de: "fi fi-de",
    hi: "fi fi-in",
    it: "fi fi-it",
    ja: "fi fi-jp",
    ko: "fi fi-kr",
    pl: "fi fi-pl",
    pt: "fi fi-pt",
    ru: "fi fi-ru",
    es: "fi fi-es",
    tr: "fi fi-tr",
    vi: "fi fi-vn",
};

const MAX_TEXT_LENGTH = 2000;

const TTSView = () => {
    const [model, setModel] = useState<"xtts" | "vits">("xtts");
    const [text, setText] = useState("");
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedSpeaker, setSelectedSpeaker] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (model === "xtts") {
            fetchSpeakers().then(setSpeakers);
            fetchLanguages().then(setLanguages);
        } else {
            // For VITS: fixed language & single speaker
            setSelectedLanguage("en");
            setSelectedSpeaker("Alice Wonder");
            setSpeakers([{name: "Alice Wonder", tags: ["female", "old"]}]);
            setLanguages([{code: "en", name: "English"}]);
        }
    }, [model]);

    const handleGenerate = async () => {
        if (!text.trim()) {
            toast.error("Please enter some text before generating.");
            return;
        }
        if (!selectedSpeaker) {
            toast.error("Please choose a speaker before generating.");
            return;
        }

        setLoading(true);
        setAudioUrl(null);

        try {
            let result: TTSResponse;

            if (model === "xtts") {
                result = await generateTTS_XTTS(text, selectedSpeaker, selectedLanguage);
            } else {
                result = await generateTTS_VITS(text);
            }

            const url = `data:audio/wav;base64,${result.audio_base64}`;
            setAudioUrl(url);
        } catch (err) {
            console.error("Error generating TTS:", err);
            toast.error("Error generating audio.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks}/>
            <h1>Text to Speech Generator</h1>
            <div className="special-row">
                <div className="tts-form">
                    {/* LEFT COLUMN */}
                    <div className="tts-left">
                        <label className="form-label">Model</label>
                        <select
                            className="select"
                            value={model}
                            onChange={(e) => setModel(e.target.value as "xtts" | "vits")}
                        >
                            <option value="xtts">XTTS (Multilingual, Multi-speakers, Slow inference)</option>
                            <option value="vits">VITS (English Only, One speaker, Fast inference)</option>
                        </select>

                        <div className="char-counter">
                            Characters: {text.length} / {MAX_TEXT_LENGTH}
                        </div>

                        <textarea
                            className="form-textarea2"
                            placeholder="Enter your text here..."
                            value={text}
                            maxLength={MAX_TEXT_LENGTH}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="tts-right">
                        <label className="form-label">Language</label>
                        <div className="language-selector-container">
                            <select
                                className="select"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                disabled={model === "vits"} // disable for VITS
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>

                            <div className="flag-display">
                                <span className={languageFlags[selectedLanguage] || ""}></span>
                            </div>
                        </div>

                        <label className="form-label">Speakers</label>
                        <div className="speaker-list">
                            {speakers.map((s) => (
                                <div
                                    key={s.name}
                                    className={`speaker-item ${selectedSpeaker === s.name ? "selected" : ""}`}
                                    onClick={() => setSelectedSpeaker(s.name)}
                                >
                                    <div className="speaker-info">
                                        <span className="speaker-name">{s.name}</span>
                                        <div className="speaker-tags">
                                            {s.tags.map(tag => (
                                                <span key={tag} className={`speaker-tag ${tag.toLowerCase()}`}>
            {tag}
        </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="play-btn"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent selecting speaker when clicking play
                                            new Audio(`/voices/${sanitizeFilename(s.name)}.wav`).play();
                                        }}
                                    >
                                        ▶
                                    </button>
                                </div>
                            ))}
                        </div>


                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            <span className="text">{loading ? "Generating..." : "Generate"}</span>
                            <i className="bi bi-magic icon-white-big"></i>
                        </button>
                    </div>
                </div>
                {audioUrl && (
                    <div className="col-12 mt-3">
                        <AudioPlayer src={audioUrl}/>
                    </div>
                )}
            </div>

            <div className="tutorial-container">
                <h2 className="tutorial-title">🚀 Quick Tutorial</h2>

                <div className="tutorial-step">
                    <div className="step-number">1️⃣</div>
                    <div className="step-content">
                        <h3>Choose a Model</h3>
                        <p>We offer two Text-to-Speech (TTS) models:</p>
                        <ul>
                            <li><strong>VITS</strong> – Fast inference, <em>English only</em>, one default voice.</li>
                            <li><strong>XTTS</strong> – Powerful multilingual model with <strong>16
                                languages</strong> and <strong>50+ voices</strong>, slower but more versatile.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">2️⃣</div>
                    <div className="step-content">
                        <h3>Enter Your Text</h3>
                        <p>Type or paste your text to convert into speech.</p>
                        <p className="note">Free limit: <strong>2,000 characters</strong> per request.</p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">3️⃣</div>
                    <div className="step-content">
                        <h3>Select Language & Voice (XTTS Only)</h3>
                        <p>Pick your preferred language and voice style.</p>
                        <p className="note">For VITS, language is fixed to English and the voice is preset.</p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">4️⃣</div>
                    <div className="step-content">
                        <h3>Convert to Speech</h3>
                        <p>Click the <strong>"Generate"</strong> button. Longer texts may take a few minutes to process.
                        </p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">5️⃣</div>
                    <div className="step-content">
                        <h3>Listen or Download</h3>
                        <p>Once ready, listen to your audio online or download the <code>.wav</code> file.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TTSView;
