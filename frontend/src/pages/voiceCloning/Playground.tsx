import SubNav from "../../components/SubNav.tsx";
import "../../styles/voiceCloning/PlayGround.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
    fetchLanguages,
    type Language,
} from "../../api/textToSpeechApi.ts";
import {
    getVoices,
    listVoiceFiles,
    synthesizeClone, VOICE_CLONING_API,
} from "../../api/voiceCloningApi.ts";
import AudioPlayer from "../../components/AudioPlayer.tsx";

const buttonLinks = [
    { path: "/about-voice-cloning", line1: "Learn more about", line2: "Cloning process" },
    { path: "/playground", line1: "Generate audios with your", line2: "Own voices" },
    { path: "/voice-library", line1: "Manage your", line2: "Voices" },
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

const Playground = () => {
    const [text, setText] = useState("");
    const [voices, setVoices] = useState<string[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [expandedVoice, setExpandedVoice] = useState<string | null>(null);
    const [voiceFiles, setVoiceFiles] = useState<{ [voice: string]: string[] }>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLanguages().then(setLanguages);
        getVoices().then(setVoices);
    }, []);

    useEffect(() => {
        if (voices.length === 0) return;

        voices.forEach(async (voice) => {
            const files = await listVoiceFiles(voice);
            setVoiceFiles((prev) => ({ ...prev, [voice]: files }));
        });
    }, [voices]);

    const toggleVoice = async (voice: string) => {
        if (expandedVoice === voice) {
            setExpandedVoice(null);
            return;
        }
        setExpandedVoice(voice);
        if (!voiceFiles[voice]) {
            try {
                const files = await listVoiceFiles(voice);
                setVoiceFiles((prev) => ({ ...prev, [voice]: files }));
            } catch {
                toast.error("Failed to load voice files.");
            }
        }
    };

    const handleFileCheck = async (voice: string, filename: string, checked: boolean) => {
        try {
            const response = await fetch(`${VOICE_CLONING_API}/voices/${voice}/${filename}`);

            if (!response.ok) {
                toast.error(`Failed to load file: ${filename}`);
                return;
            }

            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("audio/wav")) {
                toast.error(`Invalid file type received for ${filename}`);
                return;
            }

            const blob = await response.blob();
            const file = new File([blob], filename, { type: blob.type });

            setSelectedFiles((prev) =>
                checked ? [...prev, file] : prev.filter((f) => f.name !== filename)
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(`Error loading file: ${filename}`);
        }
    };

    const handleGenerate = async () => {
        if (!text.trim()) {
            toast.error("Please enter some text before generating.");
            return;
        }
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one file.");
            return;
        }

        setLoading(true);
        setAudioUrl(null);

        try {
            const result = await synthesizeClone(text, selectedLanguage, selectedFiles);
            const url = `data:audio/wav;base64,${result.audio_base64}`;
            setAudioUrl(url);
        } catch (err) {
            console.error("Error Cloning:", err);
            toast.error("Error generating audio.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks} />
            <h1>Text to Speech Generator</h1>
            <div className="special-row">
                <div className="tts-form">
                    {/* LEFT COLUMN */}
                    <div className="tts-left">
                        <div className="char-counter">
                            Characters: {text.length} / {MAX_TEXT_LENGTH}
                        </div>
                        <textarea
                            className="form-textarea"
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

                        <label className="form-label">Voices</label>
                        <div className="voice-list scrollable">
                            {voices.map((voice) => (
                                <div key={voice} className="voice-item">
                                    <div className="voice-header">
                                        <span>{voice}</span>
                                        <button
                                            className={`button-toggle ${expandedVoice === voice ? "expanded" : ""}`}
                                            onClick={() => toggleVoice(voice)}
                                        >
                                            <i className="bi bi-toggles"></i>
                                            {expandedVoice === voice ? " Hide" : " Show"}
                                        </button>
                                    </div>
                                    {expandedVoice === voice && (
                                        <div className="file-list mt-2">
                                            {voiceFiles[voice]?.length > 0 ? (
                                                voiceFiles[voice].map((file) => (
                                                    <div key={file} className="file-item">
                                                        <label className="checkbox-container">
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => handleFileCheck(voice, file, e.target.checked)}
                                                            />
                                                            <div className="checkmark"></div>
                                                        </label>
                                                        <span className="audio-file-name">{file}</span>
                                                        <button
                                                            className="play-btn"
                                                            onClick={() => {
                                                                new Audio(`${VOICE_CLONING_API}/voices/${voice}/${file}`).play(); //voice_cloning/voices/
                                                            }}
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No files found.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            className="generate-btn mt-3"
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
                        <AudioPlayer src={audioUrl} />
                    </div>
                )}
            </div>

            <div className="tutorial-container">
                <h2 className="tutorial-title">🚀 Quick Start Guide</h2>

                <div className="tutorial-step">
                    <div className="step-number">1️⃣</div>
                    <div className="step-content">
                        <h3>Enter Your Text</h3>
                        <p>Type or paste the text you want to convert into speech.</p>
                        <p className="note">
                            Free limit: <strong>2,000 characters</strong> per request.
                        </p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">2️⃣</div>
                    <div className="step-content">
                        <h3>Select a Language</h3>
                        <p>Choose your preferred language for speech generation.</p>
                        <p className="note">The cloning process supports cross-lingual input.</p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">3️⃣</div>
                    <div className="step-content">
                        <h3>Choose a Voice</h3>
                        <p>Select one or more audio samples to guide the voice cloning process.</p>
                        <p className="note">
                            Manage your voices{" "}
                            <a href="/voice-library" target="_blank" rel="noopener noreferrer">
                                here
                            </a>
                            .
                        </p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">4️⃣</div>
                    <div className="step-content">
                        <h3>Generate Speech</h3>
                        <p>
                            Click the <strong>"Generate"</strong> button. Processing may take a few moments for longer
                            texts.
                        </p>
                    </div>
                </div>

                <div className="tutorial-step">
                    <div className="step-number">5️⃣</div>
                    <div className="step-content">
                        <h3>Listen or Download</h3>
                        <p>
                            Once the audio is ready, you can listen to it online or download the <code>.wav</code> file.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;
